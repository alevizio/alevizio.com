import Image from "next/image";
import { cn } from "./cn";
import type { Shot } from "./figure";
import { FEED } from "./media";
import { Phone } from "./phone";
import { PHONE_SIZES, PHONE_WIDTH } from "./screen-strip";
import { PAGE, ROW_GUTTER } from "./story";

/* The feed the way the brand book lays it out (p. 32): every format on one
 * line, standing on the same baseline, sized off one unit (--u) so the row
 * reads as a set: the story, the square and the display ad a unit wide,
 * the landscape as tall as the display ad (1.78 units). Paper-coloured ads get the
 * book's hairline edge; the blue one needs none. On narrow screens the row
 * scrolls sideways instead of shrinking; at 1440 the whole row fits the
 * text column. Below it, the chat and the story as they arrive, in the
 * book's white phone. */
type Ad = { shot: Shot; width: string; edge: boolean };

const ADS: readonly Ad[] = [
  { shot: FEED.story, width: "w-[var(--u)]", edge: true },
  { shot: FEED.square, width: "w-[var(--u)]", edge: false },
  { shot: FEED.display, width: "w-[var(--u)]", edge: true },
  { shot: FEED.landscape, width: "w-[calc(var(--u)*1.78)]", edge: true },
];

export const FeedBoard = () => (
  <>
    <ul
      aria-label="The ads, in every format"
      tabIndex={0}
      className={cn(
        "flex snap-x snap-mandatory items-end gap-10 overflow-x-auto pt-2 pb-8 scrollbar-none [--u:13rem] lg:[--u:15.25rem]",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pen",
        ROW_GUTTER,
      )}
    >
      {ADS.map(({ shot, width, edge }) => (
        <li key={shot.src} className={cn("shrink-0 snap-start", width)}>
          <Image
            src={shot.src}
            width={shot.width}
            height={shot.height}
            alt={shot.alt}
            sizes="(min-width: 1024px) 400px, 340px"
            className={cn("block h-auto w-full", edge && "ring-1 ring-black/10")}
          />
        </li>
      ))}
    </ul>
    <div className={cn(PAGE, "mt-20 flex flex-wrap gap-10 sm:mt-28")}>
      {[
        { shot: FEED.whatsapp, label: "On WhatsApp" },
        { shot: FEED.igStory, label: "In an Instagram story" },
      ].map(({ shot, label }) => (
        <figure key={shot.src} className={PHONE_WIDTH}>
          <Phone src={shot.src} alt={shot.alt} sizes={PHONE_SIZES} />
          <figcaption className="type-label mt-5 text-body">{label}</figcaption>
        </figure>
      ))}
    </div>
  </>
);
