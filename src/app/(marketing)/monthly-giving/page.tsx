import type { Metadata } from "next";
import { Award } from "lucide-react";
import { MonthlyGivingStepper } from "@/components/monthly/monthly-giving-stepper";

export const metadata: Metadata = {
  title: "Monthly Giving",
  description: "Become a monthly donor and provide sustained support to cancer patients. Small monthly donations create lasting impact.",
};

export default function MonthlyGivingPage() {
  return (
    <div>
      <section className="pt-4 pb-16 md:pb-24 bg-gradient-to-b from-varak-cream to-background">
        <div className="px-4 sm:px-6 lg:px-8">
          <MonthlyGivingStepper />
        </div>
      </section>

      <section className="py-16 bg-varak-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 p-6 bg-card border border-border">
            <Award className="h-8 w-8 text-varak-gold flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Benefits of Monthly Giving</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Tax deduction under 80G for every monthly donation</li>
                <li>Monthly impact reports showing how your donation helped</li>
                <li>Exclusive donor leaderboard recognition</li>
                <li>Cancel or pause anytime, no commitments</li>
                <li>Be part of a community of dedicated supporters</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
