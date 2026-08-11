"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SignatureLoader } from "./SignatureLoader";
import { AnimatePresence, motion } from "motion/react";

interface LoadingWrapperProps {
  children: React.ReactNode;
}

export function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const isHomepage = pathname === "/";

  useEffect(() => {
    setMounted(true);
    setLoading(true);
  }, [pathname]);

  const handleComplete = () => {
    setLoading(false);
  };

  if (!mounted) {
    return <div className="flex-1 flex flex-col min-h-screen">{children}</div>;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <SignatureLoader key={`loader-${pathname}`} isHomepage={isHomepage} onComplete={handleComplete} />
        )}
      </AnimatePresence>
      
      <motion.div
        initial={loading ? { opacity: 0.5, filter: "blur(4px)" } : { opacity: 1, filter: "blur(0px)" }}
        animate={loading ? { opacity: 0.5, filter: "blur(4px)" } : { opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        className="flex-1 flex flex-col min-h-screen"
      >
        {children}
      </motion.div>
    </>
  );
}
