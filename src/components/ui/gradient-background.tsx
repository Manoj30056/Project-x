"use client";

import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  className?: string;
  variant?: "default" | "subtle" | "vibrant";
}

export function GradientBackground({
  className,
  variant = "default",
}: GradientBackgroundProps) {
  const variants = {
    default: "opacity-30 dark:opacity-20",
    subtle: "opacity-15 dark:opacity-10",
    vibrant: "opacity-50 dark:opacity-30",
  };

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden",
        variants[variant],
        className
      )}
      aria-hidden="true"
    >
      {/* Top left orb */}
      <div
        className="absolute -top-1/2 -left-1/2 h-full w-full animate-float"
        style={{
          background:
            "radial-gradient(circle at center, rgba(139, 92, 246, 0.4) 0%, transparent 50%)",
          animationDelay: "0s",
        }}
      />

      {/* Top right orb */}
      <div
        className="absolute -top-1/4 -right-1/4 h-3/4 w-3/4 animate-float"
        style={{
          background:
            "radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
          animationDelay: "-2s",
        }}
      />

      {/* Bottom center orb */}
      <div
        className="absolute -bottom-1/4 left-1/4 h-1/2 w-1/2 animate-float"
        style={{
          background:
            "radial-gradient(circle at center, rgba(236, 72, 153, 0.25) 0%, transparent 50%)",
          animationDelay: "-4s",
        }}
      />

      {/* Noise overlay for texture */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}

export function GradientMesh({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden opacity-40 dark:opacity-20",
        className
      )}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mesh-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.2)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.15)" />
          </linearGradient>
          <filter id="mesh-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#mesh-gradient-1)" filter="url(#mesh-blur)" />
      </svg>
    </div>
  );
}
