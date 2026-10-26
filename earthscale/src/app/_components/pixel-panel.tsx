"use client";

import { useRef } from "react";
import { MdClose } from "react-icons/md";
import { cn } from "./cn";
import { Panel, PanelTitle, Select } from "./panel";
import { useLoop } from "./use-loop";

/* Pixel information, playing itself: a point is picked, its value comes
 * in, and its time series draws point by point. */
const SERIES = [6.1, 6.4, 5.9, 6.3, 7.2, 0.4, 6.8, 7.0, 0.6, 6.9, 7.3, 1.1, 6.6, 7.1];
const DATES = ["01-13", "01-18", "01-28", "02-07", "02-22", "02-26", "03-03", "03-23", "04-05", "06-23", "06-04", "09-04", "10-21", "11-11"];
// Empty, the value in, the series drawn, held.
const STEPS = [900, 1300, 2600, 2600] as const;
const W = 236;
const H = 96;
const x = (i: number) => (i / (SERIES.length - 1)) * W;
const y = (v: number) => H - (v / 8) * H;
const PATH = SERIES.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

export const PixelPanel = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, STEPS);
  const picked = step >= 1;
  const charted = step >= 2;

  return (
    <div ref={ref} className={cn("mx-auto w-full max-w-[17.5rem]", className)}>
      <Panel>
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
          <span className={cn("mt-1 text-mint transition-opacity duration-700", picked ? "opacity-100" : "opacity-40")}>{picked ? "6.3050" : "0.0000"}</span>
        </div>
        <p className="mt-2 font-sans text-[10px] text-mist">Time Series</p>
        <Select className="mt-1 h-7">ndvi</Select>
        <svg viewBox={`-14 -4 ${W + 18} ${H + 30}`} className="mt-2 w-full" aria-hidden>
          {[0, 2, 4, 6, 8].map((v) => (
            <g key={v}>
              <line x1="0" x2={W} y1={y(v)} y2={y(v)} stroke="rgb(230 246 231 / 0.12)" strokeWidth="1" />
              <text x="-4" y={y(v) + 3} textAnchor="end" fontSize="7" fontFamily="var(--font-mono)" fill="#9aa49d">
                {v}
              </text>
            </g>
          ))}
          <path d={PATH} fill="none" stroke="#a0ffd7" strokeWidth="1.5" pathLength={1} strokeDasharray="1" strokeDashoffset={charted ? 0 : 1} className="transition-[stroke-dashoffset] duration-[2200ms] ease-[cubic-bezier(0.65,0,0.35,1)]" />
          {SERIES.map((v, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(v)}
              r="2"
              fill="#a0ffd7"
              style={{ transitionDelay: charted ? `${200 + i * 140}ms` : "0ms" }}
              className={cn("origin-center [transform-box:fill-box] transition-[opacity,scale] duration-300", charted ? "scale-100 opacity-100" : "scale-0 opacity-0")}
            />
          ))}
          {DATES.map((d, i) => (
            <text key={d + i} x={x(i)} y={H + 10} fontSize="5.5" fontFamily="var(--font-mono)" fill="#9aa49d" transform={`rotate(-60 ${x(i)} ${H + 10})`} textAnchor="end">
              2023-{d}
            </text>
          ))}
        </svg>
      </Panel>
    </div>
  );
};
