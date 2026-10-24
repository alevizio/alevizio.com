"use client";

import dataDisplay from "@/assets/banyan/wall/data-display.jpg";
import feedback from "@/assets/banyan/wall/feedback.jpg";
import forms from "@/assets/banyan/wall/forms.jpg";
import foundations from "@/assets/banyan/wall/foundations.jpg";
import overlay from "@/assets/banyan/wall/overlay.jpg";
import patterns from "@/assets/banyan/wall/patterns.jpg";
import Image, { type StaticImageData } from "next/image";
import { useCallback, useRef, useState } from "react";
import { MdAdd, MdRemove } from "react-icons/md";
import { cn } from "../cn";
import { useDragPan } from "../drag-pan";
import { usePinch } from "../pinch";
import { GUTTER_START } from "../slider";
import { Zoom } from "../zoom";

/* Every page of Banyan's documentation, as the Figma lays them out side by
 * side, in its six groups: one strip, its first group lined up with the
 * text, that runs to both edges of the window, so what's panned past is cut
 * by the window and not the column. Drag it (or scroll) along; zoom in
 * with − and + (or a pinch, or ctrl and the wheel), up to three times, and
 * drag around it in the same frame; click a group to see it bigger. */
const GROUPS: { id: string; label: string; image: StaticImageData; pages: string }[] = [
  { id: "foundations", label: "Foundations", image: foundations, pages: "the cover, getting started, typography, colour and background levels" },
  { id: "patterns", label: "Patterns", image: patterns, pages: "navigation, cards, graphs, accordion, stepper, breadcrumb, tabs and maps" },
  { id: "forms", label: "Forms", image: forms, pages: "button, checkbox, datepicker, file upload, icon button, input, radio, select, switch and textarea" },
  { id: "data-display", label: "Data display", image: dataDisplay, pages: "avatar, badge, divider, table and tag" },
  { id: "feedback", label: "Feedback", image: feedback, pages: "alert, banner, progress, skeleton, spinner and toast" },
  { id: "overlay", label: "Overlay", image: overlay, pages: "menu, modal, popover and tooltip" },
];

// The strip's height at each breakpoint, so every group's width follows.
const HEIGHTS = [
  { min: 1024, h: 520 },
  { min: 640, h: 400 },
  { min: 0, h: 260 },
];
// As far in as it zooms: on a desktop, the pictures at their own size.
const MAX = 3;
// Where − and + go, and how long they take to get there.
const STEPS = [1, 1.5, 2, 3];
const ZOOM_MS = 260;
const sizesFor = ({ width, height }: StaticImageData, zoom: number) =>
  HEIGHTS.map(({ min, h }) => `${min ? `(min-width: ${min}px) ` : ""}${Math.round((width / height) * h * zoom)}px`).join(", ");
const BUTTON =
  "grid size-11 place-items-center rounded-full text-bn-heavy hover:bg-black/5 disabled:opacity-35 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bn-heavy";

export const DocWall = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const zoom = useRef(1);
  const easing = useRef(0);
  const [level, setLevel] = useState(1);
  useDragPan(ref);

  /** Zooms to z, keeping the point (x, y) in the window, or the frame's
   *  middle, on the same spot of the picture nearest it. */
  const zoomTo = useCallback((z: number, x?: number, y?: number) => {
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const px = x ?? box.left + box.width / 2;
    const py = y ?? box.top + box.height / 2;
    const distance = (img: HTMLImageElement) => {
      const r = img.getBoundingClientRect();
      return Math.abs(r.left + r.width / 2 - px);
    };
    const img = [...el.querySelectorAll<HTMLImageElement>("img[data-page]")].sort((a, b) => distance(a) - distance(b))[0];
    if (!img) return;
    const was = img.getBoundingClientRect();
    zoom.current = Math.min(MAX, Math.max(1, z));
    el.style.setProperty("--z", String(zoom.current));
    const is = img.getBoundingClientRect();
    el.scrollLeft += is.left + ((px - was.left) / was.width) * is.width - px;
    el.scrollTop += is.top + ((py - was.top) / was.height) * is.height - py;
    setLevel(zoom.current);
  }, []);
  const zoomBy = useCallback((factor: number, x: number, y: number) => zoomTo(zoom.current * factor, x, y), [zoomTo]);
  usePinch(ref, zoomBy);

  // − and +: to the step below or above, eased, around the frame's middle.
  const step = (dir: 1 | -1) => {
    const from = zoom.current;
    const to = dir > 0 ? (STEPS.find((s) => s > from + 0.01) ?? MAX) : (STEPS.findLast((s) => s < from - 0.01) ?? 1);
    cancelAnimationFrame(easing.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return zoomTo(to);
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / ZOOM_MS);
      zoomTo(from + (to - from) * (1 - (1 - t) ** 3));
      if (t < 1) easing.current = requestAnimationFrame(frame);
    };
    easing.current = requestAnimationFrame(frame);
  };

  return (
    <div className={className}>
      <div role="group" aria-label="Zoom the documentation" className="mb-4 ml-auto flex w-max items-center rounded-full ring-1 ring-(--tone-line)">
        <button type="button" aria-label="Zoom out" disabled={level <= 1} onClick={() => step(-1)} className={BUTTON}>
          <MdRemove aria-hidden className="size-5" />
        </button>
        <span className="w-12 text-center font-mono text-[12px] text-bn-heavy tabular-nums">{Math.round(level * 100)}%</span>
        <button type="button" aria-label="Zoom in" disabled={level >= MAX} onClick={() => step(1)} className={BUTTON}>
          <MdAdd aria-hidden className="size-5" />
        </button>
      </div>
      {/* The frame keeps the strip's own height: zoomed in, it pans both ways inside it. */}
      <div
        ref={ref}
        role="region"
        aria-label="Banyan's documentation, every page"
        className="mx-[calc(50%-50vw)] h-[calc(260px+3rem)] cursor-grab touch-pan-x touch-pan-y overflow-auto overscroll-x-contain pb-4 no-scrollbar data-dragging:cursor-grabbing data-dragging:select-none sm:h-[calc(400px+3rem)] lg:h-[calc(520px+3rem)]"
      >
        <ol className={cn("flex w-max gap-4 pr-16 sm:gap-6", GUTTER_START)}>
          {GROUPS.map(({ id, label, image, pages }) => {
            const alt = `Banyan's ${label.toLowerCase()} pages: ${pages}`;
            return (
              <li key={id}>
                <Zoom src={image} alt={alt}>
                  {/* Zoomed in, the pictures at their full size. */}
                  <Image
                    data-page
                    src={image}
                    alt={alt}
                    sizes={sizesFor(image, level > 1 ? MAX : 1)}
                    draggable={false}
                    className="block h-[calc(var(--z,1)*260px)] w-auto rounded-[8px] select-none sm:h-[calc(var(--z,1)*400px)] lg:h-[calc(var(--z,1)*520px)]"
                  />
                </Zoom>
                <span className="mt-3 block text-[14px] leading-5 font-medium text-bn-heavy">{label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};
