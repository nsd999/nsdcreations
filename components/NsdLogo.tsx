"use client";

import React from "react";
import { ImageWithNSDFallback } from "./ImageWithNSDFallback";

interface NsdLogoProps {
  mode?: "tracing" | "final" | "navbar";
  theme?: "light" | "dark";
  className?: string;
  isCompleted?: boolean;
}

export function NsdLogo({ className = "" }: NsdLogoProps) {
  return (
    <ImageWithNSDFallback
      src="/nsdlogo.png"
      alt="NSD Creations Official Logo"
      className={className}
      fill
    />
  );
}
