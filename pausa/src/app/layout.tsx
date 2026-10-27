import type { Metadata, Viewport } from "next";
import { Caveat, IBM_Plex_Mono, Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { SiteAnalytics } from "./_components/site-analytics";

/* Pausa's four faces, each with one job (brand book, "Type"):
 * Source Serif 4 is the voice (entries, headlines, the call-out),
 * Caveat is the hand (the margin, the marks), Inter is the chrome,
 * IBM Plex Mono is the technical layer (labels, specs). Self-hosted
 * by next/font at build time — no request to Google at runtime. */
const serif = Source_Serif_4({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-source-serif",
  display: "swap",
});

const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alejandro Vizio",
  description: "Product designer and frontend developer.",
};

export const viewport: Viewport = {
  themeColor: "#F5F5F3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${hand.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SiteAnalytics group="Pausa case study" />
      </body>
    </html>
  );
}
