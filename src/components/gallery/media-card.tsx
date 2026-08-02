"use client";

import { motion } from "framer-motion";
import { 
  Heart, 
  MessageSquare, 
  Download, 
  MoreHorizontal, 
  MapPin, 
  Clock,
  Play,
  Eye,
  Star
} from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/optimized-image";
import type { MediaItem } from "@/types";
import { useState } from "react";

interface MediaCardProps {
  item: MediaItem;
  viewMode: "grid" | "masonry" | "timeline" | "list" | "large";
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function MediaCard({
  item,
  viewMode,
  selectable,
  selected,
  onSelect,
  onClick,
}: MediaCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = item.url;
    link.download = `engram-${item.id}`;
    link.click();
  };

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        className={cn(
          "flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-secondary transition-colors group",
          selected && "bg-engram-500/10"
        )}
        onClick={() => onClick?.(item.id)}
      >
        <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0">
          <OptimizedImage src={item.url} alt="" fill className="object-cover" />
          {item.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Play size={12} fill="white" className="text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text-primary truncate">
            {item.uploaderName}
          </h4>
          <p className="text-xs text-text-tertiary flex items-center gap-1">
            <Clock size={10} />
            {timeAgo(item.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-4 text-text-tertiary px-4">
          <div className="flex items-center gap-1.5">
            <Heart size={14} className={cn(isLiked && "text-rose-500 fill-rose-500")} />
            <span className="text-xs">12</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare size={14} />
            <span className="text-xs">3</span>
          </div>
          {item.type === "video" && (
            <div className="flex items-center gap-1.5">
              <Eye size={14} />
              <span className="text-xs">124</span>
            </div>
          )}
        </div>

        <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={18} />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "group relative rounded-2xl overflow-hidden bg-surface-secondary cursor-pointer",
        viewMode === "masonry" ? "mb-4" : "aspect-[4/5]",
        viewMode === "large" && "aspect-video max-w-4xl mx-auto mb-8",
        selected && "ring-2 ring-engram-500 ring-offset-2 ring-offset-surface"
      )}
      onClick={() => onClick?.(item.id)}
    >
      <OptimizedImage
        src={item.url}
        alt=""
        fill={viewMode !== "masonry"}
        width={viewMode === "masonry" ? 400 : undefined}
        height={viewMode === "masonry" ? 500 : undefined}
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Video indicators */}
      {item.type === "video" && (
        <>
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            0:42
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
            <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Play size={32} fill="white" className="text-white ml-1" />
            </div>
          </div>
        </>
      )}

      {/* Top Overlays */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        {selectable ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(item.id);
            }}
            className={cn(
              "h-6 w-6 rounded-full border-2 transition-all flex items-center justify-center",
              selected ? "bg-engram-500 border-engram-500" : "bg-black/20 border-white/70"
            )}
          >
            {selected && <Play size={10} fill="white" className="text-white rotate-90" />}
          </button>
        ) : (
          <button
            onClick={handleFavorite}
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all",
              isFavorite ? "bg-amber-500 text-white" : "bg-black/20 text-white hover:bg-black/40"
            )}
          >
            <Star size={18} fill={isFavorite ? "white" : "none"} />
          </button>
        )}

        <div className="flex flex-col gap-2">
          <button onClick={handleDownload} className="h-10 w-10 rounded-full bg-black/20 text-white flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-black/40 transition-all">
            <Download size={18} />
          </button>
          <button className="h-10 w-10 rounded-full bg-black/20 text-white flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-black/40 transition-all">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Bottom Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-engram-400 to-engram-600 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white uppercase">
            {item.uploaderName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate leading-none mb-1">
              {item.uploaderName}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-white/60 font-medium uppercase tracking-wider">
              <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(item.createdAt)}</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="flex items-center gap-1"><MapPin size={10} /> Venue</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <div className="flex items-center gap-4 text-white">
            <button onClick={handleLike} className="flex items-center gap-1.5 hover:text-rose-400 transition-colors">
              <Heart size={16} className={cn(isLiked && "text-rose-500 fill-rose-500")} />
              <span className="text-xs font-bold">{isLiked ? 13 : 12}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
              <MessageSquare size={16} />
              <span className="text-xs font-bold">3</span>
            </button>
            {item.type === "video" && (
              <div className="flex items-center gap-1.5 text-white/60">
                <Eye size={16} />
                <span className="text-xs font-bold">124</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
