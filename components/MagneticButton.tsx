"use client";

import React, { useRef, useState } from "react";
import { motion } from "motion/react";

interface MagneticButtonProps extends React.ComponentProps<typeof motion.button> {
  children: React.ReactNode;
  strength?: number; // How far it moves (default 20)
}

export function MagneticButton({ children, strength = 20, className = "", ...props }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const x = ((clientX - centerX) / width) * strength;
    const y = ((clientY - centerY) / height) * strength;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative inline-flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
