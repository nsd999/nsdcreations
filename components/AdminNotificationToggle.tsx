"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Check, Loader2, X } from "lucide-react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    output[i] = rawData.charCodeAt(i);
  }

  return output;
}

export function AdminNotificationToggle() {
  const [open, setOpen] = useState(false);
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const available =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setSupported(available);
    if (!available) return;

    setPermission(Notification.permission);

    navigator.serviceWorker.ready
      .then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        setEnabled(Boolean(subscription));
      })
      .catch(() => undefined);
  }, []);

  if (!supported) return null;

  async function enable() {
    setBusy(true);
    setError("");

    try {
      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);

      if (nextPermission !== "granted") {
        setError("Browser notification permission was not granted.");
        return;
      }

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) throw new Error("Notification service is not configured.");

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const response = await fetch("/api/admin/notification-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ subscription }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to register this device.");

      setEnabled(true);
      setOpen(true);
    } catch (e: any) {
      setError(e?.message || "Unable to enable admin notifications.");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    setError("");

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await fetch("/api/admin/notification-register", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        }).catch(() => undefined);
      }

      setEnabled(false);
    } catch (e: any) {
      setError(e?.message || "Unable to disable admin notifications.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      {open && (
        <div className="absolute right-0 top-11 z-[80] w-[min(330px,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#0b0b10] shadow-2xl p-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 p-1 text-zinc-600 hover:text-white"
            aria-label="Close notification settings"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="pr-6">
            <p className="text-sm font-semibold">Admin notifications</p>
            <p className="text-[11px] text-zinc-500 mt-1">
              Receive push alerts for new leads, bookings, payments, reviews and other important website activity.
            </p>
          </div>

          {enabled ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4" /> This device is registered.
              </div>
              <button
                type="button"
                onClick={disable}
                disabled={busy}
                className="w-full rounded-xl border border-white/10 px-3 py-2.5 text-xs text-zinc-400 hover:text-white disabled:opacity-50"
              >
                {busy ? "Updating…" : "Disable on this device"}
              </button>
            </div>
          ) : permission === "denied" ? (
            <div className="mt-4 text-xs text-zinc-500">
              Notifications are blocked by the browser. Re-enable them in the browser's site settings and try again.
            </div>
          ) : (
            <button
              type="button"
              onClick={enable}
              disabled={busy}
              className="mt-4 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3 py-2.5 text-xs font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
              {busy ? "Registering…" : "Register this device"}
            </button>
          )}

          {error && <p className="mt-3 text-[11px] text-red-300">{error}</p>}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={"inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs " + (enabled ? "border-emerald-500/20 text-emerald-300 bg-emerald-500/5" : "border-white/10 text-zinc-500 hover:text-zinc-200")}
        aria-label="Admin notification settings"
      >
        {enabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{enabled ? "Alerts on" : "Admin alerts"}</span>
      </button>
    </div>
  );
}
