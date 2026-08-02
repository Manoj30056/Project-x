"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Hero3DScene } from "./hero-3d-scene";
import { ScrollIndicator } from "./scroll-indicator";

const trustPoints = [
  { icon: "✓", text: "Unlimited Events" },
  { icon: "✓", text: "Private Sharing" },
  { icon: "✓", text: "AI Organization" },
  { icon: "✓", text: "Free Forever" },
];

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* 3D Scene */}
      <Hero3DScene />

      {/* Content */}
      <motion.div 
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
        style={{ y, opacity }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-engram-200 bg-engram-50/80 dark:bg-engram-950/50 dark:border-engram-800 px-4 py-2 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-engram-700 dark:text-engram-300">
              100% Free Forever — No Sign-up Required
            </span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-5xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="block">One QR.</span>
          <span className="block gradient-text">Every Memory.</span>
          <span className="block">Forever.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mx-auto mt-8 max-w-2xl text-lg text-text-secondary sm:text-xl leading-relaxed"
        >
          The smartest AI-powered event memory platform where every guest 
          contributes photos and videos into one beautiful shared album.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link href="/create">
            <Button
              size="xl"
              className="min-w-[200px] h-14 text-base shadow-lg shadow-engram-500/25 hover:shadow-engram-500/40 transition-shadow"
            >
              <span className="mr-2">✨</span>
              Create Event
            </Button>
          </Link>
          <Link href="/join">
            <Button 
              variant="secondary" 
              size="xl" 
              className="min-w-[200px] h-14 text-base border-2"
            >
              <span className="mr-2">📷</span>
              Join Event
            </Button>
          </Link>
        </motion.div>

        {/* Trust Points */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {trustPoints.map((point, i) => (
            <motion.div
              key={point.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.1 + i * 0.1 }}
              className="flex items-center gap-2 text-sm text-text-secondary"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs">
                {point.icon}
              </span>
              <span>{point.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
    </section>
  );
}
