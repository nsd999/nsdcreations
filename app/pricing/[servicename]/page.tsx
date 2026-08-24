import React from "react";
import { notFound } from "next/navigation";
import { servicesData } from "@/lib/services-data";
import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import Link from "next/link";
import {
  ChevronRight,
  CheckCircle2,
  Plus,
  ArrowRight,
  Info,
  ChevronDown,
  Home,
  Sparkles,
  Users,
  MessageSquare,
} from "lucide-react";

interface Props {
  params: Promise<{ servicename: string }>;
}

export async function generateStaticParams() {
  return servicesData.map((service) => ({
    servicename: service.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const service = servicesData.find(
    (s) => s.slug === resolvedParams.servicename
  );

  if (!service) {
    return { title: "Service Not Found | NSD Creations" };
  }

  return {
    title: service.seo.title,
    description: service.seo.description,
    keywords: service.seo.keywords,
    openGraph: {
      title: service.seo.title,
      description: service.seo.description,
      url: `https://nsdcreations.vercel.app/pricing/${service.slug}`,
      siteName: "NSD Creations",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: service.seo.title,
      description: service.seo.description,
    },
    alternates: {
      canonical: `https://nsdcreations.vercel.app/pricing/${service.slug}`,
    },
  };
}

/** Resolve a static Tailwind grid class for 1-4 packages */
function packagesGridClass(count: number): string {
  if (count === 1) return "grid-cols-1 max-w-md mx-auto";
  if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto";
  if (count === 3) return "grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto";
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
}

export default async function ServicePricingPage({ params }: Props) {
  const resolvedParams = await params;
  const service = servicesData.find(
    (s) => s.slug === resolvedParams.servicename
  );

  if (!service) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
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
          {
            "@type": "ListItem",
            position: 3,
            name: service.name,
            item: `https://nsdcreations.vercel.app/pricing/${service.slug}`,
          },
        ],
      },
      {
        "@type": "Service",
        name: service.name,
        description: service.longDescription || service.shortDescription,
        provider: {
          "@type": "Organization",
          name: "NSD Creations",
          url: "https://nsdcreations.vercel.app",
        },
        offers: service.packages.map((pkg) => ({
          "@type": "Offer",
          name: pkg.name,
          price: pkg.price.replace(/[₹,+]/g, "").trim(),
          priceCurrency: "INR",
          description: pkg.idealFor ?? pkg.name,
        })),
      },
      ...(service.faqs && service.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: service.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  /** Collect unique "Best for" labels from packages to build "Who It's For" */
  const idealForItems = service.packages
    .map((p) => p.idealFor)
    .filter(Boolean) as string[];

  return (
    <div className="flex-1 flex flex-col relative bg-[#FAFAFA] dark:bg-[#09090b]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      {/* ── BREADCRUMBS ── */}
      <div className="pt-24 pb-4 px-6 max-w-7xl mx-auto w-full">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center text-sm text-zinc-500 dark:text-zinc-400 gap-1"
        >
          <Link
            href="/"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0 text-zinc-400 dark:text-zinc-600" />
          <Link
            href="/pricing"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Pricing
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0 text-zinc-400 dark:text-zinc-600" />
          <span className="text-zinc-900 dark:text-zinc-100 font-medium">
            {service.name}
          </span>
        </nav>
      </div>

      {/* ── HERO ── */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full text-center">
        <ScrollReveal
          direction="up"
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <div className="inline-block px-3 py-1.5 mb-5 text-[11px] font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20 uppercase">
            {service.category}
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight mb-6">
            {service.name}
          </h1>

          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed mb-8">
            {service.longDescription || service.shortDescription}
          </p>

          {/* Starting price + CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-baseline gap-1.5 px-5 py-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
              <span className="text-xs font-medium opacity-70">
                Starting from
              </span>
              <span className="font-display font-bold text-xl text-indigo-400 dark:text-indigo-600">
                {service.currency}
                {service.startingPrice}
              </span>
              {service.pricingPeriod && (
                <span className="text-xs opacity-70">
                  {service.pricingPeriod}
                </span>
              )}
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-sm font-bold tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
            >
              Get a Quote
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-sm font-bold tracking-widest uppercase border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-all"
            >
              View All Pricing
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ── PRICING PACKAGES ── */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <ScrollReveal direction="up" className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-zinc-50 mb-3">
            Choose Your Package
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            All packages are starting prices. Final cost depends on your specific
            requirements, scope and delivery timeline.
          </p>
        </ScrollReveal>

        <div className={`grid gap-8 ${packagesGridClass(service.packages.length)}`}>
          {service.packages.map((pkg, idx) => {
            const isPopular = pkg.isPopular === true;

            return (
              <ScrollReveal key={pkg.name} delay={idx * 0.1} direction="up" className="h-full">
                <div
                  className={`relative flex flex-col h-full rounded-3xl border transition-all duration-300 ${
                    isPopular
                      ? "bg-white dark:bg-[#0e0e11] border-indigo-500 shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/5 md:-translate-y-4"
                      : "bg-white dark:bg-[#0e0e11] border-zinc-200 dark:border-zinc-800/80 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5"
                  }`}
                >
                  {/* Most Popular badge */}
                  {isPopular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-7 sm:p-8 flex-1 flex flex-col">
                    {/* Package name */}
                    <h3 className="font-display font-bold text-2xl text-zinc-900 dark:text-zinc-50 mb-1">
                      {pkg.name}
                    </h3>

                    {/* Ideal for label */}
                    {pkg.idealFor && (
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 min-h-[20px]">
                        {pkg.idealFor}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mb-7 pb-7 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-end gap-1.5 flex-wrap">
                        <span
                          className={`font-display font-bold text-4xl ${
                            isPopular
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-zinc-900 dark:text-white"
                          }`}
                        >
                          {pkg.price}
                        </span>
                        {service.pricingPeriod && (
                          <span className="text-zinc-500 dark:text-zinc-400 mb-1 font-medium text-sm">
                            {service.pricingPeriod}
                          </span>
                        )}
                      </div>
                      {pkg.price.endsWith("+") && (
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                          Final quotation depends on scope and requirements.
                        </p>
                      )}
                    </div>

                    {/* Features list */}
                    <ul className="space-y-3.5 mb-8 flex-1">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2
                            className={`w-5 h-5 mr-3 shrink-0 mt-0.5 ${
                              isPopular ? "text-indigo-500" : "text-emerald-500"
                            }`}
                          />
                          <span className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      href="/contact"
                      className={`w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center transition-all mt-auto ${
                        isPopular
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25"
                          : "bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900"
                      }`}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Scope note for services with + pricing */}
        {service.packages.some((p) => p.price.includes("+")) && (
          <ScrollReveal direction="up" delay={0.2}>
            <div className="mt-10 flex items-start max-w-2xl mx-auto p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0 mr-3" />
              <p className="text-sm text-amber-800 dark:text-amber-400/90 leading-relaxed">
                Prices marked with <strong>+</strong> are starting points. Final
                quotation depends on scope, integrations and delivery
                requirements. Contact us for a custom quote.
              </p>
            </div>
          </ScrollReveal>
        )}
      </section>

      {/* ── WHO IT'S FOR ── */}
      {idealForItems.length > 0 && (
        <section className="py-16 px-6 max-w-7xl mx-auto w-full">
          <ScrollReveal direction="up" className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Users className="w-3.5 h-3.5" />
              Who It&apos;s For
            </div>
            <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-zinc-50 mb-3">
              Perfect For
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              {service.name} is designed to serve a wide range of businesses at
              every growth stage.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {idealForItems.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction="up">
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-3">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {item.replace(/^Best for\s+/i, "")}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* ── ADD-ONS ── */}
      {service.addOns && service.addOns.length > 0 && (
        <section className="py-16 px-6 max-w-7xl mx-auto w-full">
          <ScrollReveal direction="up" className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-zinc-50 mb-3">
              Optional Add-ons
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Enhance your package with specialised additions tailored to your
              project needs.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {service.addOns.map((addon, i) => (
              <ScrollReveal key={i} delay={i * 0.08} direction="up">
                <div className="flex items-start p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/30 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mr-4 shrink-0">
                    <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1">
                      {addon.name}
                    </h4>
                    <div className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {addon.price}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      {service.process && service.process.length > 0 && (
        <section className="py-24 relative bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200 dark:border-zinc-800/50">
          <div className="px-6 max-w-7xl mx-auto w-full">
            <ScrollReveal direction="up" className="text-center mb-16">
              <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-zinc-50 mb-3">
                How It Works
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
                A clear, structured process — from your first message to final
                delivery.
              </p>
            </ScrollReveal>

            <div
              className={`grid grid-cols-1 gap-8 ${
                service.process.length <= 4
                  ? "md:grid-cols-4"
                  : "md:grid-cols-3"
              }`}
            >
              {service.process.map((step, i) => (
                <ScrollReveal
                  key={i}
                  delay={i * 0.1}
                  direction="up"
                  className="relative"
                >
                  {/* Connector line */}
                  {i < service.process!.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-zinc-200 dark:bg-zinc-800 z-0" />
                  )}
                  <div className="relative flex flex-col items-center text-center z-10">
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-[#0e0e11] border-2 border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center font-display font-bold text-xl text-indigo-600 dark:text-indigo-400 mb-5 shadow-sm">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-24 px-6 max-w-3xl mx-auto w-full">
          <ScrollReveal direction="up" className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-zinc-50 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Everything you need to know about {service.name}.
            </p>
          </ScrollReveal>

          <div className="space-y-3">
            {service.faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.06} direction="up">
                <details className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-sm text-zinc-900 dark:text-zinc-100 list-none hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {faq.question}
                    <span className="transition-transform duration-200 group-open:rotate-180 ml-4 shrink-0">
                      <ChevronDown className="w-5 h-5 text-zinc-400" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60">
                    {faq.answer}
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-6 max-w-4xl mx-auto w-full text-center mb-12">
        <ScrollReveal direction="up">
          <div className="p-10 sm:p-14 rounded-3xl bg-zinc-900 dark:bg-[#0e0e11] border border-zinc-800 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-1/4 left-1/4 w-1/2 h-1/2 bg-indigo-500/10 blur-[80px] rounded-full" />
              <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-purple-500/10 blur-[60px] rounded-full" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 border border-white/10 text-white/60 text-[11px] font-mono font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                NSD Creations
              </div>

              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4 leading-tight">
                Ready to build something{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  better?
                </span>
              </h2>

              <p className="text-zinc-400 mb-10 max-w-lg leading-relaxed">
                Partner with NSD Creations to leverage cutting-edge{" "}
                {service.category.toLowerCase()} solutions tailored to your
                unique goals.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_40px_rgba(99,102,241,0.25)] hover:shadow-[0_0_60px_rgba(99,102,241,0.4)] transition-all active:scale-95 w-full sm:w-auto"
                >
                  Get a Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <a
                  href="https://wa.me/916303849852"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all active:scale-95 w-full sm:w-auto"
                >
                  <MessageSquare className="w-4 h-4 mr-2 text-emerald-400" />
                  Talk to NSD
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
