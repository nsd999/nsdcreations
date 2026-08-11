"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowRight, Sparkles, TrendingUp, Briefcase, Code, Cpu } from "lucide-react";
import { tipsData } from "@/lib/tips-data";

const categories = ["All", "Branding", "Marketing", "Development", "Automation", "Finance", "Operations"];

export default function TipsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTips = activeCategory === "All" 
    ? tipsData 
    : tipsData.filter(tip => tip.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Branding": return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case "Marketing": return <TrendingUp className="w-5 h-5 text-indigo-400" />;
      case "Development": return <Code className="w-5 h-5 text-indigo-400" />;
      case "Automation": return <Cpu className="w-5 h-5 text-indigo-400" />;
      case "Finance": return <Briefcase className="w-5 h-5 text-indigo-400" />;
      case "Operations": return <Briefcase className="w-5 h-5 text-indigo-400" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black"></div>
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">50 Pillars</span> of Modern Business Scale.
              </h1>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                Executing these strategies requires elite technical, creative, and operational expertise. Discover what it takes to build a market leader.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="border-b border-white/10 sticky top-20 bg-black/80 backdrop-blur-md z-40">
        <div className="container mx-auto px-4 py-4 overflow-x-auto no-scrollbar">
          <div className="flex space-x-2 md:justify-center min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-indigo-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTips.map((tip, index) => (
              <React.Fragment key={tip.id}>
                <ScrollReveal delay={index % 3 * 100}>
                  <Link href={`/tips/${tip.slug}`} className="block group h-full">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full transition-all duration-500 hover:bg-white/10 hover:border-indigo-500/50 flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110">
                        {getCategoryIcon(tip.category)}
                      </div>
                      
                      <div className="inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold mb-6 w-fit">
                        {getCategoryIcon(tip.category)}
                        <span>{tip.category}</span>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-bold mb-4 group-hover:text-indigo-300 transition-colors">
                        {tip.title}
                      </h3>
                      
                      <p className="text-gray-400 mb-8 flex-grow line-clamp-3">
                        {tip.excerpt}
                      </p>
                      
                      <div className="flex items-center text-indigo-400 font-medium group-hover:text-indigo-300 mt-auto">
                        <span>Read full strategy</span>
                        <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>

                {/* Insert Strategic CTA after every 9th tip in "All" view */}
                {activeCategory === "All" && (index + 1) % 9 === 0 && (
                  <ScrollReveal className="md:col-span-2 lg:col-span-3 my-8">
                    <div className="bg-gradient-to-r from-indigo-900/50 to-black border border-indigo-500/30 rounded-3xl p-10 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                      <h3 className="text-3xl font-bold mb-4 relative z-10">Overwhelmed by the complexity?</h3>
                      <p className="text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">
                        Implementing these 50 pillars requires an entire team of elite developers, marketers, and strategists. Stop trying to do it all yourself. Let NSD Creations engineer your growth.
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
                        <Link href="/contact" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all w-full sm:w-auto text-center">
                          Book a Free Consultation
                        </Link>
                        <a href="https://wa.me/916303849852" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-semibold transition-all w-full sm:w-auto text-center flex items-center justify-center">
                          Chat on WhatsApp
                        </a>
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
