import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink, Info } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCancerTypes, getStates } from "@/server/queries/campaigns";
import { canPostUpdate, editableFields } from "@/lib/campaign-edit";
import { DOCUMENT_TYPES, type DocumentKind } from "@/lib/upload";
import { timeAgo } from "@/lib/utils";
import { CampaignEditForm } from "@/components/forms/campaign-edit-form";
import { CampaignUpdateForm } from "@/components/forms/campaign-update-form";
import { CampaignDocuments } from "@/components/forms/campaign-documents";

export const metadata: Metadata = { title: "Edit campaign" };

// Campaign documents use four types in the UI; the database enum has more (KYC and NGO types)
const docKind = (t: string): DocumentKind => ((DOCUMENT_TYPES as readonly string[]).includes(t) ? (t as DocumentKind) : "OTHER");

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const { id } = await params;

  // Owner only: anyone else gets a 404, not a hint that the campaign exists
  const campaign = await prisma.campaign.findFirst({
    where: { id, createdBy: { clerkId: userId } },
    include: {
      updates: { orderBy: { createdAt: "desc" }, take: 5 },
      images: { orderBy: { position: "asc" } },
      documents: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!campaign) notFound();

  const [cancerTypes, states] = await Promise.all([getCancerTypes(), getStates()]);
  const editable = [...editableFields(campaign.status)];

  const note =
    campaign.status === "APPROVED"
      ? "Your campaign is live, so the goal, patient, cancer type and hospital are locked to keep donors' trust. You can update the story and end date, and post progress updates. To change a locked detail, contact support."
      : campaign.status === "REJECTED"
        ? `Your campaign was rejected${campaign.rejectionReason ? `: ${campaign.rejectionReason}` : "."} Fix the details and save: it goes back to review automatically.`
        : campaign.status === "PENDING_REVIEW"
          ? "Your campaign is waiting for review. You can change anything until it is approved."
          : campaign.status === "COMPLETED"
            ? "This campaign is completed, so its details can't be changed. You can still post updates for your donors."
            : "This campaign can't be edited right now. Contact support if you need help.";

  return (
    <div className="max-w-3xl">
      <Link href="/dashboard/fundraiser/campaigns" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        My campaigns
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl md:text-3xl">Edit campaign</h1>
        <a href={`/campaigns/${campaign.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-varak-primary hover:underline">
          <ExternalLink className="h-3.5 w-3.5" />
          View public page
        </a>
      </div>

      <div className="mb-6 flex gap-3 border border-border/50 bg-white p-4 text-sm leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-varak-primary" aria-hidden="true" />
        <p>{note}</p>
      </div>

      {editable.length > 0 && (
        <section className="mb-8 border border-border/50 bg-white p-6 md:p-8">
          <CampaignEditForm
            campaign={{
              id: campaign.id,
              title: campaign.title,
              story: campaign.story,
              goalAmount: campaign.goalAmount.toString(),
              beneficiaryName: campaign.beneficiaryName,
              beneficiaryRelation: campaign.beneficiaryRelation ?? "",
              beneficiaryAge: campaign.beneficiaryAge?.toString() ?? "",
              // Campaigns made before multi-photo support only have the single cover photo
              images: campaign.images.length ? campaign.images.map((i) => i.url) : campaign.beneficiaryImage ? [campaign.beneficiaryImage] : [],
              cancerTypeId: campaign.cancerTypeId ?? "",
              hospitalName: campaign.hospitalName ?? "",
              hospitalCity: campaign.hospitalCity ?? "",
              stateId: campaign.stateId ?? "",
              endDate: campaign.endDate ? campaign.endDate.toISOString().slice(0, 10) : "",
            }}
            status={campaign.status}
            editable={editable}
            cancerTypes={cancerTypes.map((c) => ({ id: c.id, name: c.name }))}
            states={states.map((s) => ({ id: s.id, name: s.name }))}
          />
        </section>
      )}

      {editable.length > 0 && (
        <section className="mb-8 border border-border/50 bg-white p-6 md:p-8">
          <h2 className="mb-4 font-heading text-xl">Documents</h2>
          <CampaignDocuments
            campaignId={campaign.id}
            docs={campaign.documents.map((d) => ({ id: d.id, url: d.url, fileName: d.fileName ?? d.type, type: docKind(d.type), verified: d.verified }))}
          />
        </section>
      )}

      {canPostUpdate(campaign.status) && (
        <section className="border border-border/50 bg-white p-6 md:p-8">
          <h2 className="mb-4 font-heading text-xl">Post a progress update</h2>
          <CampaignUpdateForm campaignId={campaign.id} />
          {campaign.updates.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="mb-3 text-sm font-semibold">Recent updates</h3>
              <ul className="space-y-4">
                {campaign.updates.map((u) => (
                  <li key={u.id} className="text-sm">
                    <p className="whitespace-pre-line">{u.content}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{timeAgo(u.createdAt)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
