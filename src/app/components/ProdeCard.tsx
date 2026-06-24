import { motion } from "motion/react";
import { useState } from "react";
import { HoverVideoPreview, type HoverPreviewPoint } from "./HoverVideoPreview";

// Prode — the 2026 World Cup prediction game (prode.io). Same chrome as the
// Globestudio + curb cards (pixel-corners, cream-tint, ink monochrome, status
// pill, foreground mark + wordmark + tagline). Foreground mark is prode's World
// Cup glyph recolored to ink (public/prode-mark.svg); the ambient background is a
// top-down soccer pitch — the analog to globestudio's globe / curb's street map,
// nodding to prode.io's green-pitch hero.

// Top-down soccer pitch drawn in ink lines. Sized to cover and bleed off the
// card's right edge (the parent layer handles opacity + the left-fade).
const SoccerField = ({ className }: { className?: string }) => (
  <svg
    className={className}
    // Padded viewBox (pitch is 0 0 1050 680) zooms the field out so more of it
    // shows — full right penalty box + arc, center circle, both touchlines —
    // while still bleeding off the card's right edge.
    viewBox="-260 -90 1310 860"
    fill="none"
    stroke="#1E1E1E"
    strokeWidth={3}
    aria-hidden="true"
    preserveAspectRatio="xMidYMid slice"
  >
    {/* touchlines + halfway line */}
    <rect x="10" y="10" width="1030" height="660" />
    <line x1="525" y1="10" x2="525" y2="670" />
    {/* center circle + spot */}
    <circle cx="525" cy="340" r="92" />
    <circle cx="525" cy="340" r="5" fill="#1E1E1E" stroke="none" />
    {/* penalty + goal areas (both ends) */}
    <rect x="10" y="139" width="165" height="402" />
    <rect x="875" y="139" width="165" height="402" />
    <rect x="10" y="248" width="55" height="184" />
    <rect x="985" y="248" width="55" height="184" />
    {/* penalty spots + arcs */}
    <circle cx="120" cy="340" r="5" fill="#1E1E1E" stroke="none" />
    <circle cx="930" cy="340" r="5" fill="#1E1E1E" stroke="none" />
    <path d="M175 266.3 A92 92 0 0 1 175 413.7" />
    <path d="M875 413.7 A92 92 0 0 1 875 266.3" />
    {/* goals */}
    <rect x="-2" y="303" width="12" height="74" />
    <rect x="1040" y="303" width="12" height="74" />
  </svg>
);

export default function ProdeCard() {
  const [previewEntry, setPreviewEntry] = useState<HoverPreviewPoint | null>(null);

  return (
    <motion.a
      href="https://prode.io/en"
      target="_blank"
      rel="noopener noreferrer"
      className="group pixel-corners relative flex w-[78vw] max-w-[320px] shrink-0 snap-start flex-col items-start gap-8 overflow-hidden lg:w-full bg-[#1E1E1E]/[0.06] px-5 py-4 backdrop-blur-sm font-['Instrument_Sans',sans-serif] text-[#1E1E1E] transition-colors hover:bg-[#1E1E1E]/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E1E1E]"
      style={{ fontVariationSettings: "'wdth' 100" }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse")
          setPreviewEntry({ x: e.clientX, y: e.clientY });
      }}
      onPointerLeave={() => setPreviewEntry(null)}
    >
      {/* Faint soccer pitch (ink lines on cream), fading in from the left so the
          wordmark + tagline stay legible. Ambient weight to match the globe / map
          on the sibling cards. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.18] [mask-image:linear-gradient(to_right,transparent,#000_45%)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_45%)]">
        <SoccerField className="h-full w-full" />
      </div>

      {/* No status pill — the soccer pitch + trophy + tagline already read as
          "2026 World Cup", so prode skips the pill the other two cards carry. */}

      {/* Foreground content */}
      <img
        src="/prode-mark.svg"
        alt=""
        aria-hidden="true"
        // Trophy mark is a tall/narrow glyph (viewBox 34×81), so it needs more
        // height than the other cards' marks to carry comparable visual weight.
        className="relative z-10 shrink-0 h-[40px] w-auto"
      />
      <div className="relative z-10 flex flex-col gap-0.5">
        <div className="text-[14px] font-semibold leading-tight">prode</div>
        <p className="max-w-[185px] text-balance text-[12px] leading-snug text-[#1E1E1E]/60">
          predict every match of the 2026 world cup with friends.
        </p>
      </div>

      {/* Cursor-following preview (desktop mouse only) — prode's OG card.
          Portals to <body>, so it floats above the card; flips to the left of the
          cursor near the right edge. */}
      <HoverVideoPreview
        entry={previewEntry}
        image="/work/prode-og.jpg"
        label="prode.io"
      />
    </motion.a>
  );
}
