"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-6 text-center bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 select-none">
      <div className="max-w-md w-full flex flex-col items-center space-y-8">
        {/* Animated Error Code */}
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-8xl md:text-9xl text-indigo-500/10 dark:text-indigo-400/10 tracking-tighter"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl font-mono font-bold tracking-wider text-zinc-800 dark:text-zinc-200 uppercase"
            >
              Lost in Space
            </motion.p>
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col space-y-3">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-display font-bold text-2xl md:text-3xl tracking-tight"
          >
            Page Not Found.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed"
          >
            The destination you are seeking has been moved, archived, or does not exist in our studio mapping.
          </motion.p>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="pt-4"
        >
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-zinc-900 dark:bg-zinc-50 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white dark:text-zinc-950 hover:text-white dark:hover:text-white font-mono font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-indigo-500/20 active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Return Home</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
