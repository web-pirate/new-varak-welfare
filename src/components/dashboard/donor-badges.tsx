import {
  Anchor, Baby, Compass, Crown, Flag, HeartHandshake, Lock, Map, MessageCircleHeart,
  Moon, ShieldCheck, Sparkles, Sunrise, Trophy, Users, Zap, type LucideIcon,
} from "lucide-react";
import { BADGES, type BadgeGroup } from "@/lib/donor-badges";
import { cn } from "@/lib/utils";

// light / base / dark shades of each group's colour, for the glossy gradient
const GROUPS: { name: BadgeGroup; shades: [string, string, string] }[] = [
  { name: "Beginnings", shades: ["#FFB3CB", "#E8618C", "#B03A63"] },
  { name: "Impact", shades: ["#FFB48A", "#E8703A", "#AD441A"] },
  { name: "Loyalty", shades: ["#8FE8E0", "#2E9E9E", "#186565"] },
  { name: "Reach and care", shades: ["#D3B3F5", "#8B5CC6", "#58328F"] },
];

const ICONS: Record<string, LucideIcon> = {
  "first-light": Sparkles,
  "early-supporter": Sunrise,
  "founding-supporter": Crown,
  spark: Zap,
  "last-mile": Flag,
  hero: Trophy,
  "little-light": Baby,
  guardian: ShieldCheck,
  steadfast: Anchor,
  "returning-friend": HeartHandshake,
  companion: Users,
  pathfinder: Compass,
  explorer: Map,
  encourager: MessageCircleHeart,
  "quiet-giver": Moon,
};

const SHIELD = "M40 4 L73 15 V44 C73 65 58 80 40 88 C22 80 7 65 7 44 V15 Z";
const GREY: [string, string, string] = ["#e4e1dc", "#c9c5be", "#a29d95"];

function BadgeArt({ id, shades, earned }: { id: string; shades: [string, string, string]; earned: boolean }) {
  const [light, base, dark] = earned ? shades : GREY;
  const Icon = ICONS[id] ?? Sparkles;
  return (
    <div className={cn("relative h-24 w-[5.25rem] shrink-0", earned && "drop-shadow-md transition-transform group-hover:-translate-y-1 group-hover:scale-105")}>
      <svg viewBox="0 0 80 92" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={light} />
            <stop offset="0.55" stopColor={base} />
            <stop offset="1" stopColor={dark} />
          </linearGradient>
        </defs>
        {/* gold rim, dark outline, glossy body */}
        <path d={SHIELD} fill={earned ? "#F6C945" : "#b5b0a8"} stroke={earned ? "#7A4E12" : "#8b867e"} strokeWidth="5" strokeLinejoin="round" />
        <path d={SHIELD} fill={`url(#g-${id})`} transform="translate(40 46) scale(0.84) translate(-40 -46)" />
        <path d="M16 20 L40 11 L64 20 V30 C48 24 32 24 16 30 Z" fill="white" opacity={earned ? 0.35 : 0.25} />
        {earned && (
          <g fill="#FFE27A" stroke="#7A4E12" strokeWidth="1.2" strokeLinejoin="round">
            {[26, 40, 54].map((x, i) => (
              <path key={x} transform={`translate(${x} ${i === 1 ? 10 : 13})`} d="M0 -5 L1.6 -1.6 L5 -1.2 L2.5 1.2 L3.1 5 L0 3.2 L-3.1 5 L-2.5 1.2 L-5 -1.2 L-1.6 -1.6 Z" />
            ))}
          </g>
        )}
      </svg>
      <Icon
        className={cn("absolute left-1/2 top-[52%] h-8 w-8 -translate-x-1/2 -translate-y-1/2", earned ? "text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.35)]" : "text-white/70")}
        strokeWidth={2.4}
        aria-hidden
      />
      {!earned && (
        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/70 text-white">
          <Lock className="h-3 w-3" aria-hidden />
        </span>
      )}
    </div>
  );
}

export function DonorBadges({ earned }: { earned: Set<string> }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-border/50 mb-8">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-heading text-xl">Your badges</h2>
        <span className="text-sm font-semibold text-varak-primary">
          {earned.size} of {BADGES.length}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        {earned.size > 0
          ? `Well done! You've earned ${earned.size} ${earned.size === 1 ? "badge" : "badges"}, each one from something kind you did.`
          : "Make your first donation to earn your first badge."}
      </p>

      <div className="space-y-7">
        {GROUPS.map((g) => (
          <section key={g.name} aria-label={g.name}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">{g.name}</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BADGES.filter((b) => b.group === g.name).map((b) => {
                const has = earned.has(b.id);
                return (
                  <li key={b.id} className={cn("group flex items-center gap-3 rounded-xl p-3", has ? "bg-varak-cream" : "bg-muted/40")}>
                    <BadgeArt id={b.id} shades={g.shades} earned={has} />
                    <div>
                      <p className={cn("text-sm font-semibold", !has && "text-muted-foreground")}>{b.name}</p>
                      <p className="text-xs text-muted-foreground">{has ? "Earned. Thank you!" : b.rule}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
