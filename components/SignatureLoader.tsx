"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { ImageWithNSDFallback } from "./ImageWithNSDFallback";

interface SignatureLoaderProps {
  isHomepage?: boolean;
  onComplete: () => void;
}

export function SignatureLoader({ isHomepage = false, onComplete }: SignatureLoaderProps) {
  const [logoTransform, setLogoTransform] = useState({ x: 0, y: 0, scale: isHomepage ? 0.4 : 1.0, opacity: isHomepage ? 0 : 1 });
  const [bgOpacity, setBgOpacity] = useState(1);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHomepage) {
      // --- HOMEPAGE INTRO ANIMATION ---
      // Step 1: Zoom In dramatic impact (0ms -> 350ms)
      const zoomInTimer = setTimeout(() => {
        setLogoTransform({
          x: 0,
          y: 0,
          scale: 1.35,
          opacity: 1,
        });
      }, 50);

      // Step 2: Zoom Out & fly to Navbar logo position (400ms -> 850ms)
      const zoomOutFlyTimer = setTimeout(() => {
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
      }, 500);

      const completeTimer = setTimeout(() => {
        onComplete();
      }, 950);

      return () => {
        clearTimeout(zoomInTimer);
        clearTimeout(zoomOutFlyTimer);
        clearTimeout(completeTimer);
      };
    } else {
      // --- SUB-PAGES SKELETON PULSE LOADER ---
      // Fast, non-intrusive skeleton loading effect
      const endSubPageAnim = setTimeout(() => {
        setBgOpacity(0);
        setTimeout(onComplete, 200);
      }, 450);

      return () => clearTimeout(endSubPageAnim);
    }
  }, [isHomepage, onComplete]);

  return (
    <motion.div
      style={{
        backgroundColor: "#030303",
        opacity: bgOpacity,
      }}
      animate={{ opacity: bgOpacity }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none pointer-events-none"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {isHomepage ? (
          // Homepage Zoom-In Zoom-Out Logo
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
              ease: [0.16, 1, 0.3, 1],
              duration: 0.45,
            }}
          >
            <ImageWithNSDFallback
              src="/nsdlogo.png"
              alt="NSD Creations Official Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(124,107,255,0.4)]"
              fill
              priority
            />
          </motion.div>
        ) : (
          // Sub-Page Skeleton Pulse Logo
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.div
              className="w-24 h-24 md:w-32 md:h-32 relative shrink-0 rounded-2xl bg-white/5 border border-white/10 p-4 shadow-2xl backdrop-blur-xl flex items-center justify-center overflow-hidden"
              animate={{
                opacity: [0.4, 0.95, 0.4],
                scale: [0.96, 1.02, 0.96],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Skeleton Shimmer Sweep Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-x-full"
                animate={{ translateX: ["-100%", "200%"] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
              />
              <ImageWithNSDFallback
                src="/nsdlogo.png"
                alt="NSD Creations Official Logo"
                className="w-full h-full object-contain"
                fill
                priority
              />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="h-2 w-24 bg-white/10 rounded-full overflow-hidden relative"
            >
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                animate={{ width: ["0%", "100%", "0%"] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
