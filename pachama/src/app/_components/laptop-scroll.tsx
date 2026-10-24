"use client";

import home from "@/assets/brand/website-home.jpg";
import laptop from "@/assets/howhow/web-l.jpg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "./cn";
import { BLEED } from "./shot";
import { PAGE } from "./story";

/* The new pachama.com on How&How's laptop, scrolling: the homepage from the
 * site's Figma, set into the laptop's screen and read top to bottom, a pause
 * on each section, then back up to the top. Pointing at it holds it where it
 * is; off screen it waits; with less motion it rests on the hero. The
 * screen's place in the photo (1920 x 1080) is measured from it, and the
 * notch drawn back over the page. The photo starts a little below the
 * laptop, so the lid's top edge rises above it: a second copy of the photo
 * shows only the lid there. */

// Where each stop puts the top of the screen, as a share of the page's
// height: a section at a time, the last the bottom of the page (the screen
// shows 1674 of its 13467 px). Literal classes, for Tailwind.
const STOPS = [
  "translate-y-0",
  "-translate-y-[20.05%]",
  "-translate-y-[31.26%]",
  "-translate-y-[43.74%]",
  "-translate-y-[53.76%]",
  "-translate-y-[65.34%]",
  "-translate-y-[75%]",
  "-translate-y-[87.56%]",
];
const MOVE_MS = 1300;
const HOLD_MS = 1800;
// Back to the top: a longer hold on the footer, a longer glide up.
const LAST_HOLD_MS = 2600;
const RETURN_MS = 2000;

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
        visible = entry.intersectionRatio >= 0.4;
        if (visible && !was) wait(HOLD_MS);
        if (!visible) window.clearTimeout(timer);
      },
      { threshold: [0, 0.4] },
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
    // Pulled up by the empty band the cut leaves over the lid.
    <figure data-reveal="frame" className={cn(BLEED, "-mt-[6vw]", className)}>
      <div
        ref={ref}
        role="img"
        aria-label="The new pachama.com on a laptop among leaves, scrolling through the homepage: 'Restore nature. Remove carbon.' over an aerial river, 'See carbon in action' with a lidar tree and an emissions chart, the companies choosing Pachama, the technology, a BCG quote, resources and the footer"
        className="@container relative"
      >
        <Image src={laptop} alt="" sizes="100vw" placeholder="blur" className="h-auto w-full [clip-path:inset(18.5%_0_0_0)]" />
        {/* The lid alone, from its top edge (12.6% down, 18.1% to 81.8% across) to where the photo starts. */}
        <Image
          src={laptop}
          alt=""
          sizes="100vw"
          className="absolute inset-x-0 top-0 h-auto w-full [clip-path:inset(12.55%_18.15%_80%_18.05%_round_1.5cqw_1.5cqw_0_0)]"
        />
        <div className="absolute top-[14.58%] left-[19.19%] h-[70.83%] w-[61.67%] overflow-hidden rounded-t-[0.52cqw] bg-[#fbfbf2]">
          <Image
            src={home}
            alt=""
            sizes="62vw"
            className={cn(
              "h-auto w-full transition-transform ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform motion-reduce:transition-none",
              stop === 0 ? "duration-[2000ms]" : "duration-[1300ms]",
              STOPS[stop],
            )}
          />
        </div>
        <span aria-hidden className="absolute top-[14.58%] left-[46.72%] h-[2.03%] w-[6.56%] rounded-b-[0.42cqw] bg-[#0b0c09]" />
      </div>
      {caption ? <figcaption className={cn("type-caption mt-3 text-(--tone-text)", PAGE)}>{caption}</figcaption> : null}
    </figure>
  );
};
