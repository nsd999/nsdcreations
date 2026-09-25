import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ quoteId: string }> },
) {
  const { quoteId } = await params;
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getSupabaseAdmin();
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const { data: quote, error } = await db
    .from("service_quotes")
    .select("id,quote_reference,customer_name,customer_email,service_id,scope,line_items,subtotal_paise,discount_paise,tax_paise,total_paise,advance_percentage,advance_amount_paise,balance_amount_paise,currency,validity_date,notes,status,booking_id")
    .eq("id", quoteId)
    .eq("access_token_hash", tokenHash)
    .single();

  if (error || !quote) return NextResponse.json({ error: "Quote not found." }, { status: 404 });

  let payment = null;
  if (quote.booking_id) {
    const { data: booking } = await db
      .from("service_bookings")
      .select("razorpay_order_id,advance_amount_paise")
      .eq("id", quote.booking_id)
      .maybeSingle();

    if (booking?.razorpay_order_id) {
      payment = {
        orderId: booking.razorpay_order_id,
        amountPaise: Number(booking.advance_amount_paise || quote.advance_amount_paise),
        keyId: process.env.RAZORPAY_KEY_ID || null,
      };
    }
  }

  return NextResponse.json({ quote, payment });
}
