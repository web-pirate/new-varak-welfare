import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { LiveDonationTicker } from "@/components/marketing/live-donation-ticker";
import { TrendingFundraisers } from "@/components/marketing/trending-fundraisers";
import { ImpactCounterStrip } from "@/components/marketing/impact-counter-strip";
import { FundingCalculator } from "@/components/marketing/funding-calculator";
import { CausesSection } from "@/components/marketing/causes-section";
import { WhySection } from "@/components/marketing/why-section";
import { SuccessStories } from "@/components/marketing/success-stories";
import { MonthlyGivingSection } from "@/components/marketing/monthly-giving-section";
import { ExpertContactForm } from "@/components/marketing/expert-contact-form";
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
      <LiveDonationTicker
        donations={recentDonations.map((d) => ({ ...d, amount: Number(d.amount) }))}
      />
      <TrendingFundraisers
        campaigns={
          featuredCampaigns.map((c) => ({
            ...c,
            goalAmount: Number(c.goalAmount),
            amountRaised: Number(c.amountRaised),
          })) as never
        }
      />
      <ImpactCounterStrip platformStats={platformStats} />
      <FundingCalculator />
      <CausesSection cancerTypes={cancerTypes} />
      <WhySection />
      <SuccessStories />
      <MonthlyGivingSection />
      <ExpertContactForm />
      <FAQSection />
      <CTASection />
    </>
  );
}
