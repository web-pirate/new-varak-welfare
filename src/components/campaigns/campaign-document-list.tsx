"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DocumentViewer, type ViewDoc } from "@/components/forms/document-viewer";
import { isPdfUrl } from "@/lib/upload";

// The Documents tab on the public campaign page: a preview per file, opening a popup with arrows between them.
export function CampaignDocumentList({ docs }: { docs: ViewDoc[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <ul className="space-y-2">
        {docs.map((doc, i) => (
          <li key={`${doc.url}-${i}`}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="flex w-full items-center gap-3 bg-muted/50 p-3 text-left transition-colors hover:bg-muted"
              aria-label={`Preview ${doc.fileName}`}
            >
              {isPdfUrl(doc.url) ? (
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center border bg-white">
                  <FileText className="h-6 w-6 text-varak-primary" aria-hidden="true" />
                </span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={doc.url} alt="" className="h-12 w-12 flex-shrink-0 border object-cover" />
              )}
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{doc.fileName}</span>
              {doc.verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </button>
          </li>
        ))}
      </ul>
      {open !== null && <DocumentViewer docs={docs} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}
