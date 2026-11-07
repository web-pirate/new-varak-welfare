"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { campaignCreateSchema, campaignStoryUpdateSchema, campaignUpdateSchema, documentListSchema, imageListSchema } from "@/lib/validations/campaign";
import { MAX_DOCUMENTS, cleanFileName, photoKey } from "@/lib/upload";
import { r2Configured, r2Delete } from "@/lib/r2";
import { canPostUpdate, editableFields, lockedKeys } from "@/lib/campaign-edit";
import { ZodError } from "zod";
import { campaignSlug, slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { syncUser } from "@/server/actions/sync-user";

// The id in the slug is random, so a clash is very unlikely; retry a couple of times if the unique index still trips
async function createWithUniqueSlug<T>(title: string, fallback: string | undefined, create: (slug: string) => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await create(campaignSlug(title, fallback));
    } catch (e) {
      if (attempt < 2 && (e as { code?: string }).code === "P2002") continue;
      throw e;
    }
  }
}

export async function createCampaign(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await syncUser();
  if (!user) throw new Error("User not found");

  // Stops one account flooding the admin review queue
  const pending = await prisma.campaign.count({ where: { createdById: user.id, status: "PENDING_REVIEW" } });
  if (pending >= 3) throw new Error("You already have 3 campaigns waiting for review. Please wait for them to be reviewed.");

  const rawData = Object.fromEntries(formData.entries());
  const validated = campaignCreateSchema.parse(rawData);
  const images = imageListSchema.parse(parseJson(formData.get("images")) ?? []);
  const documents = documentListSchema.parse(parseJson(formData.get("documents")) ?? []);

  // A title with no Latin letters (Hindi, Arabic...) falls back to the cancer type for the readable part
  const fallback =
    !slugify(validated.title) && validated.cancerTypeId
      ? (await prisma.cancerType.findUnique({ where: { id: validated.cancerTypeId }, select: { name: true } }))?.name
      : undefined;

  const campaign = await createWithUniqueSlug(validated.title, fallback, (slug) => prisma.campaign.create({
    data: {
      slug,
      title: validated.title,
      story: validated.story,
      goalAmount: validated.goalAmount,
      beneficiaryName: validated.beneficiaryName,
      beneficiaryRelation: validated.beneficiaryRelation,
      beneficiaryAge: validated.beneficiaryAge,
      beneficiaryImage: images[0] ?? null, // the cover photo, also used on cards and link previews
      images: { create: images.map((url, position) => ({ url, position })) },
      documents: { create: documents.map((d) => ({ type: d.type, url: d.url, fileName: d.fileName ? cleanFileName(d.fileName) : null })) },
      cancerTypeId: validated.cancerTypeId,
      hospitalName: validated.hospitalName,
      hospitalCity: validated.hospitalCity,
      stateId: validated.stateId || null,
      districtId: validated.districtId || null,
      endDate: validated.endDate,
      status: "PENDING_REVIEW",
      createdById: user.id,
    },
  }));

  // Update user role to FUNDRAISER if they're currently a DONOR
  await prisma.user.update({
    where: { id: user.id, role: "DONOR" },
    data: { role: "FUNDRAISER" },
  }).catch(() => {
    // Ignore if user already has a higher role
  });

  revalidatePath("/campaigns");
  revalidatePath("/dashboard/fundraiser/campaigns");

  return { success: true, campaignId: campaign.id, slug: campaign.slug };
}

export async function updateCampaignStatus(
  campaignId: string,
  status: "APPROVED" | "REJECTED" | "SUSPENDED",
  reason?: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    throw new Error("Unauthorized - Admin only");
  }

  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      status,
      rejectionReason: status === "REJECTED" ? reason : null,
    },
  });

  revalidatePath("/campaigns");
  revalidatePath("/dashboard/admin/campaigns");
}

export type ActionResult = { ok: true; slug: string } | { ok: false; error: string };

// Expected problems come back as a message: Next hides the text of errors thrown from server actions in production
const failure = (e: unknown): ActionResult => ({
  ok: false,
  error: e instanceof ZodError ? e.issues[0]?.message ?? "Please check the form" : e instanceof Error ? e.message : "Something went wrong",
});

// Optional fields the owner may empty out. An empty string clears the value; any other value is validated.
const CLEARABLE = ["beneficiaryRelation", "beneficiaryAge", "hospitalName", "hospitalCity", "stateId", "districtId", "endDate"];

const parseJson = (v: FormDataEntryValue | null): unknown => {
  if (typeof v !== "string" || v === "") return undefined;
  try {
    return JSON.parse(v);
  } catch {
    throw new Error("Could not read the uploaded files. Please try again.");
  }
};

async function ownedCampaign(campaignId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Please sign in first");
  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, createdBy: { clerkId: userId } },
    select: { id: true, slug: true, status: true },
  });
  if (!campaign) throw new Error("Campaign not found");
  return campaign;
}

/** Deletes R2 photos that a save just removed from a campaign, unless something else still points at them. Best effort: a failure never fails the save. */
async function deleteOrphanPhotos(urls: string[]) {
  if (!r2Configured) return;
  for (const url of urls) {
    const key = photoKey(url);
    if (!key) continue;
    try {
      const inUse =
        (await prisma.campaignImage.count({ where: { url } })) +
        (await prisma.campaign.count({ where: { beneficiaryImage: url } })) +
        (await prisma.campaignUpdate.count({ where: { imageUrl: url } }));
      if (inUse === 0) await r2Delete(key);
    } catch (e) {
      console.error("Photo cleanup failed:", e instanceof Error ? e.message : "unknown");
    }
  }
}

function refresh(slug: string) {
  revalidatePath(`/campaigns/${slug}`);
  revalidatePath("/campaigns");
  revalidatePath("/dashboard/fundraiser/campaigns");
}

/** Owner edits their campaign. What can change depends on its status (see src/lib/campaign-edit.ts). */
export async function updateCampaign(campaignId: string, formData: FormData): Promise<ActionResult> {
  try {
    const campaign = await ownedCampaign(campaignId);
    if (editableFields(campaign.status).length === 0) throw new Error("This campaign can no longer be edited");

    const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
    const locked = lockedKeys(campaign.status, Object.keys(raw));
    if (locked.length) throw new Error(`These can't be changed after approval: ${locked.join(", ")}`);

    const { images: rawImages, ...fields } = raw; // the photo list is JSON, handled apart from the plain fields
    const images = rawImages === undefined ? undefined : imageListSchema.parse(parseJson(rawImages) ?? []);
    const cleared = Object.fromEntries(Object.keys(fields).filter((k) => CLEARABLE.includes(k) && fields[k] === "").map((k) => [k, null]));
    const given = Object.fromEntries(Object.entries(fields).filter(([k, v]) => !(CLEARABLE.includes(k) && v === "")));
    const data = campaignUpdateSchema.parse(given);

    const before = images ? (await prisma.campaignImage.findMany({ where: { campaignId: campaign.id }, select: { url: true } })).map((i) => i.url) : [];
    await prisma.$transaction([
      prisma.campaign.update({
        where: { id: campaign.id },
        data: {
          ...data,
          ...cleared,
          ...(images ? { beneficiaryImage: images[0] ?? null } : {}),
          // A rejected campaign goes back to review once the owner has fixed it
          ...(campaign.status === "REJECTED" ? { status: "PENDING_REVIEW" as const, rejectionReason: null } : {}),
        },
      }),
      ...(images
        ? [
            prisma.campaignImage.deleteMany({ where: { campaignId: campaign.id } }),
            prisma.campaignImage.createMany({ data: images.map((url, position) => ({ campaignId: campaign.id, url, position })) }),
          ]
        : []),
    ]);
    if (images) await deleteOrphanPhotos(before.filter((u) => !images.includes(u)));
    refresh(campaign.slug);
    return { ok: true, slug: campaign.slug };
  } catch (e) {
    return failure(e);
  }
}

/** Owner posts a progress update, shown on the public campaign page. */
export async function addCampaignUpdate(campaignId: string, formData: FormData): Promise<ActionResult> {
  try {
    const campaign = await ownedCampaign(campaignId);
    if (!canPostUpdate(campaign.status)) throw new Error("Updates can be posted once the campaign is approved");
    const { content } = campaignStoryUpdateSchema.parse({ content: formData.get("content") });
    await prisma.campaignUpdate.create({ data: { content, campaignId: campaign.id } });
    refresh(campaign.slug);
    return { ok: true, slug: campaign.slug };
  } catch (e) {
    return failure(e);
  }
}

/** Owner adds more documents to their campaign (more evidence is fine at any editable stage). */
export async function addCampaignDocuments(campaignId: string, formData: FormData): Promise<ActionResult> {
  try {
    const campaign = await ownedCampaign(campaignId);
    if (editableFields(campaign.status).length === 0) throw new Error("This campaign can no longer be edited");
    const docs = documentListSchema.parse(parseJson(formData.get("documents")) ?? []);
    if (docs.length === 0) throw new Error("No documents were sent");
    const existing = await prisma.campaignDocument.count({ where: { campaignId: campaign.id } });
    if (existing + docs.length > MAX_DOCUMENTS) throw new Error(`A campaign can have up to ${MAX_DOCUMENTS} documents`);
    await prisma.campaignDocument.createMany({
      data: docs.map((d) => ({ campaignId: campaign.id, type: d.type, url: d.url, fileName: d.fileName ? cleanFileName(d.fileName) : null })),
    });
    refresh(campaign.slug);
    return { ok: true, slug: campaign.slug };
  } catch (e) {
    return failure(e);
  }
}

/** Owner removes one of their documents, unless the team has already verified it. */
export async function removeCampaignDocument(campaignId: string, documentId: string): Promise<ActionResult> {
  try {
    const campaign = await ownedCampaign(campaignId);
    if (editableFields(campaign.status).length === 0) throw new Error("This campaign can no longer be edited");
    const doc = await prisma.campaignDocument.findFirst({ where: { id: documentId, campaignId: campaign.id }, select: { id: true, verified: true } });
    if (!doc) throw new Error("Document not found");
    if (doc.verified) throw new Error("Verified documents can't be removed. Contact support if one is wrong.");
    await prisma.campaignDocument.delete({ where: { id: doc.id } });
    refresh(campaign.slug);
    return { ok: true, slug: campaign.slug };
  } catch (e) {
    return failure(e);
  }
}
