"use client";

import { useRef } from "react";
import { MdCheck } from "react-icons/md";
import {
  RxActivityLog,
  RxArrowUp,
  RxBarChart,
  RxChatBubble,
  RxCheckCircled,
  RxChevronLeft,
  RxChevronRight,
  RxCode,
  RxColorWheel,
  RxCopy,
  RxCross2,
  RxCrosshair1,
  RxCube,
  RxDotsVertical,
  RxDownload,
  RxDrawingPin,
  RxDropdownMenu,
  RxEnterFullScreen,
  RxEraser,
  RxExit,
  RxEyeClosed,
  RxEyeOpen,
  RxGear,
  RxGlobe,
  RxLayers,
  RxLink1,
  RxMagnifyingGlass,
  RxMix,
  RxOpacity,
  RxPencil1,
  RxReload,
  RxRulerSquare,
  RxShare1,
  RxSquare,
  RxTable,
  RxTarget,
  RxTimer,
  RxUpload,
  RxZoomIn,
  RxZoomOut,
} from "react-icons/rx";
import { cn } from "./cn";
import { Panel, PanelTitle } from "./panel";
import { RAMPS } from "./ramps";
import { useLoop } from "./use-loop";

/* Two small pieces for the kit's belt: the colour ramp picker, stepping
 * through the five, and the file's icons (its Radix set, 10:4757), the ones
 * the panels use lighting in turn. */

const RAMP_STEPS = [1600, 1600, 1600, 1600, 1600] as const;

export const RampPicker = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const on = useLoop(ref, RAMP_STEPS);

  return (
    <div ref={ref} className={cn("mx-auto w-full max-w-[17.5rem]", className)}>
      <Panel>
        <PanelTitle>Color Ramp</PanelTitle>
        <ul className="mt-3 grid gap-1">
          {RAMPS.map(({ name, css }, i) => (
            <li key={name} className={cn("flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors duration-500", i === on ? "bg-mist/10" : "bg-transparent")}>
              <span className={cn("h-3 w-20 shrink-0 rounded-[3px]", css)} />
              <span className={cn("flex-1 font-sans text-[11px] transition-colors duration-500", i === on ? "text-mint" : "text-mist")}>{name}</span>
              <MdCheck aria-hidden className={cn("size-3.5 text-mint transition-opacity duration-500", i === on ? "opacity-100" : "opacity-0")} />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
};

const ICONS = [
  RxEyeOpen, RxEyeClosed, RxLayers, RxGlobe, RxCrosshair1, RxTarget, RxRulerSquare, RxMagnifyingGlass,
  RxZoomIn, RxZoomOut, RxEnterFullScreen, RxExit, RxDotsVertical, RxDropdownMenu, RxChevronLeft, RxChevronRight,
  RxCheckCircled, RxCross2, RxCopy, RxSquare, RxEraser, RxPencil1, RxChatBubble, RxArrowUp,
  RxDrawingPin, RxLink1, RxShare1, RxDownload, RxUpload, RxReload, RxTimer, RxGear,
  RxMix, RxOpacity, RxColorWheel, RxCube, RxTable, RxBarChart, RxActivityLog, RxCode,
];
// The ones the panels use, lit one after another: the eye, the layers, the
// globe, the crosshair, the comment, the pencil, the zoom, the ramp.
const LIT = [0, 2, 3, 4, 22, 21, 8, 34];
const ICON_STEPS = LIT.map(() => 900);

export const IconGrid = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const lit = LIT[useLoop(ref, ICON_STEPS)];

  return (
    <div ref={ref} className={className}>
      <p className="font-mono text-[11px] tracking-[0.02em] text-mist">Radix Icons</p>
      <ul className="mt-4 grid grid-cols-8 gap-1.5" aria-label="The file's icons">
        {ICONS.map((Icon, i) => (
          <li key={i} className={cn("grid aspect-square place-items-center rounded-md transition-colors duration-500", i === lit ? "bg-mint/15 text-mint" : "text-mist/70")}>
            <Icon aria-hidden className="size-4" />
          </li>
        ))}
      </ul>
    </div>
  );
};
