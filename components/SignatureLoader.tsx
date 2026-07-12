"use client";

import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useTheme } from "./ThemeProvider";

interface SignatureLoaderProps {
  onComplete: () => void;
}

export function SignatureLoader({ onComplete }: SignatureLoaderProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const bgColor = isLight ? "#ffffff" : "#050505";
  const glowColor = isLight ? "rgba(249, 115, 22, 0.25)" : "rgba(124, 58, 237, 0.25)"; // Orange for light mode, violet for dark mode

  useEffect(() => {
    // Hold for approximately 1.5 seconds, then call onComplete
    const timer = setTimeout(() => {
      onComplete();
    }, 1600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        filter: "blur(12px)",
        scale: 0.95,
        transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] } 
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Subtle Noise Film Grain Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft Ambient Radial Glow behind the Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute w-[400px] h-[400px] rounded-full filter blur-[70px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%)`,
        }}
      />

      {/* Centered Logo Container */}
      <div className="w-[200px] h-[200px] md:w-[250px] md:h-[250px] relative flex items-center justify-center">
        <motion.div
          layoutId="nsd-logo-brand"
          initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="w-full h-full flex items-center justify-center"
        >
          <img
            src="/input_file_0.png"
            alt="NSD Creations Logo"
            className="w-full h-full object-contain drop-shadow-xl"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
