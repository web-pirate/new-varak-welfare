import type { Metadata } from "next";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/contact";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-heading text-4xl mb-8">Refund Policy</h1>
      <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground">
        <p>Last updated: March 2026</p>
        <h2 className="font-heading text-xl text-foreground">Refund Eligibility</h2>
        <p>Refunds may be requested within 7 days of donation if the campaign is found to be fraudulent or if the donation was made in error.</p>
        <h2 className="font-heading text-xl text-foreground">Refund Process</h2>
        <p>Contact <a href={CONTACT_MAILTO} className="underline">{CONTACT_EMAIL}</a> with your donation ID. Refunds are processed within 5-7 business days to the original payment method.</p>
        <h2 className="font-heading text-xl text-foreground">Non-Refundable</h2>
        <p>Platform tips and donations to completed campaigns where funds have been disbursed are generally non-refundable.</p>
      </div>
    </div>
  );
}
