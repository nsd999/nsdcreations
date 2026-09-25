"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: new (options: any) => { open: () => void };
  }
}

function money(paise: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(paise || 0) / 100);
}

function loadCheckout() {
  return new Promise<void>((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load payment checkout."));
    document.body.appendChild(script);
  });
}

export default function QuotePayPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const parts = window.location.pathname.split("/");
    const quoteId = parts[2];
    const token = new URLSearchParams(window.location.search).get("token");

    if (!quoteId || !token) {
      setError("Invalid quote payment link.");
      return;
    }

    fetch("/api/quotes/" + encodeURIComponent(quoteId) + "?token=" + encodeURIComponent(token))
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Unable to load quote.");
        return json;
      })
      .then((json) => setData({ ...json, quoteId, token }))
      .catch((err) => setError(err.message));
  }, []);

  async function pay() {
    if (!data?.quote?.booking_id) {
      setError("This quote has not been converted into a payment request yet.");
      return;
    }

    setBusy(true);
    try {
      const booking = await fetch("/api/bookings/" + encodeURIComponent(data.quote.booking_id) + "?token=" + encodeURIComponent(data.token)).then((r) => r.json());
      if (!booking.booking) throw new Error("Payment booking is unavailable.");

      await loadCheckout();

      const checkout = new window.Razorpay!({
        key: data.quote.booking_id ? booking.booking.razorpayOrderId ? undefined : undefined : undefined,
        amount: data.quote.advance_amount_paise,
        currency: "INR",
        name: "NSD Creations",
        description: "Approved custom quote " + data.quote.quote_reference,
        order_id: data.orderId,
        prefill: { name: data.quote.customer_name, email: data.quote.customer_email },
        theme: { color: "#7C6BFF" },
        modal: { ondismiss: () => setBusy(false) },
        handler: async (response: any) => {
          const verification = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId: data.quote.booking_id,
              accessToken: data.token,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          }).then((r) => r.json());

          if (!verification.success) throw new Error(verification.error || "Payment verification failed.");
          router.replace("/booking/success?bookingId=" + encodeURIComponent(data.quote.booking_id) + "&token=" + encodeURIComponent(data.token));
        },
      });

      checkout.open();
    } catch (err: any) {
      setBusy(false);
      setError(err.message || "Unable to start payment.");
    }
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-4">
      <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-10">
        {!data && !error && <div className="text-center text-zinc-500 py-12">Loading approved quote…</div>}
        {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-red-300">{error}</div>}
        {data?.quote && (
          <>
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-300 flex items-center justify-center"><CheckCircle2 className="w-5 h-5"/></div>
              <div><p className="text-xs font-mono uppercase tracking-widest text-emerald-300">Approved quotation</p><h1 className="text-2xl md:text-3xl font-display font-bold mt-1">{data.quote.quote_reference}</h1></div>
            </div>
            <div className="mt-7 grid sm:grid-cols-2 gap-4 text-sm"><div><div className="text-zinc-500">Customer</div>{data.quote.customer_name}</div><div><div className="text-zinc-500">Service</div>{data.quote.service_id}</div><div><div className="text-zinc-500">Project total</div>{money(data.quote.total_paise)}</div><div><div className="text-zinc-500">Advance today</div><div className="text-indigo-300 font-semibold">{money(data.quote.advance_amount_paise)}</div></div><div><div className="text-zinc-500">Balance</div>{money(data.quote.balance_amount_paise)}</div><div><div className="text-zinc-500">Validity</div>{data.quote.validity_date || "As agreed"}</div></div>
            <div className="mt-6 rounded-2xl border border-white/10 p-4 text-sm text-zinc-400">{data.quote.scope}</div>
            <button onClick={pay} disabled={busy} className="mt-6 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-4 font-bold flex items-center justify-center gap-2">{busy?<Loader2 className="w-5 h-5 animate-spin"/>:<ShieldCheck className="w-5 h-5"/>}{busy?"Opening secure checkout…":"Pay " + money(data.quote.advance_amount_paise) + " Advance"}</button>
          </>
        )}
      </section>
    </main>
  );
}
