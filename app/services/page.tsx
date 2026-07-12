"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { servicesData } from "@/lib/services-data";
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
  ChevronRight,
  ArrowRight
} from "lucide-react";

export default function ServicesPage() {
  const getServiceIcon = (slug: string) => {
    switch (slug) {
      case "ai-video-advertisements": return <Video className="w-5 h-5 text-indigo-500" />;
      case "ai-product-commercials": return <Tv className="w-5 h-5 text-indigo-500" />;
      case "tribute-videos": return <Heart className="w-5 h-5 text-red-500" />;
      case "poster-designing": return <FileImage className="w-5 h-5 text-indigo-500" />;
      case "graphic-designing": return <Palette className="w-5 h-5 text-indigo-500" />;
      case "website-development": return <Globe className="w-5 h-5 text-indigo-500" />;
      case "mobile-app-development": return <Smartphone className="w-5 h-5 text-indigo-500" />;
      case "ai-automation": return <Cpu className="w-5 h-5 text-indigo-500" />;
      case "whatsapp-automation": return <MessageSquare className="w-5 h-5 text-emerald-500" />;
      case "branding": return <Sparkles className="w-5 h-5 text-amber-500" />;
      case "digital-marketing": return <TrendingUp className="w-5 h-5 text-indigo-500" />;
      case "social-media-management": return <Share2 className="w-5 h-5 text-indigo-500" />;
      case "business-automation": return <Workflow className="w-5 h-5 text-indigo-500" />;
      case "custom-software-development": return <Settings className="w-5 h-5 text-indigo-500" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col relative">
      <Navbar />

      {/* Grid Overlay background */}
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      {/* Hero Header */}
      <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto text-left w-full">
        <div className="max-w-2xl flex flex-col space-y-4">
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
            NSD Creations marries high-end aesthetic storytelling with robust, hand-coded software development and efficient AI automations. Select any of our 14 master services below to view detailed benefits, pricing criteria, technologies, and exact deliverables.
          </p>
        </div>
      </section>

      {/* Categories Showcase Group */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.values(servicesData).map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group p-6 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                  {getServiceIcon(service.slug)}
                </div>
                <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">
                  {service.category}
                </div>
                <h3 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900/80 flex items-center text-xs font-semibold text-indigo-500 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                Read specs & deliverables
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <div className="p-8 md:p-12 rounded-3xl bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 dark:border-indigo-400/10 shadow-sm flex flex-col items-center">
          <h2 className="font-display font-bold text-2xl text-zinc-900 dark:text-zinc-50">Need a bespoke package?</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3 max-w-xl">
            We understand every business operates on a unique model. Contact us directly to configure a custom multi-service retainer or long-term software support contract.
          </p>
          <a
            href="https://tinyurl.com/startwithNSD"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg active:scale-95 transition-all text-center"
          >
            Start Your Custom Quote
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
