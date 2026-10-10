import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Only explicitly public-facing keys may leave the server. Never expose every
// row in site_settings because the admin uses the same table for settings.
const PUBLIC_SETTING_KEYS = [
  "whatsapp_url",
  "contact_email",
  "contact_phone",
  "instagram_url",
  "youtube_url",
  "linkedin_url",
  "facebook_url",
  "footer_headline",
  "footer_description",
  "home_badge",
  "home_title_line1",
  "home_title_highlight",
  "home_subtitle",
  "pricing_footer_text",
] as const;

export async function GET() {
  try {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("site_settings")
      .select("key,value")
      .in("key", [...PUBLIC_SETTING_KEYS]);

    if (error) {
      console.error("[public/site-settings] read failed:", { message: error.message, code: error.code });
      return NextResponse.json(
        { settings: {} },
        { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } },
      );
    }

    const settings: Record<string, string> = {};
    for (const item of data || []) {
      if (PUBLIC_SETTING_KEYS.includes(item.key as (typeof PUBLIC_SETTING_KEYS)[number]) &&
          typeof item.value === "string") {
        settings[item.key] = item.value.slice(0, 2000);
      }
    }

    return NextResponse.json(
      { settings },
      { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } },
    );
  } catch (error) {
    console.error("[public/site-settings] unavailable:", error);
    return NextResponse.json(
      { settings: {} },
      { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } },
    );
  }
}
