"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { ImageWithNSDFallback } from "./ImageWithNSDFallback";

interface SignatureLoaderProps {
  onComplete: () => void;
}

export function SignatureLoader({ onComplete }: SignatureLoaderProps) {
  const [logoTransform, setLogoTransform] = useState({ x: 0, y: 0, scale: 0.8, opacity: 0 });
  const [bgOpacity, setBgOpacity] = useState(1);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Initial fade-in and scale of logo (starts 0.8 -> 1.1 scale, opacity 0 -> 1 over 600ms)
    const startAnim = setTimeout(() => {
      setLogoTransform({ x: 0, y: 0, scale: 1.1, opacity: 1 });
    }, 50);

    // 2. Hold for 0.8s (total elapsed: 1.4s), then fly to the Navbar position (duration: 450ms)
    const flyAnim = setTimeout(() => {
      const navbarLogo = document.getElementById("navbar-logo-container");
      let deltaX = 0;
      let deltaY = 0;
      let scaleFactor = 0.2; // default fallback scale

      if (navbarLogo && logoRef.current) {
        const navRect = navbarLogo.getBoundingClientRect();
        const loaderRect = logoRef.current.getBoundingClientRect();

        // Calculate centers of both elements
        const navCenterX = navRect.left + navRect.width / 2;
        const navCenterY = navRect.top + navRect.height / 2;
        const loaderCenterX = loaderRect.left + loaderRect.width / 2;
        const loaderCenterY = loaderRect.top + loaderRect.height / 2;

        deltaX = navCenterX - loaderCenterX;
        deltaY = navCenterY - loaderCenterY;
        
        // Calculate dynamic scale factor based on actual elements
        scaleFactor = navRect.width / loaderRect.width;
      } else {
        // Fallback calculations in case navbar logo isn't rendered or is unreachable
        deltaX = -window.innerWidth / 2 + 56;
        deltaY = -window.innerHeight / 2 + 56;
        scaleFactor = 0.2;
      }

      // Animate the flying logo to the precise top-left coordinates and fade background to transparent
      setLogoTransform({
        x: deltaX,
        y: deltaY,
        scale: scaleFactor,
        opacity: 0.85 // fade slightly while moving
      });
      setBgOpacity(0);
    }, 1400);

    // 3. Complete and unmount (total elapsed: 1.85s)
    const endAnim = setTimeout(() => {
      onComplete();
    }, 1850);

    return () => {
      clearTimeout(startAnim);
      clearTimeout(flyAnim);
      clearTimeout(endAnim);
    };
  }, [onComplete]);

  return (
    <motion.div
      style={{
        backgroundColor: "#000000",
        opacity: bgOpacity,
      }}
      animate={{ opacity: bgOpacity }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none pointer-events-none"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          ref={logoRef}
          className="w-48 h-48 md:w-56 md:h-56 relative shrink-0 flex items-center justify-center"
          animate={{
            x: logoTransform.x,
            y: logoTransform.y,
            scale: logoTransform.scale,
            opacity: logoTransform.opacity,
          }}
          transition={{
            // High-end cinematic spring-like feel
            ease: [0.16, 1, 0.3, 1],
            duration: logoTransform.x !== 0 || logoTransform.y !== 0 ? 0.45 : 0.6,
          }}
        >
          <ImageWithNSDFallback
            src="https://res.cloudinary.com/qmwu0cdg/image/upload/v1783939919/nsdlogo_zgnd8e.png"
            alt="NSD Creations Official Logo"
            className="w-full h-full object-contain"
            fill
            priority
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
