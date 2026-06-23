"use client";

/* eslint-disable @next/next/no-img-element -- the still full-page preview
 * is a raw <img> (the animated hero video overlays its hero region at the
 * same width); the sidebar thumbnails use next/image. */

import Image from "next/image";
import { useState } from "react";
import { cn } from "./cn";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

/* The April style matrix, rebuilt (client call 2026-06-12). A sidebar of
 * painted worlds drives a browser-framed preview of the WHOLE recovered
 * /pipeline landing page, held still — only the hero pipeline animates.
 * The page is one static capture (background carried from hero to footer);
 * a short clip of the flat pipeline for that world overlays the hero
 * region (captured at the same width, so the seam is invisible and the
 * still page shows through until it plays). No auto-cycle, no scroll —
 * the reader picks a world from the rail. */

type World = { id: string; label: string };

const WORLDS: readonly World[] = [
  { id: "none", label: "Default" },
  { id: "watercolor", label: "Watercolor" },
  { id: "pastel", label: "Pastel" },
  { id: "oleo", label: "Oleo" },
  { id: "ink-wash", label: "Ink & Wash" },
  { id: "gouache", label: "Gouache" },
  { id: "impressionism", label: "Impressionism" },
];

const STYLES = "/work/messa/styles";
// asset version — bump when re-capturing so browsers don't serve a stale
// same-named webp/mp4 from cache (the 2x crisp recapture, 2026-06-12).
const V = "?v=4";

export const PipelineWorlds = ({ className }: { className?: string }) => {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();
  const world = WORLDS[active];

  return (
    <figure className={className}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        {/* Sidebar — the painted worlds (sticky; horizontal on mobile). */}
        <div
          role="group"
          aria-label="Background world"
          className="flex shrink-0 gap-2 overflow-x-auto pb-1 sm:sticky sm:top-24 sm:w-44 sm:flex-col sm:overflow-visible sm:pb-0"
        >
          {WORLDS.map((w, i) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg border p-1.5 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5A6B8F] sm:w-full",
                i === active
                  ? "border-[#5A6B8F] bg-[#5A6B8F]/5"
                  : "border-[#E8D9C5] bg-white hover:border-[#5A6B8F]/50",
              )}
            >
              <Image
                src={`${STYLES}/style-detail-${w.id}.webp`}
                alt=""
                width={240}
                height={150}
                className="aspect-[16/10] w-16 shrink-0 rounded object-cover sm:w-14"
              />
              <span
                className={cn(
                  "whitespace-nowrap text-[13px] font-medium",
                  i === active ? "text-[#0A0A0B]" : "text-[#6E6B68]",
                )}
              >
                {w.label}
              </span>
            </button>
          ))}
        </div>

        {/* The preview — the whole page held still, hero pipeline animated. */}
        <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-xl border border-[#E8D9C5] bg-white shadow-[0_8px_32px_rgba(70,55,35,0.08)]">
            <div className="flex items-center gap-1.5 border-b border-[#E8D9C5] bg-[#FBF0E6] px-3 py-2">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#E8D9C5]" />
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#E8D9C5]" />
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#E8D9C5]" />
              <span className="ml-2 font-mono text-[10px] tracking-wide text-[#A3A19E]">
                messa.ai/pipeline
              </span>
            </div>
            <div className="relative bg-white">
              {/* The whole page, still. */}
              <img
                src={`${STYLES}/page-${world.id}.webp${V}`}
                alt={`The whole Messa landing page in the ${world.label} world.`}
                className="block w-full"
              />
              {/* The only motion: the flat pipeline, over the hero region.
               * Same capture width as the page, so it lands exactly on the
               * static hero; the page shows through until it plays. */}
              <video
                key={world.id}
                src={`${STYLES}/hero-${world.id}.mp4${V}`}
                autoPlay={!reduced}
                loop
                muted
                playsInline
                className="absolute inset-x-0 top-0 w-full"
              />
            </div>
          </div>
          <figcaption className="mt-3 text-sm leading-6 text-[#6E6B68]">
            The whole page, held still — only the hero pipeline moves. One
            switch carried the painted background from hero to footer; pick a
            world from the rail.
          </figcaption>
        </div>
      </div>
    </figure>
  );
};
