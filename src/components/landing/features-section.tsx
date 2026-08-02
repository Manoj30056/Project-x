"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    icon: "🤖",
    title: "AI Face Recognition",
    description: "Automatically find photos of specific people. Opt-in only, with full privacy controls.",
    badge: "Opt-in",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: "⚡",
    title: "Live Gallery",
    description: "Photos appear in real-time as guests upload. Watch your gallery grow live during the event.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: "📱",
    title: "QR Join",
    description: "One scan to join. No app download, no sign-up, no friction. Works on any device.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: "🔒",
    title: "Password Protected",
    description: "Add an extra layer of security with optional password protection for your events.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: "🔍",
    title: "AI Search",
    description: "Find photos by describing them. Search for 'sunset', 'group photo', or 'cake cutting'.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: "📅",
    title: "Timeline View",
    description: "Relive your event chronologically. See how the memories unfolded moment by moment.",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: "📁",
    title: "Smart Albums",
    description: "AI automatically creates albums based on moments, locations, and people.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: "💾",
    title: "One-Click Download",
    description: "Download all photos at once or select specific ones. High quality, no compression.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: "📶",
    title: "Offline Upload Queue",
    description: "Capture now, upload later. Photos queue automatically and sync when back online.",
    gradient: "from-teal-500 to-emerald-500",
  },
  {
    icon: "🎙️",
    title: "Voice Memories",
    description: "Attach voice notes to photos. Coming soon.",
    badge: "Coming Soon",
    gradient: "from-purple-500 to-violet-500",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl border border-border bg-surface-elevated p-6 transition-all duration-300 hover:shadow-premium hover:border-engram-500/30"
    >
      {/* Badge */}
      {feature.badge && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-engram-500 px-2.5 py-0.5 text-[10px] font-semibold text-white">
          {feature.badge}
        </span>
      )}

      {/* Icon */}
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {feature.icon}
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {feature.title}
      </h3>
      <p className="text-sm text-text-secondary leading-relaxed">
        {feature.description}
      </p>

      {/* Hover effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />
    </motion.div>
  );
}

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="features" className="relative py-32 px-6 bg-surface-secondary">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-engram-200 dark:border-engram-800 bg-engram-50 dark:bg-engram-950/50 px-4 py-1.5 text-xs font-medium text-engram-700 dark:text-engram-400 mb-6">
            ✦ Features
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Everything you need.
            <br />
            <span className="gradient-text">Nothing you don&apos;t.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
            Built from the ground up for capturing and preserving event memories.
            Simple for guests, powerful for organizers.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
