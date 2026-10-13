import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./YouTubeSection";


const p1 = "/evolution-lab/posters/summer-camp.webp";
const p2 = "/evolution-lab/posters/morning-rituals.webp";
const p3 = "/evolution-lab/posters/handwriting-mastery.webp";
const p4 = "/evolution-lab/posters/360-wellness.webp";
const p5 = "/evolution-lab/posters/keerthys-daycare.webp";
const p6 = "/evolution-lab/posters/phonics.webp";
const p7 = "/evolution-lab/posters/painting-course.webp";
const p8 = "/evolution-lab/posters/nsd-creations.webp";
const p9 = "/evolution-lab/posters/summer-camp-fun.webp";
const p10 = "/evolution-lab/posters/learning-creativity.webp";

const posters = [
  { src: p8, title: "NSD Creations — Services & Pricing", category: "BRAND IDENTITY", year: "2026" },
  { src: p1, title: "DLH Summer Camp — Confidence in 40 Days", category: "CAMPAIGN", year: "2026" },
  { src: p9, title: "DLH Summer Camp — Focus & Skills", category: "CAMPAIGN", year: "2026" },
  { src: p4, title: "360° Wellness Program", category: "EDUCATIONAL", year: "2026" },
  { src: p2, title: "Morning Rituals for Kids", category: "PROGRAM", year: "2026" },
  { src: p3, title: "Handwriting Mastery for Kids", category: "PROGRAM", year: "2026" },
  { src: p6, title: "Sound It Out — Phonics Program", category: "PROGRAM", year: "2026" },
  { src: p7, title: "30-Day Painting Crash Course", category: "WORKSHOP", year: "2026" },
  { src: p5, title: "Keerthy's Daycare & Kindergarten", category: "BRAND", year: "2026" },
  { src: p10, title: "DLH — Where Learning Meets Creativity", category: "BRAND", year: "2026" },
];

export function Posters() {
  const [open, setOpen] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(null);
      } else if (event.key === "Tab") {
        // The close control is the only focusable control in this preview.
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          tag="POSTER · CAMPAIGN ARCHIVE"
          title="Designed to Stop the Scroll"
          desc="A horizontal archive of brand campaigns, program posters, and identity work for NSD Creations, Dheeru's Learner's Hub, and Keerthy's Daycare."
        />

        <div className="mt-8 flex items-center justify-end gap-2">
          <button
            onClick={() => scrollBy(-1)}
            data-cursor="hover"
            aria-label="Scroll left"
            className="flex h-10 w-10 items-center justify-center rounded-full glass-cinema text-foreground transition hover:bg-white/10"
          >
            ←
          </button>
          <button
            onClick={() => scrollBy(1)}
            data-cursor="hover"
            aria-label="Scroll right"
            className="flex h-10 w-10 items-center justify-center rounded-full glass-cinema text-foreground transition hover:bg-white/10"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        role="region"
        aria-label="Poster design archive carousel"
        tabIndex={0}
        className="hide-scrollbar mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-8 sm:px-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        style={{ cursor: "grab" }}
        onMouseDown={(e) => {
          const el = scrollerRef.current;
          if (!el) return;
          dragState.current = {
            isDown: true,
            startX: e.pageX - el.offsetLeft,
            scrollLeft: el.scrollLeft,
            moved: false,
          };
          el.style.cursor = "grabbing";
        }}
        onMouseLeave={() => {
          dragState.current.isDown = false;
          if (scrollerRef.current) scrollerRef.current.style.cursor = "grab";
        }}
        onMouseUp={() => {
          dragState.current.isDown = false;
          if (scrollerRef.current) scrollerRef.current.style.cursor = "grab";
        }}
        onMouseMove={(e) => {
          const s = dragState.current;
          const el = scrollerRef.current;
          if (!s.isDown || !el) return;
          e.preventDefault();
          const x = e.pageX - el.offsetLeft;
          const walk = x - s.startX;
          if (Math.abs(walk) > 5) s.moved = true;
          el.scrollLeft = s.scrollLeft - walk;
        }}
      >
        {posters.map((p, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: (i % 6) * 0.05 }}
            onClick={() => {
              if (!dragState.current.moved) setOpen(p.src);
            }}
            data-cursor="hover"
            aria-label={"Open poster preview: " + p.title}
            className="group relative flex h-[68vh] max-h-[640px] w-[78vw] flex-shrink-0 snap-center overflow-hidden rounded-2xl glass-cinema sm:h-[600px] sm:w-[440px]"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <img
              src={p.src}
              alt={p.title}
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 translate-y-2 p-6 transition-all duration-500 group-hover:translate-y-0">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--gold)]">
                <span>{p.year}</span>
                <span className="opacity-50">·</span>
                <span>{p.category}</span>
              </div>
              <div className="mt-1.5 text-base font-semibold text-white">{p.title}</div>
            </div>
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ boxShadow: "inset 0 0 80px oklch(0.82 0.16 85 / 0.25)" }}
            />
          </motion.button>
        ))}
        <div className="w-2 flex-shrink-0" />
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={(posters.find((poster) => poster.src === open)?.title ?? "Poster") + " preview"}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl animate-in fade-in sm:p-6"
        >
          <img
            src={open}
            alt={posters.find((poster) => poster.src === open)?.title ?? "Selected poster"}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] max-w-full rounded-xl object-contain"
            style={{ boxShadow: "var(--shadow-glow-cinema)" }}
          />
          <button
            ref={closeButtonRef}
            onClick={() => setOpen(null)}
            aria-label="Close poster preview"
            className="absolute right-3 top-3 inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-white/10 px-4 py-2 text-xs text-white backdrop-blur hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:top-6"
          >
            ✕ Close
          </button>
        </div>
      )}
    </section>
  );
}