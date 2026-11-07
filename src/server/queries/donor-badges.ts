import { prisma } from "@/lib/prisma";
import { earnedBadges } from "@/lib/donor-badges";

export async function getDonorBadges(userId: string) {
  const mine = await prisma.donation.findMany({
    where: { donorId: userId, status: "COMPLETED" },
    select: {
      id: true,
      campaignId: true,
      amount: true,
      createdAt: true,
      isAnonymous: true,
      campaign: { select: { createdAt: true, goalAmount: true, cancerTypeId: true, stateId: true, beneficiaryAge: true } },
    },
  });
  const campaignIds = [...new Set(mine.map((d) => d.campaignId))];

  const [everyone, subscriptions, commentCount, firstHundred] = await Promise.all([
    campaignIds.length
      ? prisma.donation.findMany({
          where: { campaignId: { in: campaignIds }, status: "COMPLETED" },
          select: { id: true, campaignId: true, amount: true, createdAt: true },
          orderBy: { createdAt: "asc" },
        })
      : [],
    prisma.subscription.findMany({ where: { userId }, select: { createdAt: true, cancelledAt: true } }),
    prisma.comment.count({ where: { authorId: userId } }),
    prisma.donation.groupBy({
      by: ["donorId"],
      where: { status: "COMPLETED", donorId: { not: null } },
      _min: { createdAt: true },
      orderBy: { _min: { createdAt: "asc" } },
      take: 100,
    }),
  ]);

  const campaigns: Parameters<typeof earnedBadges>[0]["campaigns"] = {};
  for (const d of mine) campaigns[d.campaignId] = { ...d.campaign, goalAmount: Number(d.campaign.goalAmount) };

  const campaignDonations: Parameters<typeof earnedBadges>[0]["campaignDonations"] = {};
  for (const g of everyone) (campaignDonations[g.campaignId] ??= []).push({ id: g.id, amount: Number(g.amount), createdAt: g.createdAt });

  const now = Date.now();
  const subscriptionMonths = subscriptions.reduce(
    (sum, s) => sum + Math.floor(((s.cancelledAt?.getTime() ?? now) - s.createdAt.getTime()) / (30 * 24 * 60 * 60 * 1000)),
    0,
  );

  return earnedBadges({
    donations: mine.map((d) => ({ id: d.id, campaignId: d.campaignId, amount: Number(d.amount), createdAt: d.createdAt, isAnonymous: d.isAnonymous })),
    campaigns,
    campaignDonations,
    subscriptionMonths,
    commentCount,
    isFoundingDonor: firstHundred.some((f) => f.donorId === userId),
  });
}
