"use client";

import wall from "@/assets/brand/guidelines-wall.jpg";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { MdArrowBack, MdArrowForward, MdClose } from "react-icons/md";
import { cn } from "./cn";
import { PAGES, WALL_ASPECT } from "./guidelines-pages";
import { BLEED } from "./shot";
import { PAGE } from "./story";

/* The brand guidelines' Figma page, zoomed right out: all of it at once on
 * Figma's grey canvas, every page where it sits with its number over it,
 * the way the file looks from above. Point at a page and it's selected,
 * Figma blue; click it (or Enter) to read it big, then move through the
 * pages in order with the arrows. One picture for the wall, one per page
 * for the big view, both exported from the Figma. The arrow keys move
 * between pages on the wall, so it's one stop for the Tab key. On a phone
 * the wall scrolls sideways. */
const RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf";
const FIGMA_BLUE = "ring-[#0d99ff]";

export const GuidelinesWall = ({ className }: { className?: string }) => {
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const show = (i: number) => {
    setOpen(i);
    setAt(i);
    if (!dialog.current?.open) dialog.current?.showModal();
  };
  const step = (by: number) => {
    if (open === null) return;
    show((open + by + PAGES.length) % PAGES.length);
  };
  // On the wall: the arrows walk the pages in order.
  const onWallKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const to = { ArrowRight: at + 1, ArrowDown: at + 1, ArrowLeft: at - 1, ArrowUp: at - 1, Home: 0, End: PAGES.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    const i = (to + PAGES.length) % PAGES.length;
    setAt(i);
    buttons.current[i]?.focus();
  };
  const page = open === null ? null : PAGES[open];

  return (
    <figure className={cn(BLEED, className)}>
      <div className="overflow-x-auto bg-[#eff1f0] [scrollbar-width:thin]">
        <div role="group" aria-label="The brand guidelines' Figma page, every page in place" className={cn("@container relative mx-auto w-full min-w-[60rem] max-w-[120rem]", WALL_ASPECT)}>
          <Image src={wall} alt="" fill sizes="(min-width: 1920px) 1920px, max(100vw, 60rem)" quality={90} className="object-cover" />
          {PAGES.map((p, i) => (
            <button
              key={p.n}
              ref={(el) => {
                buttons.current[i] = el;
              }}
              type="button"
              tabIndex={i === at ? 0 : -1}
              aria-label={`Page ${p.n}: open it big`}
              onClick={() => show(i)}
              onFocus={() => setAt(i)}
              onKeyDown={onWallKey}
              className={cn("group/page absolute transition-shadow duration-150 hover:ring-2 focus-visible:ring-2 focus-visible:outline-none", FIGMA_BLUE, p.at)}
            >
              <span aria-hidden className="absolute bottom-full left-0 mb-[0.25cqw] text-[max(9px,0.8cqw)] leading-none text-[#9aa29e] group-hover/page:text-[#0d99ff] group-focus-visible/page:text-[#0d99ff]">
                {p.n}
              </span>
            </button>
          ))}
        </div>
      </div>
      <figcaption className={cn(PAGE, "type-caption mt-3 text-(--tone-text)")}>
        The guidelines file as Figma has it, all {PAGES.length} pages. Click a page to read it.
      </figcaption>

      <dialog
        ref={dialog}
        aria-label={page ? `Brand guidelines, page ${page.n}` : "Brand guidelines"}
        onClose={() => {
          setOpen(null);
          buttons.current[at]?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-auto w-[min(92vw,90rem)] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm open:motion-safe:animate-[zoom-open_0.35s_var(--ease-arrive)]"
      >
        {page ? (
          <div className="grid gap-4">
            <div className={cn("relative mx-auto max-h-[78dvh] w-full overflow-hidden rounded-[10px] bg-[#fdfbf1]", page.box, page.box === "aspect-[1920/1080]" ? "" : "max-w-[min(100%,40rem)]")}>
              <Image key={page.n} src={`/brand/guidelines/${page.n}.jpg`} alt={`Page ${page.n} of Pachama's brand guidelines`} fill sizes="(min-width: 1600px) 1440px, 92vw" className="object-contain" />
            </div>
            <div className="flex items-center justify-between gap-4 text-fog">
              <button type="button" onClick={() => step(-1)} className={cn("inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[14px] leading-5 hover:bg-white/20", RING)}>
                <MdArrowBack aria-hidden className="size-4" />
                Previous
              </button>
              <p aria-live="polite" className="font-mono text-[13px] text-haze">
                Page {page.n} <span aria-hidden>·</span> {open !== null ? open + 1 : 0} of {PAGES.length}
              </p>
              <button type="button" onClick={() => step(1)} className={cn("inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[14px] leading-5 hover:bg-white/20", RING)}>
                Next
                <MdArrowForward aria-hidden className="size-4" />
              </button>
            </div>
          </div>
        ) : null}
        <button
          type="button"
          aria-label="Close"
          onClick={() => dialog.current?.close()}
          className={cn("fixed top-4 right-4 grid size-11 place-items-center rounded-full bg-white text-ink shadow-lg", RING)}
        >
          <MdClose aria-hidden className="size-6" />
        </button>
      </dialog>
    </figure>
  );
};
