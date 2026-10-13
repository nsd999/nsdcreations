"use client";

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

    const ctx = c.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      const rect = c.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width * dpr));
      h = Math.max(1, Math.floor(rect.height * dpr));
      c.width = w;
      c.height = h;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const safeDensity = Math.max(0, Math.min(250, Math.floor(density)));
    const parts = Array.from({ length: safeDensity }, () => ({
      x: Math.random() * (w / dpr),
      y: Math.random() * (h / dpr),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
    }));

    const onResize = () => {
      resize();
      parts.forEach((p) => {
        p.x = Math.min(p.x, w / dpr);
        p.y = Math.min(p.y, h / dpr);
      });
    };

    window.addEventListener("resize", onResize);

    const tick = () => {
      const width = w / dpr;
      const height = h / dpr;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      parts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = color;
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const dx = parts[i].x - parts[j].x;
          const dy = parts[i].y - parts[j].y;
          const distance = Math.hypot(dx, dy);
          if (distance < 120) {
            ctx.globalAlpha = (1 - distance / 120) * 0.2;
            ctx.beginPath();
            ctx.moveTo(parts[i].x, parts[i].y);
            ctx.lineTo(parts[j].x, parts[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [color, density]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none block h-full w-full ${className}`} />;
}
