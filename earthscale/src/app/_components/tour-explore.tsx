"use client";

import map0 from "@/assets/page/tour/map-0.webp";
import map1 from "@/assets/page/tour/map-1.webp";
import map2 from "@/assets/page/tour/map-2.webp";
import map3 from "@/assets/page/tour/map-3.webp";
import map4 from "@/assets/page/tour/map-4.webp";
import map5 from "@/assets/page/tour/map-5.webp";
import map6 from "@/assets/page/tour/map-6.webp";
import map7 from "@/assets/page/tour/map-7.webp";
import map8 from "@/assets/page/tour/map-8.webp";
import map9 from "@/assets/page/tour/map-9.webp";
import controls from "@/assets/page/tour/panel-controls.webp";
import edit from "@/assets/page/tour/panel-edit.webp";
import menu from "@/assets/page/tour/panel-menu.webp";
import pixel from "@/assets/page/tour/panel-pixel.webp";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { at, inOut } from "./pipeline-wires";

/* The explorer, working, over its sheet in the tour (tour-page.tsx), in
 * the section's own px: the map runs through the wind field's time steps,
 * the file's own animation of it (10:2021, forward and back), and the
 * layers panel's time slider moves with it; the four panels come in over
 * it one after another, on glass, the sub menu opening last. The panels
 * are the file's renders lifted off their background (scripts/
 * make-tour-layers.py), the slider drawn here. The map starts when its
 * strip comes in (data-in) and goes back to its first step when it goes. */

const FRAMES = [map0, map1, map2, map3, map4, map5, map6, map7, map8, map9];
const MAP = { x: 80, y: 386, width: 1280, height: 725 };
// The first step held while the panels come in, each step, the last held,
// each step back, the first held.
const STEP = 520;
const STEPS = [1400, ...Array<number>(9).fill(STEP), 900, ...Array<number>(9).fill(STEP), 900];
const LOOP = STEPS.reduce((a, b) => a + b, 0);
// Where the map is in its steps, t ms after it started.
const position = (t: number) => {
  const { step, ms } = at(STEPS, t % LOOP);
  if (step === 0) return 0;
  if (step <= 9) return step - 1 + inOut(ms / STEP);
  if (step === 10) return 9;
  if (step <= 19) return 9 - (step - 11) - inOut(ms / STEP);
  return 0;
};

// The slider, in the layers panel's px: its track, and the thumb's middle
// at the first step; each step moves it on 8 px.
const TRACK = { x: 73.75, y: 175.5, width: 142.5 };
const THUMB = 132;
const PER_STEP = 8;

// Each panel where the file has it, the order the file lays them in, and
// when it comes in. Their renders run 39 px left of and 8 px above their
// node, for the shadow.
type Panel = { src: StaticImageData; x: number; y: number; w: number; h: number; d: number; open?: true; slider?: true };
const PANELS: Panel[] = [
  { src: pixel, x: 1060, y: 339, w: 280, h: 607.3, d: 0.5 },
  { src: edit, x: 337, y: 745, w: 280, h: 386, d: 0.35 },
  { src: menu, x: 164, y: 908, w: 157, h: 150.3, d: 0.95, open: true },
  { src: controls, x: 41, y: 463, w: 280, h: 432, d: 0.2, slider: true },
];

const after = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export const TourExplore = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const strip = root?.closest<HTMLElement>("[data-strip]");
    const canvas = root?.querySelector<HTMLCanvasElement>("[data-map]");
    const context = canvas?.getContext("2d");
    const fill = root?.querySelector<HTMLElement>("[data-fill]");
    const thumb = root?.querySelector<HTMLElement>("[data-thumb]");
    if (!strip || !canvas || !context || !fill || !thumb || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let pictures: HTMLImageElement[] = [];
    let ready = false;
    let alive = true;
    let raf = 0;
    let start = 0;
    // It keeps time off screen, and only draws on it.
    let seen = false;
    const draw = (p: number) => {
      const i = Math.min(Math.floor(p), 8);
      context.globalAlpha = 1;
      context.drawImage(pictures[i], 0, 0);
      context.globalAlpha = p - i;
      context.drawImage(pictures[i + 1], 0, 0);
      fill.style.width = `${THUMB - TRACK.x + p * PER_STEP}px`;
      thumb.style.translate = `${p * PER_STEP}px 0`;
    };
    const tick = (now: number) => {
      if (seen) draw(position(now - start));
      raf = requestAnimationFrame(tick);
    };
    // It follows its strip. The steps load the first time it comes in (the
    // sheet's own map is the first one meanwhile), so a tour that never
    // plays, a phone's, never fetches them.
    const follow = () => {
      cancelAnimationFrame(raf);
      if (!strip.hasAttribute("data-in")) {
        // Back to the first step.
        context.clearRect(0, 0, canvas.width, canvas.height);
        fill.style.width = "";
        thumb.style.translate = "";
        return;
      }
      if (!ready) {
        if (pictures.length) return;
        pictures = FRAMES.map(({ src }) => Object.assign(new window.Image(), { src }));
        Promise.all(pictures.map((picture) => picture.decode())).then(
          () => {
            ready = true;
            if (alive) follow();
          },
          () => {},
        );
        return;
      }
      start = performance.now();
      raf = requestAnimationFrame(tick);
    };
    follow();
    const watch = new MutationObserver(follow);
    watch.observe(strip, { attributes: true, attributeFilter: ["data-in"] });
    const sight = new IntersectionObserver(([entry]) => {
      seen = entry.isIntersecting;
    });
    sight.observe(canvas);
    return () => {
      alive = false;
      watch.disconnect();
      sight.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref}>
      <canvas data-map width={MAP.width} height={MAP.height} className="absolute" style={{ left: MAP.x, top: MAP.y, width: MAP.width, height: MAP.height }} />
      {PANELS.map(({ src, x, y, w, h, d, open, slider }) => (
        <div key={src.src} data-t={open ? "open" : "lift"} className="absolute origin-top-left" style={{ left: x, top: y, width: w, height: h, ...after(d) }}>
          <div className="absolute inset-0 rounded-[16px] bg-[rgb(15_19_19/0.7)] backdrop-blur-[50px]" />
          <Image src={src} alt="" sizes="720px" loading="eager" className="absolute max-w-none" style={{ left: -39, top: -8, width: src.width / 2, height: src.height / 2 }} />
          {slider ? (
            <div>
              <span className="absolute h-px bg-[rgb(57_63_60)]" style={{ left: TRACK.x, top: TRACK.y, width: TRACK.width }} />
              <span data-fill className="absolute h-px bg-mist" style={{ left: TRACK.x, top: TRACK.y, width: THUMB - TRACK.x }} />
              <span data-thumb className="absolute size-2 rounded-full bg-[#d9d9d9]" style={{ left: THUMB - 4, top: TRACK.y - 3.5 }} />
            </div>
          ) : null}
        </div>
      ))}
      {/* The file's fade over the foot of the map and the panels. */}
      <div className="absolute h-[202px] bg-[linear-gradient(rgb(15_19_19/0),#0f1313)]" style={{ left: MAP.x, top: 893.5, width: MAP.width }} />
      <div className="absolute h-[111px] w-[1322px] bg-[#0f1313]" style={{ left: MAP.x, top: 1095 }} />
    </div>
  );
};
