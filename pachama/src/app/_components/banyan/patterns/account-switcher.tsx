"use client";

import { useId, useRef, useState } from "react";
import { MdCheck, MdUnfoldMore } from "react-icons/md";
import { cn } from "../../cn";
import { BN } from "../ui";

/* The account switcher at the foot of the sidebar: the "Ac" tile, the
 * account and its kind, and a list of the others. Sample accounts. */
const ACCOUNTS = [
  { name: "Acme Inc", kind: "Business account" },
  { name: "Acme Labs", kind: "Business account" },
];

export const AvatarTile = ({ className }: { className?: string }) => (
  <span aria-hidden className={cn("grid size-12 shrink-0 place-items-center rounded-[16px] bg-bn-medium font-display text-[26px] leading-none font-bold text-bn-green", className)}>
    Ac
  </span>
);

export const AccountSwitcher = ({ compact = false }: { compact?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const close = () => {
    setOpen(false);
    button.current?.focus();
  };

  return (
    <div className="relative" onKeyDown={(e) => e.key === "Escape" && open && close()} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={compact ? `Switch account, now ${ACCOUNTS[current].name}` : undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn("flex w-full items-center gap-2.5 rounded-[8px] text-left hover:bg-bn-grey-lightest/60", BN.focus)}
      >
        <AvatarTile />
        {compact ? null : (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[16px] leading-6 font-medium text-bn-heavy">{ACCOUNTS[current].name}</span>
              <span className="block text-[14px] leading-5 text-bn-medium">{ACCOUNTS[current].kind}</span>
            </span>
            <MdUnfoldMore aria-hidden className="size-5 text-bn-heavy" />
          </>
        )}
      </button>
      <ul id={id} hidden={!open} className="absolute bottom-full left-0 z-10 mb-2 w-64 rounded-[12px] border border-bn-grey-light bg-white p-1 shadow-[0_8px_24px_rgb(14_37_23/0.12)]">
        {ACCOUNTS.map((a, i) => (
          <li key={a.name}>
            <button
              type="button"
              aria-pressed={i === current}
              onClick={() => {
                setCurrent(i);
                close();
              }}
              className={cn("flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-left hover:bg-bn-green-lightest", BN.focus)}
            >
              <span className="flex-1">
                <span className="block text-[14px] leading-5 font-medium text-bn-heavy">{a.name}</span>
                <span className="block text-[12px] leading-4 text-bn-medium">{a.kind}</span>
              </span>
              {i === current ? <MdCheck aria-hidden className="size-5 text-bn-heavy" /> : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
