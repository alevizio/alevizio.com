"use client";

import catalog from "@/assets/page/anat/06-catalog.webp";
import ask from "@/assets/page/anat/07-ask.webp";
import proof from "@/assets/page/anat/02-proof.webp";
import who from "@/assets/page/anat/03-who.webp";
import explore from "@/assets/page/tour/explore-base.webp";
import serve from "@/assets/page/tour/serve-base.webp";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, type ComponentType, type CSSProperties } from "react";
import { cn } from "./cn";
import { clamp } from "./pipeline-wires";
import { TourAsk } from "./tour-ask";
import { TourCatalog } from "./tour-catalog";
import { TourQuote, TourWhoCards, TourWhoTitle } from "./tour-copy";
import { TourExplore } from "./tour-explore";
import { HERO, TourHero } from "./tour-hero";
import { drawServe, findServe, SERVED, ServeDiagram, ServeFeatures, ServeWires } from "./tour-serve";

/* The landing page as the tour scrolls it, working: the hero live, its
 * planet turning, and each section after it the file's own sheet, cut
 * into strips that come in the way the case study's own things do as they
 * scroll into the browser (stage-look.css): text rises, pictures open
 * upward, a beat apart. Where the file has a section in pieces it plays
 * live over its strip or in place of it: the quote changes, the who cards
 * build themselves, the explorer's map runs through its time steps under
 * its panels, the catalog's panels work, and the closing ask and footer
 * come in all at once over the turning globe. As it scrolls the planet
 * lags behind the hero's words, which lead and fade, and the pictures
 * drift a little slower than the page inside their strips, so the page
 * has depth. The serve section plays the way the case study's own Serve
 * does (tour-serve.tsx).
 * Everything comes in once a pass and goes when the hero does, at the
 * top, where none of it shows. */
export const PAGE_W = 1040;
const WIDE = PAGE_W / HERO.width;
const DRIFT = 14; // how far a picture drifts in its strip, at most
const DEPTH = 0.05; // and how fast, of its distance from the middle
const PLANET = 0.4; // how far the planet lags the scroll
const COPY = 0.12; // how far the hero's words lead it

// A strip of a sheet, in its 1040-wide px: from y to `to` (the foot, less
// the drift for a picture), x to x + w; how it comes in, and when. The
// proof's first 40 px are the hero's planet running on, under the live
// hero's foot, so they're left out. A cut between strips runs through
// empty page (serve's, at 470, clears the cross at its list's corner, so
// the diagram's drift doesn't split it). A strip can carry a live piece, drawn
// in the section's own 1440 px over the sheet, or bare, in place of it;
// its pieces come in on their own, unless it comes in whole. It comes in
// once its top is `at` down the view (0.92 unless it says).
type Live = ComponentType<{ on: boolean }>;
type Cut = { y: number; to?: number; x?: number; w?: number; open?: true; depth?: true; after?: number; wires?: true; under?: true; live?: Live; bare?: true; whole?: true; at?: number };
const SECTIONS: { sheet: StaticImageData; cuts: Cut[] }[] = [
  { sheet: proof, cuts: [{ y: 0, to: 76, under: true }, { y: 76, live: TourQuote, bare: true }] },
  { sheet: who, cuts: [{ y: 0, to: 160, live: TourWhoTitle, bare: true }, { y: 160, live: TourWhoCards, bare: true, at: 0.55 }] },
  {
    sheet: serve,
    cuts: [
      { y: 0, to: 200 },
      { y: 200, w: 470, after: 1, live: ServeFeatures, whole: true },
      { y: 200, x: 470, open: true, depth: true, after: 2, wires: true, live: ServeDiagram },
    ],
  },
  { sheet: explore, cuts: [{ y: 0, to: 165 }, { y: 165, open: true, depth: true, after: 1, live: TourExplore }] },
  { sheet: catalog, cuts: [{ y: 0, to: 150 }, { y: 150, live: TourCatalog, bare: true }] },
  { sheet: ask, cuts: [{ y: 0, live: TourAsk, bare: true, whole: true }] },
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

// A strip's pane: a window on its sheet, which drifts inside it if it's a
// picture, with its live piece over it.
const Pane = ({ sheet, x, y, w, h, open, after = 0, wires, under, live: Live, bare, whole, on }: Strip & { on: boolean }) => (
  <div
    data-strip={open ? "open" : Live && !whole ? "live" : "rise"}
    className={cn("absolute overflow-hidden", under && "[mask-image:linear-gradient(transparent_36px,black_41px)]")}
    style={{ left: x, top: y, width: w, height: h, "--d": `${after * 0.09}s` } as CSSProperties}
  >
    <div className="absolute" style={{ left: -x, top: -y, width: PAGE_W, height: tall(sheet) }}>
      {bare ? null : <Image src={sheet} alt="" sizes="1100px" loading="eager" className="block h-auto w-full" />}
      {wires ? <ServeWires width={PAGE_W} height={tall(sheet)} /> : null}
      {Live ? (
        <div className="absolute top-0 left-0 w-[1440px] origin-top-left font-sans" style={{ height: tall(sheet) / WIDE, transform: `scale(${WIDE})` }}>
          <Live on={on} />
        </div>
      ) : null}
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
    const diagram = root && findServe(root);
    if (!root || !scroller || !planet || !copy || !diagram) return;
    const strips = [...root.querySelectorAll<HTMLElement>("[data-strip]")];
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
        if (el.hasAttribute("data-in") || strip.top > y + scroller.clientHeight * (strip.at ?? 0.92)) return;
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
            <Pane key={`${strip.x}-${strip.y}`} {...strip} on={on} />
          ))}
        </div>
      ))}
      <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${WIDE})` }}>
        <TourHero on={on} className="tour-hero relative overflow-hidden" />
      </div>
    </div>
  );
};
