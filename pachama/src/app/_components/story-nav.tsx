"use client";

import { useEffect, useRef, useState } from "react";
import { MdClose, MdHome } from "react-icons/md";
import { cn } from "./cn";

export type NavGroup = {
  /** The chapter's own anchor, where its title sits. */
  id: string;
  numeral: string;
  title: string;
  items: readonly { id: string; label: string }[];
};

/* The Pausa story's nav, in Pachama's colours: collapsed, a quiet stack of
 * ticks on the right edge, one per chapter, the current one longer and in
 * the leaf green. Hover, focus or a click opens a small card, with a way
 * back to the hero at its top; the chapter you're reading unfolds into its
 * sections. Below xl the same ticks sit in a round button at the bottom
 * right, there once the hero is passed and out of the way while scrolling
 * down; it opens the same list in a sheet. */
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#157a41]";
const EASE = "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";
// The phone button: there once the hero (this much of a screen) is passed,
// and a scroll this far, in px, counts as going up or down.
const PAST_HERO = 0.8;
const NUDGE_PX = 6;
const smooth = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: smooth() ? "smooth" : "auto", block: "start" });
const toTop = () => window.scrollTo({ top: 0, behavior: smooth() ? "smooth" : "auto" });

/** One tick a chapter, the current one longer and green. */
const Ticks = ({ count, active, className }: { count: number; active: number; className?: string }) => (
  <span aria-hidden className={cn("flex flex-col items-end gap-2", className)}>
    {Array.from({ length: count }, (_, gi) => (
      <span key={gi} className={cn("block h-[2px] rounded-full transition-all", EASE, gi === active ? "w-6 bg-leaf" : "w-3.5 bg-ash")} />
    ))}
  </span>
);

type Spy = { groups: readonly NavGroup[]; activeId: string | null; activeGroup: number };

/** What both navs list: back to the top, then each chapter, the open one
 *  unfolded into its sections. Roomier on a phone, for a thumb. */
const NavList = ({
  groups,
  activeId,
  activeGroup,
  openGroup,
  roomy = false,
  onTop,
  onGroup,
  onItem,
}: Spy & { openGroup: number; roomy?: boolean; onTop: () => void; onGroup: (gi: number) => void; onItem: (id: string) => void }) => {
  const row = cn("flex w-full items-center gap-2 rounded-md px-2 font-mono tracking-[0.18em] uppercase transition-colors", roomy ? "py-3.5 text-[11px]" : "py-1.5 text-[10px]", FOCUS);
  return (
    <>
      <button type="button" onClick={onTop} className={cn(row, "mb-1 text-body hover:text-ink")}>
        <span className="w-6">
          <MdHome aria-hidden className="size-3.5" />
        </span>
        Back to the top
      </button>
      {groups.map((group, gi) => (
        <div key={group.title} className={gi > 0 ? "mt-1" : undefined}>
          <button type="button" aria-expanded={gi === openGroup} onClick={() => onGroup(gi)} className={cn(row, gi === activeGroup ? "text-[#157a41]" : "text-body hover:text-ink")}>
            <span className="w-6 text-left">{group.numeral}</span>
            {group.title}
          </button>
          <div className={cn("grid transition-[grid-template-rows] motion-reduce:transition-none", EASE, gi === openGroup ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
            <ul aria-hidden={gi !== openGroup || undefined} inert={gi !== openGroup || undefined} className="mb-1 ml-3 overflow-hidden border-l border-rule pl-2">
              {group.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={item.id === activeId ? "true" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      onItem(item.id);
                    }}
                    className={cn(
                      "block rounded-md px-2 font-sans leading-6 transition-colors",
                      roomy ? "py-2.5 text-[15px]" : "py-1 text-[13px]",
                      FOCUS,
                      item.id === activeId ? "font-medium text-ink" : "text-body hover:bg-panel hover:text-ink",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
};

/** Below xl: the ticks in a round button, shown once the hero is passed and
 *  while scrolling back up; it opens the list in a sheet from the bottom.
 *  While the sheet is open the page behind it stays put. */
const PhoneNav = ({ groups, activeId, activeGroup }: Spy) => {
  const sheet = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let raf = 0;
    let last = window.scrollY;
    const check = () => {
      raf = 0;
      const y = window.scrollY;
      if (y < window.innerHeight * PAST_HERO) setShown(false);
      else if (y < last - NUDGE_PX) setShown(true);
      else if (y > last + NUDGE_PX) setShown(false);
      if (Math.abs(y - last) > NUDGE_PX) last = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Open, focus is on the sheet itself (named for screen readers), not a
  // ring on its first button after a tap.
  const open = () => {
    document.documentElement.classList.add("overflow-hidden");
    sheet.current?.showModal();
    sheet.current?.focus();
  };
  const close = () => sheet.current?.close();
  // Close the sheet, then go.
  const go = (to: () => void) => {
    close();
    to();
  };

  return (
    <nav aria-label="Case study sections" className="xl:hidden">
      <button
        type="button"
        aria-label="Sections"
        aria-haspopup="dialog"
        inert={!shown || undefined}
        onClick={open}
        className={cn(
          "fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 grid size-12 place-items-center rounded-full bg-[#0e1b14]/75 shadow-[0_8px_24px_rgb(0_0_0/0.25)] ring-1 ring-white/25 backdrop-blur-md transition-[opacity,translate]",
          EASE,
          FOCUS,
          shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <Ticks count={groups.length} active={activeGroup} className="gap-[5px]" />
      </button>
      <dialog
        ref={sheet}
        tabIndex={-1}
        aria-label="Case study sections"
        onClose={() => document.documentElement.classList.remove("overflow-hidden")}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="mx-auto mt-auto mb-0 max-h-[85dvh] w-full max-w-md overflow-y-auto overscroll-contain rounded-t-[16px] bg-white p-3 pb-[max(1rem,env(safe-area-inset-bottom))] text-ink shadow-[0_-8px_32px_rgba(26,26,29,0.16)] outline-none backdrop:bg-black/40 open:motion-safe:animate-[arrive_0.35s_var(--ease-arrive)]"
      >
        <div className="flex justify-end">
          <button type="button" aria-label="Close" onClick={close} className={cn("grid size-11 place-items-center rounded-full text-body hover:bg-panel", FOCUS)}>
            <MdClose aria-hidden className="size-5" />
          </button>
        </div>
        <NavList
          groups={groups}
          activeId={activeId}
          activeGroup={activeGroup}
          openGroup={Math.max(activeGroup, 0)}
          roomy
          onTop={() => go(toTop)}
          onGroup={(gi) => go(() => jump(groups[gi].id))}
          onItem={(id) => go(() => jump(id))}
        />
      </dialog>
    </nav>
  );
};

export const StoryNav = ({ groups }: { groups: readonly NavGroup[] }) => {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);

  // Scroll-spy: the section highest in the reading band wins.
  useEffect(() => {
    const els = groups
      .flatMap((g) => g.items.map((i) => document.getElementById(i.id)))
      .filter((el): el is HTMLElement => el !== null);
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top);
          else visible.delete(e.target.id);
        }
        let top: [string, number] | null = null;
        for (const entry of visible) if (!top || entry[1] < top[1]) top = entry;
        if (top) setActiveId(top[0]);
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [groups]);

  const activeGroup = groups.findIndex((g) => g.items.some((i) => i.id === activeId));
  const openGroup = pinned ?? Math.max(activeGroup, 0);

  const close = () => {
    setOpen(false);
    setPinned(null);
  };

  return (
    <>
      <nav
        aria-label="Case study sections"
        className="fixed top-1/2 right-1 z-40 hidden -translate-y-1/2 xl:block"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={close}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) close();
        }}
      >
        <div
          aria-hidden={!open || undefined}
          inert={!open || undefined}
          className={cn(
            "absolute top-1/2 right-0 w-60 origin-right -translate-y-1/2 rounded-[10px] bg-white/95 p-3 shadow-[0_8px_32px_rgba(26,26,29,0.10)] ring-1 ring-rule backdrop-blur-sm",
            "transition-[opacity,transform] motion-reduce:transition-[opacity]",
            EASE,
            open ? "pointer-events-auto translate-x-0 opacity-100" : "pointer-events-none translate-x-2 opacity-0 motion-reduce:translate-x-0",
          )}
        >
          <NavList
            groups={groups}
            activeId={activeId}
            activeGroup={activeGroup}
            openGroup={openGroup}
            onTop={() => {
              toTop();
              close();
            }}
            onGroup={(gi) => {
              setPinned(gi);
              jump(groups[gi].id);
            }}
            onItem={(id) => {
              jump(id);
              close();
            }}
          />
        </div>

        <button
          type="button"
          aria-label="Open case study navigation"
          aria-hidden={open || undefined}
          inert={open || undefined}
          onClick={() => setOpen(true)}
          className={cn("rounded-full px-1 py-3 transition-opacity duration-200", FOCUS, open ? "pointer-events-none opacity-0" : "opacity-100")}
        >
          <Ticks count={groups.length} active={activeGroup} />
        </button>
      </nav>
      <PhoneNav groups={groups} activeId={activeId} activeGroup={activeGroup} />
    </>
  );
};
