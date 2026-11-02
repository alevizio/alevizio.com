"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { Taken } from "../_chapters/page-anatomy";
import { Anatomy, number } from "./anatomy";
import { cn } from "./cn";

/* The page's seven sections in one place: a tab for each, in the page's
 * order, and under them the one picked, taken apart. Only the picked one is
 * mounted, so its sheet and pieces come in again each time it's picked. The
 * arrow keys, Home and End move along the tabs; on a phone the row of tabs
 * moves sideways. */
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint";

export const SectionTabs = ({ sections, className }: { sections: Taken[]; className?: string }) => {
  const [on, setOn] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();
  const { id, title, text, sheet, alt, height, marks, pieces } = sections[on];

  const keys = (e: KeyboardEvent) => {
    const last = sections.length - 1;
    const next = { ArrowRight: on === last ? 0 : on + 1, ArrowLeft: on === 0 ? last : on - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setOn(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className={className}>
      <div className="no-scrollbar -mx-6 overflow-x-auto px-6 py-1 sm:mx-0 sm:px-0">
        <div role="tablist" aria-label="The page’s sections" onKeyDown={keys} className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          {sections.map((section, i) => (
            <button
              key={section.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-${section.id}`}
              aria-selected={i === on}
              aria-controls={`${base}-panel`}
              tabIndex={i === on ? 0 : -1}
              onClick={() => setOn(i)}
              className={cn(
                "type-label inline-flex min-h-10 items-center gap-2 rounded-full border px-4 whitespace-nowrap transition-colors",
                i === on ? "border-mint bg-mint text-night" : "border-(--tone-line) text-(--tone-text) hover:text-(--tone-head)",
                FOCUS,
              )}
            >
              <span className="opacity-60">{number(i + 1)}</span>
              {section.eyebrow}
            </button>
          ))}
        </div>
      </div>
      <div key={id} role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-${id}`} className="mt-8 sm:mt-10">
        <h4 data-reveal className="type-body text-(--tone-head)">
          {title}
        </h4>
        <p data-reveal className="type-caption mt-2 max-w-[40rem] text-(--tone-text) [--reveal-delay:0.08s]">
          {text}
        </p>
        <Anatomy id={id} sheet={sheet} alt={alt} height={height} marks={marks} pieces={pieces} className="mt-8 sm:mt-10" />
      </div>
    </div>
  );
};
