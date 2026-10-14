"use client";

/* eslint-disable @next/next/no-img-element -- the brand book's own drawings, as SVG */
import { useEffect, useState } from "react";
import { cn } from "./cn";
import { PAGE } from "./story";
import { useInView } from "./use-in-view";

/* The six margin doodles as the brand book names them (p. 22), drawn out of
 * the book at their relative sizes. They move the way the book says they
 * may: "it boils as it arrives, then holds still" — a turbulence seed
 * displacing the line for a moment when the set comes into view, then
 * nothing. Never for reduced motion. */
const DOODLES = [
  { file: "overthinker", name: "The overthinker", width: "w-[94px] sm:w-[117px]" },
  { file: "reader", name: "The reader", width: "w-[94px] sm:w-[117px]" },
  { file: "loop", name: "The loop", width: "w-[101px] sm:w-[126px]" },
  { file: "listener", name: "The listener", width: "w-[110px] sm:w-[138px]" },
  { file: "nudge", name: "The nudge", width: "w-[78px] sm:w-[98px]" },
  { file: "bloom", name: "The bloom", width: "w-[45px] sm:w-[56px]" },
] as const;

export const Doodles = ({ className }: { className?: string }) => {
  const [ref, inView] = useInView<HTMLUListElement>(0.4);
  const [boiling, setBoiling] = useState(false);

  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = window.setTimeout(() => setBoiling(true), 0);
    const settle = window.setTimeout(() => setBoiling(false), 1600);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(settle);
    };
  }, [inView]);

  return (
    <div className={cn(PAGE, className)}>
      <svg aria-hidden className="absolute h-0 w-0">
        <filter id="doodle-boil" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={1}>
            <animate attributeName="seed" values="1;2;3;4" dur="0.36s" repeatCount="indefinite" calcMode="discrete" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale={5} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <p className="type-label text-pen">The six margin doodles</p>
      <ul ref={ref} className="mt-10 grid grid-cols-3 gap-x-6 gap-y-14 lg:grid-cols-6">
        {DOODLES.map((d) => (
          <li key={d.file} className="flex flex-col items-center">
            <div className="flex h-[112px] items-end justify-center sm:h-[140px]">
              <img
                src={`/doodles-book/${d.file}.svg`}
                alt={`${d.name}: a spot drawing in one blue line.`}
                className={cn("mark-multiply h-auto", d.width, boiling && "[filter:url(#doodle-boil)]")}
              />
            </div>
            <p className="mt-4 font-mono text-[11px] whitespace-nowrap text-body sm:text-[12px]">{d.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
