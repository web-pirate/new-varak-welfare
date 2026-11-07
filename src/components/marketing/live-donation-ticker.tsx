"use client";

import { formatCurrency, getInitials } from "@/lib/utils";

type DonationItem = {
  id: string;
  donorName: string | null;
  isAnonymous: boolean;
  amount: number | { toNumber(): number } | unknown;
  campaign: { title: string; slug: string };
};

const placeholderDonations: DonationItem[] = [
  { id: "p1", donorName: "Roshni Mehta", isAnonymous: false, amount: 5000, campaign: { title: "Help Baby Arjun Fight Leukemia", slug: "help-baby-arjun" } },
  { id: "p2", donorName: "Amit Patel", isAnonymous: false, amount: 2500, campaign: { title: "Save Lakshmi from Breast Cancer", slug: "save-lakshmi" } },
  { id: "p3", donorName: null, isAnonymous: true, amount: 10000, campaign: { title: "Priya Needs a Bone Marrow Transplant", slug: "priya-transplant" } },
  { id: "p4", donorName: "Suresh Kumar", isAnonymous: false, amount: 1000, campaign: { title: "Rajesh's Chemo Treatment Fund", slug: "rajesh-chemo" } },
  { id: "p5", donorName: "Deepa Nair", isAnonymous: false, amount: 7500, campaign: { title: "Little Ananya's Cancer Surgery", slug: "ananya-surgery" } },
  { id: "p6", donorName: "Vikram Singh", isAnonymous: false, amount: 3000, campaign: { title: "Help Mohammed Beat Prostate Cancer", slug: "mohammed-prostate" } },
  { id: "p7", donorName: "Priyanka Sharma", isAnonymous: false, amount: 15000, campaign: { title: "Meera's Radiation Therapy Fund", slug: "meera-radiation" } },
  { id: "p8", donorName: null, isAnonymous: true, amount: 500, campaign: { title: "Support Kiran's Fight Against Lymphoma", slug: "kiran-lymphoma" } },
  { id: "p9", donorName: "Rahul Verma", isAnonymous: false, amount: 2000, campaign: { title: "Save 5-Year-Old Arjun", slug: "save-arjun" } },
  { id: "p10", donorName: "Kavita Joshi", isAnonymous: false, amount: 5000, campaign: { title: "Sunita's Ovarian Cancer Treatment", slug: "sunita-ovarian" } },
];

function DonationChip({ donation }: { donation: DonationItem }) {
  const name = donation.isAnonymous || !donation.donorName
    ? "Someone Kind"
    : donation.donorName;
  const initials = donation.isAnonymous ? "SK" : getInitials(name);
  const amount = typeof donation.amount === "number"
    ? donation.amount
    : typeof donation.amount === "object" && donation.amount !== null && "toNumber" in (donation.amount as Record<string, unknown>)
      ? (donation.amount as { toNumber(): number }).toNumber()
      : Number(donation.amount);

  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/80 backdrop-blur-sm border border-border/40 flex-shrink-0 mx-2">
      <div className="w-7 h-7 rounded-full bg-varak-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-varak-primary">{initials}</span>
      </div>
      <span className="text-sm whitespace-nowrap">
        <strong className="text-foreground">{name.split(" ")[0]}</strong>
        <span className="text-muted-foreground"> donated </span>
        <strong className="text-varak-primary">{formatCurrency(amount)}</strong>
        <span className="text-muted-foreground"> to </span>
        <em className="text-foreground/80 not-italic font-medium">{donation.campaign.title.length > 30 ? donation.campaign.title.slice(0, 30) + "..." : donation.campaign.title}</em>
      </span>
    </div>
  );
}

export function LiveDonationTicker({ donations }: { donations?: DonationItem[] }) {
  const items = donations && donations.length > 0 ? donations : placeholderDonations;
  const doubled = [...items, ...items];

  return (
    <section className="relative py-3 bg-varak-cream border-y border-border/40 overflow-hidden">
      {/* Live indicator */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1.5 bg-varak-cream pr-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-green-700">Live</span>
      </div>

      {/* Scrolling ticker */}
      <div className="flex animate-ticker w-max">
        {doubled.map((donation, i) => (
          <DonationChip key={`${donation.id}-${i}`} donation={donation} />
        ))}
      </div>

      {/* Fade edges */}
      <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-varak-cream to-transparent z-[5] pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-varak-cream to-transparent z-[5] pointer-events-none" />
    </section>
  );
}
