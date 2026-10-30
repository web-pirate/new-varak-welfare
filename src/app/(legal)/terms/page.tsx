import type { Metadata } from "next";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/contact";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-heading text-4xl mb-8">Terms of Service</h1>
      <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground">
        <p>Last updated: March 2026</p>
        <h2 className="font-heading text-xl text-foreground">1. Acceptance of Terms</h2>
        <p>By accessing and using Varak Cancer Welfare Society&apos;s platform, you agree to be bound by these Terms of Service.</p>
        <h2 className="font-heading text-xl text-foreground">2. Platform Description</h2>
        <p>Varak Cancer Welfare Society operates a crowdfunding platform specifically for cancer patients. We facilitate fundraising campaigns and donations with 0% platform fee.</p>
        <h2 className="font-heading text-xl text-foreground">3. User Accounts</h2>
        <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials.</p>
        <h2 className="font-heading text-xl text-foreground">4. Campaign Guidelines</h2>
        <p>All campaigns must be for legitimate cancer treatment purposes. Campaigns undergo verification before approval. Misuse will result in account suspension.</p>
        <h2 className="font-heading text-xl text-foreground">5. Donations</h2>
        <p>All donations are voluntary. Donors may be eligible for tax benefits under Section 80G. Refunds are subject to our refund policy.</p>
        <h2 className="font-heading text-xl text-foreground">6. Contact</h2>
        <p>For questions about these terms, contact us at <a href={CONTACT_MAILTO} className="underline">{CONTACT_EMAIL}</a></p>
      </div>
    </div>
  );
}
