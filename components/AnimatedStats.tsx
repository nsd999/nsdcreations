"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "motion/react";

// easeOut cubic transition for smooth slows at the end of count animations
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

interface CounterProps {
  value: number;
  suffix?: string;
}

function AnimatedCounter({ value, suffix = "" }: CounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const startedRef = useRef(false);

  useEffect(() => {
    if (isInView && !startedRef.current) {
      startedRef.current = true;
      let startTimestamp: number | null = null;
      const duration = 1800; // 1.8 seconds total duration

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);

        setDisplayValue(Math.floor(easedProgress * value));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setDisplayValue(value);
        }
      };

      window.requestAnimationFrame(step);
    }
  }, [isInView, value]);

  return (
    <div ref={containerRef} className="text-3xl md:text-4xl font-bold font-display text-indigo-600 dark:text-indigo-400">
      {displayValue}
      {suffix}
    </div>
  );
}

interface RevealTextProps {
  text: string;
  delay?: number;
}

function RevealText({ text, delay = 0 }: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} className="overflow-hidden inline-block py-1">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
        transition={{
          duration: 1.0,
          ease: [0.16, 1, 0.3, 1], // premium Apple/Linear easeOut cubic-bezier
          delay: delay,
        }}
        className="text-3xl md:text-4xl font-bold font-display text-indigo-600 dark:text-indigo-400"
      >
        {text}
      </motion.div>
    </div>
  );
}

export function AnimatedStats() {
  return (
    <section className="py-12 border-y border-zinc-200/50 dark:border-zinc-900/50 bg-zinc-50/50 dark:bg-[#030303]/40">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {/* Projects Completed */}
        <div>
          <AnimatedCounter value={20} suffix="+" />
          <div className="text-xs font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mt-1">
            Projects Completed
          </div>
        </div>

        {/* Happy Clients */}
        <div>
          <AnimatedCounter value={30} suffix="+" />
          <div className="text-xs font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mt-1">
            Happy Clients
          </div>
        </div>

        {/* Since 2022 with slide/fade */}
        <div>
          <RevealText text="Since 2022" delay={0.1} />
          <div className="text-xs font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mt-1">
            Pioneering Tech agency
          </div>
        </div>

        {/* End-to-End Support with premium reveal */}
        <div>
          <RevealText text="End-to-End" delay={0.2} />
          <div className="text-xs font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mt-1">
            Dedicated Support
          </div>
        </div>
      </div>
    </section>
  );
}
