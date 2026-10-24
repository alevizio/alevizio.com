import type { ReactNode } from "react";
import { cn } from "./cn";

/* The page's two faces, set live in the real fonts, each with its job: PP
 * Neue Machina at every size from the headline down, plain and tight; IBM
 * Plex Mono, spaced and in capitals, for buttons, tags and the fine print.
 * They arrive in turn as the card comes into view: the headline word by
 * word, then the rest. */
const HEADLINE = ["Developer", "Tools", "for", "Earth", "Intelligence"];
// Literal classes for Tailwind: a beat between the headline's words.
const WORD_DELAYS = ["[--reveal-delay:0s]", "[--reveal-delay:0.07s]", "[--reveal-delay:0.14s]", "[--reveal-delay:0.21s]", "[--reveal-delay:0.28s]"];

const FACES: { name: string; use: string; sample: ReactNode; className: string }[] = [
  {
    name: "PP Neue Machina Regular, 72",
    use: "The headline",
    sample: HEADLINE.map((word, i) => (
      <span key={word} data-reveal className={cn("inline-block", WORD_DELAYS[i])}>
        {word}&nbsp;
      </span>
    )),
    className: "font-sans text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none tracking-[-0.02em] text-mist",
  },
  {
    name: "PP Neue Machina Regular, 28",
    use: "The line under it, in mint",
    sample: (
      <span data-reveal className="block [--reveal-delay:0.4s]">
        Build next-gen geospatial products with cloud-native tools.
      </span>
    ),
    className: "font-sans text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.4] tracking-[-0.02em] text-mint",
  },
  {
    name: "PP Neue Machina Regular, 20 and 16",
    use: "Text",
    sample: (
      <span data-reveal className="block max-w-[40rem] [--reveal-delay:0.5s]">
        Spin up high-performance services for raster &amp; vector data in minutes, explore complex large scale datasets with a
        click, and ship faster, confidently.
      </span>
    ),
    className: "font-sans text-xl leading-[1.4] text-mist",
  },
  {
    name: "IBM Plex Mono Regular, 16 and 14",
    use: "Buttons, tags and the fine print, in capitals",
    sample: (
      <span data-reveal className="flex flex-wrap items-center gap-4 [--reveal-delay:0.6s]">
        <span className="inline-flex h-12 items-center gap-2 rounded-full bg-mint pr-4 pl-6 text-base text-night">
          Get Started <span aria-hidden>→</span>
        </span>
        <span className="hairline inline-flex h-9 items-center rounded-full px-4 text-xs uppercase tracking-[0.02em] text-mist">For teams</span>
        <span className="text-sm uppercase tracking-[0.02em] text-dim">Copyright © 2025 Earthscale</span>
      </span>
    ),
    className: "font-mono",
  },
];

export const TypeSpecimen = () => (
  <div className="hairline grid content-start gap-10 rounded-[10px] bg-night p-6 sm:p-10">
    {FACES.map(({ name, use, sample, className }) => (
      <div key={name}>
        <p className="type-label text-haze">
          {name} · {use}
        </p>
        <p className={cn("mt-4", className)}>{sample}</p>
      </div>
    ))}
  </div>
);
