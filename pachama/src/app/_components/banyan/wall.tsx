import dataDisplay from "@/assets/banyan/wall/data-display.jpg";
import feedback from "@/assets/banyan/wall/feedback.jpg";
import forms from "@/assets/banyan/wall/forms.jpg";
import foundations from "@/assets/banyan/wall/foundations.jpg";
import overlay from "@/assets/banyan/wall/overlay.jpg";
import patterns from "@/assets/banyan/wall/patterns.jpg";
import Image, { type StaticImageData } from "next/image";
import { cn } from "../cn";
import { BN } from "./ui";

/* Every page of Banyan's documentation, as the Figma lays them out side by
 * side, in its six groups. Each group opens the gallery below on its family. */
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

export const DocWall = ({ className }: { className?: string }) => (
  <div role="region" aria-label="Banyan's documentation, every page" className={cn("overflow-x-auto rounded-[16px] border border-bn-grey-light bg-bn-eggshell p-4 sm:p-6", className)}>
    <ol className="flex w-max gap-4 sm:gap-6">
      {GROUPS.map(({ id, label, image, pages }) => (
        <li key={id}>
          <a href={`#${id}`} className={cn("group block rounded-[8px]", BN.focus)}>
            <Image
              src={image}
              alt={`Banyan's ${label.toLowerCase()} pages: ${pages}`}
              sizes={sizesFor(image)}
              className="h-[260px] w-auto rounded-[8px] sm:h-[400px] lg:h-[520px]"
            />
            <span className="mt-3 block text-[14px] font-medium text-bn-heavy underline-offset-4 group-hover:underline">{label}</span>
          </a>
        </li>
      ))}
    </ol>
  </div>
);
