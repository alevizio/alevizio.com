"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { MdArrowDropDown, MdArrowLeft, MdArrowRight } from "react-icons/md";
import { cn } from "../../cn";
import { GLASS } from "../overlay/glass";

/* Banyan's calendar, as the WAI-ARIA date grid: the arrows move a day or a
 * week, Page Up and Page Down a month (with Shift, a year), Home and End to
 * the week's ends, Enter or Space picks. Month and year are pill selects;
 * today wears a ring, the pick goes lidar green. */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = [["Su", "Sunday"], ["Mo", "Monday"], ["Tu", "Tuesday"], ["We", "Wednesday"], ["Th", "Thursday"], ["Fr", "Friday"], ["Sa", "Saturday"]];
const YEARS = Array.from({ length: 21 }, (_, i) => 2015 + i);

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), last));
};
const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && a.toDateString() === b.toDateString();
const longDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

// Six weeks from the Sunday on or before the 1st, as the Figma draws it.
const weeksOf = (y: number, m: number) => {
  const first = new Date(y, m, 1);
  const start = addDays(first, -first.getDay());
  return Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)));
};

const MOVES: Record<string, (d: Date, shift: boolean) => Date> = {
  ArrowLeft: (d) => addDays(d, -1),
  ArrowRight: (d) => addDays(d, 1),
  ArrowUp: (d) => addDays(d, -7),
  ArrowDown: (d) => addDays(d, 7),
  Home: (d) => addDays(d, -d.getDay()),
  End: (d) => addDays(d, 6 - d.getDay()),
  PageUp: (d, shift) => addMonths(d, shift ? -12 : -1),
  PageDown: (d, shift) => addMonths(d, shift ? 12 : 1),
};

const RING = "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-bn-heavy";

const PillSelect = ({ label, value, options, onChange }: { label: string; value: number; options: [number, string][]; onChange: (v: number) => void }) => (
  <label className="relative">
    <span className="sr-only">{label}</span>
    <select value={value} onChange={(e) => onChange(Number(e.target.value))} className={cn("appearance-none rounded-full bg-bn-glass-2/70 py-1 pr-7 pl-3 text-[13px] text-bn-heavy outline-none", RING)}>
      {options.map(([v, name]) => (
        <option key={v} value={v}>
          {name}
        </option>
      ))}
    </select>
    <MdArrowDropDown aria-hidden className="pointer-events-none absolute top-1/2 right-1.5 size-4 -translate-y-1/2 text-bn-heavy" />
  </label>
);

export const Calendar = ({
  value,
  onChange,
  today,
  start,
  autoFocus = false,
  className,
}: {
  value: Date | null;
  onChange: (d: Date) => void;
  /** Null until the client knows it. */
  today: Date | null;
  /** The day the grid opens on. */
  start: Date;
  autoFocus?: boolean;
  className?: string;
}) => {
  const [focus, setFocus] = useState(start);
  // Focus follows the roving day only once someone moves it from the grid.
  const follow = useRef(autoFocus);
  const grid = useRef<HTMLTableElement>(null);
  useEffect(() => {
    if (follow.current) grid.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus();
  }, [focus]);

  const y = focus.getFullYear();
  const m = focus.getMonth();
  const go = (d: Date, fromGrid: boolean) => {
    follow.current = fromGrid;
    setFocus(d);
  };
  const onKey = (e: KeyboardEvent) => {
    const move = MOVES[e.key];
    if (!move) return;
    e.preventDefault();
    go(move(focus, e.shiftKey), true);
  };

  return (
    <div className={cn("w-[292px] rounded-[12px] p-3 shadow-[0_8px_24px_rgb(14_37_23/0.08)]", GLASS, className)}>
      <div className="flex items-center gap-2 border-b border-bn-grey-light pb-3">
        <PillSelect label="Month" value={m} options={MONTHS.map((n, i) => [i, n])} onChange={(v) => go(new Date(y, v, 1), false)} />
        <PillSelect label="Year" value={y} options={YEARS.map((v) => [v, String(v)])} onChange={(v) => go(new Date(v, m, 1), false)} />
        <span className="ml-auto flex">
          <button type="button" aria-label="Previous month" onClick={() => go(addMonths(focus, -1), false)} className={cn("grid size-7 place-items-center rounded-full hover:bg-bn-glass-3/30", RING)}>
            <MdArrowLeft aria-hidden className="size-5" />
          </button>
          <button type="button" aria-label="Next month" onClick={() => go(addMonths(focus, 1), false)} className={cn("grid size-7 place-items-center rounded-full hover:bg-bn-glass-3/30", RING)}>
            <MdArrowRight aria-hidden className="size-5" />
          </button>
        </span>
      </div>
      <table ref={grid} role="grid" aria-label={`${MONTHS[m]} ${y}`} onKeyDown={onKey} className="mt-1 w-full border-separate border-spacing-y-1 text-center text-[13px] text-bn-heavy">
        <thead>
          <tr>
            {WEEKDAYS.map(([short, long]) => (
              <th key={short} scope="col" className="h-8 font-normal text-bn-medium">
                <abbr title={long} className="no-underline">
                  {short}
                </abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeksOf(y, m).map((week) => (
            <tr key={week[0].toDateString()}>
              {week.map((d) => {
                const picked = sameDay(d, value);
                const isToday = sameDay(d, today);
                return (
                  <td key={d.toDateString()} role="gridcell" aria-selected={picked}>
                    <button
                      type="button"
                      tabIndex={sameDay(d, focus) ? 0 : -1}
                      aria-label={longDate(d)}
                      aria-current={isToday ? "date" : undefined}
                      onClick={() => {
                        go(d, true);
                        onChange(d);
                      }}
                      className={cn(
                        "mx-auto grid size-8 place-items-center rounded-[8px] transition-colors",
                        RING,
                        picked ? "bg-bn-green" : "hover:bg-bn-glass-3/30",
                        isToday && !picked && "rounded-full ring-1 ring-bn-heavy",
                        d.getMonth() !== m && !picked && "text-bn-glass-4",
                      )}
                    >
                      {d.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
