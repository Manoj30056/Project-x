"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: "🎉",
    title: "Create Event",
    description: "Set up your event in seconds. Name it, set the date, customize the style.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    number: "02",
    icon: "📱",
    title: "Share QR Code",
    description: "Display your unique QR code at the venue or share it with your guests.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    number: "03",
    icon: "👥",
    title: "Guests Join",
    description: "One scan is all it takes. No app download, no sign-up required.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    number: "04",
    icon: "📸",
    title: "Capture Memories",
    description: "Everyone takes photos and videos using their own device camera.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    number: "05",
    icon: "☁️",
    title: "Upload",
    description: "Select the best shots and upload them instantly to the shared gallery.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    number: "06",
    icon: "✨",
    title: "AI Organizes",
    description: "Our AI automatically tags, groups, and organizes everything beautifully.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Connection line */}
      {index < steps.length - 1 && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-border to-transparent hidden md:block" />
      )}
      
      <div className="relative bg-surface-elevated border border-border rounded-3xl p-8 transition-all duration-500 hover:shadow-premium hover:-translate-y-2 hover:border-engram-500/30">
        {/* Step number */}
        <span className="absolute -top-3 -right-3 flex h-8 w-12 items-center justify-center rounded-full bg-surface border border-border text-xs font-bold text-text-tertiary">
          {step.number}
        </span>

        {/* Icon */}
        <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} text-3xl shadow-lg mb-6`}>
          {step.icon}
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-text-primary mb-3">
          {step.title}
        </h3>
        <p className="text-text-secondary leading-relaxed">
          {step.description}
        </p>

        {/* Hover glow */}
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
      </div>
    </motion.div>
  );
}

export function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="how-it-works" className="relative py-32 px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-engram-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-engram-200 dark:border-engram-800 bg-engram-50 dark:bg-engram-950/50 px-4 py-1.5 text-xs font-medium text-engram-700 dark:text-engram-400 mb-6">
            ✦ How It Works
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
            Six simple steps to
            <br />
            <span className="gradient-text">unforgettable memories</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
            From event creation to shared memories in minutes, not hours. 
            No app downloads. No complicated setup.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
