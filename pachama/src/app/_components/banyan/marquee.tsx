"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { cn } from "../cn";
import { useBeat } from "./autoplay";
import { DataTable } from "./data-display/table/table";
import { Alert } from "./feedback/alert";
import { BannerDemo, ProgressDemo } from "./feedback/demos";
import { BrandRamps, Gradients } from "./foundations/colours";
import { TypeScale } from "./foundations/type-scale";
import { CalendarExample } from "./forms/datepicker";
import { Choices, Inputs, Selects } from "./forms/demos";
import { IconGrid } from "./media/icons";
import { AccordionItem, Dropdown } from "./patterns/accordion";
import { Breadcrumb } from "./patterns/breadcrumb";
import { KALIMANTAN, LIFECYCLE } from "./patterns/content";
import { PortfolioCard, ProjectsByYear } from "./patterns/graphs";
import { HighlightsCard } from "./patterns/highlights-card";
import { ProjectCard } from "./patterns/project-card";
import { StepperRow } from "./patterns/stepper";
import { SubmissionCard } from "./patterns/submission-card";
import { PROJECT_TABS, Tabs } from "./patterns/tabs";
import { Ticker } from "./ticker";

/* The library on one belt: a selection of Banyan's components, cards,
 * graphs, controls, type, colours, tables and icons, packed in columns
 * like a masonry wall (each column about as tall as the next, so there's
 * no gap to speak of) and passing slowly, so the variety shows without a
 * long page. No boxes behind them: just the components, on the ground.
 * Each one that does something shows it off on its own: the choices tick
 * and flip, the tabs and the lifecycle move on, the evaluation runs, the
 * calendar picks days, the accordion swaps, the inputs type (see useBeat:
 * both copies keep time together). Under it, the small parts on their own
 * belts. The belt stops while it's pointed at or focused, and the first
 * copy of each piece works (the copy that closes the loop is only a
 * picture of it). With less motion it stands still and scrolls. */
type Column = { name: string; width: string; pieces: ReactNode[] };

const CRUMBS = [{ label: "Projects", href: "#components" }, { label: "Brazil", href: "#components" }, { label: "Agrocortex" }];
const LIFECYCLE_MS = 1600;
const ACCORDION_MS = 2600;

/** The lifecycle, a step a beat, to every step done and round again. */
const Lifecycle = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);
  const beat = useCallback((n: number) => setCurrent(n % (LIFECYCLE.length + 1)), []);
  useBeat(ref, LIFECYCLE_MS, beat);
  return (
    <div ref={ref}>
      <StepperRow steps={LIFECYCLE} current={current} label="Project lifecycle" className="flex-wrap gap-y-3" />
    </div>
  );
};

/** Two cards, one open at a time, swapping each beat. */
const Filters = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(0);
  const beat = useCallback((n: number) => setOpen(n % 2), []);
  useBeat(ref, ACCORDION_MS, beat);
  const toggle = (i: number) => () => setOpen((o) => (o === i ? -1 : i));
  return (
    <div ref={ref} className="grid gap-4">
      <Breadcrumb items={CRUMBS} />
      <AccordionItem title="Location" open={open === 0} onToggle={toggle(0)}>
        <Dropdown label="Country" options={["Brazil", "Peru", "Colombia", "Mexico"]} />
      </AccordionItem>
      <AccordionItem title="Project" open={open === 1} onToggle={toggle(1)}>
        <Dropdown label="Project type" options={["REDD+", "ARR", "IFM"]} />
      </AccordionItem>
    </div>
  );
};

const COLUMNS: Column[] = [
  { name: "Project card and gradients", width: "w-[20.5rem]", pieces: [<ProjectCard key="p" className="[zoom:0.8]" />, <Gradients key="g" />] },
  {
    name: "Graph, choices, tabs and stepper",
    width: "w-[32rem]",
    pieces: [
      <ProjectsByYear key="y" />,
      <Choices key="c" />,
      <div key="t" className="grid gap-6">
        <Tabs label={`${KALIMANTAN.name}, project`} items={PROJECT_TABS} demo />
        <Lifecycle />
      </div>,
    ],
  },
  { name: "Highlights and submission cards", width: "w-[19rem]", pieces: [<HighlightsCard key="h" className="[zoom:0.8]" />, <SubmissionCard key="s" className="[zoom:0.8]" />] },
  { name: "Table and inputs", width: "w-[42.5rem]", pieces: [<DataTable key="d" className="[zoom:0.8]" />, <Inputs key="i" />] },
  {
    name: "Alerts, progress, breadcrumb and accordion",
    width: "w-[24.5rem]",
    pieces: [
      <div key="a" className="grid gap-5">
        <Alert tone="success" title="Your project passed screening">
          Diligence starts next. We&rsquo;ll write when the report is ready.
        </Alert>
        <Alert tone="warning" title="The boundary overlaps a protected area">
          Check the shape against the map before you submit.
        </Alert>
        <ProgressDemo />
      </div>,
      <Filters key="b" />,
    ],
  },
  {
    name: "Typography and colours",
    width: "w-[31rem]",
    pieces: [
      <div key="t" className="[zoom:0.55]">
        <TypeScale />
      </div>,
      <div key="b" className="[zoom:0.85]">
        <BrandRamps />
      </div>,
    ],
  },
  {
    name: "Calendar, portfolio and selects",
    width: "w-[22.5rem]",
    pieces: [
      <div key="c" className="[zoom:0.9]">
        <CalendarExample />
      </div>,
      <PortfolioCard key="p" />,
      <Selects key="s" />,
    ],
  },
  { name: "Icons and banners", width: "w-[31rem]", pieces: [<IconGrid key="i" className="[zoom:0.75]" />, <BannerDemo key="b" />] },
];

const Copy = ({ inert = false }: { inert?: boolean }) => (
  <ul aria-hidden={inert || undefined} inert={inert} className="flex shrink-0 items-start gap-10 pr-10">
    {COLUMNS.map((column) => (
      <li key={column.name} className={cn("grid shrink-0 content-start gap-8", column.width)}>
        {column.pieces}
      </li>
    ))}
  </ul>
);

export const ComponentMarquee = ({ className }: { className?: string }) => (
  <div className={cn("grid gap-10 sm:gap-12", className)}>
    <div role="region" aria-label="Banyan's components, working" className="group/marquee no-scrollbar overflow-hidden motion-reduce:overflow-x-auto">
      <div className="flex w-max motion-safe:animate-[belt_200s_linear_infinite] group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused]">
        <Copy />
        <Copy inert />
      </div>
    </div>
    <Ticker />
  </div>
);
