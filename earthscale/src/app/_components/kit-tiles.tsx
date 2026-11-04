"use client";

import { Stage, type Act } from "@/stageshow/kit";
import { useEffect, useRef } from "react";
import {
  RxActivityLog, RxArrowUp, RxBarChart, RxChatBubble, RxCheckCircled, RxChevronLeft, RxChevronRight, RxCode, RxColorWheel, RxCopy, RxCross2, RxCrosshair1, RxCube, RxDotsVertical,
  RxDownload, RxDrawingPin, RxDropdownMenu, RxEnterFullScreen, RxEraser, RxExit, RxEyeClosed, RxEyeOpen, RxGear, RxGlobe, RxLayers, RxLink1, RxMagnifyingGlass, RxMix, RxOpacity,
  RxPencil1, RxReload, RxRulerSquare, RxShare1, RxSquare, RxTable, RxTarget, RxTimer, RxUpload, RxZoomIn, RxZoomOut,
} from "react-icons/rx";
import { cn } from "./cn";
import { RAMPS } from "./ramps";

/* The kit grid's ramps and icons. Each comes in as the grid comes into
 * view, a beat after the one before it in reading order, and then keeps
 * going: a probe sweeps across the ramps, the icons go by. With less
 * motion each rests on its end. */
const LEAD = 450;
const STEP = 110;
const ARRIVE = "ease-[cubic-bezier(0.25,0.8,0.25,1)]";

type Beat = { on: boolean };
const before: Beat = { on: false };
const after: Beat = { on: true };
const beat = (i: number) => async (a: Act<Beat>) => {
  await a.wait(LEAD + i * STEP);
  await a.set({ on: true });
};
const delay = (on: boolean, ms: number) => ({ transitionDelay: on ? `${ms}ms` : "0ms" });

/** What every tile's picture gets: its cell's slot, measured. */
export type Slot = { width: number; height: number };

/** The five ramps, named, running off the tile's right edge. Once they're
 *  in, a probe sweeps across them and back: one value, the colour each
 *  ramp gives it, and the value under them. */
const STOPS = RAMPS.map(({ css }) => (css.match(/#[0-9a-f]{6}/g) ?? []).map((hex) => [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16))));
// A ramp's colour at f along it, between its stops, as the gradient blends them.
const colourAt = (stops: number[][], f: number) => {
  const span = f * (stops.length - 1);
  const k = Math.min(stops.length - 2, Math.floor(span));
  return `rgb(${stops[k].map((c, j) => Math.round(c + (stops[k + 1][j] - c) * (span - k))).join(" ")})`;
};
const SETTLE = 1500; // for the ramps to arrive before the probe does
const SWEEP = 2800;
const HOLD = 600;
const PAD = 28; // the ramps' left edge
const OVER = 12; // how far they run past the right edge

const Ramps = ({ on, width }: Beat & { width: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const value = root?.querySelector<HTMLElement>("[data-value]");
    if (!root || !value || !on || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dots = [...root.querySelectorAll<HTMLElement>("[data-dot]")];
    const shown = width - PAD;
    const whole = shown + OVER;
    let raf = 0;
    let start = 0;
    const frame = (now: number) => {
      start ||= now;
      const t = (now - start) % (2 * (SWEEP + HOLD));
      const u = Math.min(1, (t % (SWEEP + HOLD)) / SWEEP);
      const eased = (1 - Math.cos(Math.PI * u)) / 2;
      const x = shown * (0.2 + 0.72 * (t < SWEEP + HOLD ? eased : 1 - eased));
      root.style.setProperty("--probe", `${x}px`);
      dots.forEach((dot, i) => (dot.style.backgroundColor = colourAt(STOPS[i], x / whole)));
      value.textContent = (x / whole).toFixed(2);
      raf = requestAnimationFrame(frame);
    };
    const seen = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(frame);
    });
    const settle = setTimeout(() => {
      root.toggleAttribute("data-probe", true);
      seen.observe(root);
    }, SETTLE);
    return () => {
      clearTimeout(settle);
      seen.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [on, width]);

  const probe = "opacity-0 transition-opacity duration-500 group-data-[probe]/probe:opacity-100";
  return (
    <div ref={ref} className="group/probe absolute inset-x-0 top-1 bottom-7 grid content-between pl-7">
      {RAMPS.map(({ name, css }, i) => (
        <div key={name} className="grid gap-1.5">
          <span className="font-mono text-[11px] text-haze">{name}</span>
          <span className="relative">
            <span className={cn("block h-6 w-[calc(100%+2.5rem)] rounded-l-[6px] transition-[translate,opacity] duration-[900ms]", ARRIVE, css, on ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0")} style={delay(on, i * 90)} />
            <span data-dot className={cn("absolute top-1/2 left-(--probe) size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-mist shadow-[0_0_0_1px_rgb(0_0_0/0.35),0_2px_8px_rgb(0_0_0/0.4)]", probe)} />
          </span>
        </div>
      ))}
      <span className={cn("absolute inset-y-0 left-[calc(28px+var(--probe))] w-px bg-mist/30", probe)} />
      <span data-value className={cn("absolute -bottom-6 left-[calc(28px+var(--probe))] -translate-x-1/2 font-mono text-[10px] text-mint", probe)} />
    </div>
  );
};

export const RampsStage = ({ width, height }: Slot) => (
  <Stage<Beat> width={width} height={height} theme="dark" initial={before} poster={after} play="once" script={beat(1)} className="look-earthscale">
    {(s) => <Ramps on={s.on} width={width} />}
  </Stage>
);

/** The file's icons, its Radix set (10:4757), on one row running off both
 *  sides; the ones the panels use light up one after another: the eye, the
 *  layers, the globe, the crosshair, the zoom, the pencil, the comment, the
 *  colour wheel. */
const ICONS = [
  RxEyeOpen, RxEyeClosed, RxLayers, RxGlobe, RxCrosshair1, RxTarget, RxRulerSquare, RxMagnifyingGlass, RxZoomIn, RxZoomOut, RxEnterFullScreen, RxExit, RxDotsVertical, RxDropdownMenu,
  RxChevronLeft, RxChevronRight, RxCheckCircled, RxCross2, RxCopy, RxSquare, RxEraser, RxPencil1, RxChatBubble, RxArrowUp, RxDrawingPin, RxLink1, RxShare1, RxDownload, RxUpload,
  RxReload, RxTimer, RxGear, RxMix, RxOpacity, RxColorWheel, RxCube, RxTable, RxBarChart, RxActivityLog, RxCode,
];
// The row's order puts the eight in use in its middle, where every width
// shows them first.
const ORDER = [5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 0, 17, 2, 18, 3, 19, 4, 20, 8, 23, 21, 24, 22, 25, 34, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38, 39, 1];
const LIT = [0, 2, 3, 4, 8, 21, 22, 34];
const CELL = 56;
/** The row goes by: two copies end to end, moved one copy's length and
 *  started over, so it never runs out. Pointing at it holds it. */
export const IconsStage = ({ width, height }: Slot) => {
  const row = ICONS.length * CELL;
  return (
    <Stage<Beat> width={width} height={height} theme="dark" initial={before} poster={after} play="once" script={beat(4)} className="look-earthscale">
      {(s) => (
        <div
          className="absolute flex w-max motion-safe:animate-[es-marquee_70s_linear_infinite] hover:[animation-play-state:paused]"
          style={{ left: (width - row) / 2, top: (height - CELL) / 2 - 10 }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {ORDER.map((i) => {
                const Icon = ICONS[i];
                const lit = LIT.indexOf(i);
                const on = s.on && lit >= 0;
                return (
                  <span key={i} className="grid size-14 place-items-center">
                    <span className={cn("grid size-12 place-items-center rounded-[10px] transition-colors duration-500", on ? "bg-mint/15 text-mint" : "text-mist/45")} style={delay(on, lit * 120)}>
                      <Icon aria-hidden className="size-6" />
                    </span>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </Stage>
  );
};
