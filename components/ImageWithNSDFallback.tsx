"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface ImageWithNSDFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function ImageWithNSDFallback({
  src,
  alt,
  className = "",
  width,
  height,
  fill = false,
  priority = false,
  sizes,
  onClick,
  style,
}: ImageWithNSDFallbackProps) {
  // Try direct path, but also allow fallbacks for the founder and logo
  const getSourcesList = (initialSrc: string): string[] => {
    if (initialSrc === "/public/nsdlogo.png" || initialSrc === "/nsdlogo.png" || initialSrc === "/input_file_0.png") {
      return ["/input_file_0.png", "/nsdlogo.png"];
    }
    if (initialSrc === "/public/founder.png" || initialSrc === "/founder.png" || initialSrc === "/input_file_1.png") {
      return ["/input_file_1.png", "/founder.png"];
    }
    return [initialSrc];
  };

  const sources = getSourcesList(src);
  const [srcIndex, setSrcIndex] = useState(0);
  const currentSrc = sources[srcIndex] || src;

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset loading states when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setSrcIndex(0);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    if (srcIndex + 1 < sources.length) {
      // Try next fallback source
      setSrcIndex((prev) => prev + 1);
    } else {
      // All options failed, show placeholder fallback indefinitely
      setIsLoading(false);
      setHasError(true);
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        overflow: "hidden",
        width: fill ? "100%" : width ? `${width}px` : "100%",
        height: fill ? "100%" : height ? `${height}px` : "100%",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      className={`group/img-fallback ${className}`}
    >
      {/* Actual Image component */}
      {!hasError && (
        <Image
          src={currentSrc}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          priority={priority}
          sizes={sizes}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          onLoad={handleLoad}
          onError={handleError}
          referrerPolicy="no-referrer"
        />
      )}

      {/* Crossfading Fallback Experience */}
      <AnimatePresence>
        {(isLoading || hasError) && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm"
          >
            {/* Soft Purple Glow Pulse */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.15, 0.35, 0.15],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-48 h-48 rounded-full bg-purple-500/35 blur-3xl"
              />
            </div>

            {/* Rotating Elegant Gradient Ring */}
            <div className="absolute w-24 h-24 rounded-full flex items-center justify-center p-[2px] overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500/20 to-indigo-500"
              />
              {/* Inner hole mask */}
              <div className="absolute inset-[2px] rounded-full bg-white dark:bg-zinc-950 z-0" />
            </div>

            {/* Centered NSD Logo with Floating Motion */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [0, -3, 0],
              }}
              transition={{
                scale: { duration: 0.3, ease: "easeOut" },
                opacity: { duration: 0.3, ease: "easeOut" },
                y: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="z-10 relative w-12 h-12 flex items-center justify-center"
            >
              {/* Use the official logo as fallback */}
              <img
                src="/input_file_0.png"
                alt="NSD Logo Fallback"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                onError={(e) => {
                  // Last-ditch local fallback if input_file_0 is completely broken
                  (e.target as HTMLImageElement).src = "/nsdlogo.png";
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
