import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "NSD Creations | Your Creative Technology Partner",
  description: "NSD Creations provides AI video production, graphic design, branding, digital marketing, business automation and web/software development. Discuss a clearly scoped project and quote.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "NSD Creations | Your Creative Technology Partner",
    description: "Creative production, design, automation and software services with clear scope and direct project enquiries.",
    url: SITE_URL,
    siteName: "NSD Creations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NSD Creations | Your Creative Technology Partner",
    description: "Creative production, design, automation and software services with clear scope and direct project enquiries.",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
