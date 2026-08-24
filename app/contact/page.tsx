"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  Database,
  Trash2
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    businessName: "",
    service: "website-development",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Validate Phone if provided
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setErrorMsg("Phone number must be exactly 10 digits");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setSubmitted(true);
      // Reset fields except service
      setFormData({
        name: "",
        email: "",
        countryCode: "+91",
        phone: "",
        businessName: "",
        service: formData.service,
        message: ""
      });

      // Clear confirmation after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/916303849852?text=${encodeURIComponent(
    `Hello Sai Dheeraj! I am submitting an inquiry. Name: ${formData.name || "Client"}, Service: ${formData.service}, Message: ${formData.message || "I'd like to discuss a project."}`
  )}`;

  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden">
      <Navbar />

      {/* Grid Overlay background */}
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      {/* Hero Header */}
      <section className="pt-24 pb-12 px-6 max-w-7xl mx-auto w-full text-left">
        <ScrollReveal direction="up" className="max-w-2xl flex flex-col space-y-4">
          <span className="text-xs font-mono font-bold tracking-wider text-indigo-500 uppercase">
            Let&apos;s Construct Your Launch
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            Connect With Us <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-400 dark:to-indigo-500">
              to Secure Your Custom Quote.
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
            Have an idea or operational block? Share details below to submit your request securely or initiate a direct chat session with Sai Dheeraj Nalkari immediately.
          </p>
        </ScrollReveal>
      </section>

      {/* Contact Grid layout */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Contact Form Container (Left) */}
        <ScrollReveal direction="right" className="lg:col-span-7">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200/60 dark:border-zinc-900/60 shadow-sm relative">
            <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100 mb-6 flex items-center">
              <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
              Project Enquiry Form
            </h2>

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs md:text-sm font-semibold flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 shrink-0" />
                <span>Thank you! Your project request has been submitted successfully. We will reach out shortly.</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs md:text-sm font-semibold flex items-center">
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="mb-6 p-5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-400/5 border border-indigo-500/10 dark:border-indigo-400/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Prefer our Express Booking?</h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">Complete our official 1-minute Google Form instead.</p>
              </div>
              <a
                href="https://tinyurl.com/startwithNSD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4.5 py-2.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 shadow-md transition-all duration-200"
              >
                Go to Google Form &rarr;
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className="w-full px-4.5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900/60 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@brand.com"
                    className="w-full px-4.5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900/60 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                    Phone Number
                  </label>
                  <div className="flex space-x-2">
                    <select
                      id="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="w-1/3 px-4.5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900/60 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="+91">+91 (IN)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+971">+971 (AE)</option>
                      <option value="+61">+61 (AU)</option>
                    </select>
                    <input
                      type="text"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-2/3 px-4.5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900/60 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="businessName" className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                    Company / Brand Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-4.5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900/60 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                  Service Required
                </label>
                <select
                  id="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4.5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900/60 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500"
                >
                  <option value="website-development">Website Development (Next.js)</option>
                  <option value="ai-video-advertisements">AI Video Advertisements</option>
                  <option value="ai-product-commercials">AI Product Commercials</option>
                  <option value="tribute-videos">AI Memorial Tribute Videos</option>
                  <option value="poster-designing">Poster Designing</option>
                  <option value="graphic-designing">Graphic Designing</option>
                  <option value="mobile-app-development">Mobile App Development</option>
                  <option value="ai-automation">AI & Workflow Automation</option>
                  <option value="whatsapp-automation">WhatsApp Automation</option>
                  <option value="branding">Brand Identity Creation</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-[11px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                  Project Description *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your design parameters, preferred scripts, or custom tech integrations..."
                  className="w-full px-4.5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900/60 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg active:scale-95 transition-all text-center"
                >
                  {loading ? "Submitting..." : "Submit Inquiry"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg active:scale-95 transition-all text-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp Direct Chat
                </Link>
              </div>
            </form>
          </div>
        </ScrollReveal>

        {/* Info & Submissions Container (Right) */}
        <ScrollReveal direction="left" delay={0.2} className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* Official Agency info box */}
          <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-[#09090b] border border-zinc-200/50 dark:border-zinc-900/50 shadow-sm space-y-5">
            <h3 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100">
              Office Parameters
            </h3>

            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-indigo-500">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-zinc-400 uppercase">Headquarters</p>
                <p className="text-xs md:text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                  Hyderabad, Telangana, India
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-indigo-500">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-zinc-400 uppercase">Inquiries Email</p>
                <p className="text-xs md:text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                  nsd.creations.official@gmail.com
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-emerald-500">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-zinc-400 uppercase">Call / WhatsApp</p>
                <p className="text-xs md:text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                  +91 63038 49852
                </p>
              </div>
            </div>
          </div>


        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
