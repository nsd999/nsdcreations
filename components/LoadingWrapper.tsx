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
    setLoading(true);
  }, []);

  const handleComplete = () => {
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
      
      {/* Page reveal when loading finishes */}
      <motion.div
        initial={loading ? { opacity: 0.4, filter: "blur(4px)" } : { opacity: 1, filter: "blur(0px)" }}
        animate={loading ? { opacity: 0.4, filter: "blur(4px)" } : { opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className="flex-1 flex flex-col min-h-screen"
      >
        {children}
      </motion.div>
    </>
  );
}
