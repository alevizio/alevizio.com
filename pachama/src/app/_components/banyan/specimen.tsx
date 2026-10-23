import type { ReactNode } from "react";
import { cn } from "../cn";

/* Banyan's components in a bento, as Source's landing page lays out the
 * product: white cards on the eggshell ground, each titled at its top, in
 * spans that interlock. Twelve columns from lg, six from md, one on phones. */

/** A card's width in the bento: full 12, wide 8, half 6, narrow 4 (of 12). */
export type Span = "full" | "wide" | "half" | "narrow";
export const SPAN: Record<Span, string> = {
  full: "md:col-span-6 lg:col-span-12",
  wide: "md:col-span-6 lg:col-span-8",
  half: "md:col-span-3 lg:col-span-6",
  narrow: "md:col-span-3 lg:col-span-4",
};

/** The card itself, for pieces that are cards already (the graphs). White,
 *  so pressed buttons cut back to white. */
export const BENTO_CARD = "min-w-0 rounded-[24px] border border-[#ebe6d6] bg-white p-6 [--bn-surface:#ffffff] sm:p-8";

export const Bento = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("grid grid-flow-row-dense grid-cols-1 gap-4 sm:gap-5 md:grid-cols-6 lg:grid-cols-12", className)}>{children}</div>
);

/** One component as Banyan's documentation shows it, live in a card: its
 *  name and what it's for at the top, the component under them. Flush
 *  components (a bar, a frame, a map) run to the card's edges. */
export const Specimen = ({
  name,
  note,
  span = "full",
  flush = false,
  children,
  className,
  panelClassName,
}: {
  name: string;
  note?: ReactNode;
  span?: Span;
  flush?: boolean;
  children: ReactNode;
  className?: string;
  /** Layout for the component; it lines its children up and wraps them by default. */
  panelClassName?: string;
}) => (
  <figure data-reveal className={cn(BENTO_CARD, SPAN[span], "flex flex-col", flush && "overflow-hidden", className)}>
    <figcaption className="max-w-[60ch]">
      <span className="block text-[18px] leading-6 font-bold text-bn-heavy">{name}</span>
      {note ? <span className="mt-1 block text-[14px] leading-snug text-bn-medium">{note}</span> : null}
    </figcaption>
    <div className={cn("mt-6 flex flex-1 flex-wrap items-center gap-4", flush && "-mx-6 -mb-6 sm:-mx-8 sm:-mb-8", panelClassName)}>{children}</div>
  </figure>
);
