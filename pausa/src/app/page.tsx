import type { Metadata } from "next";
import { ByHand } from "./_chapters/by-hand";
import { Closing } from "./_chapters/closing";
import { Hero } from "./_chapters/hero";
import { Identity } from "./_chapters/identity";
import { InTheWorld } from "./_chapters/in-the-world";
import { ThePen } from "./_chapters/the-pen";
import { type NavGroup, StoryNav } from "./_components/story-nav";

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

// The nav mirrors the chapters: each id is a section on the page.
const NAV: readonly NavGroup[] = [
  {
    id: "by-hand",
    numeral: "I",
    title: "By hand",
    items: [
      { id: "directions", label: "Three directions" },
      { id: "drawings", label: "Drawn in pen" },
      { id: "tools", label: "The tools" },
      { id: "tangle", label: "One mark" },
    ],
  },
  {
    id: "identity",
    numeral: "II",
    title: "The identity",
    items: [
      { id: "mark", label: "The mark" },
      { id: "lockup", label: "Construction" },
      { id: "grounds", label: "Grounds" },
      { id: "colour", label: "Colour" },
      { id: "type", label: "Type" },
      { id: "paper", label: "Paper" },
    ],
  },
  {
    id: "pen",
    numeral: "III",
    title: "The pen",
    items: [
      { id: "marks", label: "Pen marks" },
      { id: "doodles", label: "Doodles" },
      { id: "icons", label: "Icons" },
      { id: "voice", label: "Voice" },
    ],
  },
  {
    id: "world",
    numeral: "IV",
    title: "In the world",
    items: [
      { id: "onboarding", label: "Onboarding" },
      { id: "app", label: "The app" },
      { id: "loader", label: "Loader" },
      { id: "app-store", label: "App Store" },
      { id: "feed", label: "The feed" },
      { id: "street", label: "The street" },
    ],
  },
];

export default function PausaCaseStudy() {
  return (
    <>
      <StoryNav groups={NAV} />
      {/* Clipped sideways, so the spreads that run a little wider than the
          window are cropped by the browser's edges. */}
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <ByHand />
        <Identity />
        <ThePen />
        <InTheWorld />
        <Closing />
      </main>
    </>
  );
}
