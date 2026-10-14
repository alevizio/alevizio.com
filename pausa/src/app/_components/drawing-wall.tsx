"use client";

import { cn } from "./cn";
import { useInView } from "./use-in-view";

/* All 47 drawings from the brand kit, as they were drawn: black pen on
 * paper. The wall is marked up the way Pausa marks a page: the knot that
 * won is circled in blue, the heads that carried it are struck out. Each
 * drawing loses its outer 3%, where slivers of the box it was drawn in
 * survived the tracing. */
const FAMILIES = [
  { name: "overthinking", count: 12 },
  { name: "sk", ids: [1, 2, 4, 6, 7, 10, 12, 13, 16, 18, 21, 22, 23, 24, 25, 32, 34] },
  { name: "bird", count: 8 },
  { name: "coffee", count: 7 },
  { name: "selfcare", count: 3 },
] as const;

const DRAWINGS = FAMILIES.flatMap((f) =>
  "ids" in f
    ? f.ids.map((n) => `${f.name}-${n}`)
    : Array.from({ length: f.count }, (_, i) => `${f.name}-${i + 1}`),
);

const CHOSEN = "overthinking-5";
const RETIRED = new Set(["overthinking-3", "overthinking-4", "overthinking-12"]);

export const DrawingWall = ({ className }: { className?: string }) => {
  const [ref, drawn] = useInView<HTMLDivElement>(0.25);
  return (
    <div
      ref={ref}
      role="img"
      aria-label="All 47 drawings from the brand kit. The tangle that became the mark is circled in blue; the heads it beat are struck out."
      className={cn("grid grid-cols-4 gap-x-4 gap-y-6 sm:grid-cols-6 lg:grid-cols-8 lg:gap-x-8 lg:gap-y-10", className)}
    >
      {DRAWINGS.map((name) => (
        <div key={name} className="relative aspect-square">
          {/* eslint-disable-next-line @next/next/no-img-element -- small vector tiles */}
          <img
            src={`/marks/${name}.svg`}
            alt=""
            loading="lazy"
            className={cn("h-full w-full mix-blend-multiply [clip-path:inset(3%)]", RETIRED.has(name) && "opacity-40")}
          />
          {name === CHOSEN ? (
            // eslint-disable-next-line @next/next/no-img-element -- the blue circle round the pick
            <img
              aria-hidden
              alt=""
              src="/pausa-co/mark-tradition.svg"
              data-drawn={drawn}
              className="mark-wipe mark-multiply pointer-events-none absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] max-w-none"
            />
          ) : null}
          {RETIRED.has(name) ? (
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)]"
              fill="none"
            >
              <path
                d="M8 92 L92 8"
                pathLength={1}
                data-drawn={drawn}
                className="pen-stroke stroke-pen"
                strokeWidth={2}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          ) : null}
        </div>
      ))}
    </div>
  );
};
