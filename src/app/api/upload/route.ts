import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { r2Configured, r2Put } from "@/lib/r2";
import { MAX_UPLOAD_BYTES, cleanFileName, sniffDocument, sniffImage } from "@/lib/upload";

const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" } as const;
const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return fail("Please sign in to upload a photo", 401);

  // Refuse oversized bodies before reading them
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_UPLOAD_BYTES + 64 * 1024) return fail("That photo is too large. Please choose one under 4 MB.", 413);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("Could not read the upload", 400);
  }
  const file = form.get("file");
  const isDocument = form.get("kind") === "document"; // "photo" (default) or "document"
  if (!(file instanceof File)) return fail("No file was sent", 400);
  if (file.size === 0) return fail("That file is empty", 400);
  if (file.size > MAX_UPLOAD_BYTES) return fail("That file is too large. Please choose one under 4 MB.", 413);

  // Trust the bytes, not the file name or the type the browser reports
  const buffer = Buffer.from(await file.arrayBuffer());
  const type = isDocument ? sniffDocument(buffer) : sniffImage(buffer);
  if (!type) return fail(isDocument ? "Please upload a PDF, JPG, PNG or WebP file" : "Please upload a JPG, PNG or WebP photo", 415);
  const name = cleanFileName(file.name);

  // Photos and documents both live in R2. Documents are private (see the /api/files/documents route), photos are public.
  if (r2Configured) {
    const folder = isDocument ? "documents" : "photos";
    const fileName = `${randomUUID()}.${EXT[type]}`;
    try {
      await r2Put(`${folder}/${userId}/${fileName}`, buffer, type);
    } catch (e) {
      console.error("Upload failed:", e instanceof Error ? e.message : "unknown");
      return fail("The file could not be uploaded. Please try again.", 502);
    }
    return NextResponse.json({ url: `/api/files/${folder}/${userId}/${fileName}`, name });
  }

  // shortcut: with no R2 bucket configured, development saves to public/uploads (never on the server in production)
  if (process.env.NODE_ENV !== "production") {
    const fileName = `${randomUUID()}.${EXT[type]}`;
    await mkdir(join(process.cwd(), "public", "uploads"), { recursive: true });
    await writeFile(join(process.cwd(), "public", "uploads", fileName), buffer);
    return NextResponse.json({ url: `/uploads/${fileName}`, name });
  }
  return fail("Photo upload isn't set up yet", 503);
}
