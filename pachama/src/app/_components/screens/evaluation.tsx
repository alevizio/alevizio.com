"use client";

import type { ReactNode } from "react";
import { Tag } from "../banyan/data-display/tag";
import { cn } from "../cn";
import { BaselineChart } from "./baseline-chart";
import { ReferenceMap } from "./reference-map";

/* The two checks Manoa's evaluation put a baseline through, rebuilt in
 * Banyan from the old screen with the same copy: is the reference region
 * suitable, and is the baseline conservative? Both are live SVG, drawn as
 * they come into view. */
const Check = ({ title, text, children }: { title: string; text: string; children: ReactNode }) => (
  <div className="overflow-hidden rounded-[12px] border border-bn-grey-light">
    <div className="p-6">
      <p className="text-[18px] leading-6 font-bold text-bn-heavy">{title}</p>
      <p className="mt-1 text-[13px] leading-5 text-bn-medium">{text}</p>
    </div>
    {children}
  </div>
);

export const Evaluation = ({ className }: { className?: string }) => (
  <div className={cn("rounded-[16px] border border-bn-grey-light bg-white p-5 text-bn-heavy sm:p-8 [--bn-surface:#ffffff]", className)}>
    <p className="flex items-center gap-2 text-[22px] leading-7 font-bold text-bn-heavy">
      Baseline quality <Tag label="Beta" size="xs" />
    </p>
    <p className="mt-2 max-w-[70ch] text-[14px] leading-5 text-bn-medium">
      Baselines have a huge impact on the overall credits that a project earns and is subject to the most uncertainty. Predicting what&rsquo;s
      going to happen without a project is obviously very hard and subject to interpretation.
    </p>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Check
        title="Quality check: Reference region suitability"
        text="In order to calculate a baseline, most projects identify a geographic area similar in some key attributes to the project area, known as a reference region."
      >
        <ReferenceMap />
      </Check>
      <Check
        title="Quality check: Baseline conservativeness"
        text="Carbon credits are issued based on the difference between a project's actual impact and what would have happened without the project, as represented by the baseline."
      >
        <BaselineChart className="px-6 pb-6" />
      </Check>
    </div>
  </div>
);
