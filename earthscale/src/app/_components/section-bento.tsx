import { numbered, SHEETS, type Tile } from "../_chapters/page-anatomy";
import { cn } from "./cn";

/* The sections' pieces, rebuilt and working, in one bento: four columns,
 * pieces one, two or all four wide, packed tight (dense), each named and
 * marked with the section it comes from and set straight on the band, no
 * cards round them, only the pieces' own; two columns on a tablet, and on
 * a phone one, with the quieter pieces left out. They come in one after
 * another and each plays as it comes into view. */
const SPAN = { 1: "", 2: "md:col-span-2", 4: "md:col-span-2 lg:col-span-4" } as const;

export const SectionBento = ({ tiles, className }: { tiles: Tile[]; className?: string }) => (
  <ul data-stagger className={cn("grid grid-flow-dense gap-x-8 gap-y-14 md:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-4 lg:gap-x-12 lg:gap-y-20", className)}>
    {tiles.map(({ from, title, span, phone, children }) => (
      <li key={title} data-reveal className={cn("flex min-w-0 flex-col", SPAN[span], phone === false && "max-md:hidden")}>
        <p className="type-label flex items-baseline gap-2 text-(--tone-text)">
          <span className="text-(--tone-label)">{numbered(from)}</span>
          {SHEETS[from].label}
          <span aria-hidden className="text-(--tone-line)">/</span>
          <span className="text-(--tone-head) normal-case tracking-normal">{title}</span>
        </p>
        <div className="flex flex-1 flex-col justify-center pt-5">{children}</div>
      </li>
    ))}
  </ul>
);
