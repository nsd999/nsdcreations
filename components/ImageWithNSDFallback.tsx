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
      return ["https://res.cloudinary.com/qmwu0cdg/image/upload/v1783939919/nsdlogo_zgnd8e.png"];
    }
    if (initialSrc.includes("founder") || initialSrc.includes("input_file_1")) {
      return ["https://res.cloudinary.com/qmwu0cdg/image/upload/v1783939920/founder_iccyy3.png"];
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

  if (hasError && isLogo) {
    return null;
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
      {(isLoading || hasError) && !isLogo && (
        <div className="absolute inset-0 w-full h-full bg-zinc-200 dark:bg-zinc-900 animate-pulse flex items-center justify-center transition-all duration-300" />
      )}
    </div>
  );
}
