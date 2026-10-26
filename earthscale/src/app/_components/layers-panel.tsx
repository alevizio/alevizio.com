"use client";

import { useRef } from "react";
import { MdAdd, MdChevronLeft, MdChevronRight, MdMoreVert, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { cn } from "./cn";
import { Button, Label, Panel, PanelTitle, Slider } from "./panel";
import { CHIPS } from "./ramps";
import { useLoop } from "./use-loop";

/* The layers panel, playing itself: the layers come in one by one, the
 * time runs along its slider, and a second layer is switched on. */
const LAYERS = [
  { name: "Weather Forecast", meta: "2025-02-27, 10m_wind_speed", chip: CHIPS[0] },
  { name: "Sentinel-2 NDVI", meta: "2025-02-27", chip: CHIPS[1] },
  { name: "Power Lines", meta: "MWL Operational", chip: CHIPS[2] },
  { name: "Canopy Height", meta: "2025-02-27", chip: CHIPS[4] },
];
// Empty, the layers in, the time runs, NDVI on, held.
const STEPS = [900, 1500, 2400, 2200, 2400] as const;

export const LayersPanel = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, STEPS);
  const layersIn = step >= 1;
  const timeRun = step >= 2;
  const ndvi = step >= 3;

  return (
    <div ref={ref} className={cn("mx-auto w-full max-w-[17.5rem]", className)}>
      <Panel>
        <div className="flex gap-1 rounded-md border border-rule p-0.5 font-mono text-[9px] tracking-[0.06em] uppercase">
          <span className="flex flex-1 items-center justify-center rounded-[4px] bg-mist/10 py-1.5 text-mist">Map</span>
          <span className="flex flex-1 items-center justify-center py-1.5 text-haze">Catalog</span>
        </div>
        <PanelTitle right={<MdMoreVert className="size-3.5" />}>
          <span className="mt-1 block">Satellite Exploration</span>
        </PanelTitle>
        <ul className="mt-2 space-y-1">
          {LAYERS.map(({ name, meta, chip }, i) => {
            const seen = i === 0 || (i === 1 && ndvi);
            return (
              <li
                key={name}
                style={{ transitionDelay: layersIn ? `${i * 140}ms` : "0ms" }}
                className={cn("flex items-center gap-2.5 rounded-md py-1 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]", layersIn ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")}
              >
                <span className={cn("size-7 shrink-0 rounded-[6px]", chip)} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-sans text-[11px] leading-tight text-mist">{name}</span>
                  <span className="block truncate font-mono text-[8px] text-haze">{meta}</span>
                </span>
                <MdMoreVert className="size-3.5 shrink-0 text-haze" />
                {seen ? <MdVisibility className="size-3.5 shrink-0 text-mist" /> : <MdVisibilityOff className="size-3.5 shrink-0 text-haze" />}
              </li>
            );
          })}
        </ul>
        <div className="mt-2 flex items-center gap-2">
          <Label>Time</Label>
          <MdChevronLeft className="size-3.5 text-haze" />
          <Slider value={timeRun ? 86 : 18} className="flex-1" />
          <MdChevronRight className="size-3.5 text-haze" />
        </div>
        <Button className="mt-3 w-full">
          Add new data set <MdAdd className="size-3.5" />
        </Button>
      </Panel>
    </div>
  );
};
