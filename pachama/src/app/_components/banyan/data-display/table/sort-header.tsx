import type { ReactNode } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { cn } from "../../../cn";

/* A sortable header cell (Figma: Table Header, Sort Asc / Sort Des): Matter
 * Bold 16, 64px tall, a button that flips the order, aria-sort on the cell.
 * Banyan draws ascending with the caret down and descending with it up. */
export type Dir = "asc" | "desc";

export const SortHeader = ({
  label,
  dir,
  onSort,
  className,
}: {
  label: ReactNode;
  /** This column's order, or nothing when another column sorts. */
  dir?: Dir;
  onSort: () => void;
  className?: string;
}) => (
  <th scope="col" aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : undefined} className={cn("p-0 text-left", className)}>
    <button
      type="button"
      onClick={onSort}
      className="flex h-16 w-full items-center gap-1 px-6 text-base leading-6 font-bold whitespace-nowrap text-bn-heavy focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-bn-heavy"
    >
      {label}
      {dir === "asc" ? <MdArrowDropDown aria-hidden className="size-6" /> : null}
      {dir === "desc" ? <MdArrowDropUp aria-hidden className="size-6" /> : null}
    </button>
  </th>
);
