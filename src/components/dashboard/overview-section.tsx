"use client";

import { motion } from "framer-motion";
import { Camera, Video, Users, HardDrive, BarChart3, Clock, Flame, Image as ImageIcon } from "lucide-react";
import type { Event } from "@/db/schema";
import { Card } from "@/components/ui/card";

interface OverviewSectionProps {
  event: Event;
}

export function OverviewSection({ event }: OverviewSectionProps) {
  const stats = [
    { label: "Total Photos", value: event.mediaCount || 0, icon: Camera, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Videos", value: 0, icon: Video, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Active Guests", value: event.guestCount || 0, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Storage Used", value: "0 MB", icon: HardDrive, color: "text-violet-500", bg: "bg-violet-500/10" },
  ];

  const highlights = [
    { label: "Today's Uploads", value: "42", icon: BarChart3 },
    { label: "Peak Activity", value: "8:00 PM", icon: Clock },
    { label: "Trending Guest", value: "Sarah M.", icon: Flame },
  ];

  return (
    <div className="space-y-10 py-6">
      {/* Welcome & Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h2 className="text-3xl font-bold text-text-primary tracking-tight">Event Overview</h2>
        <p className="text-text-secondary">Capture the pulse of your shared memory space.</p>
      </motion.div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 border-border/50 bg-surface-elevated/50 hover:border-engram-500/30 transition-all hover:shadow-premium group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                </div>
              </div>
              <div className="h-1 w-full bg-surface-secondary rounded-full overflow-hidden mt-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full ${stat.color.replace('text', 'bg')}`}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {highlights.map((highlight, i) => (
           <motion.div
             key={highlight.label}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.4 + i * 0.1 }}
             className="flex items-center gap-4 p-6 rounded-[2rem] bg-surface-secondary border border-border/50"
           >
              <div className="h-12 w-12 rounded-2xl bg-surface-elevated flex items-center justify-center text-text-secondary shadow-sm">
                <highlight.icon size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">{highlight.label}</p>
                <p className="text-xl font-bold text-text-primary">{highlight.value}</p>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Recent Upload Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Clock size={20} className="text-engram-500" />
              Latest Uploads
            </h3>
            <button className="text-xs font-bold text-engram-500 hover:text-engram-600 uppercase tracking-widest">View All</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
             {[1, 2, 3].map((_, i) => (
               <div key={i} className="aspect-square rounded-2xl bg-surface-secondary border border-border/50 overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-engram-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="h-full w-full flex items-center justify-center text-text-tertiary">
                    <ImageIcon size={24} className="opacity-20" />
                  </div>
               </div>
             ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-500" />
              Hourly Volume
            </h3>
          </div>
          <div className="h-[140px] w-full bg-surface-secondary border border-border/50 rounded-3xl p-6 flex items-end justify-between gap-1.5">
             {[30, 45, 60, 40, 80, 50, 90, 70, 40, 60, 30].map((h, i) => (
               <motion.div 
                 key={i}
                 initial={{ height: 0 }}
                 animate={{ height: `${h}%` }}
                 transition={{ duration: 1, delay: 0.8 + (i * 0.05) }}
                 className="flex-1 bg-engram-500/20 rounded-t-sm hover:bg-engram-500 transition-colors cursor-help relative group"
               >
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-primary text-surface text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}
                 </div>
               </motion.div>
             ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
