import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@supabase/supabase-js";

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
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return [];
    // This public client can only read published/completed rows through the RLS policy.
    const db = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });
    const { data } = await db
      .from("cms_portfolio")
      .select("id,slug,title,category,client_name,description,thumbnail_url,cover_image_url,additional_images,project_url,live_url,tech,featured,display_order,created_at,updated_at,completed_at")
      .in("status", ["published", "completed"])
      .order("display_order", { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}
