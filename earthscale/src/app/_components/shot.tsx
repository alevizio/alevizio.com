import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { cn } from "./cn";
import { PAGE } from "./story";
import { TallFrame } from "./tall-frame";
import { VideoLoop } from "./video-loop";
import { Zoom } from "./zoom";

/** One picture, statically imported (so its size is known and it fades in
 *  from a blurred placeholder), with an optional line under it. It opens
 *  upward as it scrolls into view (data-reveal="frame"); with zoom, a
 *  click shows it bigger. */
export const Shot = ({
  src,
  alt,
  caption,
  sizes = "(min-width: 1376px) 1296px, 100vw",
  priority = false,
  zoom = false,
  bleed = false,
  className,
  imageClassName,
}: {
  src: StaticImageData;
  alt: string;
  caption?: ReactNode;
  /** How wide it shows, for the optimiser; the default is the page width. */
  sizes?: string;
  priority?: boolean;
  /** A click opens it bigger. */
  zoom?: boolean;
  /** Edge to edge across the window, unboxed; the caption stays on the page. */
  bleed?: boolean;
  className?: string;
  imageClassName?: string;
}) => {
  const image = (
    <Image
      src={src}
      alt={alt}
      sizes={bleed ? "100vw" : sizes}
      priority={priority}
      placeholder="blur"
      className={cn("h-auto w-full", bleed ? "rounded-none" : "rounded-[10px]", imageClassName)}
    />
  );
  return (
    <figure data-reveal="frame" className={cn(bleed && BLEED, className)}>
      {zoom ? (
        <Zoom src={src} alt={alt}>
          {image}
        </Zoom>
      ) : (
        image
      )}
      {caption ? <figcaption className={cn("type-caption mt-3 text-(--tone-text)", bleed && PAGE)}>{caption}</figcaption> : null}
    </figure>
  );
};

/** Out of the page's column to the window's edges. Margins, not a
 *  transform, so it doesn't fight the reveal's translate. */
export const BLEED = "mx-[calc(50%-50vw)]";

/** A page too long to show whole: it scrolls inside its own frame, which
 *  takes keyboard focus so the arrow keys scroll it too, and dips once to
 *  show there's more (TallFrame). */
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
  <figure data-reveal="frame">
    <TallFrame
      label={label}
      className={cn("h-[80vh] max-h-[56rem] overflow-y-auto rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current", frameClassName)}
    >
      <Image src={src} alt={alt} sizes={sizes} placeholder="blur" className="h-auto w-full" />
    </TallFrame>
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
  bleed = false,
  className,
}: {
  /** The path under /video, without the extension: "howhow/logo-l". */
  name: string;
  /** What it shows, for screen readers. */
  label: string;
  /** Its shape, as a Tailwind aspect class. */
  aspect: string;
  caption?: ReactNode;
  /** Edge to edge across the window, unboxed; the caption stays on the page. */
  bleed?: boolean;
  className?: string;
}) => (
  <figure data-reveal="frame" className={cn(bleed && BLEED, className)}>
    <VideoLoop
      src={`/video/${name}.mp4`}
      poster={`/video/${name}.jpg`}
      label={label}
      className={cn("block w-full bg-night object-cover", bleed ? "rounded-none" : "rounded-[10px]", aspect)}
    />
    {caption ? <figcaption className={cn("type-caption mt-3 text-(--tone-text)", bleed && PAGE)}>{caption}</figcaption> : null}
  </figure>
);

/** Pictures of mixed shapes packed into columns, each at its own height:
 *  native masonry where the browser has it, CSS columns everywhere else. */
export const Masonry = ({ children, cols = 3, className }: { children: ReactNode; cols?: 2 | 3; className?: string }) => (
  <div
    data-stagger
    className={cn(
      "gap-4 sm:gap-6 [&>*]:mb-4 [&>*]:break-inside-avoid sm:[&>*]:mb-6",
      cols === 2 ? "sm:columns-2" : "sm:columns-2 lg:columns-3",
      "supports-[grid-template-rows:masonry]:grid supports-[grid-template-rows:masonry]:columns-auto supports-[grid-template-rows:masonry]:[grid-template-rows:masonry] supports-[grid-template-rows:masonry]:[&>*]:mb-0",
      cols === 2 ? "supports-[grid-template-rows:masonry]:sm:grid-cols-2" : "supports-[grid-template-rows:masonry]:sm:grid-cols-2 supports-[grid-template-rows:masonry]:lg:grid-cols-3",
      className,
    )}
  >
    {children}
  </div>
);
