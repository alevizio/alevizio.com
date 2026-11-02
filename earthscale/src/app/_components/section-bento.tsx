import { numbered, SHEETS, type Tile } from "../_chapters/page-anatomy";
import { cn } from "./cn";

/* The sections' pieces, rebuilt and working, in one bento: four columns,
 * cards of one or two, packed tight (dense), each named and marked with the
 * section it comes from; two columns on a tablet, and on a phone one, with
 * the quieter cards left out. They come in one after another and each plays
 * as it comes into view. */
const SPAN = { 1: "", 2: "md:col-span-2" } as const;

export const SectionBento = ({ tiles, className }: { tiles: Tile[]; className?: string }) => (
  <ul data-stagger className={cn("grid grid-flow-dense gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4", className)}>
    {tiles.map(({ from, title, span, phone, children }) => (
      <li key={title} data-reveal className={cn("hairline flex min-w-0 flex-col overflow-hidden rounded-[10px] bg-(--tone-fill) p-5", SPAN[span], phone === false && "max-md:hidden")}>
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
