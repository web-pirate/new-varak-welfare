import { Metadata } from "next";
import Link from "next/link";
import {
  Heart,
  ArrowRight,
  Users,
  TrendingUp,
  AlertTriangle,
  Baby,
  Ribbon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCancerTypes } from "@/server/queries/campaigns";
import { CancerTypeGrid } from "./cancer-type-grid";
import { CancerRibbonList } from "./cancer-ribbon-list";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Cancer Types & Awareness | Know the Facts",
  description:
    "Learn about 24+ cancer types, their ribbon colors, symptoms, and how you can help. Every year, 1.8 million Indians are diagnosed with cancer. Together, we can fight.",
};

/* India-specific cancer statistics */
const stats = [
  {
    value: "18 Lakh+",
    label: "New Cases Every Year",
    description: "India sees over 1.8 million new cancer diagnoses annually",
    icon: TrendingUp,
    color: "#E8618C",
  },
  {
    value: "8.5 Lakh",
    label: "Lives Lost Annually",
    description: "Over 850,000 Indians die from cancer each year",
    icon: AlertTriangle,
    color: "#C2553A",
  },
  {
    value: "₹5-28L",
    label: "Treatment Cost",
    description: "Average cancer treatment ranges from ₹5 lakh to ₹28 lakh",
    icon: Heart,
    color: "#D4A843",
  },
  {
    value: "75,000+",
    label: "Children Diagnosed",
    description: "Over 75,000 children get cancer in India each year",
    icon: Baby,
    color: "#2E9E9E",
  },
];

/* Detailed cancer type info with ribbon colors, India stats, and emotional context */
const cancerDetails: Record<string, {
  ribbonColor: string;
  ribbonName: string;
  prevalence: string;
  survivalRate: string;
  treatmentCost: string;
  indiaFact: string;
  symptoms: string[];
  emotionalNote: string;
}> = {
  "Breast Cancer": {
    ribbonColor: "#E8618C",
    ribbonName: "Pink Ribbon",
    prevalence: "Most common cancer in Indian women — 1 in 28 women will be diagnosed",
    survivalRate: "90% if detected early, drops to 15% if found late",
    treatmentCost: "₹5-20 Lakh depending on stage",
    indiaFact: "Every 4 minutes, an Indian woman is diagnosed with breast cancer. Many in rural India don't have access to mammograms.",
    symptoms: ["Lump in breast or underarm", "Change in breast shape or size", "Skin dimpling or puckering", "Nipple discharge"],
    emotionalNote: "Behind every statistic is a mother, a sister, a daughter. Early detection saves lives — but for millions of Indian women, a simple screening is out of reach.",
  },
  "Blood Cancer (Leukemia)": {
    ribbonColor: "#E53E3E",
    ribbonName: "Red Ribbon",
    prevalence: "3rd most common cancer in children in India",
    survivalRate: "65-85% for children with treatment, far lower without",
    treatmentCost: "₹10-30 Lakh for bone marrow transplant",
    indiaFact: "India has the highest number of childhood leukemia cases in the world. Many families sell everything they own to afford treatment.",
    symptoms: ["Fatigue and weakness", "Frequent infections", "Easy bruising or bleeding", "Bone or joint pain"],
    emotionalNote: "Imagine being a parent and hearing that your child has cancer. Now imagine being told treatment exists — but it costs more than you'll earn in a decade.",
  },
  "Lung Cancer": {
    ribbonColor: "#C0C0C0",
    ribbonName: "White/Pearl Ribbon",
    prevalence: "Leading cause of cancer death in Indian men",
    survivalRate: "Only 15% survive 5 years after diagnosis",
    treatmentCost: "₹8-25 Lakh",
    indiaFact: "Air pollution in Indian cities is now a bigger cause of lung cancer than smoking. Even non-smokers are at risk.",
    symptoms: ["Persistent cough", "Coughing up blood", "Chest pain", "Shortness of breath", "Unexplained weight loss"],
    emotionalNote: "He never smoked a day in his life. But the air he breathed working on Delhi's roads gave him lung cancer. His family now faces a choice no family should — food or medicine.",
  },
  "Brain Cancer": {
    ribbonColor: "#808080",
    ribbonName: "Gray Ribbon",
    prevalence: "28,000+ cases diagnosed annually in India",
    survivalRate: "5-year survival varies from 5% to 36% depending on type",
    treatmentCost: "₹10-30 Lakh for surgery + treatment",
    indiaFact: "Brain tumors are the second most common cancer in children under 15 in India. Many children lose their ability to walk, talk, or see.",
    symptoms: ["Severe headaches", "Seizures", "Vision or speech changes", "Personality changes", "Balance problems"],
    emotionalNote: "Little Anjali was 6 when she stopped recognizing her mother. A brain tumor was stealing her memories, one by one. Surgery could save her — but it costs ₹15 lakh.",
  },
  "Cervical Cancer": {
    ribbonColor: "#2E9E9E",
    ribbonName: "Teal & White Ribbon",
    prevalence: "2nd most common cancer in Indian women",
    survivalRate: "80% curable if detected early through screening",
    treatmentCost: "₹3-15 Lakh",
    indiaFact: "India accounts for nearly 1/4 of the world's cervical cancer deaths. HPV vaccination could prevent 90% of cases, but access remains limited.",
    symptoms: ["Abnormal vaginal bleeding", "Pelvic pain", "Pain during intercourse", "Unusual discharge"],
    emotionalNote: "Cervical cancer is nearly 100% preventable with vaccination and screening. Yet in India, thousands of women die from it every year because they never received either.",
  },
  "Oral Cancer": {
    ribbonColor: "#8B0000",
    ribbonName: "Burgundy & White Ribbon",
    prevalence: "India has the highest oral cancer rates in the world",
    survivalRate: "50% 5-year survival if treated early",
    treatmentCost: "₹3-12 Lakh",
    indiaFact: "Tobacco and betel nut chewing account for 90% of oral cancers in India. Over 30% of all cancers in Indian men are oral cancers.",
    symptoms: ["Non-healing mouth ulcer", "White/red patches in mouth", "Difficulty swallowing", "Jaw swelling", "Loose teeth"],
    emotionalNote: "He started chewing paan at 15 because everyone in his village did. At 35, half his jaw was removed. He can't eat, can't speak clearly, can't provide for his family anymore.",
  },
  "Ovarian Cancer": {
    ribbonColor: "#2E9E9E",
    ribbonName: "Teal Ribbon",
    prevalence: "Often called the 'silent killer' — symptoms mimic common ailments",
    survivalRate: "47% 5-year survival rate, drops to 17% in late stage",
    treatmentCost: "₹8-20 Lakh",
    indiaFact: "Most Indian women are diagnosed at late stages because early symptoms are dismissed as gas, bloating, or aging.",
    symptoms: ["Bloating that doesn't go away", "Pelvic pain", "Feeling full quickly", "Frequent urination"],
    emotionalNote: "She thought it was just indigestion. For months, she ignored the bloating. By the time she saw a doctor, the cancer had spread. 'If only someone had told me the signs.'",
  },
  "Pancreatic Cancer": {
    ribbonColor: "#6B4C8A",
    ribbonName: "Purple Ribbon",
    prevalence: "One of the most lethal cancers — often found too late",
    survivalRate: "Only 10% survive 5 years",
    treatmentCost: "₹15-35 Lakh",
    indiaFact: "Pancreatic cancer cases in India have doubled in the last decade. It's nearly impossible to detect early without specific screening.",
    symptoms: ["Jaundice", "Abdominal pain radiating to back", "Unexplained weight loss", "New-onset diabetes", "Loss of appetite"],
    emotionalNote: "The deadliest cancer, the one with the fewest ribbons at awareness walks. By the time most patients learn they have it, they have months, not years.",
  },
  "Stomach Cancer": {
    ribbonColor: "#9F7AEA",
    ribbonName: "Periwinkle Ribbon",
    prevalence: "5th most common cancer globally",
    survivalRate: "31% 5-year survival rate",
    treatmentCost: "₹5-18 Lakh",
    indiaFact: "Northeast India has some of the highest stomach cancer rates in the country, linked to smoked meat consumption and H. pylori infection.",
    symptoms: ["Persistent stomach pain", "Nausea and vomiting", "Difficulty swallowing", "Blood in stool", "Feeling full after small meals"],
    emotionalNote: "In many Indian families, stomach pain is treated with home remedies for months before anyone thinks to see a doctor. That delay can be the difference between life and death.",
  },
  "Kidney Cancer": {
    ribbonColor: "#E87040",
    ribbonName: "Orange Ribbon",
    prevalence: "Cases rising rapidly in India due to lifestyle changes",
    survivalRate: "75% if caught in early stage",
    treatmentCost: "₹5-15 Lakh",
    indiaFact: "Kidney cancer is often found incidentally during scans for other conditions. Many patients in India can't afford the imaging that would catch it early.",
    symptoms: ["Blood in urine", "Lower back pain on one side", "Unexplained weight loss", "Fatigue", "Fever"],
    emotionalNote: "A routine scan for back pain. That's how most people find out. But what about the millions who can never afford that scan?",
  },
  "Liver Cancer": {
    ribbonColor: "#48BB78",
    ribbonName: "Green Ribbon",
    prevalence: "Rising in India due to hepatitis B/C and alcohol use",
    survivalRate: "20% 5-year survival rate",
    treatmentCost: "₹10-25 Lakh",
    indiaFact: "India has over 40 million hepatitis B carriers, many unaware they're at risk for liver cancer. A ₹100 vaccine could have prevented it.",
    symptoms: ["Upper abdominal pain", "Jaundice", "Unexplained weight loss", "Nausea", "Enlarged liver"],
    emotionalNote: "Hepatitis B is preventable with a vaccine that costs less than a cup of chai. Yet millions go unvaccinated, and liver cancer claims them decades later.",
  },
  "Bone Cancer": {
    ribbonColor: "#D4A843",
    ribbonName: "Yellow Ribbon",
    prevalence: "Most common in children and young adults",
    survivalRate: "60-70% with modern treatment",
    treatmentCost: "₹8-25 Lakh including prosthetics",
    indiaFact: "Many young patients in India face amputation because they reach the hospital too late for limb-saving surgery.",
    symptoms: ["Bone pain that worsens at night", "Swelling near the bone", "Weakened bones leading to fractures", "Fatigue"],
    emotionalNote: "He was 14 and wanted to play cricket for India. Now he's learning to walk with a prosthetic leg. His dream changed, but his spirit didn't. He just needs help paying for treatment.",
  },
  "Prostate Cancer": {
    ribbonColor: "#6B8DB2",
    ribbonName: "Light Blue Ribbon",
    prevalence: "2nd most common cancer in Indian men over 65",
    survivalRate: "Nearly 100% if caught early, drops with late detection",
    treatmentCost: "₹5-15 Lakh",
    indiaFact: "Indian men rarely get screened for prostate cancer due to stigma. Most are diagnosed at advanced stages.",
    symptoms: ["Difficulty urinating", "Weak urine flow", "Blood in urine or semen", "Pelvic discomfort", "Bone pain"],
    emotionalNote: "Men in India don't talk about prostate health. That silence costs thousands of lives every year. A simple PSA test could change everything.",
  },
  "Colorectal Cancer": {
    ribbonColor: "#2B4C7E",
    ribbonName: "Dark Blue Ribbon",
    prevalence: "Rising rapidly in young Indians — a 30% increase in under-50s",
    survivalRate: "65% overall, 90% if caught at stage 1",
    treatmentCost: "₹5-20 Lakh",
    indiaFact: "Colorectal cancer in young Indians has risen dramatically, linked to processed food, sedentary lifestyles, and changing diets.",
    symptoms: ["Change in bowel habits", "Blood in stool", "Abdominal cramping", "Unexplained weight loss", "Fatigue"],
    emotionalNote: "He was 32, a new father. He ignored the blood in his stool for months because he was 'too young for cancer.' He wasn't.",
  },
  "Lymphoma": {
    ribbonColor: "#90EE90",
    ribbonName: "Lime Green / Violet Ribbon",
    prevalence: "Common in young adults aged 15-35 in India",
    survivalRate: "70-90% for Hodgkin's, 60-70% for Non-Hodgkin's",
    treatmentCost: "₹8-20 Lakh",
    indiaFact: "Lymphoma is one of the most treatable cancers, yet many Indian patients drop out of treatment midway due to financial constraints.",
    symptoms: ["Painless swollen lymph nodes", "Night sweats", "Unexplained weight loss", "Fatigue", "Itchy skin"],
    emotionalNote: "The cruel irony of lymphoma: it's one of the most curable cancers, but only if you can afford to finish the full course of chemotherapy. Many can't.",
  },
  "Thyroid Cancer": {
    ribbonColor: "#6B4C8A",
    ribbonName: "Purple, Teal & Pink Ribbon",
    prevalence: "Rising in Indian women, often found incidentally",
    survivalRate: "Nearly 98% 5-year survival with treatment",
    treatmentCost: "₹3-10 Lakh",
    indiaFact: "Thyroid cancer has one of the highest survival rates of any cancer, but still requires surgery and lifelong medication that many can't afford.",
    symptoms: ["Lump in the neck", "Difficulty swallowing", "Hoarse voice", "Swollen lymph nodes"],
    emotionalNote: "One of the most survivable cancers. But 'survivable' means nothing when you can't afford the surgery.",
  },
  "Skin Cancer": {
    ribbonColor: "#1A202C",
    ribbonName: "Black Ribbon",
    prevalence: "Less common in India than Western countries but rising",
    survivalRate: "99% if caught early (non-melanoma)",
    treatmentCost: "₹2-10 Lakh",
    indiaFact: "Despite darker skin tones offering some protection, skin cancer is rising in India, especially among those who work outdoors in extreme heat.",
    symptoms: ["New or changing moles", "Sores that don't heal", "Rough, scaly patches", "Unusual growths"],
    emotionalNote: "The daily wage laborer who works under the sun every day to feed his family. He can't afford sunscreen, let alone cancer treatment.",
  },
  "Multiple Myeloma": {
    ribbonColor: "#8B0000",
    ribbonName: "Burgundy Ribbon",
    prevalence: "Often diagnosed late in India due to similarity with common bone/joint pains",
    survivalRate: "50% 5-year survival with modern treatment",
    treatmentCost: "₹15-30 Lakh including bone marrow transplant",
    indiaFact: "Many patients are misdiagnosed with arthritis or back pain for months before myeloma is discovered.",
    symptoms: ["Bone pain especially in spine", "Fatigue", "Frequent infections", "Kidney problems", "Weak bones"],
    emotionalNote: "For months the doctors said it was just 'old age pain.' By the time they found the real cause, it had already eaten through his bones.",
  },
  "Gallbladder Cancer": {
    ribbonColor: "#48BB78",
    ribbonName: "Kelly Green Ribbon",
    prevalence: "India has one of the highest rates globally, especially in North India",
    survivalRate: "Only 5-15% 5-year survival — one of the deadliest",
    treatmentCost: "₹8-20 Lakh",
    indiaFact: "Gallbladder cancer is unusually common in North Indian women, linked to gallstones. The Gangetic belt has some of the world's highest rates.",
    symptoms: ["Abdominal pain", "Jaundice", "Nausea and vomiting", "Bloating", "Unexplained weight loss"],
    emotionalNote: "In the villages of Uttar Pradesh, women bear this cancer silently. Many don't even know the name of what's killing them.",
  },
  "Uterine Cancer": {
    ribbonColor: "#FFDAB9",
    ribbonName: "Peach Ribbon",
    prevalence: "Rising in India as obesity rates increase",
    survivalRate: "81% overall 5-year survival",
    treatmentCost: "₹5-15 Lakh",
    indiaFact: "Uterine cancer is often caught earlier than other gynecological cancers due to abnormal bleeding, but many Indian women delay seeking help due to stigma.",
    symptoms: ["Abnormal vaginal bleeding", "Pelvic pain", "Pain during intercourse", "Difficulty urinating"],
    emotionalNote: "She bled for months but was too embarrassed to tell anyone. In many Indian households, women's health is the last priority. This has to change.",
  },
  "Esophageal Cancer": {
    ribbonColor: "#9DB4D0",
    ribbonName: "Periwinkle Blue Ribbon",
    prevalence: "Very high in Northeast India and Kashmir",
    survivalRate: "20% 5-year survival rate",
    treatmentCost: "₹8-20 Lakh",
    indiaFact: "Hot tea consumption and specific dietary habits in Kashmir and Northeast India contribute to some of the world's highest esophageal cancer rates.",
    symptoms: ["Difficulty swallowing", "Weight loss", "Chest pain", "Worsening heartburn", "Hoarseness"],
    emotionalNote: "She could no longer swallow food. Each sip of water was agony. The cancer that took away the simple joy of a meal.",
  },
  "Bladder Cancer": {
    ribbonColor: "#D4A843",
    ribbonName: "Yellow, Purple & Navy Ribbon",
    prevalence: "More common in men, linked to smoking and occupational exposure",
    survivalRate: "77% 5-year survival for non-invasive type",
    treatmentCost: "₹5-15 Lakh",
    indiaFact: "Industrial workers and dye factory employees in India face significantly higher risks of bladder cancer.",
    symptoms: ["Blood in urine", "Frequent urination", "Painful urination", "Back pain"],
    emotionalNote: "The factory he worked in for 30 years gave his family food and shelter. It also gave him bladder cancer. His employer won't pay for treatment.",
  },
  "Head & Neck Cancer": {
    ribbonColor: "#8B0000",
    ribbonName: "Burgundy & White Ribbon",
    prevalence: "India accounts for nearly 30% of the world's head & neck cancers",
    survivalRate: "40-60% depending on location and stage",
    treatmentCost: "₹5-20 Lakh",
    indiaFact: "India has the highest head and neck cancer burden globally, overwhelmingly linked to tobacco in all its forms — cigarettes, bidis, gutka, and paan.",
    symptoms: ["Persistent sore throat", "Difficulty swallowing", "Voice changes", "Ear pain", "Neck lump"],
    emotionalNote: "After surgery, he couldn't speak. His 5-year-old daughter would hold his hand and talk for both of them. 'Don't worry Papa, I'll be your voice.'",
  },
  "Testicular Cancer": {
    ribbonColor: "#6B4C8A",
    ribbonName: "Purple Ribbon",
    prevalence: "Most common cancer in men aged 15-35",
    survivalRate: "95% curable even in advanced stages",
    treatmentCost: "₹5-15 Lakh",
    indiaFact: "Testicular cancer is one of the most curable cancers, but stigma prevents many young Indian men from seeking help early.",
    symptoms: ["Lump in testicle", "Heaviness in scrotum", "Dull ache in groin", "Back pain"],
    emotionalNote: "At 22, he was too embarrassed to see a doctor. At 23, the cancer had spread. Stigma kills when the disease doesn't have to.",
  },
};

// A fresh order on every request (the page is rendered per request)
function shuffled<T>(list: T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Ribbon colours repeat across cancers (e.g. teal, burgundy), so repeats get a lighter tint to keep every bullet distinct
const seenColors: Record<string, number> = {};
const ribbonList = Object.entries(cancerDetails).map(([name, d]) => {
  const dup = (seenColors[d.ribbonColor] = (seenColors[d.ribbonColor] ?? -1) + 1);
  const color = dup ? `color-mix(in srgb, ${d.ribbonColor}, white ${dup * 30}%)` : d.ribbonColor;
  return { name, color, base: d.ribbonColor };
});

export default async function CancerTypesPage() {
  const cancerTypes = await getCancerTypes();

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-varak-cream overflow-hidden">
        <div className="grain-overlay absolute inset-0 pointer-events-none z-[1]" />
        <div className="ambient-orb absolute -top-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-varak-primary/10 to-transparent" />
        <div className="ambient-orb absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-varak-pink/8 to-transparent" />

        {/* Ribbon bar */}
        <div className="absolute top-0 left-0 right-0 ribbon-bar" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Ribbon className="h-5 w-5 text-varak-primary" />
              <span className="text-xs font-semibold text-varak-pink uppercase tracking-[0.2em]">
                Cancer Awareness
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-6">
              Understanding Cancer:{" "}
              <span className="ribbon-gradient-text">
                Know the Signs, Save a Life
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              Every year, <strong className="text-foreground">18 lakh Indians</strong> hear
              the words &ldquo;you have cancer.&rdquo; Behind each number is a person —
              a parent, a child, a friend. Knowledge is the first step to survival.
              Early detection can save up to <strong className="text-varak-primary">90% of patients</strong>.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-varak-primary hover:bg-varak-primary-dark text-white rounded-none px-6 h-12 shadow-[0_4px_16px_rgba(194,85,58,0.25)]"
              >
                <Link href="/campaigns">
                  <Heart className="mr-2 h-4 w-4" />
                  Help a Patient Today
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-varak-primary/15 text-varak-primary rounded-none px-6 h-12"
              >
                <Link href="/start-fundraiser">
                  Start a Fundraiser
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-16 bg-white">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="relative rounded-none border border-border/40 bg-white p-6 hover-lift overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 w-[3px] h-full rounded-none"
                  style={{ backgroundColor: stat.color }}
                />
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-none flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: stat.color }}
                  >
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-heading tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-foreground/80 mt-0.5">
                      {stat.label}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Reality Section */}
      <section className="relative py-20 bg-varak-cream">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold text-varak-pink uppercase tracking-[0.2em] mb-3">
              The Reality
            </span>
            <h2 className="font-heading text-3xl md:text-4xl tracking-tight">
              Cancer in India: A{" "}
              <span className="text-gradient-primary">Silent Crisis</span>
            </h2>
          </div>

          <div className="prose prose-lg mx-auto text-muted-foreground space-y-6">
            <p className="text-lg leading-relaxed">
              In India, cancer isn&apos;t just a medical diagnosis — it&apos;s a{" "}
              <strong className="text-foreground">financial catastrophe</strong>.
              The average treatment costs between ₹5 lakh and ₹28 lakh, while 70% of
              Indian families earn less than ₹10,000 per month. For most families,
              a cancer diagnosis means selling their home, pulling children out of school,
              and borrowing at crippling interest rates.
            </p>

            <blockquote className="border-l-4 border-varak-pink pl-6 py-2 italic text-foreground/80 not-italic bg-white/60 rounded-none p-6">
              &ldquo;After my husband was diagnosed with oral cancer, I sold my wedding
              jewelry, took our son out of school, and borrowed from the local moneylender
              at 36% interest. Even then, we could only afford half the treatment.&rdquo;
              <br />
              <span className="text-sm text-muted-foreground not-italic mt-2 block">
                — Laxmi, 34, from rural Maharashtra
              </span>
            </blockquote>

            <p className="text-lg leading-relaxed">
              <strong className="text-foreground">75,000 children</strong> are diagnosed
              with cancer in India every year. Many of them are curable with modern treatment,
              but their families simply cannot afford it. A bone marrow transplant that could
              save a child&apos;s life costs ₹15-30 lakh — more than most families will earn
              in a decade.
            </p>

            <p className="text-lg leading-relaxed">
              This is why platforms like Varak exist. Every donation, no matter how small,
              fights not just cancer — it fights the{" "}
              <strong className="text-foreground">poverty that makes cancer fatal</strong>.
            </p>
          </div>

          <div className="text-center mt-10">
            <Button
              asChild
              className="bg-varak-primary hover:bg-varak-primary-dark text-white rounded-none px-8 h-12 shadow-[0_4px_16px_rgba(194,85,58,0.25)]"
            >
              <Link href="/campaigns">
                <Heart className="mr-2 h-4 w-4" />
                Donate to a Campaign Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Cancer Types Grid */}
      <section id="cancer-types" className="relative py-20 bg-white scroll-mt-20">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold text-varak-pink uppercase tracking-[0.2em] mb-3">
              24+ Cancer Types
            </span>
            <h2 className="font-heading text-3xl md:text-4xl tracking-tight mb-4">
              Every Ribbon Color,{" "}
              <span className="ribbon-gradient-text">Every Fight</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each ribbon color represents a unique cancer battle. Click on any type
              to learn about symptoms, statistics, and how you can help.
            </p>
          </div>

          <CancerTypeGrid
            cancerTypes={cancerTypes}
            cancerDetails={cancerDetails}
          />

          <CancerRibbonList items={shuffled(ribbonList)} />
        </div>
      </section>

      {/* Early Detection Section */}
      <section className="relative py-20 bg-varak-cream">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold text-varak-pink uppercase tracking-[0.2em] mb-3">
              Save a Life
            </span>
            <h2 className="font-heading text-3xl md:text-4xl tracking-tight">
              Early Detection{" "}
              <span className="text-gradient-primary">Changes Everything</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-none border border-border/40 bg-white p-7 text-center hover-lift">
              <div className="text-4xl font-heading text-varak-primary mb-2">90%</div>
              <div className="text-sm font-semibold mb-2">Breast Cancer Survival</div>
              <p className="text-xs text-muted-foreground">
                When detected at Stage 1, breast cancer has a 90% survival rate.
                A simple mammogram can save a life.
              </p>
            </div>
            <div className="rounded-none border border-border/40 bg-white p-7 text-center hover-lift">
              <div className="text-4xl font-heading text-varak-pink mb-2">95%</div>
              <div className="text-sm font-semibold mb-2">Cervical Cancer Prevention</div>
              <p className="text-xs text-muted-foreground">
                HPV vaccination can prevent up to 95% of cervical cancers.
                A ₹2,000 vaccine could save thousands of lives.
              </p>
            </div>
            <div className="rounded-none border border-border/40 bg-white p-7 text-center hover-lift">
              <div className="text-4xl font-heading text-varak-gold mb-2">85%</div>
              <div className="text-sm font-semibold mb-2">Childhood Cancer Cure Rate</div>
              <p className="text-xs text-muted-foreground">
                Most childhood cancers are curable with modern treatment —
                if the family can afford it. That&apos;s where you come in.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-none bg-gradient-to-br from-[#9A3F2E] via-[#C2553A] to-[#D47A6A] p-8 md:p-10 text-center text-white relative overflow-hidden">
            <div className="grain-overlay absolute inset-0 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="font-heading text-2xl md:text-3xl mb-3">
                Warning Signs You Should Never Ignore
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm text-left">
                {[
                  "Unexplained weight loss (more than 5kg)",
                  "Persistent fatigue that doesn't improve with rest",
                  "Any lump or swelling that doesn't go away",
                  "A wound or sore that doesn't heal in 3 weeks",
                  "Unexplained bleeding (urine, stool, cough)",
                  "Persistent pain with no clear cause",
                  "Changes in bowel or bladder habits",
                  "Difficulty swallowing that worsens",
                  "A new mole or changes to existing one",
                ].map((sign) => (
                  <div key={sign} className="flex items-start gap-2 text-white/80">
                    <AlertTriangle className="h-3.5 w-3.5 text-varak-gold mt-0.5 flex-shrink-0" />
                    <span>{sign}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-sm mt-6">
                If you or someone you know has any of these symptoms persisting for more than
                2 weeks, please consult a doctor. Early detection saves lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 bg-white">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-1.5 mb-6">
            {["#E8618C", "#6B4C8A", "#D4A843", "#2E9E9E", "#E87040", "#6B8DB2", "#808080", "#8B0000", "#48BB78"].map(
              (color) => (
                <div
                  key={color}
                  className="w-3 h-3 rounded-none"
                  style={{ backgroundColor: color }}
                />
              )
            )}
          </div>

          <h2 className="font-heading text-3xl md:text-4xl tracking-tight mb-4">
            Every Ribbon Represents a{" "}
            <span className="ribbon-gradient-text">Human Being</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Behind every cancer statistic is someone&apos;s mother, father, child, or friend.
            You can be the reason someone survives. Donate, fundraise, or simply share —
            every action matters.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              className="bg-varak-primary hover:bg-varak-primary-dark text-white rounded-none px-8 h-12 shadow-[0_4px_16px_rgba(194,85,58,0.25)]"
            >
              <Link href="/campaigns">
                <Heart className="mr-2 h-4 w-4" />
                Donate Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-varak-primary/15 text-varak-primary rounded-none px-8 h-12"
            >
              <Link href="/start-fundraiser">
                Start a Fundraiser
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            Sources: ICMR National Cancer Registry Programme, WHO GLOBOCAN 2022,
            Indian Journal of Medical Research, Think Global Health
          </p>
        </div>
      </section>
    </>
  );
}
