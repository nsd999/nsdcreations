import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { tipsData } from "@/lib/tips-data";
import { getCmsTipBySlug } from "@/lib/public-cms";
import { SITE_URL } from "@/lib/site-config";
import TipsPage from "@/app/tips/page";
import TipDetailsClient from "./TipDetailsClient";

const categories = ["branding", "marketing", "development", "automation", "finance", "operations"];

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slugSegments = resolvedParams.slug || [];

  if (slugSegments.length === 1) {
    const rawParam = slugSegments[0].toLowerCase();
    const matchingCategory = categories.find((cat) => cat === rawParam);

    if (matchingCategory) {
      const title = `${matchingCategory.charAt(0).toUpperCase() + matchingCategory.slice(1)} Strategies | NSD Creations`;
      const description = `Explore our top ${matchingCategory} strategies and actionable tips from NSD Creations to accelerate your business growth.`;
      const canonical = `${SITE_URL}/tips/${matchingCategory}`;
      return {
        title,
        description,
        alternates: { canonical },
        openGraph: { title, description, url: canonical, siteName: "NSD Creations", type: "website" },
        twitter: { card: "summary_large_image", title, description },
      };
    }

    let tip = tipsData.find((item) => item.slug.toLowerCase() === rawParam);
    if (!tip) {
      try { tip = await getCmsTipBySlug(rawParam); } catch { /* fall through to the not-found metadata */ }
    }
    if (tip) {
      const title = `${tip.title} | NSD Creations`;
      const description = tip.excerpt;
      const canonical = `${SITE_URL}/tips/${tip.category.toLowerCase()}/${tip.slug}`;
      return {
        title,
        description,
        alternates: { canonical },
        openGraph: { title, description, url: canonical, siteName: "NSD Creations", type: "article" },
        twitter: { card: "summary_large_image", title, description },
      };
    }
  }

  if (slugSegments.length === 2) {
    const tipSlug = slugSegments[1].toLowerCase();
    let tip = tipsData.find((item) => item.slug.toLowerCase() === tipSlug);
    if (!tip) {
      try { tip = await getCmsTipBySlug(tipSlug); } catch { /* fall through to the not-found metadata */ }
    }
    if (tip) {
      const title = `${tip.title} | NSD Creations`;
      const description = tip.excerpt;
      const canonical = `${SITE_URL}/tips/${tip.category.toLowerCase()}/${tip.slug}`;
      return {
        title,
        description,
        alternates: { canonical },
        openGraph: { title, description, url: canonical, siteName: "NSD Creations", type: "article" },
        twitter: { card: "summary_large_image", title, description },
      };
    }
  }

  return {
    title: "Tips & Strategies | NSD Creations",
    robots: { index: false, follow: false },
  };
}

export default async function DynamicTipsPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slugSegments = resolvedParams.slug || [];

  let tip: any = null;
  let isCategory = false;

  if (slugSegments.length === 1) {
    const rawParam = slugSegments[0].toLowerCase();
    if (categories.find((cat) => cat === rawParam)) {
      isCategory = true;
    } else {
      tip = tipsData.find((t) => t.slug.toLowerCase() === rawParam);
      if (!tip) tip = await getCmsTipBySlug(rawParam);
    }
  } else if (slugSegments.length === 2) {
    const tipSlug = slugSegments[1].toLowerCase();
    tip = tipsData.find((t) => t.slug.toLowerCase() === tipSlug);
    if (!tip) tip = await getCmsTipBySlug(tipSlug);
  }

  if (isCategory) {
    return <TipsPage />;
  }

  if (tip) {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": tip.title,
      "description": tip.excerpt,
      "author": {
        "@type": "Organization",
        "name": "NSD Creations",
        "url": `${SITE_URL}/`
      },
      "publisher": {
        "@type": "Organization",
        "name": "NSD Creations",
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}/icons/icon-512.png`
        }
      },
      "url": `${SITE_URL}/tips/${tip.category.toLowerCase()}/${tip.slug}`
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <TipDetailsClient slug={tip.slug} tipOverride={tip} />
      </>
    );
  }

  notFound();
}

