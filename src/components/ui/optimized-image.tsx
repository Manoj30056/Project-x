"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  quality?: number;
  onLoad?: () => void;
  onClick?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  containerClassName,
  priority = false,
  quality = 80,
  onLoad,
  onClick,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-surface-secondary",
        containerClassName
      )}
      onClick={onClick}
    >
      {/* Placeholder / skeleton */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="h-8 w-8 rounded-lg bg-surface-secondary">
          <div className="h-full w-full animate-pulse rounded-lg bg-border" />
        </div>
      </motion.div>

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-secondary">
          <div className="text-center">
            <svg
              viewBox="0 0 24 24"
              className="mx-auto h-8 w-8 text-text-tertiary"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="3" x2="21" y2="21" />
            </svg>
            <p className="mt-2 text-xs text-text-tertiary">Failed to load</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="h-full w-full"
        >
          {fill ? (
            <Image
              src={src}
              alt={alt}
              fill
              className={cn("object-cover", className)}
              quality={quality}
              onLoad={handleLoad}
              onError={handleError}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              width={width || 400}
              height={height || 300}
              className={className}
              quality={quality}
              onLoad={handleLoad}
              onError={handleError}
            />
          )}
        </motion.div>
      )}
    </div>
  );
}
