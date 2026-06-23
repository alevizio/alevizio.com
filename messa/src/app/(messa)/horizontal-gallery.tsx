"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem, GallerySpan } from "./case-study-media";
import { cn } from "./cn";
import { InViewVideo } from "./in-view-video";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

const SPAN_WIDTH: Record<GallerySpan, string> = {
  narrow: "w-52 sm:w-60",
  default: "w-72 sm:w-96",
  wide: "w-[85vw] max-w-xl sm:max-w-2xl",
  xwide: "w-[88vw] max-w-xl sm:max-w-3xl",
};

const SPAN_SIZES: Record<GallerySpan, string> = {
  narrow: "(min-width: 640px) 240px, 208px",
  default: "(min-width: 640px) 384px, 288px",
  wide: "(min-width: 640px) 672px, 85vw",
  xwide: "(min-width: 640px) 768px, 88vw",
};

/** Gap between slides; must match the scroller's `gap-4`. */
const GAP_PX = 16;

const itemKey = (item: GalleryItem): string =>
  item.kind === "image" ? item.image.src : item.clip.src;

/** One slide: lazy image or in-view clip, caption underneath. */
const GalleryFigure = ({ item }: { item: GalleryItem }) => {
  const caption =
    item.kind === "image" ? item.image.caption : item.clip.caption;
  /* Every slide shares one fixed-aspect white card, so a strip reads
   * as a row of equal frames regardless of each source's pixel size
   * (client call 2026-06-10: screenshots the same size). Dark media is
   * additionally matted — padded well inside the card like a framed
   * specimen, so it can't read as a hole in the cream page. */
  const mat = item.kind === "image" ? item.image.mat : item.clip.mat;
  /* "bare" (matTone cream): the card takes the image's own aspect ratio with
   * the border hugging it — no 16/10 letterbox, no padding, no white. */
  const bare = item.kind === "image" && item.image.matTone === "cream";
  return (
    <figure>
      <div
        className={cn(
          "flex w-full items-center justify-center overflow-hidden rounded-xl border border-[#E8D9C5]",
          bare ? "bg-[#FBF0E6]" : "aspect-[16/10] bg-white",
          !bare && mat ? "p-5 sm:p-7" : "",
        )}
        style={
          bare && item.kind === "image"
            ? { aspectRatio: `${item.image.width} / ${item.image.height}` }
            : undefined
        }
      >
        {item.kind === "image" ? (
          <Image
            src={item.image.src}
            alt={item.image.alt}
            width={item.image.width}
            height={item.image.height}
            sizes={SPAN_SIZES[item.span ?? "default"]}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={cn(
              "h-full w-full",
              // bare cards match the image's aspect, so cover fills edge-to-edge
              // (no letterbox gap); only the white mat letterboxes.
              mat && !bare ? "rounded-md object-contain" : "object-cover",
            )}
          />
        ) : (
          <InViewVideo
            src={item.clip.src}
            poster={item.clip.poster}
            width={item.clip.width}
            height={item.clip.height}
            label={item.clip.label}
            className={cn(
              "h-full w-full",
              mat ? "rounded-md object-contain" : "object-cover",
            )}
          />
        )}
      </div>
      {caption ? (
        <figcaption className="mt-2 text-xs leading-5 text-[#6E6B68]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
};

/** Round scroll-by button, mirroring the timelapse scrubber's controls. */
const StepButton = ({
  direction,
  disabled,
  onClick,
  galleryLabel,
}: {
  direction: "backward" | "forward";
  disabled: boolean;
  onClick: () => void;
  galleryLabel: string;
}) => (
  <button
    type="button"
    aria-label={`Scroll ${galleryLabel} ${direction}`}
    disabled={disabled}
    onClick={onClick}
    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8D9C5] bg-white font-mono text-sm text-[#5A6B8F] transition-colors hover:bg-[#F0E6D8] disabled:opacity-40 disabled:hover:bg-white"
  >
    {direction === "backward" ? "←" : "→"}
  </button>
);

type HorizontalGalleryProps = {
  items: readonly GalleryItem[];
  /** Accessible name for the scrollable strip. */
  label: string;
  className?: string;
};

/**
 * A horizontally scrolling media strip. Scroll-snap underneath, mouse
 * drag-to-scroll on top, edge fades while there is more to see, scroll-by
 * buttons and arrow keys for everyone else. To screen readers and
 * keyboard users it is a plain focusable scroll region holding a list.
 */
export const HorizontalGallery = ({
  items,
  label,
  className,
}: HorizontalGalleryProps) => {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startLeft: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [canBack, setCanBack] = useState(false);
  const [canForward, setCanForward] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanBack(el.scrollLeft > 8);
    setCanForward(el.scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateEdges]);

  const scrollByAmount = (left: number) => {
    scrollerRef.current?.scrollBy({
      left,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  /** One slide's width — the arrow-key step. */
  const itemStep = (): number => {
    const first = scrollerRef.current?.querySelector("li");
    return first ? first.getBoundingClientRect().width + GAP_PX : 320;
  };

  /** Most of a viewport — the button step. */
  const pageStep = (): number =>
    (scrollerRef.current?.clientWidth ?? 640) * 0.85;

  const handlePointerDown = (event: React.PointerEvent<HTMLUListElement>) => {
    // Touch and pen already scroll natively; drag-to-scroll is for mice.
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startLeft: el.scrollLeft,
    };
    el.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLUListElement>) => {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag || !el || event.pointerId !== drag.pointerId) return;
    el.scrollLeft = drag.startLeft - (event.clientX - drag.startX);
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLUListElement>) => {
    const el = scrollerRef.current;
    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setDragging(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByAmount(itemStep());
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByAmount(-itemStep());
    } else if (event.key === "Home") {
      event.preventDefault();
      scrollByAmount(-(scrollerRef.current?.scrollLeft ?? 0));
    } else if (event.key === "End") {
      const el = scrollerRef.current;
      if (!el) return;
      event.preventDefault();
      scrollByAmount(el.scrollWidth - el.clientWidth - el.scrollLeft);
    }
  };

  return (
    <div className={className}>
      {/* Full-bleed strip: the negative inline margin stretches the
       * scroller to the viewport edges so slides CROP against the
       * browser window (no edge-fade gradients — client call
       * 2026-06-10); the matching padding + scroll-padding keep the
       * first/last slides aligned to the content column and snap
       * positions honoring the same inset. */}
      <ul
        ref={scrollerRef}
        tabIndex={0}
        aria-label={label}
        onScroll={updateEdges}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{
          marginInline: "calc(50% - 50vw)",
          paddingInline: "max(1.5rem, calc(50vw - 50%))",
          scrollPaddingInline: "max(1.5rem, calc(50vw - 50%))",
        }}
        className={cn(
          "story-scrollbar-none flex gap-4 overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5A6B8F]",
          dragging
            ? "cursor-grabbing snap-none select-none"
            : "cursor-grab snap-x snap-proximity",
        )}
      >
        {items.map((item) => (
          <li
            key={itemKey(item)}
            className={cn(
              "shrink-0 snap-start",
              SPAN_WIDTH[item.span ?? "default"],
            )}
          >
            <GalleryFigure item={item} />
          </li>
        ))}
      </ul>

      <div className="mt-3 flex justify-end gap-2">
        <StepButton
          direction="backward"
          disabled={!canBack}
          onClick={() => scrollByAmount(-pageStep())}
          galleryLabel={label}
        />
        <StepButton
          direction="forward"
          disabled={!canForward}
          onClick={() => scrollByAmount(pageStep())}
          galleryLabel={label}
        />
      </div>
    </div>
  );
};
