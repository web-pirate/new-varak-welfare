"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ASPECTS, clampOffset, outputSize, scaleFor, type AspectKey, type Frame } from "@/lib/photo-frame";

const PREVIEW_W = 440;
type Rotation = Frame["rotation"];

function draw(canvas: HTMLCanvasElement, img: HTMLImageElement, f: Frame, off: { x: number; y: number }) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, f.frameW, f.frameH);
  const o = clampOffset(f, off.x, off.y);
  ctx.save();
  ctx.translate(f.frameW / 2 + o.x, f.frameH / 2 + o.y);
  ctx.rotate((f.rotation * Math.PI) / 180);
  const s = scaleFor(f);
  ctx.scale(s, s);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  ctx.restore();
}

// Zoom, drag, rotate and choose the crop shape for one photo. "Apply" hands back a new JPEG.
export function PhotoEditor({ src, onClose, onApply }: { src: string; onClose: () => void; onApply: (blob: Blob) => Promise<void> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [aspectKey, setAspectKey] = useState<AspectKey>("4:3");
  const [rotation, setRotation] = useState<Rotation>(0);
  const [zoom, setZoom] = useState(1);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);

  const aspect = ASPECTS[aspectKey];
  const frameW = PREVIEW_W;
  const frameH = Math.round(PREVIEW_W / aspect);
  const frame = (w: number, h: number): Frame => ({ imgW: img?.naturalWidth ?? 1, imgH: img?.naturalHeight ?? 1, rotation, zoom, frameW: w, frameH: h });

  useEffect(() => {
    const im = new Image();
    im.crossOrigin = "anonymous"; // needed to read the pixels back when the photo is on Cloudinary
    im.onload = () => setImg(im);
    im.onerror = () => setLoadError(true);
    im.src = src;
  }, [src]);

  useEffect(() => {
    if (canvas.current && img) draw(canvas.current, img, frame(frameW, frameH), off);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, aspectKey, rotation, zoom, off]);

  const move = (dx: number, dy: number) => setOff((o) => clampOffset(frame(frameW, frameH), o.x + dx, o.y + dy));

  async function apply() {
    if (!img) return;
    setSaving(true);
    try {
      const { w, h } = outputSize(aspect);
      const out = document.createElement("canvas");
      out.width = w;
      out.height = h;
      const k = w / frameW; // the offset was measured on the smaller preview
      draw(out, img, frame(w, h), { x: off.x * k, y: off.y * k });
      const blob = await new Promise<Blob | null>((resolve) => out.toBlob(resolve, "image/jpeg", 0.9));
      if (blob) await onApply(blob);
    } finally {
      setSaving(false);
    }
  }

  const reset = () => {
    setAspectKey("4:3");
    setRotation(0);
    setZoom(1);
    setOff({ x: 0, y: 0 });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && !saving && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-none sm:max-w-xl">
        <DialogHeader className="text-left">
          <DialogTitle className="font-heading">Adjust photo</DialogTitle>
          <DialogDescription>Drag the photo to reposition it, zoom, rotate, or change the shape.</DialogDescription>
        </DialogHeader>

        {loadError ? (
          <p role="alert" className="text-sm text-red-600">This photo can&apos;t be adjusted. Remove it and upload it again.</p>
        ) : (
          <>
            <div className="flex justify-center">
              <canvas
                ref={canvas}
                width={frameW}
                height={frameH}
                tabIndex={0}
                aria-label="Photo preview. Drag, or use the arrow keys, to reposition."
                className="max-w-full touch-none cursor-grab border border-border bg-muted active:cursor-grabbing"
                style={{ width: frameW, height: "auto", aspectRatio: `${frameW} / ${frameH}` }}
                onPointerDown={(e) => {
                  drag.current = { x: e.clientX, y: e.clientY };
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (!drag.current) return;
                  const k = frameW / e.currentTarget.getBoundingClientRect().width; // preview may be shown smaller on phones
                  move((e.clientX - drag.current.x) * k, (e.clientY - drag.current.y) * k);
                  drag.current = { x: e.clientX, y: e.clientY };
                }}
                onPointerUp={() => (drag.current = null)}
                onKeyDown={(e) => {
                  const step = 12;
                  const d = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[e.key];
                  if (d) {
                    e.preventDefault();
                    move(d[0], d[1]);
                  }
                }}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label htmlFor="photo-zoom" className="w-12 text-sm">Zoom</label>
                <input id="photo-zoom" type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-sm">Shape</span>
                {(Object.keys(ASPECTS) as AspectKey[]).map((k) => (
                  <Button key={k} type="button" size="sm" variant={k === aspectKey ? "default" : "outline"} className="rounded-none" aria-pressed={k === aspectKey} onClick={() => setAspectKey(k)}>
                    {k}
                  </Button>
                ))}
                <Button type="button" size="sm" variant="outline" className="ml-auto rounded-none" onClick={() => setRotation((r) => (((r + 90) % 360) as Rotation))}>
                  <RotateCw className="mr-2 h-4 w-4" />
                  Rotate
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-2 pt-2">
              <Button type="button" variant="ghost" className="rounded-none" onClick={reset} disabled={saving}>Reset</Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="rounded-none" onClick={onClose} disabled={saving}>Cancel</Button>
                <Button type="button" className="rounded-none bg-varak-primary text-white hover:bg-varak-primary-dark" onClick={apply} disabled={!img || saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Apply
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
