"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, SlidersHorizontal, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMAGE_TYPES, MAX_PHOTOS, MAX_UPLOAD_BYTES } from "@/lib/upload";
import { PhotoEditor } from "@/components/forms/photo-editor";
import { shrinkImage, uploadFile } from "@/components/forms/shrink-image";

// Several patient photos. The first one is the cover (shown on cards and link previews). Each can be adjusted, moved or removed.
export function PhotoGalleryUpload({
  id = "photos",
  value,
  onChange,
  disabled = false,
}: {
  id?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [adjusting, setAdjusting] = useState<number | null>(null);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setError(null);
    const room = MAX_PHOTOS - value.length;
    if (room <= 0) return setError(`You can add up to ${MAX_PHOTOS} photos`);
    const problems: string[] = [];
    if (files.length > room) problems.push(`Only ${room} more photo${room === 1 ? "" : "s"} fit, the rest were skipped`);

    let next = [...value];
    setBusy((b) => b + 1);
    for (const file of files.slice(0, room)) {
      if (!(IMAGE_TYPES as readonly string[]).includes(file.type)) {
        problems.push(`${file.name}: please choose a JPG, PNG or WebP photo`);
        continue;
      }
      const blob = await shrinkImage(file);
      if (blob.size > MAX_UPLOAD_BYTES) {
        problems.push(`${file.name} is too large`);
        continue;
      }
      const result = await uploadFile(blob, file.name, "photo");
      if ("error" in result) {
        problems.push(`${file.name}: ${result.error}`);
        continue;
      }
      next = [...next, result.url];
      onChange(next); // show each photo as soon as it is stored
    }
    setBusy((b) => b - 1);
    if (problems.length) setError(problems.join(". "));
  }

  const move = (from: number, to: number) => {
    const next = [...value];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
  };

  async function applyAdjusted(index: number, blob: Blob) {
    const result = await uploadFile(blob, "adjusted.jpg", "photo");
    if ("error" in result) {
      setError(result.error);
    } else {
      onChange(value.map((u, i) => (i === index ? result.url : u)));
      setError(null);
    }
    setAdjusting(null);
  }

  const small = "h-8 w-8 rounded-none bg-white/95 p-0 shadow-sm hover:bg-white";
  return (
    <div className="mt-1">
      {value.length > 0 && (
        <ul className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {value.map((url, i) => (
            <li key={`${url}-${i}`} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Patient photo ${i + 1}`} className="aspect-[4/3] w-full border border-border object-cover" />
              {i === 0 && <span className="absolute left-1 top-1 bg-varak-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Cover</span>}
              {!disabled && (
                <div className="mt-1 flex flex-wrap gap-1">
                  <Button type="button" variant="outline" className={small} aria-label={`Adjust photo ${i + 1}`} title="Adjust" onClick={() => setAdjusting(i)}>
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                  {i > 0 && (
                    <Button type="button" variant="outline" className={small} aria-label={`Make photo ${i + 1} the cover`} title="Make cover" onClick={() => move(i, 0)}>
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button type="button" variant="outline" className={small} aria-label={`Move photo ${i + 1} earlier`} title="Move earlier" disabled={i === 0} onClick={() => move(i, i - 1)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" className={small} aria-label={`Move photo ${i + 1} later`} title="Move later" disabled={i === value.length - 1} onClick={() => move(i, i + 1)}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" className={`${small} text-red-600`} aria-label={`Remove photo ${i + 1}`} title="Remove" onClick={() => onChange(value.filter((_, j) => j !== i))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <input id={id} ref={input} type="file" multiple accept={IMAGE_TYPES.join(",")} className="sr-only" onChange={pick} disabled={disabled || busy > 0} />
      <Button type="button" variant="outline" size="sm" className="rounded-none" disabled={disabled || busy > 0 || value.length >= MAX_PHOTOS} onClick={() => input.current?.click()}>
        {busy > 0 ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImagePlus className="mr-2 h-4 w-4" />}
        {busy > 0 ? "Uploading…" : value.length ? "Add more photos" : "Choose photos"}
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">
        Up to {MAX_PHOTOS} photos (JPG, PNG or WebP). The first is the cover. Large photos are shrunk automatically. Only upload photos you have permission to share: the patient&apos;s, or a parent&apos;s or guardian&apos;s for a child.
      </p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {adjusting !== null && value[adjusting] && (
        <PhotoEditor src={value[adjusting]} onClose={() => setAdjusting(null)} onApply={(blob) => applyAdjusted(adjusting, blob)} />
      )}
    </div>
  );
}
