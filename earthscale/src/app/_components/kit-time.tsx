"use client";

import { Stage, type Act } from "@/stageshow/kit";
import { RxChevronLeft, RxChevronRight, RxDropdownMenu } from "react-icons/rx";
import { cn } from "./cn";
import type { Slot } from "./kit-tiles";

/* The layers panel's time slider, out on its own and given the cell's
 * width: a data set's years along the track, the date over the thumb. It
 * steps forward a year at a time, the chevron pressed each time, then is
 * dragged on to the latest, where the layers panel has it, holds, and is
 * dragged back to start again. With less motion it rests on the latest. */
const YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const LAST = YEARS.length - 1;
const STEP_MS = 450;
const DRAG_MS = 180;
const BACK_MS = 110;

type Time = { at: number; press: boolean; glide: number };
const first: Time = { at: 0, press: false, glide: STEP_MS };
const latest: Time = { at: LAST, press: false, glide: STEP_MS };

async function scrub(a: Act<Time>) {
  await a.wait(800);
  for (let at = 1; at <= 3; at++) {
    await a.set({ press: true });
    await a.wait(150);
    await a.set({ press: false, at, glide: STEP_MS });
    await a.wait(650);
  }
  await a.wait(300);
  for (let at = 4; at <= LAST; at++) {
    await a.set({ at, glide: DRAG_MS });
    await a.wait(DRAG_MS);
  }
  await a.wait(1800);
  for (let at = LAST - 1; at >= 0; at--) {
    await a.set({ at, glide: BACK_MS });
    await a.wait(BACK_MS);
  }
  await a.set({ glide: STEP_MS });
  await a.wait(500);
}

const Chevron = ({ Icon, on }: { Icon: typeof RxChevronLeft; on: boolean }) => (
  <span className={cn("grid size-8 shrink-0 place-items-center rounded-md transition-[background-color,color,scale] duration-150", on ? "scale-90 bg-mint/15 text-mint" : "text-mist")}>
    <Icon aria-hidden className="size-4" />
  </span>
);

export const TimeStage = ({ width, height }: Slot) => {
  // Narrow, every other year is named.
  const narrow = width < 520;
  return (
    <Stage<Time> width={width} height={height} theme="dark" initial={first} poster={latest} play="loop" script={scrub} className="look-earthscale">
      {(s) => {
        const pos = `${(s.at / LAST) * 100}%`;
        const glide = { transitionDuration: `${s.glide}ms`, transitionTimingFunction: s.glide === STEP_MS ? "cubic-bezier(0.22,1,0.36,1)" : "linear" };
        const dragging = s.glide !== STEP_MS;
        return (
          <div className="absolute inset-x-7 flex items-center gap-3 sm:gap-4" style={{ top: height / 2 - 16 }}>
            <span className="font-mono text-[12px] text-haze">Time</span>
            <Chevron Icon={RxChevronLeft} on={false} />
            <div className="relative h-8 min-w-0 flex-1">
              <span className="absolute inset-x-0 top-1/2 h-px bg-rule" />
              <span className="absolute top-1/2 left-0 h-px bg-mint transition-[width]" style={{ width: pos, ...glide }} />
              {YEARS.map((year, i) => (
                <span key={year} className="absolute top-[calc(50%+10px)] -translate-x-1/2" style={{ left: `${(i / LAST) * 100}%` }}>
                  <span className={cn("mx-auto block h-1.5 w-px transition-colors duration-300", i <= s.at ? "bg-mint/60" : "bg-mist/25")} />
                  {!narrow || i % 2 === 0 ? <span className={cn("mt-1.5 block font-mono text-[10px] transition-colors duration-300", i === s.at ? "text-mist" : "text-haze/70")}>{year}</span> : null}
                </span>
              ))}
              <span className="absolute top-1/2 transition-[left]" style={{ left: pos, ...glide }}>
                <span className="absolute bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 rounded-full border border-mint/40 bg-night px-2.5 py-1 font-mono text-[11px] whitespace-nowrap text-mint">{YEARS[s.at]}-02-27</span>
                <span className={cn("absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint transition-shadow duration-200", dragging ? "shadow-[0_0_0_6px_rgba(160,255,215,0.22)]" : "shadow-[0_0_0_3px_rgba(160,255,215,0.18)]")} />
              </span>
            </div>
            <Chevron Icon={RxChevronRight} on={s.press} />
            <RxDropdownMenu aria-hidden className="size-4 shrink-0 text-haze" />
          </div>
        );
      }}
    </Stage>
  );
};
