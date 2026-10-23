"use client";

import aerial from "@/assets/brand/see-carbon-aerial.jpg";
import lidar from "@/assets/brand/see-carbon-lidar.jpg";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { MARKS } from "./brand-marks";
import { cn } from "./cn";
import { CountUp } from "./count-up";
import { BLEED } from "./shot";
import { PAGE } from "./story";

/* The site's hero from How&How's hand-over, "See carbon in action.",
 * rebuilt in live type over the original photograph (the wetland aerial
 * from the Website Figma), with the storytelling slide's aerial reveal:
 * windows open on the marsh, one place after another, and through each the
 * same marsh as Pachama's data draws it (the slide's own render, which
 * lines up with the photo exactly), a scan running down it; the slide's
 * stat rides with one of them. They start when the section is reached;
 * with less motion three stay open, still. */
const { viewBox, symbol, word } = MARKS.logo;

const ease = (t: number) => 1 - (1 - t) ** 3;
const px = (v: number) => `${v.toFixed(1)}px`;
// Each window opens, holds and closes in a cycle, a third of a cycle after
// the one before it, then opens again at its next place.
const CYCLE_MS = 4200;
const OPEN = 0.22;
const CLOSE = 0.2;
const WINDOWS = 3;
type Spot = { x: number; y: number; w: number };
// Places on the marsh, centre and width as shares of the photo. Each
// window keeps to its own part of it, so two never open on top of each
// other: on a wide screen clear of the words, on a phone under them.
const WIDE: Spot[][] = [
  [
    { x: 0.68, y: 0.28, w: 0.2 },
    { x: 0.87, y: 0.26, w: 0.15 },
    { x: 0.56, y: 0.33, w: 0.14 },
  ],
  [
    { x: 0.86, y: 0.68, w: 0.17 },
    { x: 0.74, y: 0.62, w: 0.15 },
    { x: 0.9, y: 0.56, w: 0.13 },
  ],
  [
    { x: 0.44, y: 0.8, w: 0.17 },
    { x: 0.2, y: 0.84, w: 0.16 },
    { x: 0.6, y: 0.86, w: 0.14 },
  ],
];
const NARROW: Spot[][] = [
  [
    { x: 0.2, y: 0.75, w: 0.28 },
    { x: 0.21, y: 0.87, w: 0.27 },
  ],
  [
    { x: 0.5, y: 0.84, w: 0.28 },
    { x: 0.5, y: 0.75, w: 0.27 },
  ],
  [
    { x: 0.8, y: 0.74, w: 0.28 },
    { x: 0.79, y: 0.89, w: 0.27 },
  ],
];
// Literal classes for Tailwind, one set per window: the data's clip, and
// the window's frame over it.
const CLIP = [
  "[clip-path:inset(var(--t0,50%)_var(--r0,50%)_var(--b0,50%)_var(--l0,50%)_round_18px)]",
  "[clip-path:inset(var(--t1,50%)_var(--r1,50%)_var(--b1,50%)_var(--l1,50%)_round_18px)]",
  "[clip-path:inset(var(--t2,50%)_var(--r2,50%)_var(--b2,50%)_var(--l2,50%)_round_18px)]",
];
const FRAME = [
  "[top:var(--t0,50%)] [left:var(--l0,50%)] [width:var(--w0,0px)] [height:var(--h0,0px)] opacity-[var(--o0,0)]",
  "[top:var(--t1,50%)] [left:var(--l1,50%)] [width:var(--w1,0px)] [height:var(--h1,0px)] opacity-[var(--o1,0)]",
  "[top:var(--t2,50%)] [left:var(--l2,50%)] [width:var(--w2,0px)] [height:var(--h2,0px)] opacity-[var(--o2,0)]",
];

/** The slide's ring chart, in the spectrum's colours. */
const RingChart = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 47 47" aria-hidden className={className}>
    <path d="M47 23.5c0-3.96-1-7.85-2.9-11.32a23.5 23.5 0 0 0-8.01-8.52L31.06 11.6a14.1 14.1 0 0 1 6.54 11.9H47Z" fill="#6BA6FF" />
    <path d="M36.09 3.66a23.5 23.5 0 0 0-34.57 11.53l8.79 3.32a14.1 14.1 0 0 1 20.75-6.92l5.03-7.93Z" fill="#6D7E7B" />
    <path d="M1.82 14.44a23.5 23.5 0 0 0-.06 17.98l8.7-3.57a14.1 14.1 0 0 1 .03-10.79l-8.67-3.62Z" fill="#C0C9C9" />
    <path d="M1.58 31.97a23.5 23.5 0 0 0 35.95 10.38l-5.61-7.54a14.1 14.1 0 0 1-21.57-6.23l-8.77 3.39Z" fill="#EE88FF" />
    <path d="M28.88 46.38a23.5 23.5 0 0 0 18.11-23.6l-9.4.28a14.1 14.1 0 0 1-10.86 14.17l2.15 9.15Z" fill="#FF7324" />
  </svg>
);

export const SeeCarbon = ({ className }: { className?: string }) => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;
    let opened = 0;

    const place = (now: number) => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      const spots = W < 640 ? NARROW : WIDE;
      for (let i = 0; i < WINDOWS; i++) {
        // Where window i is in its cycle, and so which place it's at and how open.
        const phase = still ? 0.5 : (now - opened) / CYCLE_MS - i / WINDOWS;
        const cycle = Math.floor(phase);
        const f = phase - cycle;
        const k = phase < 0 ? 0 : f < OPEN ? ease(f / OPEN) : f > 1 - CLOSE ? ease((1 - f) / CLOSE) : 1;
        const own = spots[i];
        const spot = own[Math.max(0, cycle) % own.length];
        const w = spot.w * W * k;
        const h = spot.w * W * 0.92 * k;
        const left = Math.min(W - w, Math.max(0, spot.x * W - w / 2));
        const top = Math.min(H - h, Math.max(0, spot.y * H - h / 2));
        el.style.setProperty(`--l${i}`, px(left));
        el.style.setProperty(`--t${i}`, px(top));
        el.style.setProperty(`--w${i}`, px(w));
        el.style.setProperty(`--h${i}`, px(h));
        el.style.setProperty(`--r${i}`, px(W - left - w));
        el.style.setProperty(`--b${i}`, px(H - top - h));
        el.style.setProperty(`--o${i}`, k > 0.02 ? "1" : "0");
        // The stat sits on the first window's lower right, inside the photo, once it's open.
        if (i === 0) {
          const full = spot.w * W;
          el.style.setProperty("--sx", px(Math.min(W - 16 - Math.min(250, full * 0.9), left + w * 0.38)));
          el.style.setProperty("--sy", px(Math.min(H - 16 - 70, top + h * 0.66)));
          el.style.setProperty("--so", k > 0.98 ? "1" : "0");
        }
      }
    };
    const frame = (now: number) => {
      raf = 0;
      place(now);
      if (!still && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const was = visible;
        visible = entry.intersectionRatio >= 0.4;
        // Each time it's reached, the windows start over.
        if (visible && !was) opened = performance.now();
        kick();
      },
      { threshold: [0, 0.4] },
    );
    observer.observe(el);
    window.addEventListener("resize", kick);
    document.addEventListener("visibilitychange", kick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", kick);
      document.removeEventListener("visibilitychange", kick);
    };
  }, []);

  return (
    <figure data-reveal="frame" className={cn(BLEED, className)}>
      <div ref={root} className="relative isolate min-h-[34rem] overflow-hidden sm:min-h-[44rem] lg:aspect-[16/9] lg:min-h-0">
        <Image src={aerial} alt="An aerial view of a river winding through wetland forest" fill sizes="100vw" placeholder="blur" className="-z-20 object-cover saturate-[1.2]" />
        {/* The marsh as the data draws it, seen only through the windows. */}
        {CLIP.map((clip) => (
          <Image key={clip} src={lidar} alt="" fill sizes="100vw" className={cn("-z-10 object-cover", clip)} />
        ))}
        {FRAME.map((frame) => (
          <div key={frame} aria-hidden className={cn("pointer-events-none absolute -z-10 overflow-hidden rounded-[18px] shadow-[0_24px_70px_rgb(0_0_0/0.35)] ring-[1.5px] ring-white/85", frame)}>
            <span className="absolute inset-x-0 h-10 bg-linear-to-b from-transparent via-white/30 to-transparent motion-safe:animate-[lens-scan_2.8s_linear_infinite]" />
          </div>
        ))}
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-r from-black/45 via-black/10 to-transparent" />
        <div aria-hidden className="spectrum h-1 w-full" />
        <div className={cn(PAGE, "pointer-events-none pt-14 sm:pt-20 lg:pt-24")}>
          <svg viewBox={viewBox} role="img" aria-label="Pachama" className="h-10 w-auto sm:h-14">
            <path d={symbol} fill="#ffffff" />
            {word.map((d) => (
              <path key={d.slice(0, 24)} d={d} fill="#ffffff" />
            ))}
          </svg>
          <p data-reveal className="type-display mt-8 max-w-[11ch] text-white [--reveal-delay:0.15s]">
            See carbon in action.
          </p>
          <p data-reveal className="mt-6 max-w-[32rem] text-[18px] leading-7 text-white/90 sm:text-[22px] sm:leading-8 [--reveal-delay:0.3s]">
            Partner with Pachama to access technology and financing for your reforestation project.
          </p>
        </div>
        <p className="pointer-events-none absolute [top:var(--sy,0px)] [left:var(--sx,0px)] flex items-center gap-3 rounded-[14px] bg-white/85 py-2.5 pr-5 pl-2.5 text-bn-heavy opacity-[var(--so,0)] shadow-[0_12px_40px_rgb(0_0_0/0.3)] backdrop-blur-md transition-opacity duration-500">
          <RingChart className="size-9 shrink-0 sm:size-11" />
          <span>
            <span className="block text-[20px] leading-6 font-bold sm:text-[24px] sm:leading-7">
              &gt;
              <CountUp value={150} />
            </span>
            <span className="block font-mono text-[10px] leading-3 tracking-[0.08em] uppercase sm:text-[11px]">Projects evaluated</span>
          </span>
        </p>
      </div>
      <figcaption className={cn(PAGE, "type-caption mt-3 text-(--tone-text)")}>
        The site&rsquo;s hero from the hand-over, rebuilt in live type over its original photograph, with the storytelling slide&rsquo;s aerial reveal: windows open on the marsh, one place after another, and through each, the same marsh as Pachama&rsquo;s data draws it.
      </figcaption>
    </figure>
  );
};
