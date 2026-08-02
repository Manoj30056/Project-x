"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, formatTime } from "@/lib/utils";
import type { Event } from "@/db/schema";

interface WelcomeAnimationProps {
  event: Event;
  guestName: string;
  guestCount: number;
  onComplete: () => void;
}

export function WelcomeAnimation({
  event,
  guestName,
  guestCount,
  onComplete,
}: WelcomeAnimationProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 400),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 2000),
      setTimeout(() => setStage(4), 2800),
      setTimeout(() => onComplete(), 4000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${event.coverColor ?? "#6366f1"}dd, ${event.coverColor ?? "#6366f1"}88)`,
      }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-96 h-96 rounded-full bg-white/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-80 h-80 rounded-full bg-white/10 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -40, 0],
            scale: [1.1, 0.9, 1.1],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Checkmark animation */}
        <AnimatePresence>
          {stage >= 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="mx-auto mb-8"
            >
              <div className="relative mx-auto w-24 h-24">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm"
                />
                <motion.svg
                  viewBox="0 0 24 24"
                  className="absolute inset-0 w-full h-full p-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M20 6L9 17l-5-5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  />
                </motion.svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome text */}
        <AnimatePresence>
          {stage >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg font-medium text-white/80">
                Welcome, {guestName}!
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event name */}
        <AnimatePresence>
          {stage >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4"
            >
              <h1 className="text-4xl font-bold text-white sm:text-5xl">
                {event.title}
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event details */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-2"
            >
              <p className="text-white/80">
                {formatDate(event.startDate)} at {formatTime(event.startDate)}
              </p>
              {event.locationName && (
                <p className="text-white/60 flex items-center justify-center gap-1.5">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {event.locationName}
                </p>
              )}
              <p className="text-white/60 text-sm">
                by {event.organizerName}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <AnimatePresence>
          {stage >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10 flex flex-col items-center gap-6"
            >
              <div className="flex gap-4">
                <div className="flex flex-col items-center p-4 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/10 min-w-[100px]">
                   <span className="text-2xl font-bold text-white">{event.mediaCount || 0}</span>
                   <span className="text-[10px] uppercase tracking-widest text-white/50">Memories</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/10 min-w-[100px]">
                   <span className="text-2xl font-bold text-white">{guestCount}</span>
                   <span className="text-[10px] uppercase tracking-widest text-white/50">Guests</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-3 rounded-full bg-white/20 backdrop-blur-sm px-5 py-2.5">
                <div className="flex -space-x-2">
                  {Array.from({ length: Math.min(3, guestCount) }).map((_, i) => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full bg-white/40 border-2 border-white/60 flex items-center justify-center text-[10px] font-bold text-white"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium text-white"> Relive the moments together.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onComplete}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-white/50 hover:text-white/80 transition-colors"
      >
        Tap to continue
      </motion.button>
    </motion.div>
  );
}
