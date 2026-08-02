"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Button } from "@/components/ui/button";
import { cn, timeAgo } from "@/lib/utils";
import type { Media } from "@/db/schema";

interface MediaGridProps {
  media: Media[];
  onSelect?: (item: Media) => void;
  selectable?: boolean;
  showUploader?: boolean;
}

export function MediaGrid({
  media,
  onSelect,
  selectable = false,
  showUploader = true,
}: MediaGridProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry");

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = () => {
    setSelectedIds(new Set(media.map((m) => m.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const downloadSelected = async () => {
    const selected = media.filter((m) => selectedIds.has(m.id));
    
    for (const item of selected) {
      const link = document.createElement("a");
      link.href = item.url;
      link.download = `engram-${item.id}.${item.type === "video" ? "mp4" : "jpg"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      await new Promise((r) => setTimeout(r, 500)); // Prevent overwhelming browser
    }
  };

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-secondary text-3xl">
          📸
        </div>
        <h3 className="mt-6 text-lg font-semibold text-text-primary">
          No photos yet
        </h3>
        <p className="mt-2 max-w-sm text-sm text-text-secondary">
          Share the QR code with your guests so they can start uploading photos
          and videos.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">
            {media.length} {media.length === 1 ? "item" : "items"}
          </span>
          {selectable && selectedIds.size > 0 && (
            <span className="rounded-full bg-engram-100 px-2.5 py-0.5 text-xs font-medium text-engram-700 dark:bg-engram-900/50 dark:text-engram-300">
              {selectedIds.size} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-border bg-surface-secondary p-0.5">
            <button
              onClick={() => setViewMode("masonry")}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                viewMode === "masonry"
                  ? "bg-surface-elevated text-text-primary shadow-sm"
                  : "text-text-tertiary hover:text-text-secondary"
              )}
              aria-pressed={viewMode === "masonry"}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="10" rx="1" />
                <rect x="14" y="3" width="7" height="6" rx="1" />
                <rect x="3" y="16" width="7" height="5" rx="1" />
                <rect x="14" y="12" width="7" height="9" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                viewMode === "grid"
                  ? "bg-surface-elevated text-text-primary shadow-sm"
                  : "text-text-tertiary hover:text-text-secondary"
              )}
              aria-pressed={viewMode === "grid"}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
          </div>

          {selectable && (
            <>
              {selectedIds.size > 0 ? (
                <>
                  <Button variant="ghost" size="sm" onClick={clearSelection}>
                    Clear
                  </Button>
                  <Button size="sm" onClick={downloadSelected}>
                    <svg viewBox="0 0 24 24" className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Select All
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Grid */}
      <div
        className={cn(
          "transition-all duration-500 ease-[0.16,1,0.3,1]",
          viewMode === "masonry"
            ? "columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5"
            : "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        )}
      >
        <AnimatePresence mode="popLayout">
          {media.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-xl",
                viewMode === "masonry" ? "mb-3 break-inside-avoid" : "aspect-square"
              )}
              onClick={() => {
                if (selectable) {
                  toggleSelect(item.id);
                } else {
                  onSelect?.(item);
                }
              }}
            >
              <OptimizedImage
                src={item.url}
                alt={`Photo by ${item.guestName || "guest"}`}
                fill={viewMode === "grid"}
                width={viewMode === "masonry" ? 400 : undefined}
                height={viewMode === "masonry" ? 300 : undefined}
                className={cn(
                  "transition-transform duration-500 group-hover:scale-105",
                  viewMode === "grid" ? "object-cover" : "w-full h-auto"
                )}
                containerClassName={viewMode === "grid" ? "h-full" : ""}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Selection indicator */}
              {selectable && (
                <div
                  className={cn(
                    "absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200",
                    selectedIds.has(item.id)
                      ? "border-engram-500 bg-engram-500"
                      : "border-white/70 bg-black/30 group-hover:bg-black/50"
                  )}
                >
                  {selectedIds.has(item.id) && (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              )}

              {/* Info overlay */}
              {showUploader && (
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-xs font-medium text-white/90 truncate">
                    {item.guestName || "Anonymous"}
                  </p>
                  <p className="text-xs text-white/60">
                    {item.createdAt ? timeAgo(item.createdAt) : ""}
                  </p>
                </div>
              )}

              {/* Video indicator */}
              {item.type === "video" && (
                <div className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="currentColor" aria-hidden="true">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
