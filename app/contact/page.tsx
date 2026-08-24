"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  Trash2,
  Zap,
  Star,
  Clock,
  TrendingUp,
  Users,
  Award,
  Activity,
  ChevronRight,
  Play,
  Shield,
  Flame,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ─── Psychology Engine Data ───────────────────────────────────────────────────

const recentActivity = [
  { name: "Rohan M.", service: "AI Video Advertisement", time: "3m ago", avatar: "RM", color: "from-indigo-500 to-purple-600" },
  { name: "Priya K.", service: "Brand Identity Creation", time: "11m ago", avatar: "PK", color: "from-rose-500 to-pink-600" },
  { name: "Arjun S.", service: "Website Development", time: "24m ago", avatar: "AS", color: "from-emerald-500 to-teal-600" },
  { name: "Neha T.", service: "WhatsApp Automation", time: "38m ago", avatar: "NT", color: "from-amber-500 to-orange-600" },
  { name: "Vikram B.", service: "Social Media Management", time: "52m ago", avatar: "VB", color: "from-sky-500 to-blue-600" },
  { name: "Sana R.", service: "AI Product Commercial", time: "1h ago", avatar: "SR", color: "from-violet-500 to-indigo-600" },
];

const trustReasons = [
  "100% satisfaction guarantee on every project",
  "Source files & full IP ownership delivered",
  "Dedicated founder-led communication, always",
  "Emergency revision support within 24 hours",
  "Zero hidden charges, ever",
];

const stats = [
  { label: "Projects Delivered", target: 500, suffix: "+", icon: <TrendingUp className="w-4 h-4" />, color: "text-indigo-500" },
  { label: "Happy Clients", target: 200, suffix: "+", icon: <Users className="w-4 h-4" />, color: "text-emerald-500" },
  { label: "Years of Excellence", target: 5, suffix: "+", icon: <Award className="w-4 h-4" />, color: "text-amber-500" },
  { label: "Avg. Response (hrs)", target: 2, suffix: "h", icon: <Clock className="w-4 h-4" />, color: "text-rose-500" },
];

// ─── Animated Counter Hook ─────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ─── Stats Counter Component ──────────────────────────────────────────────────
function StatCounter({ stat, animate }: { stat: typeof stats[0]; animate: boolean }) {
  const count = useCounter(stat.target, 2000, animate);
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/60 hover:border-indigo-500/30 transition-colors">
      <div className={`mb-1 ${stat.color}`}>{stat.icon}</div>
      <div className={`font-display font-black text-2xl ${stat.color}`}>
        {count}{stat.suffix}
      </div>
      <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider leading-tight mt-1">
        {stat.label}
      </div>
    </div>
  );
}

// ─── Activity Ticker Component ────────────────────────────────────────────────
function ActivityTicker() {
  const [current, setCurrent] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % recentActivity.length);
      setKey((k) => k + 1);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const item = recentActivity[current];

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3"
        >
          {/* Avatar */}
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md`}>
            {item.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {item.name} just submitted an inquiry
            </p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
              {item.service} · {item.time}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Slots Progress Bar ───────────────────────────────────────────────────────
function SlotsBar({ filled, total }: { filled: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full transition-all duration-500 ${
            i < filled
              ? "bg-gradient-to-r from-indigo-500 to-purple-500"
              : "bg-zinc-200 dark:bg-zinc-800"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    businessName: "",
    service: "website-development",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for stats counter trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setErrorMsg("Phone number must be exactly 10 digits");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit inquiry");
      setSubmitted(true);
      setFormData({ name: "", email: "", countryCode: "+91", phone: "", businessName: "", service: formData.service, message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/916303849852?text=${encodeURIComponent(
    `Hello Sai Dheeraj! I am submitting an inquiry. Name: ${formData.name || "Client"}, Service: ${formData.service}, Message: ${formData.message || "I'd like to discuss a project."}`
  )}`;

  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden">
      <Navbar />
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      {/* Hero Header */}
      <section className="pt-24 pb-12 px-6 max-w-7xl mx-auto w-full text-left">
        <ScrollReveal direction="up" className="max-w-2xl flex flex-col space-y-4">
          <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">
            Let&apos;s Construct Your Launch
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            Connect With Us <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-500">
              to Secure Your Custom Quote.
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
            Have an idea or operational block? Share details below to submit your request securely or initiate a direct chat session with Sai Dheeraj Nalkari immediately.
          </p>
        </ScrollReveal>
      </section>

      {/* Contact Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Contact Form Container (Left) */}
        <ScrollReveal direction="right" className="lg:col-span-7">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 shadow-sm relative">
            <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100 mb-6 flex items-center">
              <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
              Project Enquiry Form
            </h2>

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs md:text-sm font-semibold flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 shrink-0" />
                <span>Thank you! Your project request has been submitted successfully. We will reach out shortly.</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs md:text-sm font-semibold flex items-center">
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="mb-6 p-5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 dark:border-indigo-400/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Prefer our Express Booking?</h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Complete our official 1-minute Google Form instead.</p>
              </div>
              <a
                href="https://tinyurl.com/startwithNSD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4.5 py-2.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 shadow-md transition-all duration-200"
              >
                Go to Google Form &rarr;
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">Your Full Name *</label>
                  <input type="text" id="name" required value={formData.name} onChange={handleChange} placeholder="e.g. John Doe"
                    className="w-full px-4.5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900/60 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">Your Email Address *</label>
                  <input type="email" id="email" required value={formData.email} onChange={handleChange} placeholder="e.g. john@brand.com"
                    className="w-full px-4.5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900/60 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">Phone Number</label>
                  <div className="flex space-x-2">
                    <select id="countryCode" value={formData.countryCode} onChange={handleChange}
                      className="w-1/3 px-4.5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900/60 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500">
                      <option value="+91">+91 (IN)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+971">+971 (AE)</option>
                      <option value="+61">+61 (AU)</option>
                    </select>
                    <input type="text" id="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210"
                      className="w-2/3 px-4.5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900/60 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div>
                  <label htmlFor="businessName" className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">Company / Brand Name</label>
                  <input type="text" id="businessName" value={formData.businessName} onChange={handleChange} placeholder="e.g. Acme Corp"
                    className="w-full px-4.5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900/60 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">Service Required</label>
                <select id="service" value={formData.service} onChange={handleChange}
                  className="w-full px-4.5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900/60 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500">
                  <option value="website-development">Website Development (Next.js)</option>
                  <option value="ai-video-advertisements">AI Video Advertisements</option>
                  <option value="ai-product-commercials">AI Product Commercials</option>
                  <option value="tribute-videos">AI Memorial Tribute Videos</option>
                  <option value="poster-designing">Poster Designing</option>
                  <option value="graphic-designing">Graphic Designing</option>
                  <option value="mobile-app-development">Mobile App Development</option>
                  <option value="ai-automation">AI & Workflow Automation</option>
                  <option value="whatsapp-automation">WhatsApp Automation</option>
                  <option value="branding">Brand Identity Creation</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">Project Description *</label>
                <textarea id="message" required rows={4} value={formData.message} onChange={handleChange}
                  placeholder="Describe your design parameters, preferred scripts, or custom tech integrations..."
                  className="w-full px-4.5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900/60 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 resize-none" />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button type="submit" disabled={loading}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg active:scale-95 transition-all text-center">
                  {loading ? "Submitting..." : "Submit Inquiry"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg active:scale-95 transition-all text-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp Direct Chat
                </Link>
              </div>
            </form>
          </div>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════════════════
            RIGHT COLUMN — BRAIN PSYCHOLOGY ENGINE
            ─────────────────────────────────────────────────────
            Triggers: Social Proof · Scarcity · Live Presence
                      Variable Reward · Authority · Reciprocity
        ═══════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 flex flex-col space-y-4">

          {/* ① LIVE STUDIO STATUS — Presence & Trust Anchoring */}
          <ScrollReveal direction="left" delay={0.1}>
            <div className="relative p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200/50 dark:border-zinc-900/50 shadow-sm overflow-hidden">
              {/* Subtle gradient glow */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  {/* Pulsing live indicator */}
                  <div className="relative flex items-center justify-center w-3 h-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    Studio Live
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                  Active Now
                </span>
              </div>

              {/* Activity ticker */}
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/40">
                <p className="text-[10px] font-mono text-zinc-400 uppercase mb-2.5 tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3 h-3" />
                  Live Inquiry Feed
                </p>
                <ActivityTicker />
              </div>

              {/* Office Parameters */}
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-900 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-indigo-500">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-zinc-400 uppercase">Headquarters</p>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Hyderabad, Telangana, India</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-indigo-500">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-zinc-400 uppercase">Inquiries Email</p>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">nsd.creations.official@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-emerald-500">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-zinc-400 uppercase">Call / WhatsApp</p>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">+91 63038 49852</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ② SCARCITY ENGINE — Loss Aversion + FOMO */}
          <ScrollReveal direction="left" delay={0.15}>
            <div className="relative p-5 rounded-2xl overflow-hidden border border-amber-200/60 dark:border-amber-900/40 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">
                  Availability Status
                </span>
              </div>

              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                Only <span className="text-amber-600 dark:text-amber-400">3 Project Slots</span> left this month
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3">
                NSD Creations operates with a focused client roster for maximum quality.
              </p>

              <SlotsBar filled={5} total={8} />
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] font-mono text-zinc-500">5 slots taken</span>
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-500 font-bold">3 remaining</span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-amber-800 dark:text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                Next availability resets: 1st September
              </div>
            </div>
          </ScrollReveal>

          {/* ③ AUTHORITY STATS — Animated Counters (Dopamine Loop) */}
          <ScrollReveal direction="left" delay={0.2}>
            <div ref={statsRef} className="p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200/50 dark:border-zinc-900/50 shadow-sm">
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" />
                Studio Numbers
              </p>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, i) => (
                  <StatCounter key={i} stat={stat} animate={statsVisible} />
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ④ TRUST SHIELD — Reciprocity + Risk Reversal */}
          <ScrollReveal direction="left" delay={0.25}>
            <div className="relative p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200/50 dark:border-zinc-900/50 shadow-sm overflow-hidden">
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-widest">
                  NSD Promise
                </span>
              </div>

              <ul className="space-y-2.5">
                {trustReasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* ⑤ RESPONSE SPEED + SOCIAL RATING — Variable Reward */}
          <ScrollReveal direction="left" delay={0.3}>
            <div className="relative p-5 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 border border-indigo-500/30">
              {/* Glossy overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-white/90 ml-1.5">5.0 / 5.0</span>
                </div>

                <p className="text-white font-bold text-base leading-snug mb-1">
                  &ldquo;Best creative decision we made for our brand.&rdquo;
                </p>
                <p className="text-white/60 text-[11px] mb-4">
                  — Arun P., Founder, TechBridge India
                </p>

                {/* Response Promise */}
                <div className="flex items-center justify-between pt-3 border-t border-white/15">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-300" />
                    <div>
                      <p className="text-white text-[11px] font-bold">Average Response</p>
                      <p className="text-white/60 text-[10px]">Business hours</p>
                    </div>
                  </div>
                  <span className="font-display font-black text-2xl text-amber-300">&lt;2h</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ⑥ FREE OFFER — Reciprocity Trigger */}
          <ScrollReveal direction="left" delay={0.35}>
            <a
              href="https://wa.me/916303849852?text=Hi+Sai+Dheeraj!+I+would+like+to+book+a+free+strategy+call."
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 dark:bg-white border border-zinc-800 dark:border-zinc-200 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 dark:bg-zinc-900/10 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-all">
                <Play className="w-4 h-4 text-white dark:text-zinc-900 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white dark:text-zinc-900 group-hover:text-white uppercase tracking-wide">
                  Free 15-Min Strategy Call
                </p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-600 group-hover:text-white/70 mt-0.5">
                  No commitment · Talk to Sai Dheeraj directly
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </a>
          </ScrollReveal>

        </div>
        {/* ── END RIGHT COLUMN ── */}

      </section>

      <Footer />
    </div>
  );
}
