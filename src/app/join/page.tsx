"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { QRScanner } from "@/components/camera/qr-scanner";
import { WelcomeAnimation } from "@/components/event/welcome-animation";
import { AuthFlow } from "@/components/auth/auth-flow";
import { EventGate } from "@/components/event/event-gate";
import { AnimatedGradientBg } from "@/components/landing/animated-gradient-bg";
import { PremiumNavbar } from "@/components/landing/premium-navbar";
import { formatDate, formatTime } from "@/lib/utils";
import type { Event } from "@/db/schema";

type JoinStep = "options" | "code" | "gate" | "auth" | "welcome";

function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [step, setStep] = useState<JoinStep>(initialCode ? "gate" : "options");
  const [code, setCode] = useState(initialCode);
  const [name, setName] = useState("");
  const [event, setEvent] = useState<Event | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (initialCode) {
      lookupEvent(initialCode);
    }
  }, []);

  const lookupEvent = async (eventCode?: string) => {
    const lookupCode = eventCode || code;
    if (!lookupCode.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/events?code=${encodeURIComponent(lookupCode.trim().toUpperCase())}`);
      if (!res.ok) throw new Error("Event not found");

      const { event: foundEvent } = await res.json();
      setEvent(foundEvent);
      setGuestCount(foundEvent.guestCount || 0);
      
      // Determine next step based on event privacy
      if (foundEvent.visibility !== "public" && foundEvent.passwordHash) {
        setStep("gate");
      } else {
        setStep("auth");
      }
    } catch (err) {
      setError("Invalid code or event not found.");
      setStep("code");
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = useCallback((data: string) => {
    setShowQRScanner(false);
    // Simple URL parsing or direct code scan
    let extractedCode = data;
    if (data.includes("?code=")) {
      extractedCode = data.split("?code=")[1].split("&")[0];
    } else if (data.includes("/join/")) {
      extractedCode = data.split("/join/")[1].split("/")[0];
    }
    
    if (extractedCode && extractedCode.length === 6) {
      setCode(extractedCode.toUpperCase());
      lookupEvent(extractedCode);
    } else {
      setError("Invalid QR code format.");
    }
  }, []);

  const handleGateSuccess = () => {
    setStep("auth");
  };

  const handleAuthSuccess = (user: any) => {
    setName(user.name);
    // In a real app, you'd register the guest here via API
    setStep("welcome");
  };

  const handleWelcomeComplete = () => {
    if (event) {
      router.push(`/event/${event.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <AnimatedGradientBg />
      <PremiumNavbar />

      <main className="relative flex min-h-screen items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {step === "options" && (
              <motion.div
                key="options"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="mx-auto mb-10 h-24 w-24 flex items-center justify-center rounded-[2rem] gradient-primary shadow-glow">
                  <svg viewBox="0 0 24 24" className="h-10 w-10 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-text-primary">Join Event</h1>
                <p className="mt-3 text-text-secondary">Scan, enter code, or use a shared link.</p>

                <div className="mt-12 space-y-6">
                  {/* Primary: Scan QR */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowQRScanner(true)}
                    className="group relative w-full overflow-hidden rounded-[2.5rem] bg-surface-elevated border-2 border-engram-500/20 p-8 text-left transition-all hover:border-engram-500/40 hover:shadow-glow"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                       <svg viewBox="0 0 24 24" className="h-32 w-32" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                    </div>
                    <div className="relative z-10 flex items-center gap-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-engram-500 text-white shadow-lg shadow-engram-500/30">
                        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-text-primary">Scan QR Code</h3>
                        <p className="text-sm text-text-secondary mt-1">Join instantly via camera</p>
                      </div>
                    </div>
                  </motion.button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep("code")}
                      className="flex flex-col items-center p-6 rounded-[2rem] bg-surface-elevated border border-border hover:border-text-tertiary transition-all text-center gap-3 shadow-sm"
                    >
                      <div className="p-3 rounded-2xl bg-surface-secondary text-text-primary">
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-text-primary uppercase tracking-wide">Event Code</p>
                        <p className="text-[10px] text-text-tertiary uppercase mt-1">Manual entry</p>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          if (text.length === 6) {
                            setCode(text.toUpperCase());
                            lookupEvent(text);
                          }
                        } catch {}
                      }}
                      className="flex flex-col items-center p-6 rounded-[2rem] bg-surface-elevated border border-border hover:border-text-tertiary transition-all text-center gap-3 shadow-sm"
                    >
                      <div className="p-3 rounded-2xl bg-surface-secondary text-text-primary">
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-text-primary uppercase tracking-wide">Paste Link</p>
                        <p className="text-[10px] text-text-tertiary uppercase mt-1">Shared invite</p>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "code" && (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary text-3xl mb-6 shadow-inner">
                  🔑
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-text-primary">Enter Code</h1>
                <p className="mt-2 text-text-secondary">Enter the 6-character event code</p>

                <div className="mt-10">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase().slice(0, 6));
                      setError("");
                    }}
                    placeholder="ABC123"
                    className="w-full rounded-[1.5rem] border border-border bg-surface-elevated px-6 py-6 text-center font-mono text-3xl font-bold tracking-[0.4em] text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-engram-500/30"
                    autoFocus
                  />
                  {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                </div>

                <div className="mt-8 flex gap-3">
                  <Button variant="ghost" size="lg" className="flex-1" onClick={() => setStep("options")}>Back</Button>
                  <Button size="xl" className="flex-[2] shadow-glow" loading={loading} onClick={() => lookupEvent()} disabled={code.length !== 6}>Find Event</Button>
                </div>
              </motion.div>
            )}

            {step === "gate" && event && (
              <EventGate event={event} onSuccess={handleGateSuccess} />
            )}

            {step === "auth" && (
              <AuthFlow onSuccess={handleAuthSuccess} />
            )}

            {step === "welcome" && event && (
              <WelcomeAnimation
                event={event}
                guestName={name}
                guestCount={guestCount}
                onComplete={handleWelcomeComplete}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      <QRScanner
        isOpen={showQRScanner}
        onScan={handleQRScan}
        onClose={() => setShowQRScanner(false)}
      />
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JoinContent />
    </Suspense>
  );
}
