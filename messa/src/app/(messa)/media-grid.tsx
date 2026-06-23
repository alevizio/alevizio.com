import Image from "next/image";
import type { CaseImage } from "./case-study-media";
import { cn } from "./cn";

type MediaGridProps = {
  images: readonly CaseImage[];
  /** Grid column classes, e.g. "grid-cols-1 sm:grid-cols-3". */
  columnsClassName: string;
  /** `sizes` hint matching the grid's rendered width. */
  sizes: string;
  className?: string;
};

/**
 * A dense figure grid. Every image is lazy and async-decoded — all grids on
 * this page live below the fold. Figures sit as white cards on the cream
 * world.
 */
export const MediaGrid = ({
  images,
  columnsClassName,
  sizes,
  className,
}: MediaGridProps) => (
  <ul className={cn("grid gap-x-4 gap-y-8", columnsClassName, className)}>
    {images.map((image) => (
      <li key={image.src}>
        <figure>
          {/* Matted images sit on a white card so dark frames read as
           * framed specimens on the cream page. */}
          <div
            className={cn(
              image.mat &&
                "rounded-xl border border-[#E8D9C5] bg-white p-3 sm:p-4",
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes={sizes}
              loading="lazy"
              decoding="async"
              className={
                image.mat
                  ? "rounded-lg"
                  : "rounded-lg border border-[#E8D9C5] bg-white"
              }
            />
          </div>
          {image.caption ? (
            <figcaption className="mt-2 text-xs leading-5 text-[#6E6B68]">
              {image.caption}
            </figcaption>
          ) : null}
        </figure>
      </li>
    ))}
  </ul>
);
