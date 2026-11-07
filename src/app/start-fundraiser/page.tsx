import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getCancerTypes, getStates } from "@/server/queries/campaigns";
import { FundingCalculator } from "@/components/marketing/funding-calculator";
import { ExpertContactForm } from "@/components/marketing/expert-contact-form";
import { CampaignWizard } from "@/components/forms/campaign-wizard";

export const metadata: Metadata = {
  title: "Start a Fundraiser",
  description:
    "Start a cancer fundraiser in minutes. 0% platform fee. Help your loved one get the treatment they deserve.",
};

export default async function StartFundraiserPage() {
  const { userId } = await auth();

  const [cancerTypes, states] = await Promise.all([
    getCancerTypes(),
    getStates(),
  ]);

  return (
    <div className="min-h-screen bg-varak-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl mb-3">
            Start a Fundraiser
          </h1>
          <p className="text-muted-foreground">
            Fill in the details below to create your fundraising campaign. It
            only takes a few minutes.
          </p>
        </div>

        <CampaignWizard
          isSignedIn={!!userId}
          cancerTypes={cancerTypes.map((ct) => ({
            id: ct.id,
            name: ct.name,
          }))}
          states={states.map((s) => ({ id: s.id, name: s.name }))}
        />
      </div>
      <FundingCalculator />
      <ExpertContactForm />
    </div>
  );
}
