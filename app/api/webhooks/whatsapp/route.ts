import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifySignature(rawBody: string, signature: string | null) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret || !signature?.startsWith("sha256=")) return false;
  const expected = "sha256=" + createHmac("sha256", appSecret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (!expectedToken || mode !== "subscribe" || !token || token !== expectedToken || !challenge) {
    return new NextResponse("Webhook verification failed", { status: 403 });
  }
  return new NextResponse(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifySignature(rawBody, request.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload?.object !== "whatsapp_business_account") {
    return NextResponse.json({ received: true });
  }

  try {
    const db = getSupabaseAdmin();
    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== "messages") continue;
        const value = change.value || {};
        const contacts = value.contacts || [];
        const contactByWaId = new Map(contacts.map((c: any) => [c.wa_id, c]));
        for (const message of value.messages || []) {
          const contact: any = contactByWaId.get(message.from);
          const text = message.text?.body
            ?? message.button?.text
            ?? message.interactive?.button_reply?.title
            ?? message.interactive?.list_reply?.title
            ?? "";
          const row = {
            wamid: message.id,
            direction: "inbound",
            wa_id: message.from,
            contact_name: contact?.profile?.name || null,
            message_type: message.type || "unknown",
            message_text: String(text).slice(0, 10000),
            payload: message,
            status: "received",
            message_timestamp: message.timestamp ? new Date(Number(message.timestamp) * 1000).toISOString() : new Date().toISOString(),
          };
          const { error } = await db.from("whatsapp_messages").upsert(row, { onConflict: "wamid" });
          if (error) {
            console.error("[whatsapp webhook] message persistence failed:", error.message);
            return NextResponse.json({ error: "Unable to persist webhook event" }, { status: 500 });
          }
        }

        for (const status of value.statuses || []) {
          const { error } = await db.from("whatsapp_messages").upsert({
            wamid: status.id,
            direction: "outbound",
            wa_id: status.recipient_id || null,
            status: status.status || "unknown",
            payload: status,
            message_timestamp: status.timestamp ? new Date(Number(status.timestamp) * 1000).toISOString() : new Date().toISOString(),
          }, { onConflict: "wamid" });
          if (error) console.error("[whatsapp webhook] status persistence failed:", error.message);
        }
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[whatsapp webhook] processing failed:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
