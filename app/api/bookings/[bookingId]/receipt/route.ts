import { createHash } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function esc(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function money(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(paise || 0) / 100);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  const { bookingId } = await params;
  const token = new URL(request.url).searchParams.get("token") || "";

  if (!token) return new Response("Unauthorized", { status: 401 });

  const db = getSupabaseAdmin();
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const { data: booking, error } = await db
    .from("service_bookings")
    .select("*")
    .eq("id", bookingId)
    .eq("access_token_hash", tokenHash)
    .gt("access_token_expires_at", new Date().toISOString())
    .single();

  if (error || !booking) return new Response("Booking not found", { status: 404 });
  if (booking.payment_status !== "CAPTURED" && booking.payment_status !== "MANUAL") {
    return new Response("Verified payment receipt is not available for this booking.", { status: 409 });
  }

  const { data: payments } = await db
    .from("booking_payments")
    .select("razorpay_payment_id,source,amount_paise,currency,status,method,reference,paid_at,created_at")
    .eq("booking_id", booking.id)
    .in("status", ["verified", "refunded", "partially_refunded"])
    .order("created_at", { ascending: false });

  const paid = (payments || []).filter((payment: any) => payment.status === "verified");
  const totalPaidPaise = paid.reduce((sum: number, payment: any) => sum + Number(payment.amount_paise || 0), 0);

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>NSD Creations Payment Receipt ${esc(booking.booking_reference)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{font-family:Inter,Arial,sans-serif;background:#f4f4f5;color:#18181b;margin:0;padding:32px}
.receipt{max-width:760px;margin:0 auto;background:#fff;border:1px solid #e4e4e7;border-radius:20px;padding:36px;box-shadow:0 16px 40px rgba(0,0,0,.08)}
h1{margin:0 0 6px;font-size:28px}.muted{color:#71717a}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:24px}.item{border:1px solid #e4e4e7;border-radius:12px;padding:12px}.label{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#71717a}.value{margin-top:4px;font-weight:600}.total{margin-top:24px;border-radius:14px;background:#f5f3ff;padding:18px}.row{display:flex;justify-content:space-between;padding:6px 0}.strong{font-weight:700}.notice{margin-top:22px;font-size:12px;color:#71717a;line-height:1.6}
@media(max-width:640px){body{padding:12px}.receipt{padding:22px}.grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<main class="receipt">
<p class="muted">NSD CREATIONS</p>
<h1>Payment Receipt</h1>
<p class="muted">Booking ID: <strong>${esc(booking.booking_reference)}</strong></p>
<div class="grid">
<div class="item"><div class="label">Client</div><div class="value">${esc(booking.customer_name)}</div></div>
<div class="item"><div class="label">Email</div><div class="value">${esc(booking.customer_email)}</div></div>
<div class="item"><div class="label">Service</div><div class="value">${esc(booking.service_name_snapshot)}</div></div>
<div class="item"><div class="label">Package</div><div class="value">${esc(booking.package_name_snapshot)}</div></div>
</div>
<div class="total">
<div class="row"><span>Project value</span><span>${money(booking.total_amount_paise)}</span></div>
<div class="row"><span>Advance paid</span><span>${money(totalPaidPaise)}</span></div>
<div class="row"><span>Balance outstanding</span><span>${money(Math.max(0, Number(booking.total_amount_paise) - totalPaidPaise))}</span></div>
</div>
<h2 style="font-size:18px;margin-top:28px">Verified payment record</h2>
${paid.map((payment: any) => `<div class="item" style="margin-top:10px"><div class="row"><span>Amount</span><span class="strong">${money(payment.amount_paise)}</span></div><div class="row"><span>Source</span><span>${esc(payment.source)}</span></div><div class="row"><span>Payment ID</span><span>${esc(payment.razorpay_payment_id || payment.reference || "Manual reference")}</span></div><div class="row"><span>Paid at</span><span>${esc(payment.paid_at || payment.created_at)}</span></div></div>`).join("")}
<p class="notice">This is a payment receipt generated from NSD Creations' verified booking/payment records. It is not a GST tax invoice unless the business has separately configured and issued one.</p>
</main>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="NSD-${booking.booking_reference}-receipt.html"`,
      "Cache-Control": "no-store",
    },
  });
}
