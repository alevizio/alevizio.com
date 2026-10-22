"use client";

import { useEffect, useRef } from "react";
import { MdPause, MdPlayArrow } from "react-icons/md";
import { cn } from "../../cn";
import { YEARS, type Year } from "./data";
import { MAP_GLASS } from "./legend";

/* Banyan's map player: play through the years, or pick one, or all. It
 * never starts on its own, steps once a second and stops at the end. */
export type Pick = Year | "all";

export const Player = ({ pick, onPick, playing, onPlaying, className }: { pick: Pick; onPick: (p: Pick) => void; playing: boolean; onPlaying: (p: boolean) => void; className?: string }) => {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    if (!playing) return;
    const i = pick === "all" ? -1 : YEARS.indexOf(pick);
    if (i === YEARS.length - 1) {
      timer.current = setTimeout(() => onPlaying(false), 1000);
    } else {
      timer.current = setTimeout(() => onPick(YEARS[i + 1]), i === -1 ? 0 : 1000);
    }
    return () => clearTimeout(timer.current);
  }, [playing, pick, onPick, onPlaying]);

  const seg = "flex h-9 items-center px-4 font-mono text-[12px] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white";
  return (
    <div role="group" aria-label="Years" className={cn("inline-flex divide-x divide-white/20 overflow-hidden rounded-[10px]", MAP_GLASS, className)}>
      <button type="button" aria-label={playing ? "Pause" : "Play through the years"} onClick={() => onPlaying(!playing)} className={cn(seg, "px-3 hover:bg-white/10")}>
        {playing ? <MdPause aria-hidden className="size-4" /> : <MdPlayArrow aria-hidden className="size-4" />}
      </button>
      {[...YEARS, "all" as const].map((y) => (
        <button
          key={y}
          type="button"
          aria-pressed={pick === y}
          onClick={() => {
            onPlaying(false);
            onPick(y);
          }}
          className={cn(seg, pick === y ? "bg-white/15" : "hover:bg-white/10")}
        >
          {y === "all" ? (
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="size-1.5 rounded-full bg-bn-green" />
              ALL
            </span>
          ) : (
            y
          )}
        </button>
      ))}
    </div>
  );
};
