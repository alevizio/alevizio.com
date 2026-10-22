"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { MdCheck } from "react-icons/md";
import { cn } from "../../cn";
import { GLASS } from "./glass";
import { useDismiss } from "./use-dismiss";

/* Banyan's menu, as a WAI-ARIA menu button: 248px of glass, items at 16/24
 * with 16px padding. "radio" picks one (a check marks it), "checkbox" picks
 * several and stays open, "action" runs one and closes. Arrows, Home and
 * End move, a letter jumps, Escape closes and returns to the trigger. */
export type MenuItem = { id: string; label: string; description?: string; icon?: ReactNode; group?: string };
type Kind = "radio" | "checkbox" | "action";

const ROLE = { radio: "menuitemradio", checkbox: "menuitemcheckbox", action: "menuitem" } as const;
const ITEM =
  "flex w-full items-center gap-4 p-4 text-left text-[16px] leading-6 text-bn-heavy hover:bg-bn-glass-2/40 focus-visible:bg-bn-glass-2/40 focus-visible:shadow-[inset_0_0_0_2px_var(--color-bn-heavy)] focus-visible:outline-none";

/** Banyan's 24px checkbox: 8px corners, filled heavy when checked. */
export const MenuCheck = ({ checked }: { checked: boolean }) => (
  <span aria-hidden className={cn("grid size-6 shrink-0 place-items-center rounded-[8px] border", checked ? "border-bn-heavy bg-bn-heavy text-white" : "border-bn-medium bg-white/30")}>
    {checked ? <MdCheck className="size-4" /> : null}
  </span>
);

type MenuButtonProps = {
  kind: Kind;
  items: MenuItem[];
  selected?: string[];
  onSelect: (id: string) => void;
  /** What the trigger shows, and its classes. */
  trigger: ReactNode;
  triggerClassName?: string;
  /** For a trigger without visible text, like an avatar. */
  triggerLabel?: string;
  /** Labels the trigger, the way a field label would. */
  labelledBy?: string;
  /** Something above the items that isn't one, like the account's name. */
  header?: ReactNode;
  className?: string;
};

export const MenuButton = ({ kind, items, selected = [], onSelect, trigger, triggerClassName, triggerLabel, labelledBy, header, className }: MenuButtonProps) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root, button, close);

  useEffect(() => {
    if (open) refs.current[active]?.focus();
  }, [open, active]);

  const first = Math.max(0, items.findIndex((it) => selected.includes(it.id)));
  const openAt = (i: number) => {
    setActive(i);
    setOpen(true);
  };

  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    openAt(e.key === "ArrowDown" ? first : items.length - 1);
  };

  const onItemKey = (e: KeyboardEvent, i: number) => {
    const n = items.length;
    const to = { ArrowDown: (i + 1) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (to !== undefined) {
      e.preventDefault();
      setActive(to);
    } else if (e.key === "Tab") {
      close();
    } else if (e.key.length === 1 && /\S/.test(e.key)) {
      // Typeahead: the next item starting with that letter.
      const hit = [...items.slice(i + 1), ...items.slice(0, i + 1)].find((it) => it.label.toLowerCase().startsWith(e.key.toLowerCase()));
      if (hit) setActive(items.indexOf(hit));
    }
  };

  const choose = (item: MenuItem) => {
    onSelect(item.id);
    if (kind === "checkbox") return;
    close();
    button.current?.focus();
  };

  return (
    <div ref={root} className={cn("relative", className)}>
      <button
        ref={button}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={triggerLabel}
        aria-labelledby={labelledBy ? `${labelledBy} ${id}-value` : undefined}
        onClick={() => (open ? close() : openAt(first))}
        onKeyDown={onTriggerKey}
        className={triggerClassName}
      >
        <span id={`${id}-value`} className="contents">
          {trigger}
        </span>
      </button>
      {open ? (
        <div id={id} role="menu" aria-label={triggerLabel} aria-labelledby={triggerLabel ? undefined : labelledBy} className={cn("absolute top-full left-0 z-30 mt-2 w-62 overflow-hidden rounded-2xl", GLASS)}>
          {header}
          {items.map((item, i) => {
            const checked = selected.includes(item.id);
            const startsGroup = item.group && item.group !== items[i - 1]?.group;
            return (
              <div key={item.id} role="none">
                {startsGroup ? (
                  <div role="presentation" className={cn("px-4 pt-4 pb-2 text-[12px] leading-4 font-medium text-bn-heavy uppercase", i > 0 && "border-t border-bn-line")}>
                    {item.group}
                  </div>
                ) : null}
                <button
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  type="button"
                  role={ROLE[kind]}
                  aria-checked={kind === "action" ? undefined : checked}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => choose(item)}
                  onKeyDown={(e) => onItemKey(e, i)}
                  onPointerMove={() => i !== active && setActive(i)}
                  className={ITEM}
                >
                  {kind === "checkbox" ? <MenuCheck checked={checked} /> : null}
                  {item.icon ? <span className="grid size-8 shrink-0 place-items-center">{item.icon}</span> : null}
                  <span className="min-w-0 flex-1">
                    {item.label}
                    {item.description ? <span className="block text-[14px] leading-5 text-bn-medium">{item.description}</span> : null}
                  </span>
                  {kind === "radio" && checked ? <MdCheck aria-hidden className="size-6 shrink-0" /> : null}
                </button>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
