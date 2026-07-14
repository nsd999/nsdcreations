"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, 
  X, 
  Trash2, 
  ShieldAlert, 
  Database, 
  Clock, 
  Star, 
  ArrowLeft,
  Key,
  Code,
  Sparkles,
  Info
} from "lucide-react";
import Link from "next/link";
import { supabase, SUPABASE_CONFIG_STATUS, SUPABASE_SETUP_SQL } from "@/lib/supabase";
import { GradientAvatar } from "@/components/GradientAvatar";

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

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [systemLog, setSystemLog] = useState<string>("Initializing administrative session...");
  const [copiedSql, setCopiedSql] = useState(false);

  // Quick administrative security guard passcode
  const ADMIN_PASSCODE = "admin123";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setSystemLog((prev) => `${prev}\n[AUTH] Administrative session verified.`);
    } else {
      setAuthError("Invalid administrator credentials.");
    }
  };

  const fetchAllTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
      setSystemLog((prev) => `${prev}\n[DB] Synced ${data?.length || 0} testimonials from system table.`);
    } catch (err: any) {
      console.error("Error fetching testimonials:", err);
      setSystemLog((prev) => `${prev}\n[ERROR] Sync failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllTestimonials();

      // Setup live Realtime subscription inside admin dashboard too
      const channel = supabase
        .channel("admin_testimonials_channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "testimonials" },
          (payload: any) => {
            setSystemLog((prev) => `${prev}\n[REALTIME] Postgres broadcast received: ${payload.eventType}`);
            fetchAllTestimonials();
          }
        )
        .subscribe();

      return () => {
        if (channel && typeof channel.unsubscribe === "function") {
          channel.unsubscribe();
        }
      };
    }
  }, [isAuthenticated]);

  const updateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      setSystemLog((prev) => `${prev}\n[MUTATION] Updating record ${id} to ${newStatus.toUpperCase()}...`);
      const { error } = await supabase
        .from("testimonials")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setSystemLog((prev) => `${prev}\n[SUCCESS] Record ${id} status updated.`);
      // Refetch automatically
      await fetchAllTestimonials();
    } catch (err: any) {
      console.error("Failed to update status:", err);
      setSystemLog((prev) => `${prev}\n[ERROR] Mutation failed: ${err.message}`);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you absolutely sure you want to permanently delete this testimonial? This action is irreversible.")) {
      return;
    }
    try {
      setSystemLog((prev) => `${prev}\n[MUTATION] Deleting record ${id}...`);
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSystemLog((prev) => `${prev}\n[SUCCESS] Record ${id} permanently removed.`);
      await fetchAllTestimonials();
    } catch (err: any) {
      console.error("Failed to delete:", err);
      setSystemLog((prev) => `${prev}\n[ERROR] Deletion failed: ${err.message}`);
    }
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setSystemLog((prev) => `${prev}\n[CLIPBOARD] SQL migration script copied.`);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const filtered = testimonials.filter((t) => t.status === activeTab);

  if (!SUPABASE_CONFIG_STATUS.isConfigured) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md p-8 md:p-10 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-900 shadow-xl text-center space-y-6"
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display font-bold text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">
              Admin services are currently unavailable.
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Secure cloud database connection has not been initialized. Please contact the system administrator to configure secure cloud database services.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-black font-mono font-bold text-xs tracking-wider uppercase transition-all duration-200 shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Return Home</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 md:p-10 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-900 shadow-xl space-y-8"
        >
          {/* Badge */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 dark:bg-amber-400/10 flex items-center justify-center text-orange-500 dark:text-amber-400">
              <Key className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
              {"// ADMINISTRATIVE PORTAL"}
            </span>
            <h1 className="font-display font-bold text-2xl tracking-tight">Admin Gate</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
              Authenticate using the secure administrative passcode to manage system reviews, view configurations, and trigger live status updates.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="passcode-field" className="block text-[10px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                Secure Passcode
              </label>
              <input
                id="passcode-field"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin passcode (admin123)"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:border-orange-500 dark:focus:border-amber-400 text-sm outline-none transition-all placeholder:text-zinc-400 text-center font-mono tracking-widest"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-500 dark:text-red-400 flex items-center space-x-1.5 justify-center">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{authError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full px-5 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-50 hover:bg-orange-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 hover:text-white dark:hover:text-zinc-950 font-mono font-bold text-xs tracking-wider uppercase transition-colors active:scale-95 shadow-sm"
            >
              Sign In
            </button>
          </form>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-900/60">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 transition-all bg-white dark:bg-zinc-900/40"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <span className="text-xs font-mono font-bold text-orange-500 dark:text-amber-400 uppercase tracking-widest">{"// DEPLOYMENT CONSOLE"}</span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-zinc-900 dark:text-zinc-50">Review Moderation</h1>
          </div>

          {/* Database Setup Info Card */}
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-900 max-w-sm">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${SUPABASE_CONFIG_STATUS.isConfigured ? "bg-emerald-500/15 text-emerald-500" : "bg-orange-500/10 text-orange-500"}`}>
              <Database className="w-5 h-5" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider">SUPABASE CONNECTION</h4>
              <p className="text-[11px] text-zinc-400 truncate">
                {SUPABASE_CONFIG_STATUS.isConfigured ? "Connected to Cloud instance" : "Emulated offline engine (localStorage)"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Moderation Queue (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status Tabs */}
            <div className="flex space-x-2 border-b border-zinc-200 dark:border-zinc-900/40 pb-3">
              {(["pending", "approved", "rejected"] as const).map((tab) => {
                const count = testimonials.filter((t) => t.status === tab).length;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center space-x-2 ${
                      activeTab === tab
                        ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 shadow-md"
                        : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <span>{tab}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab ? "bg-zinc-700 dark:bg-zinc-200" : "bg-zinc-200 dark:bg-zinc-800"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Testimonials List */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-8 h-8 rounded-full border-2 border-orange-500/25 border-t-orange-500 animate-spin" />
                <p className="text-xs font-mono tracking-wider text-zinc-400">LOADING DATABASE ENTRIES...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-16 text-center text-zinc-400 space-y-3 bg-white/40 dark:bg-zinc-900/10">
                <Clock className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto stroke-[1.5]" />
                <p className="text-sm">No testimonials in the &quot;{activeTab}&quot; queue.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((testimonial) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-900 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6"
                    >
                      <div className="flex items-start space-x-4 flex-1">
                        <GradientAvatar
                          name={testimonial.name}
                          photoUrl={testimonial.photo_url || testimonial.avatar_url}
                          size={46}
                        />
                        <div className="space-y-3 flex-1 text-left">
                          <div>
                            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-50">{testimonial.name}</h3>
                            {testimonial.business_name && (
                              <p className="text-xs font-mono text-zinc-400 uppercase tracking-wide">{testimonial.business_name}</p>
                            )}
                          </div>
                          
                          {/* Rating */}
                          <div className="flex space-x-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < testimonial.rating
                                    ? "fill-orange-500 text-orange-500 dark:fill-amber-400 dark:text-amber-400"
                                    : "text-zinc-200 dark:text-zinc-800"
                                }`}
                              />
                            ))}
                          </div>

                          {/* Review */}
                          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans italic">
                            &quot;{testimonial.review}&quot;
                          </p>

                          <div className="text-[10px] text-zinc-400 font-mono">
                            Submitted: {new Date(testimonial.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2 shrink-0 justify-end border-t md:border-t-0 pt-4 md:pt-0 border-zinc-100 dark:border-zinc-900">
                        {testimonial.status !== "approved" && (
                          <button
                            onClick={() => updateStatus(testimonial.id, "approved")}
                            className="flex-1 md:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white text-xs font-mono font-bold uppercase transition-all"
                            title="Approve Review"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}
                        {testimonial.status !== "rejected" && (
                          <button
                            onClick={() => updateStatus(testimonial.id, "rejected")}
                            className="flex-1 md:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 text-xs font-mono font-bold uppercase transition-all"
                            title="Reject Review"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                        <button
                          onClick={() => deleteTestimonial(testimonial.id)}
                          className="px-4 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white text-xs font-mono font-bold uppercase transition-all flex items-center justify-center"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Setup, Instructions & Debug logs side rail (1 col) */}
          <div className="space-y-6">
            
            {/* System Console Logs */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 font-mono text-[11px] text-zinc-400 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Administrative Console</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed text-left text-orange-500/90 dark:text-amber-400/80">
                {systemLog}
              </pre>
            </div>

            {/* Real SQL setup guide */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-900 space-y-4 text-left">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-orange-500" />
                <h3 className="font-display font-bold text-sm tracking-tight">Postgres Migration Setup</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                To migrate from the local mockup to a live Supabase project, execute this SQL script inside your Supabase SQL Editor.
              </p>

              <button
                onClick={copySqlToClipboard}
                className={`w-full px-4 py-2.5 rounded-xl font-mono text-[11px] font-bold uppercase transition-all flex items-center justify-center space-x-2 border ${
                  copiedSql
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                    : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied Migration!</span>
                  </>
                ) : (
                  <>
                    <span>Copy SQL Migration</span>
                  </>
                )}
              </button>

              <div className="space-y-1 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200/50 dark:border-zinc-800">
                <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Required Keys</span>
                <span className="block text-[10px] font-mono text-zinc-400">NEXT_PUBLIC_SUPABASE_URL</span>
                <span className="block text-[10px] font-mono text-zinc-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
