"use client";

import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { ImageWithNSDFallback } from "./ImageWithNSDFallback";

interface SignatureLoaderProps {
  onComplete: () => void;
}

export function SignatureLoader({ onComplete }: SignatureLoaderProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const bgColor = isLight ? "#ffffff" : "#030303"; // pure white or deep obsidian

  useEffect(() => {
    // Exactly 1.8 seconds total duration
    const timer = setTimeout(() => {
      onComplete();
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        filter: "blur(8px)",
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Centered Logo Container */}
      <div className="w-48 h-48 md:w-56 md:h-56 relative flex items-center justify-center">
        <motion.div
          layoutId="nsd-logo-brand"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
          }}
          exit={{
            scale: 0.85,
            opacity: 0,
            transition: { duration: 0.3, ease: "easeInOut" }
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="w-full h-full relative"
        >
          <ImageWithNSDFallback
            src="https://res.cloudinary.com/qmwu0cdg/image/upload/v1783939919/nsdlogo_zgnd8e.png"
            alt="NSD Creations Official Logo"
            className="w-full h-full"
            fill
            priority
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
