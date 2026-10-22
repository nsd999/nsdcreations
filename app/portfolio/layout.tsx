import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Creative & Technology Portfolio | NSD Creations",
  description: "Explore selected creative, branding, video and software work from NSD Creations.",
  alternates: { canonical: `${SITE_URL}/portfolio` },
  openGraph: {
    title: "Creative & Technology Portfolio | NSD Creations",
    description: "Selected creative, branding, video and software work from NSD Creations.",
    url: `${SITE_URL}/portfolio`,
    siteName: "NSD Creations",
    type: "website",
  },
};

export default function PortfolioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
