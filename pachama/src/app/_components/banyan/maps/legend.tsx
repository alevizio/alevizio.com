"use client";

import { useState, type ReactNode } from "react";
import { MdInfoOutline, MdLocalFireDepartment } from "react-icons/md";
import { cn } from "../../cn";

/* Banyan's map legend: dark glass in the corner, a section per layer, and
 * an entry per thing it draws. Here every entry is a switch for its layer;
 * the info button shows where the data comes from. */
type Layer = "burnedNew" | "burnedOld" | "alerts" | "clearedNew" | "clearedOld" | "boundary";
export type Layers = Record<Layer, boolean>;
export const ALL_ON: Layers = { burnedNew: true, burnedOld: true, alerts: true, clearedNew: true, clearedOld: true, boundary: true };

export const MAP_GLASS = "bg-bn-glass-5/75 text-white backdrop-blur-md";
const RING = "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white";

const Entry = ({ on, label, swatch, onToggle }: { on: boolean; label: string; swatch: ReactNode; onToggle: () => void }) => (
  <li>
    <button type="button" aria-pressed={on} onClick={onToggle} className={cn("flex w-full items-center gap-2 rounded-[4px] py-1 text-left text-[12px] leading-4", RING, !on && "opacity-50")}>
      {swatch}
      <span className={cn(!on && "line-through")}>{label}</span>
    </button>
  </li>
);

const dot = (c: string) => <span aria-hidden className={cn("size-2.5 shrink-0 rounded-[2px]", c)} />;

const Section = ({ title, source, children }: { title: string; source: string; children: ReactNode }) => {
  const [info, setInfo] = useState(false);
  return (
    <div>
      <p className="flex items-center gap-1 text-[13px] font-medium">
        {title}
        <button type="button" aria-expanded={info} aria-label={`Where the ${title.toLowerCase()} data comes from`} onClick={() => setInfo((v) => !v)} className={cn("rounded-full", RING)}>
          <MdInfoOutline aria-hidden className="size-3.5" />
        </button>
      </p>
      {info ? <p className="mt-1 max-w-48 text-[11px] leading-4 text-white/85">{source}</p> : null}
      <ul className="mt-1">{children}</ul>
    </div>
  );
};

export const Legend = ({ layers, onChange, className }: { layers: Layers; onChange: (l: Layers) => void; className?: string }) => {
  const flip = (k: Layer) => () => onChange({ ...layers, [k]: !layers[k] });
  return (
    <div className={cn("grid w-44 gap-3 rounded-[10px] p-3", MAP_GLASS, className)}>
      <Section title="Burned area" source="Active fires seen by NASA's MODIS and VIIRS satellites, through FIRMS. Illustrative here.">
        <Entry on={layers.burnedNew} label="Newer" swatch={dot("bg-bn-red")} onToggle={flip("burnedNew")} />
        <Entry on={layers.burnedOld} label="Older" swatch={dot("bg-bn-red-dark")} onToggle={flip("burnedOld")} />
        <Entry on={layers.alerts} label="Alerts" swatch={<MdLocalFireDepartment aria-hidden className="size-3.5 shrink-0 rounded-full bg-bn-red p-px" />} onToggle={flip("alerts")} />
      </Section>
      <Section title="Deforestation" source="Forest loss from annual global maps and registry-approved inventories. Illustrative here.">
        <Entry on={layers.clearedNew} label="Newer" swatch={dot("bg-bn-indigo")} onToggle={flip("clearedNew")} />
        <Entry on={layers.clearedOld} label="Older" swatch={dot("bg-bn-indigo-darkest")} onToggle={flip("clearedOld")} />
      </Section>
      <ul>
        <Entry on={layers.boundary} label="Project boundary" swatch={dot("bg-white")} onToggle={flip("boundary")} />
      </ul>
    </div>
  );
};
