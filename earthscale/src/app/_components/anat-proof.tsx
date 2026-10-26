"use client";

import { useRef } from "react";
import { cn } from "./cn";
import { LOGOS } from "./page-paths";
import { useLoop } from "./use-loop";

/* The proof's pieces: the logos lit one after another, then settling as the
 * file has them, Pachama bright and the other two at 30%; and the quote
 * arriving word by word over its name and role. */

// All dim, each lit in turn, then as the file has them.
const LOGO_STEPS = [900, 1000, 1000, 1000, 2800] as const;
const LOGO_W = ["w-[30%]", "w-[22%]", "w-[20%]"];

export const LogosRow = () => {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, LOGO_STEPS);

  return (
    <div ref={ref}>
      <p className="font-sans text-[15px] leading-[1.4] text-mint">Powering leading Earth Intelligence companies, hear it from them:</p>
      <ul className="mt-6 flex items-center justify-between gap-4" aria-label="Pachama, Linear and Vercel">
        {LOGOS.map(({ name, viewBox, d, ...rest }, i) => {
          const fillRule = "fillRule" in rest ? rest.fillRule : undefined;
          const lit = step === i + 1 || (step === 4 && i === 0);
          const asFile = step === 4 && i > 0;
          return (
            <li key={name} className={LOGO_W[i]}>
              <svg viewBox={viewBox} aria-hidden className={cn("h-auto w-full text-mist transition-opacity duration-500", lit ? "opacity-100" : asFile ? "opacity-30" : "opacity-15")}>
                <path d={d} fill="currentColor" fillRule={fillRule} clipRule={fillRule} />
              </svg>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

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
