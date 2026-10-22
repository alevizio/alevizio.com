"use client";

import { useState } from "react";
import { MdForum } from "react-icons/md";
import { cn } from "../../cn";
import { BN } from "../ui";
import { PLACEMENTS, placementName, type Placement } from "./glass";
import { Popover } from "./popover";

/* Pick a place, and the popover opens there. */
export const PopoverPositions = () => {
  const [placement, setPlacement] = useState<Placement>("top");
  const [open, setOpen] = useState(true);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="grid h-80 w-full place-items-center">
        <Popover label="What a popover is" title={placementName(placement)} placement={placement} open={open} onOpenChange={setOpen}>
          A non-modal dialog that floats around a trigger.
        </Popover>
      </div>
      <div role="group" aria-label="Position" className="flex flex-wrap justify-center gap-2">
        {PLACEMENTS.map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={p === placement}
            onClick={() => {
              setPlacement(p);
              setOpen(true);
            }}
            className={cn("rounded-full border border-bn-medium px-3 py-1 text-[13px] text-bn-heavy aria-pressed:bg-bn-heavy aria-pressed:text-white", BN.focus)}
          >
            {placementName(p)}
          </button>
        ))}
      </div>
    </div>
  );
};

/* The two examples from the docs, in Pachama's own words. */
export const PopoverExamples = () => (
  <div className="flex w-full flex-wrap items-end justify-around gap-x-8 gap-y-40 pt-56">
    <Popover label="About vintages" title="What are project vintages, and do they matter?" icon={<MdForum aria-hidden className="size-6" />} defaultOpen>
      A credit&apos;s vintage is the year its emission reductions happened. It matters, but it&apos;s one factor among several: price,
      additionality, and what the project does for biodiversity and local communities.
    </Popover>
    <Popover label="Why this project can't be bought" title="This project has no availability" closeButton={false} defaultOpen>
      Interested in 1,000+ credits? <span className="underline">Contact sales to learn more</span>
    </Popover>
  </div>
);
