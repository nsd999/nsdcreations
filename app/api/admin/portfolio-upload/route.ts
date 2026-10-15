import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { assertSameOrigin, requireRecentAdminAuthentication } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  try {
    await requireRecentAdminAuthentication(request);
    assertSameOrigin(request);
    const bucket = process.env.NSD_PORTFOLIO_STORAGE_BUCKET;
    if (!bucket) {
      return NextResponse.json(
        { error: "Portfolio storage is not configured. Set NSD_PORTFOLIO_STORAGE_BUCKET to the existing public portfolio-image bucket." },
        { status: 503 },
      );
    }

    const form = await request.formData();
    const value = form.get("file");
    if (!(value instanceof File)) return NextResponse.json({ error: "Choose an image file to upload." }, { status: 400 });
    const extension = EXTENSIONS[value.type];
    if (!extension) return NextResponse.json({ error: "Use a JPG, PNG or WebP image." }, { status: 415 });
    if (value.size <= 0 || value.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image must be between 1 byte and 8 MB." }, { status: 413 });
    }

    const key = "portfolio/" + randomUUID() + "." + extension;
    const db = getSupabaseAdmin();
    const { error } = await db.storage.from(bucket).upload(key, value, {
      contentType: value.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) {
      console.error("[admin/portfolio-upload] upload failed", { message: error.message });
      return NextResponse.json({ error: "Image upload failed. Check the configured storage bucket and its server-side permissions." }, { status: 500 });
    }

    const { data } = db.storage.from(bucket).getPublicUrl(key);
    return NextResponse.json({ url: data.publicUrl, path: key }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error?.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (error?.message === "REAUTH_REQUIRED") return NextResponse.json({ error: "Re-authentication required." }, { status: 428 });
    console.error("[admin/portfolio-upload] request failed", { message: error?.message || String(error) });
    return NextResponse.json({ error: "Unable to upload image." }, { status: 500 });
  }
}
