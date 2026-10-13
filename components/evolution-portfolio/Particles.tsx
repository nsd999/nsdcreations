import { useEffect, useRef } from "react";

interface Props {
  color?: string;
  density?: number;
  className?: string;
}

export function Particles({
  color = "oklch(0.85 0.20 195)",
  density = 60,
  className = "",
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    let raf = 0;
    let w = (c.width = c.offsetWidth * devicePixelRatio);
    let h = (c.height = c.offsetHeight * devicePixelRatio);
    const parts = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
    }));
    const onResize = () => {
      w = c.width = c.offsetWidth * devicePixelRatio;
      h = c.height = c.offsetHeight * devicePixelRatio;
    };
    window.addEventListener("resize", onResize);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      parts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      });
      // connect
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = color;
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const dx = parts[i].x - parts[j].x;
          const dy = parts[i].y - parts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120 * devicePixelRatio) {
            ctx.globalAlpha = (1 - d / (120 * devicePixelRatio)) * 0.2;
            ctx.beginPath();
            ctx.moveTo(parts[i].x, parts[i].y);
            ctx.lineTo(parts[j].x, parts[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [color, density]);

  return <canvas ref={ref} className={`h-full w-full ${className}`} />;
}