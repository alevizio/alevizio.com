"use client";

import dataDisplay from "@/assets/banyan/wall/data-display.jpg";
import feedback from "@/assets/banyan/wall/feedback.jpg";
import forms from "@/assets/banyan/wall/forms.jpg";
import foundations from "@/assets/banyan/wall/foundations.jpg";
import overlay from "@/assets/banyan/wall/overlay.jpg";
import patterns from "@/assets/banyan/wall/patterns.jpg";
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import { cn } from "../cn";
import { useDragPan } from "../drag-pan";
import { Zoom } from "../zoom";

/* Every page of Banyan's documentation, as the Figma lays them out side by
 * side, in its six groups: one strip that starts at the text's edge and
 * runs off the right of the window. Drag it (or scroll) along; click a
 * group to see it bigger. */
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
const sizesFor = ({ width, height }: StaticImageData) =>
  HEIGHTS.map(({ min, h }) => `${min ? `(min-width: ${min}px) ` : ""}${Math.round((width / height) * h)}px`).join(", ");

export const DocWall = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useDragPan(ref);
  return (
    <div
      ref={ref}
      role="region"
      aria-label="Banyan's documentation, every page"
      className={cn(
        "mr-[calc(50%-50vw)] cursor-grab overflow-x-auto overscroll-x-contain pb-4 [scrollbar-color:rgb(14_37_23/0.25)_transparent] [scrollbar-width:thin] data-dragging:cursor-grabbing data-dragging:select-none",
        className,
      )}
    >
      <ol className="flex w-max gap-4 pr-16 sm:gap-6">
        {GROUPS.map(({ id, label, image, pages }) => {
          const alt = `Banyan's ${label.toLowerCase()} pages: ${pages}`;
          return (
            <li key={id}>
              <Zoom src={image} alt={alt}>
                <Image src={image} alt={alt} sizes={sizesFor(image)} draggable={false} className="h-[260px] w-auto rounded-[8px] select-none sm:h-[400px] lg:h-[520px]" />
              </Zoom>
              <span className="mt-3 block text-[14px] font-medium text-bn-heavy">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
