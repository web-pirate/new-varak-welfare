import { prisma } from "@/lib/prisma";
import { slugId } from "@/lib/slug";
import type { CampaignFilters, PaginatedResponse, CampaignWithRelations } from "@/types";

export async function getFeaturedCampaigns(limit = 6) {
  return prisma.campaign.findMany({
    where: {
      status: "APPROVED",
      isFeatured: true,
    },
    include: {
      cancerType: true,
      createdBy: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true },
      },
      state: true,
      district: true,
      _count: {
        select: { donations: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getCampaigns(
  filters: CampaignFilters = {}
): Promise<PaginatedResponse<CampaignWithRelations>> {
  const {
    search,
    cancerType,
    state,
    status = "APPROVED",
    sortBy = "recent",
    page = 1,
    pageSize = 12,
  } = filters;

  const where: Record<string, unknown> = { status };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { beneficiaryName: { contains: search, mode: "insensitive" } },
    ];
  }

  if (cancerType) {
    where.cancerType = { slug: cancerType };
  }

  if (state) {
    where.state = { code: state };
  }

  const orderBy: Record<string, string> =
    sortBy === "most_funded"
      ? { amountRaised: "desc" }
      : sortBy === "most_donors"
        ? { donorCount: "desc" }
        : { createdAt: "desc" };

  const [data, total] = await Promise.all([
    prisma.campaign.findMany({
      where,
      include: {
        cancerType: true,
        createdBy: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
        state: true,
        district: true,
        _count: {
          select: { donations: true, comments: true },
        },
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.campaign.count({ where }),
  ]);

  return {
    data: data as CampaignWithRelations[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// Exact slug first. If the readable part is stale or mistyped, the id at the end still finds the campaign.
export async function getCampaignBySlug(slug: string) {
  const exact = await loadCampaign(slug);
  if (exact) return exact;
  const id = slugId(slug);
  if (!id) return null;
  const match = await prisma.campaign.findFirst({ where: { slug: { endsWith: `-${id}` } }, select: { slug: true } });
  return match ? loadCampaign(match.slug) : null;
}

async function loadCampaign(slug: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    include: {
      cancerType: true,
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          email: true,
        },
      },
      state: true,
      district: true,
      images: { orderBy: { position: "asc" } },
      documents: true,
      updates: { orderBy: { createdAt: "desc" } },
      comments: {
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      donations: {
        where: { status: "COMPLETED" },
        select: {
          id: true,
          amount: true,
          donorName: true,
          isAnonymous: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (campaign) {
    await prisma.campaign.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });
  }

  return campaign;
}

export async function getCancerTypes() {
  return prisma.cancerType.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getStates() {
  return prisma.state.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getDistricts(stateId: string) {
  return prisma.district.findMany({
    where: { stateId },
    orderBy: { name: "asc" },
  });
}

export async function getRecentDonations(limit = 10) {
  try {
    return await prisma.donation.findMany({
      where: { status: "COMPLETED" },
      select: {
        id: true,
        amount: true,
        donorName: true,
        isAnonymous: true,
        createdAt: true,
        campaign: {
          select: { title: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getPlatformStats() {
  try {
    const [campaignStats, donorStats] = await Promise.all([
      prisma.campaign.aggregate({
        where: { status: "APPROVED" },
        _sum: { amountRaised: true },
        _count: true,
      }),
      prisma.donation.aggregate({
        where: { status: "COMPLETED" },
        _count: true,
      }),
    ]);
    return {
      totalRaised: Number(campaignStats._sum.amountRaised ?? 0),
      totalCampaigns: campaignStats._count,
      totalDonors: donorStats._count,
    };
  } catch {
    return { totalRaised: 0, totalCampaigns: 0, totalDonors: 0 };
  }
}
