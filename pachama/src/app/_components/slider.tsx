"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { cn } from "./cn";

type Slide = { src: StaticImageData; alt: string };

/** The round arrow button that steps a row (or a book) along. */
export const ARROW =
  "grid size-11 place-items-center rounded-full border border-(--tone-line) text-(--tone-head) transition-colors hover:bg-(--tone-fill) disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

// The page's gutter, from the window's edge to the text (PAGE: 86rem wide,
// padded 1.5rem, 2.5rem from sm). The snap needs it in window terms: a
// percentage in scroll-padding resolves against the scroller itself.
const GUTTER =
  "px-[max(1.5rem,calc(50vw-43rem+1.5rem))] scroll-px-[max(1.5rem,calc(50vw-43rem+1.5rem))] sm:px-[max(2.5rem,calc(50vw-43rem+2.5rem))] sm:scroll-px-[max(2.5rem,calc(50vw-43rem+2.5rem))]";

/** Pictures in a row that scrolls sideways: one in view, the next peeking
 *  in. It snaps to each picture; the buttons step through, and the row also
 *  scrolls with a trackpad, a swipe, or the arrow keys once it has focus.
 *  The row runs to both edges of the window, cropped by the browser, while
 *  its first picture (and every snap) lines up with the page's text. */
export const Slider = ({
  label,
  slides,
  sizes,
  item = "w-[86%] sm:w-[72%] lg:w-[64%]",
  image = "h-auto w-full",
  className,
}: {
  /** Names the row for screen readers. */
  label: string;
  slides: readonly Slide[];
  sizes: string;
  /** Each picture's width in the row: one in view and the next peeking, by default. */
  item?: string;
  /** How the picture fills its place: full width by default; for pictures
   *  of mixed shapes, a fixed height on the item and "h-full w-auto" here. */
  image?: string;
  className?: string;
}) => {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);

  // Which slide is in front: the end of the row counts as the last one,
  // which can't snap flush left.
  useEffect(() => {
    const row = track.current;
    if (!row) return;
    const onScroll = () => {
      const items = [...row.children] as HTMLElement[];
      if (row.scrollLeft >= row.scrollWidth - row.clientWidth - 2) {
        setAt(items.length - 1);
        return;
      }
      const offsets = items.map((item) => Math.abs(item.offsetLeft - items[0].offsetLeft - row.scrollLeft));
      setAt(offsets.indexOf(Math.min(...offsets)));
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => row.removeEventListener("scroll", onScroll);
  }, []);

  const go = (index: number) => {
    const row = track.current;
    const items = row ? ([...row.children] as HTMLElement[]) : [];
    const target = items[Math.max(0, Math.min(items.length - 1, index))];
    if (!row || !target) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollTo({ left: target.offsetLeft - items[0].offsetLeft, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <div className={className}>
      <div
        ref={track}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={cn(
          "mx-[calc(50%-50vw)] flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current sm:gap-6 [&::-webkit-scrollbar]:hidden",
          GUTTER,
        )}
      >
        {slides.map(({ src, alt }, i) => (
          <figure key={alt} aria-label={`${i + 1} of ${slides.length}`} className={cn("shrink-0 snap-start", item)}>
            <Image src={src} alt={alt} sizes={sizes} placeholder="blur" className={cn("rounded-[10px]", image)} />
          </figure>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button type="button" aria-label="Previous" disabled={at === 0} onClick={() => go(at - 1)} className={ARROW}>
          <MdArrowBack aria-hidden className="size-5" />
        </button>
        <button type="button" aria-label="Next" disabled={at === slides.length - 1} onClick={() => go(at + 1)} className={ARROW}>
          <MdArrowForward aria-hidden className="size-5" />
        </button>
        <span aria-hidden className="ml-3 flex items-center gap-2">
          {slides.map(({ alt }, i) => (
            <span key={alt} className={cn("h-1 rounded-full transition-all duration-500", i === at ? "w-8 bg-(--tone-head)" : "w-3 bg-(--tone-line)")} />
          ))}
        </span>
        <p aria-live="polite" className="type-label ml-auto text-(--tone-text)">
          {at + 1} / {slides.length}
        </p>
      </div>
    </div>
  );
};
