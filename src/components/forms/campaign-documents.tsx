"use client";

import { useRouter } from "next/navigation";
import { addCampaignDocuments, removeCampaignDocument } from "@/server/actions/campaign";
import { DocumentUpload, type DocItem } from "@/components/forms/document-upload";

// Documents on an existing campaign are saved as soon as they are added or removed.
export function CampaignDocuments({ campaignId, docs, disabled = false }: { campaignId: string; docs: DocItem[]; disabled?: boolean }) {
  const router = useRouter();
  return (
    <DocumentUpload
      value={docs}
      disabled={disabled}
      onAdd={async (items) => {
        const fd = new FormData();
        fd.append("documents", JSON.stringify(items.map(({ url, fileName, type }) => ({ url, fileName, type }))));
        const result = await addCampaignDocuments(campaignId, fd);
        router.refresh();
        return result.ok ? undefined : result.error;
      }}
      onRemove={async (item) => {
        if (!item.id) return;
        const result = await removeCampaignDocument(campaignId, item.id);
        router.refresh();
        return result.ok ? undefined : result.error;
      }}
    />
  );
}
