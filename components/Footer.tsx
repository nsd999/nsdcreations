"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MessageSquare, Instagram, Youtube, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { NsdLogo } from "./NsdLogo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const servicesLinks = [
    { name: "AI Video Advertisements", href: "/services/ai-video-advertisements" },
    { name: "AI Product Commercials", href: "/services/ai-product-commercials" },
    { name: "Graphic & Poster Design", href: "/services/graphic-designing" },
    { name: "Website Development", href: "/services/website-development" },
    { name: "AI & WhatsApp Automation", href: "/services/ai-automation" },
    { name: "Branding & Social Media", href: "/services/branding" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/#about" },
    { name: "Meet the Founder", href: "/meet-the-founder" },
    { name: "Our Process", href: "/process" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  const industriesLinks = [
    { name: "Startups & Local Business", href: "/services" },
    { name: "Educational Institutions", href: "/services" },
    { name: "Restaurants & Healthcare", href: "/services" },
    { name: "Creators & Influencers", href: "/services" },
  ];

  return (
    <footer className="bg-zinc-50 dark:bg-[#050505] border-t border-zinc-200/60 dark:border-zinc-900/60 transition-colors">
      {/* Upper Footer CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 border-b border-zinc-200/50 dark:border-zinc-900/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
              Let&apos;s craft something remarkable together.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 max-w-xl text-sm md:text-base">
              Have an idea, video commercial, website, or custom automation project? Get in touch today for a free personal consultation and tailored pricing quote.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-4 lg:justify-end">
            <a
              href="https://tinyurl.com/startwithNSD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95 transition-all text-center"
            >
              Start Your Project
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <Link
              href="https://wa.me/916303849852"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-sm font-semibold tracking-wide uppercase bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all text-center"
            >
              <MessageSquare className="w-4 h-4 mr-2 text-green-500" />
              WhatsApp Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12">
        {/* Company Overview Block */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 relative flex items-center justify-center shrink-0">
              <NsdLogo className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#FF8A00] via-[#FFA726] to-[#FFB347]">
                NSD CREATIONS
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-[#7C6BFF] uppercase -mt-0.5">
                Creative Tech Partner
              </span>
            </div>
          </Link>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed max-w-sm">
            Bridging AI, custom websites, high-conversion visual storytelling, and operational automations to push startups, educational brands, and local businesses ahead of the curve.
          </p>
          <div className="flex items-center space-x-3.5">
            <Link
              href="https://instagram.com/nsd.creations.official"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-zinc-200/50 dark:bg-zinc-900 border border-zinc-300/30 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </Link>
            <Link
              href="https://youtube.com/@nsdkaraoke"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-zinc-200/50 dark:bg-zinc-900 border border-zinc-300/30 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </Link>
            <a
              href="mailto:nsd.creations.official@gmail.com"
              className="w-9 h-9 rounded-full bg-zinc-200/50 dark:bg-zinc-900 border border-zinc-300/30 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
          <div className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
            <p>Founder: Sai Dheeraj Nalkari</p>
            <p className="mt-1">Hyderabad, Telangana, India</p>
          </div>
        </div>

        {/* Column 2: Services */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="font-display font-semibold text-zinc-800 dark:text-zinc-200 text-xs md:text-sm tracking-widest uppercase">
            Services
          </h3>
          <ul className="space-y-2.5">
            {servicesLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Industries */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="font-display font-semibold text-zinc-800 dark:text-zinc-200 text-xs md:text-sm tracking-widest uppercase">
            Industries
          </h3>
          <ul className="space-y-2.5">
            {industriesLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Agency Links */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-display font-semibold text-zinc-800 dark:text-zinc-200 text-xs md:text-sm tracking-widest uppercase">
            Agency
          </h3>
          <ul className="space-y-2.5">
            {companyLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Under Footer - Legal & Pricing Notes */}
      <div className="border-t border-zinc-200/40 dark:border-zinc-900/40 bg-zinc-100/50 dark:bg-[#030303]/40 py-8 transition-colors text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-zinc-500 dark:text-zinc-400">
            <span>&copy; {currentYear} NSD Creations. All rights reserved.</span>
            <span className="hidden md:inline text-zinc-300 dark:text-zinc-800">|</span>
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              Pricing starting from ₹99*
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Secure SSL Checked
            </span>
            <span>
              *Selected digital services only
            </span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by Sai Dheeraj
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
