"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "./cn";
import { MESSA_ICONS } from "./icon-set";

/**
 * The four product tabs, shown one at a time — switch with the product's own
 * tab icons (the same Tabler glyphs the live app uses) or the side arrows
 * (client direction 2026-06-16). The window is the app mockup captured with
 * the clouds and sky hidden, so it's just the UI; no frame around it.
 */
const UIS: readonly { id: string; src: string; title: string; icon: string; note: string }[] = [
  {
    id: "shortlist",
    src: "/work/messa/evolution/ui-shortlist.webp",
    title: "Shortlisting",
    icon: "filter",
    note: "Every application scored against the criteria, with reasoning.",
  },
  {
    id: "interview",
    src: "/work/messa/evolution/ui-interview.webp",
    title: "Interview Guide",
    icon: "message",
    note: "A question set built for the role, ready to run.",
  },
  {
    id: "sidekick",
    src: "/work/messa/evolution/ui-sidekick.webp",
    title: "Sidekick",
    icon: "brain",
    note: "Live prompts and follow-ups while the conversation runs.",
  },
  {
    id: "scorecard",
    src: "/work/messa/evolution/ui-scorecard.webp",
    title: "Scorecard",
    icon: "circle-check",
    note: "The verdict, drafted from the evidence in the conversation.",
  },
];

const iconPaths = (name: string): readonly string[] =>
  MESSA_ICONS.find((icon) => icon.name === name)?.paths ?? [];

const Glyph = ({ name }: { name: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className="h-4 w-4 shrink-0"
  >
    {iconPaths(name).map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

const Arrow = ({ dir }: { dir: "left" | "right" }) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {dir === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
  </svg>
);

export const ProductSwitcher = ({ className }: { className?: string }) => {
  const [i, setI] = useState(0);
  const go = (n: number) => setI((x) => (x + n + UIS.length) % UIS.length);
  const active = UIS[i];

  return (
    <div className={className}>
      <div className="relative">
        {/* No frame — just the app, on the page's cream. */}
        <div className="relative aspect-[1024/738] overflow-hidden rounded-2xl bg-[#FBF0E6]">
          {UIS.map((ui, idx) => (
            <Image
              key={ui.id}
              src={ui.src}
              alt={`The ${ui.title} view of the Messa product.`}
              width={1024}
              height={738}
              sizes="(min-width: 1024px) 1100px, 100vw"
              priority={idx === 0}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out",
                idx === i ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous view"
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8D9C5] bg-white/90 text-[#5A6B8F] shadow-[0_4px_16px_rgba(70,55,35,0.18)] backdrop-blur transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5A6B8F]"
        >
          <Arrow dir="left" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next view"
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8D9C5] bg-white/90 text-[#5A6B8F] shadow-[0_4px_16px_rgba(70,55,35,0.18)] backdrop-blur transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5A6B8F]"
        >
          <Arrow dir="right" />
        </button>
      </div>

      {/* The product's own tab icons — switch by clicking, like the live app. */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {UIS.map((ui, idx) => (
          <button
            key={ui.id}
            type="button"
            onClick={() => setI(idx)}
            aria-current={idx === i ? "true" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              idx === i
                ? "bg-[#5A6B8F] text-white"
                : "border border-[#E8D9C5] bg-white text-[#6E6B68] hover:text-[#0A0A0B]",
            )}
          >
            <Glyph name={ui.icon} />
            {ui.title}
          </button>
        ))}
      </div>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-[#6E6B68]">
        {active.note}
      </p>
    </div>
  );
};
