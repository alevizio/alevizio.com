"use client";

import basemap from "@/assets/screens/dcab-basemap.jpg";
import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { BN } from "../banyan/ui";
import { cn } from "../cn";
import { BaselineInsights } from "./baseline-insights";
import { PAIRS, POLYGON_AT, POLYGON_D, RING } from "./dcab-pixels";

/* The DCAB sandbox's Baseline insights, rebuilt live from the DCAB Freemium
 * Figma: a polygon someone drew, its forest pixels and, in the 30-100 km
 * ring around it, the control pixel matched to each. Drag across the blue
 * control pixels and their matches inside the polygon light up in yellow;
 * once it's reached, it makes the design's own selection by itself. The
 * basemap and the polygon are the design's; the pixels are drawn from the
 * basemap, forest matched to forest by colour, an illustration of the
 * matching; the figures are the design's samples (the panel's charts and
 * figures are in baseline-insights.tsx). Everything sits in the
 * design's 1440 x 900 frame; below lg the map shows its right part. */
const W = 1440;
const H = 900;
const COUNT = PAIRS.length / 4;
const SWEEP_MS = 1400;
type Box = { x0: number; y0: number; x1: number; y1: number };
// The design's selection first, then other stands of matched forest.
const PATCHES: Box[] = [
  { x0: 520, y0: 175, x1: 850, y1: 470 },
  { x0: 470, y0: 15, x1: 800, y1: 165 },
  { x0: 610, y0: 240, x1: 740, y1: 380 },
];
const norm = (a: { x: number; y: number }, b: { x: number; y: number }): Box => ({
  x0: Math.min(a.x, b.x),
  y0: Math.min(a.y, b.y),
  x1: Math.max(a.x, b.x),
  y1: Math.max(a.y, b.y),
});
const within = (i: number, b: Box) => {
  const x = PAIRS[i * 4 + 2];
  const y = PAIRS[i * 4 + 3];
  return x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1;
};
const countIn = (b: Box | null) => {
  let n = 0;
  if (b) for (let i = 0; i < COUNT; i++) if (within(i, b)) n++;
  return n;
};
const ease = (t: number) => 1 - (1 - t) ** 3;

/** The pixels for a selection: control pixels faint, the selected ones
 *  bright, and their matches in yellow. Never under 1.6 CSS px a dot. */
const paint = (c: HTMLCanvasElement | null, b: Box | null) => {
  const ctx = c?.getContext("2d");
  if (!c || !ctx || !c.clientWidth) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.round(c.clientWidth * dpr);
  const h = Math.round(c.clientHeight * dpr);
  if (c.width !== w || c.height !== h) {
    c.width = w;
    c.height = h;
  }
  const dot = Math.max(2.4, (1.6 * W) / c.clientWidth);
  ctx.setTransform(w / W, 0, 0, h / H, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const lit: number[] = [];
  ctx.fillStyle = "#2fd3f2";
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < COUNT; i++) {
    if (b && within(i, b)) lit.push(i);
    else ctx.fillRect(PAIRS[i * 4 + 2], PAIRS[i * 4 + 3], dot, dot);
  }
  ctx.globalAlpha = 1;
  for (const i of lit) ctx.fillRect(PAIRS[i * 4 + 2], PAIRS[i * 4 + 3], dot, dot);
  ctx.fillStyle = "#f6e64b";
  for (const i of lit) ctx.fillRect(PAIRS[i * 4], PAIRS[i * 4 + 1], dot, dot);
};

const LEGEND = [
  { label: "Project boundary", swatch: "rounded-[3px] bg-white" },
  { label: "Control area pixels", swatch: "rounded-[3px] bg-[#2fd3f2]" },
  { label: "Matching pixels", swatch: "rounded-[3px] bg-[#f6e64b]" },
  { label: "30-100 km search radius", swatch: "rounded-full border border-dashed border-white" },
];

const Legend = ({ className }: { className?: string }) => (
  <ul className={cn("grid gap-1.5 text-[12px] leading-4", className)}>
    {LEGEND.map(({ label, swatch }) => (
      <li key={label} className="flex items-center gap-2">
        <span aria-hidden className={cn("size-3 shrink-0", swatch)} />
        {label}
      </li>
    ))}
  </ul>
);

const Tip = ({ count, onNext, className }: { count: number; onNext: () => void; className?: string }) => (
  <div className={cn("flex gap-4 text-[12px] leading-4 text-white/80", className)}>
    <span aria-hidden className="mt-1 size-12 shrink-0 rounded-[6px] border-2 border-dashed border-white/80 bg-white/10" />
    <div>
      <p className="text-[14px] leading-5 font-bold text-white">Interactive map: see the matching project pixel for each control area pixel</p>
      <p className="mt-1">Drag across any number of blue control area pixels, or tap them. When you let go, their matching project pixels light up in yellow.</p>
      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span aria-live="polite" className="font-mono text-[11px] text-white uppercase">
          {count.toLocaleString("en-US")} {count === 1 ? "match" : "matches"}
        </span>
        <button
          type="button"
          onClick={onNext}
          className={cn("rounded-full border border-white/60 px-3 py-1 font-mono text-[11px] text-white uppercase hover:bg-white/10", BN.focus, "focus-visible:outline-white")}
        >
          Another patch
        </button>
      </p>
    </div>
  </div>
);

export const BaselineSandbox = ({ className }: { className?: string }) => {
  const layer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  // A selection to draw out from its corner, the way a hand would.
  const [sweep, setSweep] = useState<Box | null>(null);
  const touched = useRef(false);
  const patch = useRef(0);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const shown = useRef<Box | null>(null);

  useEffect(() => {
    shown.current = box;
    paint(canvas.current, box);
  }, [box]);

  useEffect(() => {
    const to = sweep;
    if (!to) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let id = 0;
    const step = (now: number) => {
      // A frame's time can come just before the start: never below zero.
      const t = still ? 1 : ease(Math.min(1, Math.max(0, (now - start) / SWEEP_MS)));
      setBox({ x0: to.x0, y0: to.y0, x1: to.x0 + (to.x1 - to.x0) * t, y1: to.y0 + (to.y1 - to.y0) * t });
      if (t < 1) id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [sweep]);

  // Repaint at every size; once it's mostly in view, the first selection.
  useEffect(() => {
    const el = layer.current;
    const c = canvas.current;
    if (!el || !c) return;
    const resize = new ResizeObserver(() => paint(c, shown.current));
    resize.observe(c);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.5) return;
        observer.disconnect();
        if (!touched.current) setSweep(PATCHES[0]);
      },
      { threshold: [0, 0.5] },
    );
    observer.observe(el);
    return () => {
      resize.disconnect();
      observer.disconnect();
    };
  }, []);

  const at = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };
  const take = () => {
    touched.current = true;
    setSweep(null);
  };
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    take();
    drag.current = { ...at(e), moved: false };
    // Touch keeps the page scrolling; a tap still picks a patch.
    if (e.pointerType !== "touch") e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || e.pointerType === "touch") return;
    const p = at(e);
    if (Math.hypot(p.x - d.x, p.y - d.y) > 6) d.moved = true;
    if (d.moved) setBox(norm(d, p));
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.moved) return;
    const p = at(e);
    setBox({ x0: p.x - 90, y0: p.y - 75, x1: p.x + 90, y1: p.y + 75 });
  };
  const next = () => {
    take();
    patch.current = (patch.current + 1) % PATCHES.length;
    setSweep(PATCHES[patch.current]);
  };
  const count = countIn(box);

  return (
    <div className={cn("relative overflow-hidden rounded-[16px] bg-[#12211a] text-white ring-1 ring-white/10", className)}>
      <div className="relative aspect-[1000/900] overflow-hidden lg:aspect-[1440/900]">
        <div
          ref={layer}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => (drag.current = null)}
          role="img"
          aria-label={`The design's sample polygon on satellite imagery, its forest pixels matched to control pixels in a 30 to 100 kilometre ring around it: ${count.toLocaleString("en-US")} of the ${COUNT.toLocaleString("en-US")} matches lit.`}
          className="absolute inset-y-0 left-[-44%] w-[144%] cursor-crosshair touch-pan-y select-none lg:left-0 lg:w-full"
        >
          <Image src={basemap} alt="" fill sizes="(min-width: 1376px) 1296px, (min-width: 1024px) 94vw, 144vw" placeholder="blur" draggable={false} className="object-cover" />
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full">
            <path d={`M0 0H${W}V${H}H0Z`} fill="#000000" fillOpacity={0.22} />
            <path
              d={`M${RING.x - RING.rOut} ${RING.y}a${RING.rOut} ${RING.rOut} 0 1 0 ${RING.rOut * 2} 0a${RING.rOut} ${RING.rOut} 0 1 0 ${-RING.rOut * 2} 0ZM${RING.x - RING.rIn} ${RING.y}a${RING.rIn} ${RING.rIn} 0 1 0 ${RING.rIn * 2} 0a${RING.rIn} ${RING.rIn} 0 1 0 ${-RING.rIn * 2} 0Z`}
              fillRule="evenodd"
              fill="#ffffff"
              fillOpacity={0.08}
            />
            {[RING.rIn, RING.rOut].map((r) => (
              <circle key={r} cx={RING.x} cy={RING.y} r={r} fill="none" stroke="#ffffff" strokeOpacity={0.75} strokeWidth={1.5} strokeDasharray="7 7" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          <canvas ref={canvas} className="absolute inset-0 size-full" />
          <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 size-full">
            <path d={POLYGON_D} transform={`translate(${POLYGON_AT.x} ${POLYGON_AT.y})`} fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            {box ? (
              <rect x={box.x0} y={box.y0} width={box.x1 - box.x0} height={box.y1 - box.y0} fill="#ffffff" fillOpacity={0.06} stroke="#ffffff" strokeWidth={1.5} strokeDasharray="6 5" vectorEffect="non-scaling-stroke" />
            ) : null}
          </svg>
        </div>
        <Legend className="absolute top-4 right-4 rounded-[12px] bg-[#16241b]/85 p-4 backdrop-blur-sm max-sm:hidden" />
        <Tip count={count} onNext={next} className="absolute bottom-4 left-4 w-[min(18rem,calc(100%-2rem))] rounded-[12px] bg-[#16241b]/85 p-4 backdrop-blur-sm max-sm:hidden lg:bottom-3 lg:left-[calc(30.56%+1rem)] lg:w-[min(27rem,32%)] lg:p-3" />
      </div>

      {/* The results: over the map's left from lg up, under it below. */}
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:absolute lg:inset-y-0 lg:left-0 lg:w-[30.56%] lg:bg-[#2c4634]/70 lg:p-7 lg:backdrop-blur-md">
        <div>
          <h4 className="text-[20px] leading-7 font-bold">Baseline insights</h4>
          <p className="text-[13px] text-white/75">Here&rsquo;s a result of your polygon</p>
        </div>
        <Tip count={count} onNext={next} className="sm:hidden" />
        <Legend className="sm:hidden" />
        <BaselineInsights />
      </div>
    </div>
  );
};
