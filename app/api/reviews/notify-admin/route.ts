import { NextResponse } from "next/server";
import { consumeRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendAdminPushNotification } from "@/lib/admin-notifications";

export async function POST(request: Request) {
  try {
    if (!(await consumeRateLimit(request, "review-admin-notify", 5, 600))) {
      return rateLimitResponse();
    }

    const body = await request.json().catch(() => ({}));
    const reviewId = typeof body?.reviewId === "string" ? body.reviewId : "";

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required." }, { status: 400 });
    }

    const db = getSupabaseAdmin();
    const { data: review, error } = await db
      .from("testimonials")
      .select("id,name,business_name,rating,created_at,status")
      .eq("id", reviewId)
      .single();

    if (error || !review) {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }

    await sendAdminPushNotification({
      title: "New review received",
      body:
        (review.name || "Customer") +
        " submitted a " +
        String(review.rating || 0) +
        "/5 review" +
        (review.business_name ? " • " + review.business_name : "") +
        ".",
      url: "/nsdtheadmin/testimonials",
      type: "new_review",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to notify administrators." }, { status: 500 });
  }
}
