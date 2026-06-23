"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "./cn";
import {
  FRAME_HEIGHT,
  FRAME_WIDTH,
  TIMELINE_FRAMES,
} from "./timeline-frames";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

/** Autoplay cadence: roughly the rhythm of the timelapse film. */
const AUTOPLAY_INTERVAL_MS = 800;

const frameNumber = (index: number): string =>
  `${String(index + 1).padStart(2, "0")} / ${TIMELINE_FRAMES.length}`;

/**
 * Mobile: a CSS scroll-snap strip. Native horizontal scrolling is already
 * swipeable, keyboard-scrollable and reduced-motion safe — no JS needed.
 */
const TimelineStrip = ({ className }: { className?: string }) => (
  <div className={className}>
    <ul
      aria-label="Messa deploy timeline, fifteen screenshots from December 2025 to June 2026"
      className="story-scrollbar-none -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4"
    >
      {TIMELINE_FRAMES.map((frame, index) => (
        <li key={frame.src} className="w-[85vw] max-w-sm shrink-0 snap-center">
          {/* Matted frames sit on a white card so dark deploys read as
           * framed specimens on the cream page. */}
          <div
            className={cn(
              frame.mat &&
                "rounded-xl border border-[#E8D9C5] bg-white p-3 sm:p-4",
            )}
          >
            <Image
              src={frame.src}
              alt={frame.alt}
              width={FRAME_WIDTH}
              height={FRAME_HEIGHT}
              sizes="85vw"
              className={
                frame.mat
                  ? "rounded-lg"
                  : "rounded-lg border border-[#E8D9C5] bg-white"
              }
            />
          </div>
          <p className="mt-3 font-mono text-xs text-[#6E6B68]">
            {frameNumber(index)} · {frame.label}
          </p>
          <p className="mt-1 text-sm text-[#0A0A0B]">{frame.title}</p>
          <p className="mt-1 text-sm leading-6 text-[#6E6B68]">
            {frame.caption}
          </p>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * Desktop: a draggable/clickable scrubber. The stops are real tabs (roving
 * tabindex, arrow keys, Home/End); the track also accepts pointer drags.
 * All frames stay mounted and crossfade via opacity so scrubbing is instant —
 * the full strip weighs about as much as one typical hero video.
 */
export const TimelapseScrubber = ({ className }: { className?: string }) => {
  const [active, setActive] = useState(0);
  // Plays by default — it's the single deploy reel, so it runs and loops on
  // its own. Any interaction (or the Pause button) sets this false.
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const draggingRef = useRef(false);
  const baseId = useId();
  const reducedMotion = usePrefersReducedMotion();

  const count = TIMELINE_FRAMES.length;
  const frame = TIMELINE_FRAMES[active];
  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const panelId = `${baseId}-panel`;

  // Only loop while the reel is actually on screen — no cycling far off-frame.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Autoplay: advance one deploy per beat, looping; any interaction pauses.
  useEffect(() => {
    if (!playing || !inView || reducedMotion) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [playing, inView, reducedMotion, count]);

  /** Jump to a frame from user input, pausing autoplay first. */
  const interact = (next: number) => {
    setPlaying(false);
    setActive(next);
  };

  const indexFromX = (clientX: number, fallback: number): number => {
    const track = trackRef.current;
    if (!track) return fallback;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.round(ratio * (count - 1));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setPlaying(false);
    setActive((current) => indexFromX(event.clientX, current));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    setActive((current) => indexFromX(event.clientX, current));
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = Math.min(active + 1, count - 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = Math.max(active - 1, 0);
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = count - 1;
    }
    if (next === null) return;
    event.preventDefault();
    interact(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div ref={rootRef} className={className}>
      <TimelineStrip className="md:hidden" />

      <div className="hidden md:block">
        <div
          role="tabpanel"
          id={panelId}
          aria-labelledby={tabId(active)}
          tabIndex={0}
          className="relative aspect-[8/5] overflow-hidden rounded-xl border border-[#E8D9C5] bg-white"
        >
          {TIMELINE_FRAMES.map((item, index) => (
            /* Each frame crossfades as a layer; matted frames pad a
             * white card inside the panel so dark deploys read as
             * framed specimens on the cream page. */
            <div
              key={item.src}
              className={cn(
                "absolute inset-0 motion-safe:transition-opacity motion-safe:duration-300",
                index === active ? "opacity-100" : "opacity-0",
                item.mat && "bg-white p-3 sm:p-4",
              )}
            >
              <div
                className={cn(
                  "relative h-full w-full",
                  item.mat && "overflow-hidden rounded-lg",
                )}
              >
                <Image
                  src={item.src}
                  alt={index === active ? item.alt : ""}
                  fill
                  sizes="(min-width: 1024px) 976px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-start justify-between gap-6">
          <div aria-live={playing ? "off" : "polite"} className="min-h-20">
            <p className="font-mono text-xs text-[#6E6B68]">
              {frameNumber(active)} · {frame.label}
            </p>
            <p className="mt-1.5 text-[#0A0A0B]">{frame.title}</p>
            <p className="mt-1 max-w-xl text-sm leading-6 text-[#6E6B68]">
              {frame.caption}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            {!reducedMotion && (
              <button
                type="button"
                aria-pressed={playing}
                aria-label={
                  playing ? "Pause the timelapse" : "Play the timelapse"
                }
                onClick={() => setPlaying((current) => !current)}
                className="flex h-9 items-center justify-center rounded-full border border-[#E8D9C5] bg-white px-4 font-mono text-xs uppercase tracking-widest text-[#5A6B8F] transition-colors hover:bg-[#F0E6D8]"
              >
                {playing ? "Pause" : "Play"}
              </button>
            )}
            <button
              type="button"
              aria-label="Previous deploy"
              disabled={active === 0}
              onClick={() => interact(Math.max(active - 1, 0))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8D9C5] bg-white font-mono text-sm text-[#5A6B8F] transition-colors hover:bg-[#F0E6D8] disabled:opacity-40 disabled:hover:bg-white"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next deploy"
              disabled={active === count - 1}
              onClick={() => interact(Math.min(active + 1, count - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8D9C5] bg-white font-mono text-sm text-[#5A6B8F] transition-colors hover:bg-[#F0E6D8] disabled:opacity-40 disabled:hover:bg-white"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          role="tablist"
          aria-label="Deploy timeline scrubber"
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          className="relative mt-4 flex cursor-ew-resize touch-none items-center justify-between"
        >
          <span
            aria-hidden
            className="absolute inset-x-1.5 top-1/2 h-px -translate-y-1/2 bg-[#E8D9C5]"
          />
          {TIMELINE_FRAMES.map((item, index) => (
            <button
              key={item.src}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={tabId(index)}
              aria-controls={panelId}
              aria-selected={index === active}
              aria-label={`${item.label} — ${item.title}`}
              tabIndex={index === active ? 0 : -1}
              onClick={() => interact(index)}
              className="group relative z-10 px-1 py-3"
            >
              <span
                className={cn(
                  "block h-2.5 w-2.5 rounded-full border transition-colors group-hover:border-[#5A6B8F]",
                  index <= active
                    ? "border-[#5A6B8F] bg-[#5A6B8F]"
                    : "border-[#E8D9C5] bg-white",
                )}
              />
            </button>
          ))}
        </div>
        <div className="mt-1 flex justify-between font-mono text-xs text-[#6E6B68]">
          <span>Dec 2025</span>
          <span>Jun 2026</span>
        </div>
      </div>
    </div>
  );
};
