"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Unregister any existing service workers to fix aggressive caching / image loading issues
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      }).catch(function (err) {
        console.error("Service Worker unregistration failed: ", err);
      });
    }
  }, []);

  return null; // No UI needed, this just cleans up the old offline worker silently.
}
