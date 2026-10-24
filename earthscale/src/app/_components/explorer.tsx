"use client";

import study3 from "@/assets/studies/03.webp";
import study5 from "@/assets/studies/05.webp";
import Image from "next/image";
import { useRef } from "react";
import { MdAdd, MdChevronLeft, MdChevronRight, MdClose, MdContentCopy, MdMoreVert, MdVisibility, MdVisibilityOff, MdZoomIn } from "react-icons/md";
import { cn } from "./cn";
import { Button, Label, Panel, PanelTitle, Select, Slider } from "./panel";
import { CHIPS, RAMPS } from "./ramps";
import { useLoop } from "./use-loop";

/* The visual explorer, as the page shows it, playing itself: the layers
 * come in one by one, the time slider runs and the map steps to the next
 * day, the visualisation's opacity and ramp change, and the pixel panel
 * draws its time series. Then it starts over. */

const LAYERS = [
  { name: "Weather Forecast", meta: "2025-02-27, 10m_wind_speed", chip: CHIPS[0], on: true },
  { name: "Sentinel-2 NDVI", meta: "2025-02-27", chip: CHIPS[1], on: false },
  { name: "Power Lines", meta: "MWL Operational", chip: CHIPS[2], on: false },
  { name: "Canopy Height", meta: "2025-02-27", chip: CHIPS[4], on: false },
];

// The time series, as values 0 to 8 across fourteen dates.
const SERIES = [6.1, 6.4, 5.9, 6.3, 7.2, 0.4, 6.8, 7.0, 0.6, 6.9, 7.3, 1.1, 6.6, 7.1];
const DATES = ["01-13", "01-18", "01-28", "02-07", "02-22", "02-26", "03-03", "03-23", "04-05", "06-23", "06-04", "09-04", "10-21", "11-11"];

// The loop's steps, in order, and how long each holds (ms).
const STEPS = [1400, 2400, 2600, 2600, 2600] as const;
const CHART_W = 236;
const CHART_H = 96;

const chartPath = () =>
  SERIES.map((v, i) => `${i === 0 ? "M" : "L"}${((i / (SERIES.length - 1)) * CHART_W).toFixed(1)},${(CHART_H - (v / 8) * CHART_H).toFixed(1)}`).join(" ");

export const Explorer = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, STEPS);
  const layersIn = step >= 0;
  const timeRun = step >= 1;
  const edited = step >= 2;
  const charted = step >= 3;
  const ramp = RAMPS[edited ? 2 : 0];

  return (
    <div ref={ref} className={cn("relative aspect-[4/5] overflow-hidden rounded-[12px] border border-rule bg-night sm:aspect-[16/9]", className)}>
      {/* The map: one day, then the next as the time runs. */}
      <Image src={study5} alt="" sizes="(min-width: 1376px) 1296px, 100vw" className="absolute inset-0 h-full w-full object-cover" />
      <Image src={study3} alt="" sizes="(min-width: 1376px) 1296px, 100vw" className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-[1800ms] ease-out", timeRun ? "opacity-100" : "opacity-0")} />
      <div className="absolute inset-0 bg-linear-to-t/srgb from-night/70 to-night/0" />

      {/* Layers, left. */}
      <Panel className="absolute top-[5%] left-[3%] w-[min(44%,15rem)] max-sm:top-[4%] max-sm:left-[5%] max-sm:w-[82%]">
        <div className="flex gap-1 rounded-md border border-rule p-0.5 font-mono text-[9px] uppercase tracking-[0.06em]">
          <span className="flex flex-1 items-center justify-center rounded-[4px] bg-mist/10 py-1.5 text-mist">Map</span>
          <span className="flex flex-1 items-center justify-center py-1.5 text-haze">Catalog</span>
        </div>
        <PanelTitle right={<MdMoreVert className="size-3.5" />}>
          <span className="mt-1 block">Satellite Exploration</span>
        </PanelTitle>
        <ul className="mt-2 space-y-1">
          {LAYERS.map(({ name, meta, chip, on }, i) => (
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
              {on || (edited && i === 1) ? <MdVisibility className="size-3.5 shrink-0 text-mist" /> : <MdVisibilityOff className="size-3.5 shrink-0 text-haze" />}
            </li>
          ))}
        </ul>
        <div className="mt-2 flex items-center gap-2">
          <Label>Time</Label>
          <MdChevronLeft className="size-3.5 text-haze" />
          <Slider value={timeRun ? 86 : 18} className="flex-1" />
          <MdChevronRight className="size-3.5 text-haze" />
        </div>
        <Button className={cn("mt-3 w-full", layersIn && "[transition-delay:700ms]")}>
          Add new data set <MdAdd className="size-3.5" />
        </Button>
      </Panel>

      {/* Editing visualisation, lower middle. */}
      <Panel className={cn("absolute bottom-[6%] left-[30%] w-[min(40%,14rem)] transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] max-sm:hidden", step >= 1 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}>
        <PanelTitle right={<><MdZoomIn className="size-3.5" /><MdContentCopy className="size-3" /><MdClose className="size-3.5" /></>}>Editing Visualization</PanelTitle>
        <div className="mt-2.5 flex items-center gap-2">
          <span className={cn("size-6 rounded-[5px]", CHIPS[0])} />
          <span className="min-w-0 flex-1">
            <span className="block font-sans text-[11px] text-mist">Weather Forecast</span>
            <span className="block font-mono text-[8px] text-haze">2025-02-27, 10m_wind_speed</span>
          </span>
          <MdVisibility className="size-3.5 text-mist" />
        </div>
        <div className="mt-2.5 flex items-center gap-3">
          <Label className="w-12">Opacity</Label>
          <Slider value={edited ? 62 : 90} className="flex-1" />
        </div>
        <Label className="mt-2.5">Visualization Type</Label>
        <Select className="mt-1">Single Band</Select>
        <Label className="mt-2">Band</Label>
        <Select className="mt-1">2m-Temperature</Select>
        <Label className="mt-2">Color Ramp</Label>
        <Select className="mt-1">
          <span className={cn("size-3.5 rounded-[3px] transition-all duration-700", ramp.css)} />
          <span className="relative block h-4 w-14 overflow-hidden">
            {RAMPS.slice(0, 3).map((r) => (
              <span key={r.name} className={cn("absolute inset-0 transition-[opacity,translate] duration-500", r.name === ramp.name ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0")}>
                {r.name}
              </span>
            ))}
          </span>
        </Select>
      </Panel>

      {/* Pixel information, right. */}
      <Panel className={cn("absolute top-[5%] right-[3%] w-[min(44%,15.5rem)] transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] max-sm:top-auto max-sm:right-[5%] max-sm:bottom-[4%] max-sm:w-[82%]", step >= 2 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}>
        <PanelTitle right={<MdClose className="size-3.5" />}>Pixel Information</PanelTitle>
        <p className="mt-2 font-sans text-[11px] text-mist">Map Datasets</p>
        <p className="font-mono text-[8px] text-haze">Intersecting (37.845792, -11.3451)</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-sans text-[10px] text-mist">Sentinel-2 NDVI</span>
          <span className="flex gap-1">
            <span className="rounded-[4px] bg-mist/15 px-1.5 py-0.5 font-mono text-[8px] text-mist">⌁</span>
            <span className="rounded-[4px] border border-rule px-1.5 py-0.5 font-mono text-[8px] text-haze">▦</span>
          </span>
        </div>
        <div className="mt-2 grid grid-cols-[1fr_auto] border-t border-rule pt-2 font-mono text-[9px]">
          <span className="text-haze">Band</span>
          <span className="text-haze">Value</span>
          <span className="mt-1 text-mist">Ndvi</span>
          <span className={cn("mt-1 text-mint transition-opacity duration-700", charted ? "opacity-100" : "opacity-40")}>{charted ? "6.3050" : "0.0000"}</span>
        </div>
        <p className="mt-2 font-sans text-[10px] text-mist">Time Series</p>
        <Select className="mt-1 h-7">ndvi</Select>
        <svg viewBox={`-14 -4 ${CHART_W + 18} ${CHART_H + 30}`} className="mt-2 w-full" aria-hidden>
          {[0, 2, 4, 6, 8].map((v) => (
            <g key={v}>
              <line x1="0" x2={CHART_W} y1={CHART_H - (v / 8) * CHART_H} y2={CHART_H - (v / 8) * CHART_H} stroke="rgb(230 246 231 / 0.12)" strokeWidth="1" />
              <text x="-4" y={CHART_H - (v / 8) * CHART_H + 3} textAnchor="end" fontSize="7" fontFamily="var(--font-mono)" fill="#9aa49d">{v}</text>
            </g>
          ))}
          <path
            d={chartPath()}
            fill="none"
            stroke="#a0ffd7"
            strokeWidth="1.5"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={charted ? 0 : 1}
            className="transition-[stroke-dashoffset] duration-[2200ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          />
          {SERIES.map((v, i) => (
            <circle
              key={i}
              cx={(i / (SERIES.length - 1)) * CHART_W}
              cy={CHART_H - (v / 8) * CHART_H}
              r="2"
              fill="#a0ffd7"
              style={{ transitionDelay: charted ? `${200 + i * 140}ms` : "0ms" }}
              className={cn("origin-center transition-[opacity,scale] duration-300", charted ? "scale-100 opacity-100" : "scale-0 opacity-0")}
            />
          ))}
          {DATES.map((d, i) => (
            <text key={d + i} x={(i / (DATES.length - 1)) * CHART_W} y={CHART_H + 10} fontSize="5.5" fontFamily="var(--font-mono)" fill="#9aa49d" transform={`rotate(-60 ${(i / (DATES.length - 1)) * CHART_W} ${CHART_H + 10})`} textAnchor="end">
              2023-{d}
            </text>
          ))}
        </svg>
      </Panel>
    </div>
  );
};
