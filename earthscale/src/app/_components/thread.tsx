"use client";

import { useRef } from "react";
import { MdArrowUpward, MdCheckCircleOutline, MdClose, MdMoreVert, MdOutlineChat } from "react-icons/md";
import { cn } from "./cn";
import { Panel, PanelTitle } from "./panel";
import { useLoop } from "./use-loop";

/* A comment on a tile, as the page shows it, playing itself: the green pin
 * lands, Felix flags the tile, Noah answers, Felix thanks him, and a reply
 * starts. Then it starts over. */
const MESSAGES = [
  { who: "Felix Dorrek", initial: "F", when: "8 hrs ago", text: "There's something weird about this tile" },
  { who: "Noah", initial: "N", when: "2 hrs ago", text: "I'm not 100% what it is but I'll have a look" },
  { who: "Felix Dorrek", initial: "F", when: "5 min ago", text: "Thanks!" },
];
// Each message, the reply, the send, a hold.
const STEPS = [1200, 1600, 1400, 1800, 900, 2200] as const;

export const Thread = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, STEPS);
  const shown = step === 5 ? 3 : Math.min(step, 3);
  const typing = step === 3;
  const sent = step >= 4;

  return (
    <div ref={ref} className={cn("relative pl-11", className)}>
      <span className={cn("absolute top-0 left-0 grid size-8 origin-bottom-left place-items-center rounded-full rounded-bl-none bg-green text-night transition-[scale,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]", step === 0 ? "scale-50 opacity-0" : "scale-100 opacity-100")}>
        <MdOutlineChat className="size-4" />
      </span>
      <Panel className="p-5">
        <PanelTitle right={<><MdMoreVert className="size-3.5" /><MdCheckCircleOutline className="size-3.5" /><MdClose className="size-3.5" /></>}>Comment</PanelTitle>
        <ul className="mt-4 space-y-3.5">
          {MESSAGES.map(({ who, initial, when, text }, i) => (
            <li key={i} className={cn("flex gap-3 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]", i < shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")}>
              <span className={cn("grid size-6 shrink-0 place-items-center rounded-full font-mono text-[9px]", initial === "N" ? "bg-mint text-night" : "border border-rule text-mist")}>{initial}</span>
              <span className="min-w-0">
                <span className="block font-sans text-[11px] text-mist">
                  {who} <span className="font-mono text-[8px] text-haze">{when}</span>
                </span>
                <span className="block font-sans text-[11px] text-mist/90">{text}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center gap-3">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-mint font-mono text-[9px] text-night">N</span>
          <span className="flex min-h-8 flex-1 items-center justify-between gap-2 rounded-md border border-rule px-2.5 py-1.5 font-sans text-[11px]">
            <span className={cn("transition-colors duration-500", typing || sent ? "text-mist" : "text-haze")}>
              {typing || sent ? "Looks like a stitching seam, re-running the tiles" : "Reply"}
              {typing ? <span className="ml-px inline-block h-3 w-px bg-mint align-middle motion-safe:animate-[es-blink_1s_steps(2)_infinite]" /> : null}
            </span>
            <span className={cn("grid size-5 shrink-0 place-items-center rounded-full transition-colors duration-300", sent ? "bg-mint text-night" : "bg-mist/15 text-haze")}>
              <MdArrowUpward className="size-3" />
            </span>
          </span>
        </div>
      </Panel>
    </div>
  );
};
