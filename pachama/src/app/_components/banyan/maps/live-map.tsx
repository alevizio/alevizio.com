"use client";

import basemap from "@/assets/maps/ucayali.jpg";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { cn } from "../../cn";
import { ScaleBar, ToolRail, Zoom, type Tool } from "./controls";
import { ALERTS, BOUNDARY, BURNED, CLEARED, polygon, type Pixel, type Year } from "./data";
import { ALL_ON, Legend, type Layers } from "./legend";
import { Player, type Pick } from "./player";
import { FirePointer } from "./pointer";

/* The Maps doc's example, working: the legend switches layers, the player
 * walks the years (each year adds to the ones before it, the latest drawn
 * as newer), the pins show their alerts, zoom zooms and Home resets it all.
 * It's built as a stack of sheets, the imagery at the bottom and the
 * controls on top, so the maps chapter can pull them apart in 3D (it sets
 * --gap, the distance between sheets, and --flat, which fades the sheets'
 * names); left alone the sheets lie flat and it's simply the map. Over a
 * phone's width the controls sit under the map instead of on it. */
const ZOOMS = ["scale-100", "scale-125", "scale-150"];
// Where each pin sits, as literal classes from the alerts' coordinates.
const PIN: Record<string, { at: string; side: "left" | "right" }> = {
  a1: { at: "left-[30%] top-[54%]", side: "right" },
  a2: { at: "left-[77%] top-[64%]", side: "left" },
  a3: { at: "left-[87%] top-[22%]", side: "left" },
};
// Each sheet raised by its place in the stack. Literal classes, for Tailwind.
const LIFT = [
  "[transform:translateZ(0px)]",
  "[transform:translateZ(var(--gap,0px))]",
  "[transform:translateZ(calc(var(--gap,0px)*2))]",
  "[transform:translateZ(calc(var(--gap,0px)*3))]",
  "md:[transform:translateZ(calc(var(--gap,0px)*4))]",
];
// A sheet's outline and name, there only while the stack is apart.
const APART = "pointer-events-none absolute opacity-[calc(1-var(--flat,1))]";
const NAME = "rounded-full bg-black/70 px-3.5 py-1.5 font-mono text-[13px] leading-4 tracking-[0.08em] whitespace-nowrap text-white uppercase";

/** One sheet: what it draws, zoomed with the map, and the name it carries
 *  while the stack is apart. */
const Sheet = ({ n, name, zoom, children }: { n: number; name: string; zoom: number; children: ReactNode }) => (
  <div className={cn("absolute inset-0 overflow-hidden rounded-[16px]", LIFT[n])}>
    <div className={cn("absolute inset-0 transition-transform duration-300 motion-reduce:transition-none", ZOOMS[zoom])}>{children}</div>
    <span aria-hidden className={cn(APART, "inset-0 rounded-[16px] bg-white/[0.04] ring-1 ring-white/40 ring-inset")} />
    <span aria-hidden className={cn(APART, NAME, "right-4 bottom-4")}>{name}</span>
  </div>
);

/** `name` labels the map region; give each instance on a page its own. */
export const LiveMap = ({ name = "Project map, illustrative", className }: { name?: string; className?: string }) => {
  const [layers, setLayers] = useState<Layers>(ALL_ON);
  const [pick, setPick] = useState<Pick>("all");
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [tool, setTool] = useState<Tool>("layers");

  const latest: Year = pick === "all" ? 2024 : pick;
  const shown = (p: { year: Year }) => p.year <= latest;
  const pixels = (all: Pixel[], newer: boolean, older: boolean, fresh: string, old: string) =>
    all.filter((p) => shown(p) && (p.year === latest ? newer : older)).map((p, i) => (
      <rect key={`${p.x}-${p.y}-${i}`} x={p.x} y={p.y} width={6} height={6} className={p.year === latest ? fresh : old} />
    ));
  const pickTool = (t: Tool) => {
    setTool(t);
    if (t !== "home") return;
    setLayers(ALL_ON);
    setPick("all");
    setPlaying(false);
    setZoom(0);
  };

  return (
    <div className={cn("relative w-full [transform-style:preserve-3d]", className)}>
      <div role="region" aria-label={`${name}: fires and forest loss to ${latest}`} className="relative aspect-[2/1] [transform-style:preserve-3d]">
        <Sheet n={0} name="Satellite imagery" zoom={zoom}>
          <Image src={basemap} alt="" sizes="(min-width: 1376px) 1296px, 100vw" className="h-full w-full bg-bn-glass-5 object-cover" />
        </Sheet>
        <Sheet n={1} name="What the satellites saw" zoom={zoom}>
          <svg viewBox="0 0 1000 500" aria-hidden className="absolute inset-0 h-full w-full">
            {pixels(BURNED, layers.burnedNew, layers.burnedOld, "fill-bn-red", "fill-bn-red-dark")}
            {pixels(CLEARED, layers.clearedNew, layers.clearedOld, "fill-bn-indigo", "fill-bn-indigo-darkest")}
          </svg>
        </Sheet>
        <Sheet n={2} name="The project's boundary" zoom={zoom}>
          <svg viewBox="0 0 1000 500" aria-hidden className="absolute inset-0 h-full w-full">
            {layers.boundary ? <polygon points={polygon(BOUNDARY)} className="fill-none stroke-white" strokeWidth={2.5} strokeLinejoin="round" /> : null}
          </svg>
        </Sheet>
        <Sheet n={3} name="Fire alerts" zoom={zoom}>
          {layers.alerts ? ALERTS.filter(shown).map((a) => <FirePointer key={a.id} alert={a} className={PIN[a.id].at} tipSide={PIN[a.id].side} />) : null}
        </Sheet>
      </div>
      {/* The controls: the top sheet over the map, or under it on a phone. */}
      <div className={cn("mt-3 flex flex-wrap items-start gap-3 md:pointer-events-none md:absolute md:inset-0 md:mt-0 md:block", LIFT[4])}>
        <div className="pointer-events-auto flex items-start gap-2 md:absolute md:top-3 md:left-3">
          {tool === "layers" || tool === "home" ? <Legend layers={layers} onChange={setLayers} /> : null}
          <ToolRail dark value={tool} onChange={pickTool} />
        </div>
        <Player pick={pick} onPick={setPick} playing={playing} onPlaying={setPlaying} className="pointer-events-auto md:absolute md:bottom-3 md:left-3" />
        <div className="pointer-events-auto flex items-end gap-3 md:absolute md:right-3 md:bottom-3">
          <ScaleBar onDark className="hidden md:block" />
          <Zoom
            onIn={() => setZoom((z) => Math.min(z + 1, ZOOMS.length - 1))}
            onOut={() => setZoom((z) => Math.max(z - 1, 0))}
            canIn={zoom < ZOOMS.length - 1}
            canOut={zoom > 0}
          />
        </div>
        <span aria-hidden className={cn(APART, NAME, "right-4 bottom-[5.5rem] hidden md:block")}>The controls</span>
      </div>
    </div>
  );
};
