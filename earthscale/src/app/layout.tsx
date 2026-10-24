import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

/* Earthscale's type, as the page sets it: PP Neue Machina (Pangram Pangram)
 * for everything from the headline down, IBM Plex Mono for buttons, tags
 * and captions. Neue Machina is licensed, self-hosted by next/font and kept
 * out of git (src/fonts is ignored; see the README). Plex Mono is open. */
const machina = localFont({
  src: [
    { path: "../fonts/PPNeueMachina-Light.woff2", weight: "300" },
    { path: "../fonts/PPNeueMachina-Regular.woff2", weight: "400" },
    { path: "../fonts/PPNeueMachina-Ultrabold.woff2", weight: "800" },
  ],
  variable: "--font-machina",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
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
  themeColor: "#121212",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${machina.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
