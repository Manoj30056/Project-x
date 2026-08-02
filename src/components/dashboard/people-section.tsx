"use client";

import { motion } from "framer-motion";
import { Users, Search, Filter, ShieldCheck, Star } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

const people = [
  { name: "Sarah Miller", role: "Photographer", count: 42, active: true },
  { name: "Mike Ross", role: "Guest", count: 12, active: true },
  { name: "Emma Stone", role: "Uploader", count: 28, active: false },
  { name: "Tony Stark", role: "Genius", count: 15, active: true },
  { name: "Bruce Wayne", role: "Philanthropist", count: 31, active: false },
  { name: "Peter Parker", role: "Junior", count: 9, active: true },
];

export function PeopleSection() {
  return (
    <div className="py-6 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-text-primary tracking-tight">People</h2>
          <p className="text-text-secondary font-medium">Auto-detected faces and participants.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
            <input 
              type="text" 
              placeholder="Find someone..." 
              className="h-10 pl-10 pr-4 rounded-xl bg-surface-secondary border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-engram-500/20"
            />
          </div>
          <button className="p-2.5 rounded-xl border border-border/50 bg-surface-secondary text-text-secondary hover:text-text-primary">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Face Recognition Promo (Opt-in) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-full bg-gradient-to-br from-engram-600 to-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-50 group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="h-24 w-24 rounded-[2rem] bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-4xl shadow-2xl">
              🤖
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <ShieldCheck size={18} className="text-emerald-300" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/80">Privacy First AI</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight">Enable Face Recognition?</h3>
              <p className="text-white/80 max-w-md font-medium">
                Engram can automatically group photos by who&apos;s in them. This is entirely private to your event and requires your explicit consent.
              </p>
            </div>
            <button className="h-12 px-8 rounded-2xl bg-white text-engram-600 font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">
              Enable Feature
            </button>
          </div>
        </motion.div>

        {people.map((person, i) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-3xl bg-surface-elevated border border-border/50 hover:border-engram-500/30 transition-all hover:shadow-premium group"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-[2rem] bg-surface-secondary border border-border flex items-center justify-center text-2xl font-black text-text-tertiary overflow-hidden group-hover:scale-110 transition-transform duration-500">
                  {person.name.charAt(0)}
                </div>
                {person.active && (
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-4 border-surface-elevated shadow-lg animate-pulse" />
                )}
                <div className="absolute -top-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-8 w-8 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg">
                    <Star size={14} fill="white" />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-text-primary tracking-tight">{person.name}</h4>
                <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest mt-1">{person.role}</p>
              </div>

              <div className="flex gap-4 w-full pt-4 border-t border-border/30">
                <div className="flex-1 text-center">
                  <p className="text-sm font-black text-text-primary">{person.count}</p>
                  <p className="text-[10px] font-bold text-text-tertiary uppercase">Uploads</p>
                </div>
                <div className="w-px h-6 bg-border/50 mt-1" />
                <div className="flex-1 text-center">
                   <p className="text-sm font-black text-text-primary">124</p>
                   <p className="text-[10px] font-bold text-text-tertiary uppercase">Likes</p>
                </div>
              </div>
              
              <button className="w-full py-2.5 rounded-xl bg-surface-secondary text-xs font-bold text-text-secondary hover:bg-engram-500 hover:text-white transition-all">
                View Collection
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
