"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const problems = [
  {
    icon: "😫",
    problem: "Asking everyone to send photos",
    description: "Chasing friends on WhatsApp for days",
  },
  {
    icon: "😢",
    problem: "Losing precious memories",
    description: "Photos scattered across devices",
  },
  {
    icon: "🤯",
    problem: "Scattered albums everywhere",
    description: "Google Drive, Dropbox, iCloud mess",
  },
];

const solutions = [
  {
    icon: "📱",
    solution: "One QR",
    description: "Single scan to join and contribute",
  },
  {
    icon: "📁",
    solution: "One Album",
    description: "Everything in one beautiful place",
  },
  {
    icon: "💎",
    solution: "One Memory",
    description: "Shared experience, preserved forever",
  },
];

export function WhyEngramSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="about" className="relative py-32 px-6 bg-surface-secondary">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-engram-200 dark:border-engram-800 bg-engram-50 dark:bg-engram-950/50 px-4 py-1.5 text-xs font-medium text-engram-700 dark:text-engram-400 mb-6">
            ✦ Why ENGRAM
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
            The old way is{" "}
            <span className="text-red-500 line-through decoration-2">broken</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
            We&apos;ve all been there. The event ends, and the memories scatter.
          </p>
        </motion.div>

        {/* Comparison */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <span className="text-red-600 dark:text-red-400 font-bold">✕</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary">The Problem</h3>
            </div>
            
            <div className="space-y-4">
              {problems.map((item, i) => (
                <motion.div
                  key={item.problem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-text-primary">{item.problem}</p>
                    <p className="text-sm text-text-secondary mt-1">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary">The Solution</h3>
            </div>
            
            <div className="space-y-4">
              {solutions.map((item, i) => (
                <motion.div
                  key={item.solution}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-text-primary">{item.solution}</p>
                    <p className="text-sm text-text-secondary mt-1">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="text-2xl font-semibold text-text-primary md:text-3xl">
            Ready to make event memories{" "}
            <span className="gradient-text">effortless</span>?
          </p>
        </motion.div>
      </div>
    </section>
  );
}
