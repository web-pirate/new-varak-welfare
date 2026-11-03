import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
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

  const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
  if (cloud && key && secret) {
    cloudinary.config({ cloud_name: cloud, api_key: key, api_secret: secret, secure: true });
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            isDocument
              ? { folder: "varak/documents", resource_type: "auto", allowed_formats: ["pdf", "jpg", "png", "webp"] }
              : {
                  folder: "varak/patients",
                  resource_type: "image",
                  allowed_formats: ["jpg", "png", "webp"],
                  // Stored copy is capped at 1600px and compressed
                  transformation: [{ width: 1600, height: 1600, crop: "limit" }, { quality: "auto", fetch_format: "auto" }],
                },
            (err, res) => (err || !res ? reject(err ?? new Error("empty response")) : resolve(res))
          )
          .end(buffer);
      });
      return NextResponse.json({ url: result.secure_url, name });
    } catch (e) {
      console.error("Photo upload failed:", e instanceof Error ? e.message : "unknown");
      return fail("The photo could not be uploaded. Please try again.", 502);
    }
  }

  // shortcut: with no Cloudinary account configured, development saves to public/uploads (never on the server in production)
  if (process.env.NODE_ENV !== "production") {
    const fileName = `${randomUUID()}.${EXT[type]}`;
    await mkdir(join(process.cwd(), "public", "uploads"), { recursive: true });
    await writeFile(join(process.cwd(), "public", "uploads", fileName), buffer);
    return NextResponse.json({ url: `/uploads/${fileName}`, name });
  }
  return fail("Photo upload isn't set up yet", 503);
}
