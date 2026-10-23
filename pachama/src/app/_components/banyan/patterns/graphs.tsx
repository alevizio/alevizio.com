"use client";

import { useState, type ReactNode } from "react";
import { cn } from "../../cn";
import { BN } from "../ui";

/* Banyan's graphs (WIP in the Figma): a white card, a bold title and a line
 * on what it counts, then bars by year (past in grey, this year in lidar
 * green, what's ahead in the darkest grey) or a stacked bar per breakdown
 * with its legend. Point at a bar, or a legend entry, to read it. The
 * values are illustrative. */
const GraphCard = ({ title, subtitle, children, className }: { title: string; subtitle: string; children: ReactNode; className?: string }) => (
  <figure data-reveal className={cn("w-full rounded-[16px] border border-bn-grey-light bg-white p-6", className)}>
    <figcaption>
      <span className="block text-[18px] leading-6 font-bold text-bn-heavy">{title}</span>
      <span className="mt-1 block text-[12px] leading-4 text-bn-medium">{subtitle}</span>
    </figcaption>
    {children}
  </figure>
);

const FIRST = 2017;
const NOW = 2024;
const PER_YEAR = [10, 14, 20, 20, 26, 26, 30, 32, 35, 42, 52, 47, 42, 47, 42, 42, 42, 38, 34, 30];
const W = 460;
const H = 120;
const STEP = W / PER_YEAR.length;
const y = (v: number) => H - (v / 55) * H;

export const ProjectsByYear = ({ className }: { className?: string }) => {
  const [at, setAt] = useState<number | null>(null);
  const read = at === null ? `Today, ${NOW}: ${PER_YEAR[NOW - FIRST]} projects` : `${FIRST + at}: ${PER_YEAR[at]} projects`;
  return (
    <GraphCard title="Projects" subtitle="Projects distributed over the years. Illustrative values" className={className}>
      <p aria-hidden className="mt-3 h-4 text-right font-mono text-[12px] text-bn-medium">
        {read}
      </p>
      <svg viewBox={`0 0 ${W} ${H + 18}`} aria-hidden className="mt-1 w-full overflow-visible" onMouseLeave={() => setAt(null)}>
        {[20, 30, 40, 50].map((v) => (
          <g key={v}>
            <line x1={0} x2={W} y1={y(v)} y2={y(v)} className="stroke-bn-grey-light" />
            <text x={0} y={y(v) - 3} className="fill-bn-glass-3 text-[9px]">
              {v}
            </text>
          </g>
        ))}
        <g data-reveal="grow-y">
          {PER_YEAR.map((v, i) => {
            const year = FIRST + i;
            return (
              <rect
                key={year}
                x={i * STEP + 3}
                y={y(v)}
                width={STEP - 6}
                height={H - y(v)}
                rx={2}
                onMouseEnter={() => setAt(i)}
                className={cn(year < NOW ? "fill-bn-grey-light" : year === NOW ? "fill-bn-green" : "fill-bn-grey-darkest", at !== null && at !== i && "opacity-60")}
              />
            );
          })}
        </g>
        <text x={0} y={H + 14} className="fill-bn-medium text-[10px]">
          {FIRST}
        </text>
        <text x={(NOW - FIRST) * STEP + STEP / 2} y={H + 14} textAnchor="middle" className="fill-bn-heavy text-[10px]">
          Today
        </text>
        <text x={W} y={H + 14} textAnchor="end" className="fill-bn-medium text-[10px]">
          {FIRST + PER_YEAR.length - 1}
        </text>
      </svg>
      <table className="sr-only">
        <caption>Projects by year, illustrative</caption>
        <tbody>
          {PER_YEAR.map((v, i) => (
            <tr key={i}>
              <th scope="row">{FIRST + i}</th>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </GraphCard>
  );
};

// Widths as literal classes: Tailwind only builds what it can read.
type Segment = { label: string; share: number; grow: string; fill: string };

const StackedBar = ({ label, segments }: { label: string; segments: Segment[] }) => {
  const [hot, setHot] = useState<string | null>(null);
  return (
    <div className="mt-4">
      <p className="text-[12px] leading-4 text-bn-medium">{label}</p>
      <div aria-hidden data-reveal="grow-x" className="mt-2 flex h-6 gap-px overflow-hidden rounded-[6px]">
        {segments.map((s) => (
          <span key={s.label} onMouseEnter={() => setHot(s.label)} onMouseLeave={() => setHot(null)} className={cn("transition-opacity", s.grow, s.fill, hot && hot !== s.label && "opacity-40")} />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {segments.map((s) => (
          <li key={s.label}>
            <button
              type="button"
              onMouseEnter={() => setHot(s.label)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot(s.label)}
              onBlur={() => setHot(null)}
              className={cn("flex items-center gap-1.5 rounded-[4px] text-[12px] leading-5 text-bn-heavy", BN.focus)}
            >
              <span aria-hidden className={cn("size-2 rounded-full", s.fill)} />
              {s.label}, {s.share}%
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const PortfolioCard = ({ className }: { className?: string }) => (
  <GraphCard title="Project types and methodologies" subtitle="A portfolio's distribution. Illustrative values" className={className}>
    <StackedBar
      label="By project type"
      segments={[
        { label: "ARR", share: 30, grow: "grow-[30]", fill: "bg-bn-indigo-darkest" },
        { label: "Agricultural land management", share: 20, grow: "grow-[20]", fill: "bg-bn-indigo-dark" },
        { label: "IFM", share: 10, grow: "grow-[10]", fill: "bg-bn-indigo" },
        { label: "REDD+", share: 25, grow: "grow-[25]", fill: "bg-bn-indigo-light" },
        { label: "Wetlands", share: 15, grow: "grow-[15]", fill: "bg-bn-indigo-lightest" },
      ]}
    />
    <StackedBar
      label="By methodology"
      segments={[
        { label: "VM0010", share: 10, grow: "grow-[10]", fill: "bg-bn-yellow-darkest" },
        { label: "VM0047", share: 45, grow: "grow-[45]", fill: "bg-bn-yellow-dark" },
        { label: "VM0042", share: 15, grow: "grow-[15]", fill: "bg-bn-yellow-light" },
        { label: "VM0007", share: 30, grow: "grow-[30]", fill: "bg-bn-yellow-lightest" },
      ]}
    />
  </GraphCard>
);

export const RegionsCard = ({ className }: { className?: string }) => (
  <GraphCard title="Regions" subtitle="Where a portfolio's projects are. Illustrative values" className={className}>
    <StackedBar
      label="By country"
      segments={[
        // The doc's darkest green, sampled: Banyan has no token for it.
        { label: "United States", share: 4, grow: "grow-[4]", fill: "bg-[#378842]" },
        { label: "Mexico", share: 6, grow: "grow-[6]", fill: "bg-bn-green-dark" },
        { label: "Brazil", share: 68, grow: "grow-[68]", fill: "bg-bn-green" },
        { label: "Argentina", share: 22, grow: "grow-[22]", fill: "bg-bn-green-light" },
      ]}
    />
  </GraphCard>
);
