"use client";

import { useEffect, useState } from "react";
import { cn } from "./cn";

export type NavGroup = {
  /** The chapter's own anchor, where its title sits. */
  id: string;
  numeral: string;
  title: string;
  items: readonly { id: string; label: string }[];
};

/* The Messa story's nav, in Pausa's colours: collapsed, a quiet stack of
 * ticks on the right edge, one per chapter, the current one longer and in
 * the pen's blue. Hover, focus or a click opens a small card; the chapter
 * you're reading unfolds into its sections. Hidden below xl. */
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

  const jump = (id: string) => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  };

  const close = () => {
    setOpen(false);
    setPinned(null);
  };

  return (
    <nav
      aria-label="Case study sections"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 xl:block"
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
          "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-[opacity]",
          open
            ? "pointer-events-auto translate-x-0 opacity-100"
            : "pointer-events-none translate-x-2 opacity-0 motion-reduce:translate-x-0",
        )}
      >
        {groups.map((group, gi) => (
          <div key={group.title} className={gi > 0 ? "mt-1" : undefined}>
            <button
              type="button"
              aria-expanded={gi === openGroup}
              onClick={() => {
                setPinned(gi);
                jump(group.id);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen",
                gi === activeGroup ? "text-pen" : "text-body hover:text-ink",
              )}
            >
              <span className="w-6 text-left">{group.numeral}</span>
              {group.title}
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                gi === openGroup ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <ul
                aria-hidden={gi !== openGroup || undefined}
                inert={gi !== openGroup || undefined}
                className="mb-1 ml-3 overflow-hidden border-l border-rule pl-2"
              >
                {group.items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={item.id === activeId ? "true" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        jump(item.id);
                        close();
                      }}
                      className={cn(
                        "block rounded-md px-2 py-1 font-sans text-[13px] leading-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen",
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
      </div>

      <button
        type="button"
        aria-label="Open case study navigation"
        aria-hidden={open || undefined}
        inert={open || undefined}
        onClick={() => setOpen(true)}
        className={cn(
          "flex flex-col items-end gap-2 rounded-full px-2 py-3 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen",
          open ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        {groups.map((group, gi) => (
          <span
            key={group.title}
            aria-hidden
            className={cn(
              "block h-[2px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              gi === activeGroup ? "w-6 bg-pen" : "w-3.5 bg-ash",
            )}
          />
        ))}
      </button>
    </nav>
  );
};
