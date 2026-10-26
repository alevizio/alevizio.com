"use client";

import { useRef } from "react";
import { cn } from "./cn";
import { Cta } from "./ui";
import { useLoop } from "./use-loop";

/* The ask: the closing line arriving word by word over two lines, and the
 * one button under it, its glow breathing as the planet's does. */
const LINES = [
  ["Bring", "Earth", "Intelligence", "to", "life"],
  ["start", "building", "with", "Earthscale", "today."],
];
// Gone, then in and held: it rests in.
const STEPS = [900, 6000] as const;
const RISE = "transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

export const AskLine = () => {
  const ref = useRef<HTMLDivElement>(null);
  const on = useLoop(ref, STEPS) === 1;
  const state = on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0";

  return (
    <div ref={ref} className="relative grid justify-items-center gap-8 overflow-hidden rounded-[8px] px-4 pt-6 pb-16 text-center">
      <span aria-hidden className="absolute inset-x-[-10%] -bottom-1/2 h-full rounded-[50%] bg-[radial-gradient(closest-side,rgb(43_255_115/0.22),rgb(43_255_115/0)_70%)] motion-safe:animate-[es-breathe_5s_ease-in-out_infinite]" />
      <p className="relative font-sans text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.2] tracking-[-0.02em] text-mist">
        {LINES.map((line, l) => (
          <span key={l} className="block">
            {line.map((w, j) => (
              <span key={w} className={cn("inline-block", RISE, state)} style={{ transitionDelay: on ? `${(l * LINES[0].length + j) * 70}ms` : "0ms" }}>
                {w}&nbsp;
              </span>
            ))}
          </span>
        ))}
      </p>
      <span className={cn("relative rounded-full", RISE, state)} style={{ transitionDelay: on ? "800ms" : "0ms" }}>
        <Cta className="motion-safe:animate-[es-glow_3.2s_ease-in-out_infinite]" />
      </span>
    </div>
  );
};
