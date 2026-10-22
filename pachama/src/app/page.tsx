import type { Metadata } from "next";
import { Brand } from "./_chapters/brand";
import { Closing } from "./_chapters/closing";
import { Hero } from "./_chapters/hero";
import { Kit } from "./_chapters/kit";
import { Maps } from "./_chapters/maps";
import { Product } from "./_chapters/product";
import { World } from "./_chapters/world";
import { type NavGroup, StoryNav } from "./_components/story-nav";

const TITLE = "Pachama — case study — Alejandro Vizio";
const DESCRIPTION =
  "Five years designing how people see forest carbon at Pachama: the product, the maps and the brand around both.";

// Served at the root of its own subdomain, like the Messa and Pausa stories.
// Unlisted (noindex) to match them; flip robots.index when it should be found.
export const metadata: Metadata = {
  metadataBase: new URL("https://pachama.alevizio.com"),
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

// The nav mirrors the chapters: each id is a section on the page.
const NAV: readonly NavGroup[] = [
  {
    id: "brand",
    numeral: "I",
    title: "The brand",
    items: [
      { id: "before", label: "Where it started" },
      { id: "strategy", label: "The strategy" },
      { id: "idea", label: "The idea" },
      { id: "mark", label: "The mark" },
      { id: "language", label: "The graphic language" },
      { id: "colour-type", label: "Colour and type" },
      { id: "illustration", label: "Illustration" },
      { id: "brand-book", label: "The brand book" },
      { id: "applications", label: "Applications" },
      { id: "site", label: "The website" },
      { id: "rollout", label: "My part" },
    ],
  },
  {
    id: "product",
    numeral: "II",
    title: "The product",
    items: [
      { id: "marketplace", label: "The marketplace" },
      { id: "project", label: "Project pages" },
      { id: "buying", label: "Buying" },
      { id: "portfolio", label: "Portfolios" },
      { id: "monitoring", label: "Monitoring" },
      { id: "biodiversity", label: "Biodiversity" },
      { id: "developers", label: "Developers" },
      { id: "sourcing", label: "Sourcing" },
      { id: "screening", label: "Screening" },
    ],
  },
  {
    id: "kit",
    numeral: "III",
    title: "Banyan",
    items: [
      { id: "kit-all", label: "The system" },
      { id: "foundations", label: "Foundations" },
      { id: "patterns", label: "Patterns" },
      { id: "map-kit", label: "Maps" },
      { id: "forms", label: "Forms" },
      { id: "data-display", label: "Data display" },
      { id: "feedback", label: "Feedback" },
      { id: "overlay", label: "Overlay" },
      { id: "media", label: "Media" },
    ],
  },
  {
    id: "maps",
    numeral: "IV",
    title: "The maps",
    items: [
      { id: "orbit", label: "From orbit" },
      { id: "canopy", label: "Canopy height" },
      { id: "point-clouds", label: "Point clouds" },
      { id: "baselines", label: "Dynamic baselines" },
      { id: "change", label: "Change over time" },
      { id: "lidar", label: "Lidar" },
      { id: "map-ui", label: "The map UI" },
    ],
  },
  {
    id: "world",
    numeral: "V",
    title: "In the world",
    items: [
      { id: "booth", label: "Events" },
      { id: "series-b", label: "Series B" },
      { id: "retreat", label: "Retreat" },
      { id: "badges", label: "Badges" },
      { id: "trees", label: "Pachama Originals" },
      { id: "small-things", label: "Small things" },
      { id: "field", label: "In the field" },
    ],
  },
];

export default function PachamaCaseStudy() {
  return (
    <>
      <StoryNav groups={NAV} />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <Brand />
        <Product />
        <Kit />
        <Maps />
        <World />
        <Closing />
      </main>
    </>
  );
}
