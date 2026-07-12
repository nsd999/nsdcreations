"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NsdLogo } from "./NsdLogo";
import { useTheme } from "./ThemeProvider";

interface SignatureLoaderProps {
  onComplete: () => void;
}

export function SignatureLoader({ onComplete }: SignatureLoaderProps) {
  const { resolvedTheme } = useTheme();
  const [phase, setPhase] = useState<"silence" | "tracing" | "completed">("silence");
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([]);
  const [logoError, setLogoError] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/input_file_0.png");

  const handleLogoError = () => {
    if (logoSrc === "/input_file_0.png") {
      setLogoSrc("/nsdlogo.png");
    } else {
      setLogoError(true);
    }
  };

  // Setup theme and background colors
  const isLight = resolvedTheme === "light";
  const bgColor = isLight ? "#ffffff" : "#050505";
  const glowColor = isLight ? "rgba(249, 115, 22, 0.15)" : "rgba(168, 85, 247, 0.15)"; // Orange glow for light, purple for dark

  useEffect(() => {
    // Generate organic floating particles
    const generatedParticles = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * 50 + 50, // lower half
      size: Math.random() * 3 + 1.5, // 1.5px to 4.5px
      delay: Math.random() * 2,
      duration: Math.random() * 4 + 4, // 4s to 8s
    }));
    setParticles(generatedParticles);

    // Phase Transitions
    // Phase 1 (Silence): 0 - 300ms
    const startTracingTimer = setTimeout(() => {
      setPhase("tracing");
    }, 300);

    // Phase 6 (Completion of drawing & filled-in logo): resolves at 2300ms
    const completeTracingTimer = setTimeout(() => {
      setPhase("completed");
    }, 2300);

    // Final end: 3200ms
    const finalTimer = setTimeout(() => {
      onComplete();
    }, 3300);

    return () => {
      clearTimeout(startTracingTimer);
      clearTimeout(completeTracingTimer);
      clearTimeout(finalTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        filter: "blur(12px)",
        scale: 1.05,
        transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } 
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Subtle Noise Film Grain Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft Ambient Radial Glow behind the Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.15 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute w-[450px] h-[450px] rounded-full filter blur-[80px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%)`,
        }}
      />

      {/* Tiny Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute rounded-full ${isLight ? "bg-orange-400/35" : "bg-purple-400/35"}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              filter: "blur(0.5px)",
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ 
              y: -220, 
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Sound System (Future Hook) */}
      {/* Audio logic prepared below, but not autoplayed as requested */}
      {/* <audio id="nsd-startup-sound" src="/assets/startup.mp3" preload="auto" /> */}

      {/* Centered Logo Container */}
      <div className="w-[320px] h-[320px] md:w-[380px] md:h-[380px] relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === "silence" && (
            <motion.div
              key="silence-placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
            />
          )}

          {phase === "tracing" && (
            <motion.div
              key="logo-tracing"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.3 } }}
              className="w-full h-full"
            >
              <NsdLogo mode="tracing" theme={resolvedTheme} />
            </motion.div>
          )}

          {phase === "completed" && (
            <motion.div
              key="logo-completed"
              layoutId="nsd-logo-brand"
              initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
              animate={{ 
                opacity: 1, 
                scale: [0.94, 1.03, 1],
                filter: "blur(0px)",
              }}
              transition={{ 
                duration: 0.6, 
                ease: [0.34, 1.56, 0.64, 1] 
              }}
              className="w-full h-full flex items-center justify-center"
            >
              {/* Pulse the complete logo once inside Phase 6 */}
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  delay: 0.7,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="w-full h-full relative flex items-center justify-center"
              >
                {!logoError ? (
                  <img
                    src={logoSrc}
                    alt="NSD Creations Logo"
                    className="w-[180px] h-[180px] object-contain"
                    onError={handleLogoError}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <NsdLogo mode="final" theme={resolvedTheme} isCompleted={true} />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
