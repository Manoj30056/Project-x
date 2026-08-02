"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Grid2X2, 
  LayoutGrid, 
  Clock, 
  List, 
  Maximize, 
  Filter, 
  ArrowUpDown,
  Camera,
  Trash2,
  Download,
  Share2,
  Calendar,
  Sparkles,
  MapPin,
  Heart
} from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { useGalleryStore } from "@/store/gallery-store";
import { MediaCard } from "@/components/gallery/media-card";
import { cn } from "@/lib/utils";
import type { Media } from "@/db/schema";
import { Button } from "@/components/ui/button";
import type { MediaItem } from "@/types";

interface GallerySectionProps {
  media: Media[];
}

export function GallerySection({ media }: GallerySectionProps) {
  const { galleryViewMode, setGalleryViewMode } = useUIStore();
  const { 
    isSelectMode, 
    toggleSelectMode, 
    selectedMedia, 
    toggleSelection,
    deselectAll,
    sortBy,
    setSortBy,
    setLightboxIndex
  } = useGalleryStore();

  const viewModes = [
    { id: "masonry", icon: LayoutGrid, label: "Masonry" },
    { id: "grid", icon: Grid2X2, label: "Grid" },
    { id: "timeline", icon: Clock, label: "Timeline" },
    { id: "list", icon: List, label: "List" },
    { id: "large", icon: Maximize, label: "Large" },
  ] as const;

  // Convert Media[] to MediaItem[] for consistency
  const mediaItems: MediaItem[] = media.map(m => ({
    id: m.id,
    type: m.type as "image" | "video",
    url: m.url,
    uploaderName: m.guestName || "Anonymous",
    uploaderId: m.guestId || undefined,
    eventId: m.eventId,
    isFavorite: m.isFavorite || false,
    aiTags: (m.aiTags as string[]) || [],
    createdAt: m.createdAt?.toISOString() || new Date().toISOString(),
  }));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Gallery Toolbar */}
      <div className="sticky top-0 z-30 py-4 bg-surface/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 border-b border-border/30 mb-6">
        <div className="flex items-center gap-2">
          {/* View Selector */}
          <div className="flex items-center bg-surface-secondary border border-border/50 p-1 rounded-xl shadow-inner">
             {viewModes.map((mode) => (
               <button
                 key={mode.id}
                 onClick={() => setGalleryViewMode(mode.id)}
                 className={cn(
                   "p-2 rounded-lg transition-all relative group",
                   galleryViewMode === mode.id ? "bg-surface-elevated text-engram-500 shadow-sm" : "text-text-tertiary hover:text-text-primary"
                 )}
               >
                 <mode.icon size={18} />
                 <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-text-primary text-surface text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                   {mode.label}
                 </div>
               </button>
             ))}
          </div>

          <div className="h-4 w-px bg-border/50 mx-2" />

          {/* Sort & Filter Menus (Simplified for this part) */}
          <div className="flex items-center gap-1">
             <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-text-secondary hover:bg-surface-secondary transition-colors border border-border/50">
                  <ArrowUpDown size={16} className="text-engram-500" />
                  <span className="hidden sm:inline">Sort: {sortBy}</span>
                </button>
             </div>
             
             <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-text-secondary hover:bg-surface-secondary transition-colors border border-border/50">
                  <Filter size={16} className="text-engram-500" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isSelectMode ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-xs font-black uppercase tracking-tighter text-engram-500 bg-engram-500/10 px-3 py-2 rounded-full border border-engram-500/20">
                {selectedMedia.size} Selected
              </span>
              <button 
                onClick={deselectAll}
                className="text-[10px] font-black text-text-tertiary hover:text-text-primary uppercase tracking-widest px-3"
              >
                Clear
              </button>
              <div className="flex items-center bg-surface-secondary border border-border/50 p-1.5 rounded-xl gap-2 shadow-inner">
                 <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded-lg transition-all" title="Download Selected">
                   <Download size={16} />
                 </button>
                 <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded-lg transition-all" title="Share Selected">
                   <Share2 size={16} />
                 </button>
                 <button className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all" title="Delete Selected">
                   <Trash2 size={16} />
                 </button>
              </div>
              <button 
                onClick={toggleSelectMode}
                className="h-10 px-4 rounded-xl text-sm font-bold text-text-secondary hover:bg-surface-secondary transition-all"
              >
                Exit
              </button>
            </motion.div>
          ) : (
            <button 
              onClick={toggleSelectMode}
              className="h-10 px-5 rounded-xl text-sm font-bold text-text-secondary hover:bg-surface-secondary border border-border/50 transition-all active:scale-95"
            >
              Select
            </button>
          )}

          <Button size="md" className="hidden sm:flex rounded-xl shadow-glow font-bold tracking-tight px-6 h-10">
            <Camera size={18} className="mr-2" />
            Open Camera
          </Button>
        </div>
      </div>

      {/* Grid Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        <AnimatePresence mode="wait">
          {mediaItems.length > 0 ? (
            <motion.div
              key={galleryViewMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {galleryViewMode === "timeline" ? (
                <div className="space-y-12">
                   <div className="relative pl-8 border-l-2 border-border/50 ml-4">
                      <div className="absolute -left-2.5 top-0 w-4 h-4 rounded-full bg-engram-500 shadow-glow" />
                      <h3 className="text-xl font-black text-text-primary mb-6 flex items-center gap-3">
                         Today
                         <span className="text-xs font-bold text-text-tertiary uppercase tracking-widest">{mediaItems.length} Moments</span>
                      </h3>
                      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
                        {mediaItems.map((item, i) => (
                          <MediaCard
                            key={item.id}
                            item={item}
                            viewMode="masonry"
                            selectable={isSelectMode}
                            selected={selectedMedia.has(item.id)}
                            onSelect={toggleSelection}
                            onClick={(id) => setLightboxIndex(i)}
                          />
                        ))}
                      </div>
                   </div>
                </div>
              ) : galleryViewMode === "list" ? (
                <div className="max-w-4xl mx-auto space-y-2">
                   {mediaItems.map((item, i) => (
                      <MediaCard
                        key={item.id}
                        item={item}
                        viewMode="list"
                        selectable={isSelectMode}
                        selected={selectedMedia.has(item.id)}
                        onSelect={toggleSelection}
                        onClick={(id) => setLightboxIndex(i)}
                      />
                    ))}
                </div>
              ) : galleryViewMode === "large" ? (
                <div className="space-y-8">
                   {mediaItems.map((item, i) => (
                      <MediaCard
                        key={item.id}
                        item={item}
                        viewMode="large"
                        selectable={isSelectMode}
                        selected={selectedMedia.has(item.id)}
                        onSelect={toggleSelection}
                        onClick={(id) => setLightboxIndex(i)}
                      />
                    ))}
                </div>
              ) : (
                <div className={cn(
                  "transition-all duration-500",
                  galleryViewMode === "masonry" 
                    ? "columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4"
                    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                )}>
                  {mediaItems.map((item, i) => (
                    <MediaCard
                      key={item.id}
                      item={item}
                      viewMode={galleryViewMode === "masonry" ? "masonry" : "grid"}
                      selectable={isSelectMode}
                      selected={selectedMedia.has(item.id)}
                      onSelect={toggleSelection}
                      onClick={(id) => setLightboxIndex(i)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-40 text-center space-y-6"
            >
              <div className="h-32 w-32 rounded-[2.5rem] bg-surface-secondary flex items-center justify-center relative group">
                 <div className="absolute inset-0 bg-engram-500/10 blur-3xl group-hover:bg-engram-500/20 transition-colors duration-500" />
                 <Camera size={48} className="text-text-tertiary group-hover:text-engram-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-text-primary tracking-tighter">No memories yet</h3>
                <p className="text-text-secondary max-w-sm mx-auto font-medium">
                  The gallery is ready for your first memory. Scan the QR code to let everyone start sharing!
                </p>
              </div>
              <Button size="xl" className="rounded-2xl shadow-glow font-bold tracking-tight px-10 h-14">
                 Open Camera
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
