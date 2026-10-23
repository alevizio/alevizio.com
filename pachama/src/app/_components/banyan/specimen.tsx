import type { ReactNode } from "react";
import { cn } from "../cn";

/** One component as Banyan's documentation shows it: live, straight on the
 *  chapter's eggshell ground, with its name and a line on what it's for
 *  underneath. It rises in as it scrolls into view. */
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
  /** Layout for the component; it lines its children up and wraps them by default. */
  panelClassName?: string;
}) => (
  <figure data-reveal className={cn("min-w-0", className)}>
    <div className={cn("flex flex-wrap items-center gap-4", panelClassName)}>{children}</div>
    <figcaption className="mt-5 max-w-[60ch]">
      <span className="block text-[15px] font-medium text-bn-heavy">{name}</span>
      {note ? <span className="mt-0.5 block text-[14px] leading-snug text-bn-medium">{note}</span> : null}
    </figcaption>
  </figure>
);

/** Specimens side by side from lg up. */
export const SpecimenGrid = ({ children, cols = 2, className }: { children: ReactNode; cols?: 1 | 2 | 3; className?: string }) => (
  <div className={cn("grid gap-x-12 gap-y-16", cols === 2 && "lg:grid-cols-2", cols === 3 && "md:grid-cols-2 xl:grid-cols-3", className)}>{children}</div>
);
