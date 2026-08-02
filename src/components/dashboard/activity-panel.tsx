"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/ui-store";
import { timeAgo } from "@/lib/utils";
import { Activity, X, UserPlus, Image as ImageIcon, Video, Heart, MessageSquare, Clock } from "lucide-react";

const activities = [
  { id: 1, user: "Sarah Miller", action: "uploaded 3 photos", time: new Date(), icon: ImageIcon, color: "text-blue-500" },
  { id: 2, user: "Mike Ross", action: "liked a memory", time: new Date(Date.now() - 3600000), icon: Heart, color: "text-rose-500" },
  { id: 3, user: "Emma Stone", action: "joined the event", time: new Date(Date.now() - 7200000), icon: UserPlus, color: "text-emerald-500" },
  { id: 4, user: "James Bond", action: "uploaded a video", time: new Date(Date.now() - 10800000), icon: Video, color: "text-amber-500" },
  { id: 5, user: "Tony Stark", action: "commented: 'Amazing night!'", time: new Date(Date.now() - 14400000), icon: MessageSquare, color: "text-indigo-500" },
];

export function ActivityPanel() {
  const { isActivityPanelOpen, toggleActivityPanel } = useUIStore();

  return (
    <AnimatePresence>
      {isActivityPanelOpen && (
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="hidden xl:flex flex-col w-80 h-screen border-l border-border bg-surface-elevated/50 backdrop-blur-xl sticky top-0 z-40"
        >
          <div className="h-16 flex items-center px-6 justify-between border-b border-border/50 shrink-0">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-engram-500" />
              <span className="font-bold text-text-primary text-sm tracking-tight uppercase">Live Activity</span>
            </div>
            <button 
              onClick={toggleActivityPanel}
              className="p-1.5 rounded-lg hover:bg-surface-secondary text-text-tertiary transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            <div className="space-y-4">
              {activities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, ease: "easeOut" }}
                  className="flex gap-4 p-3 rounded-2xl hover:bg-surface-secondary/50 transition-colors cursor-default relative overflow-hidden group"
                >
                  <div className="shrink-0 relative">
                    <div className="h-12 w-12 rounded-[1.25rem] bg-surface-secondary border border-border flex items-center justify-center text-sm font-black text-text-tertiary overflow-hidden group-hover:scale-105 transition-transform">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-surface border border-border flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                      <activity.icon size={12} className={activity.color} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-xs font-medium text-text-primary leading-snug">
                      <span className="font-black text-text-primary group-hover:text-engram-500 transition-colors">{activity.user}</span>{" "}
                      <span className="text-text-secondary">{activity.action}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                       <Clock size={10} className="text-text-tertiary" />
                       <span className="text-[10px] font-black text-text-tertiary uppercase tracking-tighter">
                        {timeAgo(activity.time)}
                       </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Event Summary / Quick Stats */}
            <div className="pt-6 border-t border-border/50">
              <h4 className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-4">Event Health</h4>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-surface-secondary border border-border/50 space-y-3">
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Uploader Engagement</span>
                      <span className="text-emerald-500 font-bold">High</span>
                   </div>
                   <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full gradient-primary" 
                      />
                   </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-secondary border border-border/50">
                   <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-2">Popular Tags</p>
                   <div className="flex flex-wrap gap-1.5">
                      {["#Wedding", "#Sunset", "#Dance", "#Party"].map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-[10px] font-medium text-text-secondary">
                          {tag}
                        </span>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
