import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { tipsData } from "@/lib/tips-data";
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
      return {
        title: `${matchingCategory.charAt(0).toUpperCase() + matchingCategory.slice(1)} Strategies | NSD Creations`,
        description: `Explore our top ${matchingCategory} strategies and actionable tips from NSD Creations to accelerate your business growth.`,
      };
    }

    const tip = tipsData.find((t) => t.slug.toLowerCase() === rawParam);
    if (tip) {
      return {
        title: `${tip.title} | NSD Creations`,
        description: tip.excerpt,
      };
    }
  }

  if (slugSegments.length === 2) {
    const tipSlug = slugSegments[1].toLowerCase();
    const tip = tipsData.find((t) => t.slug.toLowerCase() === tipSlug);
    if (tip) {
      return {
        title: `${tip.title} | NSD Creations`,
        description: tip.excerpt,
      };
    }
  }

  return {
    title: "Tips & Strategies | NSD Creations",
  };
}

export default async function DynamicTipsPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slugSegments = resolvedParams.slug || [];

  let tip = null;
  let isCategory = false;

  if (slugSegments.length === 1) {
    const rawParam = slugSegments[0].toLowerCase();
    if (categories.find((cat) => cat === rawParam)) {
      isCategory = true;
    } else {
      tip = tipsData.find((t) => t.slug.toLowerCase() === rawParam);
    }
  } else if (slugSegments.length === 2) {
    const tipSlug = slugSegments[1].toLowerCase();
    tip = tipsData.find((t) => t.slug.toLowerCase() === tipSlug);
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
        "url": "https://nsdcreations.vercel.app/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "NSD Creations",
        "logo": {
          "@type": "ImageObject",
          "url": "https://nsdcreations.vercel.app/nsdlogo.png"
        }
      },
      "url": `https://nsdcreations.vercel.app/tips/${tip.category.toLowerCase()}/${tip.slug}`
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <TipDetailsClient slug={tip.slug} />
      </>
    );
  }

  notFound();
}

