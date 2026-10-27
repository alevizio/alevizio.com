import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteAnalytics } from "./_components/site-analytics";

/* Pachama's own type, as the brand sets it: Chromatic Condensed (Colophon)
 * for headlines, in capitals; Matter (Displaay) for text; Matter Mono for
 * data and labels. Licensed fonts, self-hosted by next/font and kept out of
 * git (src/fonts is ignored; see the README). */
const display = localFont({
  src: [
    { path: "../fonts/chromatic-condensed-medium-pro.woff2", weight: "500" },
    { path: "../fonts/chromatic-condensed-bold-pro.woff2", weight: "700" },
  ],
  variable: "--font-chromatic",
  display: "swap",
});

const sans = localFont({
  src: [
    { path: "../fonts/Matter-Regular.woff2", weight: "400" },
    { path: "../fonts/Matter-Medium.woff2", weight: "500" },
    { path: "../fonts/Matter-Bold.woff2", weight: "700" },
  ],
  variable: "--font-matter",
  display: "swap",
});

const mono = localFont({
  src: [
    { path: "../fonts/MatterMono-Regular.woff2", weight: "400" },
    { path: "../fonts/MatterMono-Medium.woff2", weight: "500" },
  ],
  variable: "--font-matter-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alejandro Vizio",
  description: "Product designer and frontend developer.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <SiteAnalytics group="Pachama case study" />
      </body>
    </html>
  );
}
