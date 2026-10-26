"use client";

import { useRef } from "react";
import { MdMoreVert, MdVisibility } from "react-icons/md";
import { RxEnterFullScreen, RxEraser, RxExit, RxEyeOpen, RxPencil1 } from "react-icons/rx";
import { cn } from "./cn";
import { CHIPS } from "./ramps";
import { Pointer } from "./ui";
import { useLoop } from "./use-loop";

/* A layer's menu, playing itself: the pointer opens it from the layer's
 * dots and runs down what it can do. The last two wait, greyed, as the
 * file has them. */
const ITEMS = [
  { label: "Remove From Map", Icon: RxEraser, off: false },
  { label: "Edit Visualization", Icon: RxPencil1, off: false },
  { label: "View Details", Icon: RxEyeOpen, off: false },
  { label: "Zoom To Fit (Z)", Icon: RxEnterFullScreen, off: true },
  { label: "Open In QGIS", Icon: RxExit, off: true },
];
// Closed, opened, the pointer down the first three, held open.
const STEPS = [1200, 800, 850, 850, 850, 1500] as const;
// Where the pointer sits: on the dots, then on each row (rem from the top).
const POINTER_TOP = ["top-[1.15rem]", "top-[1.15rem]", "top-[4.6rem]", "top-[6.35rem]", "top-[8.1rem]", "top-[1.15rem]"];
const POINTER_LEFT = ["left-[80%]", "left-[80%]", "left-[62%]", "left-[62%]", "left-[62%]", "left-[80%]"];

export const SubMenu = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, STEPS);
  const open = step >= 1;
  const row = step >= 2 && step <= 4 ? step - 2 : -1;

  return (
    <div ref={ref} className={cn("relative mx-auto w-full max-w-[16rem]", className)}>
      <div className="flex items-center gap-2.5 rounded-[10px] border border-rule bg-card px-2.5 py-2">
        <span className={cn("size-7 shrink-0 rounded-[6px]", CHIPS[0])} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-sans text-[11px] leading-tight text-mist">Weather Forecast</span>
          <span className="block truncate font-mono text-[8px] text-haze">2025-02-27, 10m_wind_speed</span>
        </span>
        <span className={cn("grid size-6 place-items-center rounded-md transition-colors duration-300", open ? "bg-mist/15 text-mist" : "text-haze")}>
          <MdMoreVert className="size-3.5" />
        </span>
        <MdVisibility className="size-3.5 shrink-0 text-mist" />
      </div>
      <ul className={cn("mt-1.5 ml-auto w-[11.5rem] origin-top-right rounded-[10px] border border-rule bg-card/95 p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition-[opacity,scale] duration-300 ease-out", open ? "scale-100 opacity-100" : "scale-95 opacity-0")}>
        {ITEMS.map(({ label, Icon, off }, i) => (
          <li key={label} className={cn("flex h-7 items-center justify-between rounded-md px-2.5 font-sans text-[11px] transition-colors duration-200", row === i ? "bg-mist/10 text-mist" : off ? "text-haze/50" : "text-mist")}>
            {label}
            <Icon aria-hidden className="size-3.5" />
          </li>
        ))}
      </ul>
      <Pointer className={cn("absolute transition-[top,left] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", POINTER_TOP[step], POINTER_LEFT[step])} />
    </div>
  );
};
