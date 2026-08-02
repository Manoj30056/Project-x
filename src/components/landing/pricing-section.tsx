"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

const features = [
  "Unlimited events",
  "Unlimited photos & videos",
  "Unlimited guests",
  "AI-powered organization",
  "Beautiful QR codes",
  "HD downloads",
  "Real-time gallery",
  "Custom event branding",
  "Private & secure",
  "No watermarks",
  "No ads ever",
  "Community support",
];

export function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="pricing" className="relative py-32 px-6">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-engram-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-6">
            ✦ 100% Free Forever
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
            No subscriptions.
            <br />
            <span className="gradient-text">No hidden costs.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
            ENGRAM is completely free for everyone. Every feature, unlimited usage,
            no ads, no premium tiers. Just beautiful memories.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-3xl border border-engram-500/30 bg-surface-elevated p-10 shadow-glow overflow-hidden"
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
          
          {/* Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="rounded-full gradient-primary px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-engram-500/25">
              Free Forever
            </span>
          </div>

          <div className="text-center pt-4">
            {/* Price */}
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-7xl font-bold tracking-tight text-text-primary md:text-8xl">
                $0
              </span>
              <span className="text-xl text-text-tertiary">/forever</span>
            </div>
            <p className="mt-3 text-text-secondary">
              Everything included. No credit card required.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.03 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <svg
                    className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-sm text-text-primary">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 flex justify-center"
          >
            <Link href="/create">
              <Button size="xl" className="min-w-[260px] h-14">
                Create Your First Event
                <svg
                  viewBox="0 0 24 24"
                  className="ml-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Why free section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-semibold text-text-primary">
            Why is ENGRAM free?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary leading-relaxed">
            We believe everyone deserves to preserve their precious memories without
            financial barriers. ENGRAM is built with love for the community, using
            open-source technologies and optimized infrastructure to keep costs minimal.
            Your memories matter more than our profits.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
