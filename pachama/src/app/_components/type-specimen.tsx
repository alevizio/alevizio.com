import type { ReactNode } from "react";
import { cn } from "./cn";
import { CountUp } from "./count-up";

/* The brand's three faces, set live in the real fonts, each with the job the
 * brand gives it: Chromatic Condensed for headlines in capitals, Matter for
 * text, Matter Mono for numbers and labels. They arrive in turn as the card
 * comes into view: the headline word by word, then the text, then the
 * number counting up to what Pachama's projects had removed. */
const HEADLINE = ["See", "carbon", "in", "action."];
// Literal classes for Tailwind: a beat between the headline's words.
const WORD_DELAYS = ["[--reveal-delay:0s]", "[--reveal-delay:0.08s]", "[--reveal-delay:0.16s]", "[--reveal-delay:0.24s]"];

const FACES: { name: string; foundry: string; sample: ReactNode; className: string }[] = [
  {
    name: "Chromatic Condensed Bold",
    foundry: "Colophon",
    sample: HEADLINE.map((word, i) => (
      <span key={word} data-reveal className={cn("inline-block", WORD_DELAYS[i])}>
        {word}&nbsp;
      </span>
    )),
    className: "font-display text-[clamp(2.75rem,6vw,4.5rem)] font-bold uppercase leading-[0.9]",
  },
  {
    name: "Matter",
    foundry: "Displaay",
    sample: (
      <span data-reveal className="block [--reveal-delay:0.4s]">
        Partner with Pachama to access technology and financing for your reforestation project.
      </span>
    ),
    className: "font-sans text-xl leading-snug",
  },
  {
    name: "Matter Mono",
    foundry: "Displaay",
    sample: (
      <span data-reveal className="block [--reveal-delay:0.6s]">
        <CountUp value={486764} /> tCO₂e removed
      </span>
    ),
    className: "font-mono text-2xl text-leaf",
  },
];

export const TypeSpecimen = () => (
  <div className="grid content-start gap-10 rounded-[10px] bg-deep p-6 text-fog sm:p-8">
    {FACES.map(({ name, foundry, sample, className }) => (
      <div key={name}>
        <p className="type-label text-haze">
          {name} · {foundry}
        </p>
        <p className={`mt-3 ${className}`}>{sample}</p>
      </div>
    ))}
  </div>
);
