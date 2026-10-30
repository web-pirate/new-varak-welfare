import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { completeDonation, hmacSha256, safeEqual } from "@/lib/payments";

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1).max(100),
  razorpay_payment_id: z.string().min(1).max(100),
  razorpay_signature: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = verifySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

    const expected = hmacSha256(
      process.env.RAZORPAY_KEY_SECRET!,
      `${razorpay_order_id}|${razorpay_payment_id}`
    );
    if (!safeEqual(expected, razorpay_signature)) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    const donationId = await completeDonation(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    if (!donationId) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, donationId });
  } catch (error) {
    console.error("Verify payment error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
