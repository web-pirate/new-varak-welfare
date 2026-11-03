import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, calculateProgress, timeAgo } from "@/lib/utils";
import { Plus, Eye, Users, ExternalLink, Pencil } from "lucide-react";
import { canPostUpdate, editableFields } from "@/lib/campaign-edit";

export default async function FundraiserCampaignsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!user) redirect("/sign-in");

  const campaigns = await prisma.campaign.findMany({
    where: { createdById: user.id },
    include: {
      cancerType: true,
      _count: { select: { donations: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusColor: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    PENDING_REVIEW: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    SUSPENDED: "bg-orange-100 text-orange-800",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl md:text-3xl">My Campaigns</h1>
        <Link href="/start-fundraiser">
          <Button className="bg-varak-primary hover:bg-varak-primary-dark text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-border/50 text-center">
          <p className="text-muted-foreground mb-4">
            You haven&apos;t created any campaigns yet.
          </p>
          <Link href="/start-fundraiser">
            <Button className="bg-varak-primary hover:bg-varak-primary-dark text-white">
              Start Your First Campaign
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const progress = calculateProgress(
              campaign.amountRaised,
              campaign.goalAmount
            );
            return (
              <div
                key={campaign.id}
                className="bg-white rounded-none p-5 border border-border/50"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-base truncate">
                        {campaign.title}
                      </h3>
                      <Badge
                        className={
                          statusColor[campaign.status] || "bg-gray-100"
                        }
                      >
                        {campaign.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {campaign.cancerType && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {campaign.cancerType.name}
                      </p>
                    )}
                    <div className="max-w-md">
                      <Progress value={progress} className="h-2 mb-1" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {formatCurrency(campaign.amountRaised)} of{" "}
                          {formatCurrency(campaign.goalAmount)}
                        </span>
                        <span>{progress}%</span>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {campaign.donorCount} donors
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {campaign.viewCount} views
                      </span>
                      <span>{timeAgo(campaign.createdAt)}</span>
                    </div>
                    {campaign.rejectionReason && (
                      <p className="text-sm text-red-600 mt-2">
                        Rejected: {campaign.rejectionReason}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    {(editableFields(campaign.status).length > 0 || canPostUpdate(campaign.status)) && (
                      <Link
                        href={`/dashboard/fundraiser/campaigns/${campaign.id}/edit`}
                        className="text-xs text-varak-primary hover:underline flex items-center gap-1"
                      >
                        <Pencil className="h-3 w-3" />
                        {editableFields(campaign.status).length > 0 ? "Edit" : "Post update"}
                      </Link>
                    )}
                    <a
                      href={`/campaigns/${campaign.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-varak-primary hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
