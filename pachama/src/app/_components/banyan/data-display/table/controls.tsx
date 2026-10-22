"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MdArrowDropDown, MdArrowDropUp, MdClose, MdHighlightOff, MdSearch } from "react-icons/md";
import { cn } from "../../../cn";
import { BN } from "../../ui";
import { TableCheckbox } from "./checkbox";
import { STATUSES, type Status } from "./rows";

/* The table's search field and status filter (Figma: Table Search and
 * Filters, 1014:9704): white, a medium border, 16px corners, 56px tall. */
const FIELD = "flex h-14 items-center rounded-2xl border border-bn-medium bg-white text-base leading-6 text-bn-heavy";

export const TableSearch = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const id = useId();
  return (
    <div className="grid w-full gap-1 sm:w-62">
      <label htmlFor={id} className="text-base leading-6 text-bn-heavy">
        Search projects
      </label>
      <div className={cn(FIELD, "gap-3 px-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-bn-heavy")}>
        <MdSearch aria-hidden className="size-6 shrink-0" />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search"
          className="min-w-0 flex-1 bg-transparent placeholder:text-bn-medium focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {value ? (
          <button type="button" onClick={() => onChange("")} aria-label="Clear search" className={cn("rounded-full", BN.focus)}>
            <MdHighlightOff aria-hidden className="size-6" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

/** A filter chip with a panel of checkboxes; once set it turns heavy. */
export const StatusFilter = ({ value, onChange }: { value: Status[]; onChange: (v: Status[]) => void }) => {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const active = value.length > 0;

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const close = () => {
    setOpen(false);
    toggle.current?.focus();
  };

  return (
    <div ref={wrap} className="relative self-end" onKeyDown={(e) => e.key === "Escape" && open && close()}>
      <div className={cn(FIELD, "overflow-hidden", active && "border-bn-heavy bg-bn-heavy text-white")}>
        <button
          ref={toggle}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className={cn("flex h-full items-center gap-2 rounded-2xl p-4", active && "pr-2", BN.focus, active && "focus-visible:outline-bn-heavy")}
        >
          {active ? value.join(", ") : "Status"}
          {active ? null : open ? <MdArrowDropUp aria-hidden className="size-6" /> : <MdArrowDropDown aria-hidden className="size-6" />}
        </button>
        {active ? (
          <button type="button" onClick={() => onChange([])} aria-label="Clear the status filter" className={cn("mr-3 rounded-full p-1", BN.focus)}>
            <MdClose aria-hidden className="size-5" />
          </button>
        ) : null}
      </div>
      {open ? (
        <div id={panelId} role="group" aria-label="Status" className="absolute top-full left-0 z-10 mt-2 grid w-48 gap-1 rounded-2xl bg-bn-grey-lightest p-3 shadow-[0_8px_24px_rgb(14_37_23/0.12)]">
          {STATUSES.map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-3 rounded-[8px] px-1 py-1.5 text-base leading-6 text-bn-heavy">
              <TableCheckbox
                checked={value.includes(s)}
                onChange={(on) => onChange(on ? [...value, s] : value.filter((v) => v !== s))}
                label={s}
              />
              <span aria-hidden>{s}</span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
};
