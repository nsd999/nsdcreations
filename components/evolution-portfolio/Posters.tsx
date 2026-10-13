import { motion } from "motion/react";
import { useRef, useState } from "react";
import { SectionHeader } from "./YouTubeSection";


const p1 = "https://nsdportfolio.lovable.app/assets/poster-summer-camp-W7EXsf_w.jpg";
const p2 = "https://nsdportfolio.lovable.app/assets/poster-morning-rituals-DFT_e2T0.png";
const p3 = "https://nsdportfolio.lovable.app/assets/poster-handwriting-mastery-krse_OyI.png";
const p4 = "https://nsdportfolio.lovable.app/assets/poster-360-wellness-BusWpKKP.png";
const p5 = "https://nsdportfolio.lovable.app/assets/poster-keerthys-daycare-9fDDUZ1T.png";
const p6 = "https://nsdportfolio.lovable.app/assets/poster-phonics-jACPHxD3.png";
const p7 = "https://nsdportfolio.lovable.app/assets/poster-painting-course-os2sPpi4.png";
const p8 = "https://nsdportfolio.lovable.app/assets/poster-nsd-creations-CfopbehW.png";
const p9 = "https://nsdportfolio.lovable.app/assets/poster-summer-camp-fun-Bb0fZjCy.png";
const p10 = "https://nsdportfolio.lovable.app/assets/poster-learning-creativity-N9WyGCAY.png";

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
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

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
        className="hide-scrollbar mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-8 sm:px-12"
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
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 backdrop-blur-xl animate-in fade-in"
        >
          <img
            src={open}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] max-w-full rounded-xl"
            style={{ boxShadow: "var(--shadow-glow-cinema)" }}
          />
          <button
            onClick={() => setOpen(null)}
            className="absolute right-6 top-6 rounded-full bg-white/10 px-4 py-2 text-xs text-white backdrop-blur hover:bg-white/20"
          >
            ✕ Close
          </button>
        </div>
      )}
    </section>
  );
}