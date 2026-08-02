"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

export function FinalCTASection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-engram-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, type: "spring" }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl gradient-primary shadow-glow"
        >
          <svg viewBox="0 0 24 24" className="h-12 w-12 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl"
        >
          Start Preserving
          <br />
          <span className="gradient-text">Memories Today</span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-lg text-text-secondary"
        >
          Create your first event in under 30 seconds. Completely free, forever.
          No sign-up required. No credit card. No catch.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link href="/create">
            <Button
              size="xl"
              className="min-w-[220px] h-14 text-base shadow-lg shadow-engram-500/25 hover:shadow-engram-500/40 transition-shadow"
            >
              <span className="mr-2">✨</span>
              Create Event
            </Button>
          </Link>
          <Link href="/join">
            <Button 
              variant="outline" 
              size="xl" 
              className="min-w-[220px] h-14 text-base border-2"
            >
              <span className="mr-2">📷</span>
              Join Event
            </Button>
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-text-tertiary"
        >
          {[
            { icon: "✓", text: "100% Free" },
            { icon: "✓", text: "No Ads" },
            { icon: "✓", text: "No Sign-up" },
            { icon: "✓", text: "Privacy First" },
          ].map((item) => (
            <span key={item.text} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs">
                {item.icon}
              </span>
              {item.text}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
