import { useState } from "react";
import data from "./github-contributions.json";

// The GitHub contribution calendar (github.com/alevizio), drawn in the
// site's ink instead of GitHub's greens: a column per week, Sunday on top,
// each day one of GitHub's five levels. Hovering a day darkens and lifts it,
// and the label above reads that day's count instead of the year's total.
// The data is a snapshot (github-contributions.json) from GitHub's public
// calendar page, github.com/users/alevizio/contributions.

const LEVEL_INK = ["bg-[#1E1E1E]/[0.07]", "bg-[#1E1E1E]/25", "bg-[#1E1E1E]/50", "bg-[#1E1E1E]/75", "bg-[#1E1E1E]"];
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

const DAY_MS = 86_400_000;
const start = Date.parse(`${data.start}T00:00:00Z`);
const days = [...data.levels].map((level, i) => ({
  level: Number(level),
  count: data.counts[i],
  date: new Date(start + i * DAY_MS),
}));
// A month's label sits over the week its first day falls in.
const monthLabels = Array.from({ length: Math.ceil(days.length / 7) }, (_, w) => {
  const first = days.slice(w * 7, w * 7 + 7).find((d) => d.date.getUTCDate() === 1);
  return first ? MONTHS[first.date.getUTCMonth()] : "";
});

const TOTAL = `${data.total.toLocaleString("en-US")} contributions in the last year`;
const dayLabel = ({ count, date }: (typeof days)[number]) =>
  `${count === 0 ? "no" : count.toLocaleString("en-US")} contribution${count === 1 ? "" : "s"} on ${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;

export const GithubContributions = ({ className = "" }: { className?: string }) => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <a
      href="https://github.com/alevizio"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${TOTAL} on GitHub`}
      className={`group block text-[#1E1E1E] ${className}`}
    >
      <p className="text-[clamp(11px,1vw,13px)] tracking-[0.05em] text-[#1E1E1E]/70 [font-variation-settings:'wdth'_100] group-hover:text-[#1E1E1E]">
        {active === null ? TOTAL : dayLabel(days[active])}
      </p>
      <div aria-hidden="true" className="mt-4">
        <div className="grid grid-flow-col auto-cols-fr gap-[clamp(1.5px,0.25vw,3px)] text-[10px] leading-none text-[#1E1E1E]/70">
          {monthLabels.map((m, w) => (
            <span key={w} className="h-4 whitespace-nowrap">{m}</span>
          ))}
        </div>
        <div
          className="grid grid-flow-col grid-rows-7 auto-cols-fr gap-[clamp(1.5px,0.25vw,3px)]"
          onMouseLeave={() => setActive(null)}
        >
          {days.map((d, i) => (
            <span
              key={d.date.getTime()}
              onMouseEnter={() => setActive(i)}
              className={`relative aspect-square ${LEVEL_INK[d.level]} hover:z-10 hover:bg-[#1E1E1E] motion-safe:transition-transform motion-safe:duration-150 motion-safe:hover:scale-[1.8]`}
            />
          ))}
        </div>
      </div>
    </a>
  );
};
