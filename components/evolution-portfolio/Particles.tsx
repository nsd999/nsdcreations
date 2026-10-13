"use client";

import { useEffect, useRef } from "react";

interface Props {
  color?: string;
  density?: number;
  className?: string;
}

export function Particles({
  color = "#7C6BFF",
  density = 60,
  className = "",
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compactViewport = window.matchMedia("(max-width: 767px)").matches;
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    let width = 0;
    let height = 0;
    let raf = 0;
    let redrawStaticFrame: (() => void) | undefined;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width * dpr));
      height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    // Reduce canvas work on small screens while keeping the same particle effect.
    const safeDensity = Math.max(0, Math.min(compactViewport ? 32 : 250, Math.floor(density)));
    const particles = Array.from({ length: safeDensity }, () => ({
      x: Math.random() * (width / dpr),
      y: Math.random() * (height / dpr),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
    }));

    const draw = (moveParticles: boolean) => {
      const w = width / dpr;
      const h = height / dpr;
      context.clearRect(0, 0, w, h);
      context.fillStyle = color;

      particles.forEach((particle) => {
        if (moveParticles) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < 0 || particle.x > w) particle.vx *= -1;
          if (particle.y < 0 || particle.y > h) particle.vy *= -1;
        }

        context.globalAlpha = 0.7;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fill();
      });

      context.strokeStyle = color;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.hypot(dx, dy);
          if (distance < 120) {
            context.globalAlpha = (1 - distance / 120) * 0.2;
            context.beginPath();
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
            context.stroke();
          }
        }
      }
      context.globalAlpha = 1;
    };

    const tick = () => {
      if (document.visibilityState !== "visible") return;
      draw(true);
      raf = window.requestAnimationFrame(tick);
    };

    redrawStaticFrame = () => draw(false);

    const onResize = () => {
      resize();
      particles.forEach((particle) => {
        particle.x = Math.min(particle.x, width / dpr);
        particle.y = Math.min(particle.y, height / dpr);
      });
      if (reducedMotion) redrawStaticFrame?.();
    };

    const onVisibilityChange = () => {
      window.cancelAnimationFrame(raf);
      if (document.visibilityState === "visible" && !reducedMotion) {
        raf = window.requestAnimationFrame(tick);
      } else if (reducedMotion) {
        redrawStaticFrame?.();
      }
    };

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (reducedMotion) {
      draw(false);
    } else if (document.visibilityState === "visible") {
      raf = window.requestAnimationFrame(tick);
    }

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [color, density]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none block h-full w-full ${className}`} />;
}
