import { motion } from "motion/react";
import { useState } from "react";
import { HoverVideoPreview, type HoverPreviewPoint } from "./HoverVideoPreview";

// Saboteurs — squad stealth game for iPhone (saboteurs.app). Same chrome as the
// Globestudio + curb cards (pixel-corners, cream-tint, ink monochrome, status
// pill, foreground mark + wordmark + tagline). Foreground mark is the commando
// dagger from the app icon, drawn in ink (public/saboteurs-mark.svg); the
// ambient background is Operation Breakwater's recon map (public/saboteurs-map.svg),
// generated from the game's level data in its own map symbols: the wire, the
// buildings, the informant's cell, the guards and their sight cones — the
// analog to globestudio's globe / curb's street map.

export default function SaboteursCard() {
  const [previewEntry, setPreviewEntry] = useState<HoverPreviewPoint | null>(null);

  return (
    <motion.a
      href="https://saboteurs.app/"
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
      {/* Breakwater recon map (ink on cream), fading in from the left so the
          wordmark + tagline stay legible. Ambient weight to match the globe / map
          on the sibling cards. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.22] [mask-image:linear-gradient(to_right,transparent,#000_45%)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_45%)]">
        <img
          src="/saboteurs-map.svg"
          alt=""
          aria-hidden="true"
          // object-right keeps the cell and the tower's searchlight in view on
          // narrow phone cards; the left-fade mask hides that side anyway.
          className="h-full w-full object-cover object-right"
        />
      </div>

      {/* "IN BETA" pill — top-right corner */}
      <span className="pixel-corners-sm absolute right-4 top-4 z-20 bg-[#1E1E1E] px-[5px] py-[3px] text-[8px] font-bold uppercase leading-none tracking-[0.14em] text-[#dedbd1]">
        in beta
      </span>

      {/* Foreground content */}
      <img
        src="/saboteurs-mark.svg"
        alt=""
        aria-hidden="true"
        // Dagger mark is a tall/narrow glyph (viewBox 24×80), so it needs more
        // height than the other cards' marks to carry comparable visual weight.
        className="relative z-10 shrink-0 h-[40px] w-auto"
      />
      <div className="relative z-10 flex flex-col gap-0.5">
        <div className="text-[14px] font-semibold leading-tight">saboteurs</div>
        <p className="max-w-[185px] text-balance text-[12px] leading-snug text-[#1E1E1E]/60">
          squad stealth for iphone — read the patrols, get out unseen.
        </p>
      </div>

      {/* Cursor-following preview (desktop mouse only) — a loop cut from the
          trailer. Portals to <body>, so it floats above the card; flips to the
          left of the cursor near the right edge. */}
      <HoverVideoPreview
        entry={previewEntry}
        videoSrc="/work/saboteurs-preview.mp4"
        poster="/work/saboteurs-preview-poster.jpg"
        label="saboteurs.app"
      />
    </motion.a>
  );
}
