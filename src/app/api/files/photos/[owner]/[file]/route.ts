import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isOwnerOrAdmin } from "@/lib/file-access";
import { PHOTO_PATH } from "@/lib/upload";
import { r2Configured, r2Get } from "@/lib/r2";
const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };
const notFound = () => new NextResponse("Not found", { status: 404 });

/**
 * Streams a photo from R2. Until its campaign is approved, only the uploader and admins can see it (404 for everyone
 * else); after that it is public. Public photos have random, never-reused names, so they can be cached for a year.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ owner: string; file: string }> }) {
  const { owner, file } = await params;
  const path = `/api/files/photos/${owner}/${file}`;
  if (!r2Configured || !PHOTO_PATH.test(path)) return notFound();

  // A photo can be the cover/gallery image, the beneficiary photo, or part of a progress update
  const published = await prisma.campaign.findFirst({
    where: {
      status: { in: ["APPROVED", "COMPLETED"] },
      OR: [{ beneficiaryImage: path }, { images: { some: { url: path } } }, { updates: { some: { imageUrl: path } } }],
    },
    select: { id: true },
  });
  if (!published && !(await isOwnerOrAdmin(owner))) return notFound(); // 404, not 403, so the file's existence isn't revealed

  const object = await r2Get(`photos/${owner}/${file}`);
  if (!object?.body) return notFound();
  return new NextResponse(object.body, {
    headers: {
      "Content-Type": TYPES[file.split(".").pop()!],
      "Cache-Control": published ? "public, max-age=31536000, immutable" : "private, max-age=300",
    },
  });
}
