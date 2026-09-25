import { NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { calculateBookingPricing } from "@/lib/pricing-engine";
import { consumeRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { createRazorpayOrder, fetchRazorpayOrder, getRazorpayPublicKey } from "@/lib/razorpay";

function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function reference() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return "NSD-" + date + "-" + randomBytes(4).toString("hex").toUpperCase();
}

function clean(value: unknown, max = 1000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    if (!(await consumeRateLimit(request, 'razorpay-create-order', 8, 600))) return rateLimitResponse();
    const body = await request.json();
    const serviceId = clean(body.serviceId, 120);
    const packageId = clean(body.packageId, 160);
    const customer = body.customer && typeof body.customer === "object" ? body.customer : {};
    const selectedOptions =
      body.selectedOptions && typeof body.selectedOptions === "object"
        ? body.selectedOptions
        : {};

    const customerName = clean(customer.name, 100);
    const customerEmail = clean(customer.email, 200).toLowerCase();
    const customerPhone = clean(customer.phone, 30);
    const businessName = clean(customer.businessName, 150) || null;
    const requirement = clean(customer.requirement, 2000);
    const preferredDeliveryDate = clean(customer.preferredDeliveryDate, 30) || null;
    const notes = clean(customer.notes, 2000) || null;

    if (!serviceId || !packageId || !customerName || !customerEmail || !customerPhone || !requirement) {
      return NextResponse.json({ error: "Please complete all required booking details." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const pricing = await calculateBookingPricing(serviceId, packageId, selectedOptions);
    const db = getSupabaseAdmin();

    let booking: any = null;
    let accessToken: string | null = null;
    let accessTokenExpiresAt: string | null = null;
    const requestedBookingId = clean(body.bookingId, 80);

    if (requestedBookingId) {
      const { data } = await db
        .from("service_bookings")
        .select("*")
        .eq("id", requestedBookingId)
        .eq("customer_email", customerEmail)
        .eq("service_id", pricing.serviceId)
        .eq("package_id", pricing.packageId)
        .maybeSingle();

      if (data && data.booking_status !== "CONFIRMED" && data.payment_status !== "CAPTURED") {
        booking = data;
      }
    }

    if (!booking) {
      accessToken = randomBytes(32).toString("base64url");
      accessTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await db
        .from("service_bookings")
        .insert({
          booking_reference: reference(),
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          business_name: businessName,
          service_id: pricing.serviceId,
          service_name_snapshot: pricing.serviceName,
          package_id: pricing.packageId,
          package_name_snapshot: pricing.packageName,
          selected_options: {
            ...selectedOptions,
            requirement,
            preferredDeliveryDate,
          },
          pricing_snapshot: pricing.snapshot,
          total_amount_paise: pricing.projectTotalPaise,
          advance_percentage: pricing.advancePercentage,
          advance_amount_paise: pricing.advanceAmountPaise,
          balance_amount_paise: pricing.balanceAmountPaise,
          currency: pricing.currency,
          booking_status: "AWAITING_PAYMENT",
          payment_status: "PENDING",
          access_token_hash: hashToken(accessToken),
          access_token_expires_at: accessTokenExpiresAt,
          notes,
        })
        .select("*")
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Unable to create booking." }, { status: 500 });
      }

      booking = data;
    }

    if (booking.booking_status === "CONFIRMED" || booking.payment_status === "CAPTURED") {
      return NextResponse.json({ error: "This booking is already confirmed." }, { status: 409 });
    }

    let order: any = null;

    if (booking.razorpay_order_id) {
      try {
        const existing = await fetchRazorpayOrder(booking.razorpay_order_id);
        if (
          existing.status === "created" &&
          existing.currency === "INR" &&
          Number(existing.amount) === Number(pricing.advanceAmountPaise)
        ) {
          order = existing;
        }
      } catch {}
    }

    if (!order) {
      order = await createRazorpayOrder({
        amountPaise: pricing.advanceAmountPaise,
        currency: "INR",
        receipt: booking.booking_reference,
        notes: {
          booking_id: booking.id,
          booking_reference: booking.booking_reference,
          service_id: pricing.serviceId,
        },
      });

      await db
        .from("service_bookings")
        .update({
          razorpay_order_id: order.id,
          updated_at: new Date().toISOString(),
          booking_status: "AWAITING_PAYMENT",
          payment_status: "PENDING",
        })
        .eq("id", booking.id);
    }

    return NextResponse.json({
      bookingId: booking.id,
      bookingReference: booking.booking_reference,
      accessToken,
      keyId: getRazorpayPublicKey(),
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      pricing: {
        projectTotalPaise: pricing.projectTotalPaise,
        advanceAmountPaise: pricing.advanceAmountPaise,
        balanceAmountPaise: pricing.balanceAmountPaise,
        advancePercentage: pricing.advancePercentage,
      },
    });
  } catch (error: any) {
    if (error?.message === "CUSTOM_QUOTE_REQUIRED") {
      return NextResponse.json(
        { error: "This package requires a confirmed quotation before payment." },
        { status: 422 },
      );
    }

    if (error?.message === "RAZORPAY_NOT_CONFIGURED") {
      return NextResponse.json(
        { error: "Payments are not configured yet. Please request a custom quote." },
        { status: 503 },
      );
    }

    console.error("Create order error:", error?.message || "unknown");
    return NextResponse.json({ error: "Unable to start secure payment." }, { status: 500 });
  }
}
