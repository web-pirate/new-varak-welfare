import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";
import { donationSchema } from "@/lib/validations/donation";
import { prisma } from "@/lib/prisma";

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = donationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }
    const validated = parsed.data;

    const { userId } = await auth();

    // Verify campaign exists and is approved
    const campaign = await prisma.campaign.findUnique({
      where: { id: validated.campaignId },
      select: { id: true, title: true, status: true },
    });

    if (!campaign || campaign.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Campaign not found or not accepting donations" },
        { status: 400 }
      );
    }

    const totalAmount = validated.amount + validated.tipAmount;

    // Create Razorpay order
    const order = await getRazorpay().orders.create({
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: `donation_${Date.now()}`,
      notes: {
        campaignId: validated.campaignId,
        campaignTitle: campaign.title,
        donorName: validated.donorName || "Anonymous",
        isAnonymous: validated.isAnonymous.toString(),
      },
    });

    // Find user in our DB if authenticated
    let donorId: string | null = null;
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { id: true },
      });
      donorId = user?.id || null;
    }

    // Create pending donation record
    await prisma.donation.create({
      data: {
        amount: validated.amount,
        tipAmount: validated.tipAmount,
        totalAmount,
        donorName: validated.donorName,
        donorEmail: validated.donorEmail,
        donorPhone: validated.donorPhone,
        isAnonymous: validated.isAnonymous,
        panNumber: validated.panNumber || null,
        paymentGateway: "RAZORPAY",
        gatewayOrderId: order.id,
        status: "PENDING",
        campaignId: validated.campaignId,
        donorId,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
