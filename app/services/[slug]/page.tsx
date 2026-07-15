"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { servicesData } from "@/lib/services-data";
import { 
  ArrowLeft, 
  CheckCircle, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  HelpCircle,
  Code2,
  ListTodo,
  Rocket
} from "lucide-react";

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const service = servicesData[slug];

  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  if (!service) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen relative text-center px-6">
        <Navbar />
        <div className="absolute inset-0 grid-background pointer-events-none -z-10" />
        <div className="max-w-md p-8 glass-card rounded-3xl flex flex-col items-center space-y-4">
          <h1 className="font-display font-bold text-2xl text-zinc-900 dark:text-zinc-50">Service Not Found</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            The service path you requested could not be resolved.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center text-xs font-bold tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-full"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Back to Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Find related services by category or siblings
  const relatedServices = Object.values(servicesData)
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden">
      <Navbar />

      {/* Grid Overlay background */}
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      {/* Hero section */}
      <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col space-y-4">
          <Link
            href="/services"
            className="inline-flex items-center text-xs font-mono font-bold text-indigo-500 hover:text-indigo-600 self-start"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            BACK TO SERVICES
          </Link>

          <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 dark:border-indigo-400/10 px-3 py-1 rounded-full self-start">
            {service.category}
          </span>

          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            {service.title}
          </h1>

          <p className="text-zinc-600 dark:text-zinc-300 font-mono text-sm md:text-base leading-relaxed max-w-2xl font-semibold -mt-1 text-indigo-600 dark:text-indigo-400">
            &bull; {service.tagline}
          </p>
        </div>
      </section>

      {/* Two Column Layout: Main content / Sidebar */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 flex flex-col space-y-12">
          
          {/* Overview Block */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100 flex items-center">
              <Sparkles className="w-4 h-4 text-indigo-500 mr-2" />
              Service Overview
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed bg-white dark:bg-[#09090b] p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-900/50">
              {service.overview}
            </p>
          </div>

          {/* Benefits Block */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100 flex items-center">
              <ListTodo className="w-4 h-4 text-indigo-500 mr-2" />
              Key Benefits & Value
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.benefits.map((benefit, i) => (
                <div 
                  key={i} 
                  className="p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 shadow-sm flex items-start"
                >
                  <CheckCircle className="w-5 h-5 text-indigo-500 mr-3 shrink-0 mt-0.5" />
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Process Timeline Block */}
          <div className="space-y-6">
            <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100 flex items-center">
              <Code2 className="w-4 h-4 text-indigo-500 mr-2" />
              Our Custom Execution Process
            </h2>
            <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 pl-6 space-y-8 py-2">
              {service.process.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-[#030303]" />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                    Phase 0{idx + 1}
                  </span>
                  <h3 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100 mt-1 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQS Block */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100 flex items-center">
              <HelpCircle className="w-4 h-4 text-indigo-500 mr-2" />
              Service FAQs
            </h2>
            <div className="space-y-3">
              {service.faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="rounded-2xl border border-zinc-200/60 dark:border-zinc-900/60 bg-white dark:bg-[#09090b] overflow-hidden"
                >
                  <button
                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs md:text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-display"
                  >
                    <span>{faq.question}</span>
                  </button>
                  {faqOpen === index && (
                    <div className="px-5 pb-5 pt-1 text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed border-t border-zinc-100 dark:border-zinc-900/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar Panel (Right) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* Deliverables Box */}
          <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-[#09090b] border border-zinc-200/50 dark:border-zinc-900/50 shadow-sm">
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-50 mb-4 flex items-center">
              <Rocket className="w-4 h-4 text-indigo-500 mr-2" />
              Key Deliverables
            </h3>
            <ul className="space-y-3">
              {service.deliverables.map((del, i) => (
                <li key={i} className="flex items-start text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                  <span>{del}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies Box */}
          <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-[#09090b] border border-zinc-200/50 dark:border-zinc-900/50 shadow-sm">
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-50 mb-3">
              Technologies We Use
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.technologies.map((tech) => (
                <span 
                  key={tech} 
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 font-semibold shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Direct CTA Box */}
          <div className="p-6 rounded-3xl bg-indigo-600 text-white shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">Ready to start this project?</h3>
              <p className="text-indigo-100 text-xs mt-2 leading-relaxed">
                Contact us today to receive a precise quote contract and project scope for {service.title}.
              </p>
            </div>
            <Link
              href={`/#contact`}
              className="mt-6 w-full inline-flex items-center justify-center px-4.5 py-3 rounded-xl text-xs font-bold tracking-widest uppercase bg-white text-indigo-600 hover:bg-zinc-50 transition-all text-center"
            >
              Start This Project
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

        </div>

      </section>

      {/* Related Services List */}
      <section className="py-20 px-6 border-t border-zinc-200/50 dark:border-zinc-900/50 max-w-7xl mx-auto w-full">
        <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100 mb-6">
          Related Agency Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedServices.map((rel) => (
            <Link
              key={rel.slug}
              href={`/services/${rel.slug}`}
              className="group p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all flex flex-col justify-between"
            >
              <div>
                <h4 className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {rel.title}
                </h4>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2">
                  {rel.description}
                </p>
              </div>
              <span className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 font-bold mt-4 block">
                VIEW SPECS &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
