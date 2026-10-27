import type { Metadata } from "next";
import { Brand } from "./_chapters/brand";
import { Closing } from "./_chapters/closing";
import { Hero } from "./_chapters/hero";
import { Kit } from "./_chapters/kit";
import { Maps } from "./_chapters/maps";
import { Product } from "./_chapters/product";
import { World } from "./_chapters/world";
import { MotionObserver } from "./_components/motion-observer";
import { type NavGroup, StoryNav } from "./_components/story-nav";

const TITLE = "Pachama — case study — Alejandro Vizio";
const DESCRIPTION =
  "Five years designing how people see forest carbon at Pachama: the product, the maps and the brand around both.";

// Served at the root of its own subdomain, like the Messa and Pausa stories.
export const metadata: Metadata = {
  metadataBase: new URL("https://pachama.alevizio.com"),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "Alejandro Vizio", url: "https://alevizio.com" }],
  // Proves ownership to Google Search Console (property https://pachama.alevizio.com/). Keep it.
  verification: { google: "PM8upxbw_R3VN07zSBXP0IiFrkVjIQWIdtiW_YbIGC8" },
  // alevizio.com/work/pachama redirects here, so this is the one address to index.
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    type: "article",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Pachama: how people see forest carbon." }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.jpg"] },
};

// What the page is, for search engines and AI answers: a case study by Alejandro, about Pachama.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Pachama: designing how people see forest carbon",
  description: DESCRIPTION,
  url: "https://pachama.alevizio.com/",
  image: "https://pachama.alevizio.com/og.jpg",
  inLanguage: "en",
  author: {
    "@type": "Person",
    name: "Alejandro Vizio",
    url: "https://alevizio.com",
    jobTitle: "Product and brand designer",
  },
  about: { "@type": "Organization", name: "Pachama", url: "https://pachama.com" },
  isPartOf: { "@type": "WebSite", name: "Alejandro Vizio", url: "https://alevizio.com" },
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
      { id: "applications", label: "Applications" },
      { id: "social", label: "Social" },
      { id: "decks", label: "Presentations" },
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
      { id: "criteria", label: "The criteria" },
      { id: "buying", label: "Buying" },
      { id: "portfolio", label: "Portfolios" },
      { id: "monitoring", label: "Monitoring" },
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
      { id: "structure", label: "The structure" },
      { id: "components", label: "The components" },
    ],
  },
  {
    id: "maps",
    numeral: "IV",
    title: "The maps",
    items: [
      { id: "orbit", label: "From orbit" },
      { id: "on-the-map", label: "On the map" },
      { id: "biodiversity", label: "Biodiversity" },
      { id: "canopy", label: "Canopy height" },
      { id: "baselines", label: "Dynamic baselines" },
      { id: "change", label: "Change over time" },
      { id: "lidar", label: "Lidar" },
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
    ],
  },
];

export default function PachamaCaseStudy() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
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
      <MotionObserver />
    </>
  );
}
