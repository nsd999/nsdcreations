"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageWithNSDFallback } from "@/components/ImageWithNSDFallback";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { KineticMarquee } from "@/components/KineticMarquee";
import { ArrowUpRight, ExternalLink, Github, Layers3, Sparkles, Code2, Palette, Video, Music2, Bot, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type WorkStatus = "Client work private" | "Concept / demo" | "Internal project" | "Live project";

type PortfolioWork = {
  id: string;
  title: string;
  category: "video" | "posters" | "websites" | "apps" | "branding" | "music";
  type: string;
  image: string;
  description: string;
  status: WorkStatus;
  stack: string[];
  href?: string;
  featured?: boolean;
};

const projects: PortfolioWork[] = [
  {
    id: "easysbtet", title: "EasySBTET", category: "websites", type: "Academic platform",
    image: "/portfolio/ecommerce-web.png",
    description: "Student-focused academic dashboard for SBTET updates, results, attendance tools and study resources, with ongoing work around realtime updates and admin workflows.",
    status: "Live project", stack: ["Next.js", "Supabase", "PostgreSQL", "Vercel"],
    href: "https://easysbtet.vercel.app", featured: true
  },
  {
    id: "syncwave", title: "SyncWave", category: "apps", type: "Synchronized listening & watching",
    image: "/portfolio/whatsapp-automation.png",
    description: "A shared listening and watching experience with rooms, synchronized playback, realtime chat, presence and queue management.",
    status: "Internal project", stack: ["Next.js", "React", "Supabase Realtime", "YouTube"], href: "https://github.com/nsd999/SyncWaveApp", featured: true
  },
  {
    id: "queueless", title: "QueueLess India", category: "apps", type: "Civic service discovery",
    image: "/portfolio/ecommerce-web.png",
    description: "An MVP concept for finding nearby public and service locations, organized by city and service category.",
    status: "Concept / demo", stack: ["Lovable Cloud", "Database", "Authentication"], href: "https://queuelessindia.vercel.app"
  },
  {
    id: "civicgrid", title: "CivicGrid", category: "apps", type: "Civic information concept",
    image: "/portfolio/branding-identity.png",
    description: "A mobile-first civic services concept spanning public safety, health, weather resilience and civic alerts.",
    status: "Concept / demo", stack: ["React", "UX design", "Government sources"], href: "https://github.com/nsd999/CivicGrid"
  },
  {
    id: "geocraft", title: "GeoCraft", category: "apps", type: "Geospatial tools",
    image: "/portfolio/whatsapp-automation.png",
    description: "A geospatial project focused on building useful location-aware experiences and mapping workflows.",
    status: "Internal project", stack: ["Web development", "Maps", "Geospatial data"], href: "https://github.com/nsd999/GeoCraft"
  },
  {
    id: "trendera", title: "Trendera", category: "websites", type: "Fashion storefront",
    image: "/portfolio/ecommerce-web.png",
    description: "A fashion storefront project exploring product presentation, shopping journeys and brand identity.",
    status: "Live project", stack: ["E-commerce", "Responsive UI", "Branding"], href: "https://trendera-brand.store.shoopy.in"
  },
  {
    id: "nsd-site", title: "NSD Creations", category: "websites", type: "Creative technology studio",
    image: "/portfolio/branding-identity.png",
    description: "The main agency website for creative services, digital design, web development and automation.",
    status: "Live project", stack: ["Next.js", "React", "Tailwind CSS", "Vercel"], href: "https://nsdcreations.vercel.app"
  },
  {
    id: "daycare", title: "Keerthy's Daycare & Kindergarten", category: "video", type: "Promotional video",
    image: "/portfolio/daycare-promo.png",
    description: "Promotional creative work prepared for a daycare and kindergarten, designed to introduce its services and engage families.",
    status: "Client work private", stack: ["Video editing", "Creative design"]
  },
  {
    id: "wellness", title: "Nutrition & Wellness Introduction", category: "video", type: "Introduction video",
    image: "/portfolio/nutrition-wellness.png",
    description: "A visual introduction for a nutrition and wellness service, designed to communicate its offering clearly.",
    status: "Client work private", stack: ["Video editing", "Visual storytelling"]
  },
  {
    id: "tribute", title: "AI Memorial Tribute", category: "video", type: "Tribute video",
    image: "/portfolio/tribute-memorial.png",
    description: "A respectful tribute-video concept combining personal memories with carefully paced visual storytelling.",
    status: "Client work private", stack: ["Editing", "AI-assisted creative tools"]
  },
  {
    id: "poster", title: "Poster & Graphic Design Archive", category: "posters", type: "Visual communication",
    image: "/portfolio/poster-design.png",
    description: "Poster concepts and graphic layouts for events, educational initiatives and promotional communication.",
    status: "Concept / demo", stack: ["Canva", "Typography", "Layout design"]
  },
  {
    id: "identity", title: "Brand Identity Studies", category: "branding", type: "Brand system explorations",
    image: "/portfolio/branding-identity.png",
    description: "Explorations in brand presentation, visual consistency, typography and supporting creative assets.",
    status: "Concept / demo", stack: ["Branding", "Graphic design", "Visual systems"]
  },
  {
    id: "music", title: "NSD Karaoke & AI Music", category: "music", type: "Music and short-form content",
    image: "/portfolio/tribute-memorial.png",
    description: "Personal creative experiments involving music, karaoke content, AI-assisted song creation and visual storytelling.",
    status: "Internal project", stack: ["Suno AI", "BandLab", "Video editing"], href: "https://youtube.com/@nsdkaraoke"
  },
  {
    id: "whatsapp", title: "WhatsApp Automation Concept", category: "apps", type: "Business workflow concept",
    image: "/portfolio/whatsapp-automation.png",
    description: "A proposed workflow for connecting customer enquiries with automated business processes. A concept listing, not a claim of a completed live integration.",
    status: "Concept / demo", stack: ["WhatsApp Cloud API", "Webhooks", "Supabase"]
  },
  {
    id: "restoration", title: "Photo Restoration", category: "posters", type: "Before / after edit",
    image: "/portfolio/restoration-after.png",
    description: "Image restoration and enhancement work focused on improving the presentation of older photographs.",
    status: "Concept / demo", stack: ["Photo editing", "Image enhancement"]
  }
];

const categories = [
  { id: "all", label: "All work" },
  { id: "websites", label: "Websites" },
  { id: "apps", label: "Apps & technology" },
  { id: "video", label: "Video & creative" },
  { id: "posters", label: "Posters & graphics" },
  { id: "branding", label: "Branding" },
  { id: "music", label: "Music" }
] as const;

function StatusLabel({ status }: { status: WorkStatus }) {
  return <span className="inline-flex rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/50 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-zinc-600 dark:text-zinc-300">{status}</span>;
}

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const filteredWorks = useMemo(() => projects.filter((project) => {
    const matchesCategory = activeCategory === "all" || project.category === activeCategory;
    const searchText = [project.title, project.type, project.description, ...project.stack].join(" ").toLowerCase();
    return matchesCategory && searchText.includes(query.trim().toLowerCase());
  }), [activeCategory, query]);

  return (
    <div className="relative flex-1 overflow-x-hidden">
      <Navbar />
      <div className="pointer-events-none absolute inset-0 -z-10 grid-background" />

      <section className="mx-auto w-full max-w-7xl px-5 pb-14 pt-20 sm:px-8 md:pb-20 md:pt-28">
        <ScrollReveal direction="up" className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" /> Personal portfolio · Sai Dheeraj
          </div>
          <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight text-zinc-950 dark:text-white sm:text-6xl md:text-7xl">
            Ideas into <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">things people can use.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg">
            I’m Sai Dheeraj — a student, developer and creative maker exploring web apps, AI-assisted content, visual design, music and practical digital tools. This is a growing archive of projects, experiments and client work.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">Explore projects <ArrowUpRight className="h-4 w-4" /></a>
            <a href="https://github.com/nsd999" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/70 px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-100"><Github className="h-4 w-4" /> GitHub profile</a>
            <a href="https://tinyurl.com/startwithNSD" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/70 px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-100">Work with me <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Code2, label: "Web & software", value: "Build" },
            { icon: Palette, label: "Design & posters", value: "Create" },
            { icon: Video, label: "Video & storytelling", value: "Produce" },
            { icon: Bot, label: "AI & automation", value: "Explore" }
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/60 sm:p-5">
              <item.icon className="mb-5 h-5 w-5 text-indigo-500" />
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{item.value}</p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden border-y border-zinc-200/60 bg-zinc-100/80 py-6 dark:border-zinc-900 dark:bg-[#09090b]">
        <KineticMarquee baseVelocity={0.8} className="text-sm font-bold tracking-[0.18em] text-zinc-700 dark:text-zinc-200 sm:text-base">
          <span className="mx-5 text-indigo-500">✳</span> BUILD · DESIGN · EXPERIMENT <span className="mx-5 text-indigo-500">✳</span> MAKE IDEAS REAL <span className="mx-5 text-indigo-500">✳</span> LEARN IN PUBLIC
        </KineticMarquee>
      </section>

      <section id="work" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <ScrollReveal direction="up">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">Selected work</p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">Projects, experiments & client work</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">Browse the work by category. Status labels distinguish live projects, internal builds, concepts and private client work.</p>
          </ScrollReveal>
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search portfolio" placeholder="Search projects or tools..." className="w-full rounded-full border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950" />
          </div>
        </div>

        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-semibold transition ${activeCategory === category.id ? "bg-indigo-600 text-white" : "border border-zinc-200 bg-white/70 text-zinc-600 hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-300"}`}>
              {category.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs text-zinc-400">{filteredWorks.length} {filteredWorks.length === 1 ? "project" : "projects"} shown</p>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredWorks.map((work, index) => (
              <motion.article key={work.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, delay: Math.min(index * 0.025, 0.15) }} className="group min-w-0">
                <SpotlightCard className="flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <ImageWithNSDFallback src={work.image} alt={work.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    <div className="absolute left-3 top-3"><StatusLabel status={work.status} /></div>
                    <div className="absolute bottom-3 right-3 rounded-full border border-white/20 bg-black/70 p-2 text-white"><Layers3 className="h-4 w-4" /></div>
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-500">{work.type}</p>
                    <h3 className="mt-2 text-lg font-bold leading-snug text-zinc-900 dark:text-zinc-100">{work.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{work.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {work.stack.map((tag) => <span key={tag} className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">{tag}</span>)}
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-900">
                      <span className="text-[10px] font-medium text-zinc-400">{work.status}</span>
                      {work.href ? <Link href={work.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-zinc-800 transition hover:text-indigo-500 dark:text-zinc-200">Open project <ExternalLink className="h-3.5 w-3.5" /></Link> : <span className="text-xs text-zinc-400">Private / preview</span>}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filteredWorks.length === 0 && <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center text-sm text-zinc-500 dark:border-zinc-800">No projects match that search. Try another term or category.</div>}
      </section>

      <section className="border-y border-zinc-200/60 bg-zinc-50/70 px-5 py-14 dark:border-zinc-900 dark:bg-zinc-950/40 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 md:items-center">
          <ScrollReveal direction="up">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">How I work</p>
            <h2 className="mt-3 font-display text-3xl font-black text-zinc-950 dark:text-white">Curiosity first. Useful work always.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">I learn by building: starting with a problem, testing the simplest useful version, improving the details and keeping the work honest about what is live versus still a concept.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { title: "Build", description: "Websites, dashboards, small apps and practical utilities." },
              { title: "Design", description: "Posters, brand visuals, thumbnails and digital layouts." },
              { title: "Create", description: "Promotional edits, music projects and short-form storytelling." },
              { title: "Explore", description: "AI workflows, automation ideas and new tools." }
            ].map((item, i) => <div key={item.title} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black/30"><span className="text-xs font-bold text-indigo-500">0{i + 1}</span><h3 className="mt-3 font-bold text-zinc-900 dark:text-zinc-100">{item.title}</h3><p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{item.description}</p></div>)}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-5xl px-5 py-16 text-center md:py-24">
        <ScrollReveal direction="up" className="rounded-3xl border border-zinc-200 bg-white/80 px-6 py-10 dark:border-zinc-800 dark:bg-zinc-950/70 sm:px-12 sm:py-14">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500"><Music2 className="h-5 w-5" /></div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">Have something in mind?</p>
          <h2 className="mt-3 font-display text-3xl font-black text-zinc-950 dark:text-white sm:text-4xl">Let’s make it real.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">For creative work, websites, design or automation, reach out through NSD Creations. For code and experiments, browse my public repositories.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="https://tinyurl.com/startwithNSD" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700">Contact NSD Creations <ArrowUpRight className="h-4 w-4" /></a>
            <a href="https://instagram.com/nsd.creations.official" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-3 text-sm font-bold text-zinc-800 hover:border-indigo-400 dark:border-zinc-700 dark:text-zinc-100">Instagram <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </ScrollReveal>
      </section>
      <Footer />
    </div>
  );
}
