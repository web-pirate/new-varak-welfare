import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { StickyDonate } from "@/components/marketing/sticky-donate";
import { LiveDonationTicker } from "@/components/marketing/live-donation-ticker";
import { TrendingFundraisers } from "@/components/marketing/trending-fundraisers";
import { ImpactCounterStrip } from "@/components/marketing/impact-counter-strip";
import { CausesSection } from "@/components/marketing/causes-section";
import { WhySection } from "@/components/marketing/why-section";
import { SuccessStories } from "@/components/marketing/success-stories";
import { MonthlyGivingSection } from "@/components/marketing/monthly-giving-section";
import { FAQSection } from "@/components/marketing/faq-section";
import { CTASection } from "@/components/marketing/cta-section";
import {
  getCancerTypes,
  getFeaturedCampaigns,
  getRecentDonations,
  getPlatformStats,
} from "@/server/queries/campaigns";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const [cancerTypes, featuredCampaigns, recentDonations, platformStats] =
    await Promise.all([
      getCancerTypes(),
      getFeaturedCampaigns(6),
      getRecentDonations(10),
      getPlatformStats(),
    ]);

  return (
    <>
      <Hero />
      <TrustStrip />
      <TrendingFundraisers
        campaigns={
          [...featuredCampaigns]
            .sort((a, b) => {
              // Nearly funded first; fully funded last
              const f = (c: typeof a) => (Number(c.amountRaised) >= Number(c.goalAmount) ? -1 : Number(c.amountRaised) / Number(c.goalAmount));
              return f(b) - f(a);
            })
            .map((c) => ({
            ...c,
            goalAmount: Number(c.goalAmount),
            amountRaised: Number(c.amountRaised),
          })) as never
        }
      />
      <LiveDonationTicker
        donations={recentDonations.map((d) => ({ ...d, amount: Number(d.amount) }))}
      />
      <ImpactCounterStrip platformStats={platformStats} />
      <CausesSection cancerTypes={cancerTypes} />
      <WhySection />
      <SuccessStories />
      <MonthlyGivingSection />
      <FAQSection />
      <CTASection />
      <StickyDonate />
    </>
  );
}
