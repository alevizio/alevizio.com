import { cn } from "./cn";

/* The palette as the hand-over uses it, sampled from the frames: the dark
 * green ground, the mark's gradient, and the spectrum along the top. */
const GROUNDS = [
  { name: "Ground", hex: "#303b36", swatch: "bg-ground" },
  { name: "Deep", hex: "#222b27", swatch: "bg-deep" },
  { name: "Fog", hex: "#eef2ef", swatch: "bg-fog" },
];

const SPECTRUM = ["#84e1ff", "#81ef9d", "#f5e544", "#79a3ff", "#f185dc", "#ff7324"];
// Tailwind needs whole class names, so the spectrum's chips are spelled out.
const SPECTRUM_CHIPS = ["bg-[#84e1ff]", "bg-[#81ef9d]", "bg-[#f5e544]", "bg-[#79a3ff]", "bg-[#f185dc]", "bg-[#ff7324]"];

const Chip = ({ name, hex, swatch, className }: { name: string; hex: string; swatch: string; className?: string }) => (
  <div className={className}>
    <div className={cn("h-28 rounded-[10px] ring-1 ring-white/10 sm:h-36", swatch)} />
    <p className="type-caption mt-3 text-(--tone-head)">{name}</p>
    <p className="type-label normal-case tracking-normal text-(--tone-text)">{hex}</p>
  </div>
);

export const Palette = () => (
  <div className="grid gap-6">
    <div className="grid grid-cols-3 gap-4 sm:gap-6">
      {GROUNDS.map((g) => (
        <Chip key={g.name} {...g} />
      ))}
    </div>
    <Chip name="The mark: leaf to sky" hex="#53f168 → #52d6fb" swatch="mark-gradient" />
    <div>
      <div className="grid grid-cols-6 overflow-hidden rounded-[10px]">
        {SPECTRUM_CHIPS.map((c) => (
          <div key={c} className={cn("h-16", c)} />
        ))}
      </div>
      <p className="type-caption mt-3 text-(--tone-head)">The spectrum</p>
      <p className="type-label normal-case tracking-normal text-(--tone-text)">{SPECTRUM.join(" · ")}</p>
    </div>
  </div>
);
