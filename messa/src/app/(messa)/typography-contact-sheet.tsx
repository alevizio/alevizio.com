import {
  Fraunces,
  Playfair_Display,
  Source_Serif_4,
  Instrument_Serif,
} from "next/font/google";
import { perfectlyNineties, untitledSerif } from "./fonts";
import { cn } from "./cn";

/* Typography contact sheet (client call 2026-06-13): the candidate DISPLAY
 * faces rendered live, one card each, scrolling as a single marquee row.
 * Each combination is display-face × Messina Sans body (the body is the
 * inherited story-sans); the fonts used are shown as pills at the foot of
 * every card. Non-brand faces load via next/font/google — build-time and
 * self-hosted, the same mechanism the root layout uses for Geist. */

const fraunces = Fraunces({ subsets: ["latin"], weight: ["400"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400"] });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], weight: ["400"] });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: ["400"] });

type Combo = {
  display: string;
  cls: string;
  note: string;
  chosen?: boolean;
};

const COMBOS: readonly Combo[] = [
  {
    display: "Perfectly Nineties",
    cls: perfectlyNineties.className,
    note: "Warm and characterful — editorial without trying too hard.",
    chosen: true,
  },
  {
    display: "Source Serif 4",
    cls: sourceSerif.className,
    note: "Clean and neutral, but a little safe — reads corporate.",
  },
  {
    display: "Fraunces",
    cls: fraunces.className,
    note: "High contrast with soft, organic terminals. A close second.",
  },
  {
    display: "Playfair Display",
    cls: playfair.className,
    note: "Didone drama — elegant from afar, cold up close.",
  },
  {
    display: "Instrument Serif",
    cls: instrument.className,
    note: "Light and literary — too delicate once the page got busy.",
  },
  {
    display: "Untitled Serif",
    cls: untitledSerif.className,
    note: "The book-weight fallback: steady, unshowy, dependable.",
  },
];

const Pill = ({ label, accent }: { label: string; accent?: boolean }) => (
  <span
    className={cn(
      "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest",
      accent
        ? "border-[#5A6B8F]/30 bg-[#5A6B8F]/5 text-[#5A6B8F]"
        : "border-[#E8D9C5] bg-[#FBF0E6] text-[#6E6B68]",
    )}
  >
    {label}
  </span>
);

const Card = ({
  c,
  index,
  hidden,
}: {
  c: Combo;
  index: string;
  hidden?: boolean;
}) => (
  <div
    aria-hidden={hidden || undefined}
    className="mr-6 flex w-[520px] shrink-0 flex-col"
  >
    {/* The specimen card. */}
    <div
      className={cn(
        "flex min-h-[640px] flex-1 flex-col rounded-2xl border bg-white px-16 py-24 shadow-[0_10px_40px_rgba(70,55,35,0.07)]",
        c.chosen ? "border-[#5A6B8F]" : "border-[#E8D9C5]",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-widest text-[#A3A19E]">
          {index}
        </span>
        {c.chosen ? (
          <span className="rounded-full bg-[#5A6B8F] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white">
            Chosen
          </span>
        ) : null}
      </div>

      {/* Headline + numeral take the candidate face; the rest is Messina Sans. */}
      <h4
        className={cn(
          c.cls,
          "mt-10 text-[44px] leading-[1.04] tracking-tight text-[#0A0A0B]",
        )}
      >
        See talent
        <br />
        clearly.
      </h4>
      <p className="mt-6 text-base leading-snug text-[#0A0A0B]">
        Messa turns resumes into ranked talent.
      </p>

      <div className="mt-8 flex items-center gap-5">
        <span className={cn(c.cls, "text-3xl tracking-tight text-[#0A0A0B]")}>
          67%
        </span>
        <span className="rounded-full bg-[#5A6B8F] px-5 py-2 text-sm font-medium text-white">
          Request a demo
        </span>
      </div>

      <p className="mt-auto pt-8 text-[13px] leading-6 text-[#A3A19E]">
        {c.note}
      </p>
    </div>

    {/* Fonts used — pills BELOW the card, outside the box. */}
    <div className="mt-3 flex flex-wrap gap-2">
      <Pill label={c.display} accent />
      <Pill label="Messina Sans" />
    </div>
  </div>
);

export const TypographyContactSheet = ({
  className,
}: {
  className?: string;
}) => (
  <section className={className} aria-label="Typography combinations">
    {/* Heading stays in the same reading column as the section heading above
      * (max-w-3xl), so they share a left edge; the marquee below runs full-bleed. */}
    <div className="mx-auto max-w-3xl px-6">
    </div>

    {/* One full-bleed marquee row; cards crop at the viewport edges. The
      * cards are doubled so the loop is seamless. */}
    <div className="story-marquee-mask story-scrollbar-none mt-10 overflow-hidden pb-2 motion-reduce:overflow-x-auto">
      <div className="story-marquee flex">
        {[...COMBOS, ...COMBOS].map((c, i) => (
          <Card
            key={i}
            c={c}
            index={String((i % COMBOS.length) + 1).padStart(2, "0")}
            hidden={i >= COMBOS.length}
          />
        ))}
      </div>
    </div>
  </section>
);
