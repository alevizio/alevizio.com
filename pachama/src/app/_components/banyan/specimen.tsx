import type { ReactNode } from "react";
import { cn } from "../cn";
import { BN } from "./ui";

/** One component as Banyan's documentation shows it: live, on an eggshell
 *  panel, with its name and a line on what it's for underneath. */
export const Specimen = ({
  name,
  note,
  children,
  className,
  panelClassName,
}: {
  name: string;
  note?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Layout inside the panel; it centres and wraps its children by default. */
  panelClassName?: string;
}) => (
  <figure className={cn("min-w-0", className)}>
    <div className={cn(BN.panel, "flex min-h-40 flex-wrap items-center justify-center gap-4 p-6 sm:p-10", panelClassName)}>{children}</div>
    <figcaption className="mt-3 max-w-[60ch]">
      <span className="block text-[15px] font-medium text-bn-heavy">{name}</span>
      {note ? <span className="mt-0.5 block text-[14px] leading-snug text-bn-medium">{note}</span> : null}
    </figcaption>
  </figure>
);

/** Specimens side by side from lg up. */
export const SpecimenGrid = ({ children, cols = 2, className }: { children: ReactNode; cols?: 1 | 2 | 3; className?: string }) => (
  <div className={cn("grid gap-x-6 gap-y-12", cols === 2 && "lg:grid-cols-2", cols === 3 && "md:grid-cols-2 xl:grid-cols-3", className)}>{children}</div>
);
