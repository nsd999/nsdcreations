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
  // Map specific images to their correct public path sources
  const getSourcesList = (initialSrc: string): string[] => {
    if (initialSrc.includes("nsdlogo") || initialSrc.includes("logo") || initialSrc.includes("input_file_0")) {
      return ["/images/nsdlogo.png"];
    }
    if (initialSrc.includes("founder") || initialSrc.includes("input_file_1")) {
      return ["/images/founder.png"];
    }
    return [initialSrc];
  };

  const sources = getSourcesList(src);
  const [srcIndex, setSrcIndex] = useState(0);
  const currentSrc = sources[srcIndex] || src;

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isLogo = currentSrc.includes("nsdlogo");

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
      setSrcIndex((prev) => prev + 1);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  };

  const isFounder = currentSrc.includes("founder");

  if (hasError && isLogo) {
    return (
      <div className={`relative shrink-0 flex items-center justify-center overflow-hidden ${className}`} style={style}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-full max-h-full">
          <defs>
            <linearGradient id="nsd-fallback-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF8A00" />
              <stop offset="30%" stopColor="#FFA726" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path
            d="M25 30C25 24.4772 29.4772 20 35 20H45C47.7614 20 50 22.2386 50 25C50 27.7614 47.7614 30 45 30H35V70H45C47.7614 70 50 72.2386 50 75C50 77.7614 47.7614 80 45 80H35C29.4772 80 25 75.5228 25 70V30Z"
            fill="url(#nsd-fallback-grad)"
          />
          <path
            d="M75 70C75 75.5228 70.5228 80 65 80H55C52.2386 80 50 77.7614 50 75C50 72.2386 52.2386 70 55 70H65V30H55C52.2386 30 50 27.7614 50 25C50 22.2386 52.2386 20 55 20H65C70.5228 20 75 24.4772 75 30V70Z"
            fill="url(#nsd-fallback-grad)"
          />
          <circle cx="50" cy="50" r="12" stroke="url(#nsd-fallback-grad)" strokeWidth="4" fill="#030303" />
          <path d="M50 38V44M50 56V62M38 50H44M56 50H62" stroke="url(#nsd-fallback-grad)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (hasError && isFounder) {
    return (
      <div
        className={`relative rounded-full select-none shrink-0 flex items-center justify-center overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 shadow-inner ${className}`}
        style={{
          width: fill ? "100%" : width ? `${width}px` : "100%",
          height: fill ? "100%" : height ? `${height}px` : "100%",
          background: "linear-gradient(135deg, #0B0F19 0%, #1E1B4B 100%)",
          ...style,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <linearGradient id="avatar-grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <radialGradient id="avatar-radial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF8A00" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF8A00" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="45" fill="url(#avatar-radial)" opacity="0.6" />
          {/* Abstract stylized human vector illustration for dynamic modern founder */}
          <circle cx="50" cy="40" r="18" fill="url(#avatar-grad-blue)" />
          <path d="M22 80 C22 62, 34 58, 50 58 C66 58, 78 62, 78 80 Z" fill="url(#avatar-grad-blue)" />
        </svg>
      </div>
    );
  }

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

      {/* Pure, clean loading/missing skeleton loader (no broken icons, initials or placeholder logos) */}
      {(isLoading || hasError) && !isLogo && !isFounder && (
        <div className="absolute inset-0 w-full h-full bg-zinc-200 dark:bg-zinc-900 animate-pulse flex items-center justify-center transition-all duration-300" />
      )}
    </div>
  );
}
