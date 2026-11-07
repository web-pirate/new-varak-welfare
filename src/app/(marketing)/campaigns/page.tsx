import type { Metadata } from "next";
import { getCampaigns, getCancerTypes, getStates } from "@/server/queries/campaigns";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import type { CampaignWithRelations } from "@/types";

export const metadata: Metadata = {
  title: "Browse Campaigns",
  description:
    "Browse verified cancer fundraising campaigns. Donate to help patients fight cancer across India.",
};

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const [{ data: campaigns, total, totalPages }, cancerTypes, states] =
    await Promise.all([
      getCampaigns({
        search: params.search,
        cancerType: params.cancerType,
        state: params.state,
        sortBy: (params.sortBy as "recent" | "most_funded" | "most_donors") || "recent",
        page: params.page ? parseInt(params.page) : 1,
      }),
      getCancerTypes(),
      getStates(),
    ]);

  const currentPage = params.page ? parseInt(params.page) : 1;

  return (
    <>
      <div>
        {/* Header */}
        <section className="py-10 bg-gradient-to-b from-varak-cream to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl md:text-4xl mb-2">
              Browse Campaigns
            </h1>
            <p className="text-muted-foreground">
              {total} verified campaigns helping cancer patients across India
            </p>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mt-6">
              <form className="flex flex-wrap gap-3" method="GET">
                <input
                  type="text"
                  name="search"
                  defaultValue={params.search}
                  placeholder="Search campaigns..."
                  className="px-4 py-2 rounded-xl border border-border/50 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-varak-primary/20"
                />
                <select
                  name="cancerType"
                  defaultValue={params.cancerType}
                  className="px-4 py-2 rounded-xl border border-border/50 bg-white text-sm"
                >
                  <option value="">All Cancer Types</option>
                  {cancerTypes.map((ct) => (
                    <option key={ct.id} value={ct.slug}>
                      {ct.name}
                    </option>
                  ))}
                </select>
                <select
                  name="state"
                  defaultValue={params.state}
                  className="px-4 py-2 rounded-xl border border-border/50 bg-white text-sm"
                >
                  <option value="">All States</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <select
                  name="sortBy"
                  defaultValue={params.sortBy}
                  className="px-4 py-2 rounded-xl border border-border/50 bg-white text-sm"
                >
                  <option value="recent">Most Recent</option>
                  <option value="most_funded">Most Funded</option>
                  <option value="most_donors">Most Donors</option>
                </select>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-varak-primary text-white text-sm font-medium hover:bg-varak-primary-dark"
                >
                  Filter
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Campaign Grid */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {campaigns.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  No campaigns found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaigns.map((campaign: CampaignWithRelations) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <a
                          key={page}
                          href={`/campaigns?page=${page}${params.search ? `&search=${params.search}` : ""}${params.cancerType ? `&cancerType=${params.cancerType}` : ""}${params.state ? `&state=${params.state}` : ""}${params.sortBy ? `&sortBy=${params.sortBy}` : ""}`}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                            page === currentPage
                              ? "bg-varak-primary text-white"
                              : "bg-white border border-border/50 hover:bg-muted"
                          }`}
                        >
                          {page}
                        </a>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
