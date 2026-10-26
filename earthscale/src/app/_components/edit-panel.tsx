"use client";

import { useRef } from "react";
import { MdClose, MdContentCopy, MdVisibility, MdZoomIn } from "react-icons/md";
import { cn } from "./cn";
import { Label, Panel, PanelTitle, Select, Slider } from "./panel";
import { RAMPS } from "./ramps";
import { useLoop } from "./use-loop";

/* Editing a visualisation, playing itself: the colour ramp steps through
 * the five the product offers, the layer's chip follows, and the opacity
 * moves with each. */
const OPACITY = [90, 70, 56, 80, 64];
const STEPS = [1800, 1800, 1800, 1800, 1800] as const;

export const EditPanel = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, STEPS);
  const ramp = RAMPS[step];

  return (
    <div ref={ref} className={cn("mx-auto w-full max-w-[17.5rem]", className)}>
      <Panel>
        <PanelTitle
          right={
            <>
              <MdZoomIn className="size-3.5" />
              <MdContentCopy className="size-3" />
              <MdClose className="size-3.5" />
            </>
          }
        >
          Editing Visualization
        </PanelTitle>
        <div className="mt-2.5 flex items-center gap-2">
          <span className={cn("size-6 rounded-[5px] transition-[background-image] duration-700", ramp.css)} />
          <span className="min-w-0 flex-1">
            <span className="block font-sans text-[11px] text-mist">Weather Forecast</span>
            <span className="block font-mono text-[8px] text-haze">2025-02-27, 10m_wind_speed</span>
          </span>
          <MdVisibility className="size-3.5 text-mist" />
        </div>
        <div className="mt-2.5 flex items-center gap-3">
          <Label className="w-12">Opacity</Label>
          <Slider value={OPACITY[step]} className="flex-1" />
        </div>
        <Label className="mt-2.5">Visualization Type</Label>
        <Select className="mt-1">Single Band</Select>
        <Label className="mt-2">Band</Label>
        <Select className="mt-1">2m-Temperature</Select>
        <Label className="mt-2">Color Ramp</Label>
        <Select className="mt-1">
          <span className={cn("h-3.5 w-8 rounded-[3px]", ramp.css)} />
          <span className="relative block h-4 w-16 overflow-hidden">
            {RAMPS.map((r, i) => (
              <span key={r.name} className={cn("absolute inset-0 transition-[opacity,translate] duration-500", i === step ? "translate-y-0 opacity-100" : i < step ? "-translate-y-3 opacity-0" : "translate-y-3 opacity-0")}>
                {r.name}
              </span>
            ))}
          </span>
        </Select>
      </Panel>
    </div>
  );
};
