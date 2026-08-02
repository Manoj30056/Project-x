"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function QRScanner({ onScan, onClose, isOpen }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const stopCamera = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      
      streamRef.current = stream;
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);

        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities() as any;
        setHasTorch(!!capabilities.torch);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setHasPermission(false);
      setError("Unable to access camera. Please grant permission and try again.");
    }
  }, [facingMode]);

  const scanQRCode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationRef.current = requestAnimationFrame(scanQRCode);
      return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });
    
    if (code?.data) {
      // Successfully scanned
      setIsSuccess(true);
      setTimeout(() => {
        stopCamera();
        onScan(code.data);
      }, 1500); // Duration for success animation
      return;
    }
    
    animationRef.current = requestAnimationFrame(scanQRCode);
  }, [isScanning, onScan, stopCamera]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  useEffect(() => {
    if (isScanning) {
      animationRef.current = requestAnimationFrame(scanQRCode);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isScanning, scanQRCode]);

  const toggleCamera = () => {
    stopCamera();
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const toggleTorch = async () => {
    if (!streamRef.current || !hasTorch) return;
    const track = streamRef.current.getVideoTracks()[0];
    try {
      await track.applyConstraints({
        advanced: [{ torch: !torchOn } as any],
      });
      setTorchOn(!torchOn);
    } catch (err) {
      console.error("Torch error:", err);
    }
  };

  useEffect(() => {
    if (isOpen && hasPermission) {
      startCamera();
    }
  }, [facingMode, isOpen, hasPermission, startCamera]);

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex flex-col bg-black"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 sm:p-6">
            <button
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              aria-label="Close scanner"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            
            <div className="rounded-full bg-black/40 px-4 py-2 backdrop-blur-sm">
              <span className="text-sm font-medium text-white">Scan QR Code</span>
            </div>
            
            <div className="flex gap-2">
              {hasTorch && (
                <button
                  onClick={toggleTorch}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
                    torchOn ? "bg-white text-black" : "bg-black/40 text-white hover:bg-black/60"
                  )}
                  aria-label="Toggle torch"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 008 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
                    <path d="M9 18h6M10 22h4" />
                  </svg>
                </button>
              )}
              <button
                onClick={toggleCamera}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                aria-label="Switch camera"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 19H4a2 2 0 01-2-2V7a2 2 0 012-2h5" />
                  <path d="M13 5h7a2 2 0 012 2v10a2 2 0 01-2 2h-5" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M18 22l-3-3 3-3" />
                  <path d="M6 2l3 3-3 3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Camera View */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            {hasPermission === false || error ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-4xl mb-6">
                  📷
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Camera Access Required
                </h3>
                <p className="text-white/60 text-sm max-w-xs mb-6">
                  {error || "Please allow camera access to scan QR codes"}
                </p>
                <Button onClick={startCamera} variant="secondary">
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Darkened edges with blur */}
                  <div className="absolute inset-0 backdrop-blur-[2px]" />
                  <div className="absolute inset-0 bg-black/40" style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, 10% 20%, 10% 80%, 90% 80%, 90% 20%, 10% 20%)"
                  }} />
                  
                  {/* Scan frame */}
                  <div className="relative w-[80vw] h-[80vw] max-w-sm max-h-sm">
                    {/* Pulsing glow */}
                    <motion.div 
                      className="absolute -inset-2 rounded-[2.5rem] border-2 border-engram-500/20"
                      animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.98, 1.02, 0.98] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-engram-500 rounded-tl-[2rem] shadow-[0_0_20px_rgba(139,92,246,0.5)]" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-engram-500 rounded-tr-[2rem] shadow-[0_0_20px_rgba(139,92,246,0.5)]" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-engram-500 rounded-bl-[2rem] shadow-[0_0_20px_rgba(139,92,246,0.5)]" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-engram-500 rounded-br-[2rem] shadow-[0_0_20px_rgba(139,92,246,0.5)]" />
                    
                    {/* Scanning line with glow */}
                    <motion.div
                      className="absolute left-6 right-6 h-1 bg-gradient-to-r from-transparent via-engram-400 to-transparent shadow-[0_0_15px_rgba(139,92,246,0.8)] z-10"
                      animate={isSuccess ? { scale: 0, opacity: 0 } : { y: [20, 280, 20] }}
                      transition={{ duration: 2.2, repeat: isSuccess ? 0 : Infinity, ease: "easeInOut" }}
                    />

                    {/* Subtle grid in frame */}
                    <div className="absolute inset-4 opacity-10 border border-white/20 rounded-[1.5rem]" 
                         style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    
                {/* Success Animation Overlay */}
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-xl rounded-[2.5rem]"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 15, stiffness: 200 }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-engram-500 blur-[80px] opacity-40 scale-150 animate-pulse" />
                        <motion.div 
                          className="relative flex h-32 w-32 items-center justify-center rounded-[2.5rem] gradient-primary shadow-[0_0_50px_rgba(139,92,246,0.5)]"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <svg viewBox="0 0 24 24" className="h-16 w-16 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                          </svg>
                        </motion.div>
                        
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center"
                        >
                          <p className="text-white font-bold tracking-[0.2em] uppercase text-sm">Recognized</p>
                          <p className="text-white/50 text-[10px] uppercase mt-2 tracking-widest">Opening Memory Space</p>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom instructions */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-10">
            <div className="mx-auto max-w-sm">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 text-center">
                <p className="text-sm text-white/80">
                  Point your camera at an Engram event QR code
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
