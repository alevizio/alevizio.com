"use client";

import { useState, type ComponentType } from "react";
import { MdAdd, MdExpandLess, MdExpandMore, MdFirstPage, MdLastPage, MdOutlineEco, MdOutlineImageSearch, MdOutlineListAlt, MdOutlinePhotoLibrary, MdOutlineSettings, MdPublic } from "react-icons/md";
import { cn } from "../../cn";
import { Button } from "../button";
import { BN } from "../ui";
import { AccountSwitcher, AvatarTile } from "./account-switcher";

/* The buyer app's sidebar, working: pick a page, open a group, fold the
 * whole thing down to its rail. Glass over the page, a glacier edge. */
type Item = { label: string; Icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>; children?: { label: string; count?: number }[] };

const ITEMS: Item[] = [
  { label: "Explore", Icon: MdOutlineImageSearch },
  { label: "My projects", Icon: MdOutlinePhotoLibrary },
  { label: "Orders", Icon: MdOutlineListAlt },
  { label: "Retirement", Icon: MdOutlineEco },
  { label: "Impact", Icon: MdPublic, children: [{ label: "Preview" }, { label: "Settings" }] },
  { label: "Organization settings", Icon: MdOutlineSettings, children: [{ label: "Profile" }, { label: "Members", count: 4 }] },
];

const ROW = cn("flex w-full items-center gap-2 rounded-[8px] p-3 text-left text-[14px] leading-5 font-medium text-bn-heavy hover:bg-bn-grey-lightest/60", BN.focus);

export const Sidebar = ({ onPage, className }: { onPage?: (page: string) => void; className?: string }) => {
  const [page, setPageState] = useState("Explore");
  const setPage = (next: string) => {
    setPageState(next);
    onPage?.(next);
  };
  const [open, setOpen] = useState<string[]>(["Impact", "Organization settings"]);
  const [rail, setRail] = useState(false);
  // A page opens itself; a group toggles, or, folded to the rail, unfolds
  // the sidebar with that group open.
  const choose = ({ label, children }: Item) => {
    if (!children) return setPage(label);
    if (rail) {
      setRail(false);
      return setOpen((o) => (o.includes(label) ? o : [...o, label]));
    }
    setOpen((o) => (o.includes(label) ? o.filter((l) => l !== label) : [...o, label]));
  };

  return (
    <nav
      aria-label="Product"
      className={cn("relative flex min-h-[640px] flex-col bg-bn-glass-2/60 backdrop-blur-[35px] transition-[width] motion-reduce:transition-none", rail ? "w-20" : "w-[300px] max-w-full", className)}
    >
      <span aria-hidden className="absolute inset-y-0 right-0 w-px bg-linear-to-b from-bn-blue via-bn-green to-bn-mauve" />
      <div className={cn("flex items-center gap-2 p-6", rail && "flex-col px-4")}>
        {/* eslint-disable-next-line @next/next/no-img-element -- the brand's own SVG */}
        <img src={rail ? "/brand/symbol-dark.svg" : "/brand/logo-light.svg"} alt="Pachama" className={rail ? "h-8 w-auto" : "h-9 w-auto"} />
        <button type="button" aria-label={rail ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setRail((r) => !r)} className={cn("grid size-8 place-items-center rounded-[8px] text-bn-heavy hover:bg-bn-grey-lightest", BN.focus, !rail && "ml-auto")}>
          {rail ? <MdLastPage aria-hidden className="size-5" /> : <MdFirstPage aria-hidden className="size-5" />}
        </button>
      </div>

      <ul className="grid flex-1 content-start gap-2 px-4">
        {ITEMS.map((item) => {
          const { label, Icon, children } = item;
          const expanded = open.includes(label);
          // Lit: the current page, an open group, or (on the rail) the group
          // holding the current page.
          const lit = children ? (rail ? children.some((c) => c.label === page) : expanded) : page === label;
          return (
            <li key={label}>
              <button
                type="button"
                aria-current={!children && page === label ? "page" : undefined}
                aria-expanded={children && !rail ? expanded : undefined}
                aria-label={rail ? label : undefined}
                onClick={() => choose(item)}
                className={cn(ROW, rail && "justify-center", lit && "bg-bn-grey-lightest/60")}
              >
                <Icon aria-hidden className="size-6 shrink-0" />
                {rail ? null : <span className="flex-1">{label}</span>}
                {children && !rail ? (expanded ? <MdExpandLess aria-hidden className="size-4" /> : <MdExpandMore aria-hidden className="size-4" />) : null}
              </button>
              {children && expanded && !rail ? (
                <ul>
                  {children.map((c) => (
                    <li key={c.label}>
                      <button type="button" aria-current={page === c.label ? "page" : undefined} onClick={() => setPage(c.label)} className={cn(ROW, "py-2 pl-10", page === c.label && "underline underline-offset-4")}>
                        <span className="flex-1">{c.label}</span>
                        {c.count ? <span className="font-bold text-bn-medium">{c.count}</span> : null}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className={cn("grid gap-6 p-4 pb-6", rail && "justify-items-center")}>
        {rail ? <AvatarTile /> : <AccountSwitcher />}
        {rail ? (
          <button type="button" aria-label="Support now" className={cn("grid size-10 place-items-center rounded-[12px] bg-bn-green text-bn-heavy hover:bn-green-blue", BN.focus)}>
            <MdAdd aria-hidden className="size-6" />
          </button>
        ) : (
          <Button className="w-full">Support now</Button>
        )}
      </div>
    </nav>
  );
};
