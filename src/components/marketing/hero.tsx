"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Heart, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollingMarquee } from "@/components/marketing/scrolling-marquee";
import { PatientCarousel } from "@/components/marketing/patient-carousel";

/* Animated ribbon SVG — the universal cancer awareness symbol */
function RibbonSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 300" className={className} fill="none">
      <defs>
        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8618C" />
          <stop offset="25%" stopColor="#C2553A" />
          <stop offset="50%" stopColor="#D4A843" />
          <stop offset="75%" stopColor="#2E9E9E" />
          <stop offset="100%" stopColor="#E87040" />
        </linearGradient>
      </defs>
      <path
        d="M100 140 C60 80 10 60 30 20 C45 -5 75 10 100 50 C125 10 155 -5 170 20 C190 60 140 80 100 140Z"
        fill="url(#ribbonGrad)"
        opacity="0.9"
      />
      <path
        d="M100 140 C85 180 60 240 50 280 M100 140 C115 180 140 240 150 280"
        stroke="url(#ribbonGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
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

  return <span ref={ref}>{count}{suffix}</span>;
}

/* Ribbon color dots representing cancer types */
const ribbonColors = [
  { color: "#E8618C", label: "Breast" },
  { color: "#6B4C8A", label: "Pancreatic" },
  { color: "#D4A843", label: "Childhood" },
  { color: "#2E9E9E", label: "Ovarian" },
  { color: "#E87040", label: "Leukemia" },
  { color: "#6B8DB2", label: "Prostate" },
  { color: "#808080", label: "Brain" },
  { color: "#8B0000", label: "Myeloma" },
];

const heroStats = [
  { value: 0, suffix: "%", label: "Platform Fee", sublabel: "All to patient", icon: Sparkles, color: "#C2553A" },
  { value: 50, suffix: "Cr+", label: "Funds Raised", sublabel: "", icon: Heart, color: "#E8618C" },
  { value: 5.5, suffix: "M+", label: "Lives Touched", sublabel: "", icon: Shield, color: "#D4A843" },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const yOrb = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative lg:min-h-screen flex items-center overflow-hidden bg-varak-cream"
    >
      {/* Scrolling image marquee — behind everything */}
      <ScrollingMarquee />

      {/* Grain */}
      <div className="grain-overlay absolute inset-0 pointer-events-none z-[2]" />

      {/* Multi-ribbon gradient orbs — each represents a cancer type color */}
      <motion.div
        style={{ y: yOrb }}
        className="ambient-orb absolute -top-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-varak-primary/10 to-varak-warm-wash/8 animate-float"
      />
      <motion.div
        style={{ y: yOrb }}
        className="ambient-orb absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-varak-pink/10 to-rose-200/8 animate-float-delayed"
      />
      <div className="ambient-orb absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-gradient-to-br from-varak-gold/8 to-amber-200/5 animate-float-slow" />
      <div className="ambient-orb absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-gradient-to-br from-varak-teal/6 to-cyan-200/4 animate-float" />

      {/* Decorative ribbon — large, faded in background */}
      <div className="absolute top-10 right-10 lg:right-[5%] opacity-[0.04] pointer-events-none z-0">
        <RibbonSVG className="w-[300px] h-[450px] lg:w-[400px] lg:h-[600px]" />
      </div>

      {/* Ribbon bar at top */}
      <div className="absolute top-0 left-0 right-0 ribbon-bar z-[5]" />

      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-0"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left content — 7 cols */}
          <div className="lg:col-span-7">
            {/* Ribbon colors bar */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2.5 mb-8"
            >
              <Link
                href="/cancer-types#cancer-types"
                className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm ring-1 ring-foreground/10 rounded-none px-4 py-2.5 shadow-sm transition-colors hover:bg-white/90 hover:ring-varak-primary/40"
              >
                <div className="flex -space-x-0.5">
                  {ribbonColors.slice(0, 6).map(({ color }) => (
                    <div
                      key={color}
                      className="w-2.5 h-2.5 rounded-none ring-1 ring-white"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold tracking-[0.12em] uppercase text-varak-primary/80">
                  Fighting 24+ Cancer Types
                </span>
                <ArrowRight className="h-3 w-3 text-varak-primary/80" />
              </Link>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-[2.75rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] leading-[1.05] tracking-tight text-foreground mb-6"
            >
              Every life{" "}
              <br className="hidden sm:block" />
              deserves a{" "}
              <span className="relative inline-block">
                <span className="ribbon-gradient-text">fighting</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -bottom-1 left-0 w-full h-3 bg-varak-pink/20 origin-left -z-10"
                />
              </span>
              <br className="hidden sm:block" />
              <span className="italic text-varak-primary">chance.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-foreground/80 max-w-xl mb-10 leading-relaxed"
            >
              Help cancer patients across India get the treatment they deserve.
              Give to a verified fundraiser — with{" "}
              <strong className="text-varak-primary font-semibold">zero platform fees</strong>.
              Every ribbon color, every cancer type, one mission.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6"
            >
              <Button
                asChild
                size="lg"
                className="bg-varak-primary hover:bg-varak-primary-dark text-white text-base px-8 h-12 rounded-none shadow-[0_8px_30px_rgba(194,85,58,0.25)] hover:shadow-[0_12px_40px_rgba(194,85,58,0.35)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="/campaigns" onClick={() => track("hero_donate_click")}>
                  <Heart className="mr-2 h-4 w-4" />
                  Donate Now
                </Link>
              </Button>
              <Link
                href="/start-fundraiser"
                className="inline-flex items-center h-12 text-base font-medium text-varak-primary underline underline-offset-4 hover:text-varak-primary-dark"
              >
                Start a Fundraiser
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right — Stats + Patient carousel — 5 cols */}
          <div className="lg:col-span-5 relative">
            <div className="flex flex-col gap-4">
              {/* Compact stats strip */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="glass-card rounded-none ring-1 ring-foreground/10 p-3.5"
              >
                <div className="grid grid-cols-3 divide-x divide-foreground/8">
                  {heroStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center gap-2 justify-center px-2"
                    >
                      <div
                        className="w-7 h-7 rounded-none flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: stat.color }}
                      >
                        <stat.icon className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <div className="text-base font-heading text-foreground tracking-tight leading-none">
                          {stat.value === 5.5 ? (
                            <span>
                              5.5
                              <span className="text-varak-gold text-xs">
                                M+
                              </span>
                            </span>
                          ) : stat.value === 0 ? (
                            <span>
                              0
                              <span className="text-varak-pink text-xs">%</span>
                            </span>
                          ) : (
                            <span>
                              <AnimatedCounter target={stat.value} />
                              <span className="text-varak-pink text-xs">
                                Cr+
                              </span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                          {stat.label}
                        </div>
                        {stat.sublabel && (
                          <div className="text-xs text-varak-primary/60 font-medium mt-0.5 leading-tight">
                            {stat.sublabel}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Patient carousel */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <PatientCarousel />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-varak-cream to-transparent z-[3] pointer-events-none" />
    </section>
  );
}
