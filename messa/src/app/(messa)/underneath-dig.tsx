import type { ReactNode } from "react";

/**
 * The "Underneath" chapter, rendered on soil-brown — the engineering below the
 * surface, as a core sample (see ./underneath-strata). It descends from the
 * cream page into the soil, holds the brown through the strata, and rises back
 * to cream at the bottom. The light-built strata bodies (stat grids, the bug
 * demo, the timelapse, the iceberg) are re-themed for the dark ground by the
 * `.story-underneath` scope in story.css. Full-bleed.
 */
export const UnderneathDig = ({
  numeral,
  title,
  blurb,
  children,
}: {
  numeral: string;
  title: string;
  blurb: string;
  children: ReactNode;
}) => (
  <section
    id="underneath"
    className="story-underneath relative -mt-20 mx-[calc(50%-50vw)] scroll-mt-28 overflow-hidden md:-mt-28"
    style={{
      // Soil through the strata, rising back to cream at the very bottom. The
      // negative top margin pulls the hills up so they touch the product with a
      // slight overlap; the blue sky reads through the valley between them.
      background:
        "linear-gradient(180deg, #45331F 0%, #45331F 95%, #5A4631 98%, #FBF0E6 100%)",
    }}
  >
    {/* Inverted-hero sky — the hero's blue (#D4E3F0) reading through the valley
        between the hills and the thin strip above the peaks; cream at the very
        top so the product's bottom blends into it where they overlap. */}
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 h-[15vw] bg-[linear-gradient(180deg,#FBF0E6_0%,#E2E9F0_30%,#D4E3F0_100%)]"
    />
    {/* The ground cross-section — the hills rise to meet the product (slight
        overlap), soil dissolving into the chapter's soil. loading=lazy keeps
        this 1MB+ image out of the SSR preload set. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/images/ground.png"
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className="relative block w-full select-none"
      style={{
        maskImage: "linear-gradient(to bottom, #000 58%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, #000 58%, transparent 100%)",
      }}
    />

    {/* Chapter header pulled up onto the soil of the cross-section. */}
    <div className="relative z-10 mx-auto -mt-[12vw] max-w-3xl px-6 pb-2 text-center">
      <p className="inline-flex items-center rounded-full border border-white/20 bg-white/[0.08] px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[#FBF0E6] backdrop-blur-sm">
        Chapter {numeral}
      </p>
      <h2 className="story-serif mt-5 text-4xl tracking-tight text-[#FBF0E6] sm:text-5xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#FBF0E6]/70">
        {blurb}
      </p>
    </div>

    <div className="relative z-10 pb-20">{children}</div>
  </section>
);
