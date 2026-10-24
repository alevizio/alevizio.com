import Image, { type StaticImageData } from "next/image";
import { cn } from "./cn";
import { TallFrame } from "./tall-frame";

/** The page at its widths, side by side, each scrolling in its own frame:
 *  the widest first, the phone last. The frames share one height, so the
 *  phone's page, four times as long as it is wide, reads as the long scroll
 *  it is. */
export const Screens = ({
  screens,
  className,
}: {
  screens: { src: StaticImageData; alt: string; label: string; sizes: string }[];
  className?: string;
}) => (
  <div data-stagger className={cn("grid gap-4 sm:gap-6", screens.length === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2", className)}>
    {screens.map(({ src, alt, label, sizes }) => (
      <figure key={label} data-reveal="frame">
        <TallFrame
          label={`${label}, scrolling`}
          className="hairline h-[70vh] max-h-[48rem] overflow-y-auto rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
        >
          <Image src={src} alt={alt} sizes={sizes} placeholder="blur" className="h-auto w-full" />
        </TallFrame>
        <figcaption className="type-label mt-3 text-(--tone-text)">{label}</figcaption>
      </figure>
    ))}
  </div>
);
