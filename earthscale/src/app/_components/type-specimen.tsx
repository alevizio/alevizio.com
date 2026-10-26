import type { ReactNode } from "react";

import { cn } from "./cn";

/* The page's two faces and where they come from: the file's ten desktop
 * text styles, set live in the real fonts with the page's own words in
 * them, each labelled with its name and size as the file has them. PP
 * Neue Machina carries eight, IBM Plex Mono the two in capitals. The rows
 * arrive one after another as the cards come into view. */
type Style = { name: string; size: number; sample: string; className: string };

const MACHINA: Style[] = [
  { name: "h1", size: 72, sample: "Developer Tools for Earth Intelligence", className: "text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-mist" },
  { name: "h2", size: 50, sample: "Serve Data at Scale, Instantly", className: "text-[clamp(2rem,4.2vw,3.125rem)] leading-none tracking-[-0.02em] text-mist" },
  { name: "h3", size: 32, sample: "A Visual Explorer for your Data", className: "text-[clamp(1.5rem,2.7vw,2rem)] leading-none tracking-[-0.02em] text-mist" },
  { name: "Subtitle 1", size: 28, sample: "Build next-gen geospatial products with cloud-native tools.", className: "text-[1.75rem] leading-[1.4] tracking-[-0.02em] text-mint" },
  { name: "Subtitle 2", size: 24, sample: "Teams building with geospatial data.", className: "text-2xl leading-[1.4] tracking-[-0.02em] text-mint" },
  { name: "Body 1", size: 20, sample: "Earthscale gave us the building blocks to turn satellite imagery into real-time insights.", className: "text-xl leading-[1.4] text-mist" },
  { name: "Body 2", size: 16, sample: "Spin up high-performance services for raster & vector data in minutes.", className: "text-base leading-[1.4] text-text" },
  { name: "Body 3", size: 14, sample: "Enter your email...", className: "text-sm leading-none text-text" },
];

const PLEX: Style[] = [
  { name: "Button", size: 16, sample: "Get Started", className: "text-base leading-[1.1] text-mist" },
  { name: "Caption", size: 14, sample: "Copyright © 2025 Earthscale", className: "text-sm uppercase leading-[1.1] text-mist" },
];

const Face = ({ name, from, styles, mono = false, children }: { name: string; from: string; styles: Style[]; mono?: boolean; children?: ReactNode }) => (
  <div className="hairline rounded-[10px] bg-night p-6 sm:p-8">
    <p data-reveal className="type-body text-mist">
      {name}
    </p>
    <p data-reveal className="type-label mt-2 text-haze [--reveal-delay:0.06s]">
      {from}
    </p>
    <ol data-stagger className="mt-8 border-b border-rule">
      {styles.map(({ name: style, size, sample, className }) => (
        <li key={style} data-reveal className="grid gap-x-6 gap-y-2 border-t border-rule py-5 sm:grid-cols-[1fr_auto]">
          <p className={cn(mono ? "font-mono" : "font-sans", className)}>{sample}</p>
          <p className="type-label whitespace-nowrap text-haze sm:pt-1 sm:text-right">
            {style} · {size}
          </p>
        </li>
      ))}
    </ol>
    {children}
  </div>
);

export const TypeSpecimen = () => (
  <div className="grid items-start gap-4 sm:gap-6 lg:grid-cols-[3fr_2fr]">
    <Face name="PP Neue Machina" from="Pangram Pangram, Montréal · Mathieu Desjardins, 2019 · eight styles" styles={MACHINA} />
    <Face name="IBM Plex Mono" from="IBM with Bold Monday · Mike Abbink, 2017 · open source · two styles" styles={PLEX} mono>
      <p className="type-label mt-8 text-haze">In use</p>
      <p data-reveal className="mt-4 flex flex-wrap items-center gap-4 font-mono [--reveal-delay:0.2s]">
        <span className="inline-flex h-12 items-center gap-2 rounded-full bg-mint pr-5 pl-6 text-base text-night">
          Get Started <span aria-hidden>→</span>
        </span>
        <span className="hairline inline-flex h-9 items-center rounded-full px-4 text-xs uppercase tracking-[0.02em] text-mist">For teams</span>
        <span className="text-sm uppercase tracking-[0.02em] text-dim">Copyright © 2025 Earthscale</span>
      </p>
    </Face>
  </div>
);
