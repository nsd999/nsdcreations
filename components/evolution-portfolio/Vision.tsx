import { motion } from "motion/react";

export function Vision() {
  return (
    <section className="relative overflow-hidden px-6 py-32 sm:py-44">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.65 0.25 295 / 0.25), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 bg-grid-fine opacity-30" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative mx-auto max-w-5xl text-center"
      >
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 font-mono text-[11px] tracking-widest"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] animate-pulse-glow" />
          NORTH STAR · 2030
        </div>
        <h2 className="font-display text-[clamp(2rem,6vw,5rem)] font-bold leading-[1.05] tracking-tighter">
          To build a studio where{" "}
          <span className="text-gradient-cyber">AI agents</span> and{" "}
          <span className="text-gradient-cinema">cinematic craft</span> create
          products people <em className="not-italic">feel</em>.
        </h2>
      </motion.div>
    </section>
  );
}