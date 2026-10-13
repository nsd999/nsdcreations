import { motion } from "motion/react";
import { SectionHeader } from "./YouTubeSection";

const groups = [
  {
    cat: "AI & Intelligence",
    color: "var(--violet)",
    items: ["Prompt Engineering", "AI Website Building", "AI App Building", "AI Automation", "LLM Workflows", "Agentic Systems"],
  },
  {
    cat: "Development",
    color: "var(--cyber)",
    items: ["Python", "Java", "HTML / CSS / JS", "React", "Node.js", "REST APIs"],
  },
  {
    cat: "Product & Design",
    color: "var(--neon)",
    items: ["UI Systems", "Motion Design", "Brand Identity", "Design Tokens", "Cinematic Editing", "Storytelling"],
  },
  {
    cat: "Infrastructure",
    color: "var(--gold)",
    items: ["GitHub", "Vercel", "Supabase", "CI / CD", "Deployment", "Edge Functions"],
  },
];

export function Skills() {
  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          tag="STACK · SYNCED FROM LINKEDIN"
          title="The Builder's Toolkit"
          desc="Cross-domain capabilities — from prompt design to production deployment."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {groups.map((g, i) => (
            <motion.div
              key={g.cat}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl glass p-6 transition hover:-translate-y-1"
            >
              <div
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-60"
                style={{ background: g.color }}
              />
              <div
                className="mb-4 font-mono text-[11px] uppercase tracking-widest"
                style={{ color: g.color, fontFamily: "var(--font-mono)" }}
              >
                ◇ {g.cat}
              </div>
              <ul className="space-y-2">
                {g.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-center gap-2 text-sm text-foreground/90"
                  >
                    <span
                      className="h-1 w-1 rounded-full"
                      style={{ background: g.color }}
                    />
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}