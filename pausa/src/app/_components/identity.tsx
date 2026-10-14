/* eslint-disable @next/next/no-img-element -- the brand's own SVGs and pixel-exact icon plates */
import Image from "next/image";
import { cn } from "./cn";
import { Lockup } from "./lockup";
import { Hand, PAGE } from "./story";

/* The identity, rebuilt from the kit's files and the brand book's own
 * drawings: the mark and its icon at the sizes a phone renders it, the
 * lockup's construction, the lockup on its grounds, and the paper. */

/* The icon tiles exactly as the book draws them (p. 10): plain rounded
 * corners whose radius the book sets per size (40 on the 180 tile, a fixed
 * 25 below that, capped at half the tile), and its keyline, 2 px of black
 * at 10% outside the edge. The Paper icon uses the book's own textured
 * tile; the Solid one, which the book doesn't show, gets the same tile. */
const LADDER = [
  { size: 180, radius: "rounded-[22.2%]" },
  { size: 120, radius: "rounded-[20.8%]" },
  { size: 80, radius: "rounded-[31.25%]" },
  { size: 58, radius: "rounded-[43.1%]" },
  { size: 40, radius: "rounded-[50%]" },
] as const;

const ICON = {
  paper: (size: number) => `/icon/book-paper-${size}.png`,
  solid: (size: number) => `/icon/pausa-app-icon-${size}-solid.png`,
} as const;

/** The tangle, large, beside the icon at true size in both shipped styles. */
export const MarkSpecimen = ({ className }: { className?: string }) => (
  <div className={cn(PAGE, "grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]", className)}>
    <img src="/brand/tangle-pen.svg" alt="The Pausa mark: a blue hand-drawn tangle." className="mx-auto w-full max-w-[34rem]" />
    <div>
      {(["paper", "solid"] as const).map((style) => (
        <div key={style} className="mb-10 flex flex-wrap items-end gap-5">
          {LADDER.map(({ size, radius }) => (
            <img
              key={size}
              src={ICON[style](size)}
              alt={size === 180 ? `The ${style === "paper" ? "Paper" : "Solid"} app icon` : ""}
              width={size / 2}
              height={size / 2}
              className={cn("outline-2 outline-black/10", radius)}
            />
          ))}
        </div>
      ))}
      <p className="type-caption max-w-[30rem] text-body">
        180 home screen · 120 Spotlight · 80 Spotlight · 58 Settings · 40 notification. Shown at true size: this is what a
        phone actually renders. Paper above, Solid below.
      </p>
    </div>
  </div>
);

/** The book's two notes on the mark (p. 09): the concept, and why the knot won. */
export const MarkNotes = ({ className }: { className?: string }) => (
  <ul className={cn(PAGE, "grid gap-10 md:grid-cols-2 md:gap-14", className)}>
    <li>
      <p className="type-label text-pen">The concept</p>
      <p className="type-body mt-3 text-body">
        Pausa is the handwriting in the margin of your own life: the sharp, literate note a great reader leaves on a page
        you wrote without thinking. The pushback is an editor’s annotation, not an alert.
      </p>
    </li>
    <li>
      <p className="type-label text-pen">Why the knot won</p>
      <p className="type-body mt-3 text-body">
        It is the drawing on its own: no head, no speech bubble, no container. Nothing around the tangle has to survive
        being straightened, which is the one thing the mark has to do. Traced, never redrawn.
      </p>
    </li>
  </ul>
);

const NOTES = [
  { label: "Module", text: "The icon box is 8u. Every other number is a whole multiple of u, so the lockup rebuilds from the numbers alone." },
  { label: "Name size", text: "x-height 3u. Set the name by its x-height, never by its box: the descender would make the box lie." },
  { label: "Gap", text: "2u, ink to ink. The wordmark file carries 2.8% of its width as side bearing; that is subtracted." },
  { label: "Vertical", text: "The x-height band centres on the icon, not the bounding boxes. Caveat’s p drops 29.6% below the baseline." },
] as const;

const SIZES = [
  { px: 168, width: "w-full max-w-[544px]", xHeight: "x-height 63px", use: "Deck, site header" },
  { px: 120, width: "w-[71.4%] max-w-[389px]", xHeight: "x-height 45px", use: "Email signature" },
  { px: 96, width: "w-[57.1%] max-w-[311px]", xHeight: "x-height 36px", use: "The floor" },
] as const;

/** The lockup's construction (p. 11): the book's own diagram, its four
 *  rules, the clear space and the sizes it is set at. */
export const Construction = ({ className }: { className?: string }) => (
  <div className={cn(PAGE, className)}>
    <img
      src="/construction/construction.svg"
      alt="The lockup's construction: the icon box is 8u, the gap 2u, the name's x-height 3u, with guides at the icon top, x-height, baseline, descender and icon foot."
      width={1008}
      height={333}
      className="mark-multiply block h-auto w-full max-w-[63rem]"
    />
    <ul className="mt-14 grid gap-x-8 gap-y-8 border-t border-rule pt-8 sm:grid-cols-2 lg:grid-cols-4">
      {NOTES.map((n) => (
        <li key={n.label}>
          <p className="type-label text-body">{n.label}</p>
          <p className="type-secondary mt-2 text-ink">{n.text}</p>
        </li>
      ))}
    </ul>

    <div className="mt-24 grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
      <div className="@container">
        <p className="type-label text-body">Clear space</p>
        {/* the lockup inside its 2u margin: u is the tile ÷ 8, so the inset is a quarter of the tile's
            height. In a narrow column it scales down to fit, margin and all (width = 3.7383 × height + border). */}
        <div className="mt-6 inline-block border border-dashed border-pen/60 bg-pen/[0.06] p-[min(1.375rem,calc((100cqw_-_2px)/14.953))] sm:p-[min(1.75rem,calc((100cqw_-_2px)/14.953))]">
          <Lockup
            alt="The Pausa lockup with its clear space marked round it."
            className="h-[min(5.5rem,calc((100cqw_-_2px)/3.7383))] sm:h-[min(7rem,calc((100cqw_-_2px)/3.7383))]"
          />
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          <li>
            <p className="type-label text-body">The rule</p>
            <p className="type-secondary mt-2 text-ink">
              Keep 2u clear all round, a quarter of the icon. Nothing sets inside it: no rule, no caption, no edge of frame.
            </p>
          </li>
          <li>
            <p className="type-label text-body">Why 2u</p>
            <p className="type-secondary mt-2 text-ink">
              It is the icon’s own corner radius doubled, so the breathing room comes from the mark rather than being imposed
              on it.
            </p>
          </li>
        </ul>
      </div>
      <div>
        <p className="type-label text-body">Sizes</p>
        <ul className="mt-6 space-y-8">
          {SIZES.map((s) => (
            <li key={s.px} className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              <div className="whitespace-nowrap md:w-32 md:shrink-0 md:text-right">
                <p className="font-mono text-[13px] text-ink">{s.px}px</p>
                <p className="font-mono text-[11px] leading-[1.4] text-body">{s.xHeight}</p>
                <p className="font-mono text-[11px] leading-[1.4] text-body">{s.use}</p>
              </div>
              <div className="min-w-0 flex-1">
                <Lockup alt="" className={s.width} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const GROUNDS = [
  { name: "On white", panel: "bg-sheet", onDark: false },
  { name: "On paper", panel: "bg-[url(/pausa-co/paper-texture-deep.jpg)] bg-cover", onDark: false },
  { name: "On blue", panel: "bg-pen", onDark: true },
] as const;

/** The lockup on its three grounds: the tile stays light, only the name changes. */
export const LockupGrounds = ({ className }: { className?: string }) => (
  <div className={cn("grid md:grid-cols-3", className)}>
    {GROUNDS.map((g) => (
      <div key={g.name} className={cn("flex aspect-[4/3] items-center justify-center px-10", g.panel)}>
        <Lockup onDark={g.onDark} alt={`The Pausa lockup ${g.name.toLowerCase()}`} className="w-full max-w-[17rem]" />
      </div>
    ))}
  </div>
);

const QUARTERS = [
  { q: "Q1", src: "/textures/q1.webp", wrinkle: "5% wrinkle" },
  { q: "Q2", src: "/textures/q2.webp", wrinkle: "20% wrinkle" },
  { q: "Q3", src: "/textures/q3.webp", wrinkle: "50% wrinkle" },
] as const;

/** The wrinkled age (p. 15): one notebook per year, the paper wearing as it goes. */
export const Textures = ({ className }: { className?: string }) => (
  <ul className={cn("grid md:grid-cols-3", className)}>
    {QUARTERS.map((t) => (
      <li key={t.q} className="relative">
        <Image
          src={t.src}
          width={1672}
          height={941}
          alt={`The paper as it wears: ${t.q}, ${t.wrinkle}.`}
          sizes="(min-width: 768px) 34vw, 100vw"
          className="block aspect-[4/3] h-auto w-full object-cover mix-blend-multiply md:aspect-[2/3]"
        />
        <div className="absolute bottom-8 left-6 sm:left-10">
          <Hand>{t.q}</Hand>
          <p className="type-label mt-1 text-ink">{t.wrinkle}</p>
        </div>
      </li>
    ))}
  </ul>
);
