"use client";

import { CreateEventWizard } from "@/components/event/create-event-wizard";
import { PremiumNavbar } from "@/components/landing/premium-navbar";
import { AnimatedGradientBg } from "@/components/landing/animated-gradient-bg";
import { motion } from "framer-motion";

export default function CreateEventPage() {
  return (
    <div className="relative min-h-screen bg-surface">
      <AnimatedGradientBg />
      <PremiumNavbar />
      
      <main className="relative pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <CreateEventWizard />
        </motion.div>
      </main>
    </div>
  );
}
