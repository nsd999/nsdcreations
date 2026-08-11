import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowLeft, Phone, Mail, Globe, ArrowRight } from "lucide-react";
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

  // Encode the dynamic WhatsApp message
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
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/tips" 
              className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all tips
            </Link>

            <ScrollReveal>
              <div className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm font-semibold mb-6">
                {tip.category}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {tip.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 font-light mb-12 leading-relaxed border-l-4 border-indigo-500 pl-6">
                {tip.excerpt}
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <ScrollReveal delay={200}>
                  <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:text-indigo-300">
                    {/* Simulated rich text content from our data */}
                    <p className="text-gray-300 whitespace-pre-line text-lg leading-loose">
                      {tip.content}
                    </p>
                    
                    <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                      <h3 className="text-2xl font-bold mb-4">The Brutal Truth</h3>
                      <p className="text-gray-400">
                        Understanding this concept is only 5% of the battle. The other 95% is flawless execution. Without the right technical infrastructure, creative talent, and strategic oversight, this knowledge is useless.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Sticky Sidebar / CTA Credentials */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 space-y-6">
                  <ScrollReveal delay={400}>
                    <div className="bg-gradient-to-b from-white/10 to-transparent border border-white/10 p-8 rounded-3xl backdrop-blur-md">
                      <h3 className="text-2xl font-bold mb-2">Need Experts?</h3>
                      <p className="text-gray-400 mb-8 text-sm">
                        Don't waste time trying to master this yourself. Let NSD Creations engineer this for your business.
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
