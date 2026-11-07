// Badges are worked out from real records every time; nothing is stored or handed out.
// Amount never matters, so no donor ranks above another because of how much they gave.

export type BadgeGroup = "Beginnings" | "Impact" | "Loyalty" | "Reach and care";

export const BADGES: { id: string; name: string; group: BadgeGroup; rule: string }[] = [
  { id: "first-light", name: "First Light", group: "Beginnings", rule: "Be the first donor on a campaign" },
  { id: "early-supporter", name: "Early Supporter", group: "Beginnings", rule: "Give in a campaign's first 24 hours" },
  { id: "founding-supporter", name: "Founding Supporter", group: "Beginnings", rule: "Be one of Varak's first 100 donors" },
  { id: "spark", name: "Spark", group: "Beginnings", rule: "Give to a campaign that had gone 14 days without a donation" },
  { id: "last-mile", name: "Last Mile", group: "Impact", rule: "Give when a campaign is 90% funded or more" },
  { id: "hero", name: "Hero", group: "Impact", rule: "Take a campaign over its goal" },
  { id: "little-light", name: "Little Light", group: "Impact", rule: "Help a campaign for a patient under 18" },
  { id: "guardian", name: "Guardian", group: "Loyalty", rule: "Give monthly for 3 months" },
  { id: "steadfast", name: "Steadfast", group: "Loyalty", rule: "Give in 12 different months" },
  { id: "returning-friend", name: "Returning Friend", group: "Loyalty", rule: "Give in 3 different months" },
  { id: "companion", name: "Companion", group: "Loyalty", rule: "Give to the same campaign twice" },
  { id: "pathfinder", name: "Pathfinder", group: "Reach and care", rule: "Support 3 different cancer types" },
  { id: "explorer", name: "Explorer", group: "Reach and care", rule: "Support campaigns in 3 different states" },
  { id: "encourager", name: "Encourager", group: "Reach and care", rule: "Leave a comment on a campaign" },
  { id: "quiet-giver", name: "Quiet Giver", group: "Reach and care", rule: "Give anonymously (only you see this)" },
];

type Gift = { id: string; amount: number; createdAt: Date };

export type BadgeInput = {
  /** The donor's own completed donations. */
  donations: (Gift & { campaignId: string; isAnonymous: boolean })[];
  campaigns: Record<
    string,
    { createdAt: Date; goalAmount: number; cancerTypeId: string | null; stateId: string | null; beneficiaryAge: number | null }
  >;
  /** Every completed donation on those campaigns, from anyone, oldest first. */
  campaignDonations: Record<string, Gift[]>;
  /** shortcut: whole months since each subscription started, because individual monthly payments are not stored; count them once they are. */
  subscriptionMonths: number;
  commentCount: number;
  isFoundingDonor: boolean;
};

const DAY = 24 * 60 * 60 * 1000;

export function earnedBadges(i: BadgeInput): Set<string> {
  const earned = new Set<string>();
  const add = (id: string, ok: boolean) => ok && earned.add(id);

  const months = new Set(i.donations.map((d) => `${d.createdAt.getFullYear()}-${d.createdAt.getMonth()}`));
  const perCampaign = new Map<string, number>();
  const cancerTypes = new Set<string>();
  const states = new Set<string>();

  for (const d of i.donations) {
    perCampaign.set(d.campaignId, (perCampaign.get(d.campaignId) ?? 0) + 1);
    const c = i.campaigns[d.campaignId];
    if (!c) continue;
    if (c.cancerTypeId) cancerTypes.add(c.cancerTypeId);
    if (c.stateId) states.add(c.stateId);

    // Everything given before this donation on the same campaign (ties keep list order)
    const all = i.campaignDonations[d.campaignId] ?? [];
    const at = all.findIndex((g) => g.id === d.id);
    const before = at === -1 ? all.filter((g) => g.createdAt < d.createdAt) : all.slice(0, at);
    const raisedBefore = before.reduce((s, g) => s + g.amount, 0);
    const lastActivity = before.length ? before[before.length - 1].createdAt : c.createdAt;

    add("first-light", before.length === 0);
    add("early-supporter", d.createdAt.getTime() - c.createdAt.getTime() <= DAY);
    add("spark", d.createdAt.getTime() - lastActivity.getTime() >= 14 * DAY);
    add("last-mile", c.goalAmount > 0 && raisedBefore >= 0.9 * c.goalAmount);
    add("hero", c.goalAmount > 0 && raisedBefore < c.goalAmount && raisedBefore + d.amount >= c.goalAmount);
    add("little-light", c.beneficiaryAge !== null && c.beneficiaryAge < 18);
    add("quiet-giver", d.isAnonymous);
  }

  add("founding-supporter", i.isFoundingDonor);
  add("guardian", i.subscriptionMonths >= 3);
  add("steadfast", months.size >= 12);
  add("returning-friend", months.size >= 3);
  add("companion", [...perCampaign.values()].some((n) => n >= 2));
  add("pathfinder", cancerTypes.size >= 3);
  add("explorer", states.size >= 3);
  add("encourager", i.commentCount >= 1);
  return earned;
}
