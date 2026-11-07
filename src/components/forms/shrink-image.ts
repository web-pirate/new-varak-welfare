const MAX_SIDE = 1600;

// Phone photos are often 5-10 MB. Shrinking in the browser keeps uploads small, fast and under the server's size limit.
export async function shrinkImage(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size <= 1_000_000) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff"; // JPEG has no transparency
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("resize failed"))), "image/jpeg", 0.85));
  } catch {
    return file;
  }
}

const WATERMARK_TEXT = "varakwelfare.org";

function loadLogo(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => resolve(null); // the text mark alone is still applied
    im.src = "/logo.png";
  });
}

/** Stamps a small logo and the site name in the bottom-right corner. Call it once, on a photo's first upload, never on documents or on adjusted copies (the stored photo already has the mark). */
export async function addWatermark(blob: Blob): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return blob;
    ctx.fillStyle = "#fff"; // JPEG has no transparency
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0);

    const unit = Math.max(12, Math.round(Math.min(canvas.width, canvas.height) * 0.035));
    const pad = Math.round(unit * 0.8);
    const logo = await loadLogo();
    const logoH = Math.round(unit * 1.8);
    const logoW = logo ? Math.round((logo.naturalWidth / logo.naturalHeight) * logoH) : 0;
    ctx.font = `600 ${unit}px sans-serif`;
    ctx.textBaseline = "middle";
    const textW = ctx.measureText(WATERMARK_TEXT).width;
    const gap = logo ? Math.round(unit * 0.4) : 0;
    const x = canvas.width - pad - textW - gap - logoW;
    const cy = canvas.height - pad - logoH / 2;

    ctx.globalAlpha = 0.85;
    if (logo) ctx.drawImage(logo, x, cy - logoH / 2, logoW, logoH);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0,0,0,0.7)"; // keeps the text readable on light photos
    ctx.shadowBlur = unit * 0.3;
    ctx.fillText(WATERMARK_TEXT, x + logoW + gap, cy);
    ctx.globalAlpha = 1;

    return await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("watermark failed"))), "image/jpeg", 0.88));
  } catch {
    return blob; // shortcut: if stamping fails the photo is uploaded unmarked, rather than blocking the upload
  }
}

/** Sends a file to our upload route. Returns the stored URL, or an error message. */
export async function uploadFile(blob: Blob, name: string, kind: "photo" | "document"): Promise<{ url: string; name: string } | { error: string }> {
  try {
    const fd = new FormData();
    fd.append("file", blob, name);
    fd.append("kind", kind);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = (await res.json().catch(() => ({}))) as { url?: string; name?: string; error?: string };
    if (!res.ok || !data.url) return { error: data.error ?? "The file could not be uploaded. Please try again." };
    return { url: data.url, name: data.name ?? name };
  } catch {
    return { error: "The file could not be uploaded. Check your connection and try again." };
  }
}
