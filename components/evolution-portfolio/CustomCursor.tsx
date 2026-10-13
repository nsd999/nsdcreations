import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      setHover(!!t.closest("a, button, [data-cursor='hover']"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <>
      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
      >
        <div
          className="rounded-full transition-all duration-200"
          style={{
            width: hover ? 44 : 12,
            height: hover ? 44 : 12,
            marginLeft: hover ? -22 : -6,
            marginTop: hover ? -22 : -6,
            border: "1.5px solid var(--cyber)",
            background: hover ? "oklch(0.78 0.18 220 / 0.1)" : "transparent",
            boxShadow: "0 0 20px oklch(0.78 0.18 220 / 0.6)",
          }}
        />
      </motion.div>
      <motion.div
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
      >
        <div
          className="h-[4px] w-[4px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "var(--neon)", boxShadow: "0 0 8px var(--neon)" }}
        />
      </motion.div>
    </>
  );
}