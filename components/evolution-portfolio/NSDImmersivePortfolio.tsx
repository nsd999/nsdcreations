"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Github, Instagram, Linkedin, Mail, Menu, X, Youtube } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { NsdLogo } from "@/components/NsdLogo";

const NAV_ITEMS = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

const SERVICES = [
  { number: "01", title: "Websites & e-commerce", note: "Digital experiences", href: "/services/website-development", description: "Carefully designed websites and storefronts that make it easy for people to understand, trust and choose your business." },
  { number: "02", title: "Apps & custom software", note: "Products & platforms", href: "/services/mobile-app-development", description: "Useful applications and tools shaped around the way your business and customers actually work." },
  { number: "03", title: "AI & automation", note: "Intelligent systems", href: "/services/ai-automation", description: "Practical AI assistants, WhatsApp workflows and connected systems that take repetitive work off your hands." },
  { number: "04", title: "Video & visual storytelling", note: "Film & motion", href: "/services/ai-video-advertisements", description: "Promotional films, AI-assisted commercials and edits that give a brand or idea a clear visual voice." },
  { number: "05", title: "Branding & graphic design", note: "Identity & design", href: "/services/branding-brand-identity", description: "Identity, campaign artwork and design systems that help a business look consistent and recognisable." },
];

const WORK = [
  { title: "Keerthy's Daycare & Kindergarten", category: "PROMOTIONAL FILM", client: "Client work · Private", description: "Promotional and marketing content created to introduce the daycare, its learning environment and its programmes.", image: "/portfolio/daycare-promo.png", alt: "Promotional campaign artwork for Keerthy's Daycare and Kindergarten" },
  { title: "Nutrition & Wellness", category: "VIDEO & CONTENT", client: "Client work · Private", description: "An introduction video and supporting visuals for a personal nutrition and wellness service.", image: "/portfolio/nutrition-wellness.png", alt: "Nutrition and wellness video project artwork" },
  { title: "Tribute & Memory Restoration", category: "AI-ASSISTED FILM", client: "Client work · Private", description: "A personal tribute-film project combining restored photographs, careful pacing and a considered soundscape.", image: "/portfolio/tribute-memorial.png", alt: "Tribute and memory restoration project artwork" },
  { title: "E-commerce Interface", category: "WEB DESIGN", client: "Studio exploration", description: "A storefront interface study focused on product presentation, useful details and a straightforward shopping journey.", image: "/portfolio/ecommerce-web.png", alt: "E-commerce website interface design" },
  { title: "Brand Identity Exploration", category: "BRAND DESIGN", client: "Studio exploration", description: "A visual identity study bringing typography, colour and graphic elements into one consistent system.", image: "/portfolio/branding-identity.png", alt: "Brand identity and visual design exploration" },
  { title: "WhatsApp CRM Workflow", category: "AUTOMATION CONCEPT", client: "Studio exploration", description: "A concept for connecting customer conversations with structured follow-up and business information.", image: "/portfolio/whatsapp-automation.png", alt: "WhatsApp CRM and automation workflow concept" },
];

const PRODUCTS = [
  { name: "SyncWave", type: "REALTIME PRODUCT", description: "A shared listening and viewing experience, with rooms, live chat and synchronised playback.", href: "https://tinyurl.com/syncwaveapp", action: "Visit product" },
  { name: "Brainmate", type: "AI PRODUCT", description: "An AI-assisted wellbeing companion built around thoughtful conversations and daily reflection.", href: "https://brainmate-seven.vercel.app/", action: "Visit product" },
  { name: "QueueLess India", type: "CIVIC-TECH MVP", description: "An early product exploration for making queues at public services easier to understand and manage.", href: null, action: "In development" },
];

const PROCESS = [
  { number: "01", title: "Understand", description: "Start with the people, the problem and what a useful outcome would look like." },
  { number: "02", title: "Shape", description: "Agree on the direction, scope and details before the work gets complicated." },
  { number: "03", title: "Make", description: "Design, build and refine the experience with the right tools for the job." },
  { number: "04", title: "Deliver", description: "Test the important details, share the work and make the next steps clear." },
];

type CmsProject = {
  id: string;
  title: string;
  category?: string | null;
  client?: string | null;
  description?: string | null;
  image?: string | null;
  coverImage?: string | null;
  liveUrl?: string | null;
  link?: string | null;
};
type FormFields = { name: string; email: string; service: string; message: string };

function safeExternalUrl(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export default function NSDImmersivePortfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cmsProjects, setCmsProjects] = useState<CmsProject[]>([]);
  const [form, setForm] = useState<FormFields>({ name: "", email: "", service: "Website / digital experience", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let active = true;
    let inFlight = false;
    const refreshProjects = async () => {
      if (!active || inFlight) return;
      inFlight = true;
      try {
        const response = await fetch("/api/public/portfolio", { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json();
        if (active && Array.isArray(payload.items)) {
          setCmsProjects(payload.items.filter((item: CmsProject) => item && item.id && item.title));
        }
      } catch {
        // The curated portfolio remains visible if the public portfolio feed is unavailable.
      } finally {
        inFlight = false;
      }
    };
    void refreshProjects();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refreshProjects();
    }, 30_000);
    return () => { active = false; window.clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const updateForm = (field: keyof FormFields, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitEnquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setFormStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), service: form.service, message: form.message.trim() }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.success !== true) {
        throw new Error(typeof payload.error === "string" ? payload.error : "Your message could not be sent. Please try again.");
      }
      setFormStatus("success");
      setForm({ name: "", email: "", service: "Website / digital experience", message: "" });
    } catch (error) {
      setFormStatus("error");
      setFormError(error instanceof Error ? error.message : "The enquiry service is unavailable right now.");
    }
  };

  const mailtoHref = "mailto:nsd.creations.official@gmail.com?subject=" +
    encodeURIComponent("Project enquiry — " + form.service) +
    "&body=" +
    encodeURIComponent("Name: " + form.name + "\nEmail: " + form.email + "\nProject: " + form.service + "\n\n" + form.message);

  return (
    <div className="nsd-portfolio-editorial">
      <header className="npe-header">
        <Link href="/" className="npe-brand" aria-label="NSD Creations home">
          <span className="npe-brand-mark"><NsdLogo className="h-full w-full" /></span>
          <span className="npe-brand-copy"><strong>NSD CREATIONS</strong><small>CREATIVE TECHNOLOGY STUDIO</small></span>
        </Link>
        <nav className="npe-nav" aria-label="Portfolio navigation">
          {NAV_ITEMS.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <a className="npe-header-cta" href="#contact">Let’s talk <ArrowUpRight size={15} /></a>
        <button className="npe-mobile-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="npe-mobile-nav" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {menuOpen && (
        <nav id="npe-mobile-nav" className="npe-mobile-nav" aria-label="Mobile portfolio navigation">
          {NAV_ITEMS.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={15} /></a>)}
          <a href="#contact" className="npe-mobile-cta" onClick={() => setMenuOpen(false)}>Start a project <ArrowUpRight size={15} /></a>
        </nav>
      )}

      <main>
        <section className="npe-hero" id="top">
          <div className="npe-hero-copy">
            <p className="npe-eyebrow"><span /> INDEPENDENT CREATIVE TECHNOLOGY STUDIO · HYDERABAD</p>
            <h1>Good ideas deserve <em>good design.</em></h1>
            <p className="npe-hero-lead">I’m Sai Dheeraj — I bring creativity and technology together to make thoughtful digital experiences, useful products and visual stories.</p>
            <p className="npe-hero-support">Through NSD Creations, I work across web, apps, AI automation, branding and video — helping ideas move from a rough brief to something people can use.</p>
            <div className="npe-hero-actions">
              <a href="#work" className="npe-button npe-button-primary">Explore selected work <ArrowRight size={16} /></a>
              <a href="#about" className="npe-quiet-link">A little about me <ArrowUpRight size={15} /></a>
            </div>
            <div className="npe-hero-caption"><span>DESIGN · DEVELOPMENT · STORYTELLING</span><span>AVAILABLE FOR SELECT PROJECTS</span></div>
          </div>
          <div className="npe-hero-portrait">
            <div className="npe-portrait-frame">
              <Image src="/founder.png" alt="Sai Dheeraj Nalkari, founder of NSD Creations" fill priority sizes="(max-width: 760px) 86vw, (max-width: 1100px) 42vw, 38vw" className="npe-portrait-image" />
            </div>
            <div className="npe-portrait-note"><span>SAI DHEERAJ NALKARI</span><span>FOUNDER · NSD CREATIONS</span></div>
          </div>
        </section>

        <section className="npe-intro-strip" aria-label="Portfolio introduction"><span>CREATIVE THINKING</span><i>✳</i><span>CAREFUL EXECUTION</span><i>✳</i><span>USEFUL TECHNOLOGY</span></section>

        <section id="work" className="npe-section npe-work-section">
          <div className="npe-section-heading">
            <div><p className="npe-kicker">01 / SELECTED WORK</p><h2>A few things I’ve <em>made.</em></h2></div>
            <p className="npe-section-intro">A mix of client projects, visual explorations and digital products. Each one starts with a different problem and calls for a different approach.</p>
          </div>
          <div className="npe-work-grid">
            {WORK.map((work, index) => (
              <article className="npe-work-card" key={work.title}>
                <div className="npe-work-image">
                  <Image src={work.image} alt={work.alt} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 32vw" />
                  <span className="npe-work-category">{work.category}</span>
                </div>
                <div className="npe-work-info">
                  <div><p className="npe-work-client">{work.client}</p><h3>{work.title}</h3><p className="npe-work-description">{work.description}</p></div>
                  <span className="npe-work-number">{String(index + 1).padStart(2, "0")}</span>
                </div>
              </article>
            ))}
          </div>

          {cmsProjects.length > 0 && (
            <div className="npe-latest-work">
              <div className="npe-subheading"><div><p className="npe-kicker">RECENT ADDITIONS</p><h3>Latest from the studio</h3></div><span>UPDATED FROM NSD CREATIONS</span></div>
              <div className="npe-cms-grid">
                {cmsProjects.slice(0, 6).map((project) => {
                  const image = project.coverImage || project.image;
                  const href = safeExternalUrl(project.liveUrl || project.link);
                  return (
                    <article key={project.id} className="npe-cms-card">
                      {image ? <div className="npe-cms-image"><img src={image} alt={project.title} loading="lazy" /></div> : <div className="npe-cms-image npe-cms-placeholder">NSD CREATIONS</div>}
                      <div className="npe-cms-copy">
                        <span>{project.category || "PROJECT"}{project.client ? " · " + project.client : ""}</span>
                        <h4>{project.title}</h4>
                        {project.description && <p>{project.description}</p>}
                        {href && <a href={href} target="_blank" rel="noopener noreferrer">View project <ArrowUpRight size={14} /></a>}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          <div className="npe-product-work">
            <div className="npe-subheading"><div><p className="npe-kicker">DIGITAL PRODUCTS</p><h3>Things I’m building</h3></div><span>PRODUCT THINKING · ENGINEERING</span></div>
            <div className="npe-product-list">
              {PRODUCTS.map((product, index) => (
                <article className="npe-product-row" key={product.name}>
                  <span className="npe-product-number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="npe-product-main"><span>{product.type}</span><h4>{product.name}</h4></div>
                  <p>{product.description}</p>
                  {product.href ? <a href={product.href} target="_blank" rel="noopener noreferrer" className="npe-product-link">{product.action} <ArrowUpRight size={15} /></a> : <span className="npe-product-status">{product.action}</span>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="npe-section npe-services-section">
          <div className="npe-section-heading">
            <div><p className="npe-kicker">02 / WHAT I DO</p><h2>Different skills. <em>One joined-up approach.</em></h2></div>
            <p className="npe-section-intro">The right solution isn’t always one tool or one discipline. I bring the pieces together around what the project actually needs.</p>
          </div>
          <div className="npe-services-list">
            {SERVICES.map((service) => (
              <Link href={service.href} className="npe-service-row" key={service.number}>
                <span className="npe-service-number">{service.number}</span>
                <div className="npe-service-name"><span>{service.note}</span><h3>{service.title}</h3></div>
                <p>{service.description}</p>
                <span className="npe-service-arrow"><ArrowUpRight size={19} /></span>
              </Link>
            ))}
          </div>
          <div className="npe-services-footer"><span>Looking for something more specific?</span><Link href="/services">Explore all services <ArrowRight size={15} /></Link></div>
        </section>

        <section id="about" className="npe-about-section">
          <div className="npe-about-mark" aria-hidden="true">NSD.</div>
          <div className="npe-about-grid">
            <div className="npe-about-heading"><p className="npe-kicker">03 / A LITTLE ABOUT ME</p><h2>Curiosity first.<br /><em>Craft always.</em></h2></div>
            <div className="npe-about-copy">
              <p className="npe-about-lead">NSD Creations started with a simple goal: help a small business tell its story a little better.</p>
              <p>My first projects were promotional videos for Keerthy’s Daycare & Kindergarten. That work opened the door to visual design, editing, websites and, eventually, building applications and automation systems.</p>
              <p>Today I enjoy working across those disciplines — not because every project needs everything, but because understanding both the creative side and the technical side helps me choose what will work best.</p>
              <div className="npe-about-signoff"><span>SAI DHEERAJ NALKARI</span><span>FOUNDER, NSD CREATIONS</span></div>
            </div>
          </div>
        </section>

        <section id="process" className="npe-section npe-process-section">
          <div className="npe-section-heading">
            <div><p className="npe-kicker">04 / HOW I WORK</p><h2>Good work comes from <em>clear thinking.</em></h2></div>
            <p className="npe-section-intro">A straightforward process keeps the project focused, the communication clear and the finished work useful.</p>
          </div>
          <div className="npe-process-grid">
            {PROCESS.map((step) => <article className="npe-process-item" key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}
          </div>
        </section>

        <section id="contact" className="npe-contact-section">
          <div className="npe-contact-heading">
            <p className="npe-kicker">05 / CONTACT</p><h2>Have a good idea?<br /><em>Let’s give it shape.</em></h2>
            <p>Tell me a little about what you’re working on. I’ll get back to you to discuss the next step.</p>
            <a className="npe-contact-email" href="mailto:nsd.creations.official@gmail.com"><Mail size={16} /> nsd.creations.official@gmail.com</a>
          </div>
          <div className="npe-contact-form-wrap">
            {formStatus === "success" ? (
              <div className="npe-form-success" role="status"><span><Check size={19} /></span><h3>Thank you for reaching out.</h3><p>Your enquiry has been received by NSD Creations.</p><button type="button" onClick={() => setFormStatus("idle")}>Send another message</button></div>
            ) : (
              <form className="npe-contact-form" onSubmit={submitEnquiry}>
                <div className="npe-form-two">
                  <label>Your name<input type="text" name="name" autoComplete="name" value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="Name" required maxLength={100} /></label>
                  <label>Email address<input type="email" name="email" autoComplete="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} placeholder="you@example.com" required maxLength={254} /></label>
                </div>
                <label>What can I help with?
                  <select name="service" value={form.service} onChange={(event) => updateForm("service", event.target.value)}>
                    <option>Website / digital experience</option><option>Application / product development</option><option>AI / business automation</option><option>Video / visual storytelling</option><option>Branding / graphic design</option><option>Something else</option>
                  </select>
                </label>
                <label>A little about the project<textarea name="message" rows={4} value={form.message} onChange={(event) => updateForm("message", event.target.value)} placeholder="What are you hoping to make?" required minLength={10} maxLength={4000} /></label>
                {formError && <p className="npe-form-error" role="alert">{formError} <a href={mailtoHref}>Email your enquiry instead.</a></p>}
                <div className="npe-form-submit"><span>Usually replies within 1–2 working days.</span><button type="submit" disabled={formStatus === "sending"}>{formStatus === "sending" ? "Sending..." : "Send enquiry"} <ArrowUpRight size={16} /></button></div>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="npe-footer">
        <div className="npe-footer-top">
          <Link href="/" className="npe-footer-brand" aria-label="NSD Creations home">
            <span className="npe-brand-mark"><NsdLogo className="h-full w-full" /></span>
            <span><strong>NSD CREATIONS</strong><small>CREATIVE TECHNOLOGY STUDIO</small></span>
          </Link>
          <p>Creative thinking, useful technology<br />and work made with care.</p>
          <a href="#top" className="npe-back-top">BACK TO TOP ↑</a>
        </div>
        <div className="npe-footer-bottom">
          <span>© {new Date().getFullYear()} NSD CREATIONS · SAI DHEERAJ NALKARI</span>
          <div className="npe-socials">
            <a href="https://instagram.com/nsd.creations.official" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={16} /></a>
            <a href="https://youtube.com/@nsdkaraoke" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={16} /></a>
            <a href="https://github.com/nsd999" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={16} /></a>
            <a href="https://linkedin.com/in/saidheerajnalkari" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
