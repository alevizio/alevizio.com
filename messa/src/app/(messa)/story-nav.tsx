"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "./cn";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

/* Subtle side navigation for a very long story (client ask 2026-06-10):
 * collapsed, it is a quiet stack of ticks hugging the right edge — one
 * per chapter group, the active one in slate. Hover, focus or click
 * expands a small cream-world card with accordion groups; the group
 * containing the section you are reading opens itself, the others
 * stay folded. Hidden below xl so it never crowds the content column. */

type NavItem = { id: string; label: string };
type GroupIconId =
  | "brief"
  | "explore"
  | "artdir"
  | "website"
  | "underneath"
  | "results";
type NavGroup = { title: string; icon: GroupIconId; items: readonly NavItem[] };

/* Inline line icons for the nav groups (no icon dependency — same
 * hand-rolled SVG approach as MessaLogo). 14px, currentColor so each
 * inherits its group's slate-active / grey-idle state color. */
const ICON_PATHS: Record<GroupIconId, ReactNode> = {
  brief: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
    </>
  ),
  explore: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7l2.5 5L12 17l-2.5-5z" />
    </>
  ),
  artdir: (
    <>
      <path d="M5 19l1.5-4.5L16 5l3 3-9.5 9.5z" />
      <path d="M14 7l3 3" />
    </>
  ),
  website: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18" />
      <path d="M6.5 7h.01M9 7h.01" />
    </>
  ),
  underneath: (
    <>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </>
  ),
  results: (
    <>
      <path d="M6 21V3.5" />
      <path d="M6 4.5h11l-2.5 3.5L17 11.5H6z" />
    </>
  ),
};

const GroupIcon = ({ id }: { id: GroupIconId }) => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className="shrink-0"
  >
    {ICON_PATHS[id]}
  </svg>
);

const GROUPS: readonly NavGroup[] = [
  {
    title: "Brief",
    icon: "brief",
    items: [
      { id: "brief", label: "The brief" },
      { id: "setup", label: "The setup" },
    ],
  },
  {
    title: "Explorations",
    icon: "explore",
    items: [
      { id: "concepts", label: "Concepts" },
      { id: "pipeline-to-factory", label: "Pipeline → factory" },
      { id: "backgrounds", label: "Trying on worlds" },
    ],
  },
  {
    title: "Art direction",
    icon: "artdir",
    items: [
      { id: "creative-direction", label: "The world" },
      { id: "typography", label: "Typography" },
      { id: "color", label: "Color" },
      { id: "icons", label: "Icons" },
      { id: "illustrations", label: "Illustrations" },
      { id: "the-card", label: "The OG card" },
      { id: "ui", label: "Interface kit" },
    ],
  },
  {
    title: "The website",
    icon: "website",
    items: [
      { id: "hero", label: "The hero" },
      { id: "texture", label: "The texture" },
      { id: "motion", label: "Motion" },
      { id: "typewriter", label: "The typewriter" },
      { id: "product", label: "The product" },
    ],
  },
  {
    title: "Underneath",
    icon: "underneath",
    items: [
      // Chapter 5 is now one continuous core sample (no sub-section anchors),
      // so the nav targets the chapter itself.
      { id: "underneath", label: "The core sample" },
    ],
  },
  {
    title: "Landing it",
    icon: "results",
    items: [
      { id: "process", label: "What changed" },
      { id: "the-channel", label: "In Slack" },
    ],
  },
];

const ALL_IDS = GROUPS.flatMap((g) => g.items.map((i) => i.id));

const groupIndexOf = (sectionId: string | null): number =>
  sectionId === null
    ? -1
    : GROUPS.findIndex((g) => g.items.some((i) => i.id === sectionId));

export const StoryNav = () => {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  /* null = follow the scroll-spied group; a number = the reader's own
   * accordion choice, which wins until they pick another group. */
  const [pinnedGroup, setPinnedGroup] = useState<number | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  /* Scroll-spy: the section whose heading sits highest in the reading
   * band wins. Same observer recipe as the messa nav. */
  useEffect(() => {
    const elements = ALL_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visible.delete(entry.target.id);
          }
        }
        if (visible.size > 0) {
          let topId: string | null = null;
          let topY = Infinity;
          visible.forEach((y, id) => {
            if (y < topY) {
              topY = y;
              topId = id;
            }
          });
          setActiveId(topId);
        }
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Click-outside collapses a click-pinned rail. */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const activeGroup = groupIndexOf(activeId);
  const openGroup = pinnedGroup ?? (activeGroup === -1 ? 0 : activeGroup);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
    setOpen(false);
    setPinnedGroup(null);
  };

  /* Click a chapter title → jump to that chapter's first section, and pin the
   * group open so its sub-sections stay in reach (the rail stays up). */
  const goToGroup = (gi: number) => {
    setPinnedGroup(gi);
    document.getElementById(GROUPS[gi].items[0].id)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <nav
      ref={navRef}
      aria-label="Case study sections"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setOpen(false);
        setPinnedGroup(null);
      }}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setOpen(false);
          setPinnedGroup(null);
        }
      }}
    >
      {/* Both layers stay mounted so open/close can TRANSITION (client
       * call 2026-06-10: smoother menu). The card glides in with a
       * fade + drift; the ticks cross-fade out. motion-reduce drops
       * the movement, keeping only the fade. */}
      <div
        aria-hidden={!open || undefined}
        inert={!open || undefined}
        className={cn(
          "absolute right-0 top-1/2 w-60 origin-right -translate-y-1/2 rounded-xl border border-[#E8D9C5] bg-white/95 p-3 shadow-[0_8px_32px_rgba(70,55,35,0.10)] backdrop-blur-sm",
          "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-[opacity]",
          open
            ? "pointer-events-auto translate-x-0 scale-100 opacity-100"
            : "pointer-events-none translate-x-2 scale-[0.98] opacity-0 motion-reduce:translate-x-0 motion-reduce:scale-100",
        )}
      >
        {GROUPS.map((group, gi) => {
          const expanded = gi === openGroup;
          const containsActive = gi === activeGroup;
          return (
            <div key={group.title} className={gi > 0 ? "mt-1" : undefined}>
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => goToGroup(gi)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors duration-200",
                  containsActive
                    ? "text-[#5A6B8F]"
                    : "text-[#A3A19E] hover:text-[#6E6B68]",
                )}
              >
                <span className="flex items-center gap-2">
                  <GroupIcon id={group.icon} />
                  {group.title}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "text-[9px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    expanded ? "rotate-90" : "rotate-0",
                  )}
                >
                  ›
                </span>
              </button>
              {/* Accordion glide — the same grid-rows 0fr→1fr trick the
               * site's Underneath section uses, so opening a group
               * feels like the dig. */}
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <ul
                    aria-hidden={!expanded || undefined}
                    inert={!expanded || undefined}
                    className="mb-1 ml-2 border-l border-[#E8D9C5] pl-2"
                  >
                    {group.items.map((item) => {
                      const active = item.id === activeId;
                      return (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            aria-current={active ? "true" : undefined}
                            onClick={(e) => {
                              e.preventDefault();
                              jumpTo(item.id);
                            }}
                            className={cn(
                              "block rounded-md px-2 py-1 text-[13px] leading-6 transition-colors duration-200",
                              active
                                ? "font-medium text-[#0A0A0B]"
                                : "text-[#6E6B68] hover:bg-[#FBF0E6] hover:text-[#0A0A0B]",
                            )}
                          >
                            {item.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Open case study navigation"
        aria-hidden={open || undefined}
        inert={open || undefined}
        onClick={() => setOpen(true)}
        className={cn(
          "flex flex-col items-end gap-2 rounded-full px-2 py-3",
          "transition-opacity duration-200",
          open ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        {GROUPS.map((group, gi) => (
          <span
            key={group.title}
            aria-hidden
            className={cn(
              "block h-[2px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              gi === activeGroup ? "w-6 bg-[#5A6B8F]" : "w-3.5 bg-[#D8C9B2]",
            )}
          />
        ))}
      </button>
    </nav>
  );
};
