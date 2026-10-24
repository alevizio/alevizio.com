"use client";

import aerial from "@/assets/brand/see-carbon-aerial.jpg";
import lidar from "@/assets/brand/see-carbon-lidar.jpg";
import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { MARKS } from "./brand-marks";
import { cn } from "./cn";
import { BLEED } from "./shot";
import { PAGE } from "./story";

/* The site's hero from How&How's hand-over, "See carbon in action.",
 * rebuilt in live type over the original photograph (the wetland aerial
 * from the Website Figma), with its storytelling slide's "All data
 * points" frame: the same marsh as Pachama's data draws it (the slide's
 * own render, which lines up with the photo exactly) glows into view
 * through a soft, feathered light, slowly, and drifts across the marsh
 * without stopping; where it first passes, each of the site's figures
 * appears and stays. They start when the section is reached; with less
 * motion the light rests in one place and the figures are all there. */
const { viewBox, symbol, word } = MARKS.logo;

// One loop of the light along the figures, and how it comes in.
const LOOP_S = 30;
const INTRO_S = 2.6;
const COUNT_MS = 1200;
const ease = (t: number) => 1 - (1 - t) ** 3;
const px = (v: number) => `${v.toFixed(1)}px`;

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
const Sparkline = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 47 47" aria-hidden className={className}>
    <path d="M6 31c5 0 7-14 12-12s6 12 11 9 6-15 12-14" fill="none" stroke="#84E1FF" strokeWidth="3.2" strokeLinecap="round" />
  </svg>
);
const Bars = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 47 47" aria-hidden className={className}>
    <rect x="8" y="24" width="8" height="15" rx="2" fill="#81F18E" fillOpacity="0.55" />
    <rect x="20" y="17" width="8" height="22" rx="2" fill="#81F18E" fillOpacity="0.8" />
    <rect x="32" y="7" width="8" height="32" rx="2" fill="#81F18E" />
  </svg>
);
const Ring = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 47 47" aria-hidden className={className}>
    <circle cx="23.5" cy="23.5" r="18" fill="none" stroke="#6BA6FF" strokeOpacity="0.3" strokeWidth="5" />
    <circle cx="23.5" cy="23.5" r="18" fill="none" stroke="#6BA6FF" strokeWidth="5" strokeDasharray="90 113" strokeLinecap="round" transform="rotate(-90 23.5 23.5)" />
  </svg>
);
const Gauge = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 47 47" aria-hidden className={className}>
    <circle cx="23.5" cy="23.5" r="18" fill="none" stroke="#F9E63F" strokeWidth="5" strokeDasharray="84 113" strokeLinecap="round" transform="rotate(150 23.5 23.5)" />
    <circle cx="23.5" cy="23.5" r="9" fill="none" stroke="#F9E63F" strokeOpacity="0.5" strokeWidth="3" />
  </svg>
);

/* The slide's five figures, its own. Where each sits: on a wide screen
 * clear of the words (the right half, and under them); on smaller ones,
 * under the words, fewer. The light's loop runs through them in this
 * order. Literal classes, for Tailwind. */
type Point = { id: string; to: number; decimals?: number; before?: string; after?: string; unit?: string; label: string; icon: (p: { className?: string }) => ReactNode; at: string };
const POINTS: Point[] = [
  { id: "evaluated", to: 150, before: ">", label: "Projects evaluated", icon: RingChart, at: "left-[6%] top-[66%] lg:left-[68%] lg:top-[40%]" },
  { id: "hectares", to: 75020, label: "Total hectares", icon: Sparkline, at: "max-lg:hidden lg:left-[77%] lg:top-[14%]" },
  { id: "funding", to: 79.2, decimals: 1, before: "$", after: "M", label: "Total funding", icon: Bars, at: "max-lg:hidden lg:left-[55%] lg:top-[22%]" },
  { id: "avoided", to: 140438, after: " ha", label: "Avoided deforestation", icon: Gauge, at: "left-[38%] top-[83%] sm:left-[30%] lg:left-[40%] lg:top-[83%]" },
  { id: "sequestered", to: 5500, unit: "mtCO2", label: "Sequestered to date", icon: Ring, at: "max-sm:hidden sm:left-[56%] sm:top-[67%] lg:left-[7%] lg:top-[79%]" },
];
const show = (p: Point, v: number) =>
  `${p.before ?? ""}${v.toLocaleString("en-US", { minimumFractionDigits: p.decimals ?? 0, maximumFractionDigits: p.decimals ?? 0 })}${p.after ?? ""}`;

/** A closed Catmull-Rom curve through the points, sampled with the length run so far. */
const loop = (pts: { x: number; y: number }[], per = 48) => {
  const n = pts.length;
  const samples: { x: number; y: number; s: number }[] = [];
  let s = 0;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
    for (let k = 0; k < per; k++) {
      const t = k / per;
      const at = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (3 * b - a - 3 * c + d) * t * t * t);
      const q = { x: at(p0.x, p1.x, p2.x, p3.x), y: at(p0.y, p1.y, p2.y, p3.y) };
      const last = samples[samples.length - 1];
      if (last) s += Math.hypot(q.x - last.x, q.y - last.y);
      samples.push({ ...q, s });
    }
  }
  const end = samples[samples.length - 1];
  return { samples, length: s + Math.hypot(samples[0].x - end.x, samples[0].y - end.y) };
};

export const SeeCarbon = ({ className }: { className?: string }) => {
  const root = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLParagraphElement | null)[]>([]);
  const nums = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;
    let started = -1;
    const shown = new Map<number, number>();
    let path: ReturnType<typeof loop> | null = null;
    let centres: { i: number; x: number; y: number }[] = [];

    // The figures that show at this size, their centres, and the light's loop through them.
    const measure = () => {
      const box = el.getBoundingClientRect();
      centres = cards.current.flatMap((c, i) => {
        const r = c?.getBoundingClientRect();
        return r && r.width ? [{ i, x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 }] : [];
      });
      if (!centres.length) {
        path = null;
        return;
      }
      // Between each two, a point pushed out from the middle, so the loop swings wide.
      const mx = centres.reduce((a, c) => a + c.x, 0) / centres.length;
      const my = centres.reduce((a, c) => a + c.y, 0) / centres.length;
      const push = Math.min(box.width, box.height) * 0.14;
      path = loop(
        centres.flatMap((c, k) => {
          const d = centres[(k + 1) % centres.length];
          const m = { x: (c.x + d.x) / 2, y: (c.y + d.y) / 2 };
          const len = Math.hypot(m.x - mx, m.y - my) || 1;
          return [c, { x: m.x + ((m.x - mx) / len) * push, y: m.y + ((m.y - my) / len) * push }];
        }),
      );
    };

    const frame = (now: number) => {
      raf = 0;
      const W = el.clientWidth;
      const r = W < 640 ? W * 0.42 : W < 1024 ? W * 0.26 : W * 0.15;
      if (!path) measure();
      const t = started < 0 ? 0 : (now - started) / 1000;
      const k = still ? 1 : started < 0 ? 0 : ease(Math.min(1, t / INTRO_S));
      let gx = W * 0.7;
      let gy = el.clientHeight * 0.45;
      if (path) {
        const s = still ? 0 : ((t / LOOP_S) * path.length) % path.length;
        const at = path.samples.find((p) => p.s >= s) ?? path.samples[0];
        gx = at.x;
        gy = at.y;
      }
      el.style.setProperty("--gx", px(gx));
      el.style.setProperty("--gy", px(gy));
      el.style.setProperty("--gr", px(r * (0.65 + 0.35 * k)));
      el.style.setProperty("--go", k.toFixed(3));
      // A figure appears where the light first reaches it, and counts up.
      for (const c of centres) {
        if (started >= 0 && !shown.has(c.i) && (still || Math.hypot(c.x - gx, c.y - gy) < r * 0.8)) {
          shown.set(c.i, now);
          cards.current[c.i]?.setAttribute("data-on", "");
        }
        const since = shown.get(c.i);
        const n = nums.current[c.i];
        if (since !== undefined && n) {
          const p = POINTS[c.i];
          n.textContent = show(p, p.to * (still ? 1 : ease(Math.min(1, (now - since) / COUNT_MS))));
        }
      }
      if (!still && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.intersectionRatio >= 0.35;
        if (visible && started < 0) started = performance.now();
        kick();
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(el);
    const resize = new ResizeObserver(() => {
      path = null;
      kick();
    });
    resize.observe(el);
    document.addEventListener("visibilitychange", kick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", kick);
    };
  }, []);

  return (
    <figure data-reveal="frame" className={cn(BLEED, className)}>
      <div ref={root} className="relative isolate min-h-[34rem] overflow-hidden sm:min-h-[44rem] lg:aspect-[16/9] lg:min-h-0">
        <Image src={aerial} alt="An aerial view of a river winding through wetland forest" fill sizes="100vw" placeholder="blur" className="-z-20 object-cover saturate-[1.2]" />
        {/* The marsh as the data draws it, seen through a soft light that drifts across it. */}
        <Image
          src={lidar}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover opacity-[var(--go,0)] [mask-image:radial-gradient(circle_var(--gr,0px)_at_var(--gx,70%)_var(--gy,45%),#000_0%,rgb(0_0_0/0.85)_30%,rgb(0_0_0/0.35)_62%,transparent_100%)]"
        />
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
        {POINTS.map((p, i) => {
          const Icon = p.icon;
          return (
            <p
              key={p.id}
              ref={(n) => {
                cards.current[i] = n;
              }}
              data-point
              className={cn(
                "pointer-events-none absolute flex items-center gap-3 rounded-[14px] bg-[#0b1611]/55 py-2.5 pr-5 pl-2.5 text-white shadow-[0_12px_40px_rgb(0_0_0/0.3)] ring-1 ring-white/12 backdrop-blur-md",
                p.at,
              )}
            >
              <Icon className="size-9 shrink-0 sm:size-11" />
              <span>
                <span className="block text-[20px] leading-6 font-bold whitespace-nowrap sm:text-[24px] sm:leading-7">
                  <span
                    aria-hidden
                    ref={(n) => {
                      nums.current[i] = n;
                    }}
                  >
                    {show(p, p.to)}
                  </span>
                  <span className="sr-only">{show(p, p.to)}</span>
                  {p.unit ? <span className="ml-0.5 align-top text-[11px] font-medium sm:text-[12px]">{p.unit}</span> : null}
                </span>
                <span className="block font-mono text-[10px] leading-3 tracking-[0.08em] whitespace-nowrap uppercase sm:text-[11px]">{p.label}</span>
              </span>
            </p>
          );
        })}
      </div>
    </figure>
  );
};
