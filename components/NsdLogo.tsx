"use client";

import React from "react";
import { motion } from "motion/react";

interface NsdLogoProps {
  mode: "tracing" | "final" | "navbar";
  theme?: "light" | "dark";
  className?: string;
  isCompleted?: boolean;
}

export function NsdLogo({ mode, theme = "dark", className = "", isCompleted = false }: NsdLogoProps) {
  // Glow color depending on the theme
  const glowColor = theme === "light" ? "#f97316" : "#a855f7"; // Soft orange for light, royal purple for dark
  
  // Transition constants
  const drawTransition = {
    duration: 1.2,
    ease: "easeInOut",
  };

  return (
    <motion.svg
      viewBox="0 0 500 400"
      className={`w-full h-full select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients for 3D Bubbly Letters */}
        <linearGradient id="logoOrangeGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF3A1" />   {/* Light highlight */}
          <stop offset="30%" stopColor="#FFA11F" />  {/* Vibrant orange */}
          <stop offset="70%" stopColor="#E65100" />  {/* Deep orange */}
          <stop offset="100%" stopColor="#9E2B00" /> {/* Shadow accent */}
        </linearGradient>

        <linearGradient id="logoSwooshGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E65100" />
          <stop offset="50%" stopColor="#FFA11F" />
          <stop offset="100%" stopColor="#9E2B00" />
        </linearGradient>

        {/* Glow Filters */}
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="luxuryShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.35" />
        </filter>
        
        {/* Subtle Inner Highlight overlay gradient */}
        <linearGradient id="highlightOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ========================================== */}
      {/* TRACING MODE (Phases 2-5): Neon light drawing */}
      {/* ========================================== */}
      {mode === "tracing" && (
        <g filter="url(#neonGlow)">
          {/* Neon skeleton letters "NSD" */}
          <motion.path
            d="M 125,120 V 55 L 175,120 V 55" // N
            fill="none"
            stroke={glowColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ ...drawTransition, delay: 0.2 }}
          />
          <motion.path
            d="M 235,60 C 190,55 190,85 235,95 C 255,100 255,125 190,120" // S
            fill="none"
            stroke={glowColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ ...drawTransition, delay: 0.6 }}
          />
          <motion.path
            d="M 270,55 V 120 C 330,120 330,55 270,55" // D
            fill="none"
            stroke={glowColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ ...drawTransition, delay: 1.0 }}
          />

          {/* Neon skeleton letters "CREATIONS" */}
          <motion.path
            d="M 120,185 C 100,185 100,205 120,205 M 140,185 V 205 H 155 C 165,205 165,195 155,195 H 140 M 150,195 L 160,205 M 170,205 V 185 H 185 M 170,195 H 182 M 195,205 L 202,185 L 210,205 M 198,198 H 207 M 218,185 H 234 M 226,185 V 205 M 244,185 V 205 M 255,195 C 255,185 275,185 275,195 C 275,205 255,205 255,195 Z M 285,205 V 185 L 305,205 V 185 M 315,187 C 327,185 327,192 315,195 C 310,196 310,205 325,203"
            fill="none"
            stroke={glowColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 1.3 }}
          />

          {/* Neon Double Underline Swooshes */}
          <motion.path
            d="M 90,240 Q 250,285 410,240"
            fill="none"
            stroke={glowColor}
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 1.8 }}
          />
          <motion.path
            d="M 125,255 Q 250,298 375,255"
            fill="none"
            stroke={glowColor}
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 2.0 }}
          />
        </g>
      )}

      {/* ========================================== */}
      {/* FINAL / NAVBAR MODE (Phases 6 onwards): 3D Sticker */}
      {/* ========================================== */}
      {(mode === "final" || mode === "navbar") && (
        <motion.g
          initial={isCompleted ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          filter="url(#luxuryShadow)"
        >
          {/* Part 1: Dark Outer Backdrop Silhouette/Backing (The sticker container background) */}
          <g>
            {/* Outline Backdrop for letters NSD and CREATIONS and swooshes */}
            {/* We overlay thick stroke text layers to generate a perfect backdrop outline */}
            <text
              x="250"
              y="140"
              textAnchor="middle"
              className="font-fredoka"
              fontSize="108"
              fontWeight="900"
              fill="#1B202D"
              stroke="#1B202D"
              strokeWidth="28"
              strokeLinejoin="round"
              paintOrder="stroke fill"
            >
              NSD
            </text>
            <text
              x="250"
              y="210"
              textAnchor="middle"
              className="font-fredoka"
              fontSize="52"
              fontWeight="900"
              fill="#1B202D"
              stroke="#1B202D"
              strokeWidth="18"
              strokeLinejoin="round"
              paintOrder="stroke fill"
            >
              CREATIONS
            </text>

            {/* Backing Silhouette for Swooshes */}
            <path
              d="M 75,240 Q 250,292 425,240 Q 250,275 75,240"
              fill="#1B202D"
              stroke="#1B202D"
              strokeWidth="16"
              strokeLinejoin="round"
            />
            <path
              d="M 115,255 Q 250,305 385,255 Q 250,285 115,255"
              fill="#1B202D"
              stroke="#1B202D"
              strokeWidth="12"
              strokeLinejoin="round"
            />
          </g>

          {/* Part 2: Splatters and Drops of liquid glossy paint around backdrop */}
          <g fill="#E65100">
            {/* Top splashes */}
            <circle cx="170" cy="50" r="4.5" />
            <circle cx="330" cy="52" r="5" />
            <path d="M 125,55 Q 120,40 128,45 Z" />
            <path d="M 370,60 Q 380,45 373,50 Z" />
            <circle cx="375" cy="72" r="3.5" />
            
            {/* Left and Right splashes */}
            <circle cx="110" cy="90" r="3.5" />
            <circle cx="100" cy="118" r="4.5" />
            <circle cx="388" cy="100" r="4" />
            <circle cx="395" cy="125" r="3" />
            
            {/* Bottom dripping drops */}
            <path d="M 268,260 C 268,275 264,282 268,290 C 272,282 272,275 272,260 Z" />
            <path d="M 360,240 C 360,265 352,275 358,292 C 364,275 364,265 364,240 Z" />
            <circle cx="110" cy="275" r="4.5" />
            <circle cx="128" cy="295" r="3" />
          </g>

          {/* Part 3: 3D Bronze Extrusion/Depth Layer (renders offset to create depth) */}
          <g fill="#7A2201">
            {/* Extruded text shadow for "NSD" */}
            <text
              x="250"
              y="144"
              textAnchor="middle"
              className="font-fredoka"
              fontSize="108"
              fontWeight="900"
              stroke="#7A2201"
              strokeWidth="10"
              strokeLinejoin="round"
              paintOrder="stroke fill"
            >
              NSD
            </text>

            {/* Extruded text shadow for "CREATIONS" */}
            <text
              x="250"
              y="213"
              textAnchor="middle"
              className="font-fredoka"
              fontSize="52"
              fontWeight="900"
              stroke="#7A2201"
              strokeWidth="6"
              strokeLinejoin="round"
              paintOrder="stroke fill"
            >
              CREATIONS
            </text>

            {/* 3D Depth of Swooshes */}
            <path d="M 85,243 Q 250,288 415,243 Q 250,270 85,243" />
            <path d="M 120,258 Q 250,301 380,258 Q 250,281 120,258" />
          </g>

          {/* Part 4: Swoosh Gradients */}
          <g fill="url(#logoSwooshGrad)">
            {/* Upper Swoosh Front face */}
            <path d="M 85,240 Q 250,285 415,240 Q 250,268 85,240" />
            {/* Lower Swoosh Front face */}
            <path d="M 120,255 Q 250,298 380,255 Q 250,278 120,255" />
          </g>

          {/* Part 5: Main Letter Front Faces (with gold-orange gradient fill and slight stroke) */}
          <g>
            <text
              x="250"
              y="140"
              textAnchor="middle"
              className="font-fredoka"
              fontSize="108"
              fontWeight="900"
              fill="url(#logoOrangeGold)"
              stroke="#7A2201"
              strokeWidth="3.5"
              strokeLinejoin="round"
              paintOrder="stroke fill"
            >
              NSD
            </text>

            <text
              x="250"
              y="210"
              textAnchor="middle"
              className="font-fredoka"
              fontSize="52"
              fontWeight="900"
              fill="url(#logoOrangeGold)"
              stroke="#7A2201"
              strokeWidth="2"
              strokeLinejoin="round"
              paintOrder="stroke fill"
            >
              CREATIONS
            </text>
          </g>

          {/* Part 6: Specular Highlight Overlays to look glossy like the original logo */}
          <g pointerEvents="none" fill="url(#highlightOverlay)">
            {/* Highlight for "NSD" */}
            <text
              x="250"
              y="140"
              textAnchor="middle"
              className="font-fredoka"
              fontSize="108"
              fontWeight="900"
              stroke="transparent"
              paintOrder="stroke fill"
            >
              NSD
            </text>
            {/* Highlight for "CREATIONS" */}
            <text
              x="250"
              y="210"
              textAnchor="middle"
              className="font-fredoka"
              fontSize="52"
              fontWeight="900"
              stroke="transparent"
              paintOrder="stroke fill"
            >
              CREATIONS
            </text>
          </g>

          {/* Small shiny white reflections inside the letters for organic detail */}
          <g fill="#FFF">
            {/* Letter N highlight */}
            <ellipse cx="140" cy="75" rx="3" ry="1.5" transform="rotate(-20, 140, 75)" opacity="0.65" />
            {/* Letter S highlight */}
            <ellipse cx="218" cy="72" rx="3.5" ry="1.5" transform="rotate(-15, 218, 72)" opacity="0.65" />
            {/* Letter D highlight */}
            <ellipse cx="288" cy="75" rx="3" ry="1.5" transform="rotate(-10, 288, 75)" opacity="0.65" />
          </g>
        </motion.g>
      )}

      {/* ========================================== */}
      {/* Tagline text: Crafting Creativity Since 2022 */}
      {/* ========================================== */}
      {mode === "final" && (
        <motion.g
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 2.4 }}
        >
          {/* Subheading text in clean, premium wide uppercase letter-spacing */}
          <text
            x="250"
            y="320"
            textAnchor="middle"
            fill={theme === "light" ? "#4a3525" : "#E2E8F0"}
            fontSize="15"
            fontWeight="700"
            letterSpacing="8"
            className="font-sans select-none tracking-widest uppercase opacity-90"
          >
            CRAFTING CREATIVITY
          </text>
          
          <text
            x="250"
            y="348"
            textAnchor="middle"
            fill="#FFA11F"
            fontSize="13"
            fontWeight="800"
            letterSpacing="10"
            className="font-mono select-none tracking-widest uppercase"
          >
            SINCE 2022
          </text>
        </motion.g>
      )}
    </motion.svg>
  );
}
