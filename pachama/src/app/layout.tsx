import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Saira_Condensed } from "next/font/google";
import "./globals.css";

/* Pachama's brand sets Matter SQ (headlines, in capitals), Matter (text) and
 * Matter Mono (data). All three are licensed to Pachama, so free faces stand
 * in for them on this page: Saira Condensed, Geist and Geist Mono. The real
 * type appears in the brand's own images. Self-hosted by next/font. */
const display = Saira_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-saira",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
