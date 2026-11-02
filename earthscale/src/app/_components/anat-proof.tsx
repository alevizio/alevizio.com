"use client";

import { useRef } from "react";
import { cn } from "./cn";
import { useLoop } from "./use-loop";

/* The proof's quote, arriving word by word over its name and role. */

const QUOTE = "Earthscale gave us the building blocks to turn satellite imagery into real-time insights.".split(" ");
// Gone, then in and held: it rests in.
const QUOTE_STEPS = [900, 6400] as const;

export const Quote = () => {
  const ref = useRef<HTMLDivElement>(null);
  const on = useLoop(ref, QUOTE_STEPS) === 1;
  const rise = cn("transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]", on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0");

  return (
    <figure ref={ref}>
      <blockquote className="font-sans text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.4] tracking-[-0.02em] text-mist">
        {QUOTE.map((word, i) => (
          <span key={i} className={cn("inline-block", rise)} style={{ transitionDelay: on ? `${i * 55}ms` : "0ms" }}>
            {i === 0 ? "“" : null}
            {word}
            {i === QUOTE.length - 1 ? "”" : null}&nbsp;
          </span>
        ))}
      </blockquote>
      <figcaption className={cn("mt-6", rise)} style={{ transitionDelay: on ? `${QUOTE.length * 55 + 200}ms` : "0ms" }}>
        <span className="block font-sans text-[16px] leading-[1.4] text-mist">Diego Saez Gil</span>
        <span className="block font-mono text-[13px] text-dim">Founder and CEO, Pachama</span>
      </figcaption>
    </figure>
  );
};
