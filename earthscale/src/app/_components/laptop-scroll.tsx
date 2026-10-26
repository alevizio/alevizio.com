"use client";

import desktop from "@/assets/page/desktop.webp";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "./cn";

/* The landing page on a laptop, scrolling, the way the Pachama story shows
 * its site: the page from the file at 1440, set into the screen and read
 * top to bottom with a pause on each of its seven sections, then back up
 * to the top. Pointing at it holds it where it is; off screen it waits;
 * with less motion it rests on the hero. The laptop is drawn, not a photo:
 * a black lid with its notch, the base under it, the screen's light on the
 * ground. */

// Where each stop puts the top of the screen, as a share of the page's
// 5393 px: the top of each section (the cuts in page-anatomy.tsx), the
// last the bottom of the page, since the screen shows 935 px of it.
// Literal classes, for Tailwind.
const STOPS = [
  "translate-y-0",
  "-translate-y-[14.82%]",
  "-translate-y-[24.01%]",
  "-translate-y-[36.14%]",
  "-translate-y-[56.98%]",
  "-translate-y-[77.58%]",
  "-translate-y-[82.66%]",
];
const MOVE_MS = 1300;
const HOLD_MS = 1800;
// It starts as soon as it's landed on: a quarter of it in view, a beat later.
const START_AT = 0.25;
const START_MS = 500;
// Back to the top: a longer hold on the footer, a longer glide up.
const LAST_HOLD_MS = 2600;
const RETURN_MS = 2000;

// The laptop is about 1.56 times as wide as it is tall: on a short window it
// narrows so all of it fits on screen.
export const LaptopScroll = ({ caption, className }: { caption?: string; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [stop, setStop] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let at = 0;
    let visible = false;
    let held = false;
    const wait = (ms: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(step, ms);
    };
    function step() {
      if (!visible || held) return;
      at = (at + 1) % STOPS.length;
      setStop(at);
      wait(at === 0 ? RETURN_MS + HOLD_MS : MOVE_MS + (at === STOPS.length - 1 ? LAST_HOLD_MS : HOLD_MS));
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        const was = visible;
        visible = entry.intersectionRatio >= START_AT;
        if (visible && !was) wait(START_MS);
        if (!visible) window.clearTimeout(timer);
      },
      { threshold: [0, START_AT] },
    );
    observer.observe(el);
    const hold = () => {
      held = true;
      window.clearTimeout(timer);
    };
    const release = () => {
      held = false;
      wait(600);
    };
    el.addEventListener("pointerenter", hold);
    el.addEventListener("pointerleave", release);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      el.removeEventListener("pointerenter", hold);
      el.removeEventListener("pointerleave", release);
    };
  }, []);

  return (
    <figure data-reveal="frame" className={className}>
      <div
        ref={ref}
        role="img"
        aria-label="Earthscale's landing page on a laptop, scrolling top to bottom: Developer Tools for Earth Intelligence over a globe, the logos and a quote, who it's for, serving and exploring data, the catalog, and the closing ask"
        className="@container relative mx-auto w-full max-w-[min(70rem,calc((100svh-5rem)*1.56))] pb-[3cqw]"
      >
        {/* The screen's light on the ground behind it, and the shadow under the base. */}
        <div aria-hidden className="absolute inset-x-[6%] top-[4%] bottom-[10%] bg-[radial-gradient(closest-side,rgb(160_255_215/0.16),rgb(160_255_215/0)_100%)] blur-[3cqw]" />
        <div aria-hidden className="absolute bottom-[0.6cqw] left-1/2 h-[3cqw] w-[104%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(0_0_0/0.8),rgb(0_0_0/0))]" />
        {/* The lid: black glass round the screen, an aluminium hairline at its edge. */}
        <div className="relative mx-auto w-[89%] rounded-t-[1.9cqw] rounded-b-[0.5cqw] bg-[#0a0b0c] px-[1.15cqw] pt-[1.15cqw] pb-[1.7cqw] shadow-[0_0_0_1px_#2e3135,inset_0_0_0_1px_rgba(255,255,255,0.05),0_3cqw_6cqw_rgba(0,0,0,0.5)]">
          <div className="relative aspect-[1440/935] overflow-hidden rounded-[0.35cqw] bg-night">
            <Image
              src={desktop}
              alt=""
              sizes="(min-width: 1180px) 1000px, 86vw"
              placeholder="blur"
              className={cn(
                "h-auto w-full transition-transform ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform motion-reduce:transition-none",
                stop === 0 ? "duration-[2000ms]" : "duration-[1300ms]",
                STOPS[stop],
              )}
            />
            <span aria-hidden className="absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.06)_0%,rgb(255_255_255/0)_34%)]" />
          </div>
          <span aria-hidden className="absolute top-[1.15cqw] left-1/2 grid h-[1.75cqw] w-[5.8cqw] -translate-x-1/2 place-items-center rounded-b-[0.6cqw] bg-[#0a0b0c]">
            <span className="size-[0.45cqw] rounded-full bg-[#1b2230]" />
          </span>
        </div>
        {/* The base, seen from the front: its lit top edge and the dip to open it by. */}
        <div aria-hidden className="relative h-[1.6cqw] w-full rounded-t-[0.3cqw] rounded-b-[1.3cqw] bg-[linear-gradient(to_bottom,#6a6f76_0%,#2f3236_14%,#17191b_58%,#0b0c0d_100%)]">
          <span className="absolute top-0 left-1/2 h-[0.55cqw] w-[11cqw] -translate-x-1/2 rounded-b-[0.9cqw] bg-[linear-gradient(to_bottom,#0b0c0d,#2a2d31)]" />
        </div>
      </div>
      {caption ? <figcaption className="type-caption mt-3 text-(--tone-text)">{caption}</figcaption> : null}
    </figure>
  );
};
