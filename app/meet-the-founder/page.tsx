"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageWithNSDFallback } from "@/components/ImageWithNSDFallback";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Calendar, 
  Award, 
  Users, 
  MapPin, 
  Quote,
  Code,
  Cpu,
  Palette,
  Video,
  Settings,
  Heart,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { motion } from "motion/react";

export default function MeetTheFounder() {
  const journeyTimeline = [
    {
      year: "2022",
      title: "The Genesis",
      description: "Started creating promotional and marketing videos for my mother's business, Keerthy's Daycare & Kindergarten. Discovered a deep passion for digital storytelling and creative marketing design."
    },
    {
      year: "2022 - Mid",
      title: "The Realization",
      description: "After seeing the incredible results, my mother encouraged me to help other businesses that could not afford expensive marketing agencies. This became the inspiring foundation of NSD Creations."
    },
    {
      year: "2023",
      title: "Founding NSD Creations",
      description: "Officially launched NSD Creations. Expanded operations beyond promotional videos into other creative visual services, branding systems, and professional poster styling."
    },
    {
      year: "2024",
      title: "The Technology & Sector Shift",
      description: "Began working with clients across different industries—including nutrition, wellness, AI memorial tribute videos, branding, custom Next.js websites, AI automation, and digital marketing."
    },
    {
      year: "Today",
      title: "Building the Future",
      description: "Actively scaling NSD Creations, delivering hand-crafted digital assets and custom automations for over 30+ happy clients while ensuring every project receives my direct, premium attention."
    }
  ];

  const skillSets = [
    { name: "Website Development", icon: <Code className="w-4 h-4 text-indigo-500" /> },
    { name: "AI Automation", icon: <Cpu className="w-4 h-4 text-indigo-500" /> },
    { name: "Brand Identity", icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { name: "Graphic Design", icon: <Palette className="w-4 h-4 text-indigo-500" /> },
    { name: "Video Production", icon: <Video className="w-4 h-4 text-indigo-500" /> },
    { name: "Business Strategy", icon: <Settings className="w-4 h-4 text-indigo-500" /> },
    { name: "UI/UX Architecture", icon: <Palette className="w-4 h-4 text-indigo-500" /> },
    { name: "Digital Marketing", icon: <Users className="w-4 h-4 text-indigo-500" /> }
  ];

  const bentoValues = [
    {
      title: "Creative Thinking",
      desc: "Every campaign, video script, or layout grid starts with extensive visual ideation. No boilerplate templates—we custom craft your brand voice.",
      size: "col-span-1 md:col-span-2"
    },
    {
      title: "Modern Technology",
      desc: "We deploy bleeding-edge Next.js 15, React 19, and tailored generative AI visual structures to stay five steps ahead of standard software.",
      size: "col-span-1"
    },
    {
      title: "Affordable Solutions",
      desc: "By substituting heavy manual agency overheads with efficient AI pipelines, we deliver enterprise-grade finishes at fractional rates.",
      size: "col-span-1"
    },
    {
      title: "Fast Delivery",
      desc: "Our agile execution methodology ensures high-quality poster design drafts in 24 hours, and custom web launches in a few days.",
      size: "col-span-1 md:col-span-2"
    },
    {
      title: "Long-Term Support",
      desc: "We build long-term advisory partnerships with all our clients, offering operational support, sitemap updates, and technical maintenance.",
      size: "col-span-1"
    },
    {
      title: "Personal Attention",
      desc: "When you hire NSD Creations, you work directly with me. Your project receives custom care, detailed revisions, and dedicated focus.",
      size: "col-span-1"
    }
  ];

  return (
    <div className="flex-1 flex flex-col relative">
      <Navbar />

      {/* Grid Overlay background */}
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      {/* Ambient glowing orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Hero Header */}
      <section className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left portrait container with premium styling */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[390px] aspect-[4/5] rounded-3xl p-3 glass-card shadow-2xl group overflow-hidden">
              {/* Purple glowing beam */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-900/50">
                <ImageWithNSDFallback
                  src="/images/founder.png"
                  alt="Sai Dheeraj Nalkari Portrait"
                  className="w-full h-full group-hover:scale-104 group-hover:rotate-1 transition-all duration-700 ease-out"
                  fill
                />
              </div>
            </div>
          </div>

          {/* Right Header Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-500/5 dark:bg-purple-400/5 border border-purple-500/10 dark:border-purple-400/10 self-start">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase">
                MEET THE FOUNDER
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
              Sai Dheeraj Nalkari
            </h1>
            <p className="text-indigo-600 dark:text-indigo-400 font-mono text-sm uppercase tracking-widest font-bold -mt-3">
              Founder of NSD Creations &bull; Creative Technologist &bull; AI Solutions Specialist
            </p>

            <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
              I am building NSD Creations with a singular vision: to bridge the gap between high-end digital design, custom code, and smart automation pipelines for startups and growing local brands. Every project we onboard is engineered to impress, convert, and drive lasting commercial value.
            </p>

            {/* Premium Stat Cards Box */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-900/50">
                <Calendar className="w-5 h-5 text-indigo-500 mb-2" />
                <p className="text-[10px] font-mono text-zinc-400 uppercase">Since</p>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">2022</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-900/50">
                <Award className="w-5 h-5 text-indigo-500 mb-2" />
                <p className="text-[10px] font-mono text-zinc-400 uppercase">Delivered</p>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">20+ Projects</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-900/50">
                <Users className="w-5 h-5 text-indigo-500 mb-2" />
                <p className="text-[10px] font-mono text-zinc-400 uppercase">Clients</p>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">30+ Happy</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-900/50">
                <MapPin className="w-5 h-5 text-indigo-500 mb-2" />
                <p className="text-[10px] font-mono text-zinc-400 uppercase">Location</p>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">Hyderabad, IN</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="https://tinyurl.com/startwithNSD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/10 active:scale-95 transition-all text-center"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 active:scale-95 transition-all text-center"
              >
                View Portfolio
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Philosophy Quote Section */}
      <section className="py-20 px-6 bg-zinc-50 dark:bg-[#09090b]/40 border-y border-zinc-200/50 dark:border-zinc-900/50">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center space-y-4">
          <Quote className="w-10 h-10 text-indigo-500/20 dark:text-indigo-400/20" />
          <h2 className="font-display font-medium text-xl md:text-2xl text-zinc-800 dark:text-zinc-200 italic leading-relaxed max-w-3xl">
            &quot;I believe every business deserves world-class digital experiences and high-end creative storytelling, regardless of its size or current scale.&quot;
          </h2>
          <span className="text-xs font-mono tracking-wider text-indigo-500 uppercase font-bold mt-4">&mdash; Sai Dheeraj Nalkari</span>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="flex flex-col space-y-12">
          <div className="text-left flex flex-col space-y-2">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">My Story</span>
            <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-zinc-50 tracking-tight">The Entrepreneurial Journey</h2>
          </div>

          <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-3 md:ml-6 pl-6 md:pl-10 space-y-12 py-4">
            {journeyTimeline.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Node indicator */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white dark:border-[#030303] shadow-md" />
                
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-400/5 px-2.5 py-1 rounded-md border border-indigo-500/10 dark:border-indigo-400/10">
                  {item.year}
                </span>
                <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 mt-3 mb-1.5">{item.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed max-w-2xl">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision double cards */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 dark:border-indigo-400/10 flex items-center justify-center text-indigo-500 mb-6">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-50">My Personal Mission</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed mt-3">
                To hand over standard-setting digital assets to local shops and early-stage entrepreneurs, democratizing custom development architectures and professional automated workflows to enhance business efficiency without enterprise-tier budgeting boundaries.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 dark:border-indigo-400/10 flex items-center justify-center text-indigo-500 mb-6">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-50">My Core Vision</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed mt-3">
                To scale NSD Creations into one of India&apos;s most highly trusted digital agencies—known for reliable execution speed, absolute financial transparency, and delivering robust, customized client software services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Animated Grid */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-[#050505]/40 border-t border-zinc-200/50 dark:border-zinc-900/50">
        <div className="max-w-7xl mx-auto flex flex-col space-y-12">
          <div className="text-center flex flex-col space-y-2">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">Core Foundations</span>
            <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-zinc-50 tracking-tight">Our Operational Principles</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {["Creativity", "Innovation", "Transparency", "Quality", "Continuous Learning", "Client Satisfaction", "Modern Tech"].map((val) => (
              <div
                key={val}
                className="p-4 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-900 shadow-sm text-center flex flex-col items-center justify-center"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/5 dark:bg-indigo-400/5 flex items-center justify-center text-indigo-500 mb-3">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="font-display font-bold text-xs text-zinc-900 dark:text-zinc-100">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col space-y-12">
          <div className="text-left flex flex-col space-y-2">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">Technical Prowess</span>
            <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-zinc-50 tracking-tight">Handcrafted Skills Set</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {skillSets.map((skill) => (
              <div
                key={skill.name}
                className="p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 shadow-sm flex items-center space-x-3"
              >
                <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                  {skill.icon}
                </div>
                <span className="text-xs md:text-sm font-semibold text-zinc-800 dark:text-zinc-200">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid - Why NSD Creations */}
      <section className="py-24 px-6 bg-zinc-50/50 dark:bg-[#030303]/40 border-t border-zinc-200/50 dark:border-zinc-900/50">
        <div className="max-w-7xl mx-auto flex flex-col space-y-12">
          <div className="text-left flex flex-col space-y-2">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">Why Choose Me</span>
            <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-zinc-50 tracking-tight">The Bento Grid of Client Value</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bentoValues.map((b, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 shadow-sm flex flex-col justify-between ${b.size}`}
              >
                <div>
                  <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-2">{b.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">{b.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900/60 text-xs font-mono text-indigo-500 dark:text-indigo-400 font-bold">
                  PROVEN OUTCOME &bull; VALUE
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Message */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-left">
        <div className="p-8 md:p-12 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <h3 className="font-display font-bold text-2xl text-zinc-900 dark:text-zinc-50 mb-4">Let&apos;s Build Something Extraordinary Together.</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed mb-6">
            Every business has a narrative that deserves to be heard, and every product has details that deserve to be beautifully presented. By hiring NSD Creations, you secure absolute creative devotion, optimized code architectures, and my 100% focused attention.
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed font-semibold italic">
            If you have an idea, let&apos;s turn it into something remarkable.
          </p>
        </div>
      </section>

      {/* Large CTA Section */}
      <section className="py-20 px-6 border-t border-zinc-200/50 dark:border-zinc-900/50 bg-gradient-to-br from-indigo-900/10 via-[#030303] to-[#030303]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center space-y-6">
          <span className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
            Secure Partnership
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-900 dark:text-white tracking-tight">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">
            Let&apos;s hop on a brief audio call or WhatsApp chat to discuss your customized quote deliverables. No pressure, just raw digital planning.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <a
              href="https://tinyurl.com/startwithNSD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/10 active:scale-95 transition-all text-center"
            >
              Book a Free Consultation
            </a>
            <Link
              href="https://wa.me/916303849852?text=Hello%20Sai%20Dheeraj!%20I%20saw%20your%20Meet%20the%20Founder%20page%20and%20want%20to%20start%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg active:scale-95 transition-all text-center"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              WhatsApp Me
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
