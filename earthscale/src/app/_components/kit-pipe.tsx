"use client";

import { useEffect, useId, useRef, type ComponentProps } from "react";
import { FiDatabase } from "react-icons/fi";
import { cn } from "./cn";
import type { Slot } from "./kit-tiles";
import { at, clamp, drawWire, findWire, Halo, inOut, out, set, Wire, type WireParts } from "./pipeline-wires";
import { MARK, MARK_VIEWBOX } from "./wordmark-paths";

/* The serve diagram, cut to its bones, playing itself the way Serve, live
 * does: two comets leave the sources, drawing their lines, and meet; the
 * join takes them with a flash and its mark turns once; a comet runs on
 * down and the tiles arrive, lit. Then small lights flow along the lines
 * until it clears and starts over. It plays from the start each time it
 * comes into view; with less motion asked for it is the finished diagram. */
// It clears and the sources draw in; the join; the comet down; it holds.
const STEPS = [1650, 1000, 500, 2600] as const;
const LOOP = STEPS.reduce((all, ms) => all + ms, 0);
const REST = STEPS.length - 1;
const CLEAR = 350;
// When the comet reaches the join, in the join's step.
const IN = 260;
// The diagram's height; it sits in the middle of whatever the cell gives.
const HEIGHT = 182;

const Chip = ({ className, ...rest }: ComponentProps<"span">) => (
  <span className={cn("absolute inline-flex h-9 items-center gap-2 rounded-md border border-rule bg-card px-3 font-mono text-[11px] whitespace-nowrap text-mist", className)} {...rest} />
);

type Parts = { wires: WireParts[]; node: HTMLElement; mark: SVGSVGElement; flash: SVGCircleElement; tiles: HTMLElement };

// One frame: `step`, `ms` into it.
const paint = ({ wires: [left, right, trunk, drop], node, mark, flash, tiles }: Parts, step: number, ms: number, still: boolean) => {
  const clearing = step === 0 && ms < CLEAR;
  const fade = clearing ? 1 - ms / CLEAR : 1;
  const sources = step > 0 || clearing ? 1 : inOut(clamp((ms - CLEAR) / (STEPS[0] - CLEAR)));
  const into = clamp(ms / IN);
  const down = clamp(ms / 450);
  const flow = !still && step === REST;
  drawWire(left, sources, step === 0 && !clearing, flow, fade);
  drawWire(right, sources, step === 0 && !clearing, flow, fade);
  drawWire(trunk, step === 0 ? Number(clearing) : step === 1 ? inOut(into) : 1, step === 1 && into < 1, flow, fade);
  drawWire(drop, step === 0 ? Number(clearing) : step === 1 ? 0 : step === 2 ? inOut(down) : 1, step === 2 && down < 1, flow, fade);
  // The join: it swells as the comet lands, a ring flashing out from it,
  // and its mark turns once while it's lit.
  const hit = step === 1 ? clamp((ms - IN) / 300) : 0;
  node.style.scale = String(1 + 0.18 * Math.sin(Math.PI * hit));
  node.toggleAttribute("data-lit", (step === 1 && ms >= IN) || step === 2);
  mark.style.rotate = `${step === 1 ? 360 * inOut(clamp((ms - IN - 40) / 700)) : 0}deg`;
  const ring = clamp((ms - IN) / 650);
  set(flash, "r", 16 + 14 * out(ring));
  set(flash, "stroke-width", 0.3 + 1.2 * (1 - ring));
  set(flash, "opacity", step === 1 && ms >= IN ? 0.8 * (1 - ring) : 0);
  tiles.toggleAttribute("data-on", step === REST);
  tiles.toggleAttribute("data-lit", step === REST && ms < 1200 && !still);
};

export const PipeStage = ({ width, height }: Slot) => {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/[^\w-]/g, "");
  const top = Math.max(0, Math.round((height - HEIGHT) / 2));
  const mid = width / 2;
  const left = 28 + 62;
  const right = width - 28 - 52;

  useEffect(() => {
    const root = ref.current;
    const node = root?.querySelector<HTMLElement>("[data-node]");
    const mark = root?.querySelector<SVGSVGElement>("[data-mark]");
    const flash = root?.querySelector<SVGCircleElement>("[data-flash]");
    const tiles = root?.querySelector<HTMLElement>("[data-tiles]");
    if (!root || !node || !mark || !flash || !tiles) return;
    const parts: Parts = { wires: ["left", "right", "trunk", "drop"].map((name) => findWire(root, name)), node, mark, flash, tiles };
    // It rests finished until it plays, so the diagram reads without it.
    paint(parts, REST, LOOP, true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let start = 0;
    const frame = (now: number) => {
      const { step, ms } = at(STEPS, (now - start) % LOOP);
      paint(parts, step, ms, false);
      raf = requestAnimationFrame(frame);
    };
    const seen = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        if (!entry.isIntersecting) return;
        start = performance.now();
        raf = requestAnimationFrame(frame);
      },
      { threshold: 0.3 },
    );
    seen.observe(root);
    return () => {
      seen.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [width, height]);

  const halo = `${id}-halo`;
  return (
    <div ref={ref} className="absolute inset-x-0" style={{ top, height: HEIGHT }}>
      <Chip className="top-3 left-7">
        Cloud Storage <FiDatabase aria-hidden className="size-3.5 text-haze" />
      </Chip>
      <Chip className="top-3 right-7">
        Database <FiDatabase aria-hidden className="size-3.5 text-haze" />
      </Chip>
      <svg width={width} height={HEIGHT} className="absolute inset-0 overflow-visible" aria-hidden>
        <defs>
          <Halo id={halo} />
        </defs>
        <Wire name="left" d={`M${left} 48V78H${mid}`} halo={halo} />
        <Wire name="right" d={`M${right} 48V78H${mid}`} halo={halo} />
        <Wire name="trunk" d={`M${mid} 78V92`} halo={halo} />
        <Wire name="drop" d={`M${mid} 124V146`} halo={halo} />
        <circle data-flash cx={mid} cy={108} r={16} fill="none" stroke="#a0ffd7" opacity={0} />
      </svg>
      <span
        data-node
        className="absolute grid size-8 place-items-center rounded-full border border-rule bg-card text-mist transition-[border-color,color,box-shadow] duration-300 data-lit:border-mint/50 data-lit:text-mint data-lit:shadow-[0_0_20px_rgb(160_255_215/0.25)]"
        style={{ left: mid - 16, top: 92 }}
      >
        <svg data-mark viewBox={MARK_VIEWBOX} className="size-4" aria-hidden>
          {MARK.map((d) => (
            <path key={d} d={d} fill="currentColor" fillRule="evenodd" />
          ))}
        </svg>
      </span>
      <Chip
        data-tiles
        data-on=""
        className="top-[146px] left-1/2 -translate-x-1/2 translate-y-2 opacity-0 transition-[translate,opacity,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] data-lit:border-mint/45 data-lit:shadow-[0_0_24px_rgb(160_255_215/0.18)] data-on:translate-y-0 data-on:opacity-100"
      >
        {"{z}/{x}/{y}.webp"}
      </Chip>
    </div>
  );
};
