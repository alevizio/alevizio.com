"use client";

import { useEffect, useRef } from "react";
import { cn } from "./cn";

/* How&How's colour animation, live instead of a video: the spectrum as a
 * height scale. A capsule fills from the ground to 140 m and drains again,
 * every ten seconds, the way canopy height is coloured on Pachama's maps:
 * blaze at the ground, through hibiscus and canary, to glacier at the top.
 * A dot in the colour of the height follows the fill and reads it out.
 * Point at the capsule to read any height. The geometry and colours are
 * sampled from the hand-over's video (900 x 1024); with less motion it
 * rests full. */
const MAX_M = 140;
const LOOP_MS = 10000;
// The gradient, ground to top, as sampled from the video (the class below
// spells the same stops out, for Tailwind).
const STOPS: [number, string][] = [
  [0, "#f27037"],
  [0.06, "#f27037"],
  [0.095, "#ef7358"],
  [0.15, "#eb7593"],
  [0.24, "#e67dfa"],
  [0.34, "#eebb9f"],
  [0.44, "#eff053"],
  [0.52, "#c4f96e"],
  [0.62, "#92ff96"],
  [0.73, "#90f4cb"],
  [0.85, "#8fe1fc"],
  [1, "#78a5f9"],
];
const GRADIENT =
  "bg-[linear-gradient(to_top,#f27037_0%,#f27037_6%,#ef7358_9.5%,#eb7593_15%,#e67dfa_24%,#eebb9f_34%,#eff053_44%,#c4f96e_52%,#92ff96_62%,#90f4cb_73%,#8fe1fc_85%,#78a5f9_100%)]";

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const colourAt = (level: number) => {
  const i = Math.max(0, STOPS.findIndex(([at]) => at >= level) - 1);
  const [a0, c0] = STOPS[i];
  const [a1, c1] = STOPS[Math.min(i + 1, STOPS.length - 1)];
  const k = a1 === a0 ? 0 : Math.min(1, Math.max(0, (level - a0) / (a1 - a0)));
  const [r0, g0, b0] = hex(c0);
  const [r1, g1, b1] = hex(c1);
  return `rgb(${Math.round(r0 + (r1 - r0) * k)} ${Math.round(g0 + (g1 - g0) * k)} ${Math.round(b0 + (b1 - b0) * k)})`;
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
// Rise for 2.4 s, hold, fall for 2.5 s from 4.85 s, rest empty.
const levelAt = (ms: number) => {
  const t = ms % LOOP_MS;
  if (t < 2400) return ease(t / 2400);
  if (t < 4850) return 1;
  if (t < 7350) return 1 - ease((t - 4850) / 2500);
  return 0;
};

export const HeightGauge = ({ className }: { className?: string }) => {
  const root = useRef<HTMLDivElement>(null);
  const capsule = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    const cap = capsule.current;
    if (!el || !cap) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;
    let scrub: number | null = null;
    // The loop's clock only runs while it's seen, so it never jumps.
    let clock = 0;
    let last = 0;

    const show = (level: number) => {
      el.style.setProperty("--level", level.toFixed(4));
      el.style.setProperty("--dot", colourAt(level));
      if (label.current) label.current.textContent = `${Math.round(level * MAX_M)}m`;
    };
    const tick = (now: number) => {
      raf = 0;
      if (last) clock += now - last;
      last = now;
      show(scrub ?? levelAt(clock));
      if (visible && !document.hidden && scrub === null) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf && !still) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    show(still ? 1 : 0);

    const onMove = (e: PointerEvent) => {
      const box = cap.getBoundingClientRect();
      scrub = Math.min(1, Math.max(0, (box.bottom - e.clientY) / box.height));
      show(scrub);
    };
    const onLeave = () => {
      scrub = null;
      if (still) return show(1);
      kick();
    };
    cap.addEventListener("pointermove", onMove);
    cap.addEventListener("pointerleave", onLeave);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", kick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      cap.removeEventListener("pointermove", onMove);
      cap.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", kick);
    };
  }, []);

  return (
    <div
      ref={root}
      role="img"
      aria-label={`The spectrum as a height scale: a capsule filling from 0 to ${MAX_M} metres, orange at the ground through pink and yellow to blue at the top`}
      className={cn("@container relative aspect-[900/1024] overflow-hidden rounded-[10px] bg-[#fafaf0]", className)}
    >
      <p aria-hidden className="absolute inset-x-0 top-[6.8%] text-center font-mono text-[1.25cqw] tracking-[0.12em] text-[#56635f] uppercase">
        Max height
      </p>
      <div ref={capsule} className="absolute top-[9.77%] left-1/3 h-[80.47%] w-1/3 cursor-ns-resize touch-none overflow-hidden rounded-full bg-[#dae0de]">
        <div className={cn("absolute inset-0 [clip-path:inset(calc((1_-_var(--level,0))_*_100%)_0_0_0)]", GRADIENT)} />
      </div>
      <p aria-hidden className="absolute inset-x-0 bottom-[6.8%] text-center font-mono text-[1.25cqw] tracking-[0.12em] text-[#56635f] uppercase">
        Min height
      </p>
      <span aria-hidden className="absolute left-[67.5%] flex -translate-y-1/2 items-center gap-[1.2cqw] [top:calc(9.77%_+_80.47%_*_(1_-_var(--level,0)))]">
        <span className="size-[2.6cqw] rounded-full bg-(--dot,#f27037)" />
        <span ref={label} className="text-[2.3cqw] font-bold text-bn-heavy">
          0m
        </span>
      </span>
    </div>
  );
};
