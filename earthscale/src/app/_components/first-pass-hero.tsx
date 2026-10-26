"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "./cn";
import { Comment, type Input } from "./first-pass-comment";
import { EditViz, LayersList, SubMenu } from "./first-pass-panels";
import { Stack } from "./first-pass-stack";
import { FirstPassTop } from "./first-pass-top";
import { Pointer } from "./ui";
import { useLoop } from "./use-loop";

/* The first pass's hero, live: the file's frame at its own 1440 by 1280 px,
 * scaled to the width it's given, and a pointer playing it. The four data
 * sets take turns on the stacked maps, then a comment goes on the green
 * field: pinned, opened, answered. It starts and ends as the file drew it,
 * the thread open, which is where it rests when less motion is asked for. */
const WIDTH = 1440;

type Point = readonly [number, number];
// Where the pointer goes, in the frame's px: each data set's eye, the
// thread's resolve tick, the green field, the reply box and its button.
const EYE: Point[] = [
  [288, 715],
  [288, 811],
  [288, 867],
  [288, 923],
];
const CHECK: Point = [1340, 796];
const FIELD: Point = [980, 806];
const REPLY: Point = [1112, 910];
const SEND: Point = [1356, 910];

type State = { layer: number; parcels: boolean; pin: boolean; card: boolean; reply: boolean; input: Input; at: Point; seen: boolean; press: boolean };
const REST: State = { layer: 0, parcels: true, pin: true, card: true, reply: true, input: "idle", at: [1180, 1040], seen: false, press: false };

// Each step, how long it holds and what changes; a press lasts its step.
const SCRIPT: [number, Partial<State>][] = [
  [1800, {}],
  [1000, { at: CHECK, seen: true }],
  [900, { press: true, pin: false, card: false }],
  [900, { at: EYE[1], reply: false }],
  [1400, { press: true, layer: 1 }],
  [1500, { at: EYE[2] }],
  [1400, { press: true, layer: 2 }],
  [1500, { at: EYE[3] }],
  [1400, { press: true, layer: 3 }],
  [1500, { at: EYE[0] }],
  [1400, { press: true, layer: 0, parcels: false }],
  [1500, { parcels: true, at: FIELD }],
  [800, { press: true, pin: true }],
  [1500, { card: true }],
  [800, { at: REPLY }],
  [500, { press: true, input: "focus" }],
  [2100, { input: "typing" }],
  [700, { at: SEND }],
  [500, { press: true }],
  [2200, { input: "idle", reply: true, seen: false }],
];
const LENGTHS = SCRIPT.map(([ms]) => ms);
const STEPS = SCRIPT.reduce<State[]>((all, [, change]) => [...all, { ...(all.at(-1) ?? REST), press: false, ...change }], []);

export const FirstPassHero = ({ className }: { className?: string }) => {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const step = useLoop(map, LENGTHS);
  const now = STEPS[step];
  const before = STEPS[(step + STEPS.length - 1) % STEPS.length];
  const [x, y] = now.at;
  const pressed = (on: Point) => now.press && now.at === on;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / WIDTH));
    fit.observe(el);
    return () => fit.disconnect();
  }, []);

  return (
    <div
      ref={box}
      role="img"
      aria-label="The first pass's hero, playing: four data sets take turns on a stack of maps, then a comment is pinned on a field, answered and resolved"
      className={cn("relative aspect-[1440/1280] w-full overflow-hidden bg-night", className)}
    >
      <div className={cn("absolute top-0 left-0 h-[1280px] w-[1440px] origin-top-left", scale === 0 && "invisible")} style={{ transform: `scale(${scale})` }}>
        <Stack layer={now.layer} from={before.layer === now.layer ? undefined : before.layer} parcels={now.parcels} picked={pressed(FIELD)} />
        <div ref={map} className="absolute inset-x-0 top-[598px] h-[679px]" />
        <LayersList on={now.layer} />
        <EditViz on={now.layer === 0} />
        <SubMenu />
        <Comment pin={now.pin} card={now.card} reply={now.reply} input={now.input} resolving={pressed(CHECK)} sending={pressed(SEND)} />
        <div className="absolute inset-x-0 top-[1075.5px] h-[202px] bg-linear-to-b from-night/0 to-night" />
        <div className="absolute inset-x-0 top-[1277.5px] bottom-0 bg-night" />
        <FirstPassTop />
        {now.press ? (
          <span key={step} className="absolute size-10 -translate-1/2 animate-[es-ripple_650ms_ease-out_forwards] rounded-full border-2 border-mint" style={{ left: x, top: y }} />
        ) : null}
        <span className={cn("absolute transition-[left,top,opacity] duration-700 ease-[cubic-bezier(0.45,0,0.2,1)]", now.seen ? "opacity-100" : "opacity-0")} style={{ left: x - 4, top: y - 2 }}>
          <Pointer className={cn("transition-[scale] duration-150", now.press && "scale-90")} />
        </span>
      </div>
    </div>
  );
};
