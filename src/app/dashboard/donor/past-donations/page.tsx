import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { DonationStamp } from "@/components/campaigns/donation-stamp";
import { Badge } from "@/components/ui/badge";

export default async function DonorPastDonationsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!user) redirect("/sign-in");

  const donations = await prisma.donation.findMany({
    where: { donorId: user.id },
    include: {
      campaign: { select: { title: true, slug: true, beneficiaryName: true, beneficiaryImage: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalDonated = donations
    .filter((d) => d.status === "COMPLETED")
    .reduce((sum, d) => sum + Number(d.amount), 0);

  const statusColor: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    FAILED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-100 text-gray-800",
  };

  return (
    <div>
      <h1 className="font-heading text-2xl md:text-3xl mb-2">My Donations</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Total donated: {formatCurrency(totalDonated)} across{" "}
        {donations.filter((d) => d.status === "COMPLETED").length} donations
      </p>

      {donations.some((d) => d.status === "COMPLETED") && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {donations
            .filter((d) => d.status === "COMPLETED")
            .map((d) => (
              <Link key={d.id} href={`/campaigns/${d.campaign.slug}`} className="block transition-transform hover:-translate-y-1">
                <DonationStamp
                  amount={Number(d.amount)}
                  date={d.createdAt}
                  beneficiaryName={d.campaign.beneficiaryName}
                  image={d.campaign.beneficiaryImage}
                />
              </Link>
            ))}
        </div>
      )}

      {donations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-border/50 text-center">
          <p className="text-muted-foreground mb-4">
            You haven&apos;t made any donations yet.
          </p>
          <a
            href="/campaigns"
            className="text-varak-primary hover:underline font-medium"
          >
            Browse campaigns to donate
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 font-medium">Campaign</th>
                  <th className="text-right p-4 font-medium">Amount</th>
                  <th className="text-center p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-b last:border-0">
                    <td className="p-4">
                      <a
                        href={`/campaigns/${d.campaign.slug}`}
                        className="text-varak-primary hover:underline font-medium"
                      >
                        {d.campaign.title}
                      </a>
                      <p className="text-xs text-muted-foreground">
                        for {d.campaign.beneficiaryName}
                      </p>
                    </td>
                    <td className="p-4 text-right font-semibold text-varak-primary">
                      {formatCurrency(d.amount)}
                    </td>
                    <td className="p-4 text-center">
                      <Badge
                        className={statusColor[d.status] || "bg-gray-100"}
                      >
                        {d.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right text-muted-foreground">
                      {timeAgo(d.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
