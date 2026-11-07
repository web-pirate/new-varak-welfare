import { prisma } from "@/lib/prisma";

export { hmacSha256, safeEqual } from "./signature";

/**
 * Marks a donation paid and credits the campaign exactly once. The conditional
 * updateMany is atomic, so the browser callback and the webhook can race and
 * only one of them credits. FAILED is allowed because Razorpay lets a donor
 * retry payment on the same order. Returns the donation id, or null if unknown.
 */
export async function completeDonation(
  orderId: string,
  paymentId: string,
  signature?: string
) {
  return prisma.$transaction(async (tx) => {
    const donation = await tx.donation.findFirst({
      where: { gatewayOrderId: orderId },
      select: { id: true, campaignId: true, amount: true },
    });
    if (!donation) return null;

    const { count } = await tx.donation.updateMany({
      where: { id: donation.id, status: { in: ["PENDING", "FAILED"] } },
      data: {
        status: "COMPLETED",
        gatewayPaymentId: paymentId,
        ...(signature && { gatewaySignature: signature }),
      },
    });

    if (count === 1) {
      await tx.campaign.update({
        where: { id: donation.campaignId },
        data: {
          amountRaised: { increment: donation.amount },
          donorCount: { increment: 1 },
        },
      });
    }
    return donation.id;
  });
}
