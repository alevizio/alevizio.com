"use client";

import type { ComponentProps, ReactNode } from "react";
import { MdCheck, MdRemove } from "react-icons/md";
import { cn } from "../../cn";

/* Banyan's Checkbox, Radio and Switch, on native inputs so the keyboard,
 * forms and screen readers get the real thing. Three sizes each, a 16/24
 * Matter label at medium, 8px between control and label. */
type Size = "sm" | "md" | "lg";
type ChoiceProps = Omit<ComponentProps<"input">, "type" | "size" | "className"> & {
  label: ReactNode;
  size?: Size;
  className?: string;
};

const TEXT: Record<Size, string> = { sm: "text-sm leading-5", md: "text-base leading-6", lg: "text-lg leading-7" };
const LABEL = "group relative inline-flex cursor-pointer items-center gap-2 text-bn-heavy has-[:disabled]:cursor-not-allowed";
const FOCUS = "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bn-heavy";
const LABEL_TEXT = "group-has-[:disabled]:text-bn-light";

const BOX: Record<Size, string> = { sm: "size-5 rounded-[6px] text-sm", md: "size-6 rounded-lg text-base", lg: "size-7 rounded-lg text-lg" };

/** Unselected, selected or indeterminate; the dash wins over the tick. */
export const Checkbox = ({ label, size = "md", indeterminate = false, className, ...input }: ChoiceProps & { indeterminate?: boolean }) => (
  <label className={cn(LABEL, TEXT[size], className)}>
    <input
      type="checkbox"
      ref={(el) => {
        if (el) el.indeterminate = indeterminate;
      }}
      className="peer sr-only"
      {...input}
    />
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center border border-bn-medium bg-white/30 text-white transition-colors group-hover:border-bn-heavy",
        "peer-checked:border-bn-heavy peer-checked:bg-bn-heavy peer-indeterminate:border-bn-heavy peer-indeterminate:bg-bn-heavy group-has-[:disabled]:opacity-40",
        FOCUS,
        BOX[size],
      )}
    >
      <MdCheck className="hidden group-has-[:checked]:block group-has-[:indeterminate]:hidden" />
      <MdRemove className="hidden group-has-[:indeterminate]:block" />
    </span>
    <span className={LABEL_TEXT}>{label}</span>
  </label>
);

const RING: Record<Size, string> = { sm: "size-5", md: "size-6", lg: "size-7" };
const DOT: Record<Size, string> = { sm: "size-2", md: "size-2.5", lg: "size-3" };

/** A radio's ring and dot alone, for an option whose label is a whole
 *  card: put it right after the card's sr-only radio input, in a `group`
 *  label. */
export const RadioMark = ({ size = "md" }: { size?: Size }) => (
  <span
    aria-hidden
    className={cn(
      "grid shrink-0 place-items-center rounded-full border border-bn-medium bg-white/30 transition-colors group-hover:border-bn-heavy",
      "peer-checked:border-2 peer-checked:border-bn-heavy group-has-[:disabled]:border-bn-line",
      FOCUS,
      RING[size],
    )}
  >
    <span className={cn("rounded-full bg-bn-heavy opacity-0 group-has-[:checked]:opacity-100 group-has-[:disabled]:bg-bn-line", DOT[size])} />
  </span>
);

/** One option of a radio group; group them in a fieldset with one name. */
export const Radio = ({ label, size = "md", className, ...input }: ChoiceProps) => (
  <label className={cn(LABEL, TEXT[size], className)}>
    <input type="radio" className="peer sr-only" {...input} />
    <RadioMark size={size} />
    <span className={LABEL_TEXT}>{label}</span>
  </label>
);

// Track and thumb per size, and how far the thumb travels when on.
const TRACK: Record<Size, string> = { sm: "h-5 w-8", md: "h-6 w-10", lg: "h-7 w-12" };
const THUMB: Record<Size, string> = {
  sm: "size-4 group-has-[:checked]:translate-x-3",
  md: "size-5 group-has-[:checked]:translate-x-4",
  lg: "size-6 group-has-[:checked]:translate-x-5",
};

/** On or off at once, no confirm: a checkbox with the switch role. Off is
 *  a grey track, on runs lidar green into glacier, the knob is flat white. */
export const Switch = ({ label, size = "md", className, ...input }: ChoiceProps) => (
  <label className={cn(LABEL, TEXT[size], className)}>
    <input type="checkbox" role="switch" className="peer sr-only" {...input} />
    <span
      aria-hidden
      className={cn(
        "relative shrink-0 rounded-full bg-bn-grey-light transition-colors peer-checked:bn-green-blue group-has-[:disabled]:opacity-50 motion-reduce:transition-none",
        FOCUS,
        TRACK[size],
      )}
    >
      <span className={cn("absolute top-0.5 left-0.5 rounded-full bg-white transition-transform motion-reduce:transition-none", THUMB[size])} />
    </span>
    <span className={LABEL_TEXT}>{label}</span>
  </label>
);
