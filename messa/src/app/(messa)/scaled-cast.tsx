import Image from "next/image";
import type { ScaledSprite } from "./case-study-media";
import { cn } from "./cn";

type ScaledCastProps = {
  sprites: readonly ScaledSprite[];
  /** Caption under the lineup — names the cast and explains the scale. */
  caption: string;
  /** Accessible label for the group. */
  label: string;
  /**
   * "fill" spreads the sprites edge-to-edge (justify-between) — for a row
   * whose widths sum near the full width. "start" packs them from the left
   * at a fixed gap. Both keep true widthClasses. Ignored when `uniform` or
   * `marquee`.
   */
  pack?: "fill" | "start";
  /**
   * Normalize every sprite to one height (width auto) and center the row
   * (client direction 2026-06-15) — a contact-sheet read rather than a
   * true-scale one. `widthClass` is ignored; the row wraps, centered, if
   * it can't fit one line.
   */
  uniform?: boolean;
  /**
   * One non-wrapping row that auto-scrolls as a seamless marquee (client
   * direction 2026-06-15) — the track is doubled and translates -50%, so
   * the duplicate half is decorative (aria-hidden). Pauses on hover; under
   * reduced motion it stops and becomes a manual horizontal scroll. Same
   * uniform height as `uniform`; `widthClass` ignored.
   */
  marquee?: boolean;
  /** Scroll the marquee the opposite direction (for a second stacked row). */
  reverse?: boolean;
  className?: string;
};

/** One sprite. `decorative` blanks the alt for marquee duplicate copies. */
const Sprite = ({
  sprite,
  className,
  decorative,
}: {
  sprite: ScaledSprite;
  className: string;
  decorative?: boolean;
}) => {
  const image = (
    <Image
      src={sprite.src}
      alt={decorative ? "" : sprite.alt}
      aria-hidden={decorative || undefined}
      width={sprite.width}
      height={sprite.height}
      sizes="(min-width: 1024px) 280px, 30vw"
      loading="lazy"
      decoding="async"
      className={sprite.steam ? "h-full w-auto" : className}
    />
  );

  if (!sprite.steam) return image;

  // Coffee mug: rising steam wisps. The wrapper carries the layout class
  // (height + margin + shrink); the image fills its height. Three wisps on
  // staggered delays drift up through the page's top padding (see marquee
  // container) so they read as steam, not a clipped bar.
  return (
    <span className={cn("relative", className)}>
      {image}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[10%] flex -translate-x-1/2 gap-1.5"
      >
        <span className="story-steam h-5 w-1 rounded-full bg-white/70 blur-[2px]" />
        <span className="story-steam h-7 w-1 rounded-full bg-white/60 blur-[2px] [animation-delay:0.9s]" />
        <span className="story-steam h-4 w-1 rounded-full bg-white/70 blur-[2px] [animation-delay:1.7s]" />
      </span>
    </span>
  );
};

/**
 * A lineup of hand-drawn sprites on the cream page (no card). Three reads:
 * - default: true scale — `items-end` ground line, each width a fixed
 *   share of the row (ScaledSprite.widthClass), real size relationships.
 * - `uniform`: every sprite the same height, centered — a contact sheet.
 * - `marquee`: one row at that uniform height, auto-scrolling seamlessly.
 * Sprites never shrink (`shrink-0`); the figcaption carries the reading.
 */
export const ScaledCast = ({
  sprites,
  caption,
  label,
  pack = "fill",
  uniform = false,
  marquee = false,
  reverse = false,
  className,
}: ScaledCastProps) => (
  <figure className={className} aria-label={label}>
    {marquee ? (
      <div className="story-marquee-mask story-marquee-fade story-scrollbar-none overflow-hidden pb-2 pt-7 motion-reduce:overflow-x-auto">
        <div
          className={cn(
            "story-marquee flex items-center",
            reverse && "story-marquee-reverse",
          )}
        >
          {[...sprites, ...sprites].map((sprite, i) => (
            <Sprite
              key={sprite.src + (i >= sprites.length ? "-dup" : "")}
              sprite={sprite}
              decorative={i >= sprites.length}
              className="mr-12 h-32 w-auto shrink-0 sm:mr-16 sm:h-40"
            />
          ))}
        </div>
      </div>
    ) : (
      <div
        className={cn(
          "flex",
          uniform
            ? "flex-wrap items-center justify-center gap-x-12 gap-y-12 sm:gap-x-16 sm:gap-y-14"
            : pack === "fill"
              ? "items-end justify-between"
              : "items-end gap-x-6 sm:gap-x-10",
        )}
      >
        {sprites.map((sprite) => (
          <Sprite
            key={sprite.src}
            sprite={sprite}
            className={cn(
              "shrink-0",
              uniform
                ? "h-32 w-auto sm:h-40"
                : cn("h-auto min-w-0", sprite.widthClass),
            )}
          />
        ))}
      </div>
    )}
    <figcaption className="mt-3 text-xs leading-5 text-[#6E6B68]">
      {caption}
    </figcaption>
  </figure>
);
