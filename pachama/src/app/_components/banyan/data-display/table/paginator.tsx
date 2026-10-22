"use client";

import { useId } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { cn } from "../../../cn";
import { BN } from "../../ui";

/* The table's paginator (Figma: Table Paginator, 1008:10322): rows per
 * page, where you are, and back and forward. */
const STEP = cn("grid size-8 place-items-center rounded-full text-bn-heavy enabled:hover:bg-bn-grey-lightest disabled:text-bn-light", BN.focus);

export const Paginator = ({
  page,
  pages,
  perPage,
  onPage,
  onPerPage,
}: {
  page: number;
  pages: number;
  perPage: number;
  onPage: (p: number) => void;
  onPerPage: (n: number) => void;
}) => {
  const id = useId();
  return (
    <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 px-2 pt-3 text-[14px] leading-5 text-bn-heavy">
      <span className="flex items-center gap-2">
        <label htmlFor={id}>Rows per page</label>
        <select id={id} value={perPage} onChange={(e) => onPerPage(Number(e.target.value))} className={cn("rounded-[8px] bg-transparent py-1 pr-1 font-medium", BN.focus)}>
          {[3, 5].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </span>
      <span aria-live="polite">
        Page {page} of {pages}
      </span>
      <span className="flex gap-1">
        <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)} className={STEP}>
          <MdChevronLeft aria-hidden className="size-6" />
        </button>
        <button type="button" aria-label="Next page" disabled={page >= pages} onClick={() => onPage(page + 1)} className={STEP}>
          <MdChevronRight aria-hidden className="size-6" />
        </button>
      </span>
    </div>
  );
};
