"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const mockGuests = [
  { name: "Sarah", avatar: "S", color: "bg-violet-500" },
  { name: "Mike", avatar: "M", color: "bg-blue-500" },
  { name: "Emma", avatar: "E", color: "bg-pink-500" },
  { name: "Alex", avatar: "A", color: "bg-emerald-500" },
  { name: "Jordan", avatar: "J", color: "bg-amber-500" },
];

const mockPhotos = [
  { id: 1, color: "from-violet-400 to-purple-500", likes: 12 },
  { id: 2, color: "from-blue-400 to-cyan-500", likes: 8 },
  { id: 3, color: "from-pink-400 to-rose-500", likes: 15 },
  { id: 4, color: "from-amber-400 to-orange-500", likes: 6 },
  { id: 5, color: "from-emerald-400 to-teal-500", likes: 10 },
  { id: 6, color: "from-indigo-400 to-violet-500", likes: 9 },
];

const mockComments = [
  "Amazing shot! 📸",
  "Love this moment ❤️",
  "Best party ever! 🎉",
  "Great memories!",
  "So beautiful ✨",
];

export function LiveDemoSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [activeGuests, setActiveGuests] = useState<typeof mockGuests>([]);
  const [photos, setPhotos] = useState<typeof mockPhotos>([]);
  const [notifications, setNotifications] = useState<Array<{ id: number; text: string; type: string }>>([]);
  const [notificationId, setNotificationId] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    // Simulate guests joining
    const guestInterval = setInterval(() => {
      setActiveGuests((prev) => {
        if (prev.length >= mockGuests.length) return prev;
        const newGuest = mockGuests[prev.length];
        setNotificationId((id) => {
          const newId = id + 1;
          setNotifications((n) => [...n.slice(-2), { id: newId, text: `${newGuest.name} joined`, type: "join" }]);
          return newId;
        });
        return [...prev, newGuest];
      });
    }, 2000);

    // Simulate photos being added
    const photoInterval = setInterval(() => {
      setPhotos((prev) => {
        if (prev.length >= mockPhotos.length) return prev;
        const newPhoto = mockPhotos[prev.length];
        const uploader = mockGuests[prev.length % mockGuests.length];
        setNotificationId((id) => {
          const newId = id + 1;
          setNotifications((n) => [...n.slice(-2), { id: newId, text: `${uploader.name} uploaded a photo`, type: "upload" }]);
          return newId;
        });
        return [...prev, newPhoto];
      });
    }, 3000);

    // Simulate comments/likes
    const interactionInterval = setInterval(() => {
      const randomGuest = mockGuests[Math.floor(Math.random() * mockGuests.length)];
      const isLike = Math.random() > 0.5;
      setNotificationId((id) => {
        const newId = id + 1;
        setNotifications((n) => [...n.slice(-2), { 
          id: newId, 
          text: isLike 
            ? `${randomGuest.name} liked a photo ❤️` 
            : `${randomGuest.name}: "${mockComments[Math.floor(Math.random() * mockComments.length)]}"`,
          type: isLike ? "like" : "comment"
        }]);
        return newId;
      });
    }, 4000);

    return () => {
      clearInterval(guestInterval);
      clearInterval(photoInterval);
      clearInterval(interactionInterval);
    };
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-engram-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-engram-200 dark:border-engram-800 bg-engram-50 dark:bg-engram-950/50 px-4 py-1.5 text-xs font-medium text-engram-700 dark:text-engram-400 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            Live Demo
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            See it in action
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
            Watch as guests join, upload photos, and interact in real-time
          </p>
        </motion.div>

        {/* Demo Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Phone mockup */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="relative rounded-[3rem] border-8 border-gray-900 dark:border-gray-700 bg-surface-elevated shadow-2xl overflow-hidden">
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 dark:bg-gray-700 rounded-b-2xl z-20" />
              
              {/* Screen content */}
              <div className="aspect-[9/19] bg-surface overflow-hidden">
                {/* App header */}
                <div className="bg-gradient-to-r from-engram-600 to-engram-500 pt-10 pb-4 px-4">
                  <div className="text-white">
                    <p className="text-xs opacity-80">Sarah&apos;s Birthday</p>
                    <p className="text-lg font-bold">Live Gallery</p>
                  </div>
                  
                  {/* Active guests */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex -space-x-2">
                      <AnimatePresence>
                        {activeGuests.map((guest, i) => (
                          <motion.div
                            key={guest.name}
                            initial={{ scale: 0, x: -20 }}
                            animate={{ scale: 1, x: 0 }}
                            className={`h-7 w-7 rounded-full ${guest.color} border-2 border-white flex items-center justify-center text-xs font-bold text-white`}
                          >
                            {guest.avatar}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    <span className="text-xs text-white/80">
                      {activeGuests.length} online
                    </span>
                  </div>
                </div>

                {/* Photo grid */}
                <div className="p-3 grid grid-cols-2 gap-2">
                  <AnimatePresence>
                    {photos.map((photo, i) => (
                      <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`aspect-square rounded-xl bg-gradient-to-br ${photo.color} relative overflow-hidden`}
                      >
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                          <span className="text-xs text-white/80 font-medium">
                            {mockGuests[i % mockGuests.length].name}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-white">
                            <span>❤️</span>
                            <motion.span
                              key={photo.likes}
                              initial={{ scale: 1.3 }}
                              animate={{ scale: 1 }}
                            >
                              {photo.likes + Math.floor(Math.random() * 3)}
                            </motion.span>
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Empty state placeholder */}
                {photos.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-text-tertiary">
                    <span className="text-4xl mb-2">📸</span>
                    <p className="text-sm">Waiting for photos...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Floating notifications */}
          <div className="absolute top-1/4 -right-4 sm:right-0 w-64">
            <AnimatePresence>
              {notifications.slice(-3).map((notification, i) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 50, y: 0 }}
                  animate={{ opacity: 1, x: 0, y: i * -10 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="mb-2 rounded-xl bg-surface-elevated border border-border p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {notification.type === "join" && "👋"}
                      {notification.type === "upload" && "📸"}
                      {notification.type === "like" && "❤️"}
                      {notification.type === "comment" && "💬"}
                    </span>
                    <span className="text-xs text-text-secondary truncate">
                      {notification.text}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Stats floating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute top-1/3 -left-4 sm:left-0 flex flex-col gap-3"
          >
            <div className="rounded-xl bg-surface-elevated border border-border p-3 shadow-lg">
              <p className="text-2xl font-bold text-text-primary">{photos.length}</p>
              <p className="text-xs text-text-secondary">Photos</p>
            </div>
            <div className="rounded-xl bg-surface-elevated border border-border p-3 shadow-lg">
              <p className="text-2xl font-bold text-text-primary">{activeGuests.length}</p>
              <p className="text-xs text-text-secondary">Guests</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
