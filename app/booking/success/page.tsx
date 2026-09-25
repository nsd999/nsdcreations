"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, MessageCircle, Printer } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

function money(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

export default function BookingSuccessPage() {
  const [state, setState] = useState<{ loading: boolean; booking?: any; error?: string }>({
    loading: true,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get("bookingId");
    const token = params.get("token");

    if (!bookingId || !token) {
      setState({ loading: false, error: "Booking details are missing." });
      return;
    }

    fetch(
      "/api/bookings/" +
        encodeURIComponent(bookingId) +
        "?token=" +
        encodeURIComponent(token),
    )
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load booking.");
        return data;
      })
      .then((data) => setState({ loading: false, booking: data.booking }))
      .catch((error) => setState({ loading: false, error: error.message }));
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-16">
        {state.loading && (
          <div className="py-20 text-center text-zinc-400">Loading verified booking…</div>
        )}

        {state.error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center text-red-300">
            {state.error}
          </div>
        )}

        {state.booking && (
          <div className="rounded-3xl border border-emerald-500/20 bg-zinc-950/80 shadow-2xl overflow-hidden">
            <div className="p-8 md:p-10 text-center bg-gradient-to-b from-emerald-500/10 to-transparent">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
              <p className="text-xs font-mono uppercase tracking-widest text-emerald-300 mt-5">
                Payment verified
              </p>
              <h1 className="text-3xl md:text-5xl font-display font-bold mt-2">
                Booking Confirmed
              </h1>
              <p className="text-zinc-400 mt-3">
                Booking ID:{" "}
                <span className="text-white font-mono">{state.booking.bookingReference}</span>
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div><div className="text-zinc-500">Service</div><div>{state.booking.serviceName}</div></div>
                <div><div className="text-zinc-500">Package</div><div>{state.booking.packageName}</div></div>
                <div><div className="text-zinc-500">Project total</div><div>{money(state.booking.projectTotalPaise)}</div></div>
                <div><div className="text-zinc-500">Advance paid</div><div className="text-emerald-300">{money(state.booking.advanceAmountPaise)}</div></div>
                <div><div className="text-zinc-500">Balance due</div><div>{money(state.booking.balanceAmountPaise)}</div></div>
                <div>
                  <div className="text-zinc-500">Payment ID</div>
                  <div className="font-mono text-xs break-all">
                    {state.booking.razorpayPaymentId || "Verified by webhook"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 text-sm text-zinc-300 space-y-2">
                <strong className="text-white">Next steps</strong>
                <p>1. Your advance payment has been received.</p>
                <p>2. Your project request is confirmed.</p>
                <p>3. NSD Creations will review the submitted requirements.</p>
                <p>4. You will receive the project-start communication.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={"/api/bookings/" + encodeURIComponent(state.booking.id) + "/receipt?token=" + encodeURIComponent(new URLSearchParams(window.location.search).get("token") || "")}
                  className="flex-1 py-3 rounded-xl border border-zinc-800 flex items-center justify-center gap-2"
                  download
                >
                  <Printer className="w-4 h-4" />
                  Download Receipt
                </a>
                <a
                  href="https://wa.me/916303849852"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-[#25D366] text-white flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp NSD
                </a>
                <Link
                  href="/"
                  className="flex-1 py-3 rounded-xl bg-indigo-600 flex items-center justify-center gap-2"
                >
                  Back to NSD Creations
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
