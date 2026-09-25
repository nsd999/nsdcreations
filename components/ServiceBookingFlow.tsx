"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { ServiceDetail, ServicePackage } from "@/lib/services-data";

declare global {
  interface Window {
    Razorpay?: new (options: any) => { open: () => void };
  }
}

function money(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

function loadCheckoutScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.Razorpay) return resolve();

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay checkout failed to load."));
    document.body.appendChild(script);
  });
}

export function ServiceBookingFlow({
  service,
  pkg,
}: {
  service: ServiceDetail;
  pkg: ServicePackage;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    requirement: "",
    preferredDeliveryDate: "",
    notes: "",
  });

  const price = useMemo(() => {
    const cleaned = pkg.price.replace(/[₹,]/g, "");
    if (!/^\d+(?:\.\d+)?$/.test(cleaned)) return null;
    return Math.round(Number(cleaned) * 100);
  }, [pkg.price]);

  const isCustomQuote =
    price === null ||
    pkg.price.includes("+") ||
    /–|-/.test(pkg.price.replace("₹", ""));

  const advance =
    price !== null
      ? service.pricingPeriod === "/month" || price <= 99900
        ? price
        : Math.round(price / 2)
      : null;

  const balance = price !== null && advance !== null ? price - advance : null;

  const update = (field: string, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
  };

  const startPayment = async () => {
    if (!accepted) {
      setError("Please confirm that you have reviewed the scope and pricing.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const stored = sessionStorage.getItem(
        "nsd_booking_" + service.id + "_" + pkg.name,
      );
      const draft = stored ? JSON.parse(stored) : null;

      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          packageId: pkg.name,
          bookingId: draft?.bookingId,
          customer: details,
          selectedOptions: {},
        }),
      });

      const payload = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(payload.error || "Unable to start payment.");

      sessionStorage.setItem(
        "nsd_booking_" + service.id + "_" + pkg.name,
        JSON.stringify({
          bookingId: payload.bookingId,
          accessToken: payload.accessToken,
        }),
      );

      await loadCheckoutScript();

      const checkout = new window.Razorpay!({
        key: payload.keyId,
        amount: payload.order.amount,
        currency: payload.order.currency,
        name: "NSD Creations",
        description: service.name + " — " + pkg.name,
        order_id: payload.order.id,
        prefill: {
          name: details.name,
          email: details.email,
          contact: details.phone,
        },
        notes: {
          booking_reference: payload.bookingReference,
        },
        theme: { color: "#7C6BFF" },
        modal: {
          ondismiss: () => setSaving(false),
        },
        handler: async (response: any) => {
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId: payload.bookingId,
              accessToken: payload.accessToken,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verification = await verifyResponse.json();
          if (!verifyResponse.ok || !verification.success) {
            setSaving(false);
            setError(
              "Payment could not be verified yet. Your booking remains unconfirmed. Please retry.",
            );
            return;
          }

          router.push(
            "/booking/success?bookingId=" +
              encodeURIComponent(payload.bookingId) +
              "&token=" +
              encodeURIComponent(payload.accessToken),
          );
        },
      });

      checkout.open();
    } catch (err: any) {
      setSaving(false);
      setError(err?.message || "Unable to start payment.");
    }
  };

  if (isCustomQuote) {
    return (
      <div className="max-w-3xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 md:p-12">
        <span className="text-xs uppercase tracking-widest text-indigo-400 font-mono">
          Custom quotation required
        </span>
        <h1 className="mt-3 text-3xl md:text-4xl font-display font-bold">
          {service.name}
        </h1>
        <p className="mt-4 text-zinc-400 leading-relaxed">
          <strong>{pkg.name}</strong> is a starting/range price. The exact scope
          must be confirmed before a payment is requested.
        </p>
        <a
          href={
            "/contact?service=" +
            encodeURIComponent(service.name) +
            "&package=" +
            encodeURIComponent(pkg.name)
          }
          className="mt-8 inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white"
        >
          Request Custom Quote
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest text-indigo-400 font-mono">
          Secure project reservation
        </span>
        <h1 className="mt-3 text-3xl md:text-5xl font-display font-bold">
          {service.name}
        </h1>
        <p className="mt-3 text-zinc-400">{pkg.name} package</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            {[
              ["1", "Package"],
              ["2", "Your details"],
              ["3", "Review & pay"],
            ].map(([number, label]) => (
              <div
                key={number}
                className={
                  "flex-1 border-b-2 pb-2 " +
                  (step === Number(number)
                    ? "border-indigo-400 text-white"
                    : "border-zinc-800")
                }
              >
                {number}. {label}
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-5">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <p className="text-sm text-zinc-400">Selected package</p>
                  <h2 className="text-2xl font-display font-bold mt-1">{pkg.name}</h2>
                  <p className="text-3xl font-bold text-indigo-300 mt-2">{pkg.price}</p>
                  <ul className="mt-5 space-y-2 text-sm text-zinc-300">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold flex items-center justify-center gap-2"
                >
                  Continue with {pkg.name}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <input value={details.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name *" className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500" />
                <input value={details.email} onChange={(e) => update("email", e.target.value)} placeholder="Email address *" type="email" className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500" />
                <input value={details.phone} onChange={(e) => update("phone", e.target.value)} placeholder="WhatsApp / mobile *" className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500" />
                <input value={details.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="Business / brand name" className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500" />
                <textarea value={details.requirement} onChange={(e) => update("requirement", e.target.value)} placeholder="What do you need delivered? *" rows={5} className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500 resize-y" />
                <input value={details.preferredDeliveryDate} onChange={(e) => update("preferredDeliveryDate", e.target.value)} type="date" className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500" />
                <textarea value={details.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Additional notes (optional)" rows={3} className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500 resize-y" />
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)} className="px-4 py-3 rounded-xl border border-zinc-800 text-zinc-300">
                    <ChevronLeft className="w-4 h-4 inline mr-1" />Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!details.name || !details.email || !details.phone || !details.requirement}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 disabled:opacity-40 font-semibold"
                  >
                    Review
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4"><span className="text-zinc-400">Client</span><span>{details.name}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-zinc-400">Email</span><span className="text-right">{details.email}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-zinc-400">Service</span><span className="text-right">{service.name}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-zinc-400">Package</span><span>{pkg.name}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-zinc-400">Project value</span><span>{money(price || 0)}</span></div>
                  <div className="flex justify-between gap-4 font-semibold"><span>Advance today</span><span className="text-indigo-300">{money(advance || 0)}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-zinc-400">Balance remaining</span><span>{money(balance || 0)}</span></div>
                </div>

                <label className="flex gap-3 rounded-2xl border border-zinc-800 bg-white/[0.03] p-4 text-sm text-zinc-300">
                  <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1" />
                  <span>I have reviewed the scope, package, pricing and advance amount.</span>
                </label>

                <p className="text-xs text-zinc-500">
                  Your project slot is confirmed only after the advance payment is successfully verified server-side.
                </p>

                {error && (
                  <p className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">
                    {error}
                  </p>
                )}

                <button
                  onClick={startPayment}
                  disabled={saving || !accepted}
                  className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-bold text-base flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  {saving ? "Opening secure checkout..." : "Pay " + money(advance || 0) + " Advance"}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                  <LockKeyhole className="w-3.5 h-3.5" />
                  Secure Razorpay Checkout
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-zinc-800 bg-white/[0.03] p-6 h-fit lg:sticky lg:top-28">
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Price summary</p>
          <div className="mt-5 space-y-4">
            <div>
              <span className="block text-xs text-zinc-500">Project value</span>
              <span className="text-2xl font-bold">{money(price || 0)}</span>
            </div>
            <div>
              <span className="block text-xs text-zinc-500">Advance required</span>
              <span className="text-xl font-bold text-indigo-300">{money(advance || 0)}</span>
            </div>
            <div>
              <span className="block text-xs text-zinc-500">Balance after confirmation</span>
              <span className="text-xl font-bold">{money(balance || 0)}</span>
            </div>
          </div>
          <p className="mt-6 text-xs text-zinc-500 leading-relaxed">
            Secure Razorpay payment • Transparent pricing • Clear scope • Verified payment record.
          </p>
        </aside>
      </div>
    </div>
  );
}
