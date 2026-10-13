import { motion } from "motion/react";
import { useRef, useState } from "react";

const CATEGORIES: { tag: string; title: string; desc: string; ids: string[] }[] = [
  {
    tag: "REEL · CINEMATIC EDITS",
    title: "Featured Cinematic Edits",
    desc: "Color-graded sequences and signature edits — directed for emotion, rhythm, and tone.",
    ids: ["G6XT1zAl4i8", "BpPz2qqLq5I"],
  },
  {
    tag: "LAB · AI MUSIC",
    title: "AI Song Projects",
    desc: "Compositions written, arranged, and produced through AI-assisted creative workflows.",
    ids: ["kyMY4ttmRQw", "m66Q-s3iKEI"],
  },
  {
    tag: "STUDIO · EXPERIMENTS",
    title: "Creative Experiments",
    desc: "Short-form motion experiments — fast loops of the studio's visual language.",
    ids: ["wgws81esrb0"],
  },
];

const ALL_IDS = CATEGORIES.flatMap((c) => c.ids);

type YTVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration?: string;
  viewCount?: string;
  publishedAt?: string;
  isShort?: boolean;
};

const VIDEO_TITLES: Record<string, string> = {
  G6XT1zAl4i8: "Featured Cinematic Edit — Cut 01",
  BpPz2qqLq5I: "Featured Cinematic Edit — Cut 02",
  kyMY4ttmRQw: "AI Song Project — Track 01",
  "m66Q-s3iKEI": "AI Song Project — Track 02",
  wgws81esrb0: "Creative Motion Experiment",
};

export function YouTubeSection() {
  const data: YTVideo[] = ALL_IDS.map((id) => {
    const category = CATEGORIES.find((item) => item.ids.includes(id));
    return {
      id,
      title: VIDEO_TITLES[id] ?? "NSD Creative Video",
      description: category?.desc ?? "A creative video from the NSD archive.",
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      isShort: id === "wgws81esrb0",
    };
  });
  const isLoading = false;
  const [active, setActive] = useState<YTVideo | null>(null);

  const byId = new Map((data ?? []).map((v) => [v.id, v]));

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto mb-12 max-w-7xl px-6">
        <SectionHeader
          tag="LIVE · YouTube Data API v3"
          title="Cinematic Reel & AI Music Lab"
          desc="A curated archive of edits, AI compositions, and short-form experiments — handpicked, not auto-fed."
        />
      </div>

      <div className="space-y-20">
        {CATEGORIES.map((cat) => {
          const videos = cat.ids.map((id) => byId.get(id)).filter(Boolean) as YTVideo[];
          return (
            <CategoryRow
              key={cat.title}
              tag={cat.tag}
              title={cat.title}
              desc={cat.desc}
              videos={videos}
              isLoading={isLoading}
              skeletonCount={cat.ids.length}
              onOpen={setActive}
            />
          );
        })}
      </div>

      {active && <VideoModal v={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function CategoryRow({
  tag,
  title,
  desc,
  videos,
  isLoading,
  skeletonCount,
  onOpen,
}: {
  tag: string;
  title: string;
  desc: string;
  videos: YTVideo[];
  isLoading: boolean;
  skeletonCount: number;
  onOpen: (v: YTVideo) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mx-auto mb-5 flex max-w-7xl items-end justify-between gap-4 px-6">
        <div>
          <div
            className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ◇ {tag}
          </div>
          <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h3>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{desc}</p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <ScrollBtn dir={-1} onClick={() => scrollBy(-1)} />
          <ScrollBtn dir={1} onClick={() => scrollBy(1)} />
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-6 sm:px-12"
        style={{ cursor: "grab" }}
        onMouseDown={(e) => {
          const el = scrollerRef.current;
          if (!el) return;
          dragState.current = {
            isDown: true,
            startX: e.pageX - el.offsetLeft,
            scrollLeft: el.scrollLeft,
            moved: false,
          };
          el.style.cursor = "grabbing";
        }}
        onMouseLeave={() => {
          dragState.current.isDown = false;
          if (scrollerRef.current) scrollerRef.current.style.cursor = "grab";
        }}
        onMouseUp={() => {
          dragState.current.isDown = false;
          if (scrollerRef.current) scrollerRef.current.style.cursor = "grab";
        }}
        onMouseMove={(e) => {
          const s = dragState.current;
          const el = scrollerRef.current;
          if (!s.isDown || !el) return;
          e.preventDefault();
          const x = e.pageX - el.offsetLeft;
          const walk = x - s.startX;
          if (Math.abs(walk) > 5) s.moved = true;
          el.scrollLeft = s.scrollLeft - walk;
        }}
      >
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <div
                key={i}
                className="aspect-video w-[78vw] flex-shrink-0 animate-pulse rounded-2xl bg-white/5 animate-shimmer sm:w-[560px]"
              />
            ))
          : videos.map((v, i) => (
              <VideoCard
                key={v.id}
                v={v}
                i={i}
                onOpen={() => {
                  if (!dragState.current.moved) onOpen(v);
                }}
              />
            ))}
        <div className="w-2 flex-shrink-0" />
      </div>
    </div>
  );
}

function ScrollBtn({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      data-cursor="hover"
      aria-label={dir === 1 ? "Scroll right" : "Scroll left"}
      className="flex h-10 w-10 items-center justify-center rounded-full glass text-foreground transition hover:bg-white/10"
    >
      {dir === 1 ? "→" : "←"}
    </button>
  );
}

function VideoCard({ v, i, onOpen }: { v: YTVideo; i: number; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  const isShort = v.isShort;
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: i * 0.06 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onOpen}
      data-cursor="hover"
      className={`group relative flex-shrink-0 snap-start overflow-hidden rounded-2xl text-left glass-cinema transition-all hover:-translate-y-1 ${
        isShort ? "w-[60vw] sm:w-[320px]" : "w-[82vw] sm:w-[560px]"
      }`}
      style={{ boxShadow: hover ? "var(--shadow-glow-cinema)" : "var(--shadow-card)" }}
    >
      <div className={`relative overflow-hidden ${isShort ? "aspect-[9/16]" : "aspect-video"}`}>
        {hover ? (
          <iframe
            className="pointer-events-none absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${v.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${v.id}&modestbranding=1&playsinline=1`}
            allow="autoplay; encrypted-media"
          />
        ) : (
          <img
            src={v.thumbnail}
            alt={v.title}
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        {v.duration && (
          <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 font-mono text-[11px] text-white backdrop-blur">
            {v.duration}
          </div>
        )}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          {isShort ? "SHORT" : "NSD"}
        </div>
        <div className="absolute inset-x-0 bottom-0 translate-y-1 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-black w-max">
            ▶ Play
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{v.title}</h3>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          {v.publishedAt ? (
            <span>
              {new Date(v.publishedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          ) : <span>NSD Archive</span>}
          {v.viewCount && <span>{Number(v.viewCount).toLocaleString()} views</span>}
        </div>
      </div>
    </motion.button>
  );
}

function VideoModal({ v, onClose }: { v: YTVideo; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full overflow-hidden rounded-2xl glass-cinema ${
          v.isShort ? "max-w-md" : "max-w-5xl"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur hover:bg-black"
        >
          ✕ Close
        </button>
        <div className={v.isShort ? "aspect-[9/16]" : "aspect-video"}>
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${v.id}?autoplay=1`}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold">{v.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{v.description}</p>
        </div>
      </div>
    </div>
  );
}

export function SectionHeader({
  tag,
  title,
  desc,
}: {
  tag: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div
        className="mb-4 inline-flex items-center gap-2 rounded-full glass px-3 py-1 font-mono text-[11px] tracking-widest text-muted-foreground"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--ember)] animate-pulse-glow" />
        {tag}
      </div>
      <h2 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">{desc}</p>
    </div>
  );
}