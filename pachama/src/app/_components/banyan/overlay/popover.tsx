"use client";

import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { MdClose, MdInfoOutline } from "react-icons/md";
import { cn } from "../../cn";
import { BN } from "../ui";
import { ARROW, GLASS, PLACE, type Placement } from "./glass";
import { useDismiss } from "./use-dismiss";

/* Banyan's popover: a non-modal panel that floats around its trigger, 240px
 * of glass with a title in Matter Bold 16/24, a line in 12/16, an optional
 * icon and a close button. A disclosure: the trigger says whether it's open,
 * Escape or a press outside closes it. */
type PopoverProps = {
  /** What the trigger is called for screen readers; it shows an info icon. */
  label: string;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  closeButton?: boolean;
  placement?: Placement;
  /** Open on first render, still the reader's to close. */
  defaultOpen?: boolean;
  /** Controlled open state, for demos that open it from elsewhere. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export const Popover = ({ label, title, children, icon, closeButton = true, placement = "top", defaultOpen = false, open: controlled, onOpenChange, className }: PopoverProps) => {
  const [own, setOwn] = useState(defaultOpen);
  const open = controlled ?? own;
  const setOpen = useCallback(
    (next: boolean) => {
      setOwn(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );
  const close = useCallback(() => setOpen(false), [setOpen]);
  const root = useRef<HTMLSpanElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  useDismiss(open, root, trigger, close);

  return (
    <span ref={root} className={cn("relative inline-flex", className)}>
      <button
        ref={trigger}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className={cn("grid size-8 place-items-center rounded-full text-bn-heavy hover:bg-bn-glass-2/60", BN.focus)}
      >
        <MdInfoOutline aria-hidden className="size-5" />
      </button>
      <span id={id} hidden={!open} className={cn("absolute z-30 w-60", PLACE[placement])}>
        <span className={cn("relative flex flex-col items-start gap-2 rounded-[4px] p-4 text-bn-heavy", GLASS)}>
          {icon ? <span className="text-bn-heavy">{icon}</span> : null}
          <span className={cn("block text-[16px] leading-6 font-bold", closeButton && "pr-6")}>{title}</span>
          <span className="block text-[12px] leading-4">{children}</span>
          {closeButton ? (
            <button
              type="button"
              aria-label="Close"
              onClick={() => {
                close();
                trigger.current?.focus();
              }}
              className={cn("absolute top-2 right-2 grid place-items-center rounded-[8px] p-2 hover:bg-bn-glass-2/60", BN.focus)}
            >
              <MdClose aria-hidden className="size-4" />
            </button>
          ) : null}
          <span aria-hidden className={cn("absolute", GLASS, ARROW[placement])} />
        </span>
      </span>
    </span>
  );
};
