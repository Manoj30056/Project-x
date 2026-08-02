"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password?: string;
  className?: string;
}

export function PasswordStrength({ password = "", className }: PasswordStrengthProps) {
  const getStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 6) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(password);
  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = [
    "bg-slate-200",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-emerald-500",
    "bg-blue-500",
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-1.5 h-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <motion.div
            key={level}
            initial={false}
            animate={{
              backgroundColor: strength >= level ? "var(--tw-bg-opacity)" : "rgb(229 231 235)",
            }}
            className={cn(
              "flex-1 rounded-full transition-colors duration-300",
              strength >= level ? colors[strength] : "bg-border"
            )}
          />
        ))}
      </div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
        Strength: <span className={cn(strength > 0 && "text-text-primary")}>{labels[strength - 1] || "None"}</span>
      </p>
    </div>
  );
}
