import { cn } from "./cn";
import { RAMPS } from "./ramps";

/* The palette, sampled from the page's Figma: the dark green of the page,
 * the pale green of its text, the mint of anything to press, and the grey
 * green of its captions. Then the data's own colour: the five ramps the
 * product offers for a raster, viridis to cividis, which run through the
 * hero and every screen on the page. As they come into view the swatches
 * fill from the bottom and the ramps grow in from the left, then keep
 * flowing, slowly, the way the data moves under them. */
const SWATCHES = [
  { name: "The page", hex: "#0f1313", swatch: "bg-night ring-1 ring-mist/15" },
  { name: "Text", hex: "#e6f6e7", swatch: "bg-mist" },
  { name: "To press", hex: "#a0ffd7", swatch: "bg-mint" },
  { name: "Captions", hex: "#7b847d", swatch: "bg-dim" },
];

// Literal classes for Tailwind: the ramps arrive one after another.
const RAMP_DELAYS = ["[--reveal-delay:0.1s]", "[--reveal-delay:0.2s]", "[--reveal-delay:0.3s]", "[--reveal-delay:0.4s]", "[--reveal-delay:0.5s]"];

export const Palette = () => (
  <div className="grid gap-10">
    <div data-stagger className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
      {SWATCHES.map(({ name, hex, swatch }) => (
        <div key={name}>
          <div data-reveal="grow-y" className={cn("h-28 rounded-[10px] sm:h-36", swatch)} />
          <p className="type-caption mt-3 text-(--tone-head)">{name}</p>
          <p className="type-label normal-case tracking-normal text-(--tone-text)">{hex}</p>
        </div>
      ))}
    </div>
    <div className="grid gap-3">
      {RAMPS.map(({ name, css }, i) => (
        <div key={name} className="grid items-center gap-4 sm:grid-cols-[7rem_1fr]">
          <p className="type-label text-(--tone-text)">{name}</p>
          <div data-reveal="grow-x" className={cn("h-10 rounded-full bg-[length:200%_100%] motion-safe:animate-[flow_9s_ease-in-out_infinite_alternate]", css, RAMP_DELAYS[i])} />
        </div>
      ))}
    </div>
  </div>
);
