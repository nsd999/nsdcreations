import { NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import webpush from "web-push";
import { servicesData } from "@/lib/services-data";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  assertSameOrigin,
  requireAdmin,
  requireRecentAdminAuthentication,
  revokeAllAdminSessions,
  rotateAdminPassword,
  writeAuditLog,
} from "@/lib/admin-auth";
import { createRazorpayOrder } from "@/lib/razorpay";
import { consumeRateLimit, rateLimitResponse } from "@/lib/rate-limit";

function money(paise: number) {
  return Math.round(Number(paise || 0));
}

function adminError(error: any) {
  if (error?.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (error?.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (error?.message === "REAUTH_REQUIRED") return NextResponse.json({ error: "Re-authentication required." }, { status: 428 });
  return NextResponse.json({ error: "Admin operation failed." }, { status: 500 });
}

function mergeService(service: any, override: any) {
  if (!override?.config) return { ...service, active: true, featured: false };
  return {
    ...service,
    ...override.config,
    packages: Array.isArray(override.config.packages) ? override.config.packages : service.packages,
    active: override.config.active !== false,
    featured: override.config.featured === true,
  };
}

function indiaMonthWindow() {
  const now = new Date();
  const indiaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const startToday = new Date(indiaDate + "T00:00:00+05:30");
  const startMonth = new Date(indiaDate.slice(0, 8) + "01T00:00:00+05:30");
  return { now, startToday, startMonth };
}

async function countRows(db: any, table: string, field = "id", filters: Array<[string, string, any]> = []) {
  let query = db.from(table).select(field, { count: "exact", head: true });
  for (const [op, column, value] of filters) {
    if (op === "eq") query = query.eq(column, value);
    if (op === "gte") query = query.gte(column, value);
    if (op === "gt") query = query.gt(column, value);
  }
  const result = await query;
  return result.count || 0;
}

async function effectiveServices() {
  const db = getSupabaseAdmin();
  const { data: overrides } = await db.from("admin_service_overrides").select("service_id,config");
  const map = new Map((overrides || []).map((row: any) => [row.service_id, row]));
  return servicesData.map((service) => mergeService(service, map.get(service.id)));
}

async function getSegments(params: Promise<{ path?: string[] }>) {
  const resolved = await params;
  return resolved.path || [];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  try {
    const admin = await requireAdmin(request);
    const segments = await getSegments(params);
    const resource = segments[0] || "dashboard";
    const id = segments[1];
    const db = getSupabaseAdmin();
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.trim() || "";
    const status = url.searchParams.get("status") || "";
    const service = url.searchParams.get("service") || "";
    const from = url.searchParams.get("from") || "";
    const to = url.searchParams.get("to") || "";
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(10, Number(url.searchParams.get("limit") || "50")));
    const fromIndex = (page - 1) * limit;
    const toIndex = fromIndex + limit - 1;

    if (resource === "dashboard") {
      const { startToday, startMonth } = indiaMonthWindow();
      const todayIso = startToday.toISOString();
      const monthIso = startMonth.toISOString();

      const [
        leadsToday,
        bookingsToday,
        pendingPayments,
        successfulPaymentsToday,
        bookingsMonth,
        leadsMonth,
        notificationNewToday,
        subscribersActive,
        reviewNewToday,
        subscribersInactive,
        subscribersNewMonth,
        subscribersActiveNewMonth,
        todayPaymentRows,
        confirmedMonthRows,
        bookingFinancialRows,
        monthPayments,
      ] = await Promise.all([
        countRows(db, "contact_submissions", "id", [["gte", "created_at", todayIso]]),
        countRows(db, "service_bookings", "id", [["gte", "created_at", todayIso]]),
        countRows(db, "service_bookings", "id", [["eq", "payment_status", "PENDING"]]),
        countRows(db, "booking_payments", "id", [["eq", "status", "verified"], ["gte", "created_at", todayIso]]),
        countRows(db, "service_bookings", "id", [["gte", "created_at", monthIso]]),
        countRows(db, "contact_submissions", "id", [["gte", "created_at", monthIso]]),
        countRows(db, "push_subscriptions", "id", [["gte", "created_at", todayIso]]),
        countRows(db, "push_subscriptions", "id", [["eq", "status", "active"]]),
        countRows(db, "testimonials", "id", [["eq", "status", "pending"], ["gte", "created_at", todayIso]]),
        countRows(db, "push_subscriptions", "id", [["eq", "status", "inactive"]]),
        countRows(db, "push_subscriptions", "id", [["gte", "created_at", monthIso]]),
        countRows(db, "push_subscriptions", "id", [["eq", "status", "active"], ["gte", "created_at", monthIso]]),
        db.from("booking_payments").select("amount_paise,status,created_at").gte("created_at", todayIso),
        db.from("service_bookings").select("id,total_amount_paise,advance_amount_paise,balance_amount_paise,booking_status,created_at").gte("created_at", monthIso),
        db.from("service_bookings").select("total_amount_paise,advance_amount_paise,balance_amount_paise,booking_status").in("booking_status", ["CONFIRMED","IN_PROGRESS","ON_HOLD","COMPLETED"]),
        db.from("booking_payments").select("amount_paise,status,created_at").gte("created_at", monthIso),
      ]);

      const financial = bookingFinancialRows.data || [];
      const projectValueMonth = financial.reduce((sum: number, row: any) => sum + money(row.total_amount_paise), 0);
      const balanceOutstanding = financial.reduce((sum: number, row: any) => sum + money(row.balance_amount_paise), 0);

      const todayPaymentRowsData = todayPaymentRows.data || [];
      const advanceRevenueToday = todayPaymentRowsData
        .filter((row: any) => row.status === "verified")
        .reduce((sum: number, row: any) => sum + money(row.amount_paise), 0);

      const monthPaymentRows = monthPayments.data || [];
      const advanceCollectedMonth = monthPaymentRows
        .filter((row: any) => row.status === "verified")
        .reduce((sum: number, row: any) => sum + money(row.amount_paise), 0);
      const failedPayments = monthPaymentRows.filter((row: any) => row.status === "failed").length;
      const refundedPayments = monthPaymentRows.filter((row: any) => row.status === "refunded" || row.status === "partially_refunded").length;
      const confirmedBookingsMonth = (confirmedMonthRows.data || []).filter((row: any) => row.booking_status === "CONFIRMED").length;

      return NextResponse.json({
        today: {
          leads: leadsToday,
          bookings: bookingsToday,
          pendingPayments,
          successfulPayments: successfulPaymentsToday,
          advanceRevenuePaise: advanceRevenueToday,
          outstandingBalancePaise: balanceOutstanding,
          notificationRegistrations: subscribersActive,
          notificationRegistrationsNewToday: notificationNewToday,
          notificationRegistrationsInactive: subscribersInactive,
          notificationRegistrationsNewMonth: subscribersNewMonth,
          notificationRegistrationsActiveNewMonth: subscribersActiveNewMonth,
          newReviews: reviewNewToday,
        },
        month: {
          bookings: bookingsMonth,
          confirmedProjects: confirmedBookingsMonth,
          totalProjectValuePaise: projectValueMonth,
          advanceCollectedPaise: advanceCollectedMonth,
          balanceOutstandingPaise: balanceOutstanding,
          failedPayments,
          refundedPayments,
          leads: leadsMonth,
          conversionRate: leadsMonth > 0 ? Number(((confirmedBookingsMonth / leadsMonth) * 100).toFixed(1)) : null,
        },
        system: {
          supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
          razorpay: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
          webhook: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET),
          push: Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY),
          environment: Boolean(process.env.ADMIN_BOOTSTRAP_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY),
        },
      });
    }

    if (resource === "bookings" && id) {
      const { data, error } = await db.from("service_bookings").select("*").eq("id", id).single();
      if (error || !data) return NextResponse.json({ error: "Booking not found." }, { status: 404 });
      const { data: payments } = await db.from("booking_payments").select("*").eq("booking_id", id).order("created_at", { ascending: false });
      return NextResponse.json({ booking: data, payments: payments || [] });
    }

    if (resource === "bookings") {
      let query = db.from("service_bookings").select("*", { count: "exact" });
      if (q) query = query.or("booking_reference.ilike.%" + q + "%,customer_name.ilike.%" + q + "%,customer_email.ilike.%" + q + "%");
      if (status) query = query.eq("booking_status", status);
      if (service) query = query.eq("service_id", service);
      if (from) query = query.gte("created_at", from);
      if (to) query = query.lte("created_at", to);
      const { data, error, count } = await query.order("created_at", { ascending: false }).range(fromIndex, toIndex);
      if (error) return NextResponse.json({ error: "Unable to load bookings." }, { status: 500 });
      return NextResponse.json({ items: data || [], total: count || 0, page, limit });
    }

    if (resource === "payments") {
      let query = db.from("booking_payments").select("*,service_bookings(booking_reference,customer_name,customer_email,service_name_snapshot,total_amount_paise,advance_amount_paise,balance_amount_paise)", { count: "exact" });
      if (status) query = query.eq("status", status);
      if (q) query = query.or("razorpay_payment_id.ilike.%" + q + "%,razorpay_order_id.ilike.%" + q + "%");
      const { data, error, count } = await query.order("created_at", { ascending: false }).range(fromIndex, toIndex);
      if (error) return NextResponse.json({ error: "Unable to load payments." }, { status: 500 });
      return NextResponse.json({ items: data || [], total: count || 0, page, limit });
    }

    if (resource === "leads") {
      let query = db.from("contact_submissions").select("*", { count: "exact" });
      if (status) query = query.eq("status", status);
      if (service) query = query.eq("service", service);
      if (q) query = query.or("name.ilike.%" + q + "%,email.ilike.%" + q + "%,business_name.ilike.%" + q + "%,message.ilike.%" + q + "%");
      const { data, error, count } = await query.order("created_at", { ascending: false }).range(fromIndex, toIndex);
      if (error) return NextResponse.json({ error: "Unable to load leads." }, { status: 500 });
      return NextResponse.json({ items: data || [], total: count || 0, page, limit });
    }

    if (resource === "notification-subscribers") {
      let query = db.from("push_subscriptions").select("id,endpoint,created_at,last_seen_at,user_agent,status,last_notification_status,last_notification_at,failure_count", { count: "exact" });
      if (status) query = query.eq("status", status);
      const { data, error, count } = await query.order("created_at", { ascending: false }).range(fromIndex, toIndex);
      if (error) return NextResponse.json({ error: "Unable to load notification registrations." }, { status: 500 });
      return NextResponse.json({ items: data || [], total: count || 0, page, limit });
    }

    if (resource === "notifications") {
      const { data, error, count } = await db.from("notification_campaigns").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(fromIndex, toIndex);
      if (error) return NextResponse.json({ error: "Unable to load notification history." }, { status: 500 });
      return NextResponse.json({ items: data || [], total: count || 0, page, limit });
    }

    if (resource === "tips") {
      let query = db.from("cms_tips").select("*", { count: "exact" });
      if (status) query = query.eq("status", status);
      if (q) query = query.or("title.ilike.%" + q + "%,slug.ilike.%" + q + "%,category.ilike.%" + q + "%");
      const { data, error, count } = await query.order("updated_at", { ascending: false }).range(fromIndex, toIndex);
      if (error) return NextResponse.json({ error: "Unable to load tips." }, { status: 500 });
      return NextResponse.json({ items: data || [], total: count || 0, page, limit });
    }

    if (resource === "services" || resource === "pricing") {
      return NextResponse.json({ items: await effectiveServices() });
    }

    if (resource === "testimonials") {
      let query = db.from("testimonials").select("*", { count: "exact" });
      if (status) query = query.eq("status", status);
      if (q) query = query.or("name.ilike.%" + q + "%,business_name.ilike.%" + q + "%,review.ilike.%" + q + "%");
      const { data, error, count } = await query.order("created_at", { ascending: false }).range(fromIndex, toIndex);
      if (error) return NextResponse.json({ error: "Unable to load testimonials." }, { status: 500 });
      return NextResponse.json({ items: data || [], total: count || 0, page, limit });
    }

    if (resource === "portfolio") {
      let query = db.from("cms_portfolio").select("*", { count: "exact" });
      if (status) query = query.eq("status", status);
      if (q) query = query.or("title.ilike.%" + q + "%,category.ilike.%" + q + "%,client_name.ilike.%" + q + "%");
      const { data, error, count } = await query.order("display_order", { ascending: true }).order("created_at", { ascending: false }).range(fromIndex, toIndex);
      if (error) return NextResponse.json({ error: "Unable to load portfolio items." }, { status: 500 });
      return NextResponse.json({ items: data || [], total: count || 0, page, limit });
    }

    if (resource === "site-settings" || resource === "content" || resource === "seo") {
      const { data, error } = await db.from("site_settings").select("*").order("key", { ascending: true });
      if (error) return NextResponse.json({ error: "Unable to load settings." }, { status: 500 });
      return NextResponse.json({ items: data || [] });
    }

    if (resource === "audit-logs" || resource === "logs") {
      let query = db.from("audit_logs").select("*", { count: "exact" });
      if (status) query = query.eq("action", status);
      if (q) query = query.or("action.ilike.%" + q + "%,summary.ilike.%" + q + "%,actor.ilike.%" + q + "%");
      const { data, error, count } = await query.order("created_at", { ascending: false }).range(fromIndex, toIndex);
      if (error) return NextResponse.json({ error: "Unable to load audit logs." }, { status: 500 });
      return NextResponse.json({ items: data || [], total: count || 0, page, limit });
    }

    if (resource === "security") {
      const { data: latest } = await db.from("audit_logs").select("created_at,action,summary").in("action", ["LOGIN_SUCCESS","LOGIN_FAILURE"]).order("created_at", { ascending: false }).limit(20);
      const { count: activeSessions } = await db.from("admin_sessions").select("id", { count: "exact", head: true }).gt("expires_at", new Date().toISOString());
      return NextResponse.json({
        activeSessions: activeSessions || 0,
        lastLogin: latest?.find((item: any) => item.action === "LOGIN_SUCCESS") || null,
        lastFailure: latest?.find((item: any) => item.action === "LOGIN_FAILURE") || null,
        configured: {
          bootstrap: Boolean(process.env.ADMIN_BOOTSTRAP_PASSWORD),
          sessionSecret: Boolean(process.env.ADMIN_SESSION_SECRET),
          razorpay: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
          webhook: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET),
          push: Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY),
        },
      });
    }

    if (resource === "quotes") {
      let query = db.from("service_quotes").select("*", { count: "exact" });
      if (status) query = query.eq("status", status);
      if (q) query = query.or("quote_reference.ilike.%" + q + "%,customer_name.ilike.%" + q + "%,customer_email.ilike.%" + q + "%");
      const { data, error, count } = await query.order("created_at", { ascending: false }).range(fromIndex, toIndex);
      if (error) return NextResponse.json({ error: "Unable to load quotes." }, { status: 500 });
      return NextResponse.json({ items: data || [], total: count || 0, page, limit });
    }

    return NextResponse.json({ error: "Unknown admin resource." }, { status: 404 });
  } catch (error) {
    return adminError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  try {
    const admin = await requireAdmin(request);
    assertSameOrigin(request);
    const segments = await getSegments(params);
    const resource = segments[0] || "";
    const id = segments[1];
    const action = segments[2];
    const body = await request.json().catch(() => ({}));
    const db = getSupabaseAdmin();

    if (resource === "notifications" && action === "send") {
      if (!(await consumeRateLimit(request, "admin-notification-send", 10, 600))) return rateLimitResponse();
      if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
        return NextResponse.json({ error: "Push notifications are not configured." }, { status: 503 });
      }

      webpush.setVapidDetails(
        "mailto:nsd.creations.official@gmail.com",
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY,
      );

      const title = String(body.title || "").trim().slice(0, 120);
      const message = String(body.message || "").trim().slice(0, 3000);
      const url = String(body.url || "/").trim().slice(0, 500);
      const type = String(body.notificationType || "announcement").trim().slice(0, 40);
      const audience = body.audience === "selected" ? "selected" : "all";
      const selectedIds = Array.isArray(body.subscriberIds)
        ? body.subscriberIds.filter((value: any) => typeof value === "string").slice(0, 500)
        : [];
      const scheduledFor = body.scheduledFor ? new Date(body.scheduledFor).toISOString() : null;
      const futureSchedule = scheduledFor && new Date(scheduledFor).getTime() > Date.now();

      if (!title || !message) return NextResponse.json({ error: "Title and message are required." }, { status: 400 });
      if (audience === "selected" && selectedIds.length === 0) {
        return NextResponse.json({ error: "Select at least one subscriber." }, { status: 400 });
      }

      if (futureSchedule) {
        const { data: scheduledCampaign, error: scheduleError } = await db.from("notification_campaigns").insert({
          title,
          body: message,
          url,
          notification_type: type,
          audience,
          recipient_ids: selectedIds,
          recipients_count: 0,
          sent_count: 0,
          failed_count: 0,
          scheduled_for: scheduledFor,
          status: "scheduled",
          created_by: admin.userId,
        }).select("*").single();

        if (scheduleError) return NextResponse.json({ error: "Unable to schedule notification." }, { status: 500 });
        await writeAuditLog(admin, "NOTIFICATION_SCHEDULED", "Push notification campaign scheduled.", request, scheduledCampaign.id);
        return NextResponse.json({ success: true, scheduled: true, campaign: scheduledCampaign });
      }

      let query = db.from("push_subscriptions").select("id,endpoint,p256dh,auth,status,failure_count").eq("status", "active");
      if (audience === "selected") query = query.in("id", selectedIds);
      const { data: subscriptions, error } = await query;
      if (error) return NextResponse.json({ error: "Unable to load subscribers." }, { status: 500 });

      let sent = 0;
      let failed = 0;

      for (const subscriber of subscriptions || []) {
        const pushSubscription = {
          endpoint: subscriber.endpoint,
          keys: { p256dh: subscriber.p256dh, auth: subscriber.auth },
        };

        try {
          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify({
              title,
              body: message,
              icon: "/icon.png",
              url: url.startsWith("/") ? url : "/",
              type,
            }),
          );

          sent += 1;
          await db.from("push_subscriptions").update({
            last_notification_status: "sent",
            last_notification_at: new Date().toISOString(),
            failure_count: 0,
          }).eq("id", subscriber.id);
        } catch (pushError: any) {
          failed += 1;
          const invalid = pushError?.statusCode === 404 || pushError?.statusCode === 410;

          await db.from("push_subscriptions").update({
            status: invalid ? "inactive" : "active",
            last_notification_status: invalid ? "expired" : "failed",
            last_notification_at: new Date().toISOString(),
            failure_count: Number(subscriber.failure_count || 0) + 1,
          }).eq("id", subscriber.id);
        }
      }

      const { data: campaign } = await db.from("notification_campaigns").insert({
        title,
        body: message,
        url,
        notification_type: type,
        audience,
        recipients_count: (subscriptions || []).length,
        sent_count: sent,
        failed_count: failed,
        sent_at: new Date().toISOString(),
        created_by: admin.userId,
      }).select("*").single();

      await writeAuditLog(admin, "NOTIFICATION_SENT", "Push notification campaign sent.", request, campaign?.id || null);
      return NextResponse.json({ success: true, recipients: (subscriptions || []).length, sent, failed, campaign });
    }

    if (resource === "quotes" && id && action === "generate-payment") {
      if (!(await consumeRateLimit(request, "admin-quote-payment", 20, 600))) return rateLimitResponse();
      const recentAdmin = await requireRecentAdminAuthentication(request);
      const { data: quote } = await db
        .from("service_quotes")
        .select("*")
        .eq("id", id)
        .single();

      if (!quote) return NextResponse.json({ error: "Quote not found." }, { status: 404 });
      if (quote.status !== "ACCEPTED") return NextResponse.json({ error: "Quote must be accepted before payment can be generated." }, { status: 409 });
      if (Number(quote.total_paise || 0) <= 0 || Number(quote.advance_amount_paise || 0) <= 0) {
        return NextResponse.json({ error: "Quote does not have a payable advance." }, { status: 422 });
      }

      if (quote.booking_id) {
        const { data: existingBooking } = await db.from("service_bookings").select("id,booking_reference,razorpay_order_id").eq("id", quote.booking_id).maybeSingle();
        if (existingBooking) {
          return NextResponse.json({
            bookingId: existingBooking.id,
            bookingReference: existingBooking.booking_reference,
            paymentUrl: "/quote/" + quote.id + "/pay",
            existing: true,
          });
        }
      }

      const token = randomBytes(32).toString("base64url");
      const tokenHash = createHash("sha256").update(token).digest("hex");
      const accessTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const bookingReference = "NSD-QT-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();

      const { data: booking, error: bookingError } = await db
        .from("service_bookings")
        .insert({
          booking_reference: bookingReference,
          customer_name: quote.customer_name,
          customer_email: quote.customer_email,
          customer_phone: "",
          service_id: quote.service_id,
          service_name_snapshot: quote.service_id,
          package_id: "CUSTOM_QUOTE",
          package_name_snapshot: "Approved Custom Quote",
          selected_options: { quoteId: quote.id, scope: quote.scope, lineItems: quote.line_items || [] },
          pricing_snapshot: {
            version: "quote-1",
            quoteId: quote.id,
            quoteReference: quote.quote_reference,
            subtotalPaise: quote.subtotal_paise,
            discountPaise: quote.discount_paise,
            taxPaise: quote.tax_paise,
            totalPaise: quote.total_paise,
            advancePercentage: quote.advance_percentage,
            advanceAmountPaise: quote.advance_amount_paise,
            balanceAmountPaise: quote.balance_amount_paise,
          },
          total_amount_paise: quote.total_paise,
          advance_percentage: quote.advance_percentage,
          advance_amount_paise: quote.advance_amount_paise,
          balance_amount_paise: quote.balance_amount_paise,
          currency: "INR",
          booking_status: "AWAITING_PAYMENT",
          payment_status: "PENDING",
          access_token_hash: tokenHash,
          access_token_expires_at: accessTokenExpiresAt,
          notes: quote.notes || null,
        })
        .select("id,booking_reference")
        .single();

      if (bookingError || !booking) return NextResponse.json({ error: "Unable to create quote payment booking." }, { status: 500 });

      const order = await createRazorpayOrder({
        amountPaise: Number(quote.advance_amount_paise),
        currency: "INR",
        receipt: booking.booking_reference,
        notes: { booking_id: booking.id, quote_id: quote.id, quote_reference: quote.quote_reference },
      });

      await db.from("service_bookings").update({ razorpay_order_id: order.id, updated_at: new Date().toISOString() }).eq("id", booking.id);
      await db.from("service_quotes").update({ booking_id: booking.id, updated_at: new Date().toISOString() }).eq("id", quote.id);

      await writeAuditLog(recentAdmin, "QUOTE_CONVERTED", "Approved quote converted to an advance payment booking.", request, quote.id);

      return NextResponse.json({
        bookingId: booking.id,
        bookingReference: booking.booking_reference,
        accessToken: token,
        paymentUrl: "/quote/" + quote.id + "/pay?token=" + encodeURIComponent(token),
        keyId: process.env.RAZORPAY_KEY_ID || null,
        order: { id: order.id, amount: order.amount, currency: order.currency },
      });
    }

    if (resource === "manual-payment" && id) {
      if (!(await consumeRateLimit(request, "admin-manual-payment", 20, 600))) return rateLimitResponse();
      const recentAdmin = await requireRecentAdminAuthentication(request);
      const amountPaise = Math.round(Number(body.amountPaise || 0));
      const method = String(body.method || "").trim().slice(0, 50);
      const reference = String(body.reference || "").trim().slice(0, 150);
      const paidAt = body.paidAt ? new Date(body.paidAt).toISOString() : new Date().toISOString();

      if (!amountPaise || amountPaise <= 0 || !method || !reference) {
        return NextResponse.json({ error: "Amount, method and payment reference are required." }, { status: 400 });
      }

      const { data: booking } = await db.from("service_bookings").select("*").eq("id", id).single();
      if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

      const { data: payment, error } = await db.from("booking_payments").insert({
        booking_id: id,
        source: "manual",
        amount_paise: amountPaise,
        currency: "INR",
        status: "verified",
        method,
        reference,
        metadata: { manualEntry: true, confirmedBy: recentAdmin.userId },
        paid_at: paidAt,
      }).select("*").single();

      if (error) return NextResponse.json({ error: "Unable to create manual payment record." }, { status: 500 });

      const cumulative = await db.from("booking_payments").select("amount_paise,status").eq("booking_id", id).in("status", ["verified","refunded","partially_refunded"]);
      const paidTotal = (cumulative.data || []).filter((row: any) => row.status === "verified").reduce((sum: number, row: any) => sum + Number(row.amount_paise || 0), 0);

      if (paidTotal >= Number(booking.advance_amount_paise || 0)) {
        await db.from("service_bookings").update({
          booking_status: "CONFIRMED",
          payment_status: "MANUAL",
          confirmed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }).eq("id", id);
      }

      await writeAuditLog(recentAdmin, "MANUAL_PAYMENT_ADDED", "Manual/offline payment recorded.", request, id);
      return NextResponse.json({ success: true, payment });
    }

    if (resource === "tips") {
      const title = String(body.title || "").trim();
      const slug = String(body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")).slice(0, 120);
      const excerpt = String(body.excerpt || "").trim();
      const category = String(body.category || "Operations").trim();
      const content = Array.isArray(body.content) ? body.content : [];
      if (!title || !slug || !excerpt) return NextResponse.json({ error: "Title, slug and excerpt are required." }, { status: 400 });

      const scheduledFor = body.scheduledFor ? new Date(body.scheduledFor).toISOString() : null;
      const publishImmediately = body.status === "published" && !scheduledFor;
      const { data, error } = await db.from("cms_tips").insert({
        title,
        slug,
        excerpt,
        category,
        content,
        image: body.image ? String(body.image).slice(0, 500) : null,
        author: body.author ? String(body.author).slice(0, 120) : "NSD Creations",
        status: body.status || "draft",
        published_at: publishImmediately ? new Date().toISOString() : null,
        scheduled_for: scheduledFor,
        featured: Boolean(body.featured),
      }).select("*").single();

      if (error) return NextResponse.json({ error: "Unable to create tip." }, { status: 500 });
      await writeAuditLog(admin, "TIP_CREATED", "Tip created.", request, data.id);
      return NextResponse.json({ item: data });
    }

    if (resource === "portfolio") {
      const title = String(body.title || "").trim();
      const category = String(body.category || "video").trim();
      const description = String(body.description || "").trim();
      if (!title || !description) return NextResponse.json({ error: "Title and description are required." }, { status: 400 });

      const { data, error } = await db.from("cms_portfolio").insert({
        title,
        category,
        client_name: body.clientName ? String(body.clientName).slice(0, 160) : null,
        description,
        thumbnail_url: body.thumbnailUrl ? String(body.thumbnailUrl).slice(0, 500) : null,
        project_url: body.projectUrl ? String(body.projectUrl).slice(0, 500) : null,
        tech: Array.isArray(body.tech) ? body.tech.slice(0, 20) : [],
        status: body.status || "draft",
        featured: Boolean(body.featured),
        display_order: Number.isFinite(Number(body.displayOrder)) ? Number(body.displayOrder) : 0,
      }).select("*").single();

      if (error) return NextResponse.json({ error: "Unable to create portfolio item." }, { status: 500 });
      await writeAuditLog(admin, "CONTENT_CHANGED", "Portfolio item created.", request, data.id);
      return NextResponse.json({ item: data });
    }

    if (resource === "quotes") {
      if (!(await consumeRateLimit(request, "admin-quote-create", 20, 600))) return rateLimitResponse();
      const customerName = String(body.customerName || "").trim();
      const customerEmail = String(body.customerEmail || "").trim().toLowerCase();
      const serviceId = String(body.serviceId || "").trim();
      const scope = String(body.scope || "").trim();
      const totalPaise = Math.max(0, Number(body.totalPaise || 0));
      const advancePercentage = Math.min(100, Math.max(0, Number(body.advancePercentage ?? 50)));
      const discountPaise = Math.max(0, Number(body.discountPaise || 0));
      const taxPaise = Math.max(0, Number(body.taxPaise || 0));
      const subtotalPaise = Math.max(0, Number(body.subtotalPaise || totalPaise + discountPaise - taxPaise));
      const advanceAmountPaise = Math.round(totalPaise * advancePercentage / 100);
      const balanceAmountPaise = totalPaise - advanceAmountPaise;

      if (!customerName || !customerEmail || !serviceId || !scope) {
        return NextResponse.json({ error: "Customer, service and scope are required." }, { status: 400 });
      }

      const reference = "QT-" + new Date().toISOString().slice(0,10).replace(/-/g,"") + "-" + Math.random().toString(36).slice(2,8).toUpperCase();
      const { data, error } = await db.from("service_quotes").insert({
        quote_reference: reference,
        customer_name: customerName,
        customer_email: customerEmail,
        service_id: serviceId,
        scope,
        line_items: Array.isArray(body.lineItems) ? body.lineItems : [],
        subtotal_paise: subtotalPaise,
        discount_paise: discountPaise,
        tax_paise: taxPaise,
        total_paise: totalPaise,
        advance_percentage: advancePercentage,
        advance_amount_paise: advanceAmountPaise,
        balance_amount_paise: balanceAmountPaise,
        validity_date: body.validityDate || null,
        notes: body.notes || null,
      }).select("*").single();

      if (error) return NextResponse.json({ error: "Unable to create quote." }, { status: 500 });
      await writeAuditLog(admin, "QUOTE_CREATED", "Quote created.", request, data.id);
      return NextResponse.json({ item: data });
    }

    return NextResponse.json({ error: "Unsupported admin action." }, { status: 404 });
  } catch (error) {
    return adminError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  try {
    const admin = await requireAdmin(request);
    assertSameOrigin(request);
    const segments = await getSegments(params);
    const resource = segments[0] || "";
    const id = segments[1];
    const db = getSupabaseAdmin();
    const body = await request.json().catch(() => ({}));

    if (resource === "bookings" && id) {
      const allowed = ["AWAITING_PAYMENT","CONFIRMED","IN_PROGRESS","ON_HOLD","COMPLETED","CANCELLED","PAYMENT_FAILED","REFUNDED","EXPIRED"];
      const status = String(body.bookingStatus || "");
      if (!allowed.includes(status)) return NextResponse.json({ error: "Invalid booking status." }, { status: 400 });

      const { data, error } = await db.from("service_bookings").update({
        booking_status: status,
        notes: typeof body.notes === "string" ? body.notes.slice(0, 5000) : undefined,
        updated_at: new Date().toISOString(),
      }).eq("id", id).select("*").single();

      if (error) return NextResponse.json({ error: "Unable to update booking." }, { status: 500 });
      await writeAuditLog(admin, "BOOKING_STATUS_CHANGED", "Operational booking status changed.", request, id);
      return NextResponse.json({ item: data });
    }

    if (resource === "leads" && id) {
      const allowed = ["unread","contacted","qualified","proposal_sent","won","lost","archived","read"];
      const status = String(body.status || "");
      if (!allowed.includes(status)) return NextResponse.json({ error: "Invalid lead status." }, { status: 400 });

      const update: Record<string, any> = {
        status,
        notes: typeof body.notes === "string" ? body.notes.slice(0, 5000) : undefined,
        updated_at: new Date().toISOString(),
      };
      if (status === "qualified") update.qualified_at = new Date().toISOString();

      const { data, error } = await db.from("contact_submissions").update(update).eq("id", id).select("*").single();
      if (error) return NextResponse.json({ error: "Unable to update lead." }, { status: 500 });
      await writeAuditLog(admin, "LEAD_STATUS_CHANGED", "Lead status changed.", request, id);
      return NextResponse.json({ item: data });
    }

    if (resource === "notification-subscribers" && id) {
      const status = body.status === "inactive" ? "inactive" : "active";
      const { data, error } = await db.from("push_subscriptions").update({
        status,
        last_seen_at: new Date().toISOString(),
      }).eq("id", id).select("id,status,last_seen_at").single();
      if (error) return NextResponse.json({ error: "Unable to update registration." }, { status: 500 });
      await writeAuditLog(admin, "SUBSCRIBER_STATUS_CHANGED", "Notification subscriber status changed.", request, id);
      return NextResponse.json({ item: data });
    }

    if (resource === "tips" && id) {
      const allowed = ["draft","published","archived"];
      const update: Record<string, any> = {};
      if (body.title !== undefined) update.title = String(body.title).slice(0, 180);
      if (body.slug !== undefined) update.slug = String(body.slug).slice(0, 120);
      if (body.category !== undefined) update.category = String(body.category).slice(0, 80);
      if (body.excerpt !== undefined) update.excerpt = String(body.excerpt).slice(0, 1000);
      if (body.content !== undefined) update.content = Array.isArray(body.content) ? body.content : [];
      if (body.image !== undefined) update.image = body.image ? String(body.image).slice(0, 500) : null;
      if (body.author !== undefined) update.author = String(body.author).slice(0, 120);
      if (body.status !== undefined && allowed.includes(body.status)) {
        update.status = body.status;
        update.published_at = body.status === "published" && !body.scheduledFor ? new Date().toISOString() : null;
      }
      if (body.scheduledFor !== undefined) {
        update.scheduled_for = body.scheduledFor ? new Date(body.scheduledFor).toISOString() : null;
        if (body.scheduledFor && new Date(body.scheduledFor).getTime() > Date.now()) {
          update.status = "draft";
          update.published_at = null;
        }
      }
      if (body.featured !== undefined) update.featured = Boolean(body.featured);
      update.updated_at = new Date().toISOString();

      const { data, error } = await db.from("cms_tips").update(update).eq("id", id).select("*").single();
      if (error) return NextResponse.json({ error: "Unable to update tip." }, { status: 500 });
      await writeAuditLog(admin, body.status === "published" ? "TIP_PUBLISHED" : "CONTENT_CHANGED", "Tip updated.", request, id);
      return NextResponse.json({ item: data });
    }

    if (resource === "services" && id) {
      const current = servicesData.find((item) => item.id === id);
      if (!current) return NextResponse.json({ error: "Service not found." }, { status: 404 });

      const existing = await db.from("admin_service_overrides").select("config").eq("service_id", id).maybeSingle();
      const nextConfig = {
        ...(existing.data?.config || {}),
        ...(typeof body.config === "object" && body.config ? body.config : {}),
      };

      if (Array.isArray(nextConfig.packages)) {
        nextConfig.packages = nextConfig.packages.map((pkg: any) => ({
          name: String(pkg.name || "").slice(0, 120),
          price: String(pkg.price || "").slice(0, 80),
          features: Array.isArray(pkg.features) ? pkg.features.slice(0, 50) : [],
          idealFor: pkg.idealFor ? String(pkg.idealFor).slice(0, 180) : undefined,
          isPopular: Boolean(pkg.isPopular),
        }));
      }

      const { data, error } = await db.from("admin_service_overrides").upsert({
        service_id: id,
        config: nextConfig,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      }, { onConflict: "service_id" }).select("*").single();

      if (error) return NextResponse.json({ error: "Unable to save service configuration." }, { status: 500 });
      await writeAuditLog(admin, "PRICE_CHANGED", "Service/pricing configuration changed.", request, id);
      return NextResponse.json({ item: mergeService(current, data) });
    }

    if (resource === "testimonials" && id) {
      const allowed = ["pending","approved","rejected","archived"];
      const update: Record<string, any> = {};
      if (body.status && allowed.includes(body.status)) update.status = body.status;
      if (body.featured !== undefined) update.featured = Boolean(body.featured);
      if (body.review !== undefined) update.review = String(body.review).slice(0, 4000);
      if (!Object.keys(update).length) return NextResponse.json({ error: "No supported changes." }, { status: 400 });

      const { data, error } = await db.from("testimonials").update(update).eq("id", id).select("*").single();
      if (error) return NextResponse.json({ error: "Unable to update testimonial." }, { status: 500 });
      await writeAuditLog(admin, "TESTIMONIAL_APPROVED", "Testimonial updated.", request, id);
      return NextResponse.json({ item: data });
    }

    if (resource === "portfolio" && id) {
      const update: Record<string, any> = {};
      for (const [key, dbKey] of [
        ["title","title"],["category","category"],["clientName","client_name"],["description","description"],
        ["thumbnailUrl","thumbnail_url"],["projectUrl","project_url"],["status","status"],
      ]) {
        if (body[key] !== undefined) update[dbKey] = body[key] === null ? null : String(body[key]);
      }
      if (body.tech !== undefined) update.tech = Array.isArray(body.tech) ? body.tech.slice(0, 20) : [];
      if (body.featured !== undefined) update.featured = Boolean(body.featured);
      if (body.displayOrder !== undefined) update.display_order = Number(body.displayOrder) || 0;
      update.updated_at = new Date().toISOString();

      const { data, error } = await db.from("cms_portfolio").update(update).eq("id", id).select("*").single();
      if (error) return NextResponse.json({ error: "Unable to update portfolio item." }, { status: 500 });
      await writeAuditLog(admin, "CONTENT_CHANGED", "Portfolio item updated.", request, id);
      return NextResponse.json({ item: data });
    }

    if ((resource === "site-settings" || resource === "content" || resource === "seo") && id) {
      const value = body.value;
      const { data, error } = await db.from("site_settings").upsert({
        key: id,
        value,
        updated_by: admin.userId,
        updated_at: new Date().toISOString(),
      }, { onConflict: "key" }).select("*").single();

      if (error) return NextResponse.json({ error: "Unable to update site setting." }, { status: 500 });
      await writeAuditLog(admin, "CONTENT_CHANGED", "Site setting changed.", request, id);
      return NextResponse.json({ item: data });
    }

    if (resource === "quotes" && id) {
      const recentAdmin = await requireRecentAdminAuthentication(request);
      const nextStatus = String(body.status || "");
      const allowed = ["DRAFT","SENT","VIEWED","ACCEPTED","REJECTED","EXPIRED","CONVERTED"];
      if (!allowed.includes(nextStatus)) return NextResponse.json({ error: "Invalid quote status." }, { status: 400 });

      const { data: quote, error } = await db.from("service_quotes").update({
        status: nextStatus,
        accepted_at: nextStatus === "ACCEPTED" ? new Date().toISOString() : undefined,
        updated_at: new Date().toISOString(),
      }).eq("id", id).select("*").single();

      if (error) return NextResponse.json({ error: "Unable to update quote." }, { status: 500 });
      await writeAuditLog(recentAdmin, nextStatus === "ACCEPTED" ? "QUOTE_APPROVED" : "CONTENT_CHANGED", "Quote status updated.", request, id);
      return NextResponse.json({ item: quote });
    }

    if (resource === "security" && id === "rotate-password") {
      await rotateAdminPassword(request, String(body.newPassword || ""));
      return NextResponse.json({ success: true });
    }

    if (resource === "security" && id === "logout-all") {
      await requireRecentAdminAuthentication(request);
      await revokeAllAdminSessions();
      await writeAuditLog(admin, "LOGOUT", "All administrator sessions revoked.", request);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unsupported admin update." }, { status: 404 });
  } catch (error) {
    return adminError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  try {
    const admin = await requireRecentAdminAuthentication(request);
    assertSameOrigin(request);
    const segments = await getSegments(params);
    const resource = segments[0] || "";
    const id = segments[1];
    const db = getSupabaseAdmin();

    if (!id) return NextResponse.json({ error: "Missing identifier." }, { status: 400 });

    if (resource === "notification-subscribers") {
      const { error } = await db.from("push_subscriptions").delete().eq("id", id);
      if (error) return NextResponse.json({ error: "Unable to remove registration." }, { status: 500 });
      await writeAuditLog(admin, "SUBSCRIBER_REMOVED", "Notification registration removed.", request, id);
      return NextResponse.json({ success: true });
    }

    if (resource === "tips") {
      const { error } = await db.from("cms_tips").update({ status: "archived", updated_at: new Date().toISOString() }).eq("id", id);
      if (error) return NextResponse.json({ error: "Unable to archive tip." }, { status: 500 });
      await writeAuditLog(admin, "CONTENT_CHANGED", "Tip archived.", request, id);
      return NextResponse.json({ success: true });
    }

    if (resource === "portfolio") {
      const { error } = await db.from("cms_portfolio").update({ status: "archived", updated_at: new Date().toISOString() }).eq("id", id);
      if (error) return NextResponse.json({ error: "Unable to archive portfolio item." }, { status: 500 });
      await writeAuditLog(admin, "CONTENT_CHANGED", "Portfolio item archived.", request, id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unsupported admin delete." }, { status: 404 });
  } catch (error) {
    return adminError(error);
  }
}
