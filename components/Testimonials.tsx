"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, 
  Quote, 
  Plus, 
  X, 
  Upload, 
  Check, 
  AlertCircle, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight,
  Settings
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { GradientAvatar } from "./GradientAvatar";

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

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Submission Form State
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Honeypot spam protection

  // Drag and Drop State
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch approved testimonials
  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

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
  }, []);

  // Simple clean sanitization to guard against XSS
  const sanitizeInput = (text: string): string => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .trim();
  };

  // Convert uploaded image file to Base64 safely
  const handleImageUpload = (file: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setFormError("Maximum photo upload size is 2MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setFormError("Only image files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // File drop/drag handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    // 1. Honeypot check for bots
    if (honeypot !== "") {
      // Act like it succeeded to fool automated spambots
      setFormSuccess(true);
      setIsSubmitting(false);
      return;
    }

    // 2. Client side validation
    const cleanName = sanitizeInput(name);
    const cleanBusiness = sanitizeInput(businessName);
    const cleanReview = sanitizeInput(review);

    if (cleanName.length < 2 || cleanName.length > 50) {
      setFormError("Name must be between 2 and 50 characters.");
      setIsSubmitting(false);
      return;
    }

    if (cleanReview.length < 10 || cleanReview.length > 600) {
      setFormError("Review content must be between 10 and 600 characters.");
      setIsSubmitting(false);
      return;
    }

    if (rating < 1 || rating > 5) {
      setFormError("Rating must be between 1 and 5 stars.");
      setIsSubmitting(false);
      return;
    }

    // 3. Security: Rate limiting check (1 submission per 5 mins per local device)
    const lastSubStr = localStorage.getItem("nsd_last_testimonial_submission");
    if (lastSubStr) {
      const lastSub = parseInt(lastSubStr, 10);
      const timeDiff = Date.now() - lastSub;
      if (timeDiff < 5 * 60 * 1000) {
        const remainingSec = Math.round((5 * 60 * 1000 - timeDiff) / 1000);
        setFormError(`Spam Protection: Please wait ${remainingSec}s before submitting another review.`);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Save data in database
      const { error } = await supabase.from("testimonials").insert([
        {
          name: cleanName,
          business_name: cleanBusiness || null,
          rating,
          review: cleanReview,
          avatar_url: `gradient-${Math.floor(Math.random() * 6)}`,
          photo_url: photoBase64,
          status: "pending" // Admin approval required
        }
      ]);

      if (error) throw error;

      // Update rate limit timestamp
      localStorage.setItem("nsd_last_testimonial_submission", Date.now().toString());

      setFormSuccess(true);
      // Reset form fields
      setName("");
      setBusinessName("");
      setRating(5);
      setReview("");
      setPhotoBase64(null);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setFormError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden bg-white dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-50 border-t border-zinc-100 dark:border-zinc-900/40 relative">
      <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative flex flex-col space-y-16">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 max-w-5xl">
          <div className="flex flex-col space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-orange-500 dark:text-amber-400 uppercase">
              // Studio Feedback
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
              onClick={() => {
                setIsModalOpen(true);
                setFormSuccess(false);
                setFormError("");
              }}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-zinc-900 dark:bg-zinc-50 hover:bg-orange-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 hover:text-white dark:hover:text-zinc-950 font-mono font-bold text-xs tracking-wider uppercase shadow-lg shadow-zinc-900/10 dark:shadow-none hover:shadow-orange-500/20 active:scale-95 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Review</span>
            </button>

            {/* Quick Admin Access Link */}
            <a
              href="/admin"
              className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all active:scale-95 shadow-sm"
              title="Admin Panel"
            >
              <Settings className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Realtime Bento Grid / Column layout */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 rounded-full border-2 border-orange-500/25 border-t-orange-500 animate-spin" />
            <p className="text-xs font-mono tracking-wider text-zinc-400">CONNECTING TO STREAM...</p>
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
                      "{testimonial.review}"
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

      {/* Review Submission Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden shadow-2xl z-10 p-8 md:p-10 text-left"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {formSuccess ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Check className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">Review Received.</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
                      Thank you! Your testimonial has been submitted. It will be displayed on the platform once approved by our moderation team.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full px-5 py-3 rounded-full bg-zinc-900 dark:bg-zinc-50 hover:bg-orange-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 hover:text-white dark:hover:text-zinc-950 font-mono font-bold text-xs tracking-wider uppercase transition-colors active:scale-95"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-orange-500 dark:text-amber-400 uppercase tracking-widest">// Co-Create Success</span>
                    <h3 className="font-display font-bold text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">Share Your Experience</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      We value your partnership. Submissions go through brief moderation before going live.
                    </p>
                  </div>

                  {/* Honeypot Field (Invisible to human users, traps spambots) */}
                  <div className="hidden">
                    <label htmlFor="website_url">Do not fill this if you are human</label>
                    <input
                      id="website_url"
                      type="text"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {/* Rating Selector */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                      Overall Rating
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= rating
                                ? "fill-orange-500 text-orange-500 dark:fill-amber-400 dark:text-amber-400"
                                : "text-zinc-200 dark:text-zinc-800"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="user-name" className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                        Full Name
                      </label>
                      <input
                        id="user-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/50 focus:border-orange-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-orange-500/25 text-sm outline-none transition-all placeholder:text-zinc-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="business-name" className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                        Business / Company
                      </label>
                      <input
                        id="business-name"
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Vercel (Optional)"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/50 focus:border-orange-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-orange-500/25 text-sm outline-none transition-all placeholder:text-zinc-400"
                      />
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="space-y-2">
                    <label htmlFor="review-text" className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                      Review Description
                    </label>
                    <textarea
                      id="review-text"
                      required
                      rows={4}
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Share details of your partnership or the impact NSD Creations made on your brand..."
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/50 focus:border-orange-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-orange-500/25 text-sm outline-none transition-all placeholder:text-zinc-400 resize-none leading-relaxed"
                    />
                    <div className="flex justify-end text-[10px] font-mono text-zinc-400">
                      {review.length}/600 chars
                    </div>
                  </div>

                  {/* Photo Upload (Base64 file converter) */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                      Profile Photo (Optional)
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer flex flex-col items-center justify-center space-y-2 transition-all ${
                        isDragging
                          ? "border-orange-500 bg-orange-500/[0.02]"
                          : photoBase64
                          ? "border-emerald-500 bg-emerald-500/[0.01]"
                          : "border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800"
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        accept="image/*"
                        className="hidden"
                      />

                      {photoBase64 ? (
                        <div className="flex items-center space-x-3">
                          <img
                            src={photoBase64}
                            alt="Preview"
                            className="w-10 h-10 rounded-full object-cover border border-zinc-200/50 dark:border-zinc-800/50"
                          />
                          <div className="text-left">
                            <span className="block text-xs font-bold text-emerald-500 flex items-center space-x-1">
                              <Check className="w-3 h-3" />
                              <span>Photo attached successfully</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPhotoBase64(null);
                              }}
                              className="text-[10px] text-red-500 hover:underline font-mono"
                            >
                              Remove photo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
                          <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                            Drag & drop or <span className="text-orange-500 dark:text-amber-400 font-bold hover:underline">browse</span>
                          </span>
                          <span className="block text-[10px] text-zinc-400 font-mono">Max size: 2MB</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Form Error Message */}
                  {formError && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start space-x-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="text-xs leading-relaxed">{formError}</span>
                    </div>
                  )}

                  {/* Form Submission Buttons */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-5 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-mono font-bold text-xs tracking-wider uppercase transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-full bg-zinc-900 dark:bg-zinc-50 hover:bg-orange-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 hover:text-white dark:hover:text-zinc-950 font-mono font-bold text-xs tracking-wider uppercase transition-colors active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-500/50 border-t-zinc-500 animate-spin" />
                      ) : (
                        <>
                          <span>Submit</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
