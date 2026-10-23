"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { cn } from "../cn";
import { pressNext, useAutoplay } from "./autoplay";
import { DataTable } from "./data-display/table/table";
import { Alert } from "./feedback/alert";
import { ProgressDemo } from "./feedback/demos";
import { Spinner } from "./feedback/spinner";
import { BrandRamps } from "./foundations/colours";
import { TypeScale } from "./foundations/type-scale";
import { Choices } from "./forms/demos";
import { AppFrame } from "./patterns/app-frame";
import { KALIMANTAN, LIFECYCLE } from "./patterns/content";
import { PortfolioCard, ProjectsByYear } from "./patterns/graphs";
import { PROJECT_TABS } from "./patterns";
import { ProjectCard } from "./patterns/project-card";
import { StepperRow } from "./patterns/stepper";
import { Tabs } from "./patterns/tabs";
import { BENTO_CARD, SPAN, Specimen } from "./specimen";
import { Ticker } from "./ticker";

/* The contact sheet's first look: a dozen of the library's pieces rather
 * than all of them, set out three ways (on the eggshell itself, on a dotted
 * canvas, on a dark gridded board) and at work. The small parts pass on a
 * belt; the switches, tabs, stepper, type and progress bar operate
 * themselves while they're in view, and stop the moment someone points at
 * them or tabs in. Every family is a chip away, whole. */
const CANVAS = "rounded-[28px] bg-[#f5f2e6] bg-[radial-gradient(#d8d0b4_1.2px,transparent_1.6px)] [background-size:18px_18px] p-5 sm:p-8";
const BOARD =
  "rounded-[28px] bg-[#0e2517] bg-[linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:32px_32px] p-6 sm:p-10";

/** A component that runs itself: `step` presses one of its controls every `every` ms. */
const Running = ({ step, every, children, className }: { step: (el: HTMLElement) => void; every: number; children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useAutoplay(ref, step, every);
  return (
    <div ref={ref} className={cn("w-full", className)}>
      {children}
    </div>
  );
};

// What each one presses. Module-level, so they keep their identity.
const nextInput = (el: HTMLElement) => {
  const inputs = Array.from(el.querySelectorAll<HTMLInputElement>("input:not(:disabled)"));
  const i = (Number(el.dataset.at ?? -1) + 1) % inputs.length;
  el.dataset.at = String(i);
  inputs[i]?.click();
};
const nextTab = (el: HTMLElement) => pressNext(el, '[role="tab"]:not([disabled]):not([aria-disabled="true"])', (t) => t.getAttribute("aria-selected") === "true");
// Through the weights, and over to the other face after the last one.
const nextType = (el: HTMLElement) => {
  const [faces, weights] = Array.from(el.querySelectorAll("fieldset")).map((f) => Array.from(f.querySelectorAll<HTMLInputElement>('input[type="radio"]')));
  if (!faces || !weights) return;
  const w = weights.findIndex((r) => r.checked);
  if (w < weights.length - 1) weights[w + 1].click();
  else faces[(faces.findIndex((r) => r.checked) + 1) % faces.length].click();
};
const runProgress = (el: HTMLElement) => el.querySelector<HTMLButtonElement>("button")?.click();

/** The lifecycle, a step further every few seconds. */
const Lifecycle = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);
  useAutoplay(ref, useCallback(() => setCurrent((c) => (c + 1) % LIFECYCLE.length), []), 2400);
  return (
    <div ref={ref} className="grid w-full gap-6">
      <StepperRow steps={LIFECYCLE} current={current} label="Project lifecycle" className="flex-wrap gap-y-3" />
      <StepperRow steps={LIFECYCLE} current={current} size="small" showNext label="Project lifecycle, small" />
    </div>
  );
};

export const Highlights = () => (
  <>
    <Ticker className={SPAN.full} />
    <Specimen name="Navigation, the product" span="wide" note="The buyer app's sidebar, at the side of its page: pick a page and the page follows, open a group, or fold it down to its rail." className={CANVAS} panelClassName="block">
      <AppFrame />
    </Specimen>
    <Specimen name="Project card" span="narrow" note="Manoa as the marketplace lists it: its map, its facts and the evaluation it passed." className={cn(BOARD, "self-stretch")} panelClassName="justify-center">
      <ProjectCard />
    </Specimen>
    <ProjectsByYear className={cn(BENTO_CARD, SPAN.wide)} />
    <PortfolioCard className={cn(BENTO_CARD, SPAN.narrow, "self-stretch")} />
    <Specimen name="Checkbox, radio and switch" span="half" note="Native controls underneath; here they flip themselves, one after another, until you reach for them." panelClassName="block">
      <Running step={nextInput} every={1400}>
        <Choices />
      </Running>
    </Specimen>
    <Specimen name="Tabs and stepper" span="half" note="The tabs move along on their own, and a project walks its lifecycle; arrow keys work as soon as you're in." className={CANVAS} panelClassName="flex-col items-stretch gap-10">
      <Running step={nextTab} every={2600}>
        <Tabs label={`${KALIMANTAN.name}, project`} items={PROJECT_TABS} />
      </Running>
      <Lifecycle />
    </Specimen>
    <Specimen name="Typography" span="half" note="Chromatic Pro Condensed and Matter, from h1 down, trying each weight in turn." className="lg:col-span-7" panelClassName="block">
      <Running step={nextType} every={2000}>
        <TypeScale />
      </Running>
    </Specimen>
    <Specimen name="Brand colours" span="half" note="Eight ramps from lightest to darkest, each with its Banyan name." className="lg:col-span-5" panelClassName="block">
      <BrandRamps />
    </Specimen>
    <Specimen name="Table" span="wide" note="Search, filter by status, sort by any column, pick rows and page through. Credit balances on the two real projects; the numbers are samples." className={CANVAS} panelClassName="block">
      <DataTable />
    </Specimen>
    <Specimen name="Progress, spinner and alert" span="narrow" note="An evaluation running over and over, a spinner, and the state of a submission." panelClassName="flex-col items-stretch gap-8">
      <Running step={runProgress} every={5200}>
        <ProgressDemo />
      </Running>
      <div className="flex items-center gap-6">
        <Spinner size="sm" label="Loading, small" />
        <Spinner label="Loading" />
        <Spinner size="lg" label="Loading, large" />
      </div>
      <Alert tone="success" title="Your project passed screening">
        Diligence starts next. We&rsquo;ll write when the report is ready.
      </Alert>
    </Specimen>
  </>
);
