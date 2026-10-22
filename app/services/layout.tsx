import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Creative Technology Services | NSD Creations",
  description:
    "Explore creative production, branding, marketing, automation, websites, software, music visuals and digital learning services from NSD Creations.",
  keywords: [
    "NSD Creations services",
    "AI video production India",
    "branding services Hyderabad",
    "digital marketing agency",
    "WhatsApp chatbot development",
    "website development India",
    "mobile app development",
    "AI automation services",
  ],
  openGraph: {
    title: "Services | NSD Creations",
    description:
      "16 specialized creative, branding, marketing, automation and technology services from NSD Creations.",
    url: "https://nsdcreations.vercel.app/services",
    siteName: "NSD Creations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | NSD Creations",
    description:
      "16 specialized creative, branding, marketing, automation and technology services from NSD Creations.",
  },
  alternates: {
    canonical: "https://nsdcreations.vercel.app/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
