"use client";

import { useRef } from "react";
import { cn } from "./cn";
import { useLoop } from "./use-loop";

/* The serve section's three features, as the page numbers them: each lit
 * in turn while a line runs down beside it, then all three together. */
const FEATURES = [
  { n: "01", title: "High-Performance Tile Serving", text: "Optimize your data for low latency tile-serving at scale, right where it lives." },
  { n: "02", title: "Zero Copy, Optimized in Minutes", text: "Connect your geospatial data sources for high-performance serving in seconds." },
  { n: "03", title: "Seamless Integration via API & Python Client", text: "Register and query datasets programmatically through a robust API or Python client." },
];
const HOLD = 2600;
// Each in turn, then all three: it rests with all three lit.
const STEPS = [HOLD, HOLD, HOLD, 1800] as const;

export const FeatureList = () => {
  const ref = useRef<HTMLOListElement>(null);
  const step = useLoop(ref, STEPS);

  return (
    <ol ref={ref} className="grid">
      {FEATURES.map(({ n, title, text }, i) => {
        const lit = step === i || step === 3;
        const running = step === i;
        return (
          <li key={n} className="relative border-t border-mist/15 py-5 pl-5 first:border-t-0 first:pt-0 last:pb-0">
            <span className="absolute top-0 bottom-0 left-0 w-px bg-mist/15" />
            <span
              className={cn("absolute top-0 bottom-0 left-0 w-px origin-top bg-mint transition-[scale] ease-linear", running ? "scale-y-100" : "scale-y-0")}
              style={{ transitionDuration: running ? `${HOLD}ms` : "300ms" }}
            />
            <p className={cn("font-mono text-[12px] leading-none transition-colors duration-500", lit ? "text-mint" : "text-haze")}>{n}</p>
            <p className={cn("mt-3 font-sans text-[18px] leading-[1.35] tracking-[-0.01em] transition-colors duration-500", lit ? "text-mint" : "text-mist/40")}>{title}</p>
            <p className={cn("type-caption mt-1.5 transition-colors duration-500", lit ? "text-text" : "text-text/40")}>{text}</p>
          </li>
        );
      })}
    </ol>
  );
};
