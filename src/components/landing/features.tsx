"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: "One QR Code",
    description:
      "Generate a single beautiful QR code for your event. Guests scan it to instantly join and start contributing memories.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
    title: "Collect Everything",
    description:
      "Photos and videos from every guest, every angle, every moment. No more chasing friends for their shots after the event.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
        <circle cx="12" cy="12" r="3" />
        <path d="M2 12h4M18 12h4M12 2v4M12 18v4" />
      </svg>
    ),
    title: "AI Organization",
    description:
      "Intelligent tagging and grouping. Your photos are automatically organized by moments, people, and scenes.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Private & Secure",
    description:
      "Your memories belong to you. End-to-end privacy with permission-based access. Only invited guests can view and contribute.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
    ),
    title: "Instant Sharing",
    description:
      "Real-time uploads from every guest. Watch the gallery grow live during your event. Download everything in one click.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "Works Everywhere",
    description:
      "No app download required. Works on any device with a camera and browser. Desktop, tablet, or phone — it just works.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl border border-border bg-surface-elevated p-7 transition-all duration-300 hover:shadow-premium hover:-translate-y-1"
    >
      <div
        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
      >
        {feature.icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary">{feature.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">
        {feature.description}
      </p>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-engram-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
    </motion.div>
  );
}

export function Features() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="features" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-engram-200 bg-engram-50 px-4 py-1.5 text-xs font-medium text-engram-700 dark:border-engram-800 dark:bg-engram-950/50 dark:text-engram-400">
            ✦ Features
          </span>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-text-primary md:text-5xl text-balance">
            Everything you need.
            <br />
            <span className="gradient-text">Nothing you don&apos;t.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-text-secondary text-balance">
            Built from the ground up for capturing and preserving event memories. 
            Simple for guests, powerful for organizers.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
