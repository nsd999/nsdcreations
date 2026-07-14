"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  CheckCircle, 
  ArrowRight, 
  Compass, 
  Layers, 
  Eye, 
  Terminal, 
  Workflow, 
  Sparkles, 
  LifeBuoy 
} from "lucide-react";

export default function ProcessPage() {
  const steps = [
    {
      num: "01",
      name: "Discovery",
      tagline: "Understanding Your Operational Goals",
      desc: "We start with an intensive, personal discussion to explore your business objectives, current digital hurdles, target audience, budget boundaries, and timeline parameters.",
      deliverables: ["Comprehensive project scope questionnaire", "Initial digital design strategy draft", "Creative mood boards"],
      icon: <Compass className="w-5 h-5 text-indigo-500" />
    },
    {
      num: "02",
      name: "Planning",
      tagline: "Setting Rules, Wireframes & Scripts",
      desc: "Before writing any code or loading visual assets, we draft direct-response video scripts, structural UI wireframes, and comprehensive software specs.",
      deliverables: ["Approved commercial video scripts", "Full website layout blueprint schematics", "Official contract milestone timeline"],
      icon: <Layers className="w-5 h-5 text-indigo-500" />
    },
    {
      num: "03",
      name: "Design",
      tagline: "Premium Visual Identity",
      desc: "Our creative design phase custom-builds all vector graphics, brand books, typography guidelines, poster templates, and high-fidelity UI mockup screens.",
      deliverables: ["Pixel-perfect dark & light mockups in Figma", "Vector logo set and brand style manual", "Marketing handout designs"],
      icon: <Eye className="w-5 h-5 text-indigo-500" />
    },
    {
      num: "04",
      name: "Development",
      tagline: "Hand-Coding & Production Rendering",
      desc: "We render high-definition AI promotional videos, color-restore legacy photos, write type-safe Next.js code, and set up automated custom triggers.",
      deliverables: ["Hand-coded React/TypeScript application repository", "Fully rendered commercial-grade FHD video exports", "Clean automated pipeline structures"],
      icon: <Terminal className="w-5 h-5 text-indigo-500" />
    },
    {
      num: "05",
      name: "Review",
      tagline: "Meticulous Feedback & Polish",
      desc: "We upload beta draft links and video previews, allowing you to review spacing, text copy, graphic curves, and automation accuracy to perfect details.",
      deliverables: ["Beta visual staging testing links", "Comprehensive revision feedback tracker", "Accessibility and device responsive audits"],
      icon: <Workflow className="w-5 h-5 text-indigo-500" />
    },
    {
      num: "06",
      name: "Launch",
      tagline: "Going Live to the Public",
      desc: "We deploy applications onto rapid edge cloud servers, submit native apps to stores, configure search SEO mappings, and push ad campaigns live.",
      deliverables: ["Production live deployment URL configuration", "Fully indexing on-page sitemaps and schemas", "Live campaign ad account parameters"],
      icon: <Sparkles className="w-5 h-5 text-indigo-500" />
    },
    {
      num: "07",
      name: "Support",
      tagline: "Long-Term Advisory Partnerships",
      desc: "We offer continuous maintenance packages to update website features, run database backups, monitor server bandwidth, and refine video visuals.",
      deliverables: ["1 month of post-launch server health checking", "Step-by-step custom screen tutorials manual", "Priority emergency tech support line"],
      icon: <LifeBuoy className="w-5 h-5 text-indigo-500" />
    }
  ];

  return (
    <div className="flex-1 flex flex-col relative">
      <Navbar />

      {/* Grid Overlay background */}
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      {/* Hero Header */}
      <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto w-full text-left">
        <div className="max-w-2xl flex flex-col space-y-4">
          <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">
            NSD CREATIONS WORKFLOW
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            How We Take Ideas <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-500">
              to Flawless Production.
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
            A premium agency is distinguished by its operational discipline. Our 7-stage workflow ensures transparent collaboration, rapid deliveries, and world-class product quality.
          </p>
        </div>
      </section>

      {/* Steps List */}
      <section className="py-12 px-6 max-w-4xl mx-auto w-full flex flex-col space-y-12">
        {steps.map((step, idx) => (
          <div 
            key={step.num}
            className="p-8 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 shadow-sm flex flex-col space-y-6"
          >
            {/* Header row of step card */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-mono font-black text-indigo-500/20 dark:text-indigo-400/20">
                  {step.num}
                </span>
                <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    {step.name}
                  </h3>
                  <p className="text-indigo-500 dark:text-indigo-400 font-mono text-[11px] uppercase tracking-wider font-bold">
                    {step.tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">
              {step.desc}
            </p>

            {/* Deliverables box inside card */}
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-900/40">
              <h4 className="text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-3">
                Key Outputs of this Stage:
              </h4>
              <ul className="space-y-2">
                {step.deliverables.map((del, i) => (
                  <li key={i} className="flex items-start text-xs text-zinc-600 dark:text-zinc-400">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      {/* CTA section */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <div className="p-8 md:p-12 rounded-3xl bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 dark:border-indigo-400/10 shadow-sm flex flex-col items-center">
          <h2 className="font-display font-bold text-2xl text-zinc-900 dark:text-zinc-50">Ready to witness our process in action?</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3 max-w-lg">
            Let&apos;s organize a quick consultation to define your custom Stage 01 Discovery plan.
          </p>
          <a
            href="https://tinyurl.com/startwithNSD"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg active:scale-95 transition-all text-center"
          >
            Start Your Discovery
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
