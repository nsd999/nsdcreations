import "server-only";

import { createHmac } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function hashKey(value: string) {
  const secret = getSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(value).digest("hex");
}

function getIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function consumeRateLimit(
  request: Request,
  bucket: string,
  limit: number,
  windowSeconds: number,
) {
  const key = hashKey(bucket + ":" + getIp(request));
  if (!key) return true;

  const db = getSupabaseAdmin();
  const { data, error } = await db.rpc("consume_rate_limit", {
    p_key_hash: key,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    console.error("Rate-limit check failed:", error.message);
    return true;
  }

  return data === true;
}

export function rateLimitResponse() {
  return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
    status: 429,
    headers: { "Content-Type": "application/json", "Retry-After": "60" },
  });
}
