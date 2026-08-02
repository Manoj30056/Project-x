"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CapturedMedia {
  id: string;
  type: "photo" | "video";
  blob: Blob;
  preview: string;
  selected: boolean;
}

interface MediaCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  eventName?: string;
}

export function MediaCapture({ isOpen, onClose, onUpload, eventName }: MediaCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [mode, setMode] = useState<"photo" | "video">("photo");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [capturedMedia, setCapturedMedia] = useState<CapturedMedia[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [flash, setFlash] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      stopCamera();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: mode === "video",
      });
      
      streamRef.current = stream;
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
      setHasPermission(false);
    }
  }, [facingMode, mode, stopCamera]);

  useEffect(() => {
    if (isOpen && !showPreview) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen, showPreview, startCamera, stopCamera]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Flip horizontally if using front camera
    if (facingMode === "user") {
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(video, 0, 0);
    }
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const preview = URL.createObjectURL(blob);
      
      setCapturedMedia((prev) => [
        ...prev,
        { id, type: "photo", blob, preview, selected: true },
      ]);
    }, "image/jpeg", 0.92);
  }, [facingMode]);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: "video/webm;codecs=vp9",
    });
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const preview = URL.createObjectURL(blob);
      
      setCapturedMedia((prev) => [
        ...prev,
        { id, type: "video", blob, preview, selected: true },
      ]);
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const toggleSelection = (id: string) => {
    setCapturedMedia((prev) =>
      prev.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m))
    );
  };

  const deleteMedia = (id: string) => {
    setCapturedMedia((prev) => {
      const item = prev.find((m) => m.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((m) => m.id !== id);
    });
  };

  const handleUpload = () => {
    const selected = capturedMedia.filter((m) => m.selected);
    const files = selected.map((m) => {
      const ext = m.type === "photo" ? "jpg" : "webm";
      return new File([m.blob], `engram-${m.id}.${ext}`, {
        type: m.type === "photo" ? "image/jpeg" : "video/webm",
      });
    });
    
    // Cleanup previews
    capturedMedia.forEach((m) => URL.revokeObjectURL(m.preview));
    setCapturedMedia([]);
    setShowPreview(false);
    
    onUpload(files);
    onClose();
  };

  const handleClose = () => {
    stopCamera();
    if (isRecording) stopRecording();
    capturedMedia.forEach((m) => URL.revokeObjectURL(m.preview));
    setCapturedMedia([]);
    setShowPreview(false);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const selectedCount = capturedMedia.filter((m) => m.selected).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex flex-col bg-black"
        >
          {/* Flash effect */}
          <AnimatePresence>
            {flash && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 z-50 bg-white"
              />
            )}
          </AnimatePresence>

          {showPreview ? (
            /* Preview Gallery */
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-medium">Back</span>
                </button>
                <span className="text-sm text-white/60">
                  {selectedCount} selected
                </span>
                <Button
                  size="sm"
                  onClick={handleUpload}
                  disabled={selectedCount === 0}
                >
                  Upload
                </Button>
              </div>
              
              <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {capturedMedia.map((media) => (
                    <motion.div
                      key={media.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      {media.type === "photo" ? (
                        <Image
                          src={media.preview}
                          alt="Captured photo"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video
                          src={media.preview}
                          className="h-full w-full object-cover"
                          muted
                          playsInline
                        />
                      )}
                      
                      {/* Selection overlay */}
                      <button
                        onClick={() => toggleSelection(media.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                            media.selected
                              ? "bg-engram-500 border-engram-500"
                              : "border-white/70 bg-black/30"
                          )}
                        >
                          {media.selected && (
                            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </button>
                      
                      {/* Delete button */}
                      <button
                        onClick={() => deleteMedia(media.id)}
                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                      
                      {/* Video indicator */}
                      {media.type === "video" && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1">
                          <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          <span className="text-xs text-white">Video</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Camera View */
            <>
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 sm:p-6">
                <button
                  onClick={handleClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                  aria-label="Close camera"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                
                {eventName && (
                  <div className="rounded-full bg-black/40 px-4 py-2 backdrop-blur-sm">
                    <span className="text-sm font-medium text-white">{eventName}</span>
                  </div>
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

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full bg-red-500/90 px-4 py-2 backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  <span className="text-sm font-medium text-white">{formatTime(recordingTime)}</span>
                </div>
              )}

              {/* Camera preview */}
              <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                {hasPermission === false ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-4xl mb-6">
                      📷
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Camera Access Required
                    </h3>
                    <p className="text-white/60 text-sm max-w-xs mb-6">
                      Please allow camera access to take photos and videos
                    </p>
                    <Button onClick={startCamera} variant="secondary">
                      Grant Access
                    </Button>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    className={cn(
                      "h-full w-full object-cover",
                      facingMode === "user" && "scale-x-[-1]"
                    )}
                    playsInline
                    muted
                  />
                )}
              </div>

              {/* Captured media thumbnails */}
              {capturedMedia.length > 0 && (
                <div className="absolute bottom-32 left-4 right-4 z-10">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {capturedMedia.slice(-5).map((media) => (
                      <button
                        key={media.id}
                        onClick={() => setShowPreview(true)}
                        className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden ring-2 ring-white/30"
                      >
                        {media.type === "photo" ? (
                          <Image
                            src={media.preview}
                            alt="Captured"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <video
                            src={media.preview}
                            className="h-full w-full object-cover"
                            muted
                          />
                        )}
                      </button>
                    ))}
                    {capturedMedia.length > 0 && (
                      <button
                        onClick={() => setShowPreview(true)}
                        className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm"
                      >
                        <span className="text-sm font-medium text-white">
                          {capturedMedia.length}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom controls */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-6 pb-10">
                {/* Mode toggle */}
                <div className="flex justify-center mb-6">
                  <div className="flex items-center gap-1 rounded-full bg-white/10 p-1 backdrop-blur-sm">
                    <button
                      onClick={() => setMode("photo")}
                      className={cn(
                        "rounded-full px-5 py-2 text-sm font-medium transition-all",
                        mode === "photo"
                          ? "bg-white text-black"
                          : "text-white/70 hover:text-white"
                      )}
                    >
                      Photo
                    </button>
                    <button
                      onClick={() => setMode("video")}
                      className={cn(
                        "rounded-full px-5 py-2 text-sm font-medium transition-all",
                        mode === "video"
                          ? "bg-white text-black"
                          : "text-white/70 hover:text-white"
                      )}
                    >
                      Video
                    </button>
                  </div>
                </div>

                {/* Capture button */}
                <div className="flex items-center justify-center gap-8">
                  {/* Gallery button */}
                  <button
                    onClick={() => capturedMedia.length > 0 && setShowPreview(true)}
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm transition-all",
                      capturedMedia.length > 0 ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                  >
                    {capturedMedia.length > 0 && capturedMedia[capturedMedia.length - 1].type === "photo" ? (
                      <Image
                        src={capturedMedia[capturedMedia.length - 1].preview}
                        alt="Last capture"
                        width={48}
                        height={48}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-lg text-white">{capturedMedia.length}</span>
                    )}
                  </button>

                  {/* Main capture button */}
                  {mode === "photo" ? (
                    <button
                      onClick={capturePhoto}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-white transition-transform active:scale-95"
                      aria-label="Take photo"
                    >
                      <div className="h-16 w-16 rounded-full border-4 border-black/10" />
                    </button>
                  ) : (
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={cn(
                        "flex h-20 w-20 items-center justify-center rounded-full transition-all active:scale-95",
                        isRecording ? "bg-red-500" : "bg-red-500"
                      )}
                      aria-label={isRecording ? "Stop recording" : "Start recording"}
                    >
                      {isRecording ? (
                        <div className="h-7 w-7 rounded-md bg-white" />
                      ) : (
                        <div className="h-16 w-16 rounded-full border-4 border-white/30" />
                      )}
                    </button>
                  )}

                  {/* Placeholder for balance */}
                  <div className="w-12" />
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
