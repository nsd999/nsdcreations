import { NextResponse } from "next/server";
import { requireRecentAdminAuthentication, assertSameOrigin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireRecentAdminAuthentication(request);
    assertSameOrigin(request);

    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const version = process.env.WHATSAPP_GRAPH_API_VERSION || "v23.0";
    if (!token || !phoneNumberId) {
      return NextResponse.json({ error: "WhatsApp Cloud API is not configured." }, { status: 503 });
    }

    const body = await request.json().catch(() => ({}));
    const to = String(body.to || "").replace(/\D/g, "");
    const message = String(body.message || "").trim();
    if (!/^\d{8,15}$/.test(to) || !message || message.length > 4000) {
      return NextResponse.json({ error: "Provide a valid international recipient number and a message up to 4000 characters." }, { status: 400 });
    }

    const response = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { preview_url: false, body: message },
      }),
      cache: "no-store",
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("[whatsapp send] Meta API rejected request:", response.status, result?.error?.code || "unknown");
      return NextResponse.json({ error: "WhatsApp rejected the message. Check API credentials, recipient opt-in, and the 24-hour customer-service window." }, { status: 502 });
    }

    return NextResponse.json({ success: true, messageId: result?.messages?.[0]?.id || null });
  } catch (error: any) {
    const status = Number(error?.status) || 500;
    if (status === 401 || status === 403) return NextResponse.json({ error: "Administrator authentication required." }, { status });
    console.error("[whatsapp send] failed:", error);
    return NextResponse.json({ error: "Unable to send WhatsApp message." }, { status: 500 });
  }
}
