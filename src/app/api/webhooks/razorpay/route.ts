import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import type { SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    const { event: eventType, payload } = event;

    if (eventType === "payment.captured") {
      const payment = payload.payment.entity;

      await prisma.donation.updateMany({
        where: { gatewayOrderId: payment.order_id },
        data: {
          gatewayPaymentId: payment.id,
          status: "COMPLETED",
        },
      });
    }

    if (eventType === "payment.failed") {
      const payment = payload.payment.entity;

      await prisma.donation.updateMany({
        where: { gatewayOrderId: payment.order_id },
        data: {
          status: "FAILED",
        },
      });
    }

    // Recurring monthly gifts: keep our Subscription row in step with Razorpay
    if (typeof eventType === "string" && eventType.startsWith("subscription.")) {
      const sub = payload.subscription.entity;
      const status: SubscriptionStatus | null =
        ({
          "subscription.activated": "ACTIVE",
          "subscription.charged": "ACTIVE",
          "subscription.resumed": "ACTIVE",
          "subscription.paused": "PAUSED",
          "subscription.halted": "PAUSED",
          "subscription.cancelled": "CANCELLED",
          "subscription.completed": "EXPIRED",
        } as Record<string, SubscriptionStatus>)[eventType] ?? null;

      if (status) {
        await prisma.subscription.updateMany({
          where: { gatewaySubscriptionId: sub.id },
          data: {
            status,
            nextBillingDate: sub.charge_at ? new Date(sub.charge_at * 1000) : null,
            cancelledAt: status === "CANCELLED" ? new Date() : null,
          },
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
