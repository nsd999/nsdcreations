import { motion } from "motion/react";
import { SectionHeader } from "./YouTubeSection";

const steps = [
  { n: "01", t: "Ideate", d: "Story-first. Mood boards, references, narrative arcs before a single cut." },
  { n: "02", t: "Capture", d: "Shoot or scout. AI-assisted scripting, b-roll planning, asset selection." },
  { n: "03", t: "Compose", d: "Edit timeline, sound design, AI music & vocal layers — pacing for emotion." },
  { n: "04", t: "Craft", d: "Color, motion graphics, finishing polish. Ship cinematic, ship loud." },
];

export function BehindTheEdit() {
  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          tag="WORKFLOW · BEHIND THE EDIT"
          title="From Spark to Cinematic"
          desc="A repeatable creative pipeline that fuses story instinct with AI-augmented production."
        />

        <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            className="absolute left-0 right-0 top-12 hidden h-px lg:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--ember), var(--gold), var(--ember), transparent)",
            }}
          />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative rounded-2xl glass-cinema p-6"
            >
              <div
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full font-mono text-sm font-bold"
                style={{
                  background: "var(--gradient-cinema)",
                  color: "oklch(0.12 0.06 30)",
                  boxShadow: "var(--shadow-glow-cinema)",
                }}
              >
                {s.n}
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}