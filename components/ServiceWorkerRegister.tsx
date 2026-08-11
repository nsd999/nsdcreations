"use client";

import React, { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function ServiceWorkerRegister() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("[SW] Registered successfully with scope:", reg.scope);
          })
          .catch((err) => {
            console.warn("[SW] Registration failed:", err);
          });
      });
    }

    // Listen to network status changes
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50 bg-zinc-900/90 dark:bg-black/90 text-white backdrop-blur-md px-4.5 py-3 rounded-2xl border border-zinc-800 shadow-2xl flex items-center space-x-3 text-xs font-mono"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Browsing Offline &bull; Loaded from Local Cache</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
