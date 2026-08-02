"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MediaGrid } from "@/components/gallery/media-grid";
import { Lightbox } from "@/components/gallery/lightbox";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaCapture } from "@/components/camera/media-capture";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatTime, timeAgo } from "@/lib/utils";
import type { Event, Guest, Media } from "@/db/schema";

type Tab = "gallery" | "guests" | "settings";

interface GuestSession {
  id: string;
  name: string;
}

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopBar } from "@/components/dashboard/top-bar";
import { ActivityPanel } from "@/components/dashboard/activity-panel";
import { OverviewSection } from "@/components/dashboard/overview-section";
import { GallerySection } from "@/components/dashboard/gallery-section";
import { PeopleSection } from "@/components/dashboard/people-section";
import { MapSection } from "@/components/dashboard/map-section";
import { QRInviteSection } from "@/components/dashboard/qr-invite-section";
import { useUIStore } from "@/store/ui-store";
import { LayoutDashboard, Image as ImageIcon, Map as MapIcon, Settings, Camera, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function EventPage() {
  const params = useParams();
  const id = params.id as string;
  const { addToast } = useToast();
  const { activeSection, isActivityPanelOpen, setActiveSection } = useUIStore();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isEntering, setIsEntering] = useState(true);

  // Transition handler
  useEffect(() => {
    if (event) {
      const timer = setTimeout(() => setIsEntering(false), 800);
      return () => clearTimeout(timer);
    }
  }, [event]);
  const [eventGuests, setEventGuests] = useState<Guest[]>([]);
  const [eventMedia, setEventMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState<{
    qr: string;
    accessCode: string;
    joinUrl: string;
  } | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [guestSession, setGuestSession] = useState<GuestSession | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  // Load guest session from storage
  useEffect(() => {
    const stored = sessionStorage.getItem(`engram-guest-${id}`);
    if (stored) {
      try {
        setGuestSession(JSON.parse(stored));
      } catch {
        // Ignore parse errors
      }
    }
  }, [id]);

  const fetchEvent = useCallback(async () => {
    try {
      const res = await fetch(`/api/events/${id}`);
      if (!res.ok) throw new Error("Event not found");
      const data = await res.json();
      setEvent(data.event);
      setEventGuests(data.guests);
      setEventMedia(data.media);
    } catch {
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const fetchQR = async () => {
    try {
      const res = await fetch(`/api/events/${id}/qr`);
      const data = await res.json();
      setQrData(data);
      setShowQR(true);
    } catch {
      addToast({
        type: "error",
        title: "Failed to load QR code",
        description: "Please try again",
      });
    }
  };

  const copyCode = async () => {
    if (qrData?.accessCode) {
      await navigator.clipboard.writeText(qrData.accessCode);
      addToast({
        type: "success",
        title: "Copied!",
        description: "Access code copied to clipboard",
      });
    }
  };

  const copyLink = async () => {
    if (qrData?.joinUrl) {
      await navigator.clipboard.writeText(qrData.joinUrl);
      addToast({
        type: "success",
        title: "Copied!",
        description: "Join link copied to clipboard",
      });
    }
  };

  const handleMediaSelect = (media: Media) => {
    const index = eventMedia.findIndex((m) => m.id === media.id);
    setLightboxIndex(index);
  };

  const handleMediaUpload = async (files: File[]) => {
    if (!event || files.length === 0) return;

    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    const guestName = guestSession?.name || "Guest";
    const guestId = guestSession?.id;

    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      try {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("guestName", guestName);
        if (guestId) formData.append("guestId", guestId);

        const res = await fetch(`/api/events/${id}/media`, {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const { media } = await res.json();
          setEventMedia((prev) => [media, ...prev]);
          successCount++;
        }

        setUploadProgress({ current: i + 1, total: files.length });
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    setUploading(false);

    if (successCount > 0) {
      addToast({
        type: "success",
        title: "Upload complete!",
        description: `${successCount} ${successCount === 1 ? "photo" : "photos"} uploaded successfully`,
      });
    }

    if (successCount < files.length) {
      addToast({
        type: "warning",
        title: "Some uploads failed",
        description: `${files.length - successCount} ${files.length - successCount === 1 ? "file" : "files"} could not be uploaded`,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-surface">
         <div className="hidden lg:block w-72 h-full border-r border-border p-6 space-y-6">
            <Skeleton className="h-8 w-32" />
            <div className="space-y-2">
               {Array.from({ length: 8 }).map((_, i) => (
                 <Skeleton key={i} className="h-10 w-full rounded-xl" />
               ))}
            </div>
         </div>
         <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="h-16 border-b border-border flex items-center px-6 justify-between">
               <Skeleton className="h-5 w-40" />
               <div className="flex gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-9 w-24 rounded-xl" />
               </div>
            </div>
            <div className="flex-1 p-8">
               <Skeleton className="h-10 w-64 mb-8" />
               <div className="grid grid-cols-4 gap-6 mb-12">
                  <Skeleton className="h-32 rounded-3xl" />
                  <Skeleton className="h-32 rounded-3xl" />
                  <Skeleton className="h-32 rounded-3xl" />
                  <Skeleton className="h-32 rounded-3xl" />
               </div>
               <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-xl" />
                  ))}
               </div>
            </div>
         </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-6">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-secondary text-4xl">
            🔍
          </div>
          <h1 className="mt-6 text-2xl font-bold text-text-primary">
            Event not found
          </h1>
          <p className="mt-2 text-text-secondary">
            This event doesn&apos;t exist or has been removed.
          </p>
          <Link href="/">
            <Button variant="outline" className="mt-6">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Entrance Animation */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-surface"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-8"
            >
              <div className="h-32 w-32 rounded-[2.5rem] gradient-primary flex items-center justify-center mx-auto shadow-glow shadow-engram-500/40">
                 <svg viewBox="0 0 24 24" className="h-16 w-16 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-text-primary tracking-tighter">Preparing your memory space...</h1>
                <p className="text-text-secondary font-medium tracking-tight">Syncing real-time updates and AI models.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full bg-surface-secondary/20">
        <DashboardTopBar event={event} />
        
        <main className="flex-1 overflow-y-auto relative scrollbar-hide">
          {/* Section Transition Overlay */}
          <div className="mx-auto max-w-[1800px] px-4 sm:px-8 pb-24 sm:pb-8 h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, scale: 0.98, y: 10, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.02, y: -10, filter: "blur(10px)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                {activeSection === "overview" && <OverviewSection event={event} />}
                {activeSection === "gallery" && <GallerySection media={eventMedia} />}
                {activeSection === "people" && <PeopleSection />}
                {activeSection === "map" && <MapSection />}
                {activeSection === "qr_invite" && <QRInviteSection event={event} />}
                {(["videos", "guests", "favorites", "albums", "downloads", "analytics", "settings"] as any[]).includes(activeSection) && (
                   <div className="flex flex-col items-center justify-center h-full py-40 text-center space-y-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-engram-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                        <div className="relative h-32 w-32 rounded-[3rem] bg-surface-elevated border border-border shadow-premium flex items-center justify-center text-5xl">
                           ✨
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-3xl font-black text-text-primary capitalize tracking-tighter">{activeSection} is Coming Soon</h3>
                        <p className="text-text-secondary max-w-sm mx-auto font-medium text-lg leading-snug">
                          We are building a revolutionary {activeSection} experience for Engram. 
                        </p>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <Button variant="outline" className="rounded-2xl h-12 px-8 font-bold" onClick={() => setActiveSection("gallery")}>
                          Return to Gallery
                        </Button>
                        <Button className="rounded-2xl h-12 px-8 font-bold shadow-glow">
                          Notify Me
                        </Button>
                      </div>
                   </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Activity Panel */}
      <ActivityPanel />

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-elevated/80 backdrop-blur-xl border-t border-border flex items-center justify-around px-4 z-40">
         {[
           { id: "overview", icon: LayoutDashboard },
           { id: "gallery", icon: ImageIcon },
           { id: "qr_invite", icon: Smartphone },
           { id: "map", icon: MapIcon },
           { id: "settings", icon: Settings },
         ].map((item) => (
           <button
             key={item.id}
             onClick={() => setActiveSection(item.id as any)}
             className={cn(
               "p-2 rounded-xl transition-all",
               activeSection === item.id ? "text-engram-500 bg-engram-500/10" : "text-text-tertiary"
             )}
             aria-label={item.id}
           >
             <item.icon size={24} />
           </button>
         ))}
      </div>

      {/* Mobile Camera FAB */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 lg:hidden">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCamera(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full gradient-primary shadow-glow text-white"
        >
          <Camera size={28} />
        </motion.button>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            media={eventMedia}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>

      {/* Camera Capture */}
      <MediaCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onUpload={handleMediaUpload}
        eventName={event.title}
      />

      {/* QR Modal Placeholder (re-using previous implementation logic) */}
      <AnimatePresence>
        {showQR && qrData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm" onClick={() => setShowQR(false)}>
            <div className="w-full max-w-sm rounded-3xl bg-surface-elevated p-8 shadow-premium text-center" onClick={e => e.stopPropagation()}>
               <h3 className="text-xl font-bold text-text-primary mb-4">Share Event</h3>
               <Image src={qrData.qr} alt="QR Code" width={240} height={240} className="mx-auto rounded-2xl mb-6" />
               <div className="flex gap-2 mb-6">
                  <Input readOnly value={qrData.accessCode} className="text-center font-mono" />
                  <Button variant="outline" onClick={copyCode}>Copy</Button>
               </div>
               <Button className="w-full" onClick={() => setShowQR(false)}>Close</Button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
