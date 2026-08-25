import { Inter, Space_Grotesk, JetBrains_Mono, Fredoka } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LoadingWrapper } from "@/components/LoadingWrapper";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { FilmGrain } from "@/components/FilmGrain";
import { GlobalReviewProvider } from "@/components/GlobalReviewProvider";

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
  icons: {
    icon: [
      { url: "/nsdlogo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: ["/nsdlogo.png"],
    apple: [
      { url: "/nsdlogo.png", type: "image/png" },
      { url: "/apple-icon.png", type: "image/png" },
    ],
  },
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
        <link rel="icon" href="/nsdlogo.png" type="image/png" />
        <link rel="shortcut icon" href="/nsdlogo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/nsdlogo.png" type="image/png" />
        <link rel="preload" href="/nsdlogo.png" as="image" type="image/png" />
        <link rel="preload" href="/founder.png" as="image" type="image/png" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <GlobalReviewProvider>
            <LoadingWrapper>
              <FilmGrain />
              {children}
              <ServiceWorkerRegister />
            </LoadingWrapper>
          </GlobalReviewProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

