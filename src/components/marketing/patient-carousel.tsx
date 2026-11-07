"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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

export function PatientCarousel() {
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
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-varak-primary/50">
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
                    className="inline-block text-xs font-semibold px-1.5 py-px rounded-sm mt-0.5 text-white tracking-wider"
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
