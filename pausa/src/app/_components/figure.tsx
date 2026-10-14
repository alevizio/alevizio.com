import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "./cn";

export type Shot = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Mono label above the caption, e.g. "Brand book · 16". */
  label?: string;
  caption?: ReactNode;
};

/** An image laid on the page like a printed sheet, with a mono label and caption. */
export const Figure = ({
  shot,
  sizes = "(min-width: 1152px) 1104px, 100vw",
  priority = false,
  className,
}: {
  shot: Shot;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) => (
  <figure className={className}>
    <div className="overflow-hidden rounded-[6px] bg-sheet shadow-[0_1px_0_rgba(26,26,29,0.06),0_18px_40px_-24px_rgba(26,26,29,0.35)] ring-1 ring-rule">
      <Image
        src={shot.src}
        width={shot.width}
        height={shot.height}
        alt={shot.alt}
        sizes={sizes}
        priority={priority}
        className="block h-auto w-full"
      />
    </div>
    {shot.label || shot.caption ? (
      <figcaption className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
        {shot.label ? (
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-body">
            {shot.label}
          </span>
        ) : null}
        {shot.caption ? (
          <span className="font-sans text-[0.9rem] leading-[1.55] text-body">
            {shot.caption}
          </span>
        ) : null}
      </figcaption>
    ) : null}
  </figure>
);

/** Two or three images side by side, stacking on phones. */
export const FigureRow = ({
  shots,
  className,
}: {
  shots: readonly Shot[];
  className?: string;
}) => (
  <div
    className={cn(
      "grid gap-6",
      shots.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2",
      className,
    )}
  >
    {shots.map((shot) => (
      <Figure
        key={shot.src}
        shot={shot}
        sizes={`(min-width: 768px) ${Math.round(100 / shots.length)}vw, 100vw`}
      />
    ))}
  </div>
);

/** A wide block that breaks out of the reading column to the page width. */
export const Wide = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("mx-auto mt-12 max-w-6xl px-6", className)}>{children}</div>
);

/** Sketches of different shapes, framed alike so the row reads as one set. */
export const SketchRow = ({
  shots,
  className,
}: {
  shots: readonly Shot[];
  className?: string;
}) => (
  <div className={cn("grid gap-6 md:grid-cols-3", className)}>
    {shots.map((shot) => (
      <figure key={shot.src}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-sheet ring-1 ring-rule">
          <Image
            src={shot.src}
            fill
            alt={shot.alt}
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-contain p-4"
          />
        </div>
        <figcaption className="mt-3">
          {shot.label ? (
            <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-body">{shot.label}</span>
          ) : null}
          {shot.caption ? (
            <span className="mt-1 block font-sans text-[0.9rem] leading-[1.55] text-body">{shot.caption}</span>
          ) : null}
        </figcaption>
      </figure>
    ))}
  </div>
);
