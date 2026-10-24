"use client";

import { useId, useState, type ReactNode } from "react";
import { MdAddCircle, MdArrowDropDown, MdCancel } from "react-icons/md";
import { cn } from "../../cn";
import { BN } from "../ui";

/* Banyan's accordion (WIP in the Figma): a white card with a bold title
 * and a filled plus; open, the plus turns into a close and the fields
 * show. Each card is a heading with a button, its panel a region. Given
 * `open` and `onToggle`, a set of them can keep one open at a time. */
export const AccordionItem = ({
  title,
  children,
  initiallyOpen = false,
  open: shown,
  onToggle,
}: {
  title: string;
  children: ReactNode;
  initiallyOpen?: boolean;
  open?: boolean;
  onToggle?: () => void;
}) => {
  const [own, setOwn] = useState(initiallyOpen);
  const open = shown ?? own;
  const id = useId();
  return (
    <div className="rounded-[24px] border border-bn-grey-light bg-white">
      <h4>
        <button
          id={`${id}b`}
          type="button"
          aria-expanded={open}
          aria-controls={`${id}p`}
          onClick={() => (onToggle ? onToggle() : setOwn((o) => !o))}
          className={cn("flex w-full items-center gap-4 rounded-[24px] p-8 text-left text-[24px] leading-8 font-bold text-bn-heavy", BN.focus)}
        >
          <span className="flex-1">{title}</span>
          {open ? <MdCancel aria-hidden className="size-6 shrink-0" /> : <MdAddCircle aria-hidden className="size-6 shrink-0" />}
        </button>
      </h4>
      <div id={`${id}p`} role="region" aria-labelledby={`${id}b`} hidden={!open} className="grid gap-4 px-8 pb-8">
        {children}
      </div>
    </div>
  );
};

/** A labelled dropdown as the accordion holds it: 56px, a 2px heavy edge. */
export const Dropdown = ({ label, options }: { label: string; options: string[] }) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[14px] leading-5 text-bn-heavy">
        {label}
      </label>
      <div className="relative">
        <select id={id} className={cn("h-14 w-full appearance-none rounded-[8px] border-2 border-bn-heavy bg-white pr-10 pl-4 text-[16px] leading-6 text-bn-heavy", BN.focus)}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <MdArrowDropDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-6 -translate-y-1/2 text-bn-heavy" />
      </div>
    </div>
  );
};
