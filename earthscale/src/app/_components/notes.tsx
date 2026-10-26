import type { ReactNode } from "react";

import { cn } from "./cn";
import { Tag } from "./story";

/* The brief, as Earthscale left it in the Figma, cut down to the list: who
 * the platform is for, what it does, what a developer gets, and the one
 * section they wanted room for. The features are pills, not sentences. */
type Item = { text: string; soon?: boolean };

const WHO = "Product, data and engineering teams working with Earth observation and remote sensing data.";

const FEATURES: Item[] = [
  { text: "Any dataset, registered in seconds" },
  { text: "Serving on the fly" },
  { text: "Optimized overviews at scale" },
  { text: "Organization-wide catalog" },
  { text: "Spatial filtering" },
  { text: "Search by name" },
  { text: "Datasets into maps" },
  { text: "Geo-tagged comments" },
  { text: "Band and time series per pixel" },
  { text: "Python client and API" },
  { text: "Maps into projects", soon: true },
  { text: "Zonal statistics", soon: true },
];

const DEVELOPERS: Item[] = [
  { text: "x/y/z tile URLs, Mapbox GL ready" },
  { text: "Python client, API or the UI" },
  { text: "Pixel time series in your own app" },
  { text: "Register datasets from code" },
  { text: "Create maps from code", soon: true },
];

const ROOM = "Customer logos and testimonials, to drop in when ready.";

/* The pills land one after another, left to right. Tailwind only sees
 * classes written out, so the wave is a list. */
const WAVE = [
  "[--reveal-delay:0s]",
  "[--reveal-delay:0.05s]",
  "[--reveal-delay:0.1s]",
  "[--reveal-delay:0.15s]",
  "[--reveal-delay:0.2s]",
  "[--reveal-delay:0.25s]",
  "[--reveal-delay:0.3s]",
  "[--reveal-delay:0.35s]",
  "[--reveal-delay:0.4s]",
  "[--reveal-delay:0.45s]",
  "[--reveal-delay:0.5s]",
  "[--reveal-delay:0.55s]",
];

const Pills = ({ items }: { items: Item[] }) => (
  <ul className="flex flex-wrap gap-2">
    {items.map(({ text, soon }, i) => (
      <li key={text}>
        <Tag className={cn(WAVE[Math.min(i, WAVE.length - 1)], "text-(--tone-head)", soon && "border-dashed text-(--tone-text)")}>
          {text}
          {soon ? " · soon" : null}
        </Tag>
      </li>
    ))}
  </ul>
);

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="grid gap-4 py-7 first:pt-0 last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-x-10 sm:py-8">
    <p data-reveal className="type-label pt-2 text-(--tone-label)">
      {label}
    </p>
    {children}
  </div>
);

export const Notes = ({ className }: { className?: string }) => (
  <div className={cn("divide-y divide-(--tone-line)", className)}>
    <Row label="Who it’s for">
      <p data-reveal className="type-body max-w-[34rem] text-(--tone-head) [--reveal-delay:0.08s]">
        {WHO}
      </p>
    </Row>
    <Row label="What it does">
      <Pills items={FEATURES} />
    </Row>
    <Row label="For developers">
      <Pills items={DEVELOPERS} />
    </Row>
    <Row label="Room for">
      <p data-reveal className="type-body max-w-[34rem] text-(--tone-text) [--reveal-delay:0.08s]">
        {ROOM}
      </p>
    </Row>
  </div>
);
