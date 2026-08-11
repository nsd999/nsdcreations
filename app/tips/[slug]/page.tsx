import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowLeft, Phone, Mail, Globe, ArrowRight, Lightbulb, Target, Settings, AlertTriangle } from "lucide-react";
import { tipsData } from "@/lib/tips-data";

export async function generateStaticParams() {
  return tipsData.map((tip) => ({
    slug: tip.slug,
  }));
}

export default function TipDetailsPage({ params }: { params: { slug: string } }) {
  const tip = tipsData.find((t) => t.slug === params.slug);

  if (!tip) {
    notFound();
  }

  const whatsappMessage = encodeURIComponent(
    `Hi, I have seen this tip "${tip.title}" and I have found it useful. Thank you NSD Creations.`
  );
  const whatsappLink = `https://wa.me/916303849852?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar />

      <section className="pt-32 pb-20 relative">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-indigo-900/20 to-black pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Link 
              href="/tips" 
              className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all strategies
            </Link>

            <ScrollReveal>
              <div className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm font-semibold mb-6">
                {tip.category}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {tip.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 font-light mb-16 leading-relaxed border-l-4 border-indigo-500 pl-6">
                {tip.excerpt}
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-12">
                
                {/* Section 1: Simple Explanation */}
                <ScrollReveal delay={100}>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Lightbulb className="w-24 h-24 text-indigo-400" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center text-indigo-300">
                      The Concept, Explained Simply
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed relative z-10">
                      {tip.simpleExplanation || tip.content}
                    </p>
                  </div>
                </ScrollReveal>

                {/* Section 2: Why it Matters */}
                {tip.whyItMatters && (
                  <ScrollReveal delay={200}>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target className="w-24 h-24 text-indigo-400" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center text-indigo-300">
                        Why It Matters For Your Business
                      </h2>
                      <p className="text-gray-300 text-lg leading-relaxed relative z-10">
                        {tip.whyItMatters}
                      </p>
                    </div>
                  </ScrollReveal>
                )}

                {/* Section 3: How it Works */}
                {tip.howItWorks && (
                  <ScrollReveal delay={300}>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Settings className="w-24 h-24 text-indigo-400" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center text-indigo-300">
                        How It Works In Practice
                      </h2>
                      <p className="text-gray-300 text-lg leading-relaxed relative z-10">
                        {tip.howItWorks}
                      </p>
                    </div>
                  </ScrollReveal>
                )}

                {/* Section 4: The Hard Reality */}
                {tip.theHardReality && (
                  <ScrollReveal delay={400}>
                    <div className="bg-gradient-to-br from-red-950/40 to-black border border-red-500/20 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                        <AlertTriangle className="w-32 h-32 text-red-500" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center text-red-400">
                        The Brutal Truth
                      </h2>
                      <p className="text-gray-300 text-lg leading-relaxed relative z-10 font-medium">
                        {tip.theHardReality}
                      </p>
                    </div>
                  </ScrollReveal>
                )}
              </div>

              {/* Sticky Sidebar / CTA Credentials */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 space-y-6">
                  <ScrollReveal delay={500}>
                    <div className="bg-gradient-to-b from-white/10 to-transparent border border-white/10 p-8 rounded-3xl backdrop-blur-md">
                      <h3 className="text-2xl font-bold mb-2">Need Experts?</h3>
                      <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                        Understanding this concept is easy. Executing it flawlessly requires a dedicated team of elite professionals. Let NSD Creations engineer this for your business.
                      </p>
                      
                      <div className="space-y-4 mb-8">
                        <a href="tel:+916303849852" className="flex items-center text-gray-300 hover:text-indigo-400 transition-colors group">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-indigo-500/20">
                            <Phone className="w-4 h-4" />
                          </div>
                          +91 63038 49852
                        </a>
                        
                        <a href="mailto:nsd.creations.official@gmail.com" className="flex items-center text-gray-300 hover:text-indigo-400 transition-colors group">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-indigo-500/20">
                            <Mail className="w-4 h-4" />
                          </div>
                          <span className="truncate max-w-[200px]">nsd.creations.official@gmail.com</span>
                        </a>

                        <Link href="/portfolio" className="flex items-center text-gray-300 hover:text-indigo-400 transition-colors group">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover:bg-indigo-500/20">
                            <Globe className="w-4 h-4" />
                          </div>
                          View Our Portfolio
                        </Link>
                      </div>

                      <div className="space-y-3">
                        <Link 
                          href="/contact" 
                          className="flex items-center justify-center w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
                        >
                          Book Free Consultation
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                        
                        <a 
                          href={whatsappLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full py-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] rounded-xl font-semibold transition-colors"
                        >
                          Chat on WhatsApp
                        </a>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
