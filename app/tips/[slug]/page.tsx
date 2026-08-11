"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Testimonials } from "@/components/Testimonials";
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  ArrowRight, 
  Lightbulb, 
  Target, 
  Settings, 
  AlertTriangle,
  Share2,
  Check,
  Instagram,
  MessageSquare
} from "lucide-react";
import { tipsData } from "@/lib/tips-data";

export default function TipDetailsPage({ params }: { params: { slug: string } }) {
  const [copied, setCopied] = useState(false);
  const tip = tipsData.find((t) => t.slug === params.slug);

  if (!tip) {
    notFound();
  }

  const whatsappMessage = encodeURIComponent(
    `Hi, I have seen this tip "${tip.title}" and I have found it useful. Thank you NSD Creations.`
  );
  const whatsappLink = `https://wa.me/916303849852?text=${whatsappMessage}`;

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({
            title: tip.title,
            text: tip.excerpt,
            url: url,
          });
          return;
        } catch (e) {
          // Fallback to clipboard
        }
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar />

      <section className="pt-32 pb-16 relative">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-indigo-900/20 to-black pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            
            {/* Top Bar: Back Link & Share Option */}
            <div className="flex items-center justify-between mb-8">
              <Link 
                href="/tips" 
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to all 50 strategies
              </Link>

              <button
                onClick={handleShare}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-xs font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{copied ? "Link Copied!" : "Share Tip"}</span>
              </button>
            </div>

            <ScrollReveal>
              <div className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-6">
                {tip.category} Strategy
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {tip.title}
              </h1>
              
              <p className="text-lg md:text-2xl text-gray-300 font-light mb-12 leading-relaxed border-l-4 border-indigo-500 pl-6">
                {tip.excerpt}
              </p>
            </ScrollReveal>

            {/* Structured Content Sections */}
            <div className="space-y-10 mb-16">
              
              {/* Section 1: Simple Explanation */}
              <ScrollReveal delay={100}>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Lightbulb className="w-24 h-24 text-indigo-400" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold mb-4 text-indigo-300 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 mr-3 inline-block" />
                    The Concept, Explained Simply
                  </h2>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed relative z-10">
                    {tip.simpleExplanation}
                  </p>
                </div>
              </ScrollReveal>

              {/* Section 2: Why it Matters */}
              <ScrollReveal delay={200}>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target className="w-24 h-24 text-indigo-400" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold mb-4 text-indigo-300 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 mr-3 inline-block" />
                    Why It Matters For Your Business
                  </h2>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed relative z-10">
                    {tip.whyItMatters}
                  </p>
                </div>
              </ScrollReveal>

              {/* Section 3: How it Works */}
              <ScrollReveal delay={300}>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Settings className="w-24 h-24 text-indigo-400" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold mb-4 text-indigo-300 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 mr-3 inline-block" />
                    How It Works In Practice
                  </h2>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed relative z-10">
                    {tip.howItWorks}
                  </p>
                </div>
              </ScrollReveal>

              {/* Section 4: The Hard Reality */}
              <ScrollReveal delay={400}>
                <div className="bg-gradient-to-br from-red-950/40 to-black border border-red-500/20 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <AlertTriangle className="w-32 h-32 text-red-500" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold mb-4 text-red-400 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-400 mr-3 inline-block" />
                    The Brutal Truth
                  </h2>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed relative z-10 font-medium">
                    {tip.theHardReality}
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Credentials & 3 Side-By-Side Action Buttons Section */}
            <ScrollReveal delay={500}>
              <div className="bg-gradient-to-b from-indigo-950/40 via-white/5 to-black border border-indigo-500/30 p-8 md:p-12 rounded-3xl backdrop-blur-xl relative overflow-hidden my-16">
                
                {/* Header & Logo */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                      // Partner With NSD Creations
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold">Let Our Experts Handle This Strategy</h3>
                  </div>

                  <div className="flex items-center space-x-6 shrink-0">
                    <a href="tel:+916303849852" className="flex items-center text-sm font-semibold text-gray-300 hover:text-indigo-400 transition-colors">
                      <Phone className="w-4 h-4 mr-2.5 text-indigo-400" />
                      +91 63038 49852
                    </a>
                    
                    <a href="mailto:nsd.creations.official@gmail.com" className="hidden sm:flex items-center text-sm font-semibold text-gray-300 hover:text-indigo-400 transition-colors">
                      <Mail className="w-4 h-4 mr-2.5 text-indigo-400" />
                      nsd.creations.official@gmail.com
                    </a>
                  </div>
                </div>

                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-3xl">
                  Don't waste months trying to master this yourself. Collaborate directly with NSD Creations to get custom software engineering, AI video production, and high-conversion branding executed seamlessly.
                </p>

                {/* 3 Side-By-Side Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Button 1: WhatsApp */}
                  <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center py-4 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-[#25D366]/20 hover:scale-[1.02]"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat on WhatsApp
                  </a>

                  {/* Button 2: Book Free Consultation */}
                  <Link 
                    href="/contact" 
                    className="flex items-center justify-center py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 hover:scale-[1.02]"
                  >
                    Book Free Consultation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>

                  {/* Button 3: Follow on Instagram */}
                  <a 
                    href="https://instagram.com/nsdcreations" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-pink-500/20 hover:scale-[1.02]"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Follow Tips on Instagram
                  </a>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Review Submission Component */}
      <Testimonials />

      <Footer />
    </main>
  );
}
