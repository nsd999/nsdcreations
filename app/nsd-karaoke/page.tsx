import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NSD Karaoke | Official Artist Page",
  description:
    "Official NSD Karaoke artist page by NSD Creations. Discover Otami Vachina Adugu Aapaku and Idhi Mana Sound, and follow NSD Karaoke across music and social platforms.",
  alternates: { canonical: "https://nsdcreations.vercel.app/nsd-karaoke" },
  openGraph: {
    title: "NSD Karaoke — Official Artist Page",
    description:
      "Original music from NSD Creations. Listen to the latest releases and follow NSD Karaoke.",
    url: "https://nsdcreations.vercel.app/nsd-karaoke",
    siteName: "NSD Creations",
    type: "website",
  },
};

const songs = [
  {
    title: "ఓటమి వచ్చినా అడుగు ఆపకు",
    englishTitle: "Otami Vachina Adugu Aapaku",
    mood: "Motivational • Telugu",
    spotify: "https://open.spotify.com/track/2KHCrcioSD3O0XXhzkSKnm",
    number: "01",
  },
  {
    title: "IDHI MANA SOUND",
    englishTitle: "Idhi Mana Sound",
    mood: "Telugu • High-energy",
    spotify: "https://open.spotify.com/track/0IhSTyftpmxDiGCr8iFXIB",
    number: "02",
  },
];

const platforms = [
  { name: "Spotify", href: "https://open.spotify.com/artist/" },
  { name: "Apple Music", href: "https://music.apple.com/" },
  { name: "YouTube Music", href: "https://music.youtube.com/" },
  { name: "Amazon Music", href: "https://music.amazon.com/" },
];

export default function NSDKaraokePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#09090d] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-orange-600/15 blur-[120px]" />
        <div className="absolute right-[-8rem] top-[35rem] h-80 w-80 rounded-full bg-fuchsia-600/10 blur-[110px]" />
      </div>

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <a href="#home" className="flex items-center gap-3" aria-label="NSD Karaoke home">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/15 bg-white/5 text-lg font-black text-orange-300">NSD</span>
          <span>
            <span className="block text-sm font-bold tracking-[0.16em]">NSD KARAOKE</span>
            <span className="block text-xs text-white/50">by NSD Creations</span>
          </span>
        </a>
        <a href="#music" className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-orange-300/60 hover:text-white">
          Explore music ↘
        </a>
      </header>

      <section id="home" className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 md:grid-cols-[1.1fr_.9fr] md:pb-28 md:pt-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-300/25 bg-orange-300/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-orange-200">
            <span className="h-2 w-2 rounded-full bg-orange-300" /> OFFICIAL MUSIC & ARTIST PAGE
          </div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-white/45">NSD Creations presents</p>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-7xl">
            Sound that moves
            <span className="mt-2 block bg-gradient-to-r from-orange-300 via-amber-100 to-fuchsia-300 bg-clip-text text-transparent">you forward.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
            Welcome to NSD Karaoke — home to original Telugu music, uplifting ideas and energetic sounds created under NSD Creations.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#music" className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-orange-200">Listen to the songs ↗</a>
            <a href="https://www.youtube.com/@nsdkaraoke" target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/50">YouTube channel ↗</a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/45">
            <span>Original releases</span><span>Telugu music</span><span>Independent creator</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-5 rounded-[2rem] bg-gradient-to-br from-orange-400/30 to-fuchsia-500/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-[#29201a] via-[#17151d] to-[#12121a] p-5 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.25em] text-white/45"><span>NSD CREATIONS</span><span>ARTIST / 001</span></div>
            <div className="my-8 grid aspect-square place-items-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(251,146,60,.35),transparent_45%),linear-gradient(145deg,#28212a,#101015)]">
              <div className="px-5 text-center">
                <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full border border-orange-200/40 bg-black/25 text-3xl font-black text-orange-200 shadow-[0_0_60px_rgba(251,146,60,.18)]">NSD</div>
                <p className="text-xs font-bold tracking-[0.4em] text-orange-200">MUSIC • MOTIVATION • ENERGY</p>
                <p className="mt-3 text-3xl font-black tracking-tight">NSD KARAOKE</p>
                <p className="mt-2 text-sm text-white/45">A sound of our own.</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div><p className="text-xs text-white/45">Latest releases</p><p className="mt-1 text-sm font-semibold">Two songs. One growing journey.</p></div>
              <a href="#music" className="grid h-10 w-10 place-items-center rounded-full bg-orange-300 text-xl font-black text-black" aria-label="Jump to music">↘</a>
            </div>
          </div>
        </div>
      </section>

      <section id="music" className="relative border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-bold tracking-[0.28em] text-orange-200">THE RELEASES</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Press play. Keep moving.</h2></div>
            <span className="text-sm text-white/45">Available on Spotify</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {songs.map((song) => (
              <article key={song.number} className="group rounded-3xl border border-white/10 bg-[#111116]/90 p-5 transition hover:-translate-y-1 hover:border-orange-200/30 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-bold tracking-[0.25em] text-orange-200/80">{song.number} / SINGLE</span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/50">{song.mood}</span>
                </div>
                <h3 className="mt-7 text-2xl font-black leading-tight sm:text-3xl">{song.title}</h3>
                <p className="mt-2 text-sm text-white/50">{song.englishTitle}</p>
                <div className="mt-7 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                  <span className="text-xs text-white/40">NSD Creations</span>
                  <a href={song.spotify} target="_blank" rel="noreferrer" className="rounded-full bg-[#1ed760] px-5 py-2.5 text-sm font-extrabold text-black transition hover:scale-[1.02]">Listen on Spotify ↗</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <p className="text-xs font-bold tracking-[0.28em] text-orange-200">FIND THE MUSIC</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Follow the sound.</h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">Use the official links below to discover NSD Karaoke. Platform artist pages may appear or become claimable after each distributor finishes delivery and indexing.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {platforms.map((platform) => (
            <a key={platform.name} href={platform.href} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-orange-200/30 hover:bg-white/[0.07]">
              <span className="block text-sm font-bold">{platform.name}</span><span className="mt-2 block text-xs text-white/40">Open platform ↗</span>
            </a>
          ))}
        </div>
        <div className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-r from-orange-300/10 via-white/[0.025] to-fuchsia-300/10 p-6 sm:p-8">
          <h3 className="text-xl font-black">Stay connected</h3>
          <p className="mt-2 text-sm text-white/55">Follow NSD Karaoke for new releases, music videos and updates.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="https://www.youtube.com/@nsdkaraoke" target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold hover:border-white/40">YouTube ↗</a>
            <a href="https://www.instagram.com/nsdkaraoke/" target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold hover:border-white/40">Instagram ↗</a>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="font-bold tracking-[0.15em] text-white/75">NSD KARAOKE</p><p className="mt-1">An independent music identity by NSD Creations.</p></div>
          <div className="sm:text-right"><p>Artist / Brand: NSD Creations</p><a className="mt-1 inline-block text-orange-200 hover:text-orange-100" href="mailto:nsdkaraoke@gmail.com">nsdkaraoke@gmail.com</a></div>
          <a href="https://www.instagram.com/nsdkaraoke/" target="_blank" rel="noreferrer" className="hover:text-white">Instagram ↗</a>
        </div>
      </footer>
    </main>
  );
}
