import { motion } from "motion/react";
import { SectionHeader } from "./YouTubeSection";

const xs = [
  { t: "AI Karaoke", d: "Voice-cloned karaoke covers, generated end-to-end." },
  { t: "Prompt Lab", d: "A versioned playground for prompt iteration & evals." },
  { t: "Poster Auto-Director", d: "Brief → layout → final poster, AI-orchestrated." },
  { t: "Creative AI Workflows", d: "Modular pipelines for video, audio, and copy." },
  { t: "AI Editing Systems", d: "Smart cut detection + auto b-roll suggestions." },
  { t: "Karaoke Engine", d: "Lyric sync, pitch tracking, vocal isolation." },
];

export function Experiments() {
  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          tag="R&D · EXPERIMENTS"
          title="The Lab"
          desc="Half-built ideas, controlled chaos. Where the next products are quietly cooking."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {xs.map((x, i) => (
            <motion.div
              key={x.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
              className="group relative overflow-hidden rounded-2xl glass p-6 transition hover:-translate-y-1"
            >
              <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[var(--neon)] animate-pulse-glow" />
              <div
                className="font-mono text-[10px] tracking-widest text-muted-foreground"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                EXP · {String(i + 1).padStart(3, "0")}
              </div>
              <h3 className="mt-2 font-display text-xl font-bold">{x.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
              <div
                className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-[var(--cyber)] opacity-0 transition-opacity group-hover:opacity-100"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                STATUS: PROTOTYPING →
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}