"use client";

import { useEffect, useState } from "react";
import { cn } from "./cn";
import { setView } from "./globe-store";
import { RAMPS } from "./ramps";

/* An easter egg: the number keys 1 to 5 paint the globes, the hero's and
 * the one at the end, in the product's five ramps, and a small note at the
 * foot of the window names the ramp a moment. Not while typing, and not
 * with a modifier held. */
const SHOW_MS = 1600;

export const RampKeys = () => {
  // The last ramp picked stays in the note while it fades out.
  const [ramp, setRamp] = useState(0);
  const [on, setOn] = useState(false);
  const [stamp, setStamp] = useState(0);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      if (e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable='true']")) return;
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1 || n > RAMPS.length) return;
      setView({ ramp: n - 1 });
      setRamp(n - 1);
      setOn(true);
      setStamp((s) => s + 1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  useEffect(() => {
    if (!stamp) return;
    const timer = window.setTimeout(() => setOn(false), SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [stamp]);

  return (
    <p
      role="status"
      aria-hidden={!on}
      className={cn(
        "pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-card/90 py-2 pr-4 pl-2 font-mono text-[11px] tracking-[0.12em] text-mist uppercase ring-1 ring-mist/15 backdrop-blur-md transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      )}
    >
      <span aria-hidden className={cn("h-3 w-10 rounded-full", RAMPS[ramp].css)} />
      {RAMPS[ramp].name} on the globes
    </p>
  );
};
