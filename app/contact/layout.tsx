import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact NSD Creations | Project Enquiries",
  description: "Send NSD Creations a project enquiry for creative production, design, websites, software, automation or learning materials.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: "Contact NSD Creations",
    description: "Share your brief to discuss a project scope and quote.",
    url: `${SITE_URL}/contact`,
    siteName: "NSD Creations",
    type: "website",
  },
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
