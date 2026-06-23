import type { ReactNode } from "react";
import { Clouds } from "./clouds";

/* Full-bleed chapter breaks for a very long story (client call
 * 2026-06-12): the six numbered sections grew to eighteen, and the
 * scroll read as one undifferentiated run of white-card galleries.
 * These dividers are the structure AND the rhythm — a breath of sky
 * with the brand's drifting clouds, a roman numeral in the kicker
 * pill, the chapter title in the licensed serif, one line of
 * orientation. They also replace the old per-section 01–18 numbering,
 * which was half the monotony. */

export const ChapterDivider = ({
  numeral,
  title,
  blurb,
  id,
  joinBelow = false,
  warm = false,
}: {
  numeral: string;
  title: string;
  blurb: string;
  /** Optional anchor; the nav still targets the first section inside. */
  id?: string;
  /** When true, the sky stays blue at the bottom (ending on the factory
   * hero's own top color, #D4E3F0) and the divider sits flush with the
   * section below — so the divider's sky and the hero's sky read as one
   * continuous background instead of meeting at a cream seam. */
  joinBelow?: boolean;
  /** A warm, blue-free breath (cream → soft sand → cream) for dividers that
   * follow the soil chapter, so the brown blends out smoothly with no jump to
   * blue sky. */
  warm?: boolean;
}) => (
  <div
    id={id}
    className={`relative overflow-hidden py-20 sm:py-28 ${
      joinBelow
        ? "mt-16 bg-[linear-gradient(180deg,#FBF0E6_0%,#E2E9F0_26%,#D4E3F0_50%,#D4E3F0_100%)]"
        : warm
          ? "my-16 bg-[linear-gradient(180deg,#FBF0E6_0%,#F3E8D8_50%,#FBF0E6_100%)]"
          : "my-16 bg-[linear-gradient(180deg,#FBF0E6_0%,#E2E9F0_32%,#D4E3F0_50%,#E2E9F0_68%,#FBF0E6_100%)]"
    }`}
  >
    <Clouds variant="break" />
    <div className="relative mx-auto max-w-3xl px-6 text-center">
      <p className="inline-flex items-center rounded-full border border-[#E8D9C5] bg-white/85 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[#5A6B8F] backdrop-blur-sm">
        Chapter {numeral}
      </p>
      <h2 className="story-serif mt-5 text-4xl tracking-tight text-[#0A0A0B] sm:text-5xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#5B6B70]">
        {blurb}
      </p>
    </div>
  </div>
);

/* A single full-bleed cream moment to reset the eye mid-chapter —
 * a design thesis in large italic serif, no numeral, no card, so it
 * reads distinctly from the sky dividers above. */
export const PullQuote = ({ children }: { children: ReactNode }) => (
  <figure className="my-24 px-6">
    <span
      aria-hidden
      className="mx-auto block h-px w-10 bg-[#C9B89E]"
    />
    <blockquote className="story-serif mx-auto mt-8 max-w-3xl text-center text-3xl italic leading-[1.3] tracking-tight text-[#0A0A0B] sm:text-[2.5rem] sm:leading-[1.22]">
      {children}
    </blockquote>
  </figure>
);
