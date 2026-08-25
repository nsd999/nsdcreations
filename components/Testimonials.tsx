"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, 
  Quote, 
  Plus
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { GradientAvatar } from "./GradientAvatar";
import { useGlobalReview } from "./GlobalReviewProvider";

// Interfaces
interface Testimonial {
  id: string;
  name: string;
  business_name?: string | null;
  rating: number;
  review: string;
  avatar_url?: string | null;
  photo_url?: string | null;
  status: string;
  created_at: string;
}

export function Testimonials({ contextSlug }: { contextSlug?: string } = {}) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { openReviewModal } = useGlobalReview();

  // Fetch approved testimonials
  const fetchTestimonials = async () => {
    try {
      let query = supabase
        .from("testimonials")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (contextSlug) {
        query = query.eq("context_slug", contextSlug);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();

    // Subscribe to Realtime testimonial updates silently
    const channel = supabase
      .channel("public:testimonials_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "testimonials" },
        (payload: any) => {
          // Silent automatic refresh
          fetchTestimonials();
        }
      )
      .subscribe();

    return () => {
      if (channel && typeof channel.unsubscribe === "function") {
        channel.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden bg-white dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-50 border-t border-zinc-100 dark:border-zinc-900/40 relative">
      <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative flex flex-col space-y-16">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 max-w-5xl">
          <div className="flex flex-col space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-orange-500 dark:text-amber-400 uppercase">
              {"// Studio Feedback"}
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
              Client Testimonials.
            </h2>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed font-sans">
              Real stories from industry leaders and creators who partnered with NSD Creations to deliver cinematic, AI-enhanced, and premium software products.
            </p>
          </div>

          <div className="flex space-x-3 shrink-0">
            {/* Share experience button */}
            <button
              onClick={() => openReviewModal(contextSlug)}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-zinc-900 dark:bg-zinc-50 hover:bg-orange-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 hover:text-white dark:hover:text-zinc-950 font-mono font-bold text-xs tracking-wider uppercase shadow-lg shadow-zinc-900/10 dark:shadow-none hover:shadow-orange-500/20 active:scale-95 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Your Review</span>
            </button>
          </div>
        </div>

        {/* Realtime Bento Grid / Column layout */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 rounded-full border-2 border-orange-500/25 border-t-orange-500 animate-spin" />
            <p className="text-xs font-mono tracking-wider text-zinc-400">LOADING TESTIMONIALS...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="border border-dashed border-zinc-200 dark:border-zinc-800/60 rounded-3xl p-16 text-center max-w-xl mx-auto flex flex-col items-center space-y-4">
            <Quote className="w-10 h-10 text-zinc-300 dark:text-zinc-700 stroke-[1.5]" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No approved reviews yet. Be the first to share your experience with NSD Creations!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full">
            <AnimatePresence mode="popLayout">
              {testimonials.map((testimonial, idx) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -5 }}
                  className={`group relative overflow-hidden rounded-2xl p-8 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-900/60 shadow-sm hover:shadow-md hover:border-orange-500/20 dark:hover:border-amber-400/20 transition-all duration-300 flex flex-col justify-between ${
                    idx === 0 ? "md:col-span-2 lg:col-span-1 bg-gradient-to-br from-orange-500/[0.02] to-amber-500/[0.02] border-orange-500/10 dark:border-amber-400/10" : ""
                  }`}
                >
                  <div className="absolute top-4 right-6 text-zinc-200/40 dark:text-zinc-800/10 group-hover:text-orange-500/10 dark:group-hover:text-amber-400/10 pointer-events-none transition-colors">
                    <Quote className="w-12 h-12 stroke-[1.5]" />
                  </div>

                  <div className="relative flex-1 flex flex-col space-y-6">
                    {/* Stars */}
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonial.rating ? "fill-orange-500 text-orange-500 dark:fill-amber-400 dark:text-amber-400" : "text-zinc-200 dark:text-zinc-800"}`} 
                        />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans italic flex-1 pr-4">
                      &quot;{testimonial.review}&quot;
                    </p>
                  </div>

                  {/* Profile info */}
                  <div className="flex items-center space-x-4 mt-8 pt-5 border-t border-zinc-100 dark:border-zinc-900/40">
                    <GradientAvatar 
                      name={testimonial.name} 
                      photoUrl={testimonial.photo_url || testimonial.avatar_url} 
                      size={42} 
                    />
                    <div className="flex flex-col text-left min-w-0">
                      <h4 className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                        {testimonial.name}
                      </h4>
                      {testimonial.business_name && (
                        <p className="text-zinc-400 dark:text-zinc-500 text-[11px] font-mono tracking-wider truncate uppercase">
                          {testimonial.business_name}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
