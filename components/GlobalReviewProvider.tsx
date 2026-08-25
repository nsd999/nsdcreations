"use client";

import React, { createContext, useContext, useState, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, 
  X, 
  Upload, 
  Check, 
  AlertCircle,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface GlobalReviewContextType {
  openReviewModal: (contextSlug?: string) => void;
  closeReviewModal: () => void;
}

const GlobalReviewContext = createContext<GlobalReviewContextType | undefined>(undefined);

export function useGlobalReview() {
  const context = useContext(GlobalReviewContext);
  if (!context) {
    throw new Error("useGlobalReview must be used within a GlobalReviewProvider");
  }
  return context;
}

export function GlobalReviewProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contextSlug, setContextSlug] = useState<string | undefined>(undefined);
  
  // Submission Form State
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Drag and Drop State
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openReviewModal = (slug?: string) => {
    setContextSlug(slug);
    setFormSuccess(false);
    setFormError("");
    setIsOpen(true);
  };

  const closeReviewModal = () => {
    setIsOpen(false);
  };

  const sanitizeInput = (text: string): string => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .trim();
  };

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

    if (honeypot !== "") {
      setFormSuccess(true);
      setIsSubmitting(false);
      return;
    }

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
      const { error } = await supabase.from("testimonials").insert([
        {
          name: cleanName,
          business_name: cleanBusiness || null,
          rating,
          review: cleanReview,
          avatar_url: `gradient-${Math.floor(Math.random() * 6)}`,
          photo_url: photoBase64,
          status: "pending",
          context_slug: contextSlug || null
        }
      ]);

      if (error) throw error;

      localStorage.setItem("nsd_last_testimonial_submission", Date.now().toString());
      setFormSuccess(true);
      // We don't reset name and review yet, so we can copy them to clipboard for Google
    } catch (err: any) {
      console.error("Submission failed:", err);
      setFormError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyToGoogle = () => {
    const textToCopy = review;
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Redirect to the provided Google Search / Reviews link
      window.open("https://www.google.com/search?q=NSD+Creations&oq=NSD+Creations&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7MgYIARBFGDwyBggCEEUYPDIGCAMQRRg80gEIMzEzMmowajeoAgCwAgA&sourceid=chrome&source=chrome.ob&ie=UTF-8&sei=-yKNapvlHMmbhvcPh8KYuAs#", "_blank");
      
      // Now we can reset the form fields
      setName("");
      setBusinessName("");
      setRating(5);
      setReview("");
      setPhotoBase64(null);
      closeReviewModal();
    });
  };

  const handleCloseSuccess = () => {
    setName("");
    setBusinessName("");
    setRating(5);
    setReview("");
    setPhotoBase64(null);
    closeReviewModal();
  };

  return (
    <GlobalReviewContext.Provider value={{ openReviewModal, closeReviewModal }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeReviewModal}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden shadow-2xl z-10 p-8 md:p-10 text-left my-8"
            >
              <button
                onClick={closeReviewModal}
                className="absolute top-6 right-6 w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors bg-white dark:bg-zinc-950 z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {formSuccess ? (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Check className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-zinc-900 dark:text-zinc-50">✓ Thank you!</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                      Your review has been successfully submitted to NSD Creations.
                    </p>
                  </div>
                  
                  {rating >= 4 && (
                    <div className="w-full p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl space-y-4">
                      <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                        <Star className="w-5 h-5 fill-current" />
                        <h4 className="font-bold text-sm tracking-wide uppercase font-mono">One Last Step</h4>
                        <Star className="w-5 h-5 fill-current" />
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        To help us grow, could you also post this review on our Google Business page? 
                      </p>
                      <button
                        onClick={handleCopyToGoogle}
                        className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs tracking-wider uppercase transition-colors shadow-lg shadow-blue-500/20"
                      >
                        <span>Copy Text & Open Google</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleCloseSuccess}
                    className="w-full px-5 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono font-bold text-xs tracking-wider uppercase transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 pr-8">
                    <span className="text-[10px] font-mono font-bold text-orange-500 dark:text-amber-400 uppercase tracking-widest">{"// Co-Create Success"}</span>
                    <h3 className="font-display font-bold text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">Share Your Experience</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      We value your partnership. Submissions go through brief moderation before going live.
                    </p>
                  </div>

                  <div className="hidden">
                    <label htmlFor="website_url">Do not fill this if you are human</label>
                    <input
                      id="website_url"
                      type="text"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

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
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 focus:border-orange-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-orange-500/25 text-sm outline-none transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-50"
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
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 focus:border-orange-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-orange-500/25 text-sm outline-none transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>
                  </div>

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
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 focus:border-orange-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-orange-500/25 text-sm outline-none transition-all placeholder:text-zinc-400 resize-none leading-relaxed text-zinc-900 dark:text-zinc-50"
                    />
                    <div className="flex justify-end text-[10px] font-mono text-zinc-400">
                      {review.length}/600 chars
                    </div>
                  </div>

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
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
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

                  {formError && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start space-x-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="text-xs leading-relaxed">{formError}</span>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={closeReviewModal}
                      className="flex-1 px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-mono font-bold text-xs tracking-wider uppercase transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-50 hover:bg-orange-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 hover:text-white dark:hover:text-zinc-950 font-mono font-bold text-xs tracking-wider uppercase transition-colors active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-500/50 border-t-zinc-500 animate-spin" />
                      ) : (
                        <>
                          <span>Submit Review</span>
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
    </GlobalReviewContext.Provider>
  );
}
