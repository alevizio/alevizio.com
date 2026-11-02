"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { FiDatabase } from "react-icons/fi";
import { cn } from "./cn";
import { drawWire, findWire, Halo, set, Wire, type WireParts } from "./pipeline-wires";
import { Wordmark } from "./wordmark";

/* The serve diagram, as the page draws it, playing itself. Two comets
 * leave the sources, drawing their lines, and meet at the join with a
 * flash; one runs on down into the client, which lights up as the call
 * types itself in; a comet comes out under it and draws the line down to
 * the tile source, which arrives. Then small lights flow along the lines
 * until it clears and starts over. It plays from the start each time it
 * comes into view; with less motion asked for it is the finished diagram,
 * still. */
const PY = [
  [["kw", "from"], ["id", " earthscale "], ["kw", "import"], ["id", " EarthscaleClient"]],
  [],
  [["kw", "with"], ["id", " EarthscaleClient() "], ["kw", "as"], ["id", " client:"]],
  [["id", "  dataset_id = client.add_dataset("]],
  [["id", "    name="], ["str", "\"My first dataset\""], ["id", ","]],
  [["id", "    url="], ["str", "\"gs://my-data-bucket/my-data.zarr\""], ["id", ","]],
  [["id", "    accelerated="], ["kw", "True"]],
  [["id", "  )"]],
] as const;
const JS = ["sources: {", "  myRaster: {", "    type: 'raster',", "    tiles: [", "      'https://earthscale.ai/raster/{dataset_id}/tiles/{z}/{x}/{y}.webp'", "    ],", "    tileSize: 256", "  }", "}"];
// What was drawn clears and the comets draw the two sources in; they join
// and one runs into the client; the code types; a comet runs on down; the
// tiles arrive; it holds, the lights flowing along the lines.
const STEPS = [1650, 700, 2600, 900, 2400, 1800] as const;
const LOOP = STEPS.reduce((all, ms) => all + ms, 0);
const REST = STEPS.length - 1;
const CLEAR = 350;
// The wires, in their svg's units: the two sources round into the join,
// the line down into the client, and on down to the tiles.
const LEFT = "M60 0V32Q60 36 64 36H208";
const RIGHT = "M356 0V32Q356 36 352 36H208";
const TRUNK = "M208 36V72";
const DROP = "M208 0V56";

// A window lights up as the comet reaches it, and cools again.
const Window = ({ children, className, on, lit = false }: { children: ReactNode; className?: string; on: boolean; lit?: boolean }) => (
  <div
    className={cn(
      "min-w-0 overflow-hidden rounded-[10px] border bg-night/90 p-4 font-mono text-[9.5px] leading-[1.6] text-mist transition-[opacity,translate,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-[11.5px]",
      on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      lit ? "border-mint/45 shadow-[0_0_0_1px_rgb(160_255_215/0.12),0_0_36px_rgb(160_255_215/0.16),0_24px_60px_rgba(0,0,0,0.45)]" : "border-rule shadow-[0_24px_60px_rgba(0,0,0,0.45)]",
      className,
    )}
  >
    <div className="mb-3 flex gap-1.5 border-b border-rule pb-3">
      <span className="size-2 rounded-full bg-mist/25" />
      <span className="size-2 rounded-full bg-mist/25" />
      <span className="size-2 rounded-full bg-mist/25" />
    </div>
    {children}
  </div>
);

const Source = ({ icon, label }: { icon: ReactNode; label: string }) => (
  <span className="inline-flex h-9 items-center gap-2 rounded-md border border-rule bg-card px-3 font-mono text-[10px] text-mist">
    {label} <span className="text-haze">{icon}</span>
  </span>
);

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const inOut = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
const out = (x: number) => 1 - (1 - x) ** 3;
// Where in the loop t falls: the step, and how far into it.
const at = (t: number) => {
  let step = 0;
  let ms = t;
  while (step < REST && ms >= STEPS[step]) ms -= STEPS[step++];
  return { step, ms };
};

type Parts = { wires: WireParts[]; node: SVGGElement; halo: SVGCircleElement; flash: SVGCircleElement };

// One frame: `step`, `ms` into it, `now` for the join's breathing.
const paint = ({ wires: [left, right, trunk, drop], node, halo, flash }: Parts, step: number, ms: number, now: number, still: boolean) => {
  const clearing = step === 0 && ms < CLEAR;
  const fade = clearing ? 1 - ms / CLEAR : 1;
  const sources = step > 0 || clearing ? 1 : inOut(clamp((ms - CLEAR) / (STEPS[0] - CLEAR)));
  const down = clamp((ms - 120) / 520);
  const on = clamp(ms / 800);
  const flow = !still && step >= 2;
  drawWire(left, sources, step === 0 && !clearing, flow, fade);
  drawWire(right, sources, step === 0 && !clearing, flow, fade);
  drawWire(trunk, step === 0 ? Number(clearing) : step === 1 ? inOut(down) : 1, step === 1 && down > 0 && down < 1, flow, fade);
  drawWire(drop, step === 0 ? Number(clearing) : step < 3 ? 0 : step === 3 ? inOut(on) : 1, step === 3 && on < 1, !still && step >= 4, fade);
  // The join: it pops in as the comets meet, a ring flashing out from it, and breathes.
  const pop = step === 1 ? out(clamp(ms / 300)) * (1 + 0.5 * Math.sin(Math.PI * clamp(ms / 300))) : 1;
  set(node, "transform", `translate(208 36) scale(${pop})`);
  set(node, "opacity", step === 0 ? fade * Number(clearing) : 1);
  set(halo, "opacity", still ? 0.6 : 0.55 + 0.25 * Math.sin(now / 650));
  const ring = clamp(ms / 650);
  set(flash, "r", 3 + 16 * ring);
  set(flash, "stroke-width", 0.3 + 1.4 * (1 - ring));
  set(flash, "opacity", step === 1 ? 0.9 * (1 - ring) : 0);
};

export const Pipeline = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/[^\w-]/g, "");
  // It rests finished until it plays, so the diagram reads without it.
  const [step, setStep] = useState(REST);

  useEffect(() => {
    const root = ref.current;
    const node = root?.querySelector<SVGGElement>("[data-node]");
    const halo = root?.querySelector<SVGCircleElement>("[data-node-halo]");
    const flash = root?.querySelector<SVGCircleElement>("[data-flash]");
    if (!root || !node || !halo || !flash) return;
    const parts: Parts = { wires: ["left", "right", "trunk", "drop"].map((name) => findWire(root, name)), node, halo, flash };
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    paint(parts, REST, 0, 0, true);
    if (still) return;
    let raf = 0;
    let start = 0;
    let shown = REST;
    const frame = (now: number) => {
      const { step: s, ms } = at((now - start) % LOOP);
      if (s !== shown) setStep((shown = s));
      paint(parts, s, ms, now, false);
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
  }, []);

  const typed = step >= 2;
  const tiles = step >= 4;

  return (
    <div ref={ref} className={cn("relative grid min-w-0 grid-cols-[minmax(0,1fr)] gap-0", className)}>
      <div className="relative mx-auto flex w-full max-w-[26rem] justify-between">
        <Source label="Cloud Storage" icon={<FiDatabase className="size-4" />} />
        <Source label="Database" icon={<FiDatabase className="size-4" />} />
      </div>
      <svg viewBox="0 0 416 72" className="mx-auto block w-full max-w-[26rem] overflow-visible" aria-hidden>
        <defs>
          <Halo id={`${id}-halo`} />
        </defs>
        <Wire name="left" d={LEFT} halo={`${id}-halo`} />
        <Wire name="right" d={RIGHT} halo={`${id}-halo`} />
        <Wire name="trunk" d={TRUNK} halo={`${id}-halo`} />
        <circle data-flash cx={208} cy={36} r={3} fill="none" stroke="#a0ffd7" opacity={0} />
        <g data-node transform="translate(208 36)">
          <circle data-node-halo r={11} fill={`url(#${id}-halo)`} />
          <circle r={3} fill="#2bff73" />
        </g>
      </svg>
      <Window on lit={step === 2} className="mx-auto w-full max-w-[26rem]">
        <Wordmark markOnly className="mb-3 h-5 w-auto" />
        {PY.map((line, i) => (
          <div key={i} style={{ transitionDelay: typed ? `${i * 220}ms` : "0ms" }} className={cn("min-h-[1.6em] whitespace-pre transition-opacity duration-300", typed ? "opacity-100" : "opacity-0")}>
            {line.map(([kind, text], j) => (
              <span key={j} className={kind === "kw" ? "text-green" : kind === "str" ? "text-mint" : "text-mist"}>
                {text}
              </span>
            ))}
          </div>
        ))}
      </Window>
      <svg viewBox="0 0 416 56" className="mx-auto block w-full max-w-[26rem] overflow-visible" aria-hidden>
        <defs>
          <Halo id={`${id}-halo-drop`} />
        </defs>
        <Wire name="drop" d={DROP} halo={`${id}-halo-drop`} />
      </svg>
      <Window on={tiles} lit={step === 4} className="w-full sm:ml-[18%] sm:w-[82%]">
        {JS.map((line, i) => (
          <div key={i} style={{ transitionDelay: tiles ? `${i * 120}ms` : "0ms" }} className={cn("whitespace-pre transition-opacity duration-300", tiles ? "opacity-100" : "opacity-0")}>
            {line}
          </div>
        ))}
      </Window>
    </div>
  );
};
