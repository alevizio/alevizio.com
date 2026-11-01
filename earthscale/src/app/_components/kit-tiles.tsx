"use client";

import planet from "@/assets/page/anat/planet.webp";
import { Stage, type Act } from "@/stageshow/kit";
import Image from "next/image";
import type { ReactNode } from "react";
import { FiDatabase } from "react-icons/fi";
import {
  RxActivityLog, RxArrowUp, RxBarChart, RxChatBubble, RxCheckCircled, RxChevronLeft, RxChevronRight, RxCode, RxColorWheel, RxCopy, RxCross2, RxCrosshair1, RxCube, RxDotsVertical,
  RxDownload, RxDrawingPin, RxDropdownMenu, RxEnterFullScreen, RxEraser, RxExit, RxEyeClosed, RxEyeOpen, RxGear, RxGlobe, RxLayers, RxLink1, RxMagnifyingGlass, RxMix, RxOpacity,
  RxPencil1, RxReload, RxRulerSquare, RxShare1, RxSquare, RxTable, RxTarget, RxTimer, RxUpload, RxZoomIn, RxZoomOut,
} from "react-icons/rx";
import { cn } from "./cn";
import { RAMPS } from "./ramps";
import { SignupField, type SignupPhase } from "./signup-field";
import { MARK, MARK_VIEWBOX } from "./wordmark-paths";

/* The kit grid's other tiles. Each picture does one small thing, once, as
 * the grid comes into view, a beat after the one before it in reading
 * order: the ramps arrive, the diagram draws, the field takes an email,
 * the icons the panels use light up. With less motion each rests on its
 * end. */
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

/** The five ramps, named, running off the tile's right edge. */
export const RampsStage = ({ width, height }: Slot) => (
  <Stage<Beat> width={width} height={height} theme="dark" initial={before} poster={after} play="once" script={beat(1)} className="look-earthscale">
    {(s) => (
      <div className="absolute inset-x-0 top-1 bottom-7 grid content-between pl-7">
        {RAMPS.map(({ name, css }, i) => (
          <div key={name} className="grid gap-1.5">
            <span className="font-mono text-[11px] text-haze">{name}</span>
            <span className={cn("h-6 w-[calc(100%+2.5rem)] rounded-l-[6px] transition-[translate,opacity] duration-[900ms]", ARRIVE, css, s.on ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0")} style={delay(s.on, i * 90)} />
          </div>
        ))}
      </div>
    )}
  </Stage>
);

/** The serve diagram, cut to its bones: two sources join into Earthscale
 *  and come out as tiles. The lines draw, then the tiles arrive. */
const Chip = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cn("absolute inline-flex h-9 items-center gap-2 rounded-md border border-rule bg-card px-3 font-mono text-[11px] whitespace-nowrap text-mist", className)}>{children}</span>
);
export const PipeStage = ({ width, height }: Slot) => {
  const mid = width / 2;
  // The diagram is 182 tall; it sits in the middle of whatever the cell gives.
  const y = Math.max(0, Math.round((height - 182) / 2));
  const left = 28 + 62;
  const right = width - 28 - 52;
  const draw = (on: boolean, ms: number) => ({ strokeDashoffset: on ? 0 : 1, transition: `stroke-dashoffset 900ms cubic-bezier(0.45,0,0.1,1) ${on ? ms : 0}ms` });
  return (
    <Stage<Beat> width={width} height={height} theme="dark" initial={before} poster={after} play="once" script={beat(2)} className="look-earthscale">
      {(s) => (
        <div className="absolute inset-x-0" style={{ top: y, height: 182 }}>
          <Chip className="top-3 left-7">
            Cloud Storage <FiDatabase aria-hidden className="size-3.5 text-haze" />
          </Chip>
          <Chip className="top-3 right-7">
            Database <FiDatabase aria-hidden className="size-3.5 text-haze" />
          </Chip>
          <svg width={width} height={182} className="absolute inset-0" aria-hidden>
            <path d={`M${left} 48 V78 H${mid} M${right} 48 V78 H${mid} M${mid} 78 V92`} fill="none" stroke="rgb(230 246 231 / 0.16)" />
            <path d={`M${left} 48 V78 H${mid} V92`} fill="none" stroke="#a0ffd7" pathLength={1} strokeDasharray="1" style={draw(s.on, 0)} />
            <path d={`M${right} 48 V78 H${mid} V92`} fill="none" stroke="#a0ffd7" pathLength={1} strokeDasharray="1" style={draw(s.on, 0)} />
            <path d={`M${mid} 124 V146`} fill="none" stroke="#a0ffd7" pathLength={1} strokeDasharray="1" style={draw(s.on, 700)} />
          </svg>
          <span className="absolute grid size-8 place-items-center rounded-full border border-rule bg-card text-mist" style={{ left: mid - 16, top: 92 }}>
            <svg viewBox={MARK_VIEWBOX} className="size-4" aria-hidden>
              {MARK.map((d) => (
                <path key={d} d={d} fill="currentColor" fillRule="evenodd" />
              ))}
            </svg>
          </span>
          <Chip className={cn("top-[146px] left-1/2 -translate-x-1/2 transition-[translate,opacity] duration-700 will-change-transform", ARRIVE, s.on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")}>{"{z}/{x}/{y}.webp"}</Chip>
        </div>
      )}
    </Stage>
  );
};

/** The hero's field over the hero's planet, the way the page sets it,
 *  taking an email and confirming it. The planet runs off the tile's right
 *  and foot and fades in from the left, so it has no edge of its own. */
const EMAIL = "noah@earthscale.ai";
type Signup = { email: string; phase: SignupPhase; pressed: boolean };
const empty: Signup = { email: "", phase: "idle", pressed: false };
const signed: Signup = { email: EMAIL, phase: "added", pressed: false };
async function signup(a: Act<Signup>) {
  await a.wait(LEAD + 3 * STEP);
  await a.type("email", EMAIL, { interval: 60 });
  await a.wait(300);
  await a.set({ pressed: true });
  await a.wait(160);
  await a.set({ pressed: false, phase: "adding" });
  await a.wait(900);
  await a.set({ phase: "added" });
}
export const SignupStage = ({ width, height }: Slot) => {
  // Narrow, the field is the phone page's: its own width, the smaller button.
  const narrow = width < 520;
  const zoom = narrow ? 1 : Math.min(1.25, (width - 56) / 420);
  const fieldW = narrow ? width - 56 : 420;
  const globe = Math.max(height * 1.9, width * 0.6);
  return (
    <Stage<Signup> width={width} height={height} theme="dark" initial={empty} poster={signed} play="once" script={signup} className="look-earthscale">
      {(s) => (
        <>
        <Image src={planet} alt="" sizes="600px" className="absolute max-w-none [mask-image:linear-gradient(to_right,transparent,black_45%)]" style={{ right: -globe * 0.12, top: -globe * 0.04, width: globe, height: (globe * 451) / 735 }} />
        <div className="absolute left-7 origin-top-left" style={{ top: (height - 63 * zoom) / 2 - 8, width: fieldW, transform: `scale(${zoom})` }}>
          <SignupField email={s.email} phase={s.phase} pressed={s.pressed} focus={s.phase === "idle" && s.email !== ""} small={narrow} />
        </div>
        </>
      )}
    </Stage>
  );
};

/** The file's icons, its Radix set (10:4757), on one row running off both
 *  sides; the ones the panels use light up one after another: the eye, the
 *  layers, the globe, the crosshair, the zoom, the pencil, the comment, the
 *  colour wheel. */
const ICONS = [
  RxEyeOpen, RxEyeClosed, RxLayers, RxGlobe, RxCrosshair1, RxTarget, RxRulerSquare, RxMagnifyingGlass, RxZoomIn, RxZoomOut, RxEnterFullScreen, RxExit, RxDotsVertical, RxDropdownMenu,
  RxChevronLeft, RxChevronRight, RxCheckCircled, RxCross2, RxCopy, RxSquare, RxEraser, RxPencil1, RxChatBubble, RxArrowUp, RxDrawingPin, RxLink1, RxShare1, RxDownload, RxUpload,
  RxReload, RxTimer, RxGear, RxMix, RxOpacity, RxColorWheel, RxCube, RxTable, RxBarChart, RxActivityLog, RxCode,
];
// The row's order puts the eight in use in its middle, where every width shows them.
const ORDER = [5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 0, 17, 2, 18, 3, 19, 4, 20, 8, 23, 21, 24, 22, 25, 34, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38, 39, 1];
const LIT = [0, 2, 3, 4, 8, 21, 22, 34];
const CELL = 56;
export const IconsStage = ({ width, height }: Slot) => {
  const row = ICONS.length * CELL;
  return (
    <Stage<Beat> width={width} height={height} theme="dark" initial={before} poster={after} play="once" script={beat(4)} className="look-earthscale">
      {(s) => (
        <div className="absolute flex" style={{ left: (width - row) / 2, top: (height - CELL) / 2 - 10 }}>
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
      )}
    </Stage>
  );
};
