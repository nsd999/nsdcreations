import { Inter, Space_Grotesk, JetBrains_Mono, Fredoka } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LoadingWrapper } from "@/components/LoadingWrapper";

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
      <body className="bg-[#030303] text-[#f5f5f5] dark:bg-[#030303] dark:text-[#f5f5f5] light:bg-[#fafafa] light:text-[#121212] antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <LoadingWrapper>
            {children}
          </LoadingWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

