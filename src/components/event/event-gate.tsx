"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatDate, formatTime } from "@/lib/utils";
import type { Event } from "@/db/schema";

interface EventGateProps {
  event: Event;
  onSuccess: (password?: string) => void;
}

export function EventGate({ event, onSuccess }: EventGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/events/${event.id}/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Verification failed");
      }

      onSuccess(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incorrect password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="overflow-hidden border-border bg-surface-elevated shadow-premium p-0">
          <div 
            className="h-32 relative"
            style={{ background: `linear-gradient(135deg, ${event.coverColor ?? "#6366f1"}dd, ${event.coverColor ?? "#6366f1"}88)` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <div 
                className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-lg border-4 border-surface-elevated"
                style={{ backgroundColor: event.coverColor ?? "#6366f1" }}
              >
                🔒
              </div>
            </div>
          </div>

          <div className="px-8 pt-12 pb-8 text-center">
            <h1 className="text-2xl font-bold text-text-primary">{event.title}</h1>
            <p className="mt-1 text-sm text-text-secondary">by {event.organizerName}</p>
            
            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-text-tertiary">
               <span className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <path d="M3 10h18" />
                </svg>
                {formatDate(event.startDate)}
              </span>
              {event.locationName && (
                <span className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  </svg>
                  {event.locationName}
                </span>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-sm font-medium text-text-primary">This event is private.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter event password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={error}
                    className="text-center tracking-widest"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                  >
                    {showPassword ? (
                       <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <Button type="submit" size="xl" className="w-full shadow-glow" loading={loading}>
                  Access Event
                </Button>
              </form>
              <button className="text-xs text-text-tertiary hover:text-text-secondary transition-colors underline underline-offset-4">
                Forgot password?
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
