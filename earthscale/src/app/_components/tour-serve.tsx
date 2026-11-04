"use client";

import tiles from "@/assets/page/tour/serve-tiles.webp";
import Image from "next/image";
import { Fragment, useId } from "react";
import { clamp, drawWire, findWire, Halo, inOut, out, set, Wire, type WireParts } from "./pipeline-wires";

/* The serve section in the tour (tour-page.tsx), playing the way "Serve
 * Data at Scale, playing" does (serve-live.tsx) over the file's own sheet:
 * the three features lit in turn while a line runs down beside each, then
 * all three; two comets drawing the sources in to the join, which pops
 * with a flash and breathes; one running on down into the client, which
 * lights up as its call types itself in; a comet down to the tile source,
 * which arrives lit; then small lights flowing along the lines. The wires
 * are drawn in the sheet's px (an svg over it), the rest in the section's
 * own 1440 px; the tile source is the sheet's own window, lifted off it
 * (scripts/make-tour-layers.py). */

// The wires over the sheet's own: the sources round into the join, the
// line down into the client, and on down out of it to the tiles.
const LEFT = "M545.8 264.4V304.4Q545.8 309.1 550.5 309.1H608.3";
const RIGHT = "M662.6 264.4V304.4Q662.6 309.1 657.9 309.1H608.3";
const TRUNK = "M608.3 309.1V351.2";
const DROP = "M685 546V611";
const JOIN = "translate(608.3 309.1)";

// The features in their hairline box, top to foot, in the section's px.
const FEATURES = [
  [318, 554],
  [554, 790],
  [790, 1060],
];
// The client's call, line by line, as the sheet sets it: x from, x to,
// y from, y to.
const CALL = [
  [792, 1076, 580, 598],
  [792, 1039, 614, 631],
  [806, 1039, 631, 648],
  [821, 995, 648, 665],
  [821, 1103, 665, 683],
  [820, 940, 683, 699],
  [814, 824, 699, 716],
];
const CLIENT = { left: 777.6, top: 485.5, width: 350.2, height: 240 };
const SOURCE = { left: 839.7, top: 847.1, width: 558.3, height: 250 };
const LIFT = { left: 830, top: 838, width: 580, height: 286 };
// A window lit: the mint edge and glow serve-live's windows take, fading
// down the window the way its own edge does.
const LIT =
  "pointer-events-none absolute rounded-[16px] border border-mint/45 opacity-0 shadow-[0_0_0_1px_rgb(160_255_215/0.12),0_0_36px_rgb(160_255_215/0.16)] [mask-image:linear-gradient(black_45%,transparent)]";

const TURN = 1300; // each feature's turn, ms
const TYPE = 200; // each line of the call
/** When it has all played, ms after it starts. */
export const SERVED = 5600;

export const ServeWires = ({ width, height }: { width: number; height: number }) => {
  const halo = `${useId().replace(/[^\w-]/g, "")}-halo`;
  return (
    <svg data-wires viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
      <defs>
        <Halo id={halo} />
      </defs>
      <Wire name="left" d={LEFT} halo={halo} />
      <Wire name="right" d={RIGHT} halo={halo} />
      <Wire name="trunk" d={TRUNK} halo={halo} />
      <Wire name="drop" d={DROP} halo={halo} />
      <circle data-flash cx={608.3} cy={309.1} r={3} fill="none" stroke="#a0ffd7" opacity={0} />
      <g data-node transform={JOIN}>
        <circle r={8} fill={`url(#${halo})`} className="motion-safe:animate-[es-breathe_1.3s_ease-in-out_infinite]" />
        <rect x={-2.9} y={-2.9} width={5.8} height={5.8} rx={1.2} fill="#2bff73" />
      </g>
    </svg>
  );
};

/** The features' veils and running lines, over the list's strip. */
export const ServeFeatures = () =>
  FEATURES.map(([top, foot]) => (
    <Fragment key={top}>
      <span data-veil className="absolute left-24 w-[504px] bg-[#0e1313] opacity-0" style={{ top: top + 12, height: foot - top - 24 }} />
      <span data-run className="absolute left-20 w-px origin-top bg-mint opacity-0" style={{ top, height: foot - top }} />
    </Fragment>
  ));

/** The client lighting and its call typing, and the tile source, over the
 *  diagram's strip. At rest it is all there, as the sheet has it. */
export const ServeDiagram = () => (
  <>
    {CALL.map(([x0, x1, y0, y1]) => (
      <span key={y0} data-type className="absolute origin-right scale-x-0 bg-[#0e1313]" style={{ left: x0, top: y0, width: x1 - x0, height: y1 - y0 }} />
    ))}
    <span data-lit="client" className={LIT} style={CLIENT} />
    <div data-source className="absolute" style={LIFT}>
      <Image src={tiles} alt="" sizes="600px" loading="eager" className="size-full" />
      <span data-lit="source" className={LIT} style={{ ...SOURCE, left: SOURCE.left - LIFT.left, top: SOURCE.top - LIFT.top }} />
    </div>
  </>
);

export type ServeParts = {
  wires: WireParts[];
  node: SVGGElement;
  flash: SVGCircleElement;
  veils: HTMLElement[];
  runs: HTMLElement[];
  call: HTMLElement[];
  client: HTMLElement;
  source: HTMLElement;
  sourceLit: HTMLElement;
};

export const findServe = (root: HTMLElement): ServeParts | null => {
  const svg = root.querySelector<SVGSVGElement>("[data-wires]");
  const node = svg?.querySelector<SVGGElement>("[data-node]");
  const flash = svg?.querySelector<SVGCircleElement>("[data-flash]");
  const client = root.querySelector<HTMLElement>('[data-lit="client"]');
  const source = root.querySelector<HTMLElement>("[data-source]");
  const sourceLit = root.querySelector<HTMLElement>('[data-lit="source"]');
  if (!svg || !node || !flash || !client || !source || !sourceLit) return null;
  const all = (name: string) => [...root.querySelectorAll<HTMLElement>(`[data-${name}]`)];
  return { wires: ["left", "right", "trunk", "drop"].map((name) => findWire(svg, name)), node, flash, veils: all("veil"), runs: all("run"), call: all("type"), client, source, sourceLit };
};

/** The section, t ms after it starts (or not yet, below zero). */
export const drawServe = ({ wires: [left, right, trunk, drop], node, flash, veils, runs, call, client, source, sourceLit }: ServeParts, t: number) => {
  // The comets: the sources in, then on down to the client, then the tiles.
  const sources = inOut(clamp((t - 200) / 1000));
  const down = inOut(clamp((t - 1300) / 450));
  const fall = inOut(clamp((t - 3400) / 500));
  drawWire(left, sources, sources > 0 && sources < 1, t >= 1750, 1);
  drawWire(right, sources, sources > 0 && sources < 1, t >= 1750, 1);
  drawWire(trunk, down, down > 0 && down < 1, t >= 1750, 1);
  drawWire(drop, fall, fall > 0 && fall < 1, t >= 3900, 1);
  // The join pops as they meet, a ring flashing out from it.
  const pop = clamp((t - 1200) / 300);
  set(node, "transform", `${JOIN} scale(${t < 1200 ? 0 : out(pop) * (1 + 0.5 * Math.sin(Math.PI * pop))})`);
  const ring = clamp((t - 1200) / 650);
  set(flash, "r", 3 + 12 * out(ring));
  set(flash, "opacity", ring > 0 && ring < 1 ? 0.85 * (1 - ring) : 0);
  // The client lights as its comet reaches it while the call types in, a
  // line at a time, and cools.
  client.style.opacity = String(clamp((t - 1750) / 300) * (1 - clamp((t - 3300) / 400)));
  call.forEach((line, i) => {
    line.style.scale = `${1 - Math.round(clamp((t - 1800 - i * TYPE) / TYPE) * 12) / 12} 1`;
  });
  // The tile source arrives with its comet, lit a moment.
  const arrive = out(clamp((t - 3900) / 700));
  source.style.opacity = String(arrive);
  source.style.translate = `0 ${(1 - arrive) * 12}px`;
  sourceLit.style.opacity = String(clamp((t - 3900) / 300) * (1 - clamp((t - 4900) / 500)));
  // Each feature lit in turn while a line runs down beside it, then all three.
  const all = clamp((t - FEATURES.length * TURN) / 300);
  veils.forEach((veil, i) => {
    const from = i * TURN;
    const to = from + TURN;
    const lit = (i === 0 ? 1 : clamp((t - from) / 300)) * (1 - clamp((t - to) / 300));
    veil.style.opacity = String(0.6 * (1 - Math.max(lit, all)));
    runs[i].style.scale = `1 ${clamp((t - from) / TURN)}`;
    runs[i].style.opacity = String(t < from ? 0 : 1 - clamp((t - to) / 300));
  });
};
