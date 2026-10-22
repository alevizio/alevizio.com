import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { cn } from "./cn";
import { VideoLoop } from "./video-loop";

/** One picture, statically imported (so its size is known and it fades in
 *  from a blurred placeholder), with an optional line under it. */
export const Shot = ({
  src,
  alt,
  caption,
  sizes = "(min-width: 1376px) 1296px, 100vw",
  priority = false,
  className,
  imageClassName,
}: {
  src: StaticImageData;
  alt: string;
  caption?: ReactNode;
  /** How wide it shows, for the optimiser; the default is the page width. */
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}) => (
  <figure className={className}>
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      className={cn("h-auto w-full rounded-[10px]", imageClassName)}
    />
    {caption ? <figcaption className="type-caption mt-3 text-(--tone-text)">{caption}</figcaption> : null}
  </figure>
);

/** A page too long to show whole: it scrolls inside its own frame, which
 *  takes keyboard focus so the arrow keys scroll it too. */
export const TallShot = ({
  src,
  alt,
  label,
  caption,
  sizes = "(min-width: 1376px) 1296px, 100vw",
  frameClassName,
}: {
  src: StaticImageData;
  alt: string;
  /** Names the scrolling frame for screen readers. */
  label: string;
  caption?: ReactNode;
  sizes?: string;
  frameClassName?: string;
}) => (
  <figure>
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cn("h-[80vh] max-h-[56rem] overflow-y-auto rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current", frameClassName)}
    >
      <Image src={src} alt={alt} sizes={sizes} placeholder="blur" className="h-auto w-full" />
    </div>
    {caption ? <figcaption className="type-caption mt-3 text-(--tone-text)">{caption}</figcaption> : null}
  </figure>
);

/** Sizes hints for the common columns. */
export const HALF = "(min-width: 1376px) 636px, (min-width: 640px) 50vw, 100vw";
export const THIRD = "(min-width: 1376px) 416px, (min-width: 640px) 33vw, 100vw";
export const QUARTER = "(min-width: 1376px) 306px, (min-width: 1024px) 25vw, 50vw";

/** A looping clip from public/video, with its poster beside it (name.mp4,
 *  name.jpg) and an optional line under it. */
export const Clip = ({
  name,
  label,
  aspect,
  caption,
  className,
}: {
  /** The path under /video, without the extension: "howhow/logo-l". */
  name: string;
  /** What it shows, for screen readers. */
  label: string;
  /** Its shape, as a Tailwind aspect class. */
  aspect: string;
  caption?: ReactNode;
  className?: string;
}) => (
  <figure className={className}>
    <VideoLoop
      src={`/video/${name}.mp4`}
      poster={`/video/${name}.jpg`}
      label={label}
      className={cn("block w-full rounded-[10px] bg-night object-cover", aspect)}
    />
    {caption ? <figcaption className="type-caption mt-3 text-(--tone-text)">{caption}</figcaption> : null}
  </figure>
);
