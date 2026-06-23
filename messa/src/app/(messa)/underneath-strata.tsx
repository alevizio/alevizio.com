import type { ReactNode } from "react";
import { cn } from "./cn";
import { AnimatedStat } from "./animated-stat";

/**
 * Chapter 5 as a core sample (client direction 2026-06-18). The borehole
 * layout — number + depth gutter, full-bleed dashed survey lines, a vertical
 * axis — but each stratum carries the chapter's real content in its body:
 * stat grids, the accent-bug demo, the timelapse, the commit iceberg. The
 * light-built bodies re-theme for the soil via the `.story-underneath` scope
 * (see story.css). Sand numbers + cream titles on the chapter's brown.
 */
const SAND = "#CFB58B"; // numbers + ticks
const DASH = "rgba(245,236,222,0.28)"; // survey lines + borehole axis

/** One stratum: number + depth gutter | title + a rich body. */
export const StratumBlock = ({
  n,
  depth,
  title,
  children,
}: {
  n: string;
  depth: string;
  title: string;
  children: ReactNode;
}) => (
  <div className="relative">
    {/* full-bleed dashed survey line marking the top of the stratum */}
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 border-t border-dashed"
      style={{ borderColor: DASH, left: "calc(50% - 50vw)", width: "100vw" }}
    />
    <div className="grid grid-cols-[60px_1fr] pt-9 pb-12 md:grid-cols-[88px_1fr] md:pt-12 md:pb-16">
      {/* gutter: index + depth marker */}
      <div className="pr-4 text-right tabular-nums">
        <div
          className="story-serif text-2xl leading-snug md:text-3xl"
          style={{ color: SAND }}
        >
          {n}
        </div>
        <div className="mt-1 text-[10px] text-[#FBF0E6]/45">{depth}</div>
      </div>
      {/* title + rich body */}
      <div className="min-w-0 pl-3 md:pl-4">
        <h3 className="story-serif text-2xl leading-snug text-[#FBF0E6] md:text-3xl">
          {title}
        </h3>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  </div>
);

/** The drill: a caption, a vertical borehole axis, and the strata inside. */
export const Borehole = ({ children }: { children: ReactNode }) => (
  <div className="relative z-10 mx-auto mt-6 max-w-5xl px-4 md:px-8">
    <div className="mb-1.5 flex items-center justify-between pr-1 pl-[72px] text-[10px] font-medium uppercase tracking-[0.18em] text-[#FBF0E6]/55 md:pl-[104px]">
      <span>The build, in cross-section</span>
      <span aria-hidden>deeper ↓</span>
    </div>
    <div className="relative">
      {/* vertical dashed borehole axis, aligned to the gutter edge */}
      <div
        aria-hidden
        className="absolute top-0 bottom-0 left-[60px] border-l border-dashed md:left-[88px]"
        style={{
          borderColor: DASH,
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 6%, #000 93%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 6%, #000 93%, transparent 100%)",
        }}
      />
      {children}
    </div>
  </div>
);

/** A stat grid in the core-sample style: transparent cells (the soil reads
 * through), dashed survey-line borders inside and out, cream values. The one
 * grid treatment shared by every box underneath. */
export const SurveyGrid = ({
  items,
  columns,
  valueClassName,
  labelClassName,
  className,
}: {
  items: readonly { value: string; label: string }[];
  columns: string;
  valueClassName?: string;
  labelClassName?: string;
  className?: string;
}) => (
  <dl
    className={cn("grid border-t border-l border-dashed", columns, className)}
    style={{ borderColor: DASH }}
  >
    {items.map((it) => (
      <div
        key={it.label}
        className="flex flex-col border-r border-b border-dashed p-4 sm:p-6"
        style={{ borderColor: DASH }}
      >
        {/* The number — animated count-up, one size across every data point.
            Scales up with room; stays small enough on phones that the longest
            values (e.g. "2.9MB → 45KB") never clip. */}
        <dt
          className={cn(
            "whitespace-nowrap leading-none tracking-tight text-[#FBF0E6]",
            valueClassName ?? "story-serif text-xl sm:text-2xl md:text-3xl",
          )}
        >
          <AnimatedStat value={it.value} />
        </dt>
        {/* The label — reserves two lines so every cell aligns. */}
        <dd
          className={cn(
            "mt-2.5 flex min-h-[2.5rem] items-start leading-5 text-[#FBF0E6]/70",
            labelClassName ?? "font-mono text-[11px] sm:text-xs",
          )}
        >
          {it.label}
        </dd>
      </div>
    ))}
  </dl>
);
