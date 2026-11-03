import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://varakwelfare.org";
const PAGES = ["", "/campaigns", "/about", "/how-it-works", "/cancer-types", "/monthly-giving", "/faq", "/contact", "/careers"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const campaigns = await prisma.campaign.findMany({
    where: { status: { in: ["APPROVED", "COMPLETED"] } },
    select: { slug: true, updatedAt: true },
  });
  return [
    ...PAGES.map((p) => ({ url: `${BASE}${p}` })),
    ...campaigns.map((c) => ({ url: `${BASE}/campaigns/${c.slug}`, lastModified: c.updatedAt })),
  ];
}
