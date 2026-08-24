"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { servicesData } from "@/lib/services-data";
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
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Info
} from "lucide-react";

export default function PricingPage() {
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

  const groupedServices = useMemo(() => {
    const groups: Record<string, typeof servicesData> = {
      "Creative": [],
      "Brand & Marketing": [],
      "Automation": [],
      "Technology": []
    };
    
    servicesData.forEach(service => {
      if (groups[service.categoryGroup]) {
        groups[service.categoryGroup].push(service);
      } else {
        groups[service.categoryGroup] = [service];
      }
    });
    
    return groups;
  }, []);

  const categories = [
    { id: "Creative", title: "Creative Services", description: "High-impact visual content designed to capture attention and tell your story." },
    { id: "Brand & Marketing", title: "Brand & Marketing", description: "Strategic campaigns and brand identities built for modern digital landscapes." },
    { id: "Automation", title: "Automation", description: "Streamline operations and elevate customer experience with intelligent bots." },
    { id: "Technology", title: "Technology", description: "Scalable web and app solutions engineered for speed, security, and growth." }
  ];

  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden bg-[#FAFAFA] dark:bg-[#09090b]">
      <Navbar />

      {/* Grid Overlay background */}
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      {/* Hero Header */}
      <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto text-center w-full">
        <ScrollReveal direction="up" className="max-w-3xl mx-auto flex flex-col space-y-6 items-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-500/20">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Services & Pricing</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            Transparent Pricing.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-500">
              Serious Results.
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl">
            Explore our comprehensive suite of 16 specialized services. Find the perfect plan tailored to your business goals.
          </p>
          <div className="flex items-start max-w-md mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-left">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0 mr-3" />
            <p className="text-sm text-amber-800 dark:text-amber-400/90 leading-relaxed">
              <strong>Note:</strong> Final pricing depends on project scope, complexity, revisions, integrations, and delivery requirements. Custom enterprise plans available upon request.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Pricing Categories */}
      <section className="pb-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col space-y-24">
          {categories.map((category, catIndex) => {
            const services = groupedServices[category.id] || [];
            if (services.length === 0) return null;
            
            return (
              <div key={category.id} className="scroll-mt-32" id={`category-${category.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                <ScrollReveal direction="up" delay={0.1}>
                  <div className="flex flex-col items-center text-center mb-10">
                    <h2 className="font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-50 mb-4">{category.title}</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl">{category.description}</p>
                  </div>
                </ScrollReveal>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {services.map((service, index) => {
                    // Get lowest price from packages
                    const lowestPrice = Math.min(...service.packages.map(p => p.priceValue).filter(v => v !== null) as number[]);
                    const formattedPrice = lowestPrice === Infinity ? "Custom" : `₹${lowestPrice.toLocaleString('en-IN')}`;
                    const defaultPeriod = service.packages[0]?.pricePeriod || "project";
                    
                    return (
                      <ScrollReveal key={service.id} delay={(index % 4) * 0.1} direction="up">
                        <div className="group flex flex-col h-full bg-white dark:bg-[#0e0e11] rounded-3xl border border-zinc-200 dark:border-zinc-800/80 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden relative">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                {getServiceIcon(service.iconName)}
                              </div>
                            </div>
                            
                            <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100 mb-2">
                              {service.name}
                            </h3>
                            
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                              {service.shortDescription}
                            </p>
                            
                            <div className="mb-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Starting from</div>
                              <div className="flex items-baseline gap-2">
                                <span className="font-display font-bold text-3xl text-zinc-900 dark:text-white">
                                  {formattedPrice}
                                </span>
                                {formattedPrice !== "Custom" && (
                                  <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">/{defaultPeriod}</span>
                                )}
                              </div>
                            </div>
                            
                            <ul className="space-y-3 mb-8">
                              {service.packages[0]?.features.slice(0, 3).map((feature, i) => (
                                <li key={i} className="flex items-start text-sm text-zinc-600 dark:text-zinc-300">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                                  <span className="leading-tight">{feature}</span>
                                </li>
                              ))}
                              {service.packages[0]?.features.length > 3 && (
                                <li className="text-xs text-indigo-500 font-medium pl-7">
                                  + {service.packages[0].features.length - 3} more features in Base plan
                                </li>
                              )}
                            </ul>
                            
                            <Link 
                              href={`/pricing/${service.slug}`}
                              className="mt-auto w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-bold flex items-center justify-center transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500"
                            >
                              View Pricing Details
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Global CTA */}
      <section className="py-24 relative overflow-hidden bg-zinc-900 dark:bg-black border-t border-zinc-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[150%] bg-indigo-500/30 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[100%] bg-purple-500/30 blur-[120px] rounded-full mix-blend-screen" />
        </div>
        
        <div className="relative z-10 px-6 max-w-4xl mx-auto text-center">
          <ScrollReveal direction="up" className="flex flex-col items-center">
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-6">
              Need a Custom Solution?
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-2xl leading-relaxed">
              Looking for a tailored package or enterprise solution? Let&apos;s discuss your specific requirements and build a strategy that scales with you.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] transition-all active:scale-95"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all active:scale-95"
              >
                Browse All Services
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
