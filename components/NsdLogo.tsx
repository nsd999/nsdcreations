"use client";

import React from "react";

interface NsdLogoProps {
  mode?: "tracing" | "final" | "navbar";
  theme?: "light" | "dark";
  className?: string;
  isCompleted?: boolean;
}

export function NsdLogo({ className = "" }: NsdLogoProps) {
  return (
    <img
      src="/input_file_0.png"
      alt="NSD Creations Official Logo"
      className={`object-contain ${className}`}
      referrerPolicy="no-referrer"
    />
  );
}
