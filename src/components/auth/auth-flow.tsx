"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth-service";
import { useToast } from "@/components/ui/toast";

type AuthPhase = "options" | "email" | "guest";

interface AuthFlowProps {
  onSuccess: (user: any) => void;
  onCancel?: () => void;
}

export function AuthFlow({ onSuccess, onCancel }: AuthFlowProps) {
  const { addToast } = useToast();
  const [phase, setPhase] = useState<AuthPhase>("options");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setLoading(true);
    try {
      if (provider === "google") await authService.signInWithGoogle();
      if (provider === "apple") await authService.signInWithApple();
    } catch (err) {
      addToast({ type: "error", title: "Auth Error", description: (err as Error).message });
      setLoading(false);
    }
  };

  const handleEmailNext = async () => {
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      if (isSignUp || password) {
         // Email + Password login/signup
         if (isSignUp) {
            // Need a separate sign up flow usually, but we'll use OTP or password for simplicity here
            await authService.signInWithEmail(email, password);
         } else {
            await authService.signInWithEmail(email, password);
         }
         onSuccess({ name: email.split("@")[0], email, provider: "email" });
      } else {
        // Magic Link
        await authService.signInWithEmail(email);
        addToast({ type: "success", title: "Link Sent", description: "Check your email for a login link." });
      }
    } catch (err) {
      addToast({ type: "error", title: "Auth Error", description: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const data = await authService.signInAnonymously(name.trim());
      onSuccess({ name: name.trim(), id: data.user?.id, provider: "guest" });
    } catch (err) {
      addToast({ type: "error", title: "Auth Error", description: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <AnimatePresence mode="wait">
        {phase === "options" && (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-text-primary">Sign in to Engram</h2>
              <p className="mt-2 text-sm text-text-secondary">Keep your memories safe forever.</p>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-2xl bg-surface-elevated border-border hover:bg-surface-secondary gap-3"
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c1.61-3.12 2.54-6.73 2.54-10.35z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-2xl bg-surface-elevated border-border hover:bg-surface-secondary gap-3"
                onClick={() => handleSocialLogin("apple")}
                disabled={loading}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05 1.72-3.26 1.72-1.18 0-1.63-.73-3.14-.73-1.55 0-2.02.71-3.14.71-1.21 0-2.39-.89-3.41-2.01C2.02 17.84 1 14.88 1 11.83c0-3.3 2.15-5.04 4.21-5.04 1.1 0 1.94.39 2.58.39.61 0 1.63-.44 2.89-.44 1.25 0 2.39.51 3.12 1.48-2.64 1.54-2.22 4.93.36 6.38-.63 1.57-1.42 3.14-2.11 4.68zM12.04 5.32c-.04-1.92 1.65-3.6 3.46-3.66.18 2.11-1.91 3.82-3.46 3.66z" />
                </svg>
                Continue with Apple
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-surface px-2 text-text-tertiary">or</span></div>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-2xl bg-surface-elevated border-border hover:bg-surface-secondary"
                onClick={() => setPhase("email")}
                disabled={loading}
              >
                Continue with Email
              </Button>
            </div>

            <div className="pt-4 border-t border-border/50">
              <button 
                onClick={() => setPhase("guest")}
                className="w-full py-3 rounded-2xl bg-engram-50/50 dark:bg-engram-950/20 text-engram-600 dark:text-engram-400 font-bold hover:bg-engram-50 dark:hover:bg-engram-950/40 transition-colors shadow-sm border border-engram-100 dark:border-engram-900/30"
              >
                Continue as Guest
              </button>
            </div>
          </motion.div>
        )}

        {phase === "email" && (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
             <div className="text-center">
              <h2 className="text-2xl font-bold text-text-primary">Your Email</h2>
              <p className="mt-2 text-sm text-text-secondary">We&apos;ll send you a secure login link.</p>
            </div>

            <div className="space-y-4">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <Button size="xl" className="w-full shadow-glow" loading={loading} onClick={handleEmailNext}>
                Send Login Link
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setPhase("options")}>
                Back
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "guest" && (
          <motion.div
            key="guest"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
             <div className="text-center">
              <h2 className="text-2xl font-bold text-text-primary">Guest Access</h2>
              <p className="mt-2 text-sm text-text-secondary">Just a name to join the event.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <label className="relative group cursor-pointer">
                  <input type="file" className="hidden" accept="image/*" />
                  <div className="w-24 h-24 rounded-[2rem] bg-surface-secondary border-2 border-dashed border-border flex items-center justify-center text-text-tertiary group-hover:border-engram-500 transition-colors overflow-hidden">
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </label>
              </div>
              
              <Input
                placeholder="Your display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && name.trim() && handleGuestSubmit()}
                autoFocus
              />
              <Button size="xl" className="w-full shadow-glow" loading={loading} onClick={handleGuestSubmit}>
                Continue to Event
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setPhase("options")}>
                Back
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
