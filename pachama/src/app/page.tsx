import type { Metadata } from "next";
import { Brand } from "./_chapters/brand";
import { Closing } from "./_chapters/closing";
import { Hero } from "./_chapters/hero";
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
      { id: "idea", label: "The idea" },
      { id: "mark", label: "The mark" },
      { id: "grids", label: "The grids" },
      { id: "colour-type", label: "Colour and type" },
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
      { id: "sourcing", label: "Sourcing" },
      { id: "system", label: "Design system" },
    ],
  },
  {
    id: "maps",
    numeral: "III",
    title: "The maps",
    items: [
      { id: "orbit", label: "From orbit" },
      { id: "canopy", label: "Canopy height" },
      { id: "baselines", label: "Dynamic baselines" },
      { id: "change", label: "Change over time" },
      { id: "lidar", label: "Lidar" },
      { id: "map-ui", label: "The map UI" },
    ],
  },
  {
    id: "world",
    numeral: "IV",
    title: "In the world",
    items: [
      { id: "booth", label: "Events" },
      { id: "print", label: "Print" },
      { id: "cards", label: "Small things" },
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
        <Maps />
        <World />
        <Closing />
      </main>
    </>
  );
}
