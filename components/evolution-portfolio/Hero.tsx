import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Particles } from "./Particles";

const taglines = [
  "Where cinematic creativity meets futuristic technology.",
  "Building stories through visuals, AI, and code.",
  "Designing intelligent digital experiences.",
];

export function Hero() {
  const [tagIdx, setTagIdx] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setTagIdx((i) => (i + 1) % taglines.length), 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-background"
    >
      {/* layered backgrounds */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.65 0.25 295 / 0.25), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, oklch(0.85 0.20 195 / 0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 20% 20%, oklch(0.55 0.24 25 / 0.15), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 opacity-60">
        <Particles density={70} />
      </div>
      {/* scan line */}
      <div
        className="pointer-events-none absolute left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.85 0.20 195), transparent),
          animation: "evolution-scan 8s linear infinite",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-mono tracking-widest"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon)] animate-pulse-glow" />
          CREATIVE TECHNOLOGIST · AI BUILDER · VISUAL CREATOR
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="font-display text-[clamp(2.8rem,9vw,8rem)] font-bold leading-[0.95] tracking-tighter"
        >
          <span className="block text-gradient-cinema">Sai Dheeraj</span>
          <span className="block text-gradient-cyber">Nalkari</span>
        </motion.h1>

        <div className="mt-8 h-8">
          <motion.p
            key={tagIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="text-base text-muted-foreground sm:text-lg"
          >
            {taglines[tagIdx]}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#projects"
            className="group relative overflow-hidden rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:scale-[1.03]"
          >
            <span className="relative z-10">View Projects →</span>
          </a>
          <a
            href="#tech"
            className="rounded-full border border-[var(--cyber)]/40 px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-[var(--cyber)]/10 hover:border-[var(--cyber)]"
            style={{ boxShadow: "0 0 30px -10px var(--cyber)" }}
          >
            Explore Tech Skills
          </a>
          <a
            href="#contact"
            className="rounded-full px-6 py-3 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            Contact Me
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            { k: "500+", v: "Edits Delivered" },
            { k: "120+", v: "AI Songs Crafted" },
            { k: "30+", v: "Repositories" },
            { k: "5+", v: "Years Building" },
          ].map((s) => (
            <div key={s.v} className="glass rounded-2xl p-4">
              <div className="font-display text-2xl font-bold text-gradient-cyber sm:text-3xl">
                {s.k}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                {s.v}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* corner brackets */}
      <CornerBrackets />
    </section>
  );
}

function CornerBrackets() {
  const cls =
    "absolute h-6 w-6 border-[var(--cyber)] opacity-60";
  return (
    <>
      <div className={`${cls} left-6 top-24 border-l border-t`} />
      <div className={`${cls} right-6 top-24 border-r border-t`} />
      <div className={`${cls} left-6 bottom-6 border-l border-b`} />
      <div className={`${cls} right-6 bottom-6 border-r border-b`} />
    </>
  );
}