"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../../cn";
import { BN } from "../ui";

/* Banyan's tabs: 40px tall, Matter 16, a 2px heavy line under the
 * selected one on a 2px grey rule; mint on hover (as the docs show it),
 * grey text when disabled; an optional status dot or count badge. The
 * full pattern: arrows, Home and End, disabled tabs skipped. */
type TabItem = { label: string; panel: ReactNode; disabled?: boolean; status?: boolean; count?: number };

export const Tabs = ({ items, label, initial = 0, className }: { items: TabItem[]; label: string; initial?: number; className?: string }) => {
  const [selected, setSelected] = useState(initial);
  const ids = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = items.flatMap((t, i) => (t.disabled ? [] : [i]));

  const onKey = (e: KeyboardEvent) => {
    const at = enabled.indexOf(selected);
    const to =
      e.key === "ArrowRight" ? enabled[(at + 1) % enabled.length]
      : e.key === "ArrowLeft" ? enabled[(at - 1 + enabled.length) % enabled.length]
      : e.key === "Home" ? enabled[0]
      : e.key === "End" ? enabled[enabled.length - 1]
      : undefined;
    if (to === undefined) return;
    e.preventDefault();
    setSelected(to);
    refs.current[to]?.focus();
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} onKeyDown={onKey} className="flex overflow-x-auto border-b-2 border-bn-line">
        {items.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`${ids}t${i}`}
            type="button"
            role="tab"
            aria-selected={selected === i}
            aria-controls={`${ids}p${i}`}
            aria-disabled={t.disabled || undefined}
            tabIndex={selected === i ? 0 : -1}
            onClick={() => !t.disabled && setSelected(i)}
            className={cn(
              "-mb-0.5 flex h-10 shrink-0 items-center gap-2 border-b-2 px-4 py-2 text-[16px] leading-6 whitespace-nowrap",
              BN.focus,
              "focus-visible:outline-offset-[-2px]",
              t.disabled ? "cursor-not-allowed border-transparent text-bn-light" : "text-bn-heavy hover:bg-bn-green-lightest",
              selected === i ? "border-bn-heavy" : "border-transparent",
            )}
          >
            {t.status ? <span aria-hidden className="size-2 rounded-full bg-bn-green-dark" /> : null}
            {t.label}
            {t.status ? <span className="sr-only">, updated</span> : null}
            {t.count !== undefined ? <span className="rounded-full bg-bn-heavy px-2 py-0.5 text-[12px] leading-4 font-bold text-bn-eggshell">{t.count}</span> : null}
          </button>
        ))}
      </div>
      {items.map((t, i) => (
        <div key={t.label} id={`${ids}p${i}`} role="tabpanel" aria-labelledby={`${ids}t${i}`} hidden={selected !== i} tabIndex={0} className={cn("pt-6", BN.focus)}>
          {t.panel}
        </div>
      ))}
    </div>
  );
};
