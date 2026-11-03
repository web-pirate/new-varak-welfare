import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { verifySubscriptionSchema } from "@/lib/validations/subscription";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/server/actions/sync-user";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const parsed = verifySubscriptionSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = parsed.data;

    // Subscriptions sign "payment_id|subscription_id" (orders sign it the other way round)
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(razorpay_signature);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const user = await syncUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const remote = await rzp.subscriptions.fetch(razorpay_subscription_id);
    const notes = (remote.notes ?? {}) as Record<string, string>;
    if (notes.userId !== user.id || !notes.planId) {
      return NextResponse.json({ error: "Subscription does not belong to you" }, { status: 403 });
    }

    const nextBillingDate = remote.charge_at
      ? new Date(Number(remote.charge_at) * 1000)
      : null;

    // upsert: the webhook may have created this row first
    const subscription = await prisma.subscription.upsert({
      where: { gatewaySubscriptionId: razorpay_subscription_id },
      create: {
        gatewaySubscriptionId: razorpay_subscription_id,
        paymentGateway: "RAZORPAY",
        status: "ACTIVE",
        nextBillingDate,
        planId: notes.planId,
        userId: user.id,
      },
      update: { status: "ACTIVE", nextBillingDate },
      select: { id: true },
    });

    return NextResponse.json({ success: true, subscriptionId: subscription.id });
  } catch (error) {
    console.error("Verify subscription error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: "Subscription verification failed" },
      { status: 500 }
    );
  }
}
