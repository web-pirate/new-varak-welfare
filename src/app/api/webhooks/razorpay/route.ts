import { NextRequest, NextResponse } from "next/server";
import type { SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { completeDonation, hmacSha256, safeEqual } from "@/lib/payments";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Razorpay signs webhooks with the secret set on the webhook in its dashboard (not the API key secret)
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("Razorpay webhook: RAZORPAY_WEBHOOK_SECRET is not set, cannot verify payments");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }
    const expectedSignature = hmacSha256(secret, body);

    if (!safeEqual(expectedSignature, signature)) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    const { event: eventType, payload } = event;

    if (eventType === "payment.captured") {
      const payment = payload.payment.entity;

      await completeDonation(payment.order_id, payment.id);
    }

    if (eventType === "payment.failed") {
      const payment = payload.payment.entity;

      await prisma.donation.updateMany({
        // PENDING only: a late failure event must not undo a completed donation
        where: { gatewayOrderId: payment.order_id, status: "PENDING" },
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
    console.error("Razorpay webhook error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
