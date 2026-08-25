"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowRight, TrendingUp, Briefcase, Code, Cpu, Award } from "lucide-react";
import { tipsData, Tip } from "@/lib/tips-data";

const categories = ["All", "Branding", "Marketing", "Development", "Automation", "Finance", "Operations"];

export default function TipsPage() {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState("All");
  const [showMore, setShowMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    if (pathname && pathname.startsWith("/tips/")) {
      const parts = pathname.split("/");
      if (parts.length >= 3) {
        const urlCat = parts[2].toLowerCase();
        const matchingCategory = categories.find(
          (c) => c.toLowerCase() === urlCat
        );
        if (matchingCategory) {
          setActiveCategory(matchingCategory);
        }
      }
    }
  }, [pathname]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setShowMore(false);
    setVisibleCount(12);
    
    // Update browser URL seamlessly without full page reload
    if (typeof window !== "undefined") {
      const newPath = category === "All" ? "/tips" : `/tips/${category.toLowerCase()}`;
      window.history.pushState({}, "", newPath);
    }
  };

  const filteredTips = activeCategory === "All" 
    ? tipsData 
    : tipsData.filter(tip => tip.category.toLowerCase() === activeCategory.toLowerCase());

  const otherTips = activeCategory === "All"
    ? []
    : tipsData.filter(tip => tip.category.toLowerCase() !== activeCategory.toLowerCase());

  const getCategoryHero = (category: string) => {
    switch (category) {
      case "Branding":
        return {
          title: <>The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Visual Identity</span> Playbook.</>,
          subtitle: "Stop bleeding trust. Discover the rigorous design and messaging frameworks that turn chaotic businesses into premium, magnetic brands."
        };
      case "Marketing":
        return {
          title: <>The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Growth & Acquisition</span> Playbook.</>,
          subtitle: "Stop guessing with your ad budget. Execute the exact omnipresent, data-driven marketing systems used to scale modern digital empires."
        };
      case "Development":
        return {
          title: <>The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Software Engineering</span> Playbook.</>,
          subtitle: "Friction kills conversions. Learn the elite technical standards required to build lightning-fast, highly scalable web applications."
        };
      case "Automation":
        return {
          title: <>The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Business Automation</span> Playbook.</>,
          subtitle: "Manual work is for amateurs. Discover how AI and custom automation workflows can reclaim 1,000+ hours of your team's time."
        };
      case "Finance":
        return {
          title: <>The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Financial Scale</span> Playbook.</>,
          subtitle: "Cash flow is oxygen. Understand the rigid financial systems, pricing models, and tracking required to build an 8-figure valuation."
        };
      case "Operations":
        return {
          title: <>The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Operational Excellence</span> Playbook.</>,
          subtitle: "Growth breaks weak systems. Learn how to architect bulletproof SOPs, elite remote cultures, and scalable daily operations."
        };
      default:
        return {
          title: <>The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">50 Pillars</span> of Modern Business Scale.</>,
          subtitle: "Executing these strategies requires elite technical, creative, and operational expertise. Discover what it takes to build a market leader."
        };
    }
  };

  const currentHero = getCategoryHero(activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Branding": return <Award className="w-5 h-5 text-indigo-400" />;
      case "Marketing": return <TrendingUp className="w-5 h-5 text-indigo-400" />;
      case "Development": return <Code className="w-5 h-5 text-indigo-400" />;
      case "Automation": return <Cpu className="w-5 h-5 text-indigo-400" />;
      case "Finance": return <Briefcase className="w-5 h-5 text-indigo-400" />;
      case "Operations": return <Briefcase className="w-5 h-5 text-indigo-400" />;
      default: return <Award className="w-5 h-5 text-indigo-400" />;
    }
  };

  const ctaBlock = (
    <div className="bg-gradient-to-r from-indigo-950/80 via-purple-950/40 to-black border border-indigo-500/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="relative z-10 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider mb-4">
          Need Execution Support?
        </span>
        <h3 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">Overwhelmed by the complexity?</h3>
        <p className="text-gray-300 mb-8 text-base md:text-lg leading-relaxed">
          Executing these 50 pillars requires an entire team of elite developers, marketers, and strategists. Stop trying to do it all yourself. Let NSD Creations engineer your growth.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/contact" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all w-full sm:w-auto text-center shadow-lg shadow-indigo-500/25">
            Book a Free Consultation
          </Link>
          <a href="https://wa.me/916303849852" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-semibold transition-all w-full sm:w-auto text-center flex items-center justify-center shadow-lg shadow-emerald-500/20">
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );

  const isTipHighlighted = (tip: Tip, index: number) => {
    // Highlight every 4th card or key flagship tips
    return index % 4 === 0 || tip.id === 1 || tip.id === 11 || tip.id === 21 || tip.id === 31 || tip.id === 44;
  };

  const TipCard = ({ tip, index }: { tip: Tip, index: number }) => {
    const highlighted = isTipHighlighted(tip, index);
    const tipUrl = `/tips/${tip.category.toLowerCase()}/${tip.slug}`;

    return (
      <ScrollReveal delay={(index % 3) * 0.1}>
        <Link href={tipUrl} className="block group h-full">
          <div 
            className={`rounded-2xl h-full transition-all duration-500 flex flex-col relative overflow-hidden ${
              highlighted
                ? "bg-gradient-to-b from-indigo-950/40 via-white/5 to-black border border-indigo-500/40 hover:border-indigo-400 p-8 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.01]"
                : "bg-white/5 border border-white/10 p-8 hover:bg-white/10 hover:border-indigo-500/30"
            }`}
          >
            {highlighted && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"></div>
            )}

            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110">
              {getCategoryIcon(tip.category)}
            </div>
            
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold">
                {getCategoryIcon(tip.category)}
                <span>{tip.category}</span>
              </div>

              {highlighted && (
                <div className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                  <Award className="w-3 h-3" />
                  <span>High Impact</span>
                </div>
              )}
            </div>
            
            <h3 className={`text-xl md:text-2xl font-bold mb-4 transition-colors ${highlighted ? "text-white group-hover:text-indigo-300" : "group-hover:text-indigo-300"}`}>
              {tip.title}
            </h3>
            
            <p className="text-gray-400 mb-8 flex-grow line-clamp-3 leading-relaxed text-sm md:text-base">
              {tip.excerpt}
            </p>
            
            <div className="flex items-center text-indigo-400 font-medium group-hover:text-indigo-300 mt-auto pt-4 border-t border-white/5">
              <span>Read full strategy</span>
              <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </Link>
      </ScrollReveal>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black"></div>
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-6">
                Actionable Playbooks
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                {currentHero.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                {currentHero.subtitle}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="border-y border-white/10 sticky top-20 z-30 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 overflow-x-auto no-scrollbar">
          <div className="flex space-x-2 md:justify-center min-w-max">
            {categories.map((category) => {
              const isSelected = activeCategory.toLowerCase() === category.toLowerCase();
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tips Grid Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCategory === "All" 
              ? filteredTips.slice(0, visibleCount).map((tip, index) => (
                  <React.Fragment key={tip.id}>
                    <TipCard tip={tip} index={index} />
                    
                    {/* Insert Strategic CTA after every 12th tip in "All" view */}
                    {(index + 1) % 12 === 0 && (
                      <ScrollReveal className="md:col-span-2 lg:col-span-3 my-6">
                        {ctaBlock}
                      </ScrollReveal>
                    )}
                  </React.Fragment>
                ))
              : filteredTips.map((tip, index) => (
                  <TipCard key={tip.id} tip={tip} index={index} />
                ))
            }
          </div>

          {/* Load More Button for "All" Filter */}
          {activeCategory === "All" && visibleCount < filteredTips.length && (
            <div className="flex justify-center mt-16">
              <button 
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="px-10 py-5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-white rounded-full font-bold transition-all duration-300 flex items-center space-x-3 shadow-xl hover:scale-105"
              >
                <span>Load More Tips</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* CTA & More Tips Expansion for Category Filter */}
          {activeCategory !== "All" && (
            <div className="mt-16 space-y-16">
              <ScrollReveal>
                {ctaBlock}
              </ScrollReveal>
              
              {!showMore ? (
                <div className="flex justify-center pt-4">
                  <button 
                    onClick={() => setShowMore(true)}
                    className="px-10 py-5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-white rounded-full font-bold transition-all duration-300 flex items-center space-x-3 shadow-xl hover:scale-105"
                  >
                    <span>More Tips Across Other Categories</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="pt-12 border-t border-white/10 space-y-12">
                  <div className="text-center max-w-2xl mx-auto">
                    <h3 className="text-3xl font-bold mb-3">More Strategies to Explore</h3>
                    <p className="text-gray-400">Discover pillars from other key operational areas to complete your growth stack.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherTips.map((tip, index) => (
                      <TipCard key={tip.id} tip={tip} index={index} />
                    ))}
                  </div>

                  <ScrollReveal>
                    {ctaBlock}
                  </ScrollReveal>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}

