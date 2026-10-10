"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type PublicSiteSettings = Record<string, string>;

const SiteSettingsContext = createContext<PublicSiteSettings>({});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PublicSiteSettings>({});

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;

    const refresh = async () => {
      if (cancelled || inFlight) return;
      inFlight = true;
      try {
        const response = await fetch("/api/public/site-settings", { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json();
        if (!cancelled && payload?.settings && typeof payload.settings === "object") {
          setSettings((current) => ({ ...current, ...payload.settings }));
        }
      } catch {
        // Retain the previous known-good values and use page defaults on first load.
      } finally {
        inFlight = false;
      }
    };

    void refresh();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 15000);
    const onFocus = () => void refresh();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
