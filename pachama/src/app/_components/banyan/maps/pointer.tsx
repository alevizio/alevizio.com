"use client";

import { useId, useState } from "react";
import { MdLocalFireDepartment } from "react-icons/md";
import { cn } from "../../cn";
import type { Alert } from "./data";
import { MAP_GLASS } from "./legend";

/* Banyan's map pointer for a fire alert: a fire-red disc with a white ring.
 * Hover or focus it for the detection tooltip; Escape hides it. Placed by
 * percentages of the image, as literal classes from the caller. */
export const FirePointer = ({ alert, className, tipSide = "right" }: { alert: Alert; className?: string; tipSide?: "right" | "left" }) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <span className={cn("absolute -translate-x-1/2 -translate-y-1/2", open && "z-10", className)}>
      <button
        type="button"
        aria-label={`Fire alert, ${alert.year}`}
        aria-describedby={id}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className="grid size-5 place-items-center rounded-full bg-bn-red sm:size-7 text-white shadow-[0_0_0_2px_white] transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
      >
        <MdLocalFireDepartment aria-hidden className="size-3 sm:size-4" />
      </button>
      <span
        id={id}
        role="tooltip"
        className={cn(
          "absolute top-1/2 w-56 -translate-y-1/2 rounded-[10px] px-3 py-2 text-[12px] leading-4",
          MAP_GLASS,
          tipSide === "right" ? "left-full ml-3" : "right-full mr-3",
          !open && "hidden",
        )}
      >
        <span className="block font-medium">{alert.date}</span>
        <span className="mt-0.5 block text-white/80">{alert.where}</span>
      </span>
    </span>
  );
};
