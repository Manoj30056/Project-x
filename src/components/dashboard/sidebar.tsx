"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUIStore, DashboardSection } from "@/store/ui-store";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Video, 
  Users, 
  Map as MapIcon, 
  Star, 
  FolderOpen, 
  Download, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  BarChart3,
  Smile
} from "lucide-react";

interface SidebarItem {
  id: DashboardSection;
  label: string;
  icon: any;
}

const sidebarItems: SidebarItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "videos", label: "Videos", icon: Video },
  { id: "guests", label: "Guests", icon: Users },
  { id: "people", label: "People (AI)", icon: Smile },
  { id: "map", label: "Map", icon: MapIcon },
  { id: "favorites", label: "Favorites", icon: Star },
  { id: "albums", label: "Albums", icon: FolderOpen },
  { id: "downloads", label: "Downloads", icon: Download },
  { id: "qr_invite", label: "QR & Invite", icon: Smartphone },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const { 
    activeSection, 
    setActiveSection, 
    isSidebarCollapsed, 
    setSidebarCollapsed,
    isMobileMenuOpen,
    closeMobileMenu
  } = useUIStore();

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeMobileMenu]);

  const SidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header / Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
             <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
          </div>
          {(!isSidebarCollapsed || isMobileMenuOpen) && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-text-primary tracking-tight"
            >
              ENGRAM
            </motion.span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              if (isMobileMenuOpen) closeMobileMenu();
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/item relative",
              activeSection === item.id 
                ? "bg-engram-500/10 text-engram-600 dark:text-engram-400" 
                : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 shrink-0 transition-transform duration-200 group-hover/item:scale-110",
              activeSection === item.id ? "text-engram-500" : "text-text-tertiary"
            )} />
            {(!isSidebarCollapsed || isMobileMenuOpen) && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm font-medium"
              >
                {item.label}
              </motion.span>
            )}
            
            {activeSection === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="absolute left-0 w-1 h-6 bg-engram-500 rounded-r-full"
              />
            )}

            {isSidebarCollapsed && !isMobileMenuOpen && (
              <div className="absolute left-14 px-2 py-1 bg-text-primary text-surface rounded text-xs opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Footer / Toggle */}
      {!isMobileMenuOpen && (
        <div className="p-4 border-t border-border/50 shrink-0">
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center justify-center h-10 rounded-xl hover:bg-surface-secondary text-text-tertiary transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!isSidebarCollapsed && <span className="ml-2 text-xs font-medium">Collapse</span>}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 280 }}
        className="hidden lg:flex flex-col h-screen border-r border-border bg-surface-elevated/50 backdrop-blur-xl sticky top-0 z-50 group"
      >
        {SidebarContent}
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 w-full max-w-[280px] bg-surface border-r border-border"
            >
              {SidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
