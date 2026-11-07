import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isOwnerOrAdmin } from "@/lib/file-access";
import { DOCUMENT_PATH } from "@/lib/upload";
import { r2Configured, r2Get } from "@/lib/r2";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", pdf: "application/pdf" };
const notFound = () => new NextResponse("Not found", { status: 404 });

/** Streams a private document from R2 to people allowed to see it: the uploader, staff, or anyone once the campaign is public. */
export async function GET(_req: Request, { params }: { params: Promise<{ owner: string; file: string }> }) {
  const { owner, file } = await params;
  const path = `/api/files/documents/${owner}/${file}`;
  if (!r2Configured || !DOCUMENT_PATH.test(path)) return notFound();

  let allowed = await isOwnerOrAdmin(owner);
  if (!allowed) {
    const published = await prisma.campaignDocument.findFirst({
      where: { url: path, campaign: { status: { in: ["APPROVED", "COMPLETED"] } } },
      select: { id: true },
    });
    allowed = Boolean(published);
  }
  if (!allowed) return notFound(); // 404, not 403, so the file's existence isn't revealed

  const object = await r2Get(`documents/${owner}/${file}`);
  if (!object?.body) return notFound();
  return new NextResponse(object.body, {
    headers: {
      "Content-Type": TYPES[file.split(".").pop()!],
      "Content-Disposition": "inline",
      "Cache-Control": "private, max-age=300",
    },
  });
}
