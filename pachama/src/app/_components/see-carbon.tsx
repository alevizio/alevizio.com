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
 * from the Website Figma), with the storytelling slide's aerial reveal: a
 * lens drifts along the marsh, and through it the same marsh as Pachama's
 * data draws it (the slide's own render, which lines up with the photo
 * exactly), a scan running down it and the slide's stat riding along.
 * Point at the photo and the lens follows. It opens when the section is
 * reached; with less motion it rests in one place. */
const { viewBox, symbol, word } = MARKS.logo;

const ease = (t: number) => 1 - (1 - t) ** 3;
const px = (v: number) => `${v.toFixed(1)}px`;
const OPEN_MS = 900;

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
    let pointer: { x: number; y: number } | null = null;
    const at = { x: 0, y: 0, set: false };

    const place = (now: number) => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      const narrow = W < 640;
      // The lens: a quarter of the width on a wide screen, under the words
      // on a phone, wandering along the marsh (a slow Lissajous path).
      const size = Math.max(140, Math.min(430, W * (narrow ? 0.44 : 0.24)));
      const t = still ? 0 : now / 1000;
      const free = narrow
        ? { x: W * (0.5 + 0.2 * Math.sin(t * 0.21)), y: H * (0.78 + 0.07 * Math.sin(t * 0.29 + 1)) }
        : { x: W * (0.72 + 0.12 * Math.sin(t * 0.17)), y: H * (0.53 + 0.19 * Math.sin(t * 0.23 + 1.1)) };
      const goal = pointer ?? free;
      if (!at.set || still) {
        at.x = goal.x;
        at.y = goal.y;
        at.set = true;
      }
      at.x += (goal.x - at.x) * 0.08;
      at.y += (goal.y - at.y) * 0.08;
      const k = still ? 1 : ease(Math.min(1, Math.max(0, (now - opened) / OPEN_MS)));
      const w = size * k;
      const h = size * 0.97 * k;
      const left = Math.min(W - w, Math.max(0, at.x - w / 2));
      const top = Math.min(H - h, Math.max(0, at.y - h / 2));
      el.style.setProperty("--ll", px(left));
      el.style.setProperty("--lt", px(top));
      el.style.setProperty("--lw", px(w));
      el.style.setProperty("--lh", px(h));
      el.style.setProperty("--lr", px(W - left - w));
      el.style.setProperty("--lb", px(H - top - h));
      // The stat sits on the lens's lower right, kept inside the photo.
      el.style.setProperty("--sx", px(Math.min(W - 16 - Math.min(250, size * 0.62), left + w * 0.44)));
      el.style.setProperty("--sy", px(Math.min(H - 16 - 70, top + h * 0.6)));
      el.style.setProperty("--so", k > 0.98 ? "1" : "0");
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
        // Each time it's reached, the lens opens again.
        if (visible && !was) opened = performance.now();
        kick();
      },
      { threshold: [0, 0.4] },
    );
    observer.observe(el);
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || still) return;
      const r = el.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
      kick();
    };
    const leave = () => {
      pointer = null;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    window.addEventListener("resize", kick);
    document.addEventListener("visibilitychange", kick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", kick);
      document.removeEventListener("visibilitychange", kick);
    };
  }, []);

  return (
    <figure data-reveal="frame" className={cn(BLEED, className)}>
      <div ref={root} className="relative isolate min-h-[34rem] overflow-hidden sm:min-h-[44rem] lg:aspect-[16/9] lg:min-h-0">
        <Image src={aerial} alt="An aerial view of a river winding through wetland forest" fill sizes="100vw" placeholder="blur" className="-z-20 object-cover saturate-[1.2]" />
        {/* The marsh as the data draws it, seen only through the lens. */}
        <Image
          src={lidar}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover [clip-path:inset(var(--lt,50%)_var(--lr,50%)_var(--lb,50%)_var(--ll,50%)_round_18px)]"
        />
        <div aria-hidden className="pointer-events-none absolute [top:var(--lt,50%)] [left:var(--ll,50%)] [width:var(--lw,0px)] [height:var(--lh,0px)] -z-10 overflow-hidden rounded-[18px] shadow-[0_24px_70px_rgb(0_0_0/0.35)] ring-[1.5px] ring-white/85">
          <span className="absolute inset-x-0 h-10 bg-linear-to-b from-transparent via-white/30 to-transparent motion-safe:animate-[lens-scan_2.8s_linear_infinite]" />
        </div>
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
        The site&rsquo;s hero from the hand-over, rebuilt in live type over its original photograph, with the storytelling slide&rsquo;s aerial reveal: through the lens, the same marsh as Pachama&rsquo;s data draws it. Point at the photo to move it.
      </figcaption>
    </figure>
  );
};
