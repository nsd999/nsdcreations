import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Loader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += 4 + Math.random() * 8;
      if (v >= 100) {
        v = 100;
        clearInterval(id);
        setTimeout(() => setDone(true), 350);
      }
      setPct(Math.min(100, Math.round(v)));
    }, 60);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-background"
        >
          <div className="absolute inset-0 bg-grid-fine opacity-30" />
          <div className="relative w-full max-w-md px-6 text-center">
            <div className="font-display text-6xl font-bold tracking-tighter text-gradient-cyber sm:text-8xl">
              SDN
            </div>
            <div
              className="mt-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              SAI DHEERAJ NALKARI
            </div>
            <div className="mx-auto mt-10 h-px w-full max-w-sm overflow-hidden bg-white/10">
              <div
                className="h-full transition-all duration-150"
                style={{
                  width: `${pct}%`,
                  background: "var(--gradient-cyber)",
                  boxShadow: "0 0 20px var(--cyber)",
                }}
              />
            </div>
            <div
              className="mt-3 flex justify-between font-mono text-[10px] tracking-widest text-muted-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span>INITIALIZING</span>
              <span>{String(pct).padStart(3, "0")}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}