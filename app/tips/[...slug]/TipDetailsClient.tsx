"use client";

import React, { useState } from "react";
import Link from "next/link";
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

export default function TipDetailsClient({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const tip = tipsData.find((t) => t.slug === slug);

  if (!tip) {
    return null;
  }

  const relatedTips = tipsData
    .filter((t) => t.category === tip.category && t.slug !== tip.slug)
    .slice(0, 3);

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

  const categorySlug = tip.category.toLowerCase();

  return (
    <main className="min-h-screen bg-transparent dark:bg-black text-zinc-900 dark:text-white selection:bg-indigo-500/30">
      <Navbar />

      <section className="pt-32 pb-16 relative">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-indigo-100/50 to-transparent dark:from-indigo-900/20 dark:to-black pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            
            {/* Top Bar: Back Link & Share Option */}
            <div className="flex items-center justify-between mb-8">
              <Link 
                href={`/tips/${categorySlug}`}
                className="inline-flex items-center text-zinc-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {tip.category} strategies
              </Link>

              <button
                onClick={handleShare}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition-all text-xs font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                <span>{copied ? "Link Copied!" : "Share Tip"}</span>
              </button>
            </div>

            <ScrollReveal>
              <div className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-6">
                {tip.category} Strategy
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-zinc-900 dark:text-white">
                {tip.title}
              </h1>
              
              <p className="text-lg md:text-2xl text-zinc-700 dark:text-gray-300 font-light mb-12 leading-relaxed border-l-4 border-indigo-500 pl-6">
                {tip.excerpt}
              </p>
            </ScrollReveal>

            {/* Blog-Style Content Sections */}
            <div className="space-y-12 mb-16">
              {tip.content.map((section, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    {section.heading && (
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-300 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 mr-4 inline-block" />
                        {section.heading}
                      </h2>
                    )}
                    {Array.isArray(section.text) ? (
                      <div className="space-y-6 text-zinc-700 dark:text-gray-300 leading-relaxed text-lg">
                        {section.text.map((paragraph, pIndex) => (
                          <p key={pIndex}>{paragraph}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-700 dark:text-gray-300 leading-relaxed text-lg">
                        {section.text}
                      </p>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Credentials & 3 Side-By-Side Action Buttons Section */}
            <ScrollReveal delay={0.5}>
              <div className="bg-gradient-to-b from-indigo-50/50 via-white/40 to-transparent dark:from-indigo-950/40 dark:via-white/5 dark:to-black border border-indigo-200 dark:border-indigo-500/30 p-8 md:p-12 rounded-3xl backdrop-blur-xl relative overflow-hidden my-16 shadow-lg shadow-indigo-900/5">
                
                {/* Header & Logo */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-black/10 dark:border-white/10 pb-6">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1">
                      {"// Partner With NSD Creations"}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">Let Our Experts Handle This Strategy</h3>
                  </div>

                  <div className="flex items-center space-x-6 shrink-0">
                    <a href="tel:+916303849852" className="flex items-center text-sm font-semibold text-zinc-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <Phone className="w-4 h-4 mr-2.5 text-indigo-600 dark:text-indigo-400" />
                      +91 63038 49852
                    </a>
                    
                    <a href="mailto:nsd.creations.official@gmail.com" className="hidden sm:flex items-center text-sm font-semibold text-zinc-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <Mail className="w-4 h-4 mr-2.5 text-indigo-600 dark:text-indigo-400" />
                      nsd.creations.official@gmail.com
                    </a>
                  </div>
                </div>

                <p className="text-zinc-700 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-3xl">
                  Don&apos;t waste months trying to master this yourself. Collaborate directly with NSD Creations to get custom software engineering, AI video production, and high-conversion branding executed seamlessly.
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
                    href="https://instagram.com/nsd.creations.official" 
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

      {/* Related Tips List */}
      {relatedTips.length > 0 && (
        <section className="py-20 px-6 border-t border-zinc-200/50 dark:border-zinc-900/50 max-w-7xl mx-auto w-full">
          <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100 mb-6">
            Related Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTips.map((rel) => (
              <Link
                key={rel.slug}
                href={`/tips/${rel.category.toLowerCase()}/${rel.slug}`}
                className="group p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all flex flex-col justify-between h-full"
              >
                <div>
                  <h4 className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {rel.title}
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2">
                    {rel.excerpt}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 font-bold mt-4 block">
                  READ TIP &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Review Submission Component */}
      <Testimonials contextSlug={slug} />

      <Footer />
    </main>
  );
}
