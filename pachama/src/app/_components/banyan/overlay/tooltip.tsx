"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "../../cn";
import { ARROW, PLACE, type Placement } from "./glass";

/* Banyan's tooltip: a short label in Matter 12/16 on glass, with its arrow.
 * The docs set it a shade darker than the menus and popovers so a label
 * this small still reads on the eggshell; this is that shade. */
const TIP = "bg-bn-heavy/15 backdrop-blur-[80px]";

/** The label itself, for showing a tooltip open on its own. */
export const TooltipBubble = ({
  placement = "top",
  id,
  role,
  hidden,
  children,
  className,
}: {
  placement?: Placement;
  id?: string;
  role?: "tooltip";
  hidden?: boolean;
  children: ReactNode;
  className?: string;
}) => (
  <span id={id} role={role} hidden={hidden} className={cn("relative block w-max max-w-60 rounded-[4px] p-2 text-[12px] leading-4 text-bn-heavy", TIP, className)}>
    {children}
    <span aria-hidden className={cn("absolute", TIP, ARROW[placement])} />
  </span>
);

/** Shows its label on hover and on keyboard focus; Escape hides it. The
 *  trigger gets the label as its description through the render prop. */
export const Tooltip = ({
  label,
  placement = "top",
  children,
  className,
}: {
  label: string;
  placement?: Placement;
  children: (describedBy: { "aria-describedby": string }) => ReactNode;
  className?: string;
}) => {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      {children({ "aria-describedby": id })}
      <span className={cn("absolute z-30", PLACE[placement], !open && "hidden")}>
        <TooltipBubble id={id} role="tooltip" placement={placement}>
          {label}
        </TooltipBubble>
      </span>
    </span>
  );
};
