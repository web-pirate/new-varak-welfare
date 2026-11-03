import { z } from "zod";
import { DOCUMENT_TYPES, MAX_DOCUMENTS, MAX_PHOTOS, isOwnFileUrl, isOwnImageUrl } from "@/lib/upload";

export const campaignCreateSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(100),
  story: z.string().min(50, "Story must be at least 50 characters"),
  goalAmount: z.coerce.number().min(1000, "Minimum goal amount is ₹1,000"),
  beneficiaryName: z.string().min(2, "Beneficiary name is required"),
  beneficiaryRelation: z.string().optional(),
  beneficiaryAge: z.coerce.number().min(0).max(120).optional(),
  cancerTypeId: z.string().min(1, "Please select a cancer type"),
  hospitalName: z.string().optional(),
  hospitalCity: z.string().optional(),
  stateId: z.string().optional(),
  districtId: z.string().optional(),
  endDate: z.coerce.date().optional(),
});

export const campaignUpdateSchema = campaignCreateSchema.partial();

export const campaignStoryUpdateSchema = z.object({
  content: z.string().trim().min(10, "Update must be at least 10 characters").max(2000, "Update must be 2000 characters or fewer"),
  imageUrl: z.string().url().optional(),
});

export type CampaignCreateInput = z.infer<typeof campaignCreateSchema>;
export type CampaignUpdateInput = z.infer<typeof campaignUpdateSchema>;

// Photos and documents are lists of URLs our own upload route produced, never arbitrary external links
const storage = () => ({ cloudName: process.env.CLOUDINARY_CLOUD_NAME, allowLocal: process.env.NODE_ENV !== "production" });

export const imageListSchema = z
  .array(z.string().refine((u) => isOwnImageUrl(u, storage()), "Please upload the photo again"))
  .max(MAX_PHOTOS, `You can add up to ${MAX_PHOTOS} photos`);

export const documentListSchema = z
  .array(
    z.object({
      url: z.string().refine((u) => isOwnFileUrl(u, storage()), "Please upload the document again"),
      fileName: z.string().max(100).optional(),
      type: z.enum(DOCUMENT_TYPES),
    })
  )
  .max(MAX_DOCUMENTS, `You can add up to ${MAX_DOCUMENTS} documents`);
