import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { cn } from "./cn";

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

/** Sizes hints for the common columns. */
export const HALF = "(min-width: 1376px) 636px, (min-width: 640px) 50vw, 100vw";
export const THIRD = "(min-width: 1376px) 416px, (min-width: 640px) 33vw, 100vw";
export const QUARTER = "(min-width: 1376px) 306px, (min-width: 1024px) 25vw, 50vw";
