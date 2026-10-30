import type { Metadata } from "next";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/contact";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-heading text-4xl mb-8">Privacy Policy</h1>
      <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground">
        <p>Last updated: March 2026</p>
        <h2 className="font-heading text-xl text-foreground">1. Information We Collect</h2>
        <p>We collect personal information including name, email, phone number, and payment details when you create an account, donate, or start a fundraiser.</p>
        <h2 className="font-heading text-xl text-foreground">2. How We Use Information</h2>
        <p>Your information is used to process donations, verify campaigns, send receipts, and communicate platform updates. We never sell your data to third parties.</p>
        <h2 className="font-heading text-xl text-foreground">3. Data Security</h2>
        <p>We use industry-standard encryption (SSL/TLS) and secure payment gateways (Razorpay/Stripe) to protect your data.</p>
        <h2 className="font-heading text-xl text-foreground">4. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data. Contact <a href={CONTACT_MAILTO} className="underline">{CONTACT_EMAIL}</a> for requests.</p>
      </div>
    </div>
  );
}
