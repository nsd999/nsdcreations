import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

function assertConfigured() {
  if (!keyId || !keySecret) throw new Error("RAZORPAY_NOT_CONFIGURED");
}

export function isRazorpayConfigured() {
  return Boolean(keyId && keySecret);
}

export async function razorpayRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  assertConfigured();

  const auth = Buffer.from(keyId + ":" + keySecret).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1" + path, {
    ...init,
    headers: {
      Authorization: "Basic " + auth,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  const body = await response.text();
  let parsed: unknown = null;
  try { parsed = JSON.parse(body); } catch {}

  if (!response.ok) {
    const errorBody = parsed && typeof parsed === "object"
      ? parsed as { error?: { code?: string; description?: string } }
      : {};
    const code = errorBody.error?.code || "UNKNOWN";
    const description = errorBody.error?.description || "Razorpay request was rejected.";
    console.error("Razorpay API rejected request:", {
      status: response.status,
      code,
      description,
    });
    const err = new Error("RAZORPAY_REQUEST_FAILED");
    (err as Error & { status?: number; code?: string; description?: string }).status = response.status;
    (err as Error & { status?: number; code?: string; description?: string }).code = code;
    (err as Error & { status?: number; code?: string; description?: string }).description = description;
    throw err;
  }
  return parsed as T;
}

export async function createRazorpayOrder(input: {
  amountPaise: number;
  currency: "INR";
  receipt: string;
  notes?: Record<string, string>;
}) {
  return razorpayRequest<{
    id: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    notes: Record<string, string>;
  }>("/orders", {
    method: "POST",
    body: JSON.stringify({
      amount: input.amountPaise,
      currency: input.currency,
      receipt: input.receipt,
      notes: input.notes || {},
    }),
  });
}

export async function fetchRazorpayOrder(orderId: string) {
  return razorpayRequest<{
    id: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    status: string;
    receipt: string;
  }>("/orders/" + encodeURIComponent(orderId));
}

export async function fetchRazorpayPayment(paymentId: string) {
  return razorpayRequest<{
    id: string;
    order_id: string;
    amount: number;
    currency: string;
    status: string;
    method?: string;
    fee?: number;
    tax?: number;
  }>("/payments/" + encodeURIComponent(paymentId));
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  if (!keySecret || !signature) return false;

  const expected = createHmac("sha256", keySecret)
    .update(orderId + "|" + paymentId)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export function verifyRazorpayWebhook(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export function getRazorpayPublicKey() {
  return keyId || null;
}
