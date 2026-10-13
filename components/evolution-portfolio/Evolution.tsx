import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function Evolution() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], [12, 0, 12]);
  const warmOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [1, 0.4, 0, 0]);
  const coldOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 0, 0.6, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

  return (
    <section
      id="evolution"
      ref={ref}
      className="relative min-h-[140vh] overflow-hidden"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* warm layer */}
        <motion.div
          style={{ opacity: warmOpacity }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, oklch(0.55 0.24 25 / 0.5), oklch(0.18 0.08 35) 70%)",
            }}
          />
        </motion.div>

        {/* cold layer */}
        <motion.div
          style={{ opacity: coldOpacity }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, oklch(0.65 0.25 295 / 0.3), oklch(0.09 0.03 260) 70%)",
            }}
          />
          <div className="absolute inset-0 bg-grid-fine opacity-60" />
        </motion.div>

        {/* particle dust */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full animate-float-slow"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53 + 17) % 100}%`,
                background: i % 2 ? "var(--gold)" : "var(--neon)",
                boxShadow: `0 0 8px ${i % 2 ? "var(--gold)" : "var(--neon)"}`,
                animationDelay: `${((i * 29) % 60) / 10}s`,
                animationDuration: `${6 + (i % 7)}s`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        <motion.div
          style={{ scale, filter: useTransform(blur, (b) => `blur(${b}px)`) }}
          className="relative z-10 px-6 text-center"
        >
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 font-mono text-[11px] tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--violet)] animate-pulse-glow" />
            EVOLUTION · ENTERING NEW DIMENSION
          </div>
          <h2 className="font-display text-[clamp(2.4rem,8vw,6.5rem)] font-bold leading-[1] tracking-tighter">
            <span className="block text-gradient-cinema">Creative Studio</span>
            <span className="my-2 block text-2xl text-muted-foreground sm:text-3xl">
              ⟶ becomes ⟶
            </span>
            <span className="block text-gradient-cyber">AI Lab</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-sm text-muted-foreground sm:text-base">
            Story instinct meets systems thinking. The same hand that color-grades
            cinematic edits now ships AI products, automations, and design systems.
          </p>
        </motion.div>
      </div>
    </section>
  );
}