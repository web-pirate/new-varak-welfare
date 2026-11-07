"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, TrendingUp, BadgeCheck, Users } from "lucide-react";

const stories = [
  {
    name: "Priya Sharma",
    age: 34,
    cancer: "Leukemia",
    ribbonColor: "#E87040",
    image: "/patients/priya.jpg",
    initials: "PS",
    struggle:
      "When Priya was diagnosed with leukemia, her family of daily-wage workers in Jaipur couldn't afford the Rs 12 lakh bone marrow transplant. With two young children depending on her, giving up wasn't an option.",
    hope:
      "847 donors came together in just 3 weeks. Today, Priya is cancer-free, back to cooking lunch for her kids, and volunteers at her local hospital to help other patients find hope.",
    raised: "₹12,00,000",
    donors: 847,
    daysToGoal: 21,
    verified: true,
  },
  {
    name: "Rajesh Kumar",
    age: 45,
    cancer: "Lung Cancer",
    ribbonColor: "#808080",
    image: "/patients/rajesh.jpg",
    initials: "RK",
    struggle:
      "Rajesh, a beloved school teacher from Patna, was told he had Stage 3 lung cancer. His students and colleagues watched helplessly as he couldn't afford the immunotherapy his oncologist recommended.",
    hope:
      "His student started a campaign that went viral — 523 donors, including former students across India, raised Rs 8.5 lakhs. Rajesh completed treatment and returned to his classroom to a standing ovation.",
    raised: "₹8,50,000",
    donors: 523,
    daysToGoal: 18,
    verified: true,
  },
  {
    name: "Little Ananya",
    age: 8,
    cancer: "Brain Tumor",
    ribbonColor: "#808080",
    image: "/patients/ananya.jpg",
    initials: "AP",
    struggle:
      "8-year-old Ananya was diagnosed with a brain tumor just weeks before her school annual day. Her parents, who run a small tea stall in Lucknow, were devastated — the surgery alone would cost Rs 15 lakhs.",
    hope:
      "Within 14 days, 1,203 strangers became her guardian angels. Ananya's surgery was successful, and she performed at her school's annual day — her parents say every donor saved their world.",
    raised: "₹15,00,000",
    donors: 1203,
    daysToGoal: 14,
    verified: true,
  },
  {
    name: "Mohammed Irfan",
    age: 52,
    cancer: "Prostate Cancer",
    ribbonColor: "#6B8DB2",
    image: "/patients/mohammed.jpg",
    initials: "MI",
    struggle:
      "A retired army veteran, Mohammed was diagnosed with prostate cancer after years of service to the nation. His pension barely covered daily expenses, let alone the Rs 5 lakh treatment cost.",
    hope:
      "His regiment rallied — and then strangers joined too. 200+ donors from across India honored his service by funding his complete treatment. Mohammed now mentors other veterans facing health battles.",
    raised: "₹5,00,000",
    donors: 234,
    daysToGoal: 25,
    verified: true,
  },
  {
    name: "Lakshmi Devi",
    age: 41,
    cancer: "Ovarian Cancer",
    ribbonColor: "#2E9E9E",
    image: "/patients/lakshmi.jpg",
    initials: "LD",
    struggle:
      "Lakshmi, a daily wage worker from Chennai, ignored her symptoms for months because she couldn't afford to miss work. By the time she was diagnosed with ovarian cancer, she needed immediate surgery.",
    hope:
      "The Varak community funded her Rs 3 lakh surgery in just 11 days. Lakshmi is now in remission and has started a self-help group to encourage other women to get regular check-ups.",
    raised: "₹3,00,000",
    donors: 156,
    daysToGoal: 11,
    verified: true,
  },
];

export function SuccessStories() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % stories.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const story = stories[current];

  return (
    <section
      id="success-stories"
      className="relative py-24 bg-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="ambient-orb absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-gradient-to-t from-varak-primary/4 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-block text-xs font-semibold text-varak-pink uppercase tracking-[0.2em] mb-3">
            Real Impact
          </span>
          <h2 className="font-heading text-3xl md:text-[2.75rem] leading-tight tracking-tight mb-4">
            Stories of{" "}
            <span className="ribbon-gradient-text">Hope & Healing</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Real people, real transformations. See how generosity rewrites futures every day.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white border border-border/40 overflow-hidden">
            {/* Ribbon accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px] transition-colors duration-500"
              style={{ backgroundColor: story.ribbonColor }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-5"
              >
                {/* Image area */}
                <div className="md:col-span-2 relative h-64 md:h-auto bg-muted">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    className="object-cover"
                  />
                  {/* Verified badge overlay */}
                  {story.verified && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-green-600 text-white px-2 py-1 text-xs font-bold uppercase tracking-wider">
                      <BadgeCheck className="h-3 w-3" />
                      Verified Story
                    </div>
                  )}

                  {/* Quote watermark */}
                  <div className="absolute top-4 right-4 opacity-10">
                    <Quote className="h-16 w-16 text-white" />
                  </div>
                </div>

                {/* Content area */}
                <div className="md:col-span-3 p-6 md:p-8 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {story.name}, {story.age}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div
                          className="w-2.5 h-2.5"
                          style={{ backgroundColor: story.ribbonColor }}
                        />
                        {story.cancer}
                      </div>
                    </div>
                  </div>

                  {/* Struggle */}
                  <p className="text-sm text-foreground/70 leading-relaxed mb-3">
                    {story.struggle}
                  </p>

                  {/* Hope */}
                  <p className="text-sm text-foreground leading-relaxed mb-5 font-medium">
                    {story.hope}
                  </p>

                  {/* Impact metrics */}
                  <div className="flex items-center gap-5 pt-4 border-t border-border/40 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-varak-primary" />
                      <span className="text-sm font-semibold text-varak-primary">
                        {story.raised}
                      </span>
                      <span className="text-xs text-muted-foreground">raised</span>
                    </div>
                    <div className="w-px h-5 bg-border/60" />
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {story.donors.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">donors</span>
                    </div>
                    <div className="w-px h-5 bg-border/60" />
                    <span className="text-xs text-muted-foreground">
                      Funded in {story.daysToGoal} days
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === current
                    ? "w-8 bg-varak-primary"
                    : "w-1.5 bg-foreground/15 hover:bg-foreground/25"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
