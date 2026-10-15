"use client";

import { useEffect, useState } from "react";

interface CmsProject {
  id: string;
  title: string;
  category?: string | null;
  client?: string | null;
  description?: string | null;
  image?: string | null;
  coverImage?: string | null;
  liveUrl?: string | null;
  link?: string | null;
  tech?: string[];
}

export function AdminManagedProjects() {
  const [items, setItems] = useState<CmsProject[]>([]);
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch("/api/public/portfolio", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (active) setItems(Array.isArray(data.items) ? data.items : []);
      } catch {
        // Existing portfolio sections remain available if the CMS is temporarily offline.
      }
    };
    void refresh();
    const interval = window.setInterval(() => void refresh(), 10000);
    return () => { active = false; window.clearInterval(interval); };
  }, []);

  if (!items.length) return null;
  return (
    <section className="relative px-6 py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-indigo-400 mb-3">Latest client work</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Projects from NSD Creations</h2>
          <p className="mt-4 text-sm md:text-base text-muted-foreground">Published projects are updated from the NSD Creations admin panel.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {items.map((item) => {
            const image = item.coverImage || item.image;
            const href = item.liveUrl || item.link;
            return (
              <article key={item.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-transform duration-300 hover:-translate-y-1">
                <div className="aspect-[16/10] overflow-hidden bg-black/20">
                  {image ? <img src={image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : <div className="h-full w-full grid place-items-center text-xs text-muted-foreground">NSD Creations</div>}
                </div>
                <div className="p-5 md:p-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-300">{item.category || "Project"}</p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug">{item.title}</h3>
                  {item.client && <p className="mt-1 text-xs text-muted-foreground">Client: {item.client}</p>}
                  {item.description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>}
                  {Array.isArray(item.tech) && item.tech.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{item.tech.slice(0, 5).map((tech) => <span key={tech} className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-muted-foreground">{tech}</span>)}</div>}
                  {href && href !== "#" && <a href={href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center text-xs font-semibold text-indigo-300 hover:text-indigo-200">View project <span aria-hidden="true" className="ml-2">↗</span></a>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
