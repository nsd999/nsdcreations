import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    vercelCommit: process.env.VERCEL_GIT_COMMIT_SHA || null,
    checks: {
      supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      supabaseSecretKey: Boolean(process.env.SUPABASE_SECRET_KEY),
      supabaseServiceRoleFallback: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      razorpayKeyId: Boolean(process.env.RAZORPAY_KEY_ID),
      razorpayKeySecret: Boolean(process.env.RAZORPAY_KEY_SECRET),
      razorpayWebhookSecret: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET),
    },
  });
}
