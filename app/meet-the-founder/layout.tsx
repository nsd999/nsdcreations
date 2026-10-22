import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Meet the Founder | NSD Creations",
  description: "Meet the founder of NSD Creations and learn about the studio's approach to creative technology and digital projects.",
  alternates: { canonical: `${SITE_URL}/meet-the-founder` },
  openGraph: {
    title: "Meet the Founder | NSD Creations",
    description: "The founder and approach behind NSD Creations.",
    url: `${SITE_URL}/meet-the-founder`,
    siteName: "NSD Creations",
    type: "profile",
  },
};

export default function FounderLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
