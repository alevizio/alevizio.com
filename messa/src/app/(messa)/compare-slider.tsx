"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { CaseImage } from "./case-study-media";
import { cn } from "./cn";

const clamp = (value: number): number => Math.min(100, Math.max(0, value));

type CompareSliderProps = {
  /** Base layer, visible to the right of the divider. */
  before: CaseImage;
  /** Overlay layer, revealed to the left of the divider. */
  after: CaseImage;
  /** Corner badge over the base layer. */
  beforeBadge: string;
  /** Corner badge over the overlay layer. */
  afterBadge: string;
  /** Accessible name for the slider handle. */
  label: string;
  /** `sizes` hint matching the rendered width. */
  sizes: string;
  className?: string;
};

/**
 * Two pixel-aligned images behind a draggable divider. Both layers share
 * the same capture dimensions, so the overlay is clipped — never scaled —
 * as the divider moves. Pointer drags anywhere on the media; the handle is
 * a real slider for keyboards (arrows step 1%, Shift/Page keys step 10%).
 * No animation anywhere: the reveal is entirely user-driven, so it is
 * reduced-motion safe by construction.
 */
export const CompareSlider = ({
  before,
  after,
  beforeBadge,
  afterBadge,
  label,
  sizes,
  className,
}: CompareSliderProps) => {
  const [position, setPosition] = useState(50);
  const wrapRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const positionFromX = (clientX: number, fallback: number): number => {
    const el = wrapRef.current;
    if (!el) return fallback;
    const rect = el.getBoundingClientRect();
    return clamp(((clientX - rect.left) / rect.width) * 100);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setPosition((current) => positionFromX(event.clientX, current));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    setPosition((current) => positionFromX(event.clientX, current));
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      next = position + (event.shiftKey ? 10 : 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      next = position - (event.shiftKey ? 10 : 1);
    } else if (event.key === "PageUp") {
      next = position + 10;
    } else if (event.key === "PageDown") {
      next = position - 10;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = 100;
    }
    if (next === null) return;
    event.preventDefault();
    setPosition(clamp(next));
  };

  return (
    <div
      ref={wrapRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      /* The divider position is interaction state piped to CSS, not a
       * styling decision — the same data-not-style exception BrandPalette
       * makes for its swatch colors. */
      style={{ ["--cs-pos" as string]: `${position}%` }}
      className={cn(
        // touch-pan-y: horizontal drags move the divider, vertical
        // swipes still scroll the page (the browser cancels the
        // pointer, which handlePointerEnd absorbs).
        "relative cursor-ew-resize touch-pan-y overflow-hidden rounded-xl border border-[#E8D9C5] bg-white select-none",
        className,
      )}
    >
      <Image
        src={before.src}
        alt={before.alt}
        width={before.width}
        height={before.height}
        sizes={sizes}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="block h-auto w-full"
      />
      <div className="absolute inset-0 [clip-path:inset(0_calc(100%_-_var(--cs-pos))_0_0)]">
        <Image
          src={after.src}
          alt={after.alt}
          fill
          sizes={sizes}
          loading="lazy"
          draggable={false}
          className="object-cover"
        />
      </div>

      <div
        aria-hidden
        className="absolute inset-y-0 left-[var(--cs-pos)] w-px -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}% ${afterBadge}`}
        onKeyDown={handleKeyDown}
        className="absolute top-1/2 left-[var(--cs-pos)] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[#5A6B8F] font-mono text-sm text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5A6B8F]"
      >
        ↔
      </div>

      <span
        aria-hidden
        className="absolute bottom-2 left-2 rounded-full bg-[#5A6B8F]/85 px-2 py-0.5 font-mono text-[10px] tracking-widest text-white uppercase"
      >
        {afterBadge}
      </span>
      <span
        aria-hidden
        className="absolute right-2 bottom-2 rounded-full bg-[#5A6B8F]/85 px-2 py-0.5 font-mono text-[10px] tracking-widest text-white uppercase"
      >
        {beforeBadge}
      </span>
    </div>
  );
};
