"use client";

import React from "react";

interface GradientAvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: number;
  className?: string;
}

// Consistent premium SaaS-grade backgrounds (purple, navy, slate)
const GRADIENTS = [
  "linear-gradient(135deg, #0B0F19 0%, #111827 100%)", // Deep Space Slate
  "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)", // Dark Navy Slate
  "linear-gradient(135deg, #090514 0%, #1E1035 100%)", // Imperial Violet
  "linear-gradient(135deg, #020617 0%, #1E293B 100%)", // Charcoal Black
  "linear-gradient(135deg, #111827 0%, #311042 100%)", // Purple Twilight
  "linear-gradient(135deg, #0B0F19 0%, #1F2937 100%)"  // Cool Ash Onyx
];

export function GradientAvatar({ name, photoUrl, size = 48, className = "" }: GradientAvatarProps) {
  // If we have a valid photoUrl, render the image
  if (photoUrl && photoUrl.trim() !== "" && !photoUrl.startsWith("gradient-")) {
    return (
      <div
        className={`rounded-full overflow-hidden shrink-0 border border-zinc-200/50 dark:border-zinc-800/50 shadow-inner ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // If the image fails to load, clear photoUrl fallback
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }

  // Otherwise, render deterministic premium flat illustrated SaaS avatar
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const positiveHash = Math.abs(hash);

  // Parse or seed illustrated index
  let index = positiveHash % 6;
  if (photoUrl && photoUrl.startsWith("gradient-")) {
    const idx = parseInt(photoUrl.replace("gradient-", ""), 10);
    if (!isNaN(idx) && idx >= 0 && idx < 6) {
      index = idx;
    }
  }

  const gradient = GRADIENTS[index];

  // Vector Illustrations inside the avatar (instead of initials/monograms)
  // All feature professional purple/blue color mappings for a consistent modern SaaS vibe
  const renderIllustration = (idx: number) => {
    switch (idx) {
      case 0:
        return (
          <g>
            <circle cx="50" cy="50" r="28" fill="url(#violet-glow)" opacity="0.4" />
            <rect x="32" y="38" width="36" height="24" rx="6" transform="rotate(-15 50 50)" fill="url(#primary-blue)" opacity="0.75" />
            <rect x="36" y="34" width="28" height="32" rx="4" transform="rotate(30 50 50)" fill="url(#accent-purple)" opacity="0.6" />
            <circle cx="50" cy="50" r="11" fill="url(#neon-cyan)" />
            <circle cx="66" cy="34" r="3" fill="#38BDF8" />
          </g>
        );
      case 1:
        return (
          <g>
            <circle cx="50" cy="50" r="32" fill="url(#purple-glow)" opacity="0.3" />
            <path d="M 22 62 Q 36 22 50 50 T 78 38" fill="none" stroke="url(#accent-purple)" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />
            <path d="M 22 48 Q 36 62 50 36 T 78 62" fill="none" stroke="url(#primary-blue)" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
            <circle cx="36" cy="42" r="4" fill="#A855F7" />
            <circle cx="50" cy="50" r="5" fill="#3B82F6" />
            <circle cx="64" cy="44" r="3" fill="#2DD4BF" />
          </g>
        );
      case 2:
        return (
          <g>
            <circle cx="50" cy="50" r="26" fill="url(#violet-glow)" opacity="0.4" />
            {/* Top face */}
            <path d="M 50 24 L 72 35 L 50 46 L 28 35 Z" fill="url(#neon-cyan)" opacity="0.85" />
            {/* Left face */}
            <path d="M 28 35 L 50 46 L 50 68 L 28 57 Z" fill="url(#primary-blue)" opacity="0.75" />
            {/* Right face */}
            <path d="M 50 46 L 72 35 L 72 57 L 50 68 Z" fill="url(#accent-purple)" opacity="0.9" />
            <circle cx="50" cy="46" r="1.8" fill="#FFFFFF" />
          </g>
        );
      case 3:
        return (
          <g>
            <circle cx="50" cy="50" r="30" fill="url(#purple-glow)" opacity="0.25" />
            <circle cx="50" cy="50" r="28" fill="none" stroke="url(#accent-purple)" strokeWidth="2.5" opacity="0.4" />
            <circle cx="50" cy="50" r="18" fill="none" stroke="url(#primary-blue)" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="8.5" fill="url(#neon-cyan)" />
            <circle cx="36" cy="36" r="4.5" fill="url(#primary-blue)" />
            <circle cx="68" cy="50" r="3" fill="#D946EF" />
            <circle cx="50" cy="22" r="3.5" fill="#6366F1" />
          </g>
        );
      case 4:
        return (
          <g>
            <circle cx="50" cy="50" r="26" fill="url(#violet-glow)" opacity="0.4" />
            <rect x="26" y="44" width="8" height="24" rx="4" fill="url(#accent-purple)" opacity="0.75" />
            <rect x="38" y="32" width="8" height="36" rx="4" fill="url(#primary-blue)" opacity="0.95" />
            <rect x="50" y="24" width="8" height="44" rx="4" fill="url(#neon-cyan)" />
            <rect x="62" y="38" width="8" height="30" rx="4" fill="url(#accent-purple)" opacity="0.85" />
            <circle cx="54" cy="18" r="2" fill="#38BDF8" />
          </g>
        );
      default:
        return (
          <g>
            <circle cx="50" cy="50" r="32" fill="url(#purple-glow)" opacity="0.35" />
            <circle cx="50" cy="50" r="22" fill="none" stroke="url(#primary-blue)" strokeWidth="1.5" opacity="0.5" />
            <path d="M 50 18 L 54 50 L 50 82 L 46 50 Z" fill="url(#accent-purple)" />
            <path d="M 18 50 L 50 46 L 82 50 L 50 54 Z" fill="url(#neon-cyan)" opacity="0.85" />
            <circle cx="50" cy="50" r="5.5" fill="#FFFFFF" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative rounded-full select-none shrink-0 flex items-center justify-center overflow-hidden shadow-inner border border-white/10 dark:border-zinc-900/40 ${className}`}
      style={{
        width: size,
        height: size,
        background: gradient,
      }}
    >
      {/* SVG Container with high-end definitions */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <defs>
          <linearGradient id="primary-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="accent-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
          <linearGradient id="neon-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
          <radialGradient id="purple-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D946EF" stopOpacity="1" />
            <stop offset="100%" stopColor="#D946EF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="violet-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dynamic Vector Illustration based on name hash */}
        {renderIllustration(index)}
      </svg>

      {/* Glossy overlay sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
    </div>
  );
}
