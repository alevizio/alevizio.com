import { motion } from "motion/react";
import { useState } from "react";
import { HoverVideoPreview, type HoverPreviewPoint } from "./HoverVideoPreview";

// Hora Cero — stealth & rescue in Buenos Aires, 1958 (horacero.app, its public
// "coming soon" page; the private preview stays unlisted). A slim line under
// the saboteurs card rather than a fourth full card: the same chrome
// (pixel-corners, cream-tint, ink monochrome, status pill), with the mark and
// the name side by side. Below lg it is a narrow tile at the end of the swipe
// row. The mark is horacero.app's icon, a clock at zero hour, drawn in ink
// (public/horacero-mark.svg); the background is the Casa Rosada's front
// (public/horacero-facade.svg), the analog to the other cards' maps.
export default function HoraCeroCard() {
  const [previewEntry, setPreviewEntry] = useState<HoverPreviewPoint | null>(null);

  return (
    <motion.a
      href="https://horacero.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="pixel-corners relative flex w-[46vw] max-w-[200px] shrink-0 snap-start flex-col items-start justify-between gap-4 overflow-hidden bg-[#1E1E1E]/[0.06] px-5 py-4 backdrop-blur-sm font-['Instrument_Sans',sans-serif] [font-variation-settings:'wdth'_100] text-[#1E1E1E] transition-colors hover:bg-[#1E1E1E]/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E1E1E] lg:w-full lg:max-w-none lg:flex-row lg:items-center lg:justify-start lg:gap-3 lg:py-3 lg:pr-24"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 2.05, ease: [0.22, 1, 0.36, 1] }}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse")
          setPreviewEntry({ x: e.clientX, y: e.clientY });
      }}
      onPointerLeave={() => setPreviewEntry(null)}
    >
      {/* The Casa Rosada's front in ink (drawn after the game's render of it):
          the balustrade, three storeys of windows, the gate between paired
          columns, globe lamps and falling snow. Fades in from the left like
          the sibling cards' maps; object-center keeps the gate in the phone
          tile. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.22] [mask-image:linear-gradient(to_right,transparent,#000_45%)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_45%)]">
        <img
          src="/horacero-facade.svg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* "COMING SOON" pill — top-right corner; centred on the line at lg */}
      <span className="pixel-corners-sm absolute right-4 top-4 z-20 bg-[#1E1E1E] px-[5px] py-[3px] text-[8px] font-bold uppercase leading-none tracking-[0.14em] text-[#dedbd1] lg:top-1/2 lg:-translate-y-1/2">
        coming soon
      </span>

      <img
        src="/horacero-mark.svg"
        alt=""
        aria-hidden="true"
        className="relative z-10 h-[22px] w-auto shrink-0 lg:h-[18px]"
      />
      <div className="relative z-10 flex flex-col gap-0.5 whitespace-nowrap">
        <div className="text-[14px] font-semibold leading-tight">hora cero</div>
        <p className="text-[12px] leading-snug text-[#1E1E1E]/70">buenos aires, 1958</p>
      </div>

      {/* Cursor-following preview (desktop mouse only) — horacero.app's link
          card, the Casa Rosada in the snow. Portals to <body>, so it floats
          above the card. */}
      <HoverVideoPreview
        entry={previewEntry}
        image="/work/horacero-og.jpg"
        label="horacero.app"
      />
    </motion.a>
  );
}
