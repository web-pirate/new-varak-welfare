"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IndianRupee, Users, Megaphone, BadgeCheck } from "lucide-react";

function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

// totalRaised is in rupees; show it in Indian units
function formatRupees(n: number) {
  if (n >= 1e7) return `${+(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `${+(n / 1e5).toFixed(2)}L`;
  return n.toLocaleString("en-IN");
}

type PlatformStats = {
  totalRaised: number;
  totalCampaigns: number;
  totalDonors: number;
};

const stats = [
  {
    icon: IndianRupee,
    label: "Funds Raised",
    target: 50,
    suffix: "Cr+",
    prefix: "",
    fallbackDisplay: "50Cr+",
    useFromDB: "totalRaised" as const,
  },
  {
    icon: Users,
    label: "Generous Donors",
    target: 550000,
    suffix: "+",
    prefix: "",
    fallbackDisplay: "5.5L+",
    useFromDB: "totalDonors" as const,
  },
  {
    icon: Megaphone,
    label: "Campaigns Funded",
    target: 10000,
    suffix: "+",
    prefix: "",
    fallbackDisplay: "10K+",
    useFromDB: "totalCampaigns" as const,
  },
  {
    icon: BadgeCheck,
    label: "Platform Fee",
    target: 0,
    suffix: "%",
    prefix: "",
    fallbackDisplay: "0%",
    useFromDB: null,
  },
];

export function ImpactCounterStrip({ platformStats }: { platformStats?: PlatformStats }) {
  return (
    <section className="relative py-14 bg-gradient-to-br from-[#1a1a1a] via-[#2d1f1a] to-[#1a1a1a] overflow-hidden">
      {/* Subtle grain */}
      <div className="grain-overlay absolute inset-0 pointer-events-none opacity-50" />

      {/* Ambient ribbon color accents */}
      <div className="ambient-orb absolute -top-20 -left-20 w-[300px] h-[300px] bg-gradient-to-br from-varak-primary/15 to-transparent" />
      <div className="ambient-orb absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-gradient-to-br from-varak-pink/10 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => {
            const dbVal = stat.useFromDB && platformStats ? platformStats[stat.useFromDB] : 0;
            const useDB = stat.useFromDB && dbVal > 0;
            const displayTarget = useDB ? dbVal : stat.target;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-3">
                  <stat.icon className="h-5 w-5 text-varak-warm-wash" />
                </div>
                <div className="text-3xl md:text-4xl font-heading text-white tracking-tight mb-1">
                  {stat.target === 0 ? (
                    <span>0<span className="text-varak-gold text-xl">%</span></span>
                  ) : useDB && stat.useFromDB === "totalRaised" ? (
                    <span className="tabular-nums">{formatRupees(displayTarget)}</span>
                  ) : useDB ? (
                    <AnimatedCounter target={displayTarget} suffix={stat.suffix} prefix={stat.prefix} />
                  ) : (
                    <span className="tabular-nums">{stat.fallbackDisplay}</span>
                  )}
                </div>
                <div className="text-xs text-white/50 font-medium uppercase tracking-[0.15em]">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
