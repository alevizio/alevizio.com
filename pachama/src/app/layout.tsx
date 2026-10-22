import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* Pachama's brand sets Matter for everything and Matter Mono for data. Both
 * are licensed to Pachama, so Geist and Geist Mono stand in for them here
 * (self-hosted by next/font at build time; no request to Google at runtime). */
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
  themeColor: "#f3f2ee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
