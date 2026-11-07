import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DonationStamp } from "@/components/campaigns/donation-stamp";
import { DonorBadges } from "@/components/dashboard/donor-badges";
import { getDonorBadges } from "@/server/queries/donor-badges";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatCurrency } from "@/lib/utils";
import { Heart, IndianRupee, Calendar, TrendingUp } from "lucide-react";

export default async function DonorDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!user) redirect("/sign-in");

  const [donationStats, recentDonations, subscriptions, badges] = await Promise.all([
    prisma.donation.aggregate({
      where: { donorId: user.id, status: "COMPLETED" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.donation.findMany({
      where: { donorId: user.id, status: "COMPLETED" },
      include: {
        campaign: { select: { title: true, slug: true, beneficiaryName: true, beneficiaryImage: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.subscription.count({
      where: { userId: user.id, status: "ACTIVE" },
    }),
    getDonorBadges(user.id),
  ]);

  const totalDonated = donationStats._sum.amount?.toNumber() || 0;

  return (
    <div>
      <h1 className="font-heading text-2xl md:text-3xl mb-6">
        Donor Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Donated"
          value={formatCurrency(totalDonated)}
          icon={IndianRupee}
        />
        <StatCard
          title="Donations Made"
          value={donationStats._count}
          icon={Heart}
        />
        <StatCard
          title="Active Subscriptions"
          value={subscriptions}
          icon={Calendar}
        />
        <StatCard
          title="Impact Score"
          value={donationStats._count * 10}
          description="Points earned"
          icon={TrendingUp}
        />
      </div>

      {recentDonations.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-border/50 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl">Your stamps</h2>
            <Link href="/dashboard/donor/past-donations" className="text-sm text-varak-primary hover:underline">
              See all
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-3">
            {recentDonations.slice(0, 6).map((d) => (
              <Link key={d.id} href={`/campaigns/${d.campaign.slug}`} className="block w-40 shrink-0 transition-transform hover:-translate-y-1">
                <DonationStamp
                  amount={Number(d.amount)}
                  date={d.createdAt}
                  beneficiaryName={d.campaign.beneficiaryName}
                  image={d.campaign.beneficiaryImage}
                />
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">One stamp for every donation you complete.</p>
        </div>
      )}

      <DonorBadges earned={badges} />

      <div className="bg-white rounded-2xl p-6 border border-border/50">
        <h2 className="font-heading text-xl mb-4">Recent Donations</h2>
        {recentDonations.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            You haven&apos;t made any donations yet. Browse campaigns to start helping!
          </p>
        ) : (
          <div className="space-y-3">
            {recentDonations.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
              >
                <div>
                  <p className="text-sm font-medium">{d.campaign.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(d.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <span className="font-semibold text-varak-primary">
                  {formatCurrency(d.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
