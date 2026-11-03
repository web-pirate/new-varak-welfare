"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Paperclip, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DOCUMENT_LABELS as LABELS, DOCUMENT_TYPES, IMAGE_TYPES, MAX_DOCUMENTS, MAX_UPLOAD_BYTES, isPdfUrl, type DocumentKind } from "@/lib/upload";
import { DocumentViewer } from "@/components/forms/document-viewer";
import { shrinkImage, uploadFile } from "@/components/forms/shrink-image";

export type DocItem = { id?: string; url: string; fileName: string; type: DocumentKind; verified?: boolean };

const ACCEPT = ["application/pdf", ...IMAGE_TYPES];
const select = "h-8 border border-input bg-background px-2 text-sm rounded-none";

// Several documents at once. The parent decides what "add" and "remove" mean: the creation wizard keeps them in memory,
// the edit page saves them straight away. A message returned by a callback is shown as the error.
export function DocumentUpload({
  value,
  onAdd,
  onRemove,
  onTypeChange,
  disabled = false,
}: {
  value: DocItem[];
  onAdd: (items: DocItem[]) => Promise<string | void> | string | void;
  onRemove: (item: DocItem, index: number) => Promise<string | void> | string | void;
  onTypeChange?: (index: number, type: DocumentKind) => void;
  disabled?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newType, setNewType] = useState<DocumentKind>("MEDICAL_REPORT");
  const [viewing, setViewing] = useState<number | null>(null);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setError(null);
    const room = MAX_DOCUMENTS - value.length;
    if (room <= 0) return setError(`You can add up to ${MAX_DOCUMENTS} documents`);
    const problems: string[] = [];
    if (files.length > room) problems.push(`Only ${room} more fit, the rest were skipped`);

    setBusy(true);
    const added: DocItem[] = [];
    for (const file of files.slice(0, room)) {
      if (!ACCEPT.includes(file.type)) {
        problems.push(`${file.name}: please choose a PDF, JPG, PNG or WebP file`);
        continue;
      }
      const blob = file.type === "application/pdf" ? file : await shrinkImage(file);
      if (blob.size > MAX_UPLOAD_BYTES) {
        problems.push(`${file.name} is larger than 4 MB`);
        continue;
      }
      const result = await uploadFile(blob, file.name, "document");
      if ("error" in result) problems.push(`${file.name}: ${result.error}`);
      else added.push({ url: result.url, fileName: result.name, type: newType });
    }
    if (added.length) {
      const message = await onAdd(added);
      if (message) problems.push(message);
    }
    setBusy(false);
    if (problems.length) setError(problems.join(". "));
  }

  async function remove(item: DocItem, index: number) {
    setError(null);
    const message = await onRemove(item, index);
    if (message) setError(message);
  }

  return (
    <div className="mt-1">
      {value.length > 0 && (
        <ul className="mb-3 divide-y border border-border">
          {value.map((d, i) => (
            <li key={d.id ?? `${d.url}-${i}`} className="flex flex-wrap items-center gap-3 p-3">
              {isPdfUrl(d.url) ? (
                <FileText className="h-8 w-8 flex-shrink-0 text-varak-primary" aria-hidden="true" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.url} alt="" className="h-8 w-8 flex-shrink-0 border object-cover" />
              )}
              <button type="button" onClick={() => setViewing(i)} className="min-w-0 flex-1 truncate text-left text-sm font-medium hover:underline" aria-label={`Preview ${d.fileName}`}>
                {d.fileName}
              </button>
              {onTypeChange && !d.id ? (
                <select aria-label={`Type of ${d.fileName}`} className={select} value={d.type} onChange={(e) => onTypeChange(i, e.target.value as DocumentKind)}>
                  {DOCUMENT_TYPES.map((t) => (
                    <option key={t} value={t}>{LABELS[t]}</option>
                  ))}
                </select>
              ) : (
                <span className="text-xs text-muted-foreground">{LABELS[d.type] ?? d.type}</span>
              )}
              {d.verified && <span className="bg-green-100 px-2 py-0.5 text-xs text-green-800">Verified</span>}
              {!disabled && !d.verified && (
                <Button type="button" variant="ghost" size="sm" className="h-8 rounded-none px-2 text-red-600" aria-label={`Remove ${d.fileName}`} onClick={() => remove(d, i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input id="documents-input" ref={input} type="file" multiple accept=".pdf,image/jpeg,image/png,image/webp" className="sr-only" onChange={pick} disabled={disabled || busy} />
        <Button type="button" variant="outline" size="sm" className="rounded-none" disabled={disabled || busy || value.length >= MAX_DOCUMENTS} onClick={() => input.current?.click()}>
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Paperclip className="mr-2 h-4 w-4" />}
          {busy ? "Uploading…" : value.length ? "Add more documents" : "Choose documents"}
        </Button>
        <label className="flex items-center gap-2 text-sm">
          New files are
          <select className={select} value={newType} onChange={(e) => setNewType(e.target.value as DocumentKind)} disabled={disabled || busy}>
            {DOCUMENT_TYPES.map((t) => (
              <option key={t} value={t}>{LABELS[t]}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Up to {MAX_DOCUMENTS} files: PDF, JPG, PNG or WebP, 4 MB each. Medical reports, hospital bills and prescriptions help donors trust your campaign. These are shown on your public campaign page, so black out anything private, such as Aadhaar numbers.
      </p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {viewing !== null && <DocumentViewer docs={value} index={viewing} onIndex={setViewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
