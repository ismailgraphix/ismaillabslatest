"use client";
import { motion } from "framer-motion";
import { CodeXml, FileText, Rocket, Users } from "lucide-react";
import SectionLabel from "@/components/SectionLabel";

// Draft copy from the rebuild plan. Ismail confirms each step is how projects
// actually run before this ships; edit or remove any step that is not.
const steps = [
  {
    id: "01",
    title: "Discovery",
    desc: "We talk to the people who will use the system and map how the work is done today.",
    icon: Users,
  },
  {
    id: "02",
    title: "Plan",
    desc: "You get a written scope, a timeline and a price for the first milestone before any code is written.",
    icon: FileText,
  },
  {
    id: "03",
    title: "Build",
    desc: "You see working software on a staging link at regular intervals, not slides.",
    icon: CodeXml,
  },
  {
    id: "04",
    title: "Launch and support",
    desc: "We deploy, train your staff, and stay on for fixes and changes.",
    icon: Rocket,
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
      <div className="mx-auto max-w-[1300px] px-6 py-24 md:px-10">
        <div className="max-w-3xl">
          <SectionLabel className="mb-5">Process</SectionLabel>
          <h2 className="font-heading font-bold text-[2.6rem] leading-[1.02] tracking-[-0.03em] sm:text-[3.4rem]">
            How a project runs
          </h2>
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
                  <StepIcon className="h-6 w-6" aria-hidden="true" />
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
