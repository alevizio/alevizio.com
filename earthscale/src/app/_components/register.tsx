"use client";

import { useRef } from "react";
import { MdArrowBack, MdArrowForward, MdCheck, MdClose, MdRefresh } from "react-icons/md";
import { cn } from "./cn";
import { Button, Label, Panel, PanelTitle, Select, Slider, Typed } from "./panel";
import { CHIPS } from "./ramps";
import { useLoop } from "./use-loop";

/* Registering a dataset, as the page shows it, playing itself: the URL
 * types in, access is checked and found, the name types in, the
 * visualisation is set, and it registers. Then it starts over. */
const STAGES = ["URL", "Access", "Metadata", "Visualization"];
// The loop's steps and how long each holds (ms): url typing, next, access
// checking, access found, metadata typing, visualisation, registered.
const STEPS = [2200, 900, 1800, 1000, 2000, 2400, 1600] as const;
const URL_TEXT = "gs://earthscale-public/datasets/raster/hles_tanzania/";
const NAME_TEXT = "Sentinel2 Nvidi 37mbu (Demo)";

export const Register = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, STEPS);
  const stage = step <= 1 ? 0 : step <= 3 ? 1 : step === 4 ? 2 : 3;
  const done = (i: number) => i < stage || (i === 3 && step === 6);
  const checking = step === 2;

  return (
    <div ref={ref} className={className}>
      <Panel className="p-5">
        <PanelTitle right={<MdClose className="size-4" />}>Register New Dataset</PanelTitle>
        <ol className="mt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.04em]">
          {STAGES.map((name, i) => (
            <li key={name} className="flex flex-1 items-center gap-2 last:flex-none">
              <span className={cn("grid size-4 shrink-0 place-items-center rounded-full border transition-colors duration-500", done(i) ? "border-mint bg-mint text-night" : i === stage ? "border-mint text-mint" : "border-rule text-haze")}>
                {done(i) ? <MdCheck className="size-3" /> : null}
              </span>
              <span className={cn("transition-colors duration-500", i <= stage ? "text-mist" : "text-haze", i !== stage && "max-sm:hidden")}>{name}</span>
              {i < STAGES.length - 1 ? <span className={cn("ml-1 h-px flex-1 transition-colors duration-700", done(i) ? "bg-mint" : "bg-rule")} /> : null}
            </li>
          ))}
        </ol>

        <div className="relative mt-5 min-h-[7.5rem]">
          {/* URL */}
          <div className={cn("absolute inset-0 transition-opacity duration-500", stage === 0 ? "opacity-100" : "pointer-events-none opacity-0")}>
            <Label>Dataset Url</Label>
            <p className="mt-1.5 border-b border-rule pb-1.5 font-mono text-[11px] text-mist">
              <Typed text={URL_TEXT} on={step >= 0 && stage === 0} />
              <span className={cn("ml-px inline-block h-3 w-px bg-mint align-middle", step === 0 && "motion-safe:animate-[es-blink_1s_steps(2)_infinite]")} />
            </p>
          </div>
          {/* Access */}
          <div className={cn("absolute inset-0 transition-opacity duration-500", stage === 1 ? "opacity-100" : "pointer-events-none opacity-0")}>
            <p className="flex items-center gap-3 font-mono text-[10px] text-mist">
              <span className="truncate">{checking ? "Checking Access To Gs://Earthscale-Public/Datasets/Raster/Hles_tanzania/..." : "Access confirmed: Gs://Earthscale-Public/Datasets/Raster/Hles_tanzania/..."}</span>
              {checking ? (
                <span className="size-3.5 shrink-0 rounded-full border-2 border-mint/25 border-t-mint motion-safe:animate-spin" />
              ) : (
                <MdCheck className="size-4 shrink-0 text-mint" />
              )}
            </p>
          </div>
          {/* Metadata */}
          <div className={cn("absolute inset-0 transition-opacity duration-500", stage === 2 ? "opacity-100" : "pointer-events-none opacity-0")}>
            <Label>Dataset Name</Label>
            <p className="mt-1.5 border-b border-rule pb-1.5 font-mono text-[11px] text-mist">
              <Typed text={NAME_TEXT} on={stage === 2} />
            </p>
            <p className="mt-3 font-mono text-[9px] text-haze underline decoration-rule underline-offset-4">Advance Options</p>
          </div>
          {/* Visualisation */}
          <div className={cn("absolute inset-0 transition-opacity duration-500", stage === 3 ? "opacity-100" : "pointer-events-none opacity-0")}>
            <p className="font-sans text-[11px] text-mist">Editing Visualization</p>
            <p className="font-mono text-[8px] text-haze">{NAME_TEXT} · Raster</p>
            <div className="mt-2 flex items-center gap-3">
              <Label className="w-12">Opacity</Label>
              <Slider value={stage === 3 ? 78 : 30} className="flex-1" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Select className="h-7">Single Band</Select>
              <Select className="h-7">
                <span className={cn("size-3 rounded-[3px]", CHIPS[3])} /> Inferno
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button>
            <MdArrowBack className="size-3.5" /> Back
          </Button>
          {checking ? (
            <Button>
              Try again <MdRefresh className="size-3.5" />
            </Button>
          ) : (
            <Button primary={step === 1 || step === 6}>
              {stage === 3 ? "Register" : "Next"} <MdArrowForward className="size-3.5" />
            </Button>
          )}
        </div>
      </Panel>
    </div>
  );
};
