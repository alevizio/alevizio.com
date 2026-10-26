import type { Metadata } from "next";
import { Closing } from "./_chapters/closing";
import { Hero } from "./_chapters/hero";
import { Look } from "./_chapters/look";
import { Start } from "./_chapters/start";
import { ThePage } from "./_chapters/the-page";
import { MotionObserver } from "./_components/motion-observer";
import { type NavGroup, StoryNav } from "./_components/story-nav";

const TITLE = "Earthscale — case study — Alejandro Vizio";
const DESCRIPTION =
  "A landing page for a developer platform for Earth intelligence: the brief, the structure, the look, and the page that shipped in 2025.";

// Served at the root of its own subdomain, like the Pachama, Messa and Pausa stories.
export const metadata: Metadata = {
  metadataBase: new URL("https://earthscale.alevizio.com"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Earthscale's landing page: Developer Tools for Earth Intelligence over a globe." }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.jpg"] },
};

// The nav mirrors the chapters: each id is a section on the page.
const NAV: readonly NavGroup[] = [
  {
    id: "start",
    numeral: "I",
    title: "Where it started",
    items: [
      { id: "brief", label: "The brief" },
      { id: "wireframe", label: "The structure" },
    ],
  },
  {
    id: "look",
    numeral: "II",
    title: "The look",
    items: [
      { id: "type", label: "Type" },
      { id: "colour", label: "Colour" },
      { id: "studies", label: "The imagery" },
      { id: "exploration", label: "A first pass" },
    ],
  },
  {
    id: "page",
    numeral: "III",
    title: "The page",
    items: [
      { id: "whole", label: "The whole page" },
      { id: "hero", label: "The hero" },
      { id: "proof", label: "Proof" },
      { id: "who", label: "Who it’s for" },
      { id: "serve", label: "Serve" },
      { id: "explore", label: "Explore" },
      { id: "catalog", label: "Catalog" },
      { id: "ask", label: "The ask" },
      { id: "screens", label: "Every width" },
      { id: "team", label: "The team" },
    ],
  },
  {
    id: "live",
    numeral: "IV",
    title: "Shipped",
    items: [{ id: "live", label: "What happened next" }],
  },
];

export default function EarthscaleCaseStudy() {
  return (
    <>
      <StoryNav groups={NAV} />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <Start />
        <Look />
        <ThePage />
        <Closing />
      </main>
      <MotionObserver />
    </>
  );
}
