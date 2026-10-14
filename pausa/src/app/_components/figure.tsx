import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "./cn";
import { PAGE } from "./story";

export type Shot = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** A short name under the picture, set as a label. */
  label?: string;
  /** A line under it in the book's caption style. */
  caption?: ReactNode;
  /** White-paper scans: multiply them into the page so the white disappears. */
  multiply?: boolean;
};

const img = (shot: Shot) => cn("block h-auto w-full", shot.multiply && "mix-blend-multiply");

/** Label and caption under a picture, the way the book captions its plates. */
export const Caption = ({ label, caption, className }: { label?: string; caption?: ReactNode; className?: string }) =>
  label || caption ? (
    <figcaption className={cn("mt-4", className)}>
      {label ? <span className="type-label block text-pen">{label}</span> : null}
      {caption ? <span className={cn("type-secondary block text-body", label && "mt-1.5")}>{caption}</span> : null}
    </figcaption>
  ) : null;

/* A spread at full size: on desktop a little wider than the window and
 * centred with negative margins (no transform, so multiply still blends
 * with the paper), so the browser's edges crop its paper margins. On
 * phones it runs edge to edge. */
export const Spread = ({
  shot,
  priority = false,
  flush = false,
}: {
  shot: Shot;
  priority?: boolean;
  /** No space above: it opens a section, or sits straight on the one before. */
  flush?: boolean;
}) => (
  <figure className={flush ? undefined : "mt-24 sm:mt-32"}>
    <div className="lg:mx-[-3%] lg:w-[106%]">
      <Image
        src={shot.src}
        width={shot.width}
        height={shot.height}
        alt={shot.alt}
        sizes="(min-width: 1024px) 106vw, 100vw"
        priority={priority}
        className={img(shot)}
      />
    </div>
    <Caption label={shot.label} caption={shot.caption} className={PAGE} />
  </figure>
);

/** Images side by side across the page, stacking on phones. */
export const FigureRow = ({ shots }: { shots: readonly Shot[] }) => (
  <div className={cn(PAGE, "grid gap-8 md:grid-cols-2")}>
    {shots.map((shot) => (
      <figure key={shot.src}>
        <Image
          src={shot.src}
          width={shot.width}
          height={shot.height}
          alt={shot.alt}
          sizes="(min-width: 768px) 50vw, 100vw"
          className={img(shot)}
        />
        <Caption label={shot.label} caption={shot.caption} />
      </figure>
    ))}
  </div>
);

/** Sketches of different shapes on a common box so the row lines up (on phones, each at its own shape). */
export const SketchRow = ({ shots }: { shots: readonly Shot[] }) => (
  <div className={cn(PAGE, "grid gap-10 md:grid-cols-3")}>
    {shots.map((shot) => (
      <figure key={shot.src}>
        <div className="relative md:aspect-[4/5]">
          <Image
            src={shot.src}
            width={shot.width}
            height={shot.height}
            alt={shot.alt}
            sizes="(min-width: 768px) 33vw, 100vw"
            className={cn(img(shot), "md:absolute md:inset-0 md:h-full md:object-contain")}
          />
        </div>
        <Caption label={shot.label} caption={shot.caption} />
      </figure>
    ))}
  </div>
);
