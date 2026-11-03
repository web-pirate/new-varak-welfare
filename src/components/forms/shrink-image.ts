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
