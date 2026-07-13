"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, animate } from "motion/react";

interface CounterProps {
  value: number;
  suffix?: string;
}

function AnimatedCounter({ value, suffix = "" }: CounterProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const count = useMotionValue(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 1.8,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplay(Math.floor(latest));
        }
      });
      return () => controls.stop();
    }
  }, [isInView, value, count]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-black font-display text-indigo-600 dark:text-indigo-400">
      {display}
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
        initial={{ y: 20, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1], // Premium Apple/Linear style easing
          delay: delay,
        }}
        className="text-3xl md:text-4xl font-black font-display text-indigo-600 dark:text-indigo-400"
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
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <AnimatedCounter value={20} suffix="+" />
          <div className="text-xs font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mt-1">
            Projects Completed
          </div>
        </motion.div>

        {/* Happy Clients */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <AnimatedCounter value={30} suffix="+" />
          <div className="text-xs font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mt-1">
            Happy Clients
          </div>
        </motion.div>

        {/* Since 2022 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <RevealText text="Since 2022" delay={0.1} />
          <div className="text-xs font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mt-1">
            Pioneering Tech agency
          </div>
        </motion.div>

        {/* End-to-End */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <RevealText text="End-to-End" delay={0.2} />
          <div className="text-xs font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase mt-1">
            Dedicated Support
          </div>
        </motion.div>
      </div>
    </section>
  );
}
