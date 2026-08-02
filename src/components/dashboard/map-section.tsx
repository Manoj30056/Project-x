"use client";

import { motion } from "framer-motion";
import { Map as MapIcon, Navigation, Compass, Layers, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MapSection() {
  return (
    <div className="py-6 h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-text-primary tracking-tight">Memory Map</h2>
          <p className="text-text-secondary font-medium">Explore photos by location.</p>
        </div>
        
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-secondary border border-border/50 text-sm font-bold text-text-secondary hover:text-text-primary transition-all">
             <Compass size={18} />
             Recenter
           </button>
           <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-engram-500 text-white text-sm font-bold shadow-glow hover:scale-105 transition-all">
             <Plus size={18} />
             Add Location
           </button>
        </div>
      </div>

      <div className="flex-1 relative rounded-[3rem] bg-surface-secondary border border-border/50 overflow-hidden group shadow-inner">
        {/* Animated Background Placeholder for Map */}
        <div className="absolute inset-0 bg-[#f8fafc] dark:bg-[#020617]">
           {/* Simple Grid Background */}
           <div 
             className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
             style={{ 
               backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
               backgroundSize: '40px 40px' 
             }} 
           />
           
           {/* Abstract Map Shapes */}
           <svg className="absolute inset-0 w-full h-full opacity-[0.05] dark:opacity-[0.1]" preserveAspectRatio="none">
              <path d="M0,100 Q300,50 600,150 T1200,80 V400 H0 Z" fill="currentColor" />
           </svg>
        </div>

        {/* Map UI Overlays */}
        <div className="absolute top-6 right-6 flex flex-col gap-3">
           <div className="flex flex-col gap-1 rounded-2xl bg-surface-elevated/80 backdrop-blur-xl border border-border/50 p-1.5 shadow-premium">
              <button className="p-2.5 rounded-xl hover:bg-surface-secondary text-text-secondary transition-all"><Plus size={18} /></button>
              <div className="h-px bg-border/50 mx-2" />
              <button className="p-2.5 rounded-xl hover:bg-surface-secondary text-text-secondary transition-all"><Navigation size={18} /></button>
           </div>
           
           <button className="p-3 rounded-2xl bg-surface-elevated/80 backdrop-blur-xl border border-border/50 text-text-secondary shadow-premium">
              <Layers size={18} />
           </button>
        </div>

        {/* Location Markers */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[30%] cursor-pointer group/marker"
        >
           <div className="relative">
              <div className="absolute -inset-4 bg-engram-500/20 rounded-full blur-xl group-hover/marker:bg-engram-500/40 transition-colors" />
              <div className="relative h-12 w-12 rounded-[1.5rem] bg-surface-elevated border-2 border-engram-500 shadow-2xl flex items-center justify-center text-xl overflow-hidden group-hover/marker:scale-110 transition-transform">
                 📸
                 <div className="absolute bottom-0 right-0 h-4 w-4 bg-engram-500 text-[10px] font-bold text-white flex items-center justify-center">12</div>
              </div>
           </div>
           <div className="mt-3 px-3 py-1.5 rounded-xl bg-surface-elevated/80 backdrop-blur-md border border-border/50 shadow-lg text-[10px] font-black uppercase tracking-widest text-text-primary text-center">
              Main Stage
           </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[60%] left-[60%] cursor-pointer group/marker"
        >
           <div className="relative">
              <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl group-hover/marker:bg-indigo-500/40 transition-colors" />
              <div className="relative h-12 w-12 rounded-[1.5rem] bg-surface-elevated border-2 border-indigo-500 shadow-2xl flex items-center justify-center text-xl overflow-hidden group-hover/marker:scale-110 transition-transform">
                 🕺
                 <div className="absolute bottom-0 right-0 h-4 w-4 bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center">28</div>
              </div>
           </div>
           <div className="mt-3 px-3 py-1.5 rounded-xl bg-surface-elevated/80 backdrop-blur-md border border-border/50 shadow-lg text-[10px] font-black uppercase tracking-widest text-text-primary text-center">
              Dance Floor
           </div>
        </motion.div>

        {/* Permission Gate / Coming Soon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-surface/5 backdrop-blur-[2px]">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="max-w-md w-full mx-6 p-10 rounded-[3rem] bg-surface-elevated border border-border shadow-2xl text-center space-y-6"
           >
              <div className="h-24 w-24 rounded-[2.5rem] bg-surface-secondary flex items-center justify-center mx-auto text-4xl shadow-inner border border-border/50">
                 📍
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black text-text-primary tracking-tight">Enable Memory Map?</h3>
                 <p className="text-text-secondary font-medium leading-relaxed">
                   To show photos on the map, we need your permission to access and store location data. This is disabled by default for your privacy.
                 </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                 <Button variant="ghost" className="flex-1 rounded-2xl h-12 font-bold">Maybe Later</Button>
                 <Button className="flex-1 rounded-2xl h-12 font-bold shadow-glow">Enable Map</Button>
              </div>
              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                Requires GPS metadata from uploaded photos
              </p>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
