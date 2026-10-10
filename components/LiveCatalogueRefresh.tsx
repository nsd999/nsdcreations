"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Refreshes server-rendered pricing data while a pricing page is open.
 * The catalogue API is explicitly no-store, so refreshes pick up the latest
 * published Supabase override instead of a CDN or static-build snapshot.
 */
export function LiveCatalogueRefresh() {
  const router = useRouter();

  useEffect(() => {
    let refreshing = false;
    const refresh = () => {
      if (document.visibilityState !== "visible" || refreshing) return;
      refreshing = true;
      router.refresh();
      // Router refresh is synchronous to start but completes asynchronously.
      window.setTimeout(() => {
        refreshing = false;
      }, 3000);
    };

    const interval = window.setInterval(refresh, 15000);
    const onFocus = () => refresh();
    const onVisibility = () => refresh();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [router]);

  return null;
}
