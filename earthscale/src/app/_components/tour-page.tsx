"use client";

import catalog from "@/assets/page/anat/06-catalog.webp";
import explore from "@/assets/page/anat/05-explore.webp";
import ask from "@/assets/page/anat/07-ask.webp";
import proof from "@/assets/page/anat/02-proof.webp";
import serve from "@/assets/page/anat/04-serve.webp";
import who from "@/assets/page/anat/03-who.webp";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useId, useRef, type CSSProperties } from "react";
import { cn } from "./cn";
import { clamp, drawWire, findWire, Halo, inOut, out, set, Wire, type WireParts } from "./pipeline-wires";
import { HERO, TourHero } from "./tour-hero";

/* The landing page as the tour scrolls it, working: the hero live, and
 * each section after it the file's own sheet, cut into strips that come in
 * the way the case study's own things do as they scroll into the browser
 * (stage-look.css): text rises, pictures open upward, a beat apart. As it
 * scrolls the planet lags behind the hero's words, which lead and fade,
 * and the pictures drift a little slower than the page inside their
 * strips, so the page has depth. The serve diagram draws itself the way
 * Serve, live does. Everything comes in once a pass and goes when the
 * hero does, at the top, where none of it shows. */
export const PAGE_W = 1040;
const WIDE = PAGE_W / HERO.width;
const DRIFT = 14; // how far a picture drifts in its strip, at most
const DEPTH = 0.05; // and how fast, of its distance from the middle
const PLANET = 0.4; // how far the planet lags the scroll
const COPY = 0.12; // how far the hero's words lead it

// A strip of a sheet, in its 1040-wide px: from y to `to` (the foot, less
// the drift for a picture), x to x + w; how it comes in, and when. The
// proof's first 40 px are the hero's planet running on, under the live
// hero's foot, so they're left out.
type Cut = { y: number; to?: number; x?: number; w?: number; open?: true; depth?: true; after?: number; wires?: true; under?: true };
const SECTIONS: { sheet: StaticImageData; cuts: Cut[] }[] = [
  { sheet: proof, cuts: [{ y: 0, to: 130, under: true }, { y: 130, after: 1 }] },
  { sheet: who, cuts: [{ y: 0, to: 145 }, { y: 145, open: true, depth: true, after: 1 }] },
  { sheet: serve, cuts: [{ y: 0, to: 200 }, { y: 200, w: 445, after: 1 }, { y: 200, x: 445, open: true, depth: true, after: 2, wires: true }] },
  { sheet: explore, cuts: [{ y: 0, to: 165 }, { y: 165, open: true, depth: true, after: 1 }] },
  { sheet: catalog, cuts: [{ y: 0, to: 135 }, { y: 135, w: 495, open: true, depth: true, after: 1 }, { y: 135, x: 495, open: true, depth: true, after: 2 }] },
  { sheet: ask, cuts: [{ y: 0, to: 235 }, { y: 235, after: 1 }] },
];
const tall = (sheet: StaticImageData) => (sheet.height * PAGE_W) / sheet.width;

// Where each section starts down the page, under the hero.
const TOPS = SECTIONS.reduce<number[]>((tops, { sheet }, i) => [...tops, tops[i] + tall(sheet)], [HERO.height * WIDE]);
/** The page's height, and where each section starts, for the tour's stops. */
export const PAGE_H = TOPS[SECTIONS.length];
export const SECTION_TOPS = TOPS.slice(0, -1);

// Every strip, down the page, with its section and where it sits on it.
const STRIPS = SECTIONS.flatMap(({ sheet, cuts }, section) =>
  cuts.map(({ x = 0, w = PAGE_W - x, ...cut }) => {
    const h = (cut.to ?? tall(sheet) - (cut.depth ? DRIFT : 0)) - cut.y;
    return { ...cut, x, w, h, sheet, section, top: TOPS[section] + cut.y, mid: TOPS[section] + cut.y + h / 2 };
  }),
);
type Strip = (typeof STRIPS)[number];

// The serve diagram's wires over the sheet's own, in its px: the sources
// round into the join, the line down into the client, and out of it.
const LEFT = "M545.8 264.4V304.4Q545.8 309.1 550.5 309.1H608.3";
const RIGHT = "M662.6 264.4V304.4Q662.6 309.1 657.9 309.1H608.3";
const TRUNK = "M608.3 309.1V351.2";
const DROP = "M685 546V611";
const SERVED = 2700; // ms, the diagram drawn

type Wires = { wires: WireParts[]; flash: SVGCircleElement };
// The diagram, t ms after its strip came in (or not yet, below zero).
const drawServe = ({ wires: [left, right, trunk, drop], flash }: Wires, t: number) => {
  const sources = inOut(clamp((t - 200) / 1200));
  const into = inOut(clamp((t - 1400) / 280));
  const down = inOut(clamp((t - 2100) / 420));
  const flow = t >= SERVED;
  drawWire(left, sources, sources > 0 && sources < 1, flow, 1);
  drawWire(right, sources, sources > 0 && sources < 1, flow, 1);
  drawWire(trunk, into, into > 0 && into < 1, flow, 1);
  drawWire(drop, down, down > 0 && down < 1, flow, 1);
  const ring = clamp((t - 1680) / 650);
  set(flash, "r", 3 + 12 * out(ring));
  set(flash, "opacity", ring > 0 && ring < 1 ? 0.85 * (1 - ring) : 0);
};

const ServeWires = () => {
  const halo = `${useId().replace(/[^\w-]/g, "")}-halo`;
  return (
    <svg data-wires viewBox={`0 0 ${PAGE_W} ${tall(serve)}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
      <defs>
        <Halo id={halo} />
      </defs>
      <Wire name="left" d={LEFT} halo={halo} />
      <Wire name="right" d={RIGHT} halo={halo} />
      <Wire name="trunk" d={TRUNK} halo={halo} />
      <Wire name="drop" d={DROP} halo={halo} />
      <circle data-flash cx={608.3} cy={309.1} r={3} fill="none" stroke="#a0ffd7" opacity={0} />
    </svg>
  );
};

// A strip's pane: a window on its sheet, which drifts inside it if it's a
// picture.
const Pane = ({ sheet, x, y, w, h, open, after = 0, wires, under }: Strip) => (
  <div
    data-strip={open ? "open" : "rise"}
    className={cn("absolute overflow-hidden", under && "[mask-image:linear-gradient(transparent_36px,black_41px)]")}
    style={{ left: x, top: y, width: w, height: h, "--d": `${after * 0.09}s` } as CSSProperties}
  >
    <div className="absolute" style={{ left: -x, top: -y, width: PAGE_W, height: tall(sheet) }}>
      <Image src={sheet} alt="" sizes="1100px" loading="eager" className="block h-auto w-full" />
      {wires ? <ServeWires /> : null}
    </div>
  </div>
);

export const TourPage = ({ on }: { on: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const scroller = root?.closest<HTMLElement>(".ss-scroll");
    const planet = root?.querySelector<HTMLElement>("[data-planet]");
    const copy = root?.querySelector<HTMLElement>("[data-copy]");
    const svg = root?.querySelector<SVGSVGElement>("[data-wires]");
    const flash = svg?.querySelector<SVGCircleElement>("[data-flash]");
    if (!root || !scroller || !planet || !copy || !svg || !flash) return;
    const strips = [...root.querySelectorAll<HTMLElement>("[data-strip]")];
    const diagram: Wires = { wires: ["left", "right", "trunk", "drop"].map((name) => findWire(svg, name)), flash };
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let served = 0;

    // Gone, at the top, ready for the next pass.
    if (!on) {
      for (const el of strips) el.removeAttribute("data-in");
      drawServe(diagram, -1);
      return;
    }
    if (still) {
      drawServe(diagram, SERVED);
      return;
    }
    const draw = (now: number) => {
      drawServe(diagram, now - served);
      raf = now - served < SERVED ? requestAnimationFrame(draw) : 0;
    };
    const update = () => {
      const y = scroller.scrollTop;
      const middle = y + scroller.clientHeight / 2;
      planet.style.translate = `0 ${(y * PLANET) / WIDE}px`;
      copy.style.translate = `0 ${(-y * COPY) / WIDE}px`;
      copy.style.opacity = String(1 - clamp(y / 420));
      STRIPS.forEach((strip, i) => {
        const el = strips[i];
        if (strip.depth) (el.firstElementChild as HTMLElement).style.translate = `0 ${Math.max(-DRIFT, Math.min(DRIFT, (middle - strip.mid) * DEPTH))}px`;
        if (el.hasAttribute("data-in") || strip.top > y + scroller.clientHeight * 0.92) return;
        el.setAttribute("data-in", "");
        if (strip.wires && !served) {
          served = performance.now() + 500;
          raf = requestAnimationFrame(draw);
        }
      });
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", update);
      cancelAnimationFrame(raf);
    };
  }, [on]);

  return (
    <div ref={ref} className="relative" style={{ height: PAGE_H }}>
      {SECTIONS.map(({ sheet }, i) => (
        <div key={sheet.src} className="absolute inset-x-0 bg-[#0e1313]" style={{ top: TOPS[i], height: tall(sheet) }}>
          {STRIPS.filter((strip) => strip.section === i).map((strip) => (
            <Pane key={`${strip.x}-${strip.y}`} {...strip} />
          ))}
        </div>
      ))}
      <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${WIDE})` }}>
        <TourHero on={on} className="tour-hero relative overflow-hidden" />
      </div>
    </div>
  );
};
