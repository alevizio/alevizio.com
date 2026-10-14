import { motion } from "motion/react";
import { useState } from "react";
import { HoverVideoPreview, type HoverPreviewPoint } from "./HoverVideoPreview";

// Saboteurs — squad stealth game for iPhone (saboteurs.app). Same chrome as the
// Globestudio + curb cards (pixel-corners, cream-tint, ink monochrome, status
// pill, foreground mark + wordmark + tagline). Foreground mark is the commando
// dagger from the app icon, drawn in ink (public/saboteurs-mark.svg); the
// ambient background is a top-down compound with guards on patrol — the analog
// to globestudio's globe / curb's street map, nodding to the game's mission map.

// Top-down compound drawn in ink lines: fenced perimeter, buildings, a patrol
// route, two guards with vision cones, and the squad waiting outside the wire.
// Sized to cover and bleed off the card's right edge (the parent layer handles
// opacity + the left-fade).
const CompoundMap = ({ className }: { className?: string }) => (
  <svg
    className={className}
    // Padded viewBox (compound sits in 0 0 1050 680) zooms the map out so the
    // whole perimeter shows while still bleeding off the card's right edge.
    viewBox="-260 -90 1310 860"
    fill="none"
    stroke="#1E1E1E"
    strokeWidth={3}
    aria-hidden="true"
    preserveAspectRatio="xMidYMid slice"
  >
    {/* access road in to the gate */}
    <line x1="-260" y1="315" x2="380" y2="315" />
    <line x1="-260" y1="345" x2="380" y2="345" />
    {/* perimeter fence */}
    <rect x="380" y="90" width="600" height="500" strokeDasharray="14 10" />
    {/* barracks + depot, with roof ridges */}
    <rect x="440" y="140" width="200" height="120" />
    <line x1="440" y1="200" x2="640" y2="200" />
    <rect x="720" y="150" width="180" height="90" />
    <line x1="720" y1="195" x2="900" y2="195" />
    {/* walled yard + holding cell */}
    <rect x="700" y="380" width="220" height="160" />
    <rect x="740" y="420" width="90" height="70" />
    {/* watchtower */}
    <rect x="925" y="535" width="50" height="50" />
    <path d="M925 535L975 585M975 535L925 585" />
    {/* patrol route */}
    <path d="M520 320H660V470H570Z" strokeDasharray="4 12" />
    {/* guards + vision cones */}
    <path d="M660 320L790 262A142 142 0 0 1 790 378Z" fill="#1E1E1E" fillOpacity={0.35} stroke="none" />
    <circle cx="660" cy="320" r="8" fill="#1E1E1E" stroke="none" />
    <path d="M950 290L905 400A118 118 0 0 0 995 400Z" fill="#1E1E1E" fillOpacity={0.35} stroke="none" />
    <circle cx="950" cy="290" r="8" fill="#1E1E1E" stroke="none" />
    {/* the squad, outside the wire */}
    <circle cx="575" cy="655" r="8" />
    <circle cx="605" cy="632" r="8" />
    <circle cx="635" cy="652" r="8" />
  </svg>
);

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
      {/* Faint compound map (ink lines on cream), fading in from the left so the
          wordmark + tagline stay legible. Ambient weight to match the globe / map
          on the sibling cards. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.18] [mask-image:linear-gradient(to_right,transparent,#000_45%)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_45%)]">
        <CompoundMap className="h-full w-full" />
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
