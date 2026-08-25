"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { servicesData, ServiceDetail } from "@/lib/services-data";
import { ScrollReveal } from "@/components/ScrollReveal";
import { 
  Video, 
  Tv, 
  Heart, 
  FileImage, 
  Palette, 
  Globe, 
  Smartphone, 
  Cpu, 
  MessageSquare, 
  Sparkles, 
  TrendingUp, 
  Share2, 
  Settings, 
  Workflow, 
  ArrowRight,
  Search,
} from "lucide-react";

const CATEGORIES = ["All", "Creative", "Branding", "Marketing", "Automation", "Technology"];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "video": return <Video className="w-5 h-5 text-indigo-500" />;
      case "tv": return <Tv className="w-5 h-5 text-indigo-500" />;
      case "heart": return <Heart className="w-5 h-5 text-red-500" />;
      case "image": return <FileImage className="w-5 h-5 text-indigo-500" />;
      case "palette": return <Palette className="w-5 h-5 text-indigo-500" />;
      case "globe": return <Globe className="w-5 h-5 text-indigo-500" />;
      case "smartphone": return <Smartphone className="w-5 h-5 text-indigo-500" />;
      case "cpu": return <Cpu className="w-5 h-5 text-indigo-500" />;
      case "message-square": return <MessageSquare className="w-5 h-5 text-emerald-500" />;
      case "sparkles": return <Sparkles className="w-5 h-5 text-amber-500" />;
      case "trending-up": return <TrendingUp className="w-5 h-5 text-indigo-500" />;
      case "share": return <Share2 className="w-5 h-5 text-indigo-500" />;
      case "workflow": return <Workflow className="w-5 h-5 text-indigo-500" />;
      case "settings": return <Settings className="w-5 h-5 text-indigo-500" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  const filteredServices = useMemo(() => {
    let result = servicesData;

    if (activeCategory !== "All") {
      result = result.filter(s => {
        if (activeCategory === "Branding") return s.categoryGroup === "Brand & Marketing" && s.slug.includes("brand") || s.slug.includes("design");
        if (activeCategory === "Marketing") return s.categoryGroup === "Brand & Marketing" && !s.slug.includes("brand") && !s.slug.includes("design");
        return s.categoryGroup === activeCategory;
      });
      
      // Handle the split between Brand & Marketing as requested by the category filter labels
      if (activeCategory === "Branding") {
          result = servicesData.filter(s => s.slug === "branding-brand-identity" || s.slug === "poster-designing" || s.slug === "graphic-designing");
      }
      if (activeCategory === "Marketing") {
          result = servicesData.filter(s => s.slug === "social-media-management" || s.slug === "digital-marketing");
      }
      if (activeCategory === "Creative") {
          result = servicesData.filter(s => s.categoryGroup === "Creative");
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        s => s.name.toLowerCase().includes(q) || 
             s.shortDescription.toLowerCase().includes(q) || 
             s.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden">
      <Navbar />

      {/* Grid Overlay background */}
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      {/* Hero Header */}
      <section className="pt-24 pb-12 px-6 max-w-7xl mx-auto text-left w-full">
        <ScrollReveal direction="up" className="max-w-2xl flex flex-col space-y-4">
          <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">
            Our Digital Capabilities
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            Comprehensive Suite <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-500">
              of Creative & Tech Solutions.
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
            Explore our 16 specialized services across creative, branding, marketing, automation and technology.
          </p>
        </ScrollReveal>
      </section>

      {/* Search & Filters */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:pb-0 hide-scrollbar gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
                  activeCategory === category 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Showcase Group */}
      <section className="py-6 px-6 max-w-7xl mx-auto w-full min-h-[50vh]">
        {filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 dark:text-zinc-400">No services found matching your criteria.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
              className="mt-4 text-indigo-500 font-medium text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service, index) => (
              <ScrollReveal key={service.id} delay={(index % 8) * 0.04} direction="up">
                <div
                  className="group p-6 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:shadow-xl dark:hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-11 h-11 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <div className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1.5 font-bold">
                      {service.category}
                    </div>
                    <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                      {service.shortDescription}
                    </p>
                  </div>
                  <div className="relative z-10 mt-auto flex flex-col gap-2">
                    <Link
                      href={`/pricing/${service.slug}`}
                      className="flex items-center justify-center w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Explore Service
                    </Link>
                    <Link
                      href={`/pricing/${service.slug}`}
                      className="flex items-center justify-center w-full py-2.5 rounded-xl border border-indigo-500/20 hover:border-indigo-500/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      View Pricing
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* CTA Box */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <ScrollReveal direction="up" className="p-8 md:p-12 rounded-3xl bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 dark:border-indigo-400/10 shadow-sm flex flex-col items-center">
          <h2 className="font-display font-bold text-2xl text-zinc-900 dark:text-zinc-50">Want to see all plans at a glance?</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3 max-w-xl">
            Compare packages and find the perfect solution for your business on our centralized pricing page.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg active:scale-95 transition-all text-center"
            >
              View Full Pricing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <Footer />
    </div>
  );
}
