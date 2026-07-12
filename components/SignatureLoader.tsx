"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { NsdLogo } from "./NsdLogo";
import { useTheme } from "./ThemeProvider";

interface SignatureLoaderProps {
  /** Called once the entrance sequence has finished and the page can take over. */
  onComplete: () => void;
}

/**
 * Timing model
 * ------------------------------------------------------------------
 * Every stage below exists to answer one question: "what is the fastest
 * this can feel without feeling rushed?" Apple / Linear / Framer-grade
 * intros read as premium because they are SHORT and DECISIVE, not because
 * they are long. Total runtime is capped at ~2.1s (well inside the
 * 1.5–2.5s brief) and the whole thing is skippable via prefers-reduced-motion.
 *
 *   0ms     -> black frame settles (no logo yet, avoids a "flash of content")
 *   120ms   -> logo begins its spring entrance (opacity + scale)
 *   ~700ms  -> logo has arrived, begins one slow "breathing" glow cycle
 *   1700ms  -> hold ends, loader starts handing off to the page
 *   2100ms  -> onComplete fires; parent unmounts this component and the
 *              logo continues its life as the navbar mark via layoutId
 */
const TIMING = {
  settle: 120,
  hold: 1700,
  complete: 2100,
} as const;

/** A single lightweight ambient particle. Kept minimal on purpose — this is
 * atmosphere, not a firework show. */
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 40 + 55,
    size: Math.random() * 2 + 1.5, // 1.5px – 3.5px, deliberately tiny
    delay: Math.random() * 1.2,
    duration: Math.random() * 3 + 5,
  }));
}

export function SignatureLoader({ onComplete }: SignatureLoaderProps) {
  const { resolvedTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const [stage, setStage] = useState<"settle" | "arrived">("settle");
  const [logoSrc, setLogoSrc] = useState("/input_file_0.png");
  const [logoFailed, setLogoFailed] = useState(false);
  const hasCompleted = useRef(false);

  const isLight = resolvedTheme === "light";
  const bgColor = isLight ? "#ffffff" : "#050505";
  // Purple in dark mode, warm orange (lifted from the logo) in light mode.
  const glowColor = isLight ? "rgba(217, 119, 6, 0.14)" : "rgba(139, 92, 246, 0.16)";
  const particleColor = isLight ? "bg-amber-500/30" : "bg-violet-400/30";

  const particles = useMemo(
    () => (prefersReducedMotion ? [] : createParticles(10)),
    [prefersReducedMotion]
  );

  const handleLogoError = () => {
    if (logoSrc === "/input_file_0.png") {
      setLogoSrc("/nsdlogo.png");
    } else {
      setLogoFailed(true);
    }
  };

  const complete = () => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;
    onComplete();
  };

  useEffect(() => {
    // Reduced motion: skip straight to a calm, static brand moment and
    // hand off quickly. Nobody who has asked their OS to minimize motion
    // should sit through a 2-second animation to reach the page.
    if (prefersReducedMotion) {
      setStage("arrived");
      const t = setTimeout(complete, 500);
      return () => clearTimeout(t);
    }

    const arrive = setTimeout(() => setStage("arrived"), TIMING.settle);
    const finish = setTimeout(complete, TIMING.complete);
    return () => {
      clearTimeout(arrive);
      clearTimeout(finish);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
      // A screen reader shouldn't announce a decorative intro as content.
      aria-hidden="true"
    >
      {/* Barely-there film grain. Breaks up the flat color without reading
          as a "loading screen" texture. */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Ambient glow. Single soft radial light, not a neon halo. */}
      {!prefersReducedMotion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 72%)`,
            filter: "blur(60px)",
            transform: "translateZ(0)",
            willChange: "opacity, transform",
          }}
        />
      )}

      {/* Ambient particles — quiet atmosphere, not confetti. */}
      {particles.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className={`absolute rounded-full ${particleColor}`}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                transform: "translateZ(0)",
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: -160, opacity: [0, 0.5, 0.5, 0] }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Logo. layoutId is the mechanism that lets this exact element
          continue its motion as the navbar mark once the parent unmounts
          this overlay and mounts the header — Framer Motion interpolates
          position/size across that boundary automatically. */}
      <div className="w-[260px] h-[260px] md:w-[320px] md:h-[320px] relative flex items-center justify-center">
        <motion.div
          layoutId="nsd-logo-brand"
          initial={
            prefersReducedMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.94 }
          }
          animate={
            stage === "arrived"
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.94 }
          }
          transition={{
            type: "spring",
            stiffness: 210,
            damping: 24,
            mass: 0.9,
          }}
          className="w-full h-full flex items-center justify-center"
        >
          {/* One slow breathing cycle during the hold. Deliberately subtle:
              a 1.5% scale shift and a soft opacity float — present enough
              to feel alive, quiet enough to never read as "pulsing". */}
          <motion.div
            animate={
              stage === "arrived" && !prefersReducedMotion
                ? { scale: [1, 1.015, 1] }
                : {}
            }
            transition={{
              delay: 0.4,
              duration: 1.6,
              ease: "easeInOut",
            }}
            className="w-full h-full relative flex items-center justify-center"
          >
            {!logoFailed ? (
              <img
                src={logoSrc}
                alt="NSD Creations"
                className="w-[160px] h-[160px] md:w-[180px] md:h-[180px] object-contain"
                onError={handleLogoError}
                referrerPolicy="no-referrer"
                draggable={false}
              />
            ) : (
              <NsdLogo mode="final" theme={resolvedTheme} isCompleted />
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
