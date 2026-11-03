import Link from "next/link";
import { Heart, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, calculateProgress, timeAgo } from "@/lib/utils";
import { DonationModal } from "@/components/campaigns/donation-modal";
import type { CampaignWithRelations } from "@/types";

/* Map cancer types to their ribbon colors */
const ribbonColorMap: Record<string, string> = {
  "Breast": "#E8618C",
  "Blood": "#E53E3E",
  "Lung": "#C0C0C0",
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
};

function getRibbonColor(name?: string): string {
  if (!name) return "#DAB5AA";
  for (const [key, color] of Object.entries(ribbonColorMap)) {
    if (name.includes(key)) return color;
  }
  return "#DAB5AA";
}

export function CampaignCard({
  campaign,
}: {
  campaign: CampaignWithRelations;
}) {
  const progress = calculateProgress(campaign.amountRaised, campaign.goalAmount);
  const ribbonColor = getRibbonColor(campaign.cancerType?.name);

  return (
    <Link
      href={`/campaigns/${campaign.slug}`}
      className="group block bg-white rounded-none border border-border/40 overflow-hidden hover-lift"
    >
      {/* Ribbon color accent at top */}
      <div className="h-[3px]" style={{ backgroundColor: ribbonColor }} />

      {/* Image */}
      <div className="aspect-[4/3] relative bg-gradient-to-br from-varak-primary/5 to-varak-pink/5 overflow-hidden">
        {campaign.beneficiaryImage ? (
          <img
            src={campaign.beneficiaryImage}
            alt={campaign.beneficiaryName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 60 80" className="w-10 h-14 opacity-20" fill="none">
              <path
                d="M30 38 C22 26 12 22 15 12 C16.5 7 22 9 30 18 C38 9 43.5 7 45 12 C48 22 38 26 30 38Z"
                fill={ribbonColor}
              />
              <path
                d="M30 38 C27 46 22 62 20 72 M30 38 C33 46 38 62 40 72"
                stroke={ribbonColor}
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </div>
        )}
        {campaign.isUrgent && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0 shadow-sm">
            Urgent
          </Badge>
        )}
        {campaign.verificationStatus === "FULLY_VERIFIED" && (
          <Badge className="absolute top-3 right-3 bg-varak-primary text-white border-0 shadow-sm">
            Verified
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Cancer type with ribbon dot */}
        {campaign.cancerType && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <div
              className="w-2 h-2 rounded-none flex-shrink-0"
              style={{ backgroundColor: ribbonColor }}
            />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: ribbonColor }}>
              {campaign.cancerType.name}
            </span>
          </div>
        )}

        <h3 className="font-semibold text-lg mt-1 mb-2 line-clamp-2 group-hover:text-varak-primary transition-colors duration-300">
          {campaign.title}
        </h3>

        {/* Location */}
        {campaign.state && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <MapPin className="h-3 w-3" />
            {campaign.district?.name && `${campaign.district.name}, `}
            {campaign.state.name}
          </div>
        )}

        {/* Progress */}
        <Progress value={progress} className="h-2 mb-3" />

        <div className="flex items-center justify-between text-sm mb-4">
          <div>
            <span className="font-semibold text-varak-primary">
              {formatCurrency(campaign.amountRaised)}
            </span>
            <span className="text-muted-foreground">
              {" "}of {formatCurrency(campaign.goalAmount)}
            </span>
          </div>
          <span className="text-muted-foreground">{progress}%</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            {campaign.donorCount} donors
          </div>
          <span className="text-xs text-muted-foreground">
            {timeAgo(campaign.createdAt)}
          </span>
        </div>

        <DonationModal campaignId={campaign.id} campaignTitle={campaign.title}>
          <Button
            className="w-full mt-4 bg-varak-primary hover:bg-varak-primary-dark text-white rounded-none"
            size="sm"
          >
            <Heart className="mr-2 h-3 w-3" />
            Donate Now
          </Button>
        </DonationModal>
      </div>
    </Link>
  );
}
