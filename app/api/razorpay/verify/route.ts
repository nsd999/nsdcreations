import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  fetchRazorpayOrder,
  fetchRazorpayPayment,
  verifyRazorpaySignature,
} from "@/lib/razorpay";

function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const bookingId = typeof body.bookingId === "string" ? body.bookingId : "";
    const accessToken = typeof body.accessToken === "string" ? body.accessToken : "";
    const orderId = typeof body.razorpay_order_id === "string" ? body.razorpay_order_id : "";
    const paymentId = typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id : "";
    const signature = typeof body.razorpay_signature === "string" ? body.razorpay_signature : "";

    if (!bookingId || !accessToken || !orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Invalid payment verification request." }, { status: 400 });
    }

    const db = getSupabaseAdmin();
    const { data: booking, error } = await db
      .from("service_bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("access_token_hash", hashToken(accessToken))
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    if (booking.razorpay_order_id !== orderId) {
      return NextResponse.json({ error: "Payment order mismatch." }, { status: 409 });
    }

    if (booking.payment_status === "CAPTURED" && booking.razorpay_payment_id === paymentId) {
      return NextResponse.json({ success: true, alreadyProcessed: true });
    }

    if (!verifyRazorpaySignature(orderId, paymentId, signature)) {
      await db
        .from("service_bookings")
        .update({
          booking_status: "PAYMENT_FAILED",
          payment_status: "FAILED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", booking.id)
        .neq("payment_status", "CAPTURED");

      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    const order = await fetchRazorpayOrder(orderId);
    const payment = await fetchRazorpayPayment(paymentId);

    if (order.currency !== "INR" || payment.currency !== "INR") {
      return NextResponse.json({ error: "Payment currency mismatch." }, { status: 409 });
    }

    if (
      Number(order.amount) !== Number(booking.advance_amount_paise) ||
      Number(payment.amount) !== Number(booking.advance_amount_paise)
    ) {
      return NextResponse.json({ error: "Payment amount mismatch." }, { status: 409 });
    }

    if (payment.order_id !== orderId || payment.status !== "captured") {
      return NextResponse.json({ error: "Payment is not captured." }, { status: 409 });
    }

    const { data: existingPayment } = await db
      .from("booking_payments")
      .select("id,booking_id,amount_paise,status")
      .eq("razorpay_payment_id", paymentId)
      .maybeSingle();

    if (existingPayment?.booking_id && existingPayment.booking_id !== booking.id) {
      return NextResponse.json(
        { error: "Payment is already linked to another booking." },
        { status: 409 },
      );
    }

    if (!existingPayment) {
      const { error: paymentError } = await db.from("booking_payments").insert({
        booking_id: booking.id,
        source: "razorpay",
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        amount_paise: payment.amount,
        currency: payment.currency,
        status: "verified",
        method: payment.method || null,
        fee_paise: payment.fee ?? null,
        tax_paise: payment.tax ?? null,
        metadata: { signatureVerified: true },
        paid_at: new Date().toISOString(),
      });

      if (paymentError) throw paymentError;
    }

    await db
      .from("service_bookings")
      .update({
        booking_status: "CONFIRMED",
        payment_status: "CAPTURED",
        razorpay_payment_id: paymentId,
        paid_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking.id)
      .neq("payment_status", "CAPTURED");

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      bookingReference: booking.booking_reference,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error?.message || "unknown");
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}
