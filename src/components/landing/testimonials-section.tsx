"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonialSlots = [
  {
    role: "Event Organizer",
    type: "Wedding",
    quote: "This will show a testimonial from a wedding organizer who used ENGRAM.",
  },
  {
    role: "Guest",
    type: "Birthday Party",
    quote: "This will show a testimonial from a guest who contributed photos at a birthday party.",
  },
  {
    role: "Corporate Event Planner",
    type: "Company Retreat",
    quote: "This will show a testimonial from a corporate event planner.",
  },
];

function TestimonialCard({ slot, index }: { slot: typeof testimonialSlots[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative rounded-2xl border border-border border-dashed bg-surface-elevated/50 p-8"
    >
      {/* Sample indicator */}
      <div className="absolute top-4 right-4">
        <span className="rounded-full bg-surface-secondary border border-border px-3 py-1 text-[10px] font-medium text-text-tertiary uppercase tracking-wider">
          Sample Layout
        </span>
      </div>

      {/* Stars placeholder */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-amber-400/50 text-lg">★</span>
        ))}
      </div>

      {/* Quote placeholder */}
      <blockquote className="text-text-tertiary italic leading-relaxed mb-6">
        &quot;{slot.quote}&quot;
      </blockquote>

      {/* Author placeholder */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-surface-secondary border border-border flex items-center justify-center">
          <span className="text-text-tertiary text-lg">👤</span>
        </div>
        <div>
          <p className="text-sm font-medium text-text-tertiary">Future User</p>
          <p className="text-xs text-text-tertiary/60">{slot.role} • {slot.type}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-engram-200 dark:border-engram-800 bg-engram-50 dark:bg-engram-950/50 px-4 py-1.5 text-xs font-medium text-engram-700 dark:text-engram-400 mb-6">
            ✦ Testimonials
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Loved by event organizers
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
            Join thousands of happy users who trust ENGRAM for their events
          </p>
        </motion.div>

        {/* Coming soon note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-2">
            <span className="text-amber-600 dark:text-amber-400">💡</span>
            <span className="text-sm text-amber-700 dark:text-amber-300">
              Real testimonials coming soon as users start using ENGRAM
            </span>
          </div>
        </motion.div>

        {/* Testimonial Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonialSlots.map((slot, i) => (
            <TestimonialCard key={slot.type} slot={slot} index={i} />
          ))}
        </div>

        {/* Stats placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { value: "10K+", label: "Events Created" },
            { value: "500K+", label: "Photos Shared" },
            { value: "50K+", label: "Happy Guests" },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
