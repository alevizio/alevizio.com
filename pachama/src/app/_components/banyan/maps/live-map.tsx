"use client";

import basemap from "@/assets/maps/ucayali.jpg";
import Image from "next/image";
import { useState } from "react";
import { cn } from "../../cn";
import { ToolRail, Zoom, type Tool } from "./controls";
import { ALERTS, BOUNDARY, BURNED, CLEARED, polygon, type Pixel, type Year } from "./data";
import { ALL_ON, Legend, type Layers } from "./legend";
import { Player, type Pick } from "./player";
import { FirePointer } from "./pointer";

/* The Maps doc's example, working: the legend switches layers, the player
 * walks the years (each year adds to the ones before it, the latest drawn
 * as newer), the pins show their alerts, zoom zooms and Home resets it all.
 * Over a phone's width the controls sit under the map instead of on it. */
const ZOOMS = ["scale-100", "scale-125", "scale-150"];
// Where each pin sits, as literal classes from the alerts' coordinates.
const PIN: Record<string, { at: string; side: "left" | "right" }> = {
  a1: { at: "left-[30%] top-[54%]", side: "right" },
  a2: { at: "left-[77%] top-[64%]", side: "left" },
  a3: { at: "left-[87%] top-[22%]", side: "left" },
};

export const LiveMap = ({ className }: { className?: string }) => {
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
    <div className={cn("relative w-full", className)}>
      <div role="region" aria-label={`Project map, illustrative: fires and forest loss to ${latest}`} className="relative overflow-hidden rounded-[16px] bg-bn-glass-5">
        <div className={cn("relative aspect-[2/1] transition-transform duration-300 motion-reduce:transition-none", ZOOMS[zoom])}>
          <Image src={basemap} alt="" sizes="(min-width: 1376px) 1296px, 100vw" className="h-full w-full object-cover" />
          <svg viewBox="0 0 1000 500" aria-hidden className="absolute inset-0 h-full w-full">
            {pixels(BURNED, layers.burnedNew, layers.burnedOld, "fill-bn-red", "fill-bn-red-dark")}
            {pixels(CLEARED, layers.clearedNew, layers.clearedOld, "fill-bn-indigo", "fill-bn-indigo-darkest")}
            {layers.boundary ? <polygon points={polygon(BOUNDARY)} className="fill-none stroke-white" strokeWidth={2.5} strokeLinejoin="round" /> : null}
          </svg>
          {layers.alerts
            ? ALERTS.filter(shown).map((a) => <FirePointer key={a.id} alert={a} className={PIN[a.id].at} tipSide={PIN[a.id].side} />)
            : null}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-start gap-3 md:contents">
        <div className="flex items-start gap-2 md:absolute md:top-3 md:left-3">
          {tool === "layers" || tool === "home" ? <Legend layers={layers} onChange={setLayers} /> : null}
          <ToolRail dark value={tool} onChange={pickTool} />
        </div>
        <Player pick={pick} onPick={setPick} playing={playing} onPlaying={setPlaying} className="md:absolute md:bottom-3 md:left-3" />
        <Zoom
          onIn={() => setZoom((z) => Math.min(z + 1, ZOOMS.length - 1))}
          onOut={() => setZoom((z) => Math.max(z - 1, 0))}
          canIn={zoom < ZOOMS.length - 1}
          canOut={zoom > 0}
          className="md:absolute md:right-3 md:bottom-3"
        />
      </div>
    </div>
  );
};
