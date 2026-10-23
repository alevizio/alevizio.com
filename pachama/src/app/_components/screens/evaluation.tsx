"use client";

import { useState, type ReactNode } from "react";
import { MdArrowBack, MdCheckCircle } from "react-icons/md";
import { Tag } from "../banyan/data-display/tag";
import { CountryRow } from "../banyan/patterns/card-parts";
import { Tabs } from "../banyan/patterns/tabs";
import { BN } from "../banyan/ui";
import { cn } from "../cn";
import { BaselineChart } from "./baseline-chart";
import { ReferenceMap } from "./reference-map";

/* Manoa's Evaluation 2.0, rebuilt in Banyan from the old screen: the same
 * copy, facts and checks, in the brand it never got. The five standards
 * are toggles that say what each one means; the reference region and the
 * baseline are live SVG, drawn as they come into view. */
const STANDARDS = [
  { name: "Accurate", text: "The carbon a project claims matches what's measured, on the ground and from space." },
  { name: "Additional", text: "The forest's protection depends on the credits; without them it wouldn't happen." },
  { name: "Durable", text: "The carbon stays stored for the long run, with a buffer against risks like fire." },
  { name: "Net", text: "Deforestation pushed onto the land next door counts against the project." },
  { name: "Beyond Carbon", text: "It does right by the people and the wildlife around it, too." },
] as const;

const Panel = ({ children }: { children: ReactNode }) => <p className="max-w-prose pt-6 text-[15px] leading-6 text-bn-medium">{children}</p>;

const Check = ({ title, text, children }: { title: string; text: string; children: ReactNode }) => (
  <div className="overflow-hidden rounded-[12px] border border-bn-grey-light">
    <div className="p-6">
      <p className="text-[18px] leading-6 font-bold text-bn-heavy">{title}</p>
      <p className="mt-1 text-[13px] leading-5 text-bn-medium">{text}</p>
    </div>
    {children}
  </div>
);

const Results = () => {
  const [open, setOpen] = useState<string>("Accurate");
  const current = STANDARDS.find((s) => s.name === open);
  return (
    <div className="pt-8">
      <p className="text-[24px] leading-8 font-bold text-bn-heavy">Evaluation results 2.0</p>
      <p className="mt-2 max-w-[62ch] text-[14px] leading-5 text-bn-medium">
        In order for a project to meet Pachama&rsquo;s Quality Standard, every forest conservation or restoration project listed on the Pachama
        Marketplace must adhere to our core standards.
      </p>
      <div role="group" aria-label="Pachama's core standards" className="mt-5 inline-flex flex-wrap gap-1 rounded-[20px] bg-bn-grey-lightest p-1">
        {STANDARDS.map(({ name }) => (
          <button
            key={name}
            type="button"
            aria-pressed={open === name}
            onClick={() => setOpen(name)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] leading-5 font-medium text-bn-heavy transition-colors",
              open === name ? "bg-white shadow-[0_1px_3px_rgb(14_37_23/0.15)]" : "hover:bg-white/60",
              BN.focus,
            )}
          >
            <MdCheckCircle aria-hidden className="size-4 text-[#23854a]" />
            {name}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mt-3 min-h-10 max-w-[62ch] text-[14px] leading-5 text-bn-heavy">
        {current?.text}
      </p>

      <div className="mt-6 rounded-[16px] border border-bn-grey-light p-5 sm:p-8">
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
    </div>
  );
};

export const Evaluation = ({ className }: { className?: string }) => (
  <div className={cn("overflow-hidden rounded-[16px] border border-bn-grey-light bg-white p-6 text-bn-heavy sm:p-10 [--bn-surface:#ffffff]", className)}>
    <p className="flex items-center gap-2 text-[14px] leading-5 text-bn-heavy">
      <MdArrowBack aria-hidden className="size-5" />
      Back to my projects
    </p>
    <h4 className="mt-5 text-[36px] leading-[44px] font-bold">Manoa</h4>
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] leading-5">
      <CountryRow country="Manoa, Brazil" area="74,039 hectares" />
      <span>REDD+ Avoided Planned Deforestation</span>
      <span>Verified Carbon Standard</span>
      <span className="text-bn-medium">Registry ID: 674</span>
    </div>
    <Tabs
      label="Manoa"
      initial={1}
      className="mt-8"
      items={[
        { label: "Dashboard", panel: <Panel>Carbon, area and the latest monitoring, at a glance.</Panel> },
        { label: "Evaluation", panel: <Results /> },
        { label: "Carbon monitoring", panel: <Panel>The forest&rsquo;s carbon, year by year, against the baseline.</Panel> },
      ]}
    />
  </div>
);
