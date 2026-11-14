"use client";
import { motion } from "framer-motion";
import { Activity, Layers, PenTool, Search } from "lucide-react";
import SectionLabel from "@/components/SectionLabel";

const steps = [
  {
    id: "01",
    title: "Discovery",
    desc: "Engineer-led research sessions to map product goals, users, and technical constraints before we build.",
    icon: Search,
  },
  {
    id: "02",
    title: "Strategy & Planning",
    desc: "Define the product architecture, delivery roadmap, and success metrics for a smooth execution.",
    icon: Layers,
  },
  {
    id: "03",
    title: "Design & Development",
    desc: "Craft refined interfaces and engineering-ready experiences that align with your brand and business goals.",
    icon: PenTool,
  },
  {
    id: "04",
    title: "Testing & Launch",
    desc: "Validate quality with rigorous QA, then deploy confidently with monitoring and post-launch support.",
    icon: Activity,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export default function Process() {
  return (
    <motion.section
      id="process"
      className="relative overflow-hidden bg-[var(--app-bg)] text-[var(--text)]"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
    >
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <SectionLabel className="mb-5">Our process</SectionLabel>
          <h2 className="font-heading font-bold text-[2.6rem] leading-[1.02] tracking-[-0.03em] sm:text-[3.4rem]">
            A polished workflow built for product clarity and reliable delivery.
          </h2>
          <p className="mt-6 max-w-2xl text-base md:text-[17px] leading-relaxed text-[var(--muted)]">
            We combine strategic planning, clean execution, and careful validation so every phase feels aligned with your business goals.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <motion.article
                key={step.id}
                variants={item}
                className="group relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-accent/40"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-md border border-accent/20 bg-accent/10 text-accent">
                  <StepIcon className="h-6 w-6" />
                </div>
                <div className="mb-4 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                  <span>{step.id}</span>
                  <span className="block h-[2px] w-10 bg-accent/30" />
                  <span>Step</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-[var(--text)] mb-3">
                  {step.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-[var(--muted)]">
                  {step.desc}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
