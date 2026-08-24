import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | NSD Creations — AI Creative Studio & Digital Agency",
  description:
    "Explore 16 specialized services from NSD Creations — AI video production, poster design, branding, social media management, digital marketing, WhatsApp automation, website development, mobile app and custom software development.",
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
