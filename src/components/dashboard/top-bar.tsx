"use client";

import { motion } from "framer-motion";
import { Search, Bell, Menu, Users, PanelRight, X } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import type { Event } from "@/db/schema";

interface DashboardTopBarProps {
  event: Event;
}

export function DashboardTopBar({ event }: DashboardTopBarProps) {
  const { isMobileMenuOpen, toggleMobileMenu, toggleActivityPanel, isActivityPanelOpen } = useUIStore();

  return (
    <header className="h-16 sticky top-0 z-40 glass border-b border-border/50 flex items-center px-6 justify-between">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary transition-transform active:scale-90"
          aria-label="Toggle menu"
        >
          <motion.div
            animate={isMobileMenuOpen ? { rotate: 90 } : { rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.div>
        </button>

        <div className="hidden sm:flex items-center gap-2 group">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-semibold text-text-primary truncate max-w-[200px]">
            {event.title}
          </span>
        </div>

        {/* Search Bar */}
        <div className="max-w-md w-full ml-4 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-engram-500 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search memories, people, or places..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-surface-secondary border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-engram-500/20 focus:bg-surface-elevated transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity">
               <kbd className="px-1.5 py-0.5 rounded border border-border bg-surface-secondary text-[10px] text-text-tertiary">⌘</kbd>
               <kbd className="px-1.5 py-0.5 rounded border border-border bg-surface-secondary text-[10px] text-text-tertiary">K</kbd>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Guest Stack */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-secondary border border-border/50">
          <Users size={14} className="text-text-tertiary" />
          <span className="text-xs font-bold text-text-secondary">{event.guestCount || 0}</span>
        </div>

        <div className="h-4 w-px bg-border/50 mx-1 hidden sm:block" />

        <div className="flex items-center gap-1">
          <button className="p-2 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-lg transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-engram-500 rounded-full border-2 border-surface" />
          </button>
          
          <button 
            onClick={toggleActivityPanel}
            className={cn(
              "p-2 rounded-lg transition-all",
              isActivityPanelOpen ? "text-engram-500 bg-engram-500/10" : "text-text-tertiary hover:text-text-primary hover:bg-surface-secondary"
            )}
          >
            <PanelRight size={20} />
          </button>
        </div>

        <div className="h-4 w-px bg-border/50 mx-1" />

        {/* User Profile */}
        <button className="h-9 w-9 rounded-full bg-gradient-to-br from-engram-400 to-engram-600 border-2 border-surface shadow-sm flex items-center justify-center text-white text-xs font-bold ring-1 ring-border">
          JD
        </button>
      </div>
    </header>
  );
}
