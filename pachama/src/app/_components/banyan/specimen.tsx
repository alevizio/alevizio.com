import type { ReactNode } from "react";
import { cn } from "../cn";

/* Banyan's components as a contact sheet: no boxes and no titles on show,
 * each component straight on the eggshell ground, the spans interlocking
 * and the gutters doing the separating. Twelve columns from lg, six from
 * md, one on phones. */

/** A card's width in the bento: full 12, wide 8, half 6, narrow 4 (of 12). */
export type Span = "full" | "wide" | "half" | "narrow";
export const SPAN: Record<Span, string> = {
  full: "md:col-span-6 lg:col-span-12",
  wide: "md:col-span-6 lg:col-span-8",
  half: "md:col-span-3 lg:col-span-6",
  narrow: "md:col-span-3 lg:col-span-4",
};

/** For the components that are cards themselves (the graphs): a warm tint
 *  a step down from the eggshell ground, not white; pressed buttons cut
 *  back to the same tint. */
export const BENTO_CARD = "min-w-0 rounded-[24px] border border-[#e6e0cc] bg-[#f5f2e6] p-6 [--bn-surface:#f5f2e6] sm:p-8";

export const Bento = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("grid grid-flow-row-dense grid-cols-1 items-center gap-x-8 gap-y-10 md:grid-cols-6 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-12", className)}>{children}</div>
);

/** One component, live on the ground. Its name and what it's for stay in
 *  the markup for screen readers; on screen the sheet shows the components
 *  alone. */
export const Specimen = ({
  name,
  note,
  span = "full",
  children,
  className,
  panelClassName,
}: {
  name: string;
  note?: ReactNode;
  span?: Span;
  children: ReactNode;
  className?: string;
  /** Layout for the component; it lines its children up and wraps them by default. */
  panelClassName?: string;
}) => (
  <figure data-reveal className={cn("flex min-w-0 flex-col", SPAN[span], className)}>
    <figcaption className="sr-only">
      {name}
      {note ? <>: {note}</> : null}
    </figcaption>
    <div className={cn("flex flex-1 flex-wrap items-center gap-4", panelClassName)}>{children}</div>
  </figure>
);
