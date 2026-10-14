"use client";

import "./portfolio.css";
import { Loader } from "@/components/evolution-portfolio/Loader";
import { CustomCursor } from "@/components/evolution-portfolio/CustomCursor";
import { Nav } from "@/components/evolution-portfolio/Nav";
import { Hero } from "@/components/evolution-portfolio/Hero";
import { YouTubeSection } from "@/components/evolution-portfolio/YouTubeSection";
import { Posters } from "@/components/evolution-portfolio/Posters";
import { BehindTheEdit } from "@/components/evolution-portfolio/BehindTheEdit";
import { Evolution } from "@/components/evolution-portfolio/Evolution";
import { Skills } from "@/components/evolution-portfolio/Skills";
import { FeaturedProjects } from "@/components/evolution-portfolio/FeaturedProjects";
import { Projects } from "@/components/evolution-portfolio/Projects";
import { Experiments } from "@/components/evolution-portfolio/Experiments";
import { Vision } from "@/components/evolution-portfolio/Vision";
import { Contact } from "@/components/evolution-portfolio/Contact";

const authorServices = [
  {
    number: "01",
    title: "Book & Story Creatives",
    description:
      "Cover concepts, launch posters, quote cards, and promotional graphics that give your story a polished visual identity.",
  },
  {
    number: "02",
    title: "Author Promotion",
    description:
      "Social media creatives and campaign assets to introduce your book, share excerpts, and build interest around a launch.",
  },
  {
    number: "03",
    title: "Story Teaser Videos",
    description:
      "Short promotional videos and visual teasers designed to bring a story's mood, characters, or central idea to life.",
  },
  {
    number: "04",
    title: "Author Websites",
    description:
      "A simple, professional online home for your author profile, published work, announcements, and reader enquiries.",
  },
];

export default function PortfolioPage() {
  return (
    <div className="evolution-lab-portfolio">
      <Loader />
      <CustomCursor />
      <Nav />
      <main className="relative">
        <Hero />

        {/* Dedicated overview for authors, writers, and storytellers */}
        <section
          id="authors"
          aria-labelledby="authors-heading"
          className="relative scroll-mt-24 overflow-hidden border-y border-black/10 bg-[#f8f0e4] px-5 py-20 text-[#201a17] sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <div className="max-w-xl">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#8b5b35]">
                  For authors & storytellers
                </p>
                <h2
                  id="authors-heading"
                  className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
                >
                  Your story deserves to be{" "}
                  <span className="font-serif italic text-[#9a542b]">
                    seen and remembered.
                  </span>
                </h2>
                <p className="mt-6 max-w-lg text-base leading-7 text-[#62564d] sm:text-lg">
                  NSD Creations helps writers present and promote their work
                  through thoughtful design and digital storytelling—from the
                  first announcement to a book launch and beyond.
                </p>
                <p className="mt-4 max-w-lg text-sm leading-6 text-[#74675d]">
                  We focus on creative and digital support. Professional
                  manuscript editing and publishing are specialist services;
                  we do not claim to be a publishing house or promise publisher
                  introductions without a verified contact.
                </p>
                <a
                  href="https://wa.me/919492651908?text=Hello%20NSD%20Creations%2C%20I%27m%20an%20author%20and%20would%20like%20to%20discuss%20creative%20support%20for%20my%20story%20or%20book."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#201a17] px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#9a542b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a542b]"
                >
                  Discuss your story
                  <span aria-hidden="true">↗</span>
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {authorServices.map((service) => (
                  <article
                    key={service.number}
                    className="rounded-2xl border border-[#d9c9b6] bg-white/65 p-6 sm:p-7"
                  >
                    <p className="font-mono text-xs tracking-[0.18em] text-[#9a542b]">
                      {service.number}
                    </p>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#62564d]">
                      {service.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <div className="mt-12 border-t border-[#d9c9b6] pt-6 text-sm leading-6 text-[#74675d]">
              Already have a manuscript? Tell us what stage you are at and
              what kind of support you need. We will be clear about what we
              can provide and what requires an independent specialist.
            </div>
          </div>
        </section>

        {/* Creative world */}
        <div id="creative" className="world-creative relative scroll-mt-24 bg-background">
          <YouTubeSection />
          <Posters />
          <BehindTheEdit />
        </div>

        {/* The cinematic transition from creative work to technology */}
        <Evolution />

        {/* Technology and builder world */}
        <div id="tech" className="relative scroll-mt-24 bg-background">
          <Skills />
          <FeaturedProjects />
          <Projects />
          <Experiments />
          <Vision />
          <Contact />
        </div>
      </main>
    </div>
  );
}
