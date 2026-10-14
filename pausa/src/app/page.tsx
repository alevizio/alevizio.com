import type { Metadata } from "next";
import { ByHand } from "./_chapters/by-hand";
import { Closing } from "./_chapters/closing";
import { Hero } from "./_chapters/hero";
import { InTheWorld } from "./_chapters/in-the-world";
import { System } from "./_chapters/system";
import { Truth } from "./_chapters/truth";
import { StoryNav } from "./_components/story-nav";

const TITLE = "Pausa — case study — Alejandro Vizio";
const DESCRIPTION =
  "Designing Pausa's identity by hand: a tangle, one blue pen, and a highlighter used once per screen. Brand, app, App Store and site, June to August 2026.";

// Served at the root of its own subdomain, like the Messa story. Unlisted
// (noindex) to match it; flip robots.index when it should be found.
export const metadata: Metadata = {
  metadataBase: new URL("https://pausa.alevizio.com"),
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Pausa: the journal that pushes back." }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.jpg"] },
};

const CHAPTERS = [
  { href: "#truth", numeral: "I", label: "The truth" },
  { href: "#by-hand", numeral: "II", label: "By hand" },
  { href: "#system", numeral: "III", label: "The system" },
  { href: "#in-the-world", numeral: "IV", label: "In the world" },
] as const;

export default function PausaCaseStudy() {
  return (
    <main className="flex-1">
      <StoryNav chapters={CHAPTERS} />
      <Hero />
      <Truth />
      <ByHand />
      <System />
      <InTheWorld />
      <Closing />
    </main>
  );
}
