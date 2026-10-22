import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Tips & Strategies | NSD Creations",
  description: "Practical tips on branding, digital marketing, web development, automation, finance and business operations.",
  alternates: { canonical: `${SITE_URL}/tips` },
  openGraph: {
    title: "Tips & Strategies | NSD Creations",
    description: "Practical guidance across creative, technology and business operations.",
    url: `${SITE_URL}/tips`,
    siteName: "NSD Creations",
    type: "website",
  },
};

export default function TipsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
