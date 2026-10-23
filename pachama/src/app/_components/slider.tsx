"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { cn } from "./cn";

type Slide = { src: StaticImageData; alt: string };

/** Pictures in a row that scrolls sideways: one in view, the next peeking
 *  in. It snaps to each picture; the buttons step through, and the row also
 *  scrolls with a trackpad, a swipe, or the arrow keys once it has focus. */
export const Slider = ({
  label,
  slides,
  sizes,
  className,
}: {
  /** Names the row for screen readers. */
  label: string;
  slides: readonly Slide[];
  sizes: string;
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

  const button = "grid size-11 place-items-center rounded-full border border-(--tone-line) text-(--tone-head) transition-colors hover:bg-(--tone-fill) disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

  return (
    <div className={className}>
      <div
        ref={track}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain rounded-[10px] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current sm:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {slides.map(({ src, alt }, i) => (
          <figure key={alt} aria-label={`${i + 1} of ${slides.length}`} className="w-[86%] shrink-0 snap-start sm:w-[72%] lg:w-[64%]">
            <Image src={src} alt={alt} sizes={sizes} placeholder="blur" className="h-auto w-full rounded-[10px]" />
          </figure>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button type="button" aria-label="Previous" disabled={at === 0} onClick={() => go(at - 1)} className={button}>
          <MdArrowBack aria-hidden className="size-5" />
        </button>
        <button type="button" aria-label="Next" disabled={at === slides.length - 1} onClick={() => go(at + 1)} className={button}>
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
