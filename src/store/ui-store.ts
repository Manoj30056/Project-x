import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "@/types/ui";

export type DashboardSection = "overview" | "gallery" | "videos" | "guests" | "people" | "map" | "favorites" | "albums" | "downloads" | "qr_invite" | "analytics" | "settings";

interface UIState {
  // Theme
  theme: Theme;
  resolvedTheme: "light" | "dark";
  
  // Navigation
  isMobileMenuOpen: boolean;
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  isActivityPanelOpen: boolean;
  activeSection: DashboardSection;
  
  // Modals
  activeModal: string | null;
  modalData: Record<string, unknown>;
  
  // Command palette
  isCommandPaletteOpen: boolean;
  
  // Accessibility
  reducedMotion: boolean;
  highContrast: boolean;
  
  // Layout
  galleryViewMode: "grid" | "masonry" | "timeline" | "list" | "large";
  
  // Actions
  setTheme: (theme: Theme) => void;
  setResolvedTheme: (theme: "light" | "dark") => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleActivityPanel: () => void;
  setActiveSection: (section: DashboardSection) => void;
  openModal: (id: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  toggleCommandPalette: () => void;
  setReducedMotion: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  setGalleryViewMode: (mode: "grid" | "masonry" | "timeline" | "list" | "large") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "dark",
      resolvedTheme: "dark",
      isMobileMenuOpen: false,
      isSidebarOpen: true,
      isSidebarCollapsed: false,
      isActivityPanelOpen: true,
      activeSection: "gallery",
      activeModal: null,
      modalData: {},
      isCommandPaletteOpen: false,
      reducedMotion: false,
      highContrast: false,
      galleryViewMode: "masonry",
      
      setTheme: (theme) => set({ theme }),
      
      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
      
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),
      
      toggleActivityPanel: () => set((state) => ({ isActivityPanelOpen: !state.isActivityPanelOpen })),
      
      setActiveSection: (activeSection) => set({ activeSection }),
      
      openModal: (id, data = {}) => set({ activeModal: id, modalData: data }),
      
      closeModal: () => set({ activeModal: null, modalData: {} }),
      
      toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
      
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      
      setHighContrast: (highContrast) => set({ highContrast }),
      
      setGalleryViewMode: (galleryViewMode) => set({ galleryViewMode }),
    }),
    {
      name: "engram-ui-store",
      partialize: (state) => ({
        theme: state.theme,
        isSidebarCollapsed: state.isSidebarCollapsed,
        reducedMotion: state.reducedMotion,
        highContrast: state.highContrast,
        galleryViewMode: state.galleryViewMode,
      }),
    }
  )
);
