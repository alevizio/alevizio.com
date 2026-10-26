"use client";

import Image, { type StaticImageData } from "next/image";
import { useState, type ReactNode } from "react";
import { cn } from "./cn";

/* A section of the page, taken apart: the section as the file has it, its
 * pieces marked and numbered over it, then each piece below, rebuilt and
 * moving, under the same number. A pointer on a mark lights its piece and
 * the other way round, and a mark is a link to its piece. Marks are in the
 * page's own pixels, 1440 wide, measured from the section's top. */
export type Mark = { n: number; x: number; y: number; w: number; h: number };
export type Piece = { n: number; title: string; note: string; wide?: boolean; children: ReactNode };

const PAGE_W = 1440;
const number = (n: number) => String(n).padStart(2, "0");
// Literal classes for Tailwind: the marks land one after another, once the sheet is in.
const WAVE = ["[--reveal-delay:0.5s]", "[--reveal-delay:0.62s]", "[--reveal-delay:0.74s]", "[--reveal-delay:0.86s]", "[--reveal-delay:0.98s]", "[--reveal-delay:1.1s]"];
const wave = (i: number) => WAVE[Math.min(i, WAVE.length - 1)];

export const Anatomy = ({
  id,
  sheet,
  alt,
  height,
  marks,
  pieces,
  className,
}: {
  id: string;
  sheet: StaticImageData;
  alt: string;
  /** The section's height in the page's pixels. */
  height: number;
  marks: Mark[];
  pieces: Piece[];
  className?: string;
}) => {
  const [hot, setHot] = useState<number | null>(null);
  const pieceId = (n: number) => `${id}-${number(n)}`;
  const titleOf = (n: number) => pieces.find((p) => p.n === n)?.title ?? "";
  const light = (n: number | null) => () => setHot(n);

  return (
    <div className={cn("grid gap-6 sm:gap-8", className)}>
      <figure data-reveal="lay" className="relative">
        <div className="overflow-hidden rounded-[8px] ring-1 ring-(--tone-line)">
          <Image src={sheet} alt={alt} sizes="(min-width: 1376px) 1296px, 100vw" placeholder="blur" className="h-auto w-full" />
        </div>
        <div className="absolute inset-0 max-sm:hidden">
          {marks.map(({ n, x, y, w, h }, i) => (
            <a
              key={i}
              href={`#${pieceId(n)}`}
              aria-label={`${number(n)}: ${titleOf(n)}`}
              onMouseEnter={light(n)}
              onMouseLeave={light(null)}
              onFocus={light(n)}
              onBlur={light(null)}
              className="absolute block rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
              style={{ left: `${(x / PAGE_W) * 100}%`, top: `${(y / height) * 100}%`, width: `${(w / PAGE_W) * 100}%`, height: `${(h / height) * 100}%` }}
            >
              <span data-reveal="mark" className={cn("absolute inset-0 rounded-[6px] border", hot === n ? "border-mint bg-mint/10" : "border-mint/45", wave(i))} />
              <span data-reveal="pop" className={cn("absolute -top-3 -left-3 grid size-6 place-items-center rounded-full font-mono text-[10px] leading-none text-night", hot === n ? "bg-mist" : "bg-mint", wave(i))}>
                {number(n)}
              </span>
            </a>
          ))}
        </div>
      </figure>

      <ol data-stagger className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {pieces.map(({ n, title, note, wide, children }) => (
          <li
            key={n}
            id={pieceId(n)}
            data-reveal
            onMouseEnter={light(n)}
            onMouseLeave={light(null)}
            className={cn("hairline flex scroll-mt-24 flex-col overflow-hidden rounded-[10px] bg-(--tone-fill) p-5 sm:p-6", hot === n && "ring-1 ring-mint/60", wide && "sm:col-span-2")}
          >
            <div className="flex items-center gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-mint font-mono text-[10px] leading-none text-night">{number(n)}</span>
              <p className="type-caption text-(--tone-head)">{title}</p>
            </div>
            <div className="flex min-h-40 flex-1 flex-col justify-center py-7">{children}</div>
            <p className="type-caption text-(--tone-text)">{note}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};
