"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { servicesData } from "@/lib/services-data";
import { ImageWithNSDFallback } from "@/components/ImageWithNSDFallback";
import { Testimonials } from "@/components/Testimonials";
import { AnimatedStats } from "@/components/AnimatedStats";
import { 
  Sparkles, 
  ArrowRight, 
  Video, 
  Tv, 
  Heart, 
  FileImage, 
  Palette, 
  Globe, 
  Smartphone, 
  Cpu, 
  MessageSquare, 
  TrendingUp, 
  Share2, 
  Settings, 
  CheckCircle, 
  ChevronRight, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  ExternalLink,
  ChevronDown,
  Play,
  FileText,
  Workflow
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [servicesTab, setServicesTab] = useState<"creative" | "technical">("creative");
  
  // Contact Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "website-development",
    message: ""
  });

  // Portfolio works array (actual high-quality client assets and real case designs)
  const portfolioWorks = [
    {
      id: 1,
      title: "Keerthy's Daycare & Kindergarten Promotional Video",
      category: "video",
      client: "Keerthy's Daycare & Kindergarten",
      type: "Promotional & Marketing Videos",
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
      description: "High-retention promotional and marketing commercial video produced for Keerthy's Daycare & Kindergarten to boost enrollment and community engagement.",
      link: "https://tinyurl.com/portfoliobynsd"
    },
    {
      id: 2,
      title: "Nutrition & Wellness Introduction Video",
      category: "video",
      client: "Shilpa Palli",
      type: "Nutrition & Wellness Video",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
      description: "Professional introduction video highlighting personalized nutrition and wellness advice, styled with clean layouts and visual guides.",
      link: "https://tinyurl.com/portfoliobynsd"
    },
    {
      id: 3,
      title: "AI Memorial Tribute Video",
      category: "video",
      client: "Santhosh Juluri",
      type: "AI Memorial Tribute Video",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
      description: "Deeply emotional tribute and legacy video utilizing AI-enhanced restored photographs and historical family records synchronized to custom soundscapes.",
      link: "https://tinyurl.com/portfoliobynsd"
    },
    {
      id: 4,
      title: "Interactive E-Commerce Interface",
      category: "web",
      client: "NSD Labs",
      type: "E-Commerce Website",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      description: "Hand-coded, lightning-fast storefront styled with professional, sleek layout structures and seamless navigation.",
      link: "https://tinyurl.com/portfoliobynsd"
    },
    {
      id: 5,
      title: "Corporate Identity Style Guide",
      category: "branding",
      client: "Global Logistics Brand",
      type: "Brand Guidelines",
      image: "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=800&q=80",
      description: "Premium vector graphics, core typography pairs, and standard color guidelines book.",
      link: "https://tinyurl.com/portfoliobynsd"
    },
    {
      id: 6,
      title: "Educational Seminar Flyer",
      category: "poster",
      client: "Telangana Institution",
      type: "Poster Design",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      description: "Bold layout, structured visual grid hierarchy, and print-optimized graphic design.",
      link: "https://tinyurl.com/portfoliobynsd"
    },
    {
      id: 7,
      title: "WhatsApp CRM Integration Flow",
      category: "automation",
      client: "Local Retail Agency",
      type: "AI & API Automation",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
      description: "Automated direct customer query triggers linking WhatsApp Business API with digital data sheets.",
      link: "https://tinyurl.com/portfoliobynsd"
    }
  ];

  const filteredPortfolio = activeCategory === "all" 
    ? portfolioWorks 
    : portfolioWorks.filter(w => w.category === activeCategory);

  const homeFaqs = [
    {
      q: "What services does NSD Creations provide?",
      a: "We are an AI Creative Studio & Digital Agency. We specialize in producing premium AI-driven video advertisements, custom professional websites and app development, corporate branding, professional graphic & poster designing, emotional tribute/legacy videos, and custom WhatsApp/business automation systems."
    },
    {
      q: "Do you require upfront setup or high enterprise licensing fees?",
      a: "No, our mission is to make premium creative technology accessible. Our pricing is flexible, with specific entry-level digital design options starting from just ₹99*, and custom project packages custom-tailored to suit the financial scale of growing startups and local businesses."
    },
    {
      q: "Who is the founder, and where are you based?",
      a: "NSD Creations is founded and led by Sai Dheeraj Nalkari, a Creative Technologist and AI Solutions Specialist. We are headquartered in Hyderabad, Telangana, India, serving local clients as well as global brands online."
    },
    {
      q: "What makes NSD Creations different from traditional marketing agencies?",
      a: "Traditional agencies are slow, expensive, and rely on heavy production overheads. We integrate advanced AI visual generative tools with fast, handcrafted code to complete high-quality projects up to 10x faster and with significantly lower costs, without compromising on premium quality."
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Open a direct WhatsApp pre-filled link for ease of immediate client action
    const text = `Hello Sai Dheeraj! I am contacting you from the NSD Creations website. My name is ${formData.name} (${formData.email}). I am interested in ${formData.service} for my project. Brief: ${formData.message}`;
    const encodedText = encodeURIComponent(text);
    setTimeout(() => {
      window.open(`https://wa.me/916303849852?text=${encodedText}`, "_blank");
    }, 1200);
  };

  // Service helper mappings to map simple icons
  const getServiceIcon = (slug: string) => {
    switch (slug) {
      case "ai-video-advertisements": return <Video className="w-5 h-5 text-indigo-500" />;
      case "ai-product-commercials": return <Tv className="w-5 h-5 text-indigo-500" />;
      case "tribute-videos": return <Heart className="w-5 h-5 text-red-500" />;
      case "poster-designing": return <FileImage className="w-5 h-5 text-indigo-500" />;
      case "graphic-designing": return <Palette className="w-5 h-5 text-indigo-500" />;
      case "website-development": return <Globe className="w-5 h-5 text-indigo-500" />;
      case "mobile-app-development": return <Smartphone className="w-5 h-5 text-indigo-500" />;
      case "ai-automation": return <Cpu className="w-5 h-5 text-indigo-500" />;
      case "whatsapp-automation": return <MessageSquare className="w-5 h-5 text-emerald-500" />;
      case "branding": return <Sparkles className="w-5 h-5 text-amber-500" />;
      case "digital-marketing": return <TrendingUp className="w-5 h-5 text-indigo-500" />;
      case "social-media-management": return <Share2 className="w-5 h-5 text-indigo-500" />;
      case "business-automation": return <Workflow className="w-5 h-5 text-indigo-500" />;
      case "custom-software-development": return <Settings className="w-5 h-5 text-indigo-500" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col relative">
      <Navbar />

      {/* Grid Overlay background */}
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 px-6 overflow-hidden">
        {/* Floating gradient orbs */}
        <div className="absolute top-1/4 left-1/10 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse-slow -z-10" />
        <div className="absolute bottom-1/5 right-1/10 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content Left */}
          <div className="lg:col-span-7 flex flex-col text-left space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 dark:border-indigo-400/10 self-start">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                Premium AI Creative Studio
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.1]">
              Your Creative <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 dark:from-indigo-400 dark:via-indigo-500 dark:to-purple-400">
                Technology Partner.
              </span>
            </h1>

            <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
              Helping businesses transform ideas into powerful digital experiences through AI-powered creativity, modern websites, branding, automations, and compelling cinematic visual storytelling.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <a
                href="https://tinyurl.com/startwithNSD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-7 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-95 transition-all text-center"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <Link
                href="#portfolio"
                className="inline-flex items-center justify-center px-7 py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all text-center"
              >
                Explore Portfolio
              </Link>
            </div>

            {/* Quick trust bullet points */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-zinc-100 dark:border-zinc-900 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-indigo-500 mr-2" />
                Trusted by 30+ Clients
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-indigo-500 mr-2" />
                20+ Projects Completed
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-indigo-500 mr-2" />
                Since 2022
              </span>
            </div>
          </div>

          {/* Hero Glassmorphic Image Mock right */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl p-4 glass-card overflow-hidden group shadow-2xl">
              {/* Outer decorative glowing elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500" />

              {/* Founder image card */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-900/50">
                <ImageWithNSDFallback
                  src="/images/founder.png"
                  alt="Sai Dheeraj Nalkari - Founder of NSD Creations"
                  className="w-full h-full"
                  fill
                  priority
                />
                
                {/* Floating status label inside container */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#030303]/75 backdrop-blur-md rounded-2xl p-4 border border-zinc-800 text-left z-10">
                  <p className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase">Sai Dheeraj Nalkari</p>
                  <p className="text-sm font-display font-semibold text-white mt-0.5">Creative Technologist & Founder</p>
                  <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-zinc-800 text-[10px] text-zinc-400 font-mono">
                    <span>HYDERABAD, INDIA</span>
                    <Link href="/meet-the-founder" className="text-indigo-400 hover:text-indigo-300 flex items-center font-bold">
                      MEET THE FOUNDER
                      <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <AnimatedStats />

      {/* Company Story Section (Emotional Origin) */}
      <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="text-xs font-mono tracking-wider text-indigo-500 uppercase font-bold">
              Our Journey & Roots
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-900 dark:text-zinc-50 tracking-tight">
              Started with a simple idea of helping local brands.
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              NSD Creations started by creating promotional and marketing videos for our founder&apos;s mother&apos;s business, Keerthy&apos;s Daycare & Kindergarten. After seeing the incredible results, his mother encouraged him to help other businesses that could not afford expensive marketing agencies. That became the foundation of NSD Creations.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              Later, NSD Creations expanded to serve clients across diverse industries—including nutrition, wellness, AI memorial tribute videos, branding, hand-coded websites, AI automation, and digital marketing.
            </p>
            <div className="pt-2">
              <Link
                href="/meet-the-founder"
                className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                Read our full personal story
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission Card */}
            <div className="p-8 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 shadow-sm flex flex-col space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">Our Mission</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">
                To make premium, enterprise-quality creative technologies accessible to growing businesses, ensuring professional digital storytelling, clean websites, and automation are affordable for everyone.
              </p>
            </div>

            {/* Vision Card */}
            <div className="p-8 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 shadow-sm flex flex-col space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">Our Vision</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">
                To build India&apos;s most trusted creative technology studio by consistently matching the execution quality of global brands while protecting client affordability and offering personal, dedicated attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 border-t border-zinc-200/50 dark:border-zinc-900/50 bg-zinc-50/40 dark:bg-[#050505]/20">
        <div className="max-w-7xl mx-auto flex flex-col space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="max-w-xl flex flex-col space-y-4 text-left">
              <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">
                Our Agency Offerings
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-900 dark:text-zinc-50 tracking-tight">
                Bespoke Services Engineered for Fast Business Growth.
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                We leverage modern web frameworks, AI generation tools, and direct-response marketing copywriting to create stunning assets that capture clients.
              </p>
            </div>

            {/* Custom Premium Animated Sliding Tabs */}
            <div className="flex items-center gap-4 flex-wrap shrink-0">
              <button
                onClick={() => setServicesTab("creative")}
                className={`relative px-8 py-3.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 ease-out cursor-pointer shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 ${
                  servicesTab === "creative"
                    ? "bg-gradient-to-r from-[#FF8A00] to-[#FFA726] text-zinc-950 border border-[#FF8A00]/30 shadow-[#FF8A00]/20 dark:shadow-[#FF8A00]/10"
                    : "bg-white/10 dark:bg-[#121214]/40 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md"
                } hover:shadow-[0_0_25px_rgba(255,138,0,0.35)]`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Creative
              </button>
              
              <button
                onClick={() => setServicesTab("technical")}
                className={`relative px-8 py-3.5 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 ease-out cursor-pointer shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 ${
                  servicesTab === "technical"
                    ? "bg-gradient-to-r from-[#6D5BFF] to-[#8A6CFF] text-white border border-[#6D5BFF]/30 shadow-[#6D5BFF]/20 dark:shadow-[#6D5BFF]/10"
                    : "bg-white/10 dark:bg-[#121214]/40 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md"
                } hover:shadow-[0_0_25px_rgba(109,91,255,0.35)]`}
              >
                <Globe className="w-3.5 h-3.5" />
                Web Development
              </button>
            </div>
          </div>

          {/* Service Cards Grid with Staggered Transition */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="wait">
              {Object.values(servicesData)
                .filter((service) => {
                  const creativeSlugs = [
                    "ai-video-advertisements",
                    "ai-product-commercials",
                    "ai-ugc-advertisements",
                    "marketing-videos",
                    "tribute-videos",
                    "poster-designing",
                    "graphic-designing",
                    "branding",
                    "social-media-management",
                    "digital-marketing"
                  ];
                  const technicalSlugs = [
                    "website-development",
                    "custom-software-development",
                    "mobile-app-development",
                    "ai-automation",
                    "whatsapp-automation",
                    "business-automation"
                  ];
                  return servicesTab === "creative"
                    ? creativeSlugs.includes(service.slug)
                    : technicalSlugs.includes(service.slug);
                })
                .map((service, index) => (
                  <motion.div
                    key={service.slug}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="flex flex-col h-full"
                  >
                    <Link
                      href={`/services/${service.slug}`}
                      className="group p-6 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300 shadow-sm flex flex-col justify-between h-full premium-glass-hover"
                    >
                      <div>
                        <div className="w-11 h-11 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                          {getServiceIcon(service.slug)}
                        </div>
                        <h3 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900/80 flex items-center text-xs font-semibold text-indigo-500 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                        Learn more & deliverables
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Portfolio Grid & Case Studies Section */}
      <section id="portfolio" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="max-w-xl flex flex-col space-y-3">
              <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">
                Featured Creative Work
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-900 dark:text-zinc-50 tracking-tight">
                Our Proven Record of Stunning Deliverables.
              </h2>
            </div>
            <Link
              href="https://tinyurl.com/portfoliobynsd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase bg-zinc-900 dark:bg-white text-white dark:text-black hover:scale-102 transition-all shadow-sm"
            >
              View Full Portfolio
              <ExternalLink className="w-3.5 h-3.5 ml-2" />
            </Link>
          </div>

          {/* Portfolio Categories Filters */}
          <div className="flex flex-wrap gap-2.5 border-b border-zinc-200/40 dark:border-zinc-900/40 pb-4">
            {[
              { id: "all", label: "All Projects" },
              { id: "video", label: "AI Video & Tribute" },
              { id: "web", label: "Next.js Websites & Apps" },
              { id: "branding", label: "Branding" },
              { id: "poster", label: "Posters" },
              { id: "automation", label: "AI Automations" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4.5 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
                  activeCategory === cat.id
                    ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/10"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Portfolio Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPortfolio.map((work) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={work.id}
                  className="group flex flex-col bg-white dark:bg-[#09090b] rounded-3xl overflow-hidden border border-zinc-200/60 dark:border-zinc-900/60 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Card Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                    <ImageWithNSDFallback
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full group-hover:scale-103 transition-transform duration-500"
                      fill
                    />
                    <div className="absolute top-4 left-4 bg-[#030303]/80 backdrop-blur-md border border-zinc-800 text-[10px] font-mono font-bold tracking-widest text-indigo-400 px-3 py-1.5 rounded-full uppercase z-10">
                      {work.type}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                        Client: {work.client}
                      </span>
                      <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 mt-1 mb-2">
                        {work.title}
                      </h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">
                        {work.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900/80 flex items-center justify-between">
                      <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                        Portfolio Case
                      </span>
                      <Link
                        href={work.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs font-bold text-zinc-800 hover:text-indigo-600 dark:text-zinc-200 dark:hover:text-indigo-400 transition-colors"
                      >
                        Explore Project
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Interactive Photo Enhancement / Tribute restoration representation */}
      <section className="py-24 px-6 border-t border-zinc-200/50 dark:border-zinc-900/50 bg-zinc-50/50 dark:bg-[#030303]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col space-y-6 text-left">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">
              Restoration Craftsmanship
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-900 dark:text-zinc-50 tracking-tight">
              Giving new life to physical family memories.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              For Tribute and Legacy Videos, we restore, colorize, and enhance ancient low-resolution photographs. Witness how physical printed memories from the late 20th century are transformed into crisp, modern cinematic digital portraits ready for living room screens.
            </p>
            <div className="space-y-3 font-sans text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2.5" /> High-frequency facial reconstruction algorithms.
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2.5" /> Respectful digital colour restoration mapping.
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2.5" /> Removal of physical tears, creases, and coffee spots.
              </div>
            </div>
          </div>

          {/* Interactive Before After Representation */}
          <div className="lg:col-span-6 flex flex-col space-y-3">
            <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl group">
              {/* Dual picture showcase split vertically */}
              <div className="absolute inset-0 flex">
                {/* Left side (Enhanced) */}
                <div className="w-1/2 h-full relative overflow-hidden border-r border-indigo-500/30">
                  <ImageWithNSDFallback
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                    alt="Enhanced Portrait"
                    className="absolute top-0 left-0 w-[200%] h-full"
                    fill
                  />
                  <div className="absolute bottom-3 left-3 bg-indigo-600 text-white font-mono text-[9px] px-2.5 py-1 rounded-md font-bold uppercase tracking-widest z-10">
                    AI Enhanced Restored
                  </div>
                </div>
                {/* Right side (Original) */}
                <div className="w-1/2 h-full relative overflow-hidden bg-amber-950/20">
                  <ImageWithNSDFallback
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                    alt="Original legacy photo"
                    className="absolute top-0 right-0 w-[200%] h-full filter sepia contrast-75 saturate-50 blur-[1.5px]"
                    fill
                  />
                  <div className="absolute bottom-3 right-3 bg-[#030303]/80 border border-zinc-700 text-zinc-400 font-mono text-[9px] px-2.5 py-1 rounded-md uppercase tracking-widest z-10">
                    Original Legacy
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center font-mono text-[10px] text-zinc-400 dark:text-zinc-500 italic">
              *Interactive representation of historical family visual assets. Results vary based on physical photo wear.
            </p>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col space-y-12 text-center items-center">
          <div className="max-w-xl flex flex-col space-y-3">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">
              Target Sectors
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-900 dark:text-zinc-50 tracking-tight">
              Crafting solutions for diverse industries.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              From local startups to prominent education institutes, we deploy tailored creatives and automation workflows built to drive value.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3.5 max-w-4xl">
            {[
              "Startups", "Small Businesses", "Educational Institutions", "Restaurants & Cafes",
              "Healthcare", "Real Estate Providers", "Retail Brands", "Creators",
              "Influencers", "Technology Ventures", "NGOs", "Service Businesses"
            ].map((ind) => (
              <div
                key={ind}
                className="px-6 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-xs md:text-sm shadow-sm hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300"
              >
                {ind}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our 7-Stage Process */}
      <section className="py-24 px-6 border-t border-zinc-200/50 dark:border-zinc-900/50 bg-zinc-50/40 dark:bg-[#050505]/20">
        <div className="max-w-7xl mx-auto flex flex-col space-y-16">
          {/* Header */}
          <div className="max-w-xl flex flex-col space-y-3">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">
              How We Work
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-900 dark:text-zinc-50 tracking-tight">
              Our 7-Stage Execution Process.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              We align tasks meticulously to prevent miscommunications and ensure speedy, high-quality, on-time project handovers.
            </p>
          </div>

          {/* Process Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 relative">
            {[
              { num: "01", name: "Discovery", desc: "Understanding goals, budget, and brand details." },
              { num: "02", name: "Planning", desc: "Setting timeline timelines, scripts, and specifications." },
              { num: "03", name: "Design", desc: "High-fidelity mockups, visual styles, brand book guides." },
              { num: "04", name: "Development", desc: "Hand-coding files, rendering videos, and setups." },
              { num: "05", name: "Review", desc: "Checking feedback loops and perfecting details." },
              { num: "06", name: "Launch", desc: "Publishing sites, deploy, posting ad campaigns." },
              { num: "07", name: "Support", desc: "Continuous improvements and custom optimizations." }
            ].map((step, i) => (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 shadow-sm relative flex flex-col justify-between group hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300"
              >
                <div>
                  <div className="text-2xl font-bold font-mono text-indigo-500/20 dark:text-indigo-400/20 group-hover:text-indigo-500/50 dark:group-hover:text-indigo-400/50 transition-colors">
                    {step.num}
                  </div>
                  <h3 className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-3 mb-1.5">
                    {step.name}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Testimonials Section */}
      <Testimonials />

      {/* Pricing Section */}
      <section className="py-24 px-6 border-t border-zinc-200/50 dark:border-zinc-900/50 bg-zinc-50/40 dark:bg-[#050505]/20">
        <div className="max-w-7xl mx-auto flex flex-col space-y-12 text-center items-center">
          <div className="max-w-xl flex flex-col space-y-3">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">
              Straightforward Pricing
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-900 dark:text-zinc-50 tracking-tight">
              Premium services made affordable.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              We provide clean customized quotes depending on the exact parameters and size of your creative technology project.
            </p>
          </div>

          <div className="p-10 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 shadow-xl max-w-lg w-full text-center flex flex-col items-center">
            <span className="text-xs font-mono font-bold text-indigo-500 tracking-wider uppercase bg-indigo-500/5 dark:bg-indigo-400/5 px-4 py-1.5 rounded-full border border-indigo-500/10 dark:border-indigo-400/10">
              Basic Digital Services
            </span>
            <div className="mt-6 flex items-baseline justify-center">
              <span className="text-zinc-400 dark:text-zinc-500 text-lg font-bold font-sans">Starting from</span>
              <span className="text-5xl font-display font-black text-zinc-900 dark:text-white mx-2">₹99*</span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-4 leading-relaxed">
              Selected graphic designing assets only. Comprehensive custom software, AI video advertisements, and high-conversion websites receive precise customized quote contracts.
            </p>
            <div className="w-full h-px bg-zinc-100 dark:bg-zinc-900 my-6" />
            <ul className="text-left space-y-3 text-xs text-zinc-600 dark:text-zinc-300 w-full font-sans">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-500 mr-2.5" /> Handcrafted, pixel-perfect designs</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-500 mr-2.5" /> 100% vector format deliverables</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-500 mr-2.5" /> Fast 24-48 hours turnarounds</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-500 mr-2.5" /> Full personal advisory consultation</li>
            </ul>
            <a
              href="https://tinyurl.com/startwithNSD"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 w-full inline-flex items-center justify-center px-6 py-4.5 rounded-full text-xs font-bold tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg active:scale-97 transition-all text-center"
            >
              Request Custom Quote
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="flex flex-col space-y-12">
          <div className="text-center flex flex-col space-y-3">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">
              Common Inquiries
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-zinc-900 dark:text-zinc-50 tracking-tight">
              Frequently Asked Questions.
            </h2>
          </div>

          <div className="space-y-4">
            {homeFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-200/60 dark:border-zinc-900/60 bg-white dark:bg-[#09090b] overflow-hidden"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-display font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-100">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                      faqOpen === idx ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {faqOpen === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed border-t border-zinc-50 dark:border-zinc-900/60">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 border-t border-zinc-200/50 dark:border-zinc-900/50 bg-zinc-50/30 dark:bg-[#050505]/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Info Column */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            <div className="flex flex-col space-y-3">
              <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">
                Let&apos;s Partner Up
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-900 dark:text-zinc-50 tracking-tight">
                Start your premium digital project today.
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                Contact Sai Dheeraj directly to schedule a free video consultation. We respond within a maximum of 4 business hours.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 dark:border-indigo-400/10 flex items-center justify-center text-indigo-500 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Call / WhatsApp</p>
                  <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 mt-0.5">+91 63038 49852</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 dark:border-indigo-400/10 flex items-center justify-center text-indigo-500 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Business Email</p>
                  <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 mt-0.5">nsd.creations.official@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 dark:border-indigo-400/10 flex items-center justify-center text-indigo-500 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">HQ Location</p>
                  <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 mt-0.5">Hyderabad, Telangana, India</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 dark:border-indigo-400/10 flex items-center justify-center text-indigo-500 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Business Hours</p>
                  <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 mt-0.5">09:00 AM - 08:00 PM (IST)</p>
                </div>
              </div>
            </div>

            {/* Google maps iframe embedding - completely premium layout */}
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.34203387878!2d78.26795908611145!3d17.4118335198038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78022c0258a!2sHyderabad%2C%20Telangana%2C%20India!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                className="w-full h-full border-0 grayscale dark:invert"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-10 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 shadow-xl relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.form
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleFormSubmit}
                    className="space-y-5"
                  >
                    <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-50">
                      Send a Message to Sai Dheeraj
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="px-4.5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                          placeholder="Sai Kumar"
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="px-4.5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                          placeholder="client@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Phone / WhatsApp Number</label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="px-4.5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                          placeholder="+91 99999 88888"
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Service Needed *</label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="px-4.5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500 appearance-none"
                        >
                          {Object.values(servicesData).map((srv) => (
                            <option key={srv.slug} value={srv.slug}>
                              {srv.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Tell Us About Your Project *</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="px-4.5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500 resize-none"
                        placeholder="Briefly explain what you want us to create (e.g. video script, app concept, menu design)..."
                      />
                    </div>

                    <div className="pt-3 flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
                      <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                        * Submission triggers instant secure redirect to WhatsApp.
                      </span>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center px-6.5 py-4 rounded-xl text-xs font-bold tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg active:scale-97 transition-all"
                      >
                        Submit & Launch WhatsApp
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-12 text-center flex flex-col items-center space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-2xl text-zinc-900 dark:text-zinc-50">
                        Message Prepared Successfully!
                      </h4>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                        Redirecting you to start your direct secure chat with Sai Dheeraj on WhatsApp to discuss your quote immediately...
                      </p>
                    </div>
                    <Link
                      href={`https://wa.me/916303849852?text=${encodeURIComponent(
                        `Hello! This is ${formData.name}. I am interested in ${formData.service}. Message: ${formData.message}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-3 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
                    >
                      Click if not redirected
                      <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
