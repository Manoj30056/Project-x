"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn, timeAgo } from "@/lib/utils";
import type { Media } from "@/db/schema";

interface LightboxProps {
  media: Media[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({
  media,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const [isInfoVisible, setIsInfoVisible] = useState(true);
  const current = media[currentIndex];

  const handlePrev = useCallback(() => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : media.length - 1;
    onNavigate(prevIndex);
  }, [currentIndex, media.length, onNavigate]);

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex < media.length - 1 ? currentIndex + 1 : 0;
    onNavigate(nextIndex);
  }, [currentIndex, media.length, onNavigate]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          handlePrev();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "i":
          setIsInfoVisible((prev) => !prev);
          break;
      }
    },
    [onClose, handlePrev, handleNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = current.url;
    link.download = `engram-${current.id}.${current.type === "video" ? "mp4" : "jpg"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
            {currentIndex + 1} / {media.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setIsInfoVisible((prev) => !prev);
            }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Navigation arrows */}
      {media.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 sm:left-4"
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 sm:right-4"
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Main image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative max-h-[80vh] max-w-[90vw] sm:max-h-[85vh] sm:max-w-[85vw]"
          onClick={(e) => e.stopPropagation()}
        >
          {current.type === "video" ? (
            <video
              src={current.url}
              controls
              autoPlay
              className="max-h-[80vh] max-w-full rounded-lg object-contain sm:max-h-[85vh]"
            />
          ) : (
            <Image
              src={current.url}
              alt={`Photo by ${current.guestName || "guest"}`}
              width={1600}
              height={1200}
              className="max-h-[80vh] max-w-full rounded-lg object-contain sm:max-h-[85vh]"
              quality={95}
              priority
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Info panel */}
      <AnimatePresence>
        {isInfoVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6"
          >
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                  {(current.guestName || "A").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-white">
                    {current.guestName || "Anonymous"}
                  </p>
                  <p className="text-sm text-white/60">
                    {current.createdAt ? timeAgo(current.createdAt) : ""}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-4 right-4 hidden items-center gap-4 text-xs text-white/40 sm:flex">
        <span>← → Navigate</span>
        <span>ESC Close</span>
        <span>I Toggle info</span>
      </div>
    </motion.div>
  );
}
