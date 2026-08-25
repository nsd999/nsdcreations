import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { servicesData } from "@/lib/services-data";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Metadata } from "next";
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
  CheckCircle2,
  Info,
  Zap,
  Layers,
  Code2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | NSD Creations — AI Creative Studio & Digital Agency",
  description:
    "Transparent pricing for all 16 NSD Creations services — AI video production, branding, digital marketing, automation, website and app development. Services starting from ₹299.",
  keywords: [
    "NSD Creations pricing",
    "AI video advertisement cost",
    "branding packages India",
    "digital marketing pricing",
    "WhatsApp automation cost",
    "website development pricing India",
    "mobile app development cost",
    "custom software pricing",
  ],
  openGraph: {
    title: "Pricing | NSD Creations",
    description:
      "Transparent pricing for AI creative, branding, marketing, automation and technology services. Starting from ₹299.",
    url: "https://nsdcreations.vercel.app/pricing",
    siteName: "NSD Creations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | NSD Creations",
    description:
      "Transparent pricing for AI creative, branding, marketing, automation and technology services. Starting from ₹299.",
  },
  alternates: {
    canonical: "https://nsdcreations.vercel.app/pricing",
  },
};

function getServiceIcon(iconName: string, size = "w-5 h-5") {
  switch (iconName) {
    case "video":
      return <Video className={`${size} text-indigo-500`} />;
    case "tv":
      return <Tv className={`${size} text-indigo-500`} />;
    case "heart":
      return <Heart className={`${size} text-rose-500`} />;
    case "image":
      return <FileImage className={`${size} text-indigo-500`} />;
    case "palette":
      return <Palette className={`${size} text-violet-500`} />;
    case "globe":
      return <Globe className={`${size} text-sky-500`} />;
    case "smartphone":
      return <Smartphone className={`${size} text-indigo-500`} />;
    case "cpu":
      return <Cpu className={`${size} text-emerald-500`} />;
    case "message-square":
      return <MessageSquare className={`${size} text-emerald-500`} />;
    case "sparkles":
      return <Sparkles className={`${size} text-amber-500`} />;
    case "trending-up":
      return <TrendingUp className={`${size} text-indigo-500`} />;
    case "share":
      return <Share2 className={`${size} text-indigo-500`} />;
    case "workflow":
      return <Workflow className={`${size} text-emerald-500`} />;
    case "settings":
      return <Settings className={`${size} text-slate-500`} />;
    default:
      return <Sparkles className={`${size} text-indigo-500`} />;
  }
}

const categoryMeta = [
  {
    id: "Creative",
    label: "Creative",
    title: "Creative Services",
    subtitle: "Video + Graphics",
    description:
      "High-impact AI video production, graphic design, and visual content engineered to capture attention and drive action.",
    icon: <Layers className="w-5 h-5" />,
    color: "indigo",
    anchor: "creative",
  },
  {
    id: "Brand & Marketing",
    label: "Brand & Marketing",
    title: "Brand & Marketing",
    subtitle: "Brand Identity + Digital Marketing",
    description:
      "Strategic brand identities and performance-driven digital campaigns built for modern business growth.",
    icon: <Zap className="w-5 h-5" />,
    color: "violet",
    anchor: "brand-marketing",
  },
  {
    id: "Automation",
    label: "Automation",
    title: "Automation",
    subtitle: "AI + WhatsApp + Business Automation",
    description:
      "Intelligent workflows, WhatsApp bots, and end-to-end business automation that save time and scale operations.",
    icon: <Cpu className="w-5 h-5" />,
    color: "emerald",
    anchor: "automation",
  },
  {
    id: "Technology",
    label: "Technology",
    title: "Technology",
    subtitle: "Websites + Apps + Software",
    description:
      "Scalable hand-coded websites, cross-platform mobile apps, and custom software engineered for performance and growth.",
    icon: <Code2 className="w-5 h-5" />,
    color: "sky",
    anchor: "technology",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://nsdcreations.vercel.app/#organization",
      name: "NSD Creations",
      url: "https://nsdcreations.vercel.app",
      description:
        "AI Creative Studio & Digital Agency offering video production, branding, marketing, automation and technology solutions.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        availableLanguage: ["English", "Hindi", "Telugu"],
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://nsdcreations.vercel.app",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Pricing",
          item: "https://nsdcreations.vercel.app/pricing",
        },
      ],
    },
  ],
};

export default function PricingPage() {
  const groupedServices: Record<string, typeof servicesData> = {
    Creative: [],
    "Brand & Marketing": [],
    Automation: [],
    Technology: [],
  };

  servicesData.forEach((service) => {
    if (groupedServices[service.categoryGroup] !== undefined) {
      groupedServices[service.categoryGroup].push(service);
    }
  });

  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden bg-[#FAFAFA] dark:bg-[#09090b]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />

      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      {/* ── HERO ── */}
      <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto text-center w-full">
        <ScrollReveal
          direction="up"
          className="max-w-3xl mx-auto flex flex-col space-y-6 items-center"
        >
          {/* Entry badge */}
          <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-500/20">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Services &amp; Pricing
            </span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            Transparent Pricing.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-500">
              Serious Results.
            </span>
          </h1>

          <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl">
            From high-impact creative content to intelligent automation and
            custom technology, choose the right solution for your business.
          </p>

          {/* Starting-from callout */}
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-display font-bold text-sm tracking-wide">
            Services starting from{" "}
            <span className="text-indigo-400 dark:text-indigo-600 text-base">
              ₹299
            </span>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start max-w-md mt-2 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-left">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0 mr-3" />
            <p className="text-sm text-amber-800 dark:text-amber-400/90 leading-relaxed">
              Final pricing depends on project scope, complexity, revisions,
              integrations and delivery requirements.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ── CATEGORY JUMP-NAV ── */}
      <section className="pb-8 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-wrap justify-center gap-3">
          {categoryMeta.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.anchor}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
            >
              {cat.icon}
              {cat.label}
            </a>
          ))}
        </div>
      </section>

      {/* ── PRICING CATEGORIES ── */}
      <section className="pb-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col space-y-24">
          {categoryMeta.map((cat, catIndex) => {
            const services = groupedServices[cat.id] || [];
            if (services.length === 0) return null;

            return (
              <div
                key={cat.id}
                id={cat.anchor}
                className="scroll-mt-28"
              >
                {/* Category header */}
                <ScrollReveal direction="up" delay={0.05}>
                  <div className="flex flex-col items-center text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-bold tracking-widest uppercase mb-4">
                      {cat.icon}
                      {cat.subtitle}
                    </div>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-50 mb-4">
                      {cat.title}
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl text-base leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </ScrollReveal>

                {/* Service cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {services.map((service, index) => {
                    const rawPrice = service.startingPrice;
                    const formattedPrice =
                      rawPrice === "Custom"
                        ? "Custom"
                        : `${service.currency}${rawPrice}`;
                    const period = service.pricingPeriod ?? "";

                    return (
                      <ScrollReveal
                        key={service.id}
                        delay={(index % 4) * 0.08}
                        direction="up"
                      >
                        <div className="group spotlight-card flex flex-col h-full bg-white dark:bg-[#0e0e11] rounded-3xl border border-zinc-200 dark:border-zinc-800/80 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden relative">
                          {/* Top accent line on hover */}
                          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="p-6 flex-1 flex flex-col">
                            {/* Icon */}
                            <div className="flex justify-between items-start mb-5">
                              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                {getServiceIcon(service.iconName)}
                              </div>
                            </div>

                            {/* Category label */}
                            <div className="text-[10px] font-mono font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase mb-1.5">
                              {service.category}
                            </div>

                            {/* Service name */}
                            <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                              {service.name}
                            </h3>

                            {/* Short description */}
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                              {service.shortDescription}
                            </p>

                            {/* Price block */}
                            <div className="mb-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
                              <div className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">
                                Starting from
                              </div>
                              <div className="flex items-baseline gap-1 flex-wrap">
                                <span className="font-display font-bold text-2xl text-zinc-900 dark:text-white">
                                  {formattedPrice}
                                </span>
                                {formattedPrice !== "Custom" && period && (
                                  <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                    {period}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Top 3 features preview */}
                            <ul className="space-y-2 mb-6">
                              {service.packages[0]?.features
                                .slice(0, 3)
                                .map((feature, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start text-sm text-zinc-600 dark:text-zinc-300"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2.5 shrink-0 mt-0.5" />
                                    <span className="leading-snug">
                                      {feature}
                                    </span>
                                  </li>
                                ))}
                              {(service.packages[0]?.features.length ?? 0) >
                                3 && (
                                <li className="text-xs text-indigo-500 dark:text-indigo-400 font-medium pl-6">
                                  +{" "}
                                  {service.packages[0].features.length - 3}{" "}
                                  more in Starter plan
                                </li>
                              )}
                            </ul>

                            {/* CTAs */}
                            <div className="mt-auto flex flex-col gap-2">
                              <Link
                                href={`/pricing/${service.slug}`}
                                className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500 dark:group-hover:text-white"
                              >
                                View Pricing Details
                                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                              </Link>
                            </div>
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

      {/* ── BUSINESS RULES NOTE ── */}
      <section className="pb-12 px-6 max-w-4xl mx-auto w-full">
        <ScrollReveal direction="up">
          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-3">
              Pricing Notes
            </h3>
            <ul className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              <li>
                • All prices shown are <strong>starting prices</strong>. Final
                quotation depends on scope, complexity and requirements.
              </li>
              <li>
                • Advertising spend (Meta Ads / Google Ads) is billed
                separately and is not included in agency fees.
              </li>
              <li>
                • WhatsApp API, messaging and third-party platform costs may be
                billed separately.
              </li>
              <li>
                • Hosting, domain and third-party software subscriptions are
                separate unless stated.
              </li>
              <li>
                • Complex integrations, additional revisions and premium
                projects require consultation.
              </li>
            </ul>
          </div>
        </ScrollReveal>
      </section>

      {/* ── GLOBAL CTA ── */}
      <section className="py-24 relative overflow-hidden bg-zinc-900 dark:bg-black border-t border-zinc-800">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -left-[10%] w-1/2 h-[150%] bg-indigo-500/20 blur-[120px] rounded-full" />
          <div className="absolute top-1/4 -right-[10%] w-2/5 h-full bg-purple-500/20 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 px-6 max-w-4xl mx-auto text-center">
          <ScrollReveal direction="up" className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Custom Solutions
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-6 leading-tight">
              Ready to build something{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                better?
              </span>
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-2xl leading-relaxed">
              Looking for a tailored package or enterprise solution? Let&apos;s
              discuss your specific requirements and build a strategy that scales
              with you.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] transition-all active:scale-95"
              >
                Get a Quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all active:scale-95"
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
