"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing", badge: "Free Forever" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function PremiumNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.8)"]
  );
  
  const navBackgroundDark = useTransform(
    scrollY,
    [0, 100],
    ["rgba(10,10,10,0)", "rgba(10,10,10,0.8)"]
  );
  
  const navHeight = useTransform(scrollY, [0, 100], [80, 64]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 20]);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        style={{ height: navHeight }}
        className="fixed top-0 left-0 right-0 z-[100]"
      >
        <motion.div
          className="absolute inset-0 border-b transition-colors duration-300 dark:border-white/5 border-black/5"
          style={{
            backdropFilter: useTransform(navBlur, (v) => `blur(${v}px) saturate(180%)`),
            WebkitBackdropFilter: useTransform(navBlur, (v) => `blur(${v}px) saturate(180%)`),
          }}
        >
          <motion.div
            className="absolute inset-0 dark:hidden"
            style={{ backgroundColor: navBackground }}
          />
          <motion.div
            className="absolute inset-0 hidden dark:block"
            style={{ backgroundColor: navBackgroundDark }}
          />
        </motion.div>

        <nav className="relative mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group z-10">
            <motion.div 
              className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-engram-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </motion.div>
            <span className="text-xl font-bold tracking-tight text-text-primary">
              ENGRAM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary group"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-1.5 inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                    {link.badge}
                  </span>
                )}
                <motion.span
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-engram-500 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/join">
              <Button variant="ghost" size="sm">
                Join Event
              </Button>
            </Link>
            <Link href="/create">
              <Button size="sm">
                <svg viewBox="0 0 24 24" className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Create Event
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl text-text-secondary hover:bg-surface-secondary transition-colors z-10"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <motion.line
                x1="4" y1="6" x2="20" y2="6"
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                style={{ transformOrigin: "center" }}
              />
              <motion.line
                x1="4" y1="12" x2="20" y2="12"
                animate={mobileOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
              />
              <motion.line
                x1="4" y1="18" x2="20" y2="18"
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                style={{ transformOrigin: "center" }}
              />
            </svg>
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-surface border-l border-border shadow-2xl"
            >
              <div className="flex flex-col h-full pt-24 pb-8 px-6">
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-medium text-text-primary hover:bg-surface-secondary transition-colors"
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          {link.badge}
                        </span>
                      )}
                    </motion.a>
                  ))}
                </nav>

                <div className="mt-auto space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-surface-secondary"
                  >
                    <span className="text-sm text-text-secondary">Theme</span>
                    <ThemeToggle />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <Link href="/join" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Join Event
                      </Button>
                    </Link>
                    <Link href="/create" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full">
                        Create Event
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
