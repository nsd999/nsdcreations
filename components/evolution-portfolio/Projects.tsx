import { motion } from "motion/react";
import { SectionHeader } from "./YouTubeSection";

const projects = [
  {
    name: "Brainmate",
    tag: "AI · MENTAL WELLNESS",
    pitch: "An AI companion for mental wellness — daily check-ins, mood mapping, guided micro-interventions.",
    problem: "Therapy is inaccessible for millions. Most apps stop at journaling.",
    tech: ["React", "Lovable AI", "Supabase", "Edge Functions"],
    features: ["Conversational AI companion", "Mood timeline & insights", "Crisis-safe prompt guardrails", "Streak rituals"],
    color: "var(--violet)",
  },
  {
    name: "Queueless India",
    tag: "PRODUCT · SMART QUEUES",
    pitch: "A queue management system that erases waiting rooms — book a token, get summoned digitally.",
    problem: "Hospitals, banks, govt offices waste billions of human hours in physical queues.",
    tech: ["React", "Node", "Realtime DB", "SMS APIs"],
    features: ["Live token estimation", "Multi-counter routing", "Operator dashboard", "Walk-in & remote tokens"],
    color: "var(--cyber)",
  },
  {
    name: "NSD Studio OS",
    tag: "INTERNAL · CREATIVE PIPELINE",
    pitch: "An AI-assisted production dashboard powering NSD Creations — from brief to publish.",
    problem: "Creative output gets lost between Notion, Drive, and three editing apps.",
    tech: ["TanStack Start", "AI Gateway", "Supabase", "R2"],
    features: ["Brief-to-storyboard automation", "Asset library + version control", "Render queue", "Auto-poster director"],
    color: "var(--ember)",
  },
];

export function Projects() {
  return (
    <section id="projects" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          tag="STARTUPS · IN MOTION"
          title="Things I'm Building"
          desc="Products built between deadlines and obsession. Each one solves a real problem."
        />

        <div className="mt-16 space-y-8">
          {projects.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="group relative overflow-hidden rounded-3xl glass p-8 sm:p-10"
            >
              <div
                className="absolute -right-32 -top-32 h-64 w-64 rounded-full opacity-30 blur-[100px] transition-opacity group-hover:opacity-60"
                style={{ background: p.color }}
              />
              <div className="relative grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <div
                    className="mb-3 font-mono text-[11px] tracking-widest"
                    style={{ color: p.color, fontFamily: "var(--font-mono)" }}
                  >
                    {String(i + 1).padStart(2, "0")} · {p.tag}
                  </div>
                  <h3 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                    {p.name}
                  </h3>
                  <p className="mt-4 text-base text-muted-foreground">{p.pitch}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border bg-background/40 px-3 py-1 font-mono text-[11px] text-muted-foreground"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-4 lg:col-span-7">
                  <Field label="PROBLEM" value={p.problem} />
                  <div>
                    <div
                      className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      FEATURES
                    </div>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {p.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 rounded-lg bg-background/40 p-3 text-sm"
                        >
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: p.color }}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="mb-1 font-mono text-[10px] tracking-widest text-muted-foreground"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </div>
      <div className="text-sm text-foreground/90">{value}</div>
    </div>
  );
}