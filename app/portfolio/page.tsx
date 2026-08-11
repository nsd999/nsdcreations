"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageWithNSDFallback } from "@/components/ImageWithNSDFallback";
import { ScrollReveal } from "@/components/ScrollReveal";
import { 
  Sparkles, 
  ExternalLink, 
  ArrowRight,
  Heart,
  Globe,
  Tv,
  MessageSquare,
  Cpu,
  TrendingUp,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const portfolioWorks = [
    {
      id: 1,
      title: "Keerthy's Daycare & Kindergarten Promotional Video",
      category: "video",
      client: "Keerthy's Daycare & Kindergarten",
      type: "Promotional & Marketing Videos",
      image: "/portfolio/daycare-promo.png",
      description: "High-retention promotional and marketing commercial video produced for Keerthy's Daycare & Kindergarten to boost enrollment and community engagement.",
      link: "https://tinyurl.com/portfoliobynsd",
      tech: ["Runway Gen-3", "Premiere Pro", "Midjourney XL"]
    },
    {
      id: 2,
      title: "Nutrition & Wellness Introduction Video",
      category: "video",
      client: "Shilpa Palli",
      type: "Nutrition & Wellness Video",
      image: "/portfolio/nutrition-wellness.png",
      description: "Professional introduction video highlighting personalized nutrition and wellness advice, styled with clean layouts and visual guides.",
      link: "https://tinyurl.com/portfoliobynsd",
      tech: ["Runway Gen-3", "Midjourney XL", "Premiere Pro"]
    },
    {
      id: 3,
      title: "AI Memorial Tribute Video",
      category: "video",
      client: "Santhosh Juluri",
      type: "AI Memorial Tribute Video",
      image: "/portfolio/tribute-memorial.png",
      description: "Deeply emotional tribute and legacy video utilizing AI-enhanced restored photographs and historical family records synchronized to custom soundscapes.",
      link: "https://tinyurl.com/portfoliobynsd",
      tech: ["Topaz AI", "ElevenLabs", "Audition", "Photoshop Neural"]
    },
    {
      id: 4,
      title: "Interactive E-Commerce Interface",
      category: "websites",
      client: "NSD Labs",
      type: "Next.js Web App",
      image: "/portfolio/ecommerce-web.png",
      description: "Hand-coded, lightning-fast storefront styled with Tailwind and seamless page transitions.",
      link: "https://tinyurl.com/portfoliobynsd",
      tech: ["Next.js 15", "React 19", "Tailwind CSS", "Vercel Edge"]
    },
    {
      id: 5,
      title: "Corporate Identity Style Guide",
      category: "branding",
      client: "Global Logistics Brand",
      type: "Brand Guidelines",
      image: "/portfolio/branding-identity.png",
      description: "Premium vector graphics, core typography pairs, and standard color guidelines book.",
      link: "https://tinyurl.com/portfoliobynsd",
      tech: ["Figma CC", "Adobe Illustrator"]
    },
    {
      id: 6,
      title: "Educational Seminar Flyer",
      category: "posters",
      client: "Telangana Institution",
      type: "Poster Design",
      image: "/portfolio/poster-design.png",
      description: "Bold layout, structured visual grid hierarchy, and print-optimized graphic design.",
      link: "https://tinyurl.com/portfoliobynsd",
      tech: ["Photoshop", "InDesign"]
    },
    {
      id: 7,
      title: "WhatsApp CRM Integration Flow",
      category: "apps",
      client: "Local Retail Agency",
      type: "AI & API Automation",
      image: "/portfolio/whatsapp-automation.png",
      description: "Automated direct customer query triggers linking WhatsApp Business API with digital data sheets.",
      link: "https://tinyurl.com/portfoliobynsd",
      tech: ["Node.js", "WhatsApp API", "Supabase"]
    }
  ];

  const filteredWorks = activeCategory === "all"
    ? portfolioWorks
    : portfolioWorks.filter(w => w.category === activeCategory);

  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden">
      <Navbar />

      {/* Grid Overlay background */}
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      {/* Hero Header */}
      <section className="pt-24 pb-12 px-6 max-w-7xl mx-auto text-left w-full">
        <ScrollReveal direction="up" className="max-w-2xl flex flex-col space-y-4">
          <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">
            NSD Creations Showcase
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            Our Elite Portfolio <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-500">
              of Completed Digital Works.
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
            Witness how we build clean corporate aesthetics and high-performance business applications. Filter across our portfolio of videos, posters, brand books, websites, and custom automated tools.
          </p>
        </ScrollReveal>
      </section>

      {/* Filters bar */}
      <section className="py-6 px-6 max-w-7xl mx-auto w-full">
        <ScrollReveal direction="up" delay={0.1} className="flex flex-wrap gap-2 border-b border-zinc-200/40 dark:border-zinc-900/40 pb-5">
          {[
            { id: "all", label: "All Works" },
            { id: "video", label: "Images & Videos" },
            { id: "posters", label: "Posters" },
            { id: "websites", label: "Websites" },
            { id: "apps", label: "Apps & AI Projects" },
            { id: "branding", label: "Branding" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4.5 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
                activeCategory === cat.id
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/15"
                  : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </ScrollReveal>
      </section>

      {/* Portfolio Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredWorks.map((work) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={work.id}
                className="group flex flex-col bg-white dark:bg-[#09090b] rounded-3xl overflow-hidden border border-zinc-200/60 dark:border-zinc-900/60 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                  <ImageWithNSDFallback
                    src={work.image}
                    alt={work.title}
                    fill
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#030303]/85 backdrop-blur-md border border-zinc-800 text-[10px] font-mono font-bold tracking-widest text-indigo-400 px-3 py-1.5 rounded-full uppercase z-10">
                    {work.type}
                  </div>
                  {/* Watermark logo overlay on bottom right corner, smaller, 60% opacity */}
                  <div className="absolute bottom-3 right-3 z-10 pointer-events-none opacity-60 drop-shadow-md flex items-center justify-center">
                    <img
                      src="/nsdlogo.png"
                      alt="NSD Logo Watermark"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                      Client: {work.client}
                    </span>
                    <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 mt-1 mb-2">
                      {work.title}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed mb-4">
                      {work.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {work.tech.map((t) => (
                        <span key={t} className="text-[10px] font-mono bg-zinc-50 dark:bg-zinc-900/80 text-zinc-500 border border-zinc-200 dark:border-zinc-800/80 px-2 py-0.5 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900/80 flex items-center justify-between">
                    <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                      Case Study Approved
                    </span>
                    <Link
                      href={work.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-zinc-800 hover:text-indigo-600 dark:text-zinc-200 dark:hover:text-indigo-400 transition-colors"
                    >
                      View Source Assets
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Complete Portfolio External Callout */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <ScrollReveal direction="up" className="p-8 md:p-12 rounded-3xl bg-zinc-50 dark:bg-[#09090b]/60 border border-zinc-200/50 dark:border-zinc-900/50 shadow-md flex flex-col items-center">
          <h2 className="font-display font-bold text-2xl text-zinc-900 dark:text-zinc-50">View our complete historical archive</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3 max-w-lg">
            We store high-definition master videos, event posters, brochure layouts, and application code snapshots inside our centralized secure Google Drive portfolio folder.
          </p>
          <Link
            href="https://tinyurl.com/portfoliobynsd"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-black shadow-lg active:scale-95 transition-all"
          >
            Open Live Drive Folder
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
