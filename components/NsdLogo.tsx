"use client";

import React from "react";
import { ImageWithNSDFallback } from "./ImageWithNSDFallback";

interface NsdLogoProps {
  mode?: "tracing" | "final" | "navbar";
  theme?: "light" | "dark";
  className?: string;
  isCompleted?: boolean;
}

export function NsdLogo({ className = "", theme }: NsdLogoProps) {
  if (theme === "light") {
    return (
      <ImageWithNSDFallback
        src="/nsdlogo-light.png"
        alt="NSD Creations Official Logo"
        className={className}
        fill
      />
    );
  }

  if (theme === "dark") {
    return (
      <ImageWithNSDFallback
        src="/nsdlogo-dark.png"
        alt="NSD Creations Official Logo"
        className={className}
        fill
      />
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Adaptive Dark theme logo */}
      <div className="relative w-full h-full hidden dark:block">
        <ImageWithNSDFallback
          src="/nsdlogo-dark.png"
          alt="NSD Creations Official Logo"
          className="w-full h-full object-contain"
          fill
        />
      </div>
      {/* Adaptive Light theme logo */}
      <div className="relative w-full h-full block dark:hidden">
        <ImageWithNSDFallback
          src="/nsdlogo-light.png"
          alt="NSD Creations Official Logo"
          className="w-full h-full object-contain"
          fill
        />
      </div>
    </div>
  );
}
