import { motion } from "motion/react";
import { SectionHeader } from "./YouTubeSection";

type Project = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  category: string;
  stack: string[];
  accent: string;
  gradient: string;
  preview: string;
  caseStudyId?: string;
};

const projects: Project[] = [
  {
    name: "SyncWave",
    tagline: "Realtime Synchronized Music & Video Platform",
    description:
      "A production-ready web app that lets people listen to music and watch videos together in perfect sync. Create rooms, invite friends, chat live, and control playback — powered by Supabase Realtime.",
    url: "https://tinyurl.com/syncwaveapp",
    category: "LIVE · REALTIME PLATFORM",
    stack: [
      "Next.js",
      "React 19",
      "TypeScript",
      "Tailwind",
      "Shadcn UI",
      "Supabase",
      "PostgreSQL",
      "Framer Motion",
      "Realtime",
      "Google OAuth",
      "Vercel",
    ],
    accent: "var(--violet)",
    gradient:
      "radial-gradient(120% 90% at 0% 0%, oklch(0.65 0.25 295 / 0.40), transparent 60%), radial-gradient(120% 90% at 100% 100%, oklch(0.78 0.18 220 / 0.35), transparent 60%)",
    preview: "https://tinyurl.com/syncwaveapp",
    caseStudyId: "syncwave-case-study",
  },
  {
    name: "Brainmate",
    tagline: "AI Mental Wellness Assistant",
    description:
      "A conversational AI built for emotional intelligence — a calm, futuristic companion that listens, reflects, and supports daily mental well-being.",
    url: "https://brainmate-seven.vercel.app/",
    category: "AI · WELLNESS",
    stack: ["Next.js", "OpenAI", "Vercel", "Tailwind", "TypeScript"],
    accent: "var(--violet)",
    gradient:
      "radial-gradient(120% 90% at 0% 0%, oklch(0.65 0.25 295 / 0.35), transparent 60%), radial-gradient(120% 90% at 100% 100%, oklch(0.78 0.18 220 / 0.30), transparent 60%)",
    preview: "https://brainmate-seven.vercel.app/",
  },
  {
    name: "Queueless India",
    tagline: "Smart Queue Infrastructure for Citizens",
    description:
      "A civic-tech platform reimagining how India waits — AI-powered virtual queues for public services, hospitals, and government desks. No lines. Just time, given back.",
    url: "https://noqueue-service.preview.emergentagent.com/",
    category: "CIVIC · INFRASTRUCTURE",
    stack: ["React", "FastAPI", "PostgreSQL", "Realtime", "Cloud"],
    accent: "var(--neon)",
    gradient:
      "radial-gradient(120% 90% at 100% 0%, oklch(0.85 0.20 195 / 0.30), transparent 60%), radial-gradient(120% 90% at 0% 100%, oklch(0.72 0.20 50 / 0.20), transparent 60%)",
    preview: "https://noqueue-service.preview.emergentagent.com/",
  },
];

export function FeaturedProjects() {
  return (
    <section id="projects" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          tag="LIVE PRODUCTS · IN PRODUCTION"
          title="Featured Engineering Work"
          desc="Production systems shipped end-to-end — from product thinking to deployed interface."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.name} p={p} i={i} />
          ))}
        </div>

        <SyncWaveCaseStudy />
      </div>
    </section>
  );
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const handleCaseStudy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (p.caseStudyId) {
      document.getElementById(p.caseStudyId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="hover"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: i * 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative block overflow-hidden rounded-3xl glass p-1"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: p.gradient }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="relative flex flex-col gap-5 rounded-[1.4rem] bg-black/30 p-6 backdrop-blur-xl sm:p-8">
        <div
          className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-black/50"
          style={{ boxShadow: "0 30px 80px -30px oklch(0 0 0 / 0.9)" }}
        >
          <div className="flex items-center gap-1.5 border-b border-white/5 bg-black/60 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            <div
              className="ml-3 truncate rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {new URL(p.url).host}
            </div>
          </div>
          {p.name === "SyncWave" ? (
            <SyncWaveMockup accent={p.accent} />
          ) : (
            <iframe
              src={p.preview}
              title={p.name}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
              className="h-[calc(100%-32px)] w-full pointer-events-none"
              style={{
                transform: "scale(0.9)",
                transformOrigin: "top left",
                width: "111.11%",
                height: "calc((100% - 32px) * 1.1111)",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute right-3 top-10 flex items-center gap-1.5 rounded-full bg-black/70 px-2 py-1 font-mono text-[10px] tracking-widest text-white backdrop-blur">
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: p.accent }}
            />
            LIVE
          </div>
        </div>

        <div>
          <div
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: p.accent, fontFamily: "var(--font-mono)" }}
          >
            ◇ {p.category}
          </div>
          <h3 className="mt-2 font-display text-3xl font-bold tracking-tight">{p.name}</h3>
          <div className="mt-1 text-sm font-medium text-foreground/80">{p.tagline}</div>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {p.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-foreground/80"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-foreground transition-transform duration-500 group-hover:translate-x-1">
              <span>VISIT LIVE PROJECT</span>
              <span style={{ color: p.accent }}>↗</span>
            </div>
            {p.caseStudyId && (
              <button
                type="button"
                onClick={handleCaseStudy}
                data-cursor="hover"
                className="relative z-10 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] tracking-widest text-foreground/90 transition-colors hover:bg-white/10"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                CASE STUDY →
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.a>
  );
}

/* ----------------------- SyncWave in-browser mockup ---------------------- */

function SyncWaveMockup({ accent }: { accent: string }) {
  return (
    <div
      className="relative h-[calc(100%-32px)] w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(80% 60% at 20% 20%, oklch(0.30 0.15 295 / 0.6), transparent 60%), radial-gradient(80% 60% at 100% 100%, oklch(0.30 0.15 220 / 0.6), transparent 60%), oklch(0.09 0.03 260)",
      }}
    >
      {/* fine grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.78 0.18 220 / 0.06) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.18 220 / 0.06) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="relative grid h-full grid-cols-[1fr_0.9fr_0.7fr] gap-2 p-2 text-[8px]">
        {/* Left: YouTube + music player */}
        <div className="flex flex-col gap-2">
          <div
            className="relative flex-1 rounded-lg border border-white/10"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 40%, oklch(0.35 0.20 295 / 0.5), oklch(0.10 0.03 260))",
              boxShadow: "inset 0 0 40px oklch(0 0 0 / 0.5)",
            }}
          >
            <div className="absolute left-1.5 top-1.5 rounded bg-red-600 px-1 py-[1px] font-mono text-[7px] font-bold text-white">
              ▶ YT
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="h-6 w-6 rounded-full backdrop-blur"
                style={{
                  background: "oklch(1 0 0 / 0.15)",
                  boxShadow: `0 0 20px ${accent}`,
                }}
              />
            </div>
            <div className="absolute inset-x-2 bottom-1.5 h-[3px] rounded-full bg-white/10">
              <div
                className="h-full w-2/3 rounded-full"
                style={{ background: `linear-gradient(90deg, ${accent}, oklch(0.78 0.18 220))` }}
              />
            </div>
          </div>

          {/* Music player */}
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur">
            <div className="flex items-center gap-1.5">
              <div
                className="h-6 w-6 rounded"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.25 295), oklch(0.78 0.18 220))",
                }}
              />
              <div className="flex-1">
                <div className="h-1 w-3/4 rounded bg-white/60" />
                <div className="mt-1 h-[3px] w-1/2 rounded bg-white/20" />
              </div>
              <div className="flex gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                />
                <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
              </div>
            </div>
            {/* waveform */}
            <div className="mt-1 flex h-3 items-end gap-[1px]">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] rounded-sm"
                  style={{
                    height: `${20 + Math.abs(Math.sin(i * 0.8)) * 80}%`,
                    background:
                      i < 22 ? `linear-gradient(180deg, ${accent}, oklch(0.78 0.18 220))` : "oklch(1 0 0 / 0.15)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Middle: chat */}
        <div className="flex flex-col rounded-lg border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-[7px] tracking-widest text-white/60">LIVE CHAT</span>
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: accent }}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1 overflow-hidden">
            {[
              { u: "aria", c: "this beat 🔥", me: false },
              { u: "you", c: "syncing perfectly", me: true },
              { u: "kai", c: "queue next?", me: false },
              { u: "you", c: "on it", me: true },
              { u: "mira", c: "🎧🎧🎧", me: false },
            ].map((m, i) => (
              <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[85%] rounded-md px-1.5 py-0.5 text-[7px] leading-tight"
                  style={{
                    background: m.me
                      ? `linear-gradient(135deg, ${accent}, oklch(0.78 0.18 220))`
                      : "oklch(1 0 0 / 0.08)",
                    color: m.me ? "oklch(0.1 0.03 260)" : "oklch(0.95 0 0)",
                  }}
                >
                  {!m.me && <div className="text-[6px] font-bold opacity-70">{m.u}</div>}
                  {m.c}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-1 rounded-md border border-white/10 bg-black/40 px-1.5 py-0.5 text-[7px] text-white/40">
            Type a message…
          </div>
        </div>

        {/* Right: members + queue */}
        <div className="flex flex-col gap-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-[7px] tracking-widest text-white/60">ROOM · 5</span>
              <span className="font-mono text-[6px] text-white/40">HOST</span>
            </div>
            {["nsd", "aria", "kai", "mira", "leo"].map((u, i) => (
              <div key={u} className="mt-0.5 flex items-center gap-1">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    background: i === 0 ? accent : `oklch(0.6 0.15 ${200 + i * 30})`,
                    boxShadow: i === 0 ? `0 0 6px ${accent}` : "none",
                  }}
                />
                <span className="text-[7px] text-white/80">{u}</span>
                {i === 0 && (
                  <span className="ml-auto rounded-sm bg-white/10 px-1 text-[6px] text-white/70">
                    ★
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur">
            <span className="font-mono text-[7px] tracking-widest text-white/60">QUEUE</span>
            {["Midnight Drive", "Neon Skies", "Weightless"].map((t, i) => (
              <div key={t} className="mt-0.5 flex items-center gap-1">
                <span className="font-mono text-[6px] text-white/40">{i + 1}</span>
                <div className="flex-1">
                  <div className="h-[3px] w-full rounded bg-white/20" />
                  <div className="mt-[2px] text-[6px] text-white/70">{t}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating playback controls */}
      <div
        className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2 py-1 backdrop-blur-md"
        style={{ boxShadow: `0 0 20px ${accent}` }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
        <span
          className="grid h-3 w-3 place-items-center rounded-full"
          style={{ background: accent }}
        >
          <span className="h-1 w-1 rounded-[1px] bg-black" />
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
        <span className="ml-1 font-mono text-[6px] tracking-widest text-white/70">SYNCED</span>
      </div>
    </div>
  );
}

/* --------------------------- Case study section -------------------------- */

function SyncWaveCaseStudy() {
  const features = [
    "Room creation",
    "Invite links",
    "Live synchronization",
    "Live chat",
    "Queue management",
    "YouTube support",
    "Audio uploads",
    "Authentication",
    "Host controls",
    "Mobile responsive",
  ];
  const stack = [
    "Next.js",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "Shadcn UI",
    "Supabase",
    "PostgreSQL",
    "Framer Motion",
    "Realtime",
    "Google OAuth",
    "Vercel",
  ];
  const challenges = [
    {
      t: "Sub-second Sync",
      d: "Server-authoritative playback clock with client drift correction keeps every participant within ~200ms — regardless of network jitter.",
    },
    {
      t: "Latency Correction",
      d: "Continuous RTT sampling + adaptive seek thresholds prevent constant micro-seeks that would break the listening experience.",
    },
    {
      t: "Reconnect Recovery",
      d: "On disconnect, the client rehydrates room state from Postgres and re-subscribes to Realtime channels — replaying missed events atomically.",
    },
    {
      t: "Realtime State",
      d: "Optimistic UI, CRDT-style queue merges, and single-writer host controls keep chat, queue, and playback consistent across all peers.",
    },
    {
      t: "Scalable Architecture",
      d: "Stateless Next.js edge routes, Postgres RLS, and Supabase Realtime channels scale horizontally with zero session pinning.",
    },
  ];

  return (
    <motion.section
      id="syncwave-case-study"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="relative mt-24 scroll-mt-24 overflow-hidden rounded-3xl glass p-1"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(80% 60% at 0% 0%, oklch(0.65 0.25 295 / 0.25), transparent 60%), radial-gradient(80% 60% at 100% 100%, oklch(0.78 0.18 220 / 0.25), transparent 60%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="relative rounded-[1.4rem] bg-black/40 p-8 backdrop-blur-xl sm:p-12">
        <div
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: "var(--violet)", fontFamily: "var(--font-mono)" }}
        >
          ◇ CASE STUDY · SYNCWAVE
        </div>
        <h3 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Listening together, <span className="text-gradient-cyber">in perfect sync.</span>
        </h3>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <CaseBlock title="Overview">
            SyncWave is a realtime platform where friends listen to music and watch videos together
            — every play, pause, and seek mirrored across every device in the room.
          </CaseBlock>
          <CaseBlock title="Problem">
            Watching or listening with friends online almost always drifts out of sync. Group calls
            over screen share are laggy, low-quality, and one-sided.
          </CaseBlock>
          <CaseBlock title="Solution">
            A server-authoritative playback engine on top of Supabase Realtime — with a modern
            architecture that keeps every participant aligned in real time.
          </CaseBlock>
        </div>

        <div className="mt-12">
          <SubHead>Key Features</SubHead>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground/85"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--violet)" }}
                />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <SubHead>Tech Stack</SubHead>
          <div className="mt-4 flex flex-wrap gap-2">
            {stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] tracking-wide text-foreground/85"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <SubHead>Engineering Challenges</SubHead>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {challenges.map((c) => (
              <div
                key={c.t}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur"
              >
                <div
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: "var(--neon)", fontFamily: "var(--font-mono)" }}
                >
                  {c.t}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <SubHead>Outcome</SubHead>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/85">
            A production-ready platform delivering smooth synchronization, a responsive premium UI,
            resilient realtime collaboration, and a modern architecture that scales — shipped
            end-to-end and live on the web today.
          </p>

          <div className="mt-6">
            <a
              href="https://tinyurl.com/syncwaveapp"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2 font-mono text-xs tracking-widest text-foreground transition-colors hover:bg-white/10"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              VISIT LIVE PROJECT
              <span style={{ color: "var(--violet)" }}>↗</span>
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function CaseBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
      <div
        className="font-mono text-[10px] uppercase tracking-widest text-foreground/60"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {title}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/85">{children}</p>
    </div>
  );
}

function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 max-w-8 bg-white/20" />
      <span
        className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/70"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {children}
      </span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}