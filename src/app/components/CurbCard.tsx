import { motion } from "motion/react";

// CURB — SF street-parking / street-sweeping map (curb.guide). Same chrome as the
// Globestudio + prode cards so the three read as one set. Foreground = CURB's real
// cube "C" logo, recolored to ink (public/curb-logo.svg) so it stays monochrome
// with the set (brand source is red #C1121F + gray; recolored like prode's mark).
// Background = a real line map of the Mission, generated from OpenStreetMap street
// geometry and rendered to ink lines (public/mission-map.svg) — the analog to
// Globestudio's globe / prode's trophy, nodding to CURB's actual map. It fades in
// from the left so it never competes with the wordmark + tagline.
export default function CurbCard() {
  return (
    <motion.a
      href="https://curb.guide/"
      target="_blank"
      rel="noopener noreferrer"
      className="group pixel-corners relative flex w-[78vw] max-w-[320px] shrink-0 snap-start flex-col items-start gap-8 overflow-hidden lg:w-full bg-[#1E1E1E]/[0.06] px-5 py-4 backdrop-blur-sm font-['Instrument_Sans',sans-serif] text-[#1E1E1E] transition-colors hover:bg-[#1E1E1E]/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E1E1E]"
      style={{ fontVariationSettings: "'wdth' 100" }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Real Mission street map (OSM → ink lines), fading in from the left so the
          copy stays legible. Ambient weight to match the globe / trophy siblings. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.22] [mask-image:linear-gradient(to_right,transparent,#000_45%)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_45%)]">
        <img
          src="/mission-map.svg"
          alt=""
          aria-hidden="true"
          // object-right surfaces the recognizable US-101 interchange on the map's
          // east edge; the left-fade mask keeps the wordmark/tagline area clean.
          className="h-full w-full object-cover object-right"
        />
      </div>

      {/* "LIVE" pill — top-right corner */}
      <span className="pixel-corners-sm absolute right-4 top-4 z-20 bg-[#1E1E1E] px-[5px] py-[3px] text-[8px] font-bold uppercase leading-none tracking-[0.14em] text-[#dedbd1]">
        live
      </span>

      {/* Foreground content */}
      <img
        src="/curb-logo.svg"
        alt=""
        aria-hidden="true"
        className="relative z-10 shrink-0 h-[34px] w-auto"
      />
      <div className="relative z-10 flex flex-col gap-0.5">
        <div className="text-[14px] font-semibold leading-tight">curb</div>
        <p className="max-w-[185px] text-balance text-[12px] leading-snug text-[#1E1E1E]/60">
          know where to park in sf — sweeping times block by block.
        </p>
      </div>
    </motion.a>
  );
}
