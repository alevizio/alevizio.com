"use client";

import basemap from "@/assets/maps/ucayali.jpg";
import Image from "next/image";
import { useId, useState } from "react";
import { cn } from "../cn";
import { UI } from "./ui";

/* The map controls, working: four layers over satellite imagery, a legend,
 * and a time slider. Forest loss piles up in the control area while the
 * project holds, the dynamic baseline in one picture. Illustrative geometry
 * over Deimos imagery of the Ucayali; not a real project. */
type Pt = [number, number];
const PROJECT: Pt[] = [[560, 150], [705, 125], [770, 235], [700, 345], [575, 330], [520, 235]];
const CONTROL: Pt[] = [[170, 265], [325, 235], [405, 320], [345, 440], [205, 430], [135, 345]];
const poly = (p: Pt[]) => p.map(([x, y]) => `${x},${y}`).join(" ");

const inside = ([x, y]: Pt, p: Pt[]) =>
  p.reduce((hit, [xi, yi], i) => {
    const [xj, yj] = p[(i + p.length - 1) % p.length];
    return yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi ? !hit : hit;
  }, false);

// A seeded random, so the loss looks the same on every visit.
const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const scatter = (area: Pt[], count: number, seed: number) => {
  const r = rng(seed);
  const xs = area.map((p) => p[0]);
  const ys = area.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const out: { x: number; y: number; year: number }[] = [];
  while (out.length < count) {
    const pt: Pt = [x0 + r() * (x1 - x0), y0 + r() * (y1 - y0)];
    if (inside(pt, area)) out.push({ x: pt[0], y: pt[1], year: 2016 + Math.floor(Math.sqrt(r()) * 9) });
  }
  return out;
};
const LOSS = { control: scatter(CONTROL, 150, 7), project: scatter(PROJECT, 14, 11) };
const HA_PER_DOT = 12;

const LAYERS = [
  { key: "project", label: "Project area" },
  { key: "control", label: "Control area" },
  { key: "canopy", label: "Canopy height" },
  { key: "loss", label: "Forest loss" },
] as const;
type LayerKey = (typeof LAYERS)[number]["key"];

export const MapWidget = () => {
  const [on, setOn] = useState<Record<LayerKey, boolean>>({ project: true, control: true, canopy: true, loss: true });
  const [year, setYear] = useState(2024);
  // useId can hold ":" or "«»", which break an SVG url(#…) reference.
  const ids = useId().replace(/[^\w-]/g, "");
  const lost = (area: keyof typeof LOSS) => LOSS[area].filter((d) => d.year <= year).length * HA_PER_DOT;

  return (
    <div className={cn(UI.card, "grid overflow-hidden lg:grid-cols-[1fr_17rem]")}>
      <div className="relative">
        <Image src={basemap} alt="" sizes="(min-width: 1024px) 1000px, 100vw" className="h-full w-full object-cover" />
        <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Forest loss to ${year}: ${lost("control")} hectares in the control area, ${lost("project")} in the project`} className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id={`${ids}canopy`} x1="0" y1="1" x2="0.4" y2="0">
              <stop offset="0" stopColor="#440154" />
              <stop offset="0.35" stopColor="#31688e" />
              <stop offset="0.7" stopColor="#35b779" />
              <stop offset="1" stopColor="#fde725" />
            </linearGradient>
          </defs>
          {on.canopy ? <polygon points={poly(PROJECT)} fill={`url(#${ids}canopy)`} opacity="0.6" /> : null}
          {on.loss ? [...LOSS.control, ...LOSS.project].filter((d) => d.year <= year).map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="4" fill="#ff4d4d" opacity="0.9" />) : null}
          {on.control ? <polygon points={poly(CONTROL)} fill="none" stroke="#f5e544" strokeWidth="3" strokeDasharray="10 7" /> : null}
          {on.project ? <polygon points={poly(PROJECT)} fill="rgb(255 255 255 / 0.08)" stroke="#fff" strokeWidth="3" /> : null}
        </svg>
      </div>

      <div className="grid content-start gap-6 border-t border-[#e3e6e4] p-5 lg:border-l lg:border-t-0">
        <fieldset>
          <legend className={cn(UI.label, "mb-2")}>Layers</legend>
          {LAYERS.map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-center justify-between py-1.5 text-[14px] text-[#141a17]">
              {label}
              <input type="checkbox" checked={on[key]} onChange={(e) => setOn((s) => ({ ...s, [key]: e.target.checked }))} className="size-4 accent-[#23854a]" />
            </label>
          ))}
        </fieldset>

        <div>
          <label htmlFor={`${ids}year`} className={cn(UI.label, "flex justify-between")}>
            Forest loss to <span className="text-[#141a17]">{year}</span>
          </label>
          <input id={`${ids}year`} type="range" min={2016} max={2024} value={year} onChange={(e) => setYear(Number(e.target.value))} aria-valuetext={String(year)} className="mt-2 w-full accent-[#13adb1]" />
          <p className="mt-3 text-[13px] leading-snug text-[#3c4742]">
            Control area <span className="font-medium">{lost("control").toLocaleString("en-US")} ha</span>
            <br />
            Project <span className="font-medium">{lost("project").toLocaleString("en-US")} ha</span>
          </p>
        </div>

        <div>
          <p className={cn(UI.label, "mb-2")}>Canopy height</p>
          <div className="h-2 rounded-full bg-linear-to-r from-[#440154] via-[#35b779] to-[#fde725]" />
          <p className="mt-1 flex justify-between font-mono text-[11px] text-[#5f6b66]">
            <span>0 m</span>
            <span>40 m</span>
          </p>
        </div>
      </div>
    </div>
  );
};
