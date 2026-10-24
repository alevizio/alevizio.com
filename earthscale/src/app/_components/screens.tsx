import Image, { type StaticImageData } from "next/image";
import { cn } from "./cn";
import { AutoFrame } from "./auto-frame";

/** The page at its widths, side by side, each scrolling itself in its own
 *  frame, down and back, out of step with the others: the widest first,
 *  the phone last. The frames share one height, so the phone's page, four
 *  times as long as it is wide, reads as the long scroll it is. */
const PERIODS = [26000, 30000, 34000, 40000];
const PHASES = [0, 7000, 13000, 21000];
export const Screens = ({
  screens,
  className,
}: {
  screens: { src: StaticImageData; alt: string; label: string; sizes: string }[];
  className?: string;
}) => (
  <div data-stagger className={cn("grid gap-4 sm:gap-6", screens.length === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2", className)}>
    {screens.map(({ src, alt, label, sizes }, i) => (
      <figure key={label} data-reveal="frame">
        <AutoFrame
          label={`${label}, scrolling`}
          period={PERIODS[i % PERIODS.length]}
          phase={PHASES[i % PHASES.length]}
          className="hairline no-scrollbar h-[70vh] max-h-[48rem] overflow-y-auto rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
        >
          <Image src={src} alt={alt} sizes={sizes} placeholder="blur" className="h-auto w-full" />
        </AutoFrame>
        <figcaption className="type-label mt-3 text-(--tone-text)">{label}</figcaption>
      </figure>
    ))}
  </div>
);
