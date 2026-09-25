"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bell, Check, X } from "lucide-react";
import { usePathname } from "next/navigation";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationManager() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [supported, setSupported] = useState(false);
  const [busy, setBusy] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    const available =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setSupported(available);
    if (!available) return;

    setPermission(Notification.permission);

    navigator.serviceWorker.ready
      .then(async (registration) => {
        const existing = await registration.pushManager.getSubscription();
        if (existing) setSubscribed(true);
      })
      .catch(() => undefined);
  }, []);

  if (
    !supported ||
    pathname.startsWith("/nsdtheadmin") ||
    pathname.startsWith("/book/") ||
    pathname.startsWith("/booking/")
  ) {
    return null;
  }

  async function enableNotifications() {
    setBusy(true);

    try {
      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);

      if (nextPermission !== "granted") {
        setOpen(false);
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

      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription,
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) throw new Error("Subscription could not be saved.");

      setSubscribed(true);
      setOpen(false);
    } catch (error) {
      console.error("Push subscription error:", error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute bottom-14 right-0 w-[min(340px,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#0b0b10]/95 backdrop-blur-xl shadow-2xl p-4"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close notifications"
              className="absolute right-3 top-3 rounded-lg p-1 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="pr-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-300 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Get NSD Creations updates</p>
                  <p className="text-[11px] text-zinc-500">Tips, services, portfolio updates and announcements.</p>
                </div>
              </div>

              {subscribed ? (
                <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Notifications are enabled on this device.
                </div>
              ) : permission === "denied" ? (
                <p className="mt-4 text-xs leading-relaxed text-zinc-500">
                  Notifications are blocked in browser settings. You can re-enable them there if you choose.
                </p>
              ) : (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={enableNotifications}
                    disabled={busy}
                    className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-3 py-2.5 text-xs font-semibold"
                  >
                    {busy ? "Enabling…" : "Enable Notifications"}
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-white/10 px-3 py-2.5 text-xs text-zinc-400"
                  >
                    Not Now
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close notification panel" : "Open notification settings"}
        className="w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-full border border-white/10 bg-[#0b0b10]/95 backdrop-blur-xl text-zinc-200 shadow-2xl flex items-center justify-center hover:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
      >
        {open ? <X className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
      </button>
    </div>
  );
}
