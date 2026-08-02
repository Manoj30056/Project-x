"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Copy, 
  Download, 
  Printer, 
  Share2, 
  RefreshCw, 
  ExternalLink,
  Smartphone,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { Event } from "@/db/schema";

interface QRInviteSectionProps {
  event: Event;
}

export function QRInviteSection({ event }: QRInviteSectionProps) {
  const { addToast } = useToast();
  const [qrData, setQrData] = useState<{
    qr: string;
    accessCode: string;
    joinUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const res = await fetch(`/api/events/${event.id}/qr`);
        if (res.ok) {
          const data = await res.json();
          setQrData(data);
        }
      } catch (err) {
        console.error("Failed to load QR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQR();
  }, [event.id]);

  const copyToClipboard = async (text: string, type: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "code") {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
      addToast({
        type: "success",
        title: "Copied!",
        description: `${type === "code" ? "Access code" : "Invite link"} copied to clipboard`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Error",
        description: "Failed to copy to clipboard",
      });
    }
  };

  const downloadQR = (format: "png" | "svg") => {
    if (!qrData) return;
    
    const link = document.createElement("a");
    link.href = qrData.qr;
    link.download = `engram-qr-${event.eventCode}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addToast({
      type: "success",
      title: "Downloading...",
      description: `QR Code ${format.toUpperCase()} is being downloaded`,
    });
  };

  const printPoster = () => {
    window.print();
  };

  const shareEvent = async () => {
    if (!qrData) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Join my event on ENGRAM! Code: ${qrData.accessCode}`,
          url: qrData.joinUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      copyToClipboard(qrData.joinUrl, "link");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 rounded-2xl gradient-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="py-6 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h2 className="text-3xl font-black text-text-primary tracking-tight">QR & Invite</h2>
        <p className="text-text-secondary font-medium tracking-tight">Share your event with guests instantly.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: QR Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 space-y-6"
        >
          <Card className="p-8 sm:p-12 border-border/50 bg-surface-elevated/50 shadow-premium flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-engram-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="relative mb-8 p-6 bg-white rounded-[2.5rem] shadow-xl shadow-black/5 ring-1 ring-black/5">
              {qrData ? (
                <Image 
                  src={qrData.qr} 
                  alt="Event QR Code" 
                  width={300} 
                  height={300} 
                  className="w-full h-auto"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center bg-surface-secondary rounded-3xl animate-pulse">
                  <Smartphone className="text-text-tertiary" size={48} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-text-primary tracking-tighter">Scan to Join</h3>
              <p className="text-sm text-text-secondary font-medium">Guests point their camera here</p>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={() => downloadQR("png")}>
                <Download size={16} className="mr-2" /> PNG
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={() => downloadQR("svg")}>
                <Download size={16} className="mr-2" /> SVG
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={printPoster}>
                <Printer size={16} className="mr-2" /> Print Poster
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Right: Info & Controls */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Event Code Box */}
          <div className="p-8 rounded-[2.5rem] bg-surface-secondary/50 border border-border/50 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Event Access Code</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-14 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center text-3xl font-black tracking-[0.3em] text-text-primary shadow-inner">
                  {event.eventCode}
                </div>
                <button 
                  onClick={() => copyToClipboard(event.eventCode, "code")}
                  className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center transition-all",
                    copiedCode ? "bg-emerald-500 text-white shadow-glow shadow-emerald-500/30" : "bg-surface-elevated border border-border text-text-secondary hover:text-engram-500 hover:border-engram-500/50"
                  )}
                >
                  {copiedCode ? <Check size={24} /> : <Copy size={24} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Direct Invite Link</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-12 rounded-xl bg-surface-elevated border border-border px-4 flex items-center text-sm font-medium text-text-secondary truncate">
                  {qrData?.joinUrl || "Loading link..."}
                </div>
                <button 
                  onClick={() => qrData && copyToClipboard(qrData.joinUrl, "link")}
                  className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
                    copiedLink ? "bg-emerald-500 text-white shadow-glow shadow-emerald-500/30" : "bg-surface-elevated border border-border text-text-secondary hover:text-engram-500 hover:border-engram-500/50"
                  )}
                >
                  {copiedLink ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button size="xl" className="flex-1 rounded-[1.5rem] shadow-glow h-14 font-black tracking-tight" onClick={shareEvent}>
                <Share2 size={20} className="mr-3" /> Share Event
              </Button>
              <Link href={qrData?.joinUrl || "#"} target="_blank" className="flex-1">
                <Button variant="outline" size="xl" className="w-full rounded-[1.5rem] h-14 font-bold">
                  <ExternalLink size={20} className="mr-3" /> Open Link
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-engram-500/5 border border-engram-500/10 space-y-2">
              <h4 className="text-xs font-bold text-engram-500 uppercase">Management</h4>
              <p className="text-sm text-text-primary font-bold">Organizer Controls</p>
              <p className="text-xs text-text-secondary">Only you can regenerate the QR code or change the privacy settings.</p>
              <button className="mt-4 flex items-center gap-2 text-xs font-black text-engram-500 hover:text-engram-600 uppercase tracking-widest transition-colors">
                <RefreshCw size={14} /> Regenerate QR
              </button>
            </div>
            <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-2">
              <h4 className="text-xs font-bold text-amber-500 uppercase">Pro Tip</h4>
              <p className="text-sm text-text-primary font-bold">Print QR Poster</p>
              <p className="text-xs text-text-secondary">Print the QR code and place it on tables so guests can join effortlessly.</p>
              <button onClick={printPoster} className="mt-4 flex items-center gap-2 text-xs font-black text-amber-500 hover:text-amber-600 uppercase tracking-widest transition-colors">
                <Printer size={14} /> Poster Settings
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import Link from "next/link";
