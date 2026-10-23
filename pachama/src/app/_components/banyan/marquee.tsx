"use client";

import type { ReactNode } from "react";
import { cn } from "../cn";
import { DataTable } from "./data-display/table/table";
import { Alert } from "./feedback/alert";
import { ProgressDemo } from "./feedback/demos";
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

/* The library on belts: a selection of Banyan's components, cards, graphs,
 * controls, type, colours, tables and icons, passing slowly the two ways so
 * the variety shows without a long page; under them the small parts on
 * their own belts. A belt stops while it's pointed at or focused, and the
 * first copy of each piece works (the copy that closes the loop is only a
 * picture of it). With less motion the belts stand still and scroll. */
type Piece = { name: string; node: ReactNode; width: string };

// For the components that are cards themselves: a warm tint a step down
// from the eggshell ground.
const CARD = "min-w-0 rounded-[24px] border border-[#e6e0cc] bg-[#f5f2e6] p-6 [--bn-surface:#f5f2e6] sm:p-8";
const Frame = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("rounded-[24px] bg-[#f5f2e6] p-5 ring-1 ring-[#e6e0cc] sm:p-7", className)}>{children}</div>
);

const CRUMBS = [{ label: "Projects", href: "#components" }, { label: "Brazil", href: "#components" }, { label: "Agrocortex" }];

const FIRST: Piece[] = [
  { name: "Project card", width: "w-[19rem]", node: <ProjectCard className="[zoom:0.8]" /> },
  { name: "Projects by year", width: "w-[36rem]", node: <ProjectsByYear className={CARD} /> },
  { name: "Checkbox, radio and switch", width: "w-[38rem]", node: <Frame><Choices /></Frame> },
  {
    name: "Tabs and stepper",
    width: "w-[34rem]",
    node: (
      <Frame className="grid gap-8">
        <Tabs label={`${KALIMANTAN.name}, project`} items={PROJECT_TABS} />
        <StepperRow steps={LIFECYCLE} current={1} label="Project lifecycle" className="flex-wrap gap-y-3" />
      </Frame>
    ),
  },
  { name: "Highlights card", width: "w-[19rem]", node: <HighlightsCard className="[zoom:0.8]" /> },
  { name: "Brand colours", width: "w-[34rem]", node: <Frame className="[zoom:0.85]"><BrandRamps /></Frame> },
  { name: "Portfolio card", width: "w-[24rem]", node: <PortfolioCard className={CARD} /> },
  {
    name: "Alerts and progress",
    width: "w-[26rem]",
    node: (
      <Frame className="grid gap-6">
        <Alert tone="success" title="Your project passed screening">
          Diligence starts next. We&rsquo;ll write when the report is ready.
        </Alert>
        <Alert tone="warning" title="The boundary overlaps a protected area">
          Check the shape against the map before you submit.
        </Alert>
        <ProgressDemo />
      </Frame>
    ),
  },
  { name: "Calendar", width: "w-[22rem]", node: <Frame><CalendarExample /></Frame> },
  { name: "Submission card", width: "w-[19rem]", node: <SubmissionCard className="[zoom:0.8]" /> },
];

const SECOND: Piece[] = [
  { name: "Typography", width: "w-[40rem]", node: <Frame className="[zoom:0.7]"><TypeScale /></Frame> },
  { name: "Input", width: "w-[38rem]", node: <Frame><Inputs /></Frame> },
  { name: "Table", width: "w-[46rem]", node: <Frame className="[zoom:0.8]"><DataTable /></Frame> },
  {
    name: "Accordion and breadcrumb",
    width: "w-[28rem]",
    node: (
      <Frame className="grid gap-5">
        <Breadcrumb items={CRUMBS} />
        <AccordionItem title="Location" initiallyOpen>
          <Dropdown label="Country" options={["Brazil", "Peru", "Colombia", "Mexico"]} />
        </AccordionItem>
        <AccordionItem title="Project">
          <Dropdown label="Project type" options={["REDD+", "ARR", "IFM"]} />
        </AccordionItem>
      </Frame>
    ),
  },
  { name: "Icons", width: "w-[34rem]", node: <Frame className="[zoom:0.85]"><IconGrid /></Frame> },
  { name: "Gradients", width: "w-[24rem]", node: <Frame><Gradients /></Frame> },
  { name: "Select and autocomplete", width: "w-[26rem]", node: <Frame><Selects /></Frame> },
];

const Copy = ({ pieces, inert = false }: { pieces: Piece[]; inert?: boolean }) => (
  <ul aria-hidden={inert || undefined} inert={inert} className="flex shrink-0 items-center gap-6 pr-6">
    {pieces.map((p) => (
      <li key={p.name} className={cn("shrink-0", p.width)}>
        {p.node}
      </li>
    ))}
  </ul>
);

const Belt = ({ pieces, label, reverse = false }: { pieces: Piece[]; label: string; reverse?: boolean }) => (
  <div role="region" aria-label={label} className="group/marquee overflow-hidden motion-reduce:overflow-x-auto">
    <div
      className={cn(
        "flex w-max motion-safe:animate-[belt_160s_linear_infinite] group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused]",
        reverse && "[animation-direction:reverse]",
      )}
    >
      <Copy pieces={pieces} />
      <Copy pieces={pieces} inert />
    </div>
  </div>
);

export const ComponentMarquee = ({ className }: { className?: string }) => (
  <div className={cn("grid gap-8 sm:gap-10", className)}>
    <Belt pieces={FIRST} label="Banyan's cards, graphs and controls, working" />
    <Belt pieces={SECOND} label="Banyan's type, inputs, table, icons and colours, working" reverse />
    <Ticker />
  </div>
);
