import React from "react";
import { notFound } from "next/navigation";
import { tipsData } from "@/lib/tips-data";
import TipsPage from "@/app/tips/page";
import TipDetailsClient from "./TipDetailsClient";

const categories = ["branding", "marketing", "development", "automation", "finance", "operations"];

export default async function DynamicTipsPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slugSegments = resolvedParams.slug || [];

  if (slugSegments.length === 1) {
    const rawParam = slugSegments[0].toLowerCase();

    // Check if 1st segment is a category (e.g., /tips/branding, /tips/finance)
    const matchingCategory = categories.find((cat) => cat === rawParam);
    if (matchingCategory) {
      const capitalizedCategory = matchingCategory.charAt(0).toUpperCase() + matchingCategory.slice(1);
      return <TipsPage initialCategory={capitalizedCategory} />;
    }

    // Check if 1st segment is a tip slug (e.g., /tips/cash-flow-management-basics)
    const tip = tipsData.find((t) => t.slug.toLowerCase() === rawParam);
    if (tip) {
      return <TipDetailsClient slug={tip.slug} />;
    }

    notFound();
  }

  if (slugSegments.length === 2) {
    const tipSlug = slugSegments[1].toLowerCase();
    const tip = tipsData.find((t) => t.slug.toLowerCase() === tipSlug);
    if (tip) {
      return <TipDetailsClient slug={tip.slug} />;
    }

    notFound();
  }

  notFound();
}
