"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, daysLeft, calculateProgress, amountToGo, getInitials } from "@/lib/utils";
import type { CampaignWithRelations } from "@/types";

const ribbonColorMap: Record<string, string> = {
  "Breast": "#E8618C",
  "Blood": "#E53E3E",
  "Lung": "#F5F5F5",
  "Brain": "#808080",
  "Bone": "#D4A843",
  "Liver": "#48BB78",
  "Stomach": "#9F7AEA",
  "Skin": "#1A202C",
  "Kidney": "#E87040",
  "Prostate": "#6B8DB2",
  "Ovarian": "#2E9E9E",
  "Pancreatic": "#6B4C8A",
  "Cervical": "#2E9E9E",
  "Leukemia": "#E87040",
  "Lymphoma": "#90EE90",
  "Childhood": "#D4A843",
  "Oral": "#8B0000",
  "Myeloma": "#8B0000",
};

function getRibbonColor(name: string): string {
  for (const [key, color] of Object.entries(ribbonColorMap)) {
    if (name.includes(key)) return color;
  }
  return "#C2553A";
}

type PlaceholderCampaign = {
  id: string;
  slug: string;
  title: string;
  beneficiaryName: string;
  beneficiaryImage: string | null;
  cancerTypeName: string;
  amountRaised: number;
  goalAmount: number;
  donorCount: number;
  endDate: string;
};

const placeholderCampaigns: PlaceholderCampaign[] = [
  {
    id: "ph1",
    slug: "help-baby-arjun-fight-leukemia",
    title: "My 3-year-old son Arjun needs a bone marrow transplant to survive",
    beneficiaryName: "Baby Arjun",
    beneficiaryImage: "/patients/ananya.jpg",
    cancerTypeName: "Blood Cancer (Leukemia)",
    amountRaised: 845000,
    goalAmount: 1200000,
    donorCount: 342,
    endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ph2",
    slug: "save-lakshmi-from-breast-cancer",
    title: "Please help my mother Lakshmi get her breast cancer surgery",
    beneficiaryName: "Lakshmi Devi",
    beneficiaryImage: "/patients/lakshmi.jpg",
    cancerTypeName: "Breast Cancer",
    amountRaised: 325000,
    goalAmount: 500000,
    donorCount: 187,
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ph3",
    slug: "rajesh-chemo-treatment",
    title: "I am a school teacher fighting for my life against blood cancer",
    beneficiaryName: "Rajesh Kumar",
    beneficiaryImage: "/patients/rajesh.jpg",
    cancerTypeName: "Blood Cancer (Leukemia)",
    amountRaised: 680000,
    goalAmount: 1000000,
    donorCount: 523,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function CampaignCard({ campaign, index }: { campaign: PlaceholderCampaign; index: number }) {
  const progress = calculateProgress(campaign.amountRaised, campaign.goalAmount);
  const days = daysLeft(campaign.endDate);
  const ribbonColor = getRibbonColor(campaign.cancerTypeName);
  const isUrgent = days <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white border border-border/40 overflow-hidden hover-lift flex flex-col min-w-[300px] md:min-w-0"
    >
      {/* Top ribbon accent */}
      <div className="h-[3px]" style={{ backgroundColor: ribbonColor }} />

      {/* Image area */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {campaign.beneficiaryImage ? (
          <Image
            src={campaign.beneficiaryImage}
            alt={campaign.beneficiaryName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-varak-cream">
            <span className="text-4xl font-heading text-varak-primary/20">
              {getInitials(campaign.beneficiaryName)}
            </span>
          </div>
        )}

        {/* Urgency badge */}
        {isUrgent && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase tracking-wider">
            <Clock className="h-3 w-3" />
            {days === 0 ? "Last Day!" : `${days} days left`}
          </div>
        )}
        {!isUrgent && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-2 py-1 text-xs font-bold uppercase tracking-wider">
            <Clock className="h-3 w-3" />
            {days} days left
          </div>
        )}

        {/* Cancer type badge */}
        <div
          className="absolute top-3 right-3 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: ribbonColor }}
        >
          {campaign.cancerTypeName.replace(" Cancer", "").replace(" (Leukemia)", "")}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-[15px] leading-snug mb-3 line-clamp-2 group-hover:text-varak-primary transition-colors">
          {campaign.title}
        </h3>

        {/* Progress */}
        <div className="mt-auto space-y-2">
          <div className="h-2 bg-foreground/5 overflow-hidden">
            <div
              className="h-full transition-all duration-700"
              style={{ width: `${progress}%`, backgroundColor: ribbonColor }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-foreground">
              {formatCurrency(campaign.amountRaised)} raised
            </span>
            <span className="font-medium text-varak-primary">
              {progress >= 100 ? "Fully funded" : `${formatCurrency(amountToGo(campaign.amountRaised, campaign.goalAmount))} to go`}
            </span>
          </div>

          {/* Donors count */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{campaign.donorCount === 0 ? "Be the first to donate" : `${campaign.donorCount} donors`}</span>
          </div>
        </div>

        {/* CTA */}
        <Button
          asChild
          size="sm"
          className="mt-4 w-full bg-varak-primary hover:bg-varak-primary-dark text-white rounded-none h-9"
        >
          <Link href={`/campaigns/${campaign.slug}`}>
            <Heart className="mr-1.5 h-3.5 w-3.5" />
            Donate Now
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

function fromDBCampaign(c: CampaignWithRelations): PlaceholderCampaign {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    beneficiaryName: c.beneficiaryName,
    beneficiaryImage: c.beneficiaryImage,
    cancerTypeName: c.cancerType?.name ?? "Cancer",
    amountRaised: Number(c.amountRaised),
    goalAmount: Number(c.goalAmount),
    donorCount: c._count?.donations ?? 0,
    endDate: (c.endDate ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toString(),
  };
}

export function TrendingFundraisers({ campaigns }: { campaigns?: CampaignWithRelations[] }) {
  const items = campaigns && campaigns.length > 0
    ? campaigns.slice(0, 3).map(fromDBCampaign)
    : placeholderCampaigns;

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-xs font-semibold text-red-500 uppercase tracking-[0.2em] mb-3">
              Urgent Appeals
            </span>
            <h2 className="font-heading text-3xl md:text-[2.75rem] leading-tight tracking-tight">
              People Who Need Your{" "}
              <span className="ribbon-gradient-text">Help Right Now</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              These patients are running out of time. Your donation today could be the difference between life and death.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/campaigns"
              className="group inline-flex items-center gap-2 text-sm font-medium text-varak-primary hover:gap-3 transition-all duration-300"
            >
              View all campaigns
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Cards - horizontal scroll on mobile, grid on desktop */}
        <div className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none">
          {items.map((campaign, i) => (
            <div key={campaign.id} className="snap-start">
              <CampaignCard campaign={campaign} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
