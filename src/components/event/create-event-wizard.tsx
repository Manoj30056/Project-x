"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PasswordStrength } from "@/components/ui/password-strength";
import { cn } from "@/lib/utils";
import { THEME_COLORS } from "@/constants/app";
import { useToast } from "@/components/ui/toast";

const steps = [
  { id: 1, title: "Basics", description: "Name and cover" },
  { id: 2, title: "Timing", description: "When and where" },
  { id: 3, title: "Privacy", description: "Who can see it" },
];

export function CreateEventWizard() {
  const router = useRouter();
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    endDate: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    location: "",
    isOnline: false,
    isPublic: true,
    password: "",
    confirmPassword: "",
    coverColor: THEME_COLORS[0].value,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Event name is required";
    } else if (step === 2) {
      if (!formData.date) newErrors.date = "Start date is required";
      if (!formData.isOnline && !formData.location.trim()) newErrors.location = "Location is required for in-person events";
    } else if (step === 3) {
      if (!formData.isPublic && !formData.password) newErrors.password = "Password is required for private events";
      if (!formData.isPublic && formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.name,
          description: formData.description,
          startDate: formData.date,
          endDate: formData.endDate,
          timezone: formData.timezone,
          locationName: formData.location,
          isOnline: formData.isOnline,
          visibility: formData.isPublic ? "public" : "private",
          password: formData.password,
          coverColor: formData.coverColor,
          organizerName: "User", // This should come from current user session
          organizerEmail: "",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create event");
      }

      const { event } = await res.json();
      addToast({
        type: "success",
        title: "Event Created!",
        description: "Your shared memory space is ready.",
      });
      router.push(`/event/${event.id}`);
    } catch (err) {
      addToast({
        type: "error",
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6">
      {/* Header & Progress */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary">Create Event</h1>
        <p className="mt-2 text-text-secondary">Capture every memory in one place.</p>
        
        <div className="mt-10 relative flex justify-between items-center max-w-md mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
          <motion.div 
            className="absolute top-1/2 left-0 h-0.5 bg-engram-500 -translate-y-1/2 z-0"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((step) => (
            <div key={step.id} className="relative z-10">
              <motion.div
                animate={{
                  backgroundColor: currentStep >= step.id ? "var(--color-engram-500)" : "var(--color-surface-elevated)",
                  borderColor: currentStep >= step.id ? "var(--color-engram-500)" : "var(--color-border)",
                  color: currentStep >= step.id ? "#fff" : "var(--color-text-tertiary)",
                }}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold shadow-sm transition-colors duration-300"
                )}
              >
                {currentStep > step.id ? (
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : step.id}
              </motion.div>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                <p className={cn("text-xs font-bold uppercase tracking-wider", currentStep >= step.id ? "text-text-primary" : "text-text-tertiary")}>
                  {step.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="relative overflow-hidden p-0 border-border bg-surface-elevated shadow-premium">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 sm:p-10"
          >
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Input
                    label="Event Name"
                    placeholder="E.g. Sarah's 30th Birthday"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    error={errors.name}
                    className="text-lg"
                    autoFocus
                  />
                  <Input
                    label="Description"
                    placeholder="What's the occasion?"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary">Event Theme</label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {THEME_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateField("coverColor", color.value)}
                        className={cn(
                          "group relative aspect-square rounded-2xl p-1 transition-all",
                          formData.coverColor === color.value ? "ring-2 ring-engram-500 ring-offset-2" : "hover:scale-105"
                        )}
                      >
                        <div 
                          className="h-full w-full rounded-xl shadow-inner"
                          style={{ backgroundColor: color.value }}
                        />
                      </button>
                    ))}
                  </div>
                  <div 
                    className="mt-4 h-32 rounded-3xl overflow-hidden relative shadow-inner border border-white/10"
                    style={{ background: `linear-gradient(135deg, ${formData.coverColor}dd, ${formData.coverColor}88)` }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/30 text-sm font-medium uppercase tracking-[0.2em]">Preview</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Start Date & Time"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    error={errors.date}
                  />
                  <Input
                    label="End Date & Time (Optional)"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => updateField("endDate", e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-text-primary">Online Event</label>
                    <button
                      onClick={() => updateField("isOnline", !formData.isOnline)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-engram-500 focus:ring-offset-2",
                        formData.isOnline ? "bg-engram-600" : "bg-border"
                      )}
                    >
                      <span className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        formData.isOnline ? "translate-x-6" : "translate-x-1"
                      )} />
                    </button>
                  </div>

                  {!formData.isOnline && (
                    <Input
                      label="Location"
                      placeholder="Venue, City, or Address"
                      value={formData.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      error={errors.location}
                      icon={
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      }
                    />
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary">Time Zone</label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => updateField("timezone", e.target.value)}
                      className="w-full h-11 rounded-xl border border-border bg-surface px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-engram-500/30 transition-all"
                    >
                      {Intl.supportedValuesOf("timeZone").map((tz) => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => updateField("isPublic", true)}
                      className={cn(
                        "flex-1 flex flex-col items-center p-6 rounded-3xl border-2 transition-all text-center gap-3",
                        formData.isPublic ? "border-engram-500 bg-engram-50/50 dark:bg-engram-950/20 shadow-sm" : "border-border hover:border-text-tertiary"
                      )}
                    >
                      <div className={cn("p-3 rounded-2xl", formData.isPublic ? "bg-engram-500 text-white" : "bg-surface-secondary text-text-secondary")}>
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 11V7a5 5 0 0110 0v4" />
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M12 15v3" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">Public Event</p>
                        <p className="text-xs text-text-tertiary mt-1">Anyone with the link can join</p>
                      </div>
                    </button>

                    <button
                      onClick={() => updateField("isPublic", false)}
                      className={cn(
                        "flex-1 flex flex-col items-center p-6 rounded-3xl border-2 transition-all text-center gap-3",
                        !formData.isPublic ? "border-engram-500 bg-engram-50/50 dark:bg-engram-950/20 shadow-sm" : "border-border hover:border-text-tertiary"
                      )}
                    >
                      <div className={cn("p-3 rounded-2xl", !formData.isPublic ? "bg-engram-500 text-white" : "bg-surface-secondary text-text-secondary")}>
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0110 0v4" />
                          <path d="M12 15v3" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">Private Event</p>
                        <p className="text-xs text-text-tertiary mt-1">Requires a password to join</p>
                      </div>
                    </button>
                  </div>

                  {!formData.isPublic && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="space-y-4 pt-4"
                    >
                      <div className="space-y-4">
                        <Input
                          label="Create Password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => updateField("password", e.target.value)}
                          error={errors.password}
                        />
                        <PasswordStrength password={formData.password} />
                        <Input
                          label="Confirm Password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => updateField("confirmPassword", e.target.value)}
                          error={errors.confirmPassword}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-8">
              <Button
                variant="ghost"
                size="lg"
                onClick={prevStep}
                disabled={currentStep === 1 || loading}
                className={cn(currentStep === 1 && "invisible")}
              >
                Back
              </Button>
              
              <div className="flex gap-3">
                {currentStep < steps.length ? (
                  <Button size="xl" onClick={nextStep} className="px-8 shadow-glow">
                    Continue
                    <svg viewBox="0 0 24 24" className="h-5 w-5 ml-2" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Button>
                ) : (
                  <Button size="xl" onClick={handleSubmit} loading={loading} className="px-10 gradient-primary shadow-glow">
                    Create Event
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
