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

export default function PortfolioPage() {
  return (
    <div className="evolution-lab-portfolio">
      <Loader />
      <CustomCursor />
      <Nav />
      <main className="relative">
        <Hero />

        {/* Creative world */}
        <div className="world-creative relative bg-background">
          <YouTubeSection />
          <Posters />
          <BehindTheEdit />
        </div>

        {/* The cinematic transition from creative work to technology */}
        <Evolution />

        {/* Technology and builder world */}
        <div className="relative bg-background">
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
