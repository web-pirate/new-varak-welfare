import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { subscriptionSchema } from "@/lib/validations/subscription";
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/server/actions/sync-user";

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

// shortcut: 10 years of monthly billing, raise or make configurable if donors ask for longer
const TOTAL_MONTHS = 120;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const parsed = subscriptionSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid amount" },
        { status: 400 }
      );
    }
    const { amount } = parsed.data;

    const user = await syncUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // One reusable plan row per amount in our DB
    const plan =
      (await prisma.subscriptionPlan.findFirst({
        where: { amount, interval: "MONTHLY", isActive: true },
        select: { id: true },
      })) ??
      (await prisma.subscriptionPlan.create({
        data: { name: `Monthly gift of ₹${amount}`, amount, interval: "MONTHLY" },
        select: { id: true },
      }));

    const razorpay = getRazorpay();
    // shortcut: a Razorpay plan per signup, dedupe by storing the plan id if volume grows
    const rzpPlan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: `Monthly gift of ₹${amount}`,
        amount: amount * 100, // paise
        currency: "INR",
      },
    });

    // userId and planId live in notes so verify can trust Razorpay, not the browser
    const subscription = await razorpay.subscriptions.create({
      plan_id: rzpPlan.id,
      total_count: TOTAL_MONTHS,
      customer_notify: 1,
      notes: { userId: user.id, planId: plan.id },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create subscription error:", error);
    return NextResponse.json(
      { error: "Failed to start monthly giving" },
      { status: 500 }
    );
  }
}
