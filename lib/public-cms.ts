import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function getPublishedCmsTips() {
  try {
    const db = getSupabaseAdmin();
    const { data } = await db
      .from("cms_tips")
      .select("id,slug,category,title,excerpt,content,image,author,published_at,featured")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });

    return data || [];
  } catch {
    return [];
  }
}

export async function getCmsTipBySlug(slug: string) {
  try {
    const db = getSupabaseAdmin();
    const { data } = await db
      .from("cms_tips")
      .select("id,slug,category,title,excerpt,content,image,author,published_at,featured")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .eq("slug", slug)
      .maybeSingle();

    return data || null;
  } catch {
    return null;
  }
}

export async function getPublishedCmsPortfolio() {
  try {
    const db = getSupabaseAdmin();
    const { data } = await db
      .from("cms_portfolio")
      .select("id,title,category,client_name,description,thumbnail_url,project_url,tech,featured,display_order")
      .eq("status", "published")
      .order("display_order", { ascending: true });

    return data || [];
  } catch {
    return [];
  }
}
