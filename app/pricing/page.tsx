"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle, ArrowRight, ShieldCheck, Mail, Phone, Clock } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter Design",
      price: "₹99*",
      tagline: "Ideal for basic promotional digital designing.",
      desc: "Get elegant standalone graphics, custom menus, or visual announcements crafted with standard professional polish.",
      features: [
        "100% custom graphic illustration",
        "Print-ready & web-optimized vector assets",
        "2 rounds of precise revisions",
        "Dedicated email support"
      ],
      cta: "Order Graphic Design",
      highlight: false
    },
    {
      name: "Business Marketing",
      price: "Custom Quote",
      tagline: "Engineered for high-performing video ads and branding.",
      desc: "Stunning cinematic AI video commercials, tribute videos, automated WhatsApp funnels, or entire corporate brand style sheets.",
      features: [
        "FHD cinematic AI-powered video commercials",
        "Meta API WhatsApp broadcast setup",
        "Full style brand books (logos, colors, typography)",
        "Premium copywriting script and voice synthesis",
        "Priority revisions cycle"
      ],
      cta: "Schedule Free Consultation",
      highlight: true
    },
    {
      name: "Enterprise Software",
      price: "Custom Quote",
      tagline: "Fully hand-coded digital software solutions.",
      desc: "Ultra-fast Next.js 15 web applications, cross-platform mobile apps, bespoke backend architectures, and complete automation integrations.",
      features: [
        "Handwritten Next.js 15 & React 19 codebase",
        "100% Lighthouse optimization scores",
        "API triggers, serverless database setup",
        "Secure sitemaps, schemas, and OpenGraph SEO",
        "1 month full post-launch maintenance"
      ],
      cta: "Partner With Sai Dheeraj",
      highlight: false
    }
  ];

  return (
    <div className="flex-1 flex flex-col relative">
      <Navbar />

      {/* Grid Overlay background */}
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      {/* Hero Header */}
      <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto w-full text-center">
        <div className="max-w-xl mx-auto flex flex-col space-y-3">
          <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">
            Flexible Pricing Structure
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            Premium Results. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-500">
              Honest Affordability.
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
            We operate on flexible quote structures tailored directly to the parameters, size, and duration of your custom creative technology projects.
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-8 rounded-3xl bg-white dark:bg-[#09090b] border shadow-sm flex flex-col justify-between relative overflow-hidden ${
              plan.highlight
                ? "border-indigo-500 ring-2 ring-indigo-500/10 dark:ring-indigo-400/10"
                : "border-zinc-200/60 dark:border-zinc-900/60"
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-4 right-4 bg-indigo-500 text-white font-mono text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                RECOMMENDED
              </div>
            )}

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {plan.name}
              </span>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl md:text-5xl font-display font-black text-zinc-900 dark:text-white">
                  {plan.price}
                </span>
              </div>
              <p className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-bold uppercase tracking-wider mt-2">
                &bull; {plan.tagline}
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm mt-4 leading-relaxed">
                {plan.desc}
              </p>

              <div className="w-full h-px bg-zinc-100 dark:bg-zinc-900/80 my-6" />

              <ul className="space-y-3">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2.5 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-50 dark:border-zinc-900/60">
              <Link
                href="/#contact"
                className={`w-full inline-flex items-center justify-center px-5 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all ${
                  plan.highlight
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                    : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Pricing Notes / Details */}
      <section className="py-12 px-6 max-w-4xl mx-auto w-full text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div className="p-6 rounded-2xl bg-zinc-50/50 dark:bg-[#09090b]/40 border border-zinc-200/50 dark:border-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="flex items-center text-left">
            <ShieldCheck className="w-4 h-4 text-indigo-500 mr-2 shrink-0" />
            <span>
              * Starting pricing applies to simple standalone graphic assets. Comprehensive media deliverables or full-suite software require tailored contract specifications.
            </span>
          </span>
          <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold shrink-0">
            Learn More Specs &rarr;
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
