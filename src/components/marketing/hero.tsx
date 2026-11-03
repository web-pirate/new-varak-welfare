"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Heart, Shield, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  { value: 0, suffix: "%", label: "Platform Fee", sublabel: "Every rupee goes to patient", icon: Sparkles, color: "#C2553A" },
  { value: 50, suffix: "Cr+", label: "Funds Raised", sublabel: "", icon: Heart, color: "#E8618C" },
  { value: 5.5, suffix: "M+", label: "Lives Touched", sublabel: "", icon: Shield, color: "#D4A843" },
];

const trustPoints = [
  { icon: Shield, text: "3-Tier Verified Campaigns" },
  { icon: Clock, text: "24hr Fund Disbursals" },
  { icon: Heart, text: "Tax Benefits under 80G" },
];

/* Marquee images — happy families after cancer treatment */
const marqueeRow1 = [
  "/marquee/1.jpg",
  "/marquee/2.jpg",
  "/marquee/3.jpg",
  "/marquee/4.jpg",
  "/marquee/5.jpg",
];
const marqueeRow2 = [
  "/marquee/6.jpg",
  "/marquee/7.jpg",
  "/marquee/8.jpg",
  "/marquee/9.jpg",
  "/patients/lakshmi.jpg",
];

function ScrollingMarquee() {
  const row1 = [...marqueeRow1, ...marqueeRow1];
  const row2 = [...marqueeRow2, ...marqueeRow2];

  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.3] z-[1] pointer-events-none">
      <div className="absolute inset-0 flex flex-col justify-center gap-5">
        {/* Row 1 — scrolls left */}
        <div
          className="flex gap-5 w-max animate-marquee-left"
        >
          {row1.map((src, i) => (
            <div
              key={`r1-${i}`}
              className="w-[480px] h-[320px] flex-shrink-0 rounded-xl overflow-hidden"
            >
              <Image
                src={src}
                alt=""
                width={480}
                height={320}
                className="w-full h-full object-cover grayscale"
              />
            </div>
          ))}
        </div>

        {/* Row 2 — scrolls right */}
        <div
          className="flex gap-5 w-max animate-marquee-right"
        >
          {row2.map((src, i) => (
            <div
              key={`r2-${i}`}
              className="w-[480px] h-[320px] flex-shrink-0 rounded-xl overflow-hidden"
            >
              <Image
                src={src}
                alt=""
                width={480}
                height={320}
                className="w-full h-full object-cover grayscale"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const patients = [
  {
    name: "Priya Sharma",
    age: 34,
    type: "Breast Cancer",
    color: "#E8618C",
    image: "/patients/priya.jpg",
    story:
      "A mother of two from Jaipur, Priya completed 6 cycles of chemo thanks to 342 donors who believed in her fight.",
    raised: "₹4.2L",
    goal: "₹5L",
    progress: 84,
  },
  {
    name: "Rajesh Kumar",
    age: 45,
    type: "Leukemia",
    color: "#E87040",
    image: "/patients/rajesh.jpg",
    story:
      "A school teacher from Patna who received a life-saving bone marrow transplant funded entirely by this community.",
    raised: "₹8.1L",
    goal: "₹10L",
    progress: 81,
  },
  {
    name: "Ananya Patel",
    age: 8,
    type: "Childhood Cancer",
    color: "#D4A843",
    image: "/patients/ananya.jpg",
    story:
      "Little Ananya beat neuroblastoma and is back in school. Her family calls every donor their guardian angel.",
    raised: "₹6.5L",
    goal: "₹6.5L",
    progress: 100,
  },
  {
    name: "Mohammed Irfan",
    age: 52,
    type: "Prostate Cancer",
    color: "#6B8DB2",
    image: "/patients/mohammed.jpg",
    story:
      "A retired army veteran whose regiment and 200+ strangers united to fund his treatment in Lucknow.",
    raised: "₹3.5L",
    goal: "₹5L",
    progress: 70,
  },
  {
    name: "Lakshmi Devi",
    age: 41,
    type: "Ovarian Cancer",
    color: "#2E9E9E",
    image: "/patients/lakshmi.jpg",
    story:
      "A daily wage worker from Chennai whose surgery was fully funded in just 11 days by compassionate donors.",
    raised: "₹2.8L",
    goal: "₹3L",
    progress: 93,
  },
];

function PatientCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % patients.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const patient = patients[current];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-varak-primary/50">
          Patient Stories
        </span>
        <div className="flex gap-1.5">
          {patients.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === current
                  ? "w-5 bg-varak-primary"
                  : "w-1.5 bg-foreground/10 hover:bg-foreground/20"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="glass-card rounded-none ring-1 ring-foreground/10 overflow-hidden relative min-h-[220px]">
        {/* Colored accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] transition-colors duration-500"
          style={{ backgroundColor: patient.color }}
        />

        <div className="p-5 pt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-3.5">
                <div
                  className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-sm"
                >
                  <Image
                    src={patient.image}
                    alt={patient.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground leading-tight">
                    {patient.name}, {patient.age}
                  </h4>
                  <span
                    className="inline-block text-[9px] font-semibold px-1.5 py-px rounded-sm mt-0.5 text-white tracking-wider"
                    style={{ backgroundColor: patient.color }}
                  >
                    {patient.type}
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
                &ldquo;{patient.story}&rdquo;
              </p>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-foreground">
                    {patient.raised} raised
                  </span>
                  <span className="text-muted-foreground">
                    of {patient.goal}
                  </span>
                </div>
                <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: patient.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${patient.progress}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.15,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const yOrb = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-varak-cream"
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
        style={{ y: yText, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-0"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left content — 7 cols */}
          <div className="lg:col-span-7">
            {/* Ribbon colors bar */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
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
              className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              Help cancer patients across India get the treatment they deserve.
              Start a fundraiser in minutes — with{" "}
              <strong className="text-varak-primary font-semibold">zero platform fees</strong>.
              Every ribbon color, every cancer type, one mission.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Button
                asChild
                size="lg"
                className="bg-varak-primary hover:bg-varak-primary-dark text-white text-base px-8 h-12 rounded-none shadow-[0_8px_30px_rgba(194,85,58,0.25)] hover:shadow-[0_12px_40px_rgba(194,85,58,0.35)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="/start-fundraiser">
                  Start a Fundraiser
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-varak-pink/20 text-varak-pink hover:bg-varak-pink/5 text-base px-8 h-12 rounded-none backdrop-blur-sm bg-white/50 hover:border-varak-pink/30 transition-all duration-300"
              >
                <Link href="/campaigns">
                  <Heart className="mr-2 h-4 w-4" />
                  Donate Now
                </Link>
              </Button>
            </motion.div>

            {/* Trust points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-x-6 gap-y-3 mb-6"
            >
              {trustPoints.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="w-6 h-6 rounded-none bg-varak-primary/8 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-3 w-3 text-varak-primary" />
                  </div>
                  {text}
                </motion.div>
              ))}
            </motion.div>

            {/* Payment/trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="flex items-center gap-3 text-[10px] text-muted-foreground/60"
            >
              <span className="uppercase tracking-[0.1em] font-medium">Secured by</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-foreground/5 font-semibold text-foreground/40">Razorpay</span>
                <span className="px-2 py-0.5 bg-foreground/5 font-semibold text-foreground/40">SSL</span>
                <span className="px-2 py-0.5 bg-foreground/5 font-semibold text-foreground/40">80G</span>
              </div>
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
                        <div className="text-[8px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                          {stat.label}
                        </div>
                        {stat.sublabel && (
                          <div className="text-[7px] text-varak-primary/60 font-medium mt-0.5 leading-tight">
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
