"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "./cn";
import { MARK, MARK_IN_WORDMARK, MARK_VIEWBOX, WORDMARK_LETTERS, WORDMARK_VIEWBOX } from "./wordmark-paths";

/* The wordmark, its mark built the way it is drawn. The mark is one ring at
 * three angles: the same ellipse, turned about 38 degrees each way about a
 * point near the left, where the three meet. So it draws as one ring with a
 * light at its head, two copies turn out of it into place, and once they
 * rest the file's own outlines take over, with the gaps where one ring
 * passes under another. The name rises in, a light runs once round each
 * ring, and it all folds back to start again. With less motion asked for,
 * it is the file's wordmark, still. With markOnly it is the mark alone,
 * built the same way, for a small place like an icon. With still it is the
 * file's wordmark, still, for a place that comes in all at once. */

type Ring = { c: readonly [number, number]; a: number; b: number; ang: number; w: number; pivot: readonly [number, number]; turn: number };
// Each ring's centre line, fitted to the file's outlines in mark.svg's units,
// in MARK's order, and how far it turns, about its pivot, from where the
// level ring lies.
const RINGS: Ring[] = [
  { c: [10.238, 18.3], a: 10.733, b: 5.921, ang: 37.297, w: 1.801, pivot: [4.602, 13.083], turn: 37.93 },
  { c: [12.255, 13.734], a: 10.881, b: 5.833, ang: -0.63, w: 1.844, pivot: [12.255, 13.734], turn: 0 },
  { c: [10.096, 9.066], a: 10.755, b: 5.867, ang: -38.82, w: 1.907, pivot: [4.433, 14.519], turn: -38.19 },
];
const LEVEL = 1;
// A ring's centre line, from its left end, over the top and round.
const line = ({ a, b }: Ring) => `M${-a} 0A${a} ${b} 0 1 1 ${a} 0A${a} ${b} 0 1 1 ${-a} 0`;
const rad = (deg: number) => (deg * Math.PI) / 180;
// Turned part of the way (s from 0, on the level ring, to 1, in place).
const pose = ({ c: [x, y], ang, pivot: [px, py], turn }: Ring, s: number) => {
  const back = rad(-turn);
  const sx = px + (x - px) * Math.cos(back) - (y - py) * Math.sin(back);
  const sy = py + (x - px) * Math.sin(back) + (y - py) * Math.cos(back);
  return `rotate(${s * turn} ${px} ${py}) translate(${sx} ${sy}) rotate(${ang - turn})`;
};
// Points along the level ring by length, so the light sits on the line's end.
const WALK = (() => {
  const { a, b } = RINGS[LEVEL];
  const pts = Array.from({ length: 257 }, (_, i) => [a * Math.cos(Math.PI + (i / 128) * Math.PI), b * Math.sin(Math.PI + (i / 128) * Math.PI)]);
  let len = 0;
  const walked = pts.map((p, i) => (len += i ? Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0));
  return pts.map((p, i) => ({ f: walked[i] / len, p }));
})();
// In the level ring's own frame: the light's group is posed on that ring.
const along = (f: number) => {
  const [x, y] = WALK.find((w) => w.f >= f)?.p ?? WALK[256].p;
  return `translate(${x} ${y})`;
};

const LOOP = 9200;
// Five clicks within this long, and the rings spin apart and back, the
// loop held meanwhile where the mark and the name are whole.
const CLICKS_MS = 1600;
const BURST_MS = 1800;
const BURST_AT = 6400;
// How far each ring flies out, toward its own side, as it spins.
const APART = [
  [-1.4, 3.7, 1],
  [0.2, 0.1, -1],
  [-1.5, -3.7, 1],
] as const;
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const from = (t: number, at: number, ms: number) => clamp((t - at) / ms);
const inOut = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
const out = (x: number) => 1 - (1 - x) ** 3;
// The copies swing a little past their place and settle into it.
const swing = (x: number) => 1 + 2.1 * (x - 1) ** 3 + 1.1 * (x - 1) ** 2;
// The light runs round the rings in turn: the upper, the level, the lower.
const GLINT_ORDER = [2, 1, 0];

type Parts = { rings: SVGElement[]; tints: SVGElement[]; motion: SVGElement; exact: SVGElement; glows: SVGElement[]; glints: SVGElement[]; comet: SVGElement; letters: SVGElement[] };
const set = (el: SVGElement, name: string, value: number | string) => el.setAttribute(name, String(value));

// One frame, t ms into the loop.
const paint = ({ rings, tints, motion, exact, glows, glints, comet, letters }: Parts, t: number) => {
  const head = inOut(from(t, 300, 1100));
  const tail = inOut(from(t, 8100, 800));
  const turn = t < 7300 ? swing(from(t, 1450, 1500)) : 1 - inOut(from(t, 7300, 800));
  const copies = t >= 1450 && t < 8100;
  const tint = t < 5000 ? 1 - from(t, 1900, 1000) : from(t, 7100, 500);
  // The file's outlines come in under the drawn rings, which fade off them,
  // so only the gaps where one ring passes under another open; going back,
  // the drawn rings cover them again before they turn.
  const drawn = t < 5000 ? 1 - from(t, 2950, 350) : from(t, 7100, 200);
  RINGS.forEach((ring, k) => {
    set(rings[k], "transform", pose(ring, turn));
    set(rings[k], "opacity", k === LEVEL ? Number(head > tail) : Number(copies));
    set(tints[k], "opacity", tint);
  });
  set(rings[LEVEL], "stroke-dasharray", `${head - tail} 2`);
  set(rings[LEVEL], "stroke-dashoffset", -tail);
  set(motion, "opacity", drawn);
  set(exact, "opacity", Number(t >= 2900 && t < 7300));
  set(comet, "transform", along(t < 5000 ? head : tail));
  set(comet, "opacity", t < 5000 ? Math.min(1, head * 8) * (1 - from(t, 1400, 300)) : Math.min(1, (1 - tail) * 8) * from(t, 8100, 150));
  GLINT_ORDER.forEach((k, i) => {
    const u = from(t, 3500 + i * 700, 1400);
    for (const el of [glows[k], glints[k]]) {
      set(el, "stroke-dashoffset", 0.22 - u * 1.22);
      set(el, "opacity", Math.sin(Math.PI * u));
    }
  });
  letters.forEach((el, i) => {
    const rise = out(from(t, 2500 + i * 55, 600));
    const gone = from(t, 6900 + i * 30, 300);
    set(el, "transform", `translate(0 ${(1 - rise) * 5 - gone * 3})`);
    set(el, "opacity", rise * (1 - gone));
  });
};

export const Wordmark = ({ markOnly = false, still = false, className }: { markOnly?: boolean; still?: boolean; className?: string }) => {
  const ref = useRef<SVGSVGElement>(null);
  const id = useId().replace(/[^\w-]/g, "");
  const burst = useRef<(() => void) | null>(null);
  const clicks = useRef<number[]>([]);
  const click = () => {
    const now = performance.now();
    clicks.current = [...clicks.current.filter((t) => now - t < CLICKS_MS), now];
    if (clicks.current.length < 5) return;
    clicks.current = [];
    burst.current?.();
  };

  useEffect(() => {
    const svg = ref.current;
    if (!svg || still || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const all = (name: string) => [...svg.querySelectorAll<SVGElement>(`[data-${name}]`)];
    const parts: Parts = { rings: all("ring"), tints: all("tint"), motion: all("motion")[0], exact: all("exact")[0], glows: all("glow"), glints: all("glint"), comet: all("comet")[0], letters: all("letter") };
    let raf = 0;
    let start = 0;
    let held = 0;
    const frame = (now: number) => {
      if (held && now >= held) {
        start = now - BURST_AT;
        held = 0;
      }
      paint(parts, held ? BURST_AT : (now - start) % LOOP);
      raf = requestAnimationFrame(frame);
    };
    burst.current = () => {
      if (held) return;
      held = performance.now() + BURST_MS;
      [...parts.exact.children].forEach((ring, k) => {
        const [dx, dy, turn] = APART[k];
        ring.animate(
          [
            { transform: "translate(0, 0) rotate(0deg) scale(1)" },
            { transform: `translate(${dx}px, ${dy}px) rotate(${turn * 200}deg) scale(1.12)`, offset: 0.45 },
            { transform: `translate(0, 0) rotate(${turn * 360}deg) scale(1)` },
          ],
          { duration: BURST_MS - 200, delay: k * 90, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
        );
      });
    };
    // It plays from the start each time it comes into view.
    const seen = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        if (!entry.isIntersecting) return;
        start = performance.now();
        raf = requestAnimationFrame(frame);
      },
      { threshold: 0.5 },
    );
    seen.observe(svg);
    return () => {
      burst.current = null;
      seen.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [still]);

  return (
    <svg ref={ref} viewBox={markOnly ? MARK_VIEWBOX : WORDMARK_VIEWBOX} role="img" aria-label="Earthscale" onClick={click} className={cn("overflow-visible text-mist", !markOnly && "h-auto w-full max-w-[20rem]", className)}>
      <defs>
        {MARK.map((d, k) => (
          <clipPath key={d} id={`${id}-ring${k}`}>
            <path d={d} clipRule="evenodd" />
          </clipPath>
        ))}
        <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.45" />
        </filter>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      <g transform={markOnly ? undefined : MARK_IN_WORDMARK}>
        {/* The light round each ring: a glow under it, and the ring lit. */}
        {RINGS.map((ring, k) => (
          <path key={k} data-glow d={line(ring)} transform={pose(ring, 1)} pathLength={1} fill="none" strokeWidth={3.4} strokeDasharray="0.22 1" opacity={0} filter={`url(#${id}-glow)`} className="stroke-mint" />
        ))}
        <g data-exact>
          {MARK.map((d) => (
            <path key={d} d={d} fill="currentColor" fillRule="evenodd" className="origin-center [transform-box:fill-box]" />
          ))}
        </g>
        <g data-motion opacity={0} fill="none">
          {RINGS.map((ring, k) => (
            <g key={k} data-ring opacity={0} transform={pose(ring, 1)} strokeWidth={ring.w}>
              <path d={line(ring)} pathLength={1} stroke="currentColor" />
              <path data-tint d={line(ring)} pathLength={1} className="stroke-mint" />
            </g>
          ))}
        </g>
        {RINGS.map((ring, k) => (
          <g key={k} clipPath={`url(#${id}-ring${k})`}>
            <path data-glint d={line(ring)} transform={pose(ring, 1)} pathLength={1} fill="none" strokeWidth={3.2} strokeDasharray="0.22 1" opacity={0} filter={`url(#${id}-soft)`} className="stroke-mint" />
          </g>
        ))}
        <g transform={pose(RINGS[LEVEL], 1)}>
          <g data-comet opacity={0}>
            <circle r={2.2} opacity={0.45} filter={`url(#${id}-soft)`} className="fill-mint" />
            <circle r={0.75} className="fill-mint" />
          </g>
        </g>
      </g>
      {markOnly
        ? null
        : WORDMARK_LETTERS.map((d) => (
            <path key={d} data-letter d={d} fill="currentColor" />
          ))}
    </svg>
  );
};
