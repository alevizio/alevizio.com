import cividis from "@/assets/colour/wind-cividis.webp";
import inferno from "@/assets/colour/wind-inferno.webp";
import magma from "@/assets/colour/wind-magma.webp";
import plasma from "@/assets/colour/wind-plasma.webp";
import viridis from "@/assets/colour/wind-viridis.webp";
import { cn } from "./cn";
import { Drift } from "./drift";
import { RampGlobe } from "./ramp-globe";
import { RAMPS } from "./ramps";

/* The palette and where it comes from. First the four greens, by the names
 * the file gives them (Greeg is the file's own spelling of the mint). Then
 * the data's colour: the five ramps the product offers for a raster, the
 * perceptually uniform maps science reads data by, each shown on the same
 * patch of wind over the North Atlantic, rendered through it, and beside
 * each ramp the whole world in it, turning. The swatches fill from the
 * bottom, the tiles drift, and the ramps keep flowing. */
const SWATCHES = [
  { name: "Dark Green", hex: "#0f1313", role: "The page", swatch: "bg-night ring-1 ring-mist/15" },
  { name: "Light Green", hex: "#e6f6e7", role: "Text", swatch: "bg-mist" },
  { name: "Greeg", hex: "#a0ffd7", role: "Anything to press", swatch: "bg-mint" },
  { name: "grey green", hex: "#7b847d", role: "Captions", swatch: "bg-dim" },
];

const TILES = [
  { src: viridis, from: "van der Walt and Smith, 2015" },
  { src: plasma, from: "van der Walt and Smith, 2015" },
  { src: inferno, from: "van der Walt and Smith, 2015" },
  { src: magma, from: "van der Walt and Smith, 2015" },
  { src: cividis, from: "Nuñez, Anderton and Renslow, 2018" },
];

const SIZES = "(min-width: 1376px) 240px, (min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw";

// Literal classes for Tailwind: the ramps arrive one after another.
const RAMP_DELAYS = ["[--reveal-delay:0.1s]", "[--reveal-delay:0.2s]", "[--reveal-delay:0.3s]", "[--reveal-delay:0.4s]", "[--reveal-delay:0.5s]"];

export const Palette = () => (
  <div className="grid gap-12 sm:gap-16">
    <div data-stagger className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
      {SWATCHES.map(({ name, hex, role, swatch }) => (
        <div key={name}>
          <div data-reveal="grow-y" className={cn("h-28 rounded-[10px] sm:h-36", swatch)} />
          <p className="type-caption mt-3 text-(--tone-head)">{name}</p>
          <p className="type-label normal-case tracking-normal text-(--tone-text)">
            {hex} · {role}
          </p>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5">
      {RAMPS.map(({ name, css }, i) => (
        <div key={name}>
          <Drift src={TILES[i].src} alt={`The same wind field over the North Atlantic, rendered in ${name}`} index={i} sizes={SIZES} />
          <div className="mt-4 flex items-center gap-3">
            <RampGlobe ramp={i} className="-my-2 -ml-1.5 size-11 shrink-0" />
            <div data-reveal="grow-x" className={cn("h-2.5 flex-1 rounded-full bg-[length:200%_100%] motion-safe:animate-[flow_9s_ease-in-out_infinite_alternate]", css, RAMP_DELAYS[i])} />
          </div>
          <p className="type-caption mt-3 text-(--tone-head)">{name}</p>
          <p className="type-label text-(--tone-text)">{TILES[i].from}</p>
        </div>
      ))}
    </div>
  </div>
);
