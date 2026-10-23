"use client";

import { useState } from "react";
import { MdChevronRight } from "react-icons/md";
import { cn } from "../../cn";
import { Sidebar } from "./sidebar";

/* The product's sidebar where it lives: at the side of a page. Pick a page
 * and the page beside it follows; fold the sidebar to its rail and the page
 * takes the room. The page holds its layout in Banyan's skeleton, so it
 * shows the shape of each screen without repeating what the chapter shows. */
type Layout = "cards" | "table" | "form" | "people";

const PAGES: Record<string, { group?: string; note: string; layout: Layout }> = {
  Explore: { note: "Projects to buy from, filtered on one side, on the globe on the other.", layout: "cards" },
  "My projects": { note: "The projects a buyer holds credits in, and the news from them.", layout: "cards" },
  Orders: { note: "Every purchase, with its vintage, its price and where it stands.", layout: "table" },
  Retirement: { note: "Credits retired, each with its certificate.", layout: "table" },
  Preview: { group: "Impact", note: "The public page that tells a buyer's story.", layout: "cards" },
  Settings: { group: "Impact", note: "What that public page shows.", layout: "form" },
  Profile: { group: "Organization settings", note: "The organisation's name, logo and details.", layout: "form" },
  Members: { group: "Organization settings", note: "Who's in the account, and what they can do.", layout: "people" },
};

const BONE = "rounded-[6px] bg-bn-grey-light motion-safe:animate-pulse";

const Skeleton = ({ layout }: { layout: Layout }) => {
  if (layout === "cards")
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((n) => (
          <div key={n} className="overflow-hidden rounded-[12px] border border-bn-grey-lightest">
            <div className={cn(BONE, "h-28 rounded-none")} />
            <div className="grid gap-2 p-4">
              <div className={cn(BONE, "h-3 w-2/3")} />
              <div className={cn(BONE, "h-3 w-1/2")} />
            </div>
          </div>
        ))}
      </div>
    );
  if (layout === "table")
    return (
      <div className="grid gap-3">
        {[0, 1, 2, 3, 4].map((n) => (
          <div key={n} className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-4 border-b border-bn-grey-lightest pb-3">
            {[0, 1, 2, 3].map((c) => (
              <div key={c} className={cn(BONE, "h-3", n === 0 && "bg-bn-grey")} />
            ))}
          </div>
        ))}
      </div>
    );
  if (layout === "form")
    return (
      <div className="grid max-w-md gap-5">
        {[0, 1, 2, 3].map((n) => (
          <div key={n} className="grid gap-2">
            <div className={cn(BONE, "h-3 w-24")} />
            <div className={cn(BONE, "h-10")} />
          </div>
        ))}
      </div>
    );
  return (
    <div className="grid gap-4">
      {[0, 1, 2, 3].map((n) => (
        <div key={n} className="flex items-center gap-3">
          <div className={cn(BONE, "size-10 rounded-full")} />
          <div className="grid flex-1 gap-2">
            <div className={cn(BONE, "h-3 w-40")} />
            <div className={cn(BONE, "h-3 w-24")} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const AppFrame = ({ className }: { className?: string }) => {
  const [page, setPage] = useState("Explore");
  const { group, note, layout } = PAGES[page] ?? PAGES.Explore;
  return (
    <div className={cn("flex w-full overflow-hidden rounded-[16px] border border-bn-grey-light bg-white", className)}>
      <Sidebar onPage={setPage} className="shrink-0" />
      <div className="hidden min-w-0 flex-1 p-8 sm:block">
        <p className="flex items-center gap-1 text-[12px] leading-4 text-bn-medium">
          Pachama
          {group ? (
            <>
              <MdChevronRight aria-hidden className="size-4" />
              {group}
            </>
          ) : null}
          <MdChevronRight aria-hidden className="size-4" />
          <span className="text-bn-heavy">{page}</span>
        </p>
        <p aria-live="polite" className="mt-3 text-[28px] leading-9 font-bold text-bn-heavy">
          {page}
        </p>
        <p className="mt-1 max-w-[52ch] text-[14px] leading-5 text-bn-medium">{note}</p>
        <div key={page} className="mt-8 motion-safe:animate-[arrive_0.6s_var(--ease-arrive)_both]">
          <Skeleton layout={layout} />
        </div>
      </div>
    </div>
  );
};
