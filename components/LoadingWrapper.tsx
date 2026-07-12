"use client";

import React, { useState, useEffect } from "react";
import { SignatureLoader } from "./SignatureLoader";
import { AnimatePresence, motion } from "motion/react";

interface LoadingWrapperProps {
  children: React.ReactNode;
}

export function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const hasLoaded = sessionStorage.getItem("nsd_has_loaded");
    if (hasLoaded === "true") {
      setLoading(false);
    }
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem("nsd_has_loaded", "true");
    setLoading(false);
  };

  if (!mounted) {
    // Render children immediately on server-side or pre-hydration to avoid flashing
    return <div className="flex-1 flex flex-col min-h-screen">{children}</div>;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <SignatureLoader key="global-loader" onComplete={handleComplete} />
        )}
      </AnimatePresence>
      
      {/* Cinematic page fade-in and blur-reveal when loading finishes (Phase 8) */}
      <motion.div
        initial={loading ? { opacity: 0, filter: "blur(12px)" } : { opacity: 1, filter: "blur(0px)" }}
        animate={loading ? {} : { opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
        className="flex-1 flex flex-col min-h-screen"
      >
        {children}
      </motion.div>
    </>
  );
}
