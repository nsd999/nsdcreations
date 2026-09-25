import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifyRazorpayWebhook } from "@/lib/razorpay";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";
  const eventId = request.headers.get("x-razorpay-event-id") || "";

  if (!verifyRazorpayWebhook(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  const resolvedEventId =
    eventId ||
    payload?.payload?.payment?.entity?.id ||
    "webhook-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);

  const db = getSupabaseAdmin();

  const { error: insertError } = await db.from("payment_events").insert({
    event_id: resolvedEventId,
    event_type: payload.event || "unknown",
    payload,
    processed_at: null,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({ received: true, duplicate: true });
    }

    return NextResponse.json({ error: "Webhook persistence failed." }, { status: 500 });
  }

  try {
    const eventType = payload.event as string;
    const paymentEntity = payload?.payload?.payment?.entity;
    const refundEntity = payload?.payload?.refund?.entity;

    if (paymentEntity?.order_id) {
      const { data: booking } = await db
        .from("service_bookings")
        .select("id,advance_amount_paise")
        .eq("razorpay_order_id", paymentEntity.order_id)
        .maybeSingle();

      if (booking) {
        if (eventType === "payment.captured" || eventType === "order.paid") {
          if (
            Number(paymentEntity.amount) === Number(booking.advance_amount_paise) &&
            paymentEntity.currency === "INR"
          ) {
            await db.from("booking_payments").upsert(
              {
                booking_id: booking.id,
                source: "razorpay",
                razorpay_order_id: paymentEntity.order_id,
                razorpay_payment_id: paymentEntity.id,
                amount_paise: paymentEntity.amount,
                currency: paymentEntity.currency,
                status: "verified",
                method: paymentEntity.method || null,
                fee_paise: paymentEntity.fee ?? null,
                tax_paise: paymentEntity.tax ?? null,
                metadata: { webhookEvent: eventType },
                paid_at: new Date().toISOString(),
              },
              { onConflict: "razorpay_payment_id" },
            );

            await db
              .from("service_bookings")
              .update({
                booking_status: "CONFIRMED",
                payment_status: "CAPTURED",
                razorpay_payment_id: paymentEntity.id,
                paid_at: new Date().toISOString(),
                confirmed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq("id", booking.id);
          }
        } else if (eventType === "payment.failed") {
          await db
            .from("service_bookings")
            .update({
              booking_status: "PAYMENT_FAILED",
              payment_status: "FAILED",
              updated_at: new Date().toISOString(),
            })
            .eq("id", booking.id)
            .neq("payment_status", "CAPTURED");
        }
      }
    }

    if (refundEntity?.payment_id) {
      const { data: payment } = await db
        .from("booking_payments")
        .select("id,booking_id")
        .eq("razorpay_payment_id", refundEntity.payment_id)
        .maybeSingle();

      if (payment) {
        await db
          .from("booking_payments")
          .update({
            status: "refunded",
            metadata: { refundEvent: eventType, refundId: refundEntity.id || null },
          })
          .eq("id", payment.id);

        await db
          .from("service_bookings")
          .update({
            booking_status: "REFUNDED",
            payment_status: "REFUNDED",
            updated_at: new Date().toISOString(),
          })
          .eq("id", payment.booking_id);
      }
    }

    await db
      .from("payment_events")
      .update({ processed_at: new Date().toISOString() })
      .eq("event_id", resolvedEventId);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook reconciliation error:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
