"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DOCUMENT_LABELS, isPdfUrl, type DocumentKind } from "@/lib/upload";

export type ViewDoc = { url: string; fileName: string; type?: string; verified?: boolean };

// A popup preview for documents (images and PDFs) with arrows, or the left and right keys, to move between them.
export function DocumentViewer({ docs, index, onIndex, onClose }: { docs: ViewDoc[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const doc = docs[index];
  const go = (to: number) => to >= 0 && to < docs.length && onIndex(to);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, docs.length]);

  if (!doc) return null;
  const arrow = "absolute top-1/2 z-10 h-11 w-11 -translate-y-1/2 rounded-full bg-white/95 p-0 shadow-md hover:bg-white";
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="gap-0 overflow-hidden rounded-none p-0 sm:max-w-4xl">
        <div className="border-b px-6 py-4 pr-12">
          <DialogTitle className="truncate font-heading text-lg">{doc.fileName}</DialogTitle>
          <DialogDescription className="mt-1 text-sm">
            {index + 1} of {docs.length}
            {doc.type && ` · ${DOCUMENT_LABELS[doc.type as DocumentKind] ?? doc.type}`}
            {doc.verified && " · Verified"}
          </DialogDescription>
        </div>

        <div className="relative bg-muted/40">
          {index > 0 && (
            <Button type="button" variant="outline" className={`${arrow} left-3`} aria-label="Previous document" onClick={() => go(index - 1)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          {index < docs.length - 1 && (
            <Button type="button" variant="outline" className={`${arrow} right-3`} aria-label="Next document" onClick={() => go(index + 1)}>
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
          <div className="flex h-[70vh] items-center justify-center">
            {isPdfUrl(doc.url) ? (
              <iframe key={doc.url} src={doc.url} title={doc.fileName} className="h-full w-full bg-white" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={doc.url} src={doc.url} alt={doc.fileName} className="max-h-full max-w-full object-contain" />
            )}
          </div>
        </div>

        <div className="flex justify-end border-t px-6 py-3">
          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-varak-primary hover:underline">
            <ExternalLink className="h-4 w-4" />
            Open in a new tab
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
