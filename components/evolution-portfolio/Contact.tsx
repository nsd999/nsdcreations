import { motion } from "motion/react";
import { SectionHeader } from "./YouTubeSection";

const channels = [
  { label: "Phone", value: "+91 6303849852", href: "tel:+916303849852", accent: "var(--neon)" },
  { label: "Tech Email", value: "nalkarisaidheeraj@gmail.com", href: "mailto:nalkarisaidheeraj@gmail.com", accent: "var(--cyber)" },
  { label: "Creative Email", value: "nsd.creations.official@gmail.com", href: "mailto:nsd.creations.official@gmail.com", accent: "var(--ember)" },
  { label: "LinkedIn", value: "/in/saidheerajnalkari", href: "https://linkedin.com/in/saidheerajnalkari", accent: "var(--cyber)" },
  { label: "GitHub", value: "@nsd999", href: "https://github.com/nsd999", accent: "var(--violet)" },
  { label: "YouTube", value: "@nsdkaraoke", href: "https://youtube.com/@nsdkaraoke", accent: "var(--cinema)" },
  { label: "NSD Creations", value: "@nsd.creations.offical", href: "https://instagram.com/nsd.creations.offical", accent: "var(--magenta)" },
  { label: "Personal IG", value: "@nalkari.sai.dheeraj", href: "https://instagram.com/nalkari.sai.dheeraj", accent: "var(--gold)" },
];

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.78 0.18 220 / 0.18), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          tag="LAUNCH CONTROL · OPEN CHANNEL"
          title="Let's Build Something the World Remembers"
          desc="Open to collabs, founding opportunities, creative direction & ambitious AI builds."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              data-cursor="hover"
              className="group relative overflow-hidden rounded-2xl glass p-5 transition-all hover:-translate-y-1"
            >
              <div
                className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-60"
                style={{ background: c.accent }}
              />
              <div
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: c.accent, fontFamily: "var(--font-mono)" }}
              >
                ◇ {c.label}
              </div>
              <div className="mt-2 truncate text-sm font-semibold text-foreground">
                {c.value}
              </div>
              <div className="mt-3 font-mono text-[10px] text-muted-foreground opacity-0 transition group-hover:opacity-100" style={{ fontFamily: "var(--font-mono)" }}>
                CONNECT →
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 overflow-hidden rounded-3xl glass p-10 text-center sm:p-16"
        >
          <h3 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Ready when you are.
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            One message away from cinematic edits, AI builds, or your next product.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:nalkarisaidheeraj@gmail.com"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:scale-105"
            >
              Start a project →
            </a>
            <a
              href="https://linkedin.com/in/saidheerajnalkari"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--cyber)]/40 px-6 py-3 text-sm font-semibold transition hover:bg-[var(--cyber)]/10"
            >
              Connect on LinkedIn
            </a>
          </div>
        </motion.div>

        <footer className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <div className="font-mono" style={{ fontFamily: "var(--font-mono)" }}>
            © {new Date().getFullYear()} SAI DHEERAJ NALKARI · NSD CREATIONS
          </div>
          <div className="font-mono" style={{ fontFamily: "var(--font-mono)" }}>
            Designed & built with cinematic intent.
          </div>
        </footer>
      </div>
    </section>
  );
}