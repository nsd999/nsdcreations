"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import {
  ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, ChevronLeft, ChevronRight,
  Clock3, ExternalLink, Github, Instagram, Linkedin, Mail, MapPin, Menu, X,
} from "lucide-react";
import {
  useEffect, useRef, useState,
  type CSSProperties, type FormEvent, type KeyboardEvent, type PointerEvent,
} from "react";

import { AdminManagedProjects } from "./AdminManagedProjects";
import { BehindTheEdit } from "./BehindTheEdit";
import { Evolution } from "./Evolution";
import { Experiments } from "./Experiments";
import { FeaturedProjects } from "./FeaturedProjects";
import { Posters } from "./Posters";
import { Projects } from "./Projects";
import { Skills } from "./Skills";
import { Vision } from "./Vision";
import { YouTubeSection } from "./YouTubeSection";
import { NsdLogo } from "@/components/NsdLogo";

const NAV_LINKS = [
  { href: "#top", label: "Home", number: "01" },
  { href: "#disciplines", label: "What I do", number: "02" },
  { href: "#story", label: "My story", number: "03" },
  { href: "#engineering-work", label: "Selected work", number: "04" },
  { href: "#workflow", label: "Process", number: "05" },
  { href: "#contact", label: "Contact", number: "06" },
];

const DOORS = [
  { id: "web", number: "01", title: "Web development", short: "Digital spaces, built with intention.", description: "Websites, e-commerce experiences, interfaces and the systems behind them — designed to feel clear, fast and distinctly yours.", image: "/portfolio/ecommerce-web.png", accent: "#e87542", destination: "#engineering-work", action: "Explore digital products" },
  { id: "apps", number: "02", title: "Apps & products", short: "Useful ideas, turned into products.", description: "Responsive applications, full-stack platforms and product experiences shaped around real workflows, not just polished screens.", image: "/portfolio/whatsapp-automation.png", accent: "#7463e8", destination: "#engineering-work", action: "Explore product work" },
  { id: "ai", number: "03", title: "AI & automation", short: "Intelligence that does useful work.", description: "AI assistants, agentic workflows, WhatsApp automation and connected business systems that reduce repetitive work.", image: "/portfolio/nutrition-wellness.png", accent: "#3b8a7a", destination: "#engineering-work", action: "Explore intelligent systems" },
  { id: "cinema", number: "04", title: "Cinematic creation", short: "Stories with rhythm, mood and feeling.", description: "AI video advertisements, cinematic edits, promotional films, sound design and AI-assisted music experiments.", image: "/portfolio/daycare-promo.png", accent: "#bd7d36", destination: "#creative-work", action: "Explore the creative archive" },
  { id: "branding", number: "05", title: "Branding & visual design", short: "A visual language people remember.", description: "Brand identity, graphic design, poster campaigns and visual communication that give an idea a recognisable point of view.", image: "/portfolio/branding-identity.png", accent: "#a16c9a", destination: "#creative-work", action: "Explore visual work" },
] as const;
type DoorId = (typeof DOORS)[number]["id"];

const STORY = [
  { marker: "2022", phase: "THE FIRST SPARK", title: "A camera, a story and a place to begin.", body: "NSD Creations began with promotional and marketing videos for Keerthy's Daycare & Kindergarten. What started as helping a family business communicate its work became the first expression of a larger creative idea.", note: "The beginning" },
  { marker: "02", phase: "CREATIVE EXPLORATION", title: "Learning to make ideas visible.", body: "The work expanded into video editing, graphic design, visual storytelling, promotional content and branding — exploring how a strong visual can make a message easier to feel and remember.", note: "Visual storytelling" },
  { marker: "03", phase: "DIGITAL TRANSFORMATION", title: "Moving from visuals to experiences.", body: "Websites, application development, interface design and digital experiences brought a new dimension to the studio: building the places where people interact with a brand or a product.", note: "Design meets engineering" },
  { marker: "04", phase: "INTELLIGENT SYSTEMS", title: "Making technology do more.", body: "AI-assisted development, automation workflows and intelligent products became part of the practice — connecting creative thinking with systems that can solve practical problems.", note: "Experimentation with purpose" },
  { marker: "NOW", phase: "TODAY", title: "One studio. Many ways to create.", body: "NSD Creations is evolving into a creative technology studio that brings design, engineering, automation and cinematic storytelling into one connected practice.", note: "The work keeps evolving" },
] as const;

const WORKFLOW = [
  { number: "01", title: "Ideate", label: "Find the signal", description: "Understand the brief, audience and goal. Shape the concept before choosing the tools." },
  { number: "02", title: "Design", label: "Give it direction", description: "Build the visual language, storyboards, interface structure and experience." },
  { number: "03", title: "Build", label: "Make it real", description: "Develop the website, application, campaign or intelligent workflow with the right stack." },
  { number: "04", title: "Refine", label: "Sweat the details", description: "Polish the visuals, interactions, performance and edge cases through focused testing." },
  { number: "05", title: "Deliver", label: "Put it to work", description: "Launch the finished experience and make sure the handover is clear and useful." },
] as const;

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/nsd.creations.official", icon: Instagram },
  { label: "YouTube", href: "https://youtube.com/@nsdkaraoke", icon: ExternalLink },
  { label: "GitHub", href: "https://github.com/nsd999", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/saidheerajnalkari", icon: Linkedin },
];

function getLocalTime() {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(new Date());
}

export default function NSDImmersivePortfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [localTime, setLocalTime] = useState("--:--");
  const [activeDoor, setActiveDoor] = useState<DoorId | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [heroAssetReady, setHeroAssetReady] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const doorRailRef = useRef<HTMLDivElement>(null);
  const activeDoorData = DOORS.find((door) => door.id === activeDoor);
  const activeStory = STORY[storyIndex];

  useEffect(() => {
    const updateTime = () => setLocalTime(getLocalTime());
    updateTime();
    const interval = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => menuPanelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus());
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !menuPanelRef.current) return;
      const focusable = Array.from(menuPanelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      menuButton?.focus();
    };
  }, [menuOpen]);

  const scrollDoors = (direction: -1 | 1) => {
    const rail = doorRailRef.current;
    if (rail) rail.scrollBy({ left: direction * rail.clientWidth * 0.78, behavior: "smooth" });
  };

  const handleDoorKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const buttons = Array.from(doorRailRef.current?.querySelectorAll<HTMLButtonElement>("[data-door]") ?? []);
    const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIndex < 0) return;
    event.preventDefault();
    const nextIndex = Math.max(0, Math.min(buttons.length - 1, currentIndex + (event.key === "ArrowRight" ? 1 : -1)));
    buttons[nextIndex]?.focus();
    buttons[nextIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <div className="evolution-lab-portfolio nsd-immersive-portfolio">
      <AnimatePresence>
        {!heroAssetReady && (
          <motion.div
            className="nsd-entrance"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
            aria-live="polite"
            aria-label="Loading NSD Creations portfolio"
          >
            <div className="nsd-entrance-lockup"><span className="nsd-entrance-mark">NSD</span><span>CREATIONS</span></div>
            <p>CREATIVE TECHNOLOGIST · AI BUILDER · VISUAL CREATOR</p>
            <div className="nsd-entrance-bottom"><span>Opening up the work...</span><span>{String(loaderProgress).padStart(3, "0")}%</span></div>
            <div className="nsd-entrance-track"><span style={{ width: loaderProgress + "%" }} /></div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="nsd-header">
        <Link href="/" className="nsd-header-brand" aria-label="NSD Creations home">
          <span className="nsd-header-logo"><NsdLogo className="h-full w-full" /></span>
          <span className="nsd-header-wordmark"><strong>NSD CREATIONS</strong><small>CREATIVE TECHNOLOGY STUDIO</small></span>
        </Link>
        <nav className="nsd-desktop-nav" aria-label="Main portfolio navigation">
          {NAV_LINKS.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <div className="nsd-header-meta">
          <span className="nsd-clock"><Clock3 size={13} aria-hidden="true" /> {localTime} IST</span>
          <button ref={menuButtonRef} type="button" className="nsd-menu-toggle" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="nsd-menu-overlay" onClick={() => setMenuOpen((open) => !open)}>
            <span>{menuOpen ? "CLOSE" : "MENU"}</span>{menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="nsd-menu-overlay" ref={menuPanelRef} className="nsd-menu-overlay"
            role="dialog" aria-modal="true" aria-label="Portfolio navigation"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="nsd-menu-overlay-top"><span>NSD / PORTFOLIO</span><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={22} /></button></div>
            <div className="nsd-menu-links">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                  <span>{link.number}</span><strong>{link.label}</strong><ArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
            <div className="nsd-menu-bottom"><span>HYDERABAD, INDIA</span><a href="mailto:nsd.creations.official@gmail.com">LET’S TALK ↗</a></div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section id="top" className="nsd-hero">
          <div className="nsd-hero-grain" aria-hidden="true" />
          <div className="nsd-hero-copy">
            <div className="nsd-eyebrow"><span className="nsd-eyebrow-dot" /> INDEPENDENT CREATIVE TECHNOLOGIST</div>
            <p className="nsd-hero-kicker">Ideas deserve more than one medium.</p>
            <h1>Hi, I’m<br /><em>Sai Dheeraj.</em></h1>
            <p className="nsd-hero-lead">I turn creative ideas into digital experiences, intelligent products and cinematic stories.</p>
            <p className="nsd-hero-description">I build websites, applications, AI-powered solutions, creative campaigns and digital experiences through NSD Creations.</p>
            <div className="nsd-hero-actions">
              <button type="button" className="nsd-button nsd-button-dark" onClick={() => setDialogOpen(true)}>Start a project <ArrowUpRight size={17} /></button>
              <a className="nsd-text-link" href="#engineering-work">Explore my work <ArrowDown size={15} /></a>
            </div>
            <div className="nsd-hero-foot">
              <span><MapPin size={13} /> HYDERABAD, INDIA</span>
              <span><Clock3 size={13} /> {localTime} IST</span>
              <span className="nsd-scroll-cue">SCROLL TO EXPLORE <ArrowDown size={13} /></span>
            </div>
          </div>
          <div className="nsd-hero-visual">
            <div className="nsd-hero-image-frame">
              <Image src="/founder.png" alt="Sai Dheeraj Nalkari, founder of NSD Creations" fill priority quality={84} sizes="(max-width: 760px) 82vw, (max-width: 1100px) 44vw, 40vw" onLoad={() => { setLoaderProgress(100); setHeroAssetReady(true); }} onError={() => { setLoaderProgress(100); setHeroAssetReady(true); }} className="nsd-hero-image" />
              <div className="nsd-image-index">NSD — 001</div>
            </div>
            <div className="nsd-hero-stamp" aria-hidden="true"><span>DESIGN</span><i>×</i><span>BUILD</span><i>×</i><span>CREATE</span></div>
            <span className="nsd-hero-vertical">A CREATIVE TECHNOLOGY PRACTICE · EST. 2022</span>
          </div>
        </section>

        <section id="disciplines" className="nsd-section nsd-doors-section">
          <div className="nsd-section-topline"><span>01 / DISCIPLINES</span><span>FIVE WAYS INTO THE WORK</span></div>
          <div className="nsd-section-heading nsd-doors-heading">
            <div><p className="nsd-overline">CURIOUS? STEP INSIDE.</p><h2>My work, one<br /><em>door per discipline.</em></h2></div>
            <p className="nsd-section-intro">Explore what happens when creativity meets technology. Each discipline is a different way to turn an idea into something useful, expressive or unforgettable.</p>
          </div>
          <div className="nsd-door-controls">
            <span>SWIPE ALONG THE WALL <span aria-hidden="true">↔</span></span>
            <div><button type="button" onClick={() => scrollDoors(-1)} aria-label="Scroll disciplines left"><ChevronLeft size={18} /></button><button type="button" onClick={() => scrollDoors(1)} aria-label="Scroll disciplines right"><ChevronRight size={18} /></button></div>
          </div>
          <div ref={doorRailRef} className="nsd-door-rail" role="region" aria-label="Five creative disciplines. Use arrow keys to move between doors." tabIndex={0} onKeyDown={handleDoorKeyDown}>
            {DOORS.map((door) => (
              <motion.button key={door.id} type="button" data-door className={"nsd-door-card" + (activeDoor === door.id ? " is-active" : "")} aria-expanded={activeDoor === door.id} aria-controls="nsd-door-detail" onClick={() => setActiveDoor((current) => current === door.id ? null : door.id)} whileHover={{ y: -7 }} whileTap={{ scale: 0.985 }}>
                <div className="nsd-door-image">
                  <Image src={door.image} alt="" fill sizes="(max-width: 700px) 78vw, 30vw" />
                  <span className="nsd-door-image-wash" />
                  <span className="nsd-door-number">{door.number}</span>
                  <span className="nsd-door-open">{activeDoor === door.id ? "CLOSE" : "OPEN"} <ArrowUpRight size={14} /></span>
                </div>
                <div className="nsd-door-copy"><h3>{door.title}</h3><p>{door.short}</p></div>
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {activeDoorData && (
              <motion.div id="nsd-door-detail" key={activeDoorData.id} className="nsd-door-detail" initial={{ opacity: 0, y: 15, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>
                <div className="nsd-door-detail-index" style={{ color: activeDoorData.accent }}>{activeDoorData.number} / {activeDoorData.title}</div>
                <p>{activeDoorData.description}</p>
                <a href={activeDoorData.destination} onClick={() => setActiveDoor(null)}>{activeDoorData.action} <ArrowUpRight size={15} /></a>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="nsd-door-pagination" aria-hidden="true">{DOORS.map((door) => <span key={door.id} className={activeDoor === door.id ? "is-active" : ""} />)}</div>
        </section>

        <section id="story" className="nsd-section nsd-story-section">
          <div className="nsd-section-topline"><span>02 / THE STORY</span><span>FROM A FIRST SPARK TO A STUDIO</span></div>
          <div className="nsd-section-heading">
            <div><p className="nsd-overline">A LITTLE CONTEXT</p><h2>Let’s go back to<br /><em>where it started.</em></h2></div>
            <p className="nsd-section-intro">Not a list of job titles. A record of how the curiosity grew, the tools changed and the work found new forms.</p>
          </div>
          <div className="nsd-story-layout">
            <div className="nsd-story-list" role="tablist" aria-label="NSD Creations story milestones">
              {STORY.map((item, index) => (
                <button key={item.phase} type="button" role="tab" id={"nsd-story-tab-" + index} aria-selected={storyIndex === index} aria-controls="nsd-story-panel" className={storyIndex === index ? "is-active" : ""} onClick={() => setStoryIndex(index)}>
                  <span className="nsd-story-step">{item.marker}</span><span className="nsd-story-phase">{item.phase}</span><span className="nsd-story-indicator" />
                </button>
              ))}
              <div className="nsd-story-progress"><span style={{ "--nsd-story-progress": ((storyIndex + 1) / STORY.length) * 100 + "%" } as CSSProperties} /></div>
            </div>
            <div className="nsd-story-panel-wrap">
              <AnimatePresence mode="wait">
                <motion.article key={storyIndex} id="nsd-story-panel" role="tabpanel" aria-labelledby={"nsd-story-tab-" + storyIndex} className="nsd-story-panel" initial={{ opacity: 0, y: 18, filter: "blur(5px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(4px)" }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="nsd-story-panel-top"><span>{activeStory.note}</span><span>{String(storyIndex + 1).padStart(2, "0")} / 05</span></div>
                  <p className="nsd-story-phase-large">{activeStory.phase}</p>
                  <h3>{activeStory.title}</h3>
                  <p className="nsd-story-body">{activeStory.body}</p>
                  <div className="nsd-story-panel-footer">
                    <span>{storyIndex === 0 ? "2022" : "CHAPTER " + String(storyIndex + 1).padStart(2, "0")}</span>
                    <div>
                      <button type="button" disabled={storyIndex === 0} onClick={() => setStoryIndex((value) => Math.max(0, value - 1))} aria-label="Previous milestone"><ChevronLeft size={17} /></button>
                      <button type="button" disabled={storyIndex === STORY.length - 1} onClick={() => setStoryIndex((value) => Math.min(STORY.length - 1, value + 1))} aria-label="Next milestone"><ChevronRight size={17} /></button>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="nsd-card-section">
          <div className="nsd-section-topline"><span>03 / THE BUILDER</span><span>AN INTERACTIVE INTRODUCTION</span></div>
          <div className="nsd-card-intro">
            <p className="nsd-overline">BEHIND THE INITIALS</p><h2>One card.<br /><em>Many capabilities.</em></h2>
            <p>Turn the card over. This is a snapshot of the kind of work I bring together — not a scorecard or a list of claimed expertise levels.</p>
          </div>
          <div className="nsd-card-stage"><AbilityCard flipped={cardFlipped} onFlip={() => setCardFlipped((value) => !value)} /><div className="nsd-card-instruction"><span className="nsd-card-instruction-dot" /> MOVE TO TILT · CLICK OR TAP TO FLIP</div></div>
        </section>

        <section className="nsd-section nsd-projects-intro" aria-label="Selected portfolio work">
          <div className="nsd-section-topline"><span>04 / SELECTED WORK</span><span>REAL PROJECTS · LIVING ARCHIVE</span></div>
          <div className="nsd-section-heading">
            <div><p className="nsd-overline">A FEW THINGS IN THE WORLD</p><h2>Built, made,<br /><em>and still exploring.</em></h2></div>
            <p className="nsd-section-intro">A selection across engineering and creative production. Live products, client work, experiments and the visual archive — kept in their actual context.</p>
          </div>
        </section>

        <div className="nsd-legacy-portfolio" id="engineering-work">
          <div className="nsd-archive-banner"><span>ENGINEERING / PRODUCTS</span><span>INTERFACES · SYSTEMS · EXPERIMENTS</span></div>
          <FeaturedProjects />
          <AdminManagedProjects />
          <Projects />
          <Experiments />
          <Evolution />
          <Skills />
          <Vision />
        </div>

        <div className="nsd-legacy-portfolio nsd-creative-archive" id="creative-work">
          <div className="nsd-archive-banner"><span>CREATIVE / VISUAL ARCHIVE</span><span>FILM · MUSIC · CAMPAIGNS · DESIGN</span></div>
          <YouTubeSection />
          <Posters />
          <BehindTheEdit />
        </div>

        <section id="workflow" className="nsd-section nsd-workflow-section">
          <div className="nsd-section-topline"><span>05 / HOW IT COMES TOGETHER</span><span>THE NSD CREATIVE PIPELINE</span></div>
          <div className="nsd-section-heading">
            <div><p className="nsd-overline">FROM SPARK TO CREATION</p><h2>Clear thinking.<br /><em>Careful making.</em></h2></div>
            <p className="nsd-section-intro">Every brief is different. The principles stay the same: understand the purpose, design with intent, build carefully and test what matters.</p>
          </div>
          <div className="nsd-workflow-grid">
            {WORKFLOW.map((step, index) => (
              <motion.article key={step.number} className="nsd-workflow-item" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55, delay: index * 0.07 }}>
                <span className="nsd-workflow-number">{step.number}</span><span className="nsd-workflow-label">{step.label}</span><h3>{step.title}</h3><p>{step.description}</p>
                {index < WORKFLOW.length - 1 && <ArrowRight className="nsd-workflow-arrow" size={18} aria-hidden="true" />}
              </motion.article>
            ))}
          </div>
        </section>

        <section id="contact" className="nsd-contact-section">
          <div className="nsd-contact-orbit" aria-hidden="true" />
          <div className="nsd-section-topline"><span>06 / OPEN CHANNEL</span><span>HYDERABAD, INDIA · WORKING EVERYWHERE</span></div>
          <p className="nsd-overline">HAVE SOMETHING IN MIND?</p>
          <h2>Got an idea?<br /><em>Let’s build it together.</em></h2>
          <p className="nsd-contact-lead">Tell me what you’re imagining. Let’s turn it into something real.</p>
          <button type="button" className="nsd-button nsd-button-light" onClick={() => setDialogOpen(true)}>Start a project <ArrowUpRight size={18} /></button>
          <div className="nsd-contact-bottom"><a href="mailto:nsd.creations.official@gmail.com"><Mail size={15} /> nsd.creations.official@gmail.com</a><span><MapPin size={15} /> Hyderabad, India</span></div>
        </section>
      </main>

      <footer className="nsd-footer">
        <div className="nsd-footer-main">
          <Link href="/" className="nsd-footer-brand" aria-label="NSD Creations home">
            <span className="nsd-footer-logo"><NsdLogo className="h-full w-full" /></span>
            <span><strong>NSD CREATIONS</strong><small>CREATIVE TECHNOLOGY STUDIO</small></span>
          </Link>
          <p>Where cinematic creativity<br />meets futuristic technology.</p>
          <button type="button" onClick={() => setDialogOpen(true)}>Have a project? <ArrowUpRight size={15} /></button>
        </div>
        <div className="nsd-footer-links">
          <div><span className="nsd-footer-label">EXPLORE</span><Link href="/">Home</Link><a href="#disciplines">Disciplines</a><a href="#story">My story</a><a href="#engineering-work">Selected work</a></div>
          <div><span className="nsd-footer-label">SERVICES</span><Link href="/services/website-development">Web development</Link><Link href="/services">App development</Link><Link href="/services/ai-automation">AI & automation</Link><Link href="/services/graphic-designing">Creative design</Link></div>
          <div><span className="nsd-footer-label">CONNECT</span><a href="mailto:nalkarisaidheeraj@gmail.com">Tech email</a><a href="mailto:nsd.creations.official@gmail.com">Studio email</a><a href="tel:+916303849852">+91 63038 49852</a><span>Hyderabad, India · {localTime} IST</span></div>
        </div>
        <div className="nsd-footer-bottom">
          <span>© {new Date().getFullYear()} SAI DHEERAJ NALKARI · NSD CREATIONS</span>
          <div>{SOCIALS.map((social) => { const Icon = social.icon; return <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}><Icon size={16} /></a>; })}</div>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>BACK TO TOP <ArrowUp size={14} /></button>
        </div>
      </footer>

      <AnimatePresence>{dialogOpen && <ProjectEnquiryDialog onClose={() => setDialogOpen(false)} />}</AnimatePresence>
    </div>
  );
}

function AbilityCard({ flipped, onFlip }: { flipped: boolean; onFlip: () => void }) {
  const tiltX = useSpring(useMotionValue(0), { stiffness: 190, damping: 22, mass: 0.8 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 190, damping: 22, mass: 0.8 });
  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch" && flipped) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(y * -11);
    tiltY.set(x * 13);
  };
  const resetTilt = () => { tiltX.set(0); tiltY.set(0); };
  const capabilityGroups = [
    ["BUILD", "Web development", "App development", "Product engineering"],
    ["INTELLIGENCE", "AI engineering", "AI automation", "Agentic workflows"],
    ["CREATE", "Visual design", "Brand identity", "Cinematic production"],
  ];
  return (
    <div className="nsd-card-perspective">
      <motion.button type="button" className="nsd-ability-card" aria-label={flipped ? "Show NSD Creations identity card front" : "Flip to view NSD Creations capabilities"} aria-pressed={flipped} onClick={onFlip} onPointerMove={handlePointerMove} onPointerLeave={resetTilt} onPointerCancel={resetTilt} style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }} whileTap={{ scale: 0.985 }}>
        <motion.div className="nsd-ability-card-inner" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}>
          <div className="nsd-ability-face nsd-ability-front">
            <div className="nsd-ability-top"><span>NSD / 001</span><span>PERSONAL CARD</span></div>
            <div className="nsd-ability-brand"><div className="nsd-ability-monogram">NSD<span>.</span></div><div className="nsd-ability-brand-name">CREATIVE<br />TECHNOLOGY</div></div>
            <div className="nsd-ability-bottom"><div><strong>Sai Dheeraj Nalkari</strong><span>Creative Technologist</span></div><span className="nsd-ability-orbit" aria-hidden="true">✳</span></div>
            <div className="nsd-ability-card-line" />
          </div>
          <div className="nsd-ability-face nsd-ability-back">
            <div className="nsd-ability-top"><span>WHAT I BRING TO THE TABLE</span><span>NSD CREATIONS</span></div>
            <div className="nsd-capability-groups">{capabilityGroups.map(([title, ...items]) => <div key={title}><span>{title}</span>{items.map((item) => <strong key={item}>{item}</strong>)}</div>)}</div>
            <div className="nsd-ability-back-footer"><span>DESIGN / ENGINEER / CREATE</span><span>HYDERABAD, INDIA</span></div>
          </div>
        </motion.div>
      </motion.button>
    </div>
  );
}

function ProjectEnquiryDialog({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", projectType: "Website / digital experience", description: "" });
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => firstInputRef.current?.focus());
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')).filter((element) => element.getAttribute("tabindex") !== "-1");
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  const mailtoHref = "mailto:nsd.creations.official@gmail.com?subject=" +
    encodeURIComponent("Project enquiry — " + form.projectType) +
    "&body=" + encodeURIComponent("Name: " + form.name + "\nEmail: " + form.email + "\nProject type: " + form.projectType + "\n\n" + form.description);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (website.trim()) {
      setStatus("error");
      setError("This submission could not be verified. Please review the form and try again.");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), service: form.projectType, message: form.description.trim() }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.success !== true) throw new Error(typeof payload.error === "string" ? payload.error : "The enquiry could not be sent. Please try again.");
      setStatus("success");
    } catch (submissionError) {
      setStatus("error");
      setError(submissionError instanceof Error ? submissionError.message : "The enquiry service is temporarily unavailable.");
    }
  };

  return (
    <motion.div className="nsd-dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div ref={dialogRef} className="nsd-enquiry-dialog" role="dialog" aria-modal="true" aria-labelledby="nsd-enquiry-title" initial={{ opacity: 0, y: 24, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.99 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
        <div className="nsd-dialog-top"><span>NSD CREATIONS / PROJECT ENQUIRY</span><button type="button" onClick={onClose} aria-label="Close project enquiry"><X size={19} /></button></div>
        {status === "success" ? (
          <div className="nsd-form-success" role="status">
            <span className="nsd-success-mark">✓</span><p className="nsd-overline">MESSAGE RECEIVED</p><h2 id="nsd-enquiry-title">Thanks for reaching out.</h2>
            <p>Your enquiry has been submitted to NSD Creations. I’ll review the details and get back to you.</p>
            <button type="button" className="nsd-button nsd-button-dark" onClick={onClose}>Close <ArrowRight size={16} /></button>
          </div>
        ) : (
          <>
            <div className="nsd-dialog-heading"><p className="nsd-overline">LET’S MAKE SOMETHING MATTER</p><h2 id="nsd-enquiry-title">Tell me what<br /><em>you’re building.</em></h2><p>A little context is enough to start a useful conversation.</p></div>
            <form className="nsd-enquiry-form" onSubmit={handleSubmit}>
              <div className="nsd-form-row">
                <label>Name<input ref={firstInputRef} type="text" name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required maxLength={100} /></label>
                <label>Email<input type="email" name="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required maxLength={254} /></label>
              </div>
              <label>Project type<select name="projectType" value={form.projectType} onChange={(event) => setForm({ ...form, projectType: event.target.value })}>
                <option>Website / digital experience</option><option>Application / product development</option><option>AI / automation</option><option>Video / cinematic production</option><option>Branding / graphic design</option><option>Something else</option>
              </select></label>
              <label>Project description<textarea name="description" rows={4} minLength={10} maxLength={4000} placeholder="What are you imagining? What should it help you achieve?" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /></label>
              <label className="nsd-honeypot" aria-hidden="true">Leave this field empty<input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
              {error && <p className="nsd-form-error" role="alert">{error} <a href={mailtoHref}>Email the details instead ↗</a></p>}
              <div className="nsd-form-submit-row"><span>SUBMITTED SECURELY TO NSD CREATIONS</span><button type="submit" className="nsd-button nsd-button-dark" disabled={status === "sending"}>{status === "sending" ? "Sending..." : "Send enquiry"} <ArrowUpRight size={17} /></button></div>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
