"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { MdArrowBack, MdArrowForward, MdClose } from "react-icons/md";
import { cn } from "./cn";
import { PAGES, WALL_ASPECT } from "./guidelines-pages";

/* The brand guidelines' Figma page, zoomed out: every page where it sits on
 * the canvas, on the chapter's own ground. It starts at the text's left
 * edge and runs off the right of the window; drag it (or scroll) to look
 * around. Click a page (or Enter) to read it big, then move through the
 * pages in order with the arrows. The arrow keys also move between pages
 * on the wall, so it's one stop for the Tab key. Each page is its own
 * image, exported from the Figma, so they stay sharp. */
const RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf";
// A drag shorter than this is still a click.
const DRAG_PX = 5;

export const GuidelinesWall = ({ className }: { className?: string }) => {
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const dragged = useRef(false);

  // Drag to pan, with a mouse; touch and trackpads scroll natively.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    let start: { x: number; y: number; left: number; top: number } | null = null;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      start = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop };
      dragged.current = false;
    };
    const move = (e: PointerEvent) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (!dragged.current && Math.hypot(dx, dy) < DRAG_PX) return;
      if (!dragged.current) {
        dragged.current = true;
        el.setPointerCapture(e.pointerId);
        el.dataset.dragging = "";
      }
      el.scrollLeft = start.left - dx;
      el.scrollTop = start.top - dy;
    };
    const up = () => {
      start = null;
      delete el.dataset.dragging;
    };
    // After a drag, the click that ends it doesn't open a page.
    const click = (e: MouseEvent) => {
      if (!dragged.current) return;
      e.preventDefault();
      e.stopPropagation();
      dragged.current = false;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
    };
  }, []);

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
    <figure className={cn("mr-[calc(50%-50vw)]", className)}>
      <div
        ref={frame}
        role="group"
        aria-label="The brand guidelines' Figma page, every page in place"
        className="h-[min(46rem,78svh)] cursor-grab overflow-auto overscroll-x-contain [scrollbar-color:rgb(255_255_255/0.22)_transparent] [scrollbar-width:thin] data-dragging:cursor-grabbing data-dragging:select-none max-sm:h-[60svh]"
      >
        {/* Room past the last pages, so the wall doesn't end at the window's edge. */}
        <div className="w-max pr-16 pb-12">
          <div className={cn("relative w-[170rem] max-sm:w-[110rem]", WALL_ASPECT)}>
            {PAGES.map((p, i) => (
              <button
                key={p.n}
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                type="button"
                tabIndex={i === at ? 0 : -1}
                aria-label={`Page ${i + 1} of ${PAGES.length}: open it big`}
                onClick={() => show(i)}
                onFocus={() => setAt(i)}
                onKeyDown={onWallKey}
                className={cn(
                  "absolute overflow-hidden rounded-[3px] bg-white/5 transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_0_2px_var(--color-leaf),0_12px_30px_rgb(0_0_0/0.35)] focus-visible:shadow-[0_0_0_2px_var(--color-leaf)] focus-visible:outline-none",
                  p.at,
                )}
              >
                <Image src={`/brand/guidelines/${p.n}.jpg`} alt="" fill sizes="(max-width: 639px) 90px, 140px" className="pointer-events-none object-cover select-none" draggable={false} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="type-caption mt-3 max-w-[48rem] pr-6 text-(--tone-text)">
        The guidelines file as Figma lays it out, all {PAGES.length} pages. Drag or scroll to look around; click a page to read it.
      </figcaption>

      <dialog
        ref={dialog}
        aria-label={open === null ? "Brand guidelines" : `Brand guidelines, page ${open + 1} of ${PAGES.length}`}
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
        {page && open !== null ? (
          <div className="grid gap-4">
            <div className={cn("relative mx-auto max-h-[78dvh] w-full overflow-hidden rounded-[10px] bg-[#fdfbf1]", page.box, page.box === "aspect-[1920/1080]" ? "" : "max-w-[min(100%,40rem)]")}>
              <Image key={page.n} src={`/brand/guidelines/${page.n}.jpg`} alt={`Page ${open + 1} of Pachama's brand guidelines`} fill sizes="(min-width: 1600px) 1440px, 92vw" className="object-contain" />
            </div>
            <div className="flex items-center justify-between gap-4 text-fog">
              <button type="button" onClick={() => step(-1)} className={cn("inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[14px] leading-5 hover:bg-white/20", RING)}>
                <MdArrowBack aria-hidden className="size-4" />
                Previous
              </button>
              <p aria-live="polite" className="font-mono text-[13px] text-haze">
                {open + 1} of {PAGES.length}
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
