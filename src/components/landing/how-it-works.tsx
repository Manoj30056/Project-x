"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Create Your Event",
    description:
      "Set up your event in seconds. Name it, set the date, customize the style. Your private event gallery is ready instantly.",
    visual: "🎉",
  },
  {
    number: "02",
    title: "Share the QR Code",
    description:
      "Display your unique QR code at the venue, share it on your invite, or text it to guests. One scan is all it takes.",
    visual: "📱",
  },
  {
    number: "03",
    title: "Guests Contribute",
    description:
      "Everyone takes photos and videos as usual. When ready, they preview, select their best shots, and upload — no app needed.",
    visual: "📸",
  },
  {
    number: "04",
    title: "Relive Together",
    description:
      "AI organizes everything beautifully. Browse, download, and share your collective memories from one stunning gallery.",
    visual: "✨",
  },
];

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="group relative flex gap-6 rounded-2xl border border-border bg-surface-elevated p-8 transition-all duration-300 hover:shadow-premium"
    >
      <div className="flex-shrink-0">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-engram-500 to-engram-600 text-2xl shadow-lg shadow-engram-500/25">
          {step.visual}
        </div>
      </div>
      <div>
        <span className="text-xs font-bold tracking-widest text-engram-500 uppercase">
          Step {step.number}
        </span>
        <h3 className="mt-2 text-xl font-semibold text-text-primary">
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="relative py-32 px-6 bg-surface-secondary"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-engram-200 bg-engram-50 px-4 py-1.5 text-xs font-medium text-engram-700 dark:border-engram-800 dark:bg-engram-950/50 dark:text-engram-400">
            ✦ How it Works
          </span>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Four steps to{" "}
            <span className="gradient-text">forever</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-text-secondary">
            From event creation to shared memories in minutes, not hours.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-8 md:grid-cols-2">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
