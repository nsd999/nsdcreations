"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { ImageWithNSDFallback } from "./ImageWithNSDFallback";

interface SignatureLoaderProps {
  onComplete: () => void;
}

export function SignatureLoader({ onComplete }: SignatureLoaderProps) {
  const [logoTransform, setLogoTransform] = useState({ x: 0, y: 0, scale: 1.0, opacity: 1 });
  const [bgOpacity, setBgOpacity] = useState(1);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Logo is immediately visible at scale 1.0 on load.
    
    // 2. Shrink and fly to the Navbar logo position (at 450ms)
    const flyAnim = setTimeout(() => {
      const navbarLogo = document.getElementById("navbar-logo-container");
      let deltaX = 0;
      let deltaY = 0;
      let scaleFactor = 0.25;

      if (navbarLogo && logoRef.current) {
        const navRect = navbarLogo.getBoundingClientRect();
        const loaderRect = logoRef.current.getBoundingClientRect();

        const navCenterX = navRect.left + navRect.width / 2;
        const navCenterY = navRect.top + navRect.height / 2;
        const loaderCenterX = loaderRect.left + loaderRect.width / 2;
        const loaderCenterY = loaderRect.top + loaderRect.height / 2;

        deltaX = navCenterX - loaderCenterX;
        deltaY = navCenterY - loaderCenterY;
        
        scaleFactor = navRect.width / loaderRect.width;
      } else {
        deltaX = -window.innerWidth / 2 + 56;
        deltaY = -window.innerHeight / 2 + 56;
        scaleFactor = 0.22;
      }

      setLogoTransform({
        x: deltaX,
        y: deltaY,
        scale: scaleFactor,
        opacity: 0.95,
      });
      setBgOpacity(0);
    }, 450);

    // 3. Complete animation sequence and merge into header smoothly at 900ms
    const endAnim = setTimeout(() => {
      onComplete();
    }, 900);

    return () => {
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
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
            // Apple-quality cubic-bezier motion curves
            ease: [0.16, 1, 0.3, 1],
            duration: logoTransform.x !== 0 || logoTransform.y !== 0 ? 0.55 : 0.8,
          }}
        >
          <ImageWithNSDFallback
            src="/nsdlogo.png"
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
