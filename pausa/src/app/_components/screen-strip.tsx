import Image from "next/image";
import { cn } from "./cn";
import type { Screen } from "./media";
import { Phone } from "./phone";
import { ROW_GUTTER } from "./story";

/* Screens close to their real size (an iPhone is ~393 pt wide), in a row
 * that runs off the right edge and scrolls sideways, snapping to each one.
 * The first one lines up with the page's text column at any width. App
 * screens sit in the book's white phone; App Store slides are shown the way
 * the store shows them, as rounded cards. */

/** A phone on the page, and the image sizes that go with it. */
export const PHONE_WIDTH = "w-[74vw] max-w-[22rem] sm:w-[20rem] lg:w-[24rem] lg:max-w-none";
export const PHONE_SIZES = "(min-width: 1024px) 384px, (min-width: 640px) 320px, 74vw";

export const ScreenStrip = ({
  screens,
  label,
  framed = true,
  className,
}: {
  screens: readonly Screen[];
  label: string;
  /** In the white phone (app screens), or bare cards (App Store slides). */
  framed?: boolean;
  className?: string;
}) => (
  <ol
    aria-label={label}
    tabIndex={0}
    className={cn(
      "flex snap-x snap-mandatory gap-8 overflow-x-auto pt-2 pb-10 scrollbar-none sm:gap-10",
      "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pen",
      ROW_GUTTER,
      className,
    )}
  >
    {screens.map((screen) => (
      <li key={screen.src} className={cn(PHONE_WIDTH, "shrink-0 snap-start")}>
        {framed ? (
          <Phone src={screen.src} alt={screen.alt} sizes={PHONE_SIZES} />
        ) : (
          <Image
            src={screen.src}
            width={900}
            height={1955}
            alt={screen.alt}
            sizes={PHONE_SIZES}
            className="block h-auto w-full rounded-[7%/3.2%] ring-1 ring-rule"
          />
        )}
        {screen.label ? <p className="type-label mt-5 text-body">{screen.label}</p> : null}
      </li>
    ))}
  </ol>
);
