import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Our Project Process | NSD Creations",
  description: "Understand how NSD Creations scopes, plans, reviews and delivers creative and software projects.",
  alternates: { canonical: `${SITE_URL}/process` },
  openGraph: {
    title: "Our Project Process | NSD Creations",
    description: "How NSD Creations scopes and delivers creative and software projects.",
    url: `${SITE_URL}/process`,
    siteName: "NSD Creations",
    type: "website",
  },
};

export default function ProcessLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
