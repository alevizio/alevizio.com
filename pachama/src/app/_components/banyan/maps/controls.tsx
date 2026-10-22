"use client";

import { useState } from "react";
import { MdAdd, MdCloudDownload, MdCloudUpload, MdEdit, MdHome, MdLayers, MdRemove } from "react-icons/md";
import { cn } from "../../cn";
import { MAP_GLASS } from "./legend";

/* Banyan's map controls: a tool rail (light on the page, dark on the map),
 * the zoom pair and the scale bar. */
const TOOLS = [
  { id: "home", label: "Back to the project", Icon: MdHome },
  { id: "layers", label: "Layers", Icon: MdLayers },
  { id: "upload", label: "Upload a boundary", Icon: MdCloudUpload },
  { id: "draw", label: "Draw a boundary", Icon: MdEdit },
  { id: "download", label: "Download the data", Icon: MdCloudDownload },
] as const;
export type Tool = (typeof TOOLS)[number]["id"];

const DARK_RING = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white";
const LIGHT_RING = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-bn-heavy";

/** The rail: one tool on at a time, as on the map. */
export const ToolRail = ({ dark = false, value, onChange, className }: { dark?: boolean; value?: Tool; onChange?: (t: Tool) => void; className?: string }) => {
  const [own, setOwn] = useState<Tool>("layers");
  const active = value ?? own;
  return (
    <div role="toolbar" aria-label="Map tools" aria-orientation="vertical" className={cn("inline-grid gap-1 rounded-[10px] p-1", dark ? MAP_GLASS : "border border-bn-grey-light bg-white text-bn-heavy", className)}>
      {TOOLS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          aria-label={label}
          aria-pressed={active === id}
          title={label}
          onClick={() => (onChange ? onChange(id) : setOwn(id))}
          className={cn(
            "grid size-8 place-items-center rounded-[8px] transition-colors",
            dark ? DARK_RING : LIGHT_RING,
            active === id ? (dark ? "bg-white/20" : "bg-bn-grey-light") : dark ? "hover:bg-white/10" : "hover:bg-bn-grey-lightest",
          )}
        >
          <Icon aria-hidden className="size-4" />
        </button>
      ))}
    </div>
  );
};

export const Zoom = ({ onIn, onOut, canIn, canOut, className }: { onIn: () => void; onOut: () => void; canIn: boolean; canOut: boolean; className?: string }) => (
  <div className={cn("inline-grid divide-y divide-white/20 overflow-hidden rounded-[10px]", MAP_GLASS, className)}>
    <button type="button" aria-label="Zoom in" onClick={onIn} disabled={!canIn} className={cn("grid size-8 place-items-center hover:bg-white/10 disabled:opacity-40", DARK_RING)}>
      <MdAdd aria-hidden className="size-4" />
    </button>
    <button type="button" aria-label="Zoom out" onClick={onOut} disabled={!canOut} className={cn("grid size-8 place-items-center hover:bg-white/10 disabled:opacity-40", DARK_RING)}>
      <MdRemove aria-hidden className="size-4" />
    </button>
  </div>
);

/** Kilometres over miles, as the Figma draws it: 100 mi is 1.61 times 100 km. */
export const ScaleBar = ({ onDark = false, className }: { onDark?: boolean; className?: string }) => (
  <svg viewBox="0 0 104 34" role="img" aria-label="Scale bar: 100 kilometres above, 100 miles below" className={cn("h-[34px] w-[104px]", onDark ? "text-white" : "text-bn-heavy", className)}>
    <path d="M1 4v13h60V4M1 17v13h96.6v-6" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <text x="31" y="11" textAnchor="middle" className="fill-current text-[8px]">100 km</text>
    <text x="96" y="21" textAnchor="end" className="fill-current text-[8px]">100 mi</text>
  </svg>
);
