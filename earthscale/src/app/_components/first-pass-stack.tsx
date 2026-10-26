import delta from "@/assets/process/first/delta.webp";
import band from "@/assets/process/first/fields-band.webp";
import fields from "@/assets/process/first/fields.webp";
import pivots from "@/assets/process/first/pivots.webp";
import Image from "next/image";
import { cn } from "./cn";

/* The hero's maps (the group 10:1491), stacked as the file stacks them,
 * one per data set: the river and its fields, the irrigation circles, the
 * delta in false colour, and the river and fields again as one band of
 * data (scripts/make-first-pass.py). Switching a set on wipes the front map
 * off under a scan line while the others move up the stack. The fields
 * carry the four parcels marked on them. */
const MAPS = [fields, pivots, delta, band];
// A sheet is 1280 of the frame's 1440 px.
const SIZES = "(min-width: 1376px) 1152px, 89vw";

// The places in the stack, front to back: the file's three sheets, each
// 20 or 22 px right of and 30 px under the one before, then one hidden.
const PLACE = [
  "z-30 translate-x-0 translate-y-0",
  "z-20 translate-x-[20px] translate-y-[30px]",
  "z-10 translate-x-[42px] translate-y-[60px]",
  "z-0 translate-x-[42px] translate-y-[60px] opacity-0 transition-none",
];
const MOVE = "transition-[translate,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]";
const WIPE = "z-40 animate-[es-wipe_1100ms_cubic-bezier(0.65,0,0.35,1)_forwards]";

// The fields marked on the map (the file's vectors 10:1500 to 10:1503), in
// the sheet's px: half filled, a line round them and a glow outside it.
const PARCELS = [
  { d: "M912.5 110.65H945.5V257.31H840.5V190.5Z", color: "#60ff75" },
  { d: "M841.52 262.49H1046.02V407.02L871.52 409.49H838.02Z", color: "#60dfff" },
  { d: "M991.53 474.69L983.03 522.71H972.53L958.03 563.94H833.53L838.53 417.28L1014.53 413.63L1007.03 451.73Z", color: "#f2ff60" },
  { d: "M1192 556.19L1197.5 494.09L1083 488.35L1059 520.18V556.19Z", color: "#ff60d7" },
];

const Parcels = ({ drawn, picked }: { drawn: boolean; picked: boolean }) => (
  <svg viewBox="0 0 1280 679" aria-hidden className="absolute inset-0 size-full overflow-visible">
    <defs>
      {PARCELS.map(({ color }) => (
        <filter key={color} id={`fp-glow-${color.slice(1)}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur" />
          <feComposite in="blur" in2="SourceAlpha" operator="out" result="out" />
          <feFlood floodColor={color} />
          <feComposite in2="out" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      ))}
    </defs>
    {PARCELS.map(({ d, color }, i) => (
      <path
        key={color}
        d={d}
        fill={color}
        stroke={color}
        strokeWidth={2}
        pathLength={1}
        strokeDasharray="1"
        filter={`url(#fp-glow-${color.slice(1)})`}
        style={{ transitionDelay: drawn ? `${i * 160}ms, ${i * 160 + 450}ms` : "0ms" }}
        className={cn(
          drawn ? "[fill-opacity:0.5] [stroke-dashoffset:0] transition-[stroke-dashoffset,fill-opacity] duration-[900ms,600ms] ease-out" : "[fill-opacity:0] [stroke-dashoffset:1]",
          picked && i === 0 && "animate-[es-flash_800ms_ease-out]",
        )}
      />
    ))}
  </svg>
);

export const Stack = ({ layer, from, parcels, picked }: { layer: number; from?: number; parcels: boolean; picked: boolean }) => (
  <div className="absolute top-[598px] left-20 isolate h-[679px] w-[1280px]">
    {MAPS.map((src, i) => {
      const place = (i - layer + MAPS.length) % MAPS.length;
      const leaving = i === from;
      return (
        <div key={i} className={cn("absolute inset-0 overflow-hidden", leaving ? WIPE : cn(MOVE, PLACE[place]))}>
          <Image src={src} alt="" sizes={SIZES} placeholder="blur" className="size-full object-cover" />
          {i === 0 ? <Parcels drawn={parcels} picked={picked} /> : null}
          <span className={cn("absolute inset-y-0 right-0 w-[22px] bg-linear-to-r from-[#020d06] to-transparent transition-opacity duration-500", place === 0 || leaving ? "opacity-0" : "opacity-100")} />
        </div>
      );
    })}
    {from === undefined ? null : (
      <span key={from} className="absolute inset-y-0 z-50 w-[3px] -translate-x-1/2 bg-mint shadow-[0_0_28px_8px_rgba(160,255,215,0.55)] animate-[es-scan-x_1100ms_cubic-bezier(0.65,0,0.35,1)_forwards]" />
    )}
  </div>
);
