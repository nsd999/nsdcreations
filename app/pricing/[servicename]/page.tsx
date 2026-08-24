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
  ChevronDown
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
  const service = servicesData.find((s) => s.slug === resolvedParams.servicename);
  
  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.seo.title,
    description: service.seo.description,
    keywords: service.seo.keywords,
  };
}

export default async function ServicePricingPage({ params }: Props) {
  const resolvedParams = await params;
  const service = servicesData.find((s) => s.slug === resolvedParams.servicename);

  if (!service) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col relative bg-[#FAFAFA] dark:bg-[#09090b]">
      <Navbar />
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      {/* Breadcrumbs */}
      <div className="pt-24 pb-4 px-6 max-w-7xl mx-auto w-full">
        <nav className="flex text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</Link>
          <ChevronRight className="w-4 h-4 mx-2 mt-0.5" />
          <span className="text-zinc-900 dark:text-zinc-100 font-medium">{service.name}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full text-center">
        <ScrollReveal direction="up" className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-mono font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20 uppercase">
            {service.category}
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight mb-6">
            {service.name}
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            {service.longDescription || service.shortDescription}
          </p>
        </ScrollReveal>
      </section>

      {/* Pricing Packages */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(service.packages.length, 3)} gap-8 max-w-6xl mx-auto`}>
          {service.packages.map((pkg, idx) => {
            const isPopular = pkg.isPopular || (service.packages.length === 3 && idx === 1);
            
            return (
              <ScrollReveal key={pkg.name} delay={idx * 0.1} direction="up" className="h-full">
                <div className={`relative flex flex-col h-full bg-white dark:bg-[#0e0e11] rounded-3xl border transition-all duration-300 ${
                  isPopular 
                    ? "border-indigo-500 shadow-xl shadow-indigo-500/10 dark:shadow-indigo-500/5 transform md:-translate-y-4" 
                    : "border-zinc-200 dark:border-zinc-800/80 hover:border-indigo-500/50"
                }`}>
                  {isPopular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="font-display font-bold text-2xl text-zinc-900 dark:text-zinc-50 mb-2">{pkg.name}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 min-h-[40px]">{pkg.description}</p>
                    
                    <div className="mb-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-end gap-2">
                        <span className="font-display font-bold text-4xl text-zinc-900 dark:text-white">
                          ₹{pkg.priceValue.toLocaleString('en-IN')}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400 mb-1 font-medium">
                          /{pkg.pricePeriod}
                        </span>
                      </div>
                    </div>
                    
                    <ul className="space-y-4 mb-8 flex-1">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className={`w-5 h-5 mr-3 shrink-0 mt-0.5 ${isPopular ? "text-indigo-500" : "text-emerald-500"}`} />
                          <span className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
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
      </section>

      {/* Add-ons */}
      {service.addOns && service.addOns.length > 0 && (
        <section className="py-20 px-6 max-w-7xl mx-auto w-full">
          <ScrollReveal direction="up" className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-zinc-50 mb-4">Optional Add-ons</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Enhance your package with these specialized additions.</p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.addOns.map((addon, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction="up">
                <div className="flex items-start p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mr-4 shrink-0">
                    <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">{addon.name}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 line-clamp-2">{addon.description}</p>
                    <div className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      + ₹{addon.priceValue.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* The Process */}
      {service.process && service.process.length > 0 && (
        <section className="py-24 relative bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800/50">
          <div className="px-6 max-w-7xl mx-auto w-full">
            <ScrollReveal direction="up" className="text-center mb-16">
              <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-zinc-50 mb-4">Our Process</h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">How we deliver exceptional results from kickoff to deployment.</p>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {service.process.map((step, i) => (
                <ScrollReveal key={i} delay={i * 0.1} direction="up" className="relative">
                  {i < service.process!.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-zinc-200 dark:bg-zinc-800" />
                  )}
                  <div className="relative flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-[#0e0e11] border-4 border-indigo-50 dark:border-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-display font-bold text-xl mb-6 shadow-sm z-10">
                      {i + 1}
                    </div>
                    <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-3">{step.title}</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-24 px-6 max-w-3xl mx-auto w-full">
          <ScrollReveal direction="up" className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-zinc-50 mb-4">Frequently Asked Questions</h2>
          </ScrollReveal>
          
          <div className="space-y-4">
            {service.faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction="up">
                <details className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-medium text-zinc-900 dark:text-zinc-100 list-none">
                    {faq.question}
                    <span className="transition group-open:rotate-180 ml-4 shrink-0">
                      <ChevronDown className="w-5 h-5 text-zinc-500" />
                    </span>
                  </summary>
                  <div className="p-6 pt-0 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/50 mt-2">
                    {faq.answer}
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 px-6 max-w-4xl mx-auto w-full text-center mb-12">
        <ScrollReveal direction="up" className="p-12 rounded-3xl bg-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="font-display font-bold text-3xl text-white mb-4">Ready to elevate your business?</h2>
            <p className="text-indigo-100 mb-8 max-w-lg">
              Partner with NSD Creations to leverage cutting-edge {service.category.toLowerCase()} solutions tailored to your unique goals.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase bg-white text-indigo-600 hover:bg-zinc-100 transition-colors shadow-xl"
            >
              Start Your Project
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
