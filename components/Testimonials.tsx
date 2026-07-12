"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { ImageWithNSDFallback } from "./ImageWithNSDFallback";

interface Testimonial {
  text: string;
  author: string;
  role: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    text: `"Sai Dheeraj created an incredibly professional Nutrition & Wellness Introduction Video for my practice. His ability to translate complex health concepts into engaging visual content is exceptional. The response from my clients has been outstanding, and the video has greatly enhanced my professional brand!"`,
    author: "Shilpa Palli",
    role: "Nutrition & Wellness Consultant",
    image: "/shilpa.png"
  },
  {
    text: `"We commissioned NSD Creations for a custom AI Memorial Tribute Video to honor our family's heritage. Sai Dheeraj was exceptionally respectful, meticulously restored physical photographs from the 1970s, and edited an emotional storyline that brought tears to everyone who watched."`,
    author: "Santhosh Juluri",
    role: "Legacy Tribute Client",
    image: "/santhosh.png"
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slideDuration = 6000; // 6 seconds auto-play

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, slideDuration);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, currentIndex]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      },
    }),
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-24 px-6 max-w-5xl mx-auto overflow-hidden">
      <div className="flex flex-col space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="max-w-xl flex flex-col space-y-3 text-left">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 dark:text-indigo-400 uppercase">
              Client Feedback
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-900 dark:text-zinc-50 tracking-tight">
              Trusted by Ambitious Leaders.
            </h2>
          </div>

          {/* Nav Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setDirection(-1);
                handlePrev();
              }}
              className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 transition-all shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setDirection(1);
                handleNext();
              }}
              className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 transition-all shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full aspect-auto min-h-[340px] md:min-h-[280px] p-8 md:p-12 rounded-3xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-900/50 shadow-sm flex flex-col justify-between"
        >
          {/* Decorative Quote Icon */}
          <div className="absolute top-6 right-8 text-indigo-500/10 dark:text-indigo-400/5 pointer-events-none">
            <Quote className="w-24 h-24 stroke-[1.5]" />
          </div>

          <div className="relative flex-1 flex flex-col justify-between z-10">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full flex-1 flex flex-col justify-between"
              >
                {/* Review Text */}
                <p className="text-zinc-600 dark:text-zinc-300 text-sm md:text-lg leading-relaxed italic pr-6 md:pr-12">
                  {currentTestimonial.text}
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-zinc-200/50 dark:border-zinc-900/50">
                  <div className="w-11 h-11 rounded-full overflow-hidden relative shadow-sm border border-zinc-200/60 dark:border-zinc-800/60 shrink-0">
                    <ImageWithNSDFallback
                      src={currentTestimonial.image}
                      alt={currentTestimonial.author}
                      fill
                    />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {currentTestimonial.author}
                    </h4>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-mono">
                      {currentTestimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Indicators & Play Timer */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-200/20 dark:bg-zinc-800/10 overflow-hidden rounded-b-3xl">
            <motion.div
              key={currentIndex + (isPaused ? "-paused" : "-active")}
              initial={{ width: "0%" }}
              animate={isPaused ? { width: "100%" } : { width: "100%" }}
              transition={
                isPaused
                  ? { duration: 0 }
                  : { duration: slideDuration / 1000, ease: "linear" }
              }
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          </div>
        </div>

        {/* Bullet indicators */}
        <div className="flex justify-center space-x-2 pt-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "w-8 bg-indigo-500"
                  : "w-2.5 bg-zinc-300 dark:bg-zinc-800 hover:bg-zinc-400 dark:hover:bg-zinc-700"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
