import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  const { bookingId } = await params;
  const token = new URL(request.url).searchParams.get("token") || "";

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getSupabaseAdmin();
  const { data: booking, error } = await db
    .from("service_bookings")
    .select("*")
    .eq("id", bookingId)
    .eq("access_token_hash", hashToken(token))
    .gt("access_token_expires_at", new Date().toISOString())
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  const { data: payments } = await db
    .from("booking_payments")
    .select("id,source,razorpay_order_id,razorpay_payment_id,amount_paise,currency,status,method,created_at,paid_at")
    .eq("booking_id", booking.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    booking: {
      id: booking.id,
      bookingReference: booking.booking_reference,
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_phone,
      businessName: booking.business_name,
      serviceName: booking.service_name_snapshot,
      packageName: booking.package_name_snapshot,
      selectedOptions: booking.selected_options,
      pricingSnapshot: booking.pricing_snapshot,
      projectTotalPaise: booking.total_amount_paise,
      advancePercentage: booking.advance_percentage,
      advanceAmountPaise: booking.advance_amount_paise,
      balanceAmountPaise: booking.balance_amount_paise,
      currency: booking.currency,
      bookingStatus: booking.booking_status,
      paymentStatus: booking.payment_status,
      razorpayOrderId: booking.razorpay_order_id,
      razorpayPaymentId: booking.razorpay_payment_id,
      createdAt: booking.created_at,
      confirmedAt: booking.confirmed_at,
      paidAt: booking.paid_at,
      notes: booking.notes,
    },
    payments: payments || [],
  });
}
