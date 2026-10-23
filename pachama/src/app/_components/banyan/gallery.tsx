"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../cn";
import { DataDisplay } from "./data-display";
import { Feedback } from "./feedback";
import { Forms } from "./forms";
import { Highlights } from "./highlights";
import { Foundations } from "./foundations";
import { Media } from "./media";
import { Overlay } from "./overlay";
import { Patterns } from "./patterns";
import { Bento } from "./specimen";
import { BN } from "./ui";

/* Banyan on a contact sheet. It opens on a selection, set out and at work
 * (Highlights); a sticky row of chips swaps it for one family whole, with
 * that family's line above the sheet, or for everything at once. */
type Family = { id: string; label: string; text: string; count: number; body: ReactNode };

const FAMILIES: Family[] = [
  { id: "foundations", label: "Foundations", text: "The type scale, eight colour ramps, the gradients, the colour roles and the four background levels.", count: 5, body: <Foundations /> },
  { id: "patterns", label: "Patterns", text: "Navigation, cards, graphs, accordions, steppers, breadcrumbs and tabs: the bigger pieces, built from the smaller ones.", count: 12, body: <Patterns /> },
  { id: "forms", label: "Forms", text: "Ten controls, from the button to the date picker, in the states the Figma documents.", count: 9, body: <Forms /> },
  { id: "data-display", label: "Data display", text: "How numbers, statuses and people show up.", count: 5, body: <DataDisplay /> },
  { id: "feedback", label: "Feedback", text: "How the product answers back.", count: 5, body: <Feedback /> },
  { id: "overlay", label: "Overlay", text: "What opens on top of a page, and closes again with Escape.", count: 7, body: <Overlay /> },
  { id: "media", label: "Media", text: "Google's Material Icons, 1,310 of them in the Figma library, filtered as you type.", count: 1, body: <Media /> },
];
const ALL = FAMILIES.reduce((n, f) => n + f.count, 0);

/* Banyan's accent is one token with its ramp. Swap it for another of the
 * spectrum's ramps and every component below follows: the buttons, the
 * switches, the tags, the charts. Literal classes, for Tailwind. */
const TINTS = [
  { id: "lidar", label: "Lidar green", swatch: "bg-[#81f18e]", vars: "" },
  {
    id: "glacier",
    label: "Glacier",
    swatch: "bg-[#84e1ff]",
    vars: "[--color-bn-green:var(--color-bn-blue)] [--color-bn-green-dark:var(--color-bn-blue-dark)] [--color-bn-green-light:var(--color-bn-blue-light)] [--color-bn-green-lightest:var(--color-bn-blue-lightest)]",
  },
  {
    id: "canary",
    label: "Canary",
    swatch: "bg-[#f9e63f]",
    vars: "[--color-bn-green:var(--color-bn-yellow)] [--color-bn-green-dark:var(--color-bn-yellow-dark)] [--color-bn-green-light:var(--color-bn-yellow-light)] [--color-bn-green-lightest:var(--color-bn-yellow-lightest)]",
  },
  {
    id: "flax",
    label: "Flax",
    swatch: "bg-[#6ba6ff]",
    vars: "[--color-bn-green:var(--color-bn-indigo)] [--color-bn-green-dark:var(--color-bn-indigo-dark)] [--color-bn-green-light:var(--color-bn-indigo-light)] [--color-bn-green-lightest:var(--color-bn-indigo-lightest)]",
  },
  {
    id: "hibiscus",
    label: "Hibiscus",
    swatch: "bg-[#ee88ff]",
    vars: "[--color-bn-green:var(--color-bn-mauve)] [--color-bn-green-dark:var(--color-bn-mauve-dark)] [--color-bn-green-light:var(--color-bn-mauve-light)] [--color-bn-green-lightest:var(--color-bn-mauve-lightest)]",
  },
  {
    id: "blaze",
    label: "Blaze",
    swatch: "bg-[#ff7324]",
    vars: "[--color-bn-green:var(--color-bn-orange)] [--color-bn-green-dark:var(--color-bn-orange-dark)] [--color-bn-green-light:var(--color-bn-orange-light)] [--color-bn-green-lightest:var(--color-bn-orange-lightest)]",
  },
];

export const ComponentGallery = () => {
  const [filter, setFilter] = useState("highlights");
  const [tint, setTint] = useState(TINTS[0]);
  const ref = useRef<HTMLDivElement>(null);

  // The documentation wall links here by family (#forms, #overlay): open
  // the gallery on that family, at its top.
  useEffect(() => {
    const open = () => {
      const id = window.location.hash.slice(1);
      if (!FAMILIES.some((f) => f.id === id)) return;
      setFilter(id);
      ref.current?.scrollIntoView({ block: "start" });
    };
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  const family = FAMILIES.find((f) => f.id === filter);
  const shown = family ? [family] : FAMILIES;
  const highlights = filter === "highlights";

  const chip = (on: boolean) =>
    cn(
      "flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] leading-5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bn-heavy",
      on ? "bg-bn-heavy text-white" : "text-bn-heavy hover:bg-bn-heavy/8",
    );

  return (
    <div ref={ref} className="scroll-mt-10">
      <div className="sticky top-3 z-30 mb-6 sm:top-4">
        <div
          role="group"
          aria-label="Show components from"
          className="flex gap-1 overflow-x-auto rounded-full border border-[#e6e0cc] bg-[#fdfbf1]/85 p-1.5 shadow-[0_10px_30px_rgb(14_37_23/0.08)] backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button type="button" aria-pressed={highlights} onClick={() => setFilter("highlights")} className={chip(highlights)}>
            Highlights
          </button>
          {FAMILIES.map((f) => (
            <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)} className={chip(filter === f.id)}>
              {f.label} <span className="text-[12px] opacity-75">{f.count}</span>
            </button>
          ))}
          <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")} className={chip(filter === "all")}>
            Everything <span className="text-[12px] opacity-75">{ALL}</span>
          </button>
        </div>
      </div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <p aria-live="polite" className="type-body max-w-[40rem] text-(--tone-text)">
          {family
            ? `${family.label}: ${family.text}`
            : highlights
              ? "A selection from the library, at work: the small parts on a belt, and the controls running themselves until you reach for them. Pick a family for all of it."
              : `All ${ALL} components, live. Pick a family to narrow the sheet down.`}
        </p>
        <div role="group" aria-label="The kit's accent" className="flex items-center gap-3">
          <span className="text-[14px] leading-5 text-(--tone-text)">
            Accent: <b className="font-bold text-(--tone-head)">{tint.label}</b>
          </span>
          <span className="flex gap-1.5">
            {TINTS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={tint.id === t.id}
                aria-label={t.label}
                onClick={() => setTint(t)}
                className={cn("size-8 rounded-full ring-offset-2 ring-offset-(--bn-surface,#fdfbf1) transition-shadow", t.swatch, tint.id === t.id ? "ring-2 ring-bn-heavy" : "ring-1 ring-bn-heavy/15 hover:ring-bn-heavy/40", BN.focus)}
              />
            ))}
          </span>
        </div>
      </div>
      <Bento className={tint.vars}>
        {highlights ? <Highlights /> : shown.map((f) => <Fragment key={f.id}>{f.body}</Fragment>)}
      </Bento>
    </div>
  );
};
