"use client";

import study1 from "@/assets/studies/01.webp";
import study5 from "@/assets/studies/05.webp";
import study6 from "@/assets/studies/06.webp";
import Image from "next/image";
import { useRef } from "react";
import { cn } from "./cn";
import { useLoop } from "./use-loop";

/* The map with the other datasets behind it, edge on, as the page stacks
 * them: here the stack fans out and closes, and the top map changes from
 * wind to temperature and back. */
const SHEETS = [
  { src: study1, at: ["translate-x-[12px] translate-y-[12px]", "translate-x-[44px] translate-y-[40px]"] },
  { src: study6, at: ["translate-x-[6px] translate-y-[6px]", "translate-x-[22px] translate-y-[20px]"] },
];
// Tight, fanned.
const STEPS = [2200, 3000] as const;
const MOVE = "transition-[translate,opacity] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

export const MapStack = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const fanned = useLoop(ref, STEPS) === 1;

  return (
    <div ref={ref} className={cn("relative pr-12 pb-11", className)}>
      <div className="relative aspect-[16/9]">
        {SHEETS.map(({ src, at }, i) => (
          <div key={i} className={cn("absolute inset-0 overflow-hidden rounded-[10px] ring-1 ring-mist/20", MOVE, at[fanned ? 1 : 0], fanned ? "opacity-90" : "opacity-60")}>
            <Image src={src} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="h-full w-full object-cover" />
            <span className="absolute inset-0 bg-night/45" />
          </div>
        ))}
        <div className="absolute inset-0 overflow-hidden rounded-[10px] shadow-[0_24px_60px_rgba(0,0,0,0.5)] ring-1 ring-mist/25">
          <Image src={study5} alt="The world under a wind field, with two more datasets stacked behind it" sizes="(min-width: 1024px) 50vw, 100vw" className="h-full w-full object-cover" />
          <Image src={study6} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms]", fanned ? "opacity-100" : "opacity-0")} />
        </div>
      </div>
    </div>
  );
};
