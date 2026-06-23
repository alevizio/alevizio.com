import { BRAND_PALETTE, type BrandSwatch } from "./case-study-media";
import { cn } from "./cn";

/**
 * The Messa palette as a full-bleed, counter-scrolling marquee of bold
 * color tiles, sitting just under the typography contact sheet at the top
 * of the story (client direction 2026-06-16). Each tile is filled with the
 * brand color itself; the hex + name sit inside in whichever of near-black
 * or white actually reads on that color (WCAG relative luminance). The
 * inline `backgroundColor`/`color` are the page's one deliberate exception
 * to the no-inline-styles rule — the values are data from the brand
 * manifest, not styling decisions of this portfolio.
 */

/** Legible foreground (near-black or white) for a background hex, chosen
 * by WCAG relative luminance. Pure + module-level so the tiles stay a
 * server component. */
const textOn = (hex: string): string => {
  const n = parseInt(hex.slice(1), 16);
  const toLinear = (channel: number): number => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const luminance =
    0.2126 * toLinear((n >> 16) & 255) +
    0.7152 * toLinear((n >> 8) & 255) +
    0.0722 * toLinear(n & 255);
  return luminance > 0.45 ? "#0A0A0B" : "#FFFFFF";
};

const Tile = ({
  swatch,
  hidden,
}: {
  swatch: BrandSwatch;
  hidden?: boolean;
}) => {
  const fg = textOn(swatch.hex);
  return (
    <div
      aria-hidden={hidden || undefined}
      title={swatch.usage}
      style={{ backgroundColor: swatch.hex, color: fg }}
      className="mr-4 flex h-48 w-40 shrink-0 flex-col justify-end rounded-2xl border border-black/[0.07] p-4 shadow-[0_10px_30px_rgba(70,55,35,0.08)]"
    >
      <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">
        {swatch.hex}
      </span>
      <span className="mt-1 text-sm font-medium leading-tight">
        {swatch.name}
      </span>
    </div>
  );
};

export const BrandPalette = ({ className }: { className?: string }) => (
  <section className={className} aria-label="The Messa color palette">
    {/* Heading stays in the reading column; the marquee runs full-bleed. */}
    <div className="mx-auto max-w-5xl px-6">
    </div>

    {/* Counter-scrolling marquee (runs opposite the typography row above);
      * tiles are doubled so the loop is seamless, pause on hover, and fall
      * back to a manual scroll under reduced motion. Hard edges (no fade). */}
    <div className="story-marquee-mask story-scrollbar-none mt-4 overflow-hidden pt-6 pb-12 motion-reduce:overflow-x-auto">
      <div className={cn("story-marquee story-marquee-reverse flex")}>
        {[...BRAND_PALETTE, ...BRAND_PALETTE].map((swatch, i) => (
          <Tile
            key={`${swatch.hex}-${i}`}
            swatch={swatch}
            hidden={i >= BRAND_PALETTE.length}
          />
        ))}
      </div>
    </div>
  </section>
);
