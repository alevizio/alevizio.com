"use client";

import { useRef } from "react";
import { cn } from "./cn";
import { ICON_ORGS, ICON_TEAMS } from "./page-paths";
import { useLoop } from "./use-loop";

/* The who section's two cards building themselves: the lines draw, the
 * cross turns in at the corner, the icons draw, the words come in. */

const CARDS = [
  { tag: "For teams", title: "Teams building with geospatial data.", text: "Spin up high-performance services for raster & vector data in minutes.", icon: ICON_TEAMS },
  { tag: "For organizations", title: "Organizations pioneering Earth Intelligence.", text: "Accelerate R&D, streamline deployment, and reduce overhead.", icon: ICON_ORGS },
];
// Gone, the lines draw, the icons and the words come in, held.
const CARD_STEPS = [700, 1300, 1500, 3600] as const;
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const Icon = ({ paths, on, delay }: { paths: readonly string[]; on: boolean; delay: number }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6 text-mint">
    {paths.map((d, i) => (
      <path
        key={i}
        d={d}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={on ? 0 : 1}
        className="transition-[stroke-dashoffset] duration-700 ease-out"
        style={{ transitionDelay: on ? `${delay + i * 160}ms` : "0ms" }}
      />
    ))}
  </svg>
);

export const WhoCards = () => {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, CARD_STEPS);
  const lines = step >= 1;
  const words = step >= 2;
  const gone = step === 0;

  return (
    <div ref={ref} className={cn("relative grid transition-opacity duration-500 sm:grid-cols-2", gone ? "opacity-0" : "opacity-100")}>
      {/* The lines: along the top, then down the sides and the middle, open at the foot. */}
      <span className={cn("absolute inset-x-0 top-0 h-px origin-left bg-mist/35 transition-[scale] duration-700", EASE, lines ? "scale-x-100" : "scale-x-0")} />
      {["left-0", "left-1/2 max-sm:hidden", "right-0"].map((at, i) => (
        <span
          key={at}
          className={cn("absolute top-0 bottom-0 w-px origin-top bg-linear-to-b from-mist/35 to-mist/0 transition-[scale] duration-700", EASE, at, lines ? "scale-y-100" : "scale-y-0")}
          style={{ transitionDelay: lines ? `${450 + i * 120}ms` : "0ms" }}
        />
      ))}
      {/* The cross where the top line meets the right side. */}
      <svg
        viewBox="0 0 32 32"
        aria-hidden
        className={cn("absolute -top-4 -right-4 size-8 text-mist transition-[rotate,opacity] duration-700", EASE, lines ? "rotate-0 opacity-100" : "-rotate-90 opacity-0")}
        style={{ transitionDelay: lines ? "700ms" : "0ms" }}
      >
        <path d="M15.5 32V0M0 15.5H32" stroke="currentColor" />
      </svg>
      {CARDS.map(({ tag, title, text, icon }, i) => (
        <div key={tag} className={cn("grid content-start gap-5 px-5 pt-8 pb-6", i === 1 && "max-sm:border-t max-sm:border-mist/20")}>
          <Icon paths={icon} on={words} delay={i * 200} />
          <span
            className={cn("inline-flex h-[30px] items-center justify-self-start rounded-full border border-mist/30 px-4 font-mono text-[12px] leading-none text-mist uppercase transition-[opacity,translate] duration-700", EASE, words ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")}
            style={{ transitionDelay: words ? `${200 + i * 200}ms` : "0ms" }}
          >
            {tag}
          </span>
          <span className={cn("grid gap-2 transition-[opacity,translate] duration-700", EASE, words ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")} style={{ transitionDelay: words ? `${380 + i * 200}ms` : "0ms" }}>
            <span className="font-sans text-[19px] leading-[1.3] tracking-[-0.02em] text-mint">{title}</span>
            <span className="font-sans text-[14px] leading-[1.4] text-[#ededed]">{text}</span>
          </span>
        </div>
      ))}
    </div>
  );
};
