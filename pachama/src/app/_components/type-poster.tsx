"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "./cn";

/* How&How's type poster, "While trees may be temporary, forests stand the
 * test of time.", set live in Chromatic Condensed and run as a nine-second
 * loop while it's on screen: the lines rise out of their baselines one
 * after another, "temporary" fades away letter by letter and comes back,
 * TIME. keeps its glacier-to-lidar gradient flowing, then the lines leave
 * upward and it starts again. Each time it comes into view the loop starts
 * from the top. Sizes follow the poster's frame (1494 x 1700), so it
 * scales with its column. With less motion it simply shows. */
const LINES = ["While trees", "may be", "temporary,", "forests stand", "the test of"];
// Literal classes for Tailwind: each line a beat after the last.
const DELAYS = ["[animation-delay:0ms]", "[animation-delay:110ms]", "[animation-delay:220ms]", "[animation-delay:330ms]", "[animation-delay:440ms]", "[animation-delay:560ms]"];
const RISE = "block group-data-run/poster:animate-[poster-line_9s_cubic-bezier(0.16,1,0.3,1)_infinite_both]";
// "temporary," a letter at a time, each a beat after the last.
const TEMPORARY = "temporary,".split("");
const LETTER_DELAYS = [
  "[animation-delay:0ms]",
  "[animation-delay:70ms]",
  "[animation-delay:140ms]",
  "[animation-delay:210ms]",
  "[animation-delay:280ms]",
  "[animation-delay:350ms]",
  "[animation-delay:420ms]",
  "[animation-delay:490ms]",
  "[animation-delay:560ms]",
  "[animation-delay:630ms]",
];

export const TypePoster = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLElement>(null);
  const [run, setRun] = useState(false);

  // Runs only while most of it is in view, so it starts from the top each
  // time it's reached; still, it reads in full.
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => setRun(entry.intersectionRatio >= 0.5), { threshold: [0, 0.5] });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      data-run={run || undefined}
      className={cn("group/poster @container relative flex aspect-[1494/1700] flex-col items-center overflow-hidden rounded-[10px] bg-[#fdfbf1] text-center text-[#102518]", className)}
    >
      <p className="mt-[13.4cqw] font-display text-[13.9cqw] leading-[0.89] font-bold uppercase">
        {LINES.map((text, i) => (
          <span key={text} className="block overflow-hidden pt-[0.06em]">
            {text === "temporary," ? (
              <span className={cn(RISE, DELAYS[i])}>
                <span className="sr-only">{text}</span>
                <span aria-hidden>
                  {TEMPORARY.map((letter, k) => (
                    <span key={k} className={cn("inline-block group-data-run/poster:animate-[poster-fade_9s_ease-in-out_infinite_both]", LETTER_DELAYS[k])}>
                      {letter}
                    </span>
                  ))}
                </span>
              </span>
            ) : (
              <span className={cn(RISE, DELAYS[i])}>{text}</span>
            )}
          </span>
        ))}
        <span className="block overflow-hidden pt-[0.06em]">
          <span className={cn(RISE, DELAYS[5])}>
            <span className="bg-[linear-gradient(to_bottom,#84e1ff,#81f18e,#f9e63f,#81f18e,#84e1ff)] bg-[length:100%_400%] bg-clip-text text-transparent motion-safe:animate-[flow_3.2s_ease-in-out_infinite_alternate]">Time.</span>
          </span>
        </span>
      </p>
      <figcaption className="mt-auto mb-[7cqw] max-w-[44cqw] text-[1.95cqw] leading-[1.3] group-data-run/poster:animate-[poster-caption_9s_ease-out_infinite_both]">
        Supporting a living, breathing ecosystem is a critical climate solution.
      </figcaption>
    </figure>
  );
};
