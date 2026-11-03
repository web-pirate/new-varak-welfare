// Rules for patient photo uploads. No imports, so the API route, the form and `node --test` all share it.

// Vercel rejects request bodies above ~4.5 MB, so stay under that. The browser shrinks photos first (see photo-upload.tsx).
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type ImageType = (typeof IMAGE_TYPES)[number];

/** The real type of an image, read from its first bytes. The browser-supplied type and file name can't be trusted. */
export function sniffImage(b: Uint8Array): ImageType | null {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a) return "image/png";
  const ascii = (from: number, to: number) => String.fromCharCode(...b.slice(from, to));
  if (b.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  return null;
}

/**
 * Only accept image URLs our own upload route produced: a photo from our Cloudinary account, or (in development only)
 * a file under /uploads. This stops anyone saving an arbitrary external URL, such as a tracking pixel, as a patient photo.
 */
export function isOwnImageUrl(url: string, opts: { cloudName?: string; allowLocal?: boolean }): boolean {
  if (opts.allowLocal && /^\/uploads\/[a-z0-9-]+\.(jpg|png|webp)$/.test(url)) return true;
  if (!opts.cloudName) return false;
  const prefix = `https://res.cloudinary.com/${opts.cloudName}/`;
  return url.startsWith(prefix) && !/[\s"'<>]/.test(url);
}

export const MAX_PHOTOS = 8;
export const MAX_DOCUMENTS = 10;
export const DOCUMENT_TYPES = ["MEDICAL_REPORT", "HOSPITAL_BILL", "PRESCRIPTION", "OTHER"] as const;
export type DocumentKind = (typeof DOCUMENT_TYPES)[number];
export const DOCUMENT_LABELS: Record<DocumentKind, string> = {
  MEDICAL_REPORT: "Medical report",
  HOSPITAL_BILL: "Hospital bill",
  PRESCRIPTION: "Prescription",
  OTHER: "Other",
};

/** Whether a stored file URL is a PDF (shown in a PDF viewer) rather than an image. */
export const isPdfUrl = (url: string) => /\.pdf(\?|#|$)/i.test(url);

/** Like sniffImage, but a PDF is also allowed (medical reports, bills). */
export function sniffDocument(b: Uint8Array): ImageType | "application/pdf" | null {
  const img = sniffImage(b);
  if (img) return img;
  const isPdf = b.length >= 5 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 && b[4] === 0x2d; // "%PDF-"
  return isPdf ? "application/pdf" : null;
}

/** Same trust rule as isOwnImageUrl, for documents: our own storage only, and a PDF is allowed as well as an image. */
export function isOwnFileUrl(url: string, opts: { cloudName?: string; allowLocal?: boolean }): boolean {
  if (opts.allowLocal && /^\/uploads\/[a-z0-9-]+\.(jpg|png|webp|pdf)$/.test(url)) return true;
  if (!opts.cloudName) return false;
  return url.startsWith(`https://res.cloudinary.com/${opts.cloudName}/`) && !/[\s"'<>]/.test(url);
}

/** A display name that is safe to show and store: no path, no markup, at most 100 characters. */
export function cleanFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "";
  return base.replace(/[<>"'`\u0000-\u001f]/g, "").trim().slice(0, 100) || "document";
}
