import { Inter, Space_Grotesk, JetBrains_Mono, Fredoka } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LoadingWrapper } from "@/components/LoadingWrapper";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { PushNotificationManager } from "@/components/PushNotificationManager";
import { FilmGrain } from "@/components/FilmGrain";
import { GlobalReviewProvider } from "@/components/GlobalReviewProvider";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata = {
  title: "NSD Creations | AI Creative Studio & Digital Agency",
  description: "A world-class AI Creative Studio & Digital Agency combining software engineering, AI automation, cinematic storytelling, and branding.",
  verification: {
    google: "googlec7e73944ca34ef0b",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${fredoka.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script id="nsd-in-app-browser-redirect" strategy="beforeInteractive">
{`(function () {
  "use strict";
  try {
    var ua = navigator.userAgent || navigator.vendor || "";
    var isSocialInApp = /Instagram|FBAN|FBAV|Twitter|LinkedIn|Threads|Snapchat|TikTok/i.test(ua);
    if (!isSocialInApp) return;

    var currentUrl = window.location.href;
    var isAndroid = /Android/i.test(ua);
    var isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    if (!isAndroid && !isIOS) return;

    // Store the exact URL before redirecting. If Chrome is unavailable and Android
    // returns to the fallback URL, this prevents a redirect loop.
    var storageKey = "nsd_external_browser_redirect_attempted_url";
    try {
      if (window.sessionStorage.getItem(storageKey) === currentUrl) return;
      window.sessionStorage.setItem(storageKey, currentUrl);
      if (window.sessionStorage.getItem(storageKey) !== currentUrl) return;
    } catch (_storageError) {
      // Fail closed when a loop guard cannot be stored.
      return;
    }

    if (isAndroid) {
      var parsedUrl = new URL(currentUrl);
      var scheme = parsedUrl.protocol.replace(":", "");
      // Android reserves the first # for the intent declaration, so preserve the
      // path and query here; the full URL (including any hash) remains the fallback.
      var intentTarget = parsedUrl.host + parsedUrl.pathname + parsedUrl.search;
      var fallbackUrl = encodeURIComponent(currentUrl);
      window.location.replace(
        "intent://" + intentTarget + "#Intent;scheme=" + scheme +
        ";package=com.android.chrome;S.browser_fallback_url=" + fallbackUrl + ";end"
      );
      return;
    }

    // Best-effort Chrome handoff on iOS. Some in-app browsers block scheme launches,
    // so show a clear manual path if the app switch does not happen.
    var iosChromeUrl = currentUrl.replace(/^https:/i, "googlechromes:").replace(/^http:/i, "googlechrome:");
    window.location.href = iosChromeUrl;
    window.setTimeout(function () {
      if (document.visibilityState === "hidden") return;
      var showHelp = function () {
        if (!document.body || document.getElementById("nsd-browser-open-help")) return;
        var overlay = document.createElement("div");
        overlay.id = "nsd-browser-open-help";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.style.cssText = "position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(10,15,27,.96);color:#fff;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;text-align:center;";
        var card = document.createElement("div");
        card.style.cssText = "max-width:420px;padding:24px;border:1px solid rgba(255,255,255,.16);border-radius:20px;background:#111827;box-shadow:0 24px 70px rgba(0,0,0,.4);";
        var title = document.createElement("h2");
        title.textContent = "Open NSD Creations in Chrome";
        title.style.cssText = "font-size:21px;line-height:1.3;margin:0 0 12px;font-weight:700;";
        var message = document.createElement("p");
        message.textContent = "Instagram may block automatic browser switching on this device. Tap the menu (•••), choose ‘Open in browser’, then select Chrome.";
        message.style.cssText = "margin:0;color:#cbd5e1;font-size:15px;line-height:1.6;";
        var button = document.createElement("button");
        button.type = "button";
        button.textContent = "Continue here";
        button.style.cssText = "margin-top:18px;padding:11px 18px;border:0;border-radius:10px;background:#f97316;color:#fff;font:inherit;font-weight:700;cursor:pointer;";
        button.addEventListener("click", function () { overlay.remove(); });
        card.appendChild(title);
        card.appendChild(message);
        card.appendChild(button);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
      };
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", showHelp, { once: true });
      } else {
        showHelp();
      }
    }, 1200);
  } catch (_error) {
    // Never prevent NSD Creations from loading if browser detection fails.
  }
})();`}
        </Script>
        <link rel="preload" href="/nsdlogo.png" as="image" type="image/png" />
        <link rel="preload" href="/founder.png" as="image" type="image/png" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <GlobalReviewProvider>
            <SiteSettingsProvider>
            <LoadingWrapper>
              <FilmGrain />
              {children}
              <PushNotificationManager />
              <ServiceWorkerRegister />
            </LoadingWrapper>
            </SiteSettingsProvider>
          </GlobalReviewProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
