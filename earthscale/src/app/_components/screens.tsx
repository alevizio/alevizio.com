import Image, { type StaticImageData } from "next/image";
import type { ComponentType, ReactNode } from "react";
import { AutoFrame } from "./auto-frame";
import { cn } from "./cn";
import { Handset, Laptop, Monitor, Tablet } from "./devices";

/** The page at its widths, each in the device it's made for, side by side
 *  and standing on one line: a monitor for the widest, then a laptop, a
 *  tablet and a phone, each about as large against the others as its page
 *  is wide. Each scrolls its own page, down and back, out of step with the
 *  others; a still one (the phone's menu) just shows its screen. As the
 *  page scrolls they drift a little apart, the big ones lagging and the
 *  small ones leading (data-parallax). On a narrow screen the row is wider
 *  than it and moves sideways. */
export type Kind = "monitor" | "laptop" | "tablet" | "phone";

const DEVICES: Record<Kind, { Frame: ComponentType<{ className?: string; children: ReactNode }>; width: string; sizes: string; drift: string }> = {
  monitor: { Frame: Monitor, width: "w-[37%]", sizes: "(min-width: 1376px) 510px, (min-width: 768px) 38vw, 290px", drift: "-0.03" },
  laptop: { Frame: Laptop, width: "w-[27.5%]", sizes: "(min-width: 1376px) 350px, (min-width: 768px) 27vw, 200px", drift: "0.01" },
  tablet: { Frame: Tablet, width: "w-[14.5%]", sizes: "(min-width: 1376px) 190px, (min-width: 768px) 15vw, 110px", drift: "0.025" },
  phone: { Frame: Handset, width: "w-[7.6%]", sizes: "(min-width: 1376px) 100px, (min-width: 768px) 8vw, 60px", drift: "0.05" },
};
const PERIODS = [26000, 30000, 34000, 40000];
const PHASES = [0, 7000, 13000, 21000];

export const Screens = ({ screens, className }: { screens: readonly { src: StaticImageData; alt: string; label: string; kind: Kind; still?: boolean }[]; className?: string }) => (
  <div className={cn("no-scrollbar -mx-6 overflow-x-auto px-6 sm:-mx-10 sm:px-10 md:mx-0 md:overflow-visible md:px-0", className)}>
    <div data-stagger className="flex min-w-[50rem] items-end justify-between md:min-w-0">
      {screens.map(({ src, alt, label, kind, still }, i) => {
        const { Frame, width, sizes, drift } = DEVICES[kind];
        return (
          <figure key={label} data-reveal="frame" data-parallax={drift} className={width}>
            <Frame>
              {still ? (
                <Image src={src} alt={alt} sizes={sizes} placeholder="blur" className="size-full object-cover object-top" />
              ) : (
                <AutoFrame
                  label={`${label}, scrolling`}
                  period={PERIODS[i % PERIODS.length]}
                  phase={PHASES[i % PHASES.length]}
                  className="no-scrollbar h-full overflow-y-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mint"
                >
                  <Image src={src} alt={alt} sizes={sizes} placeholder="blur" className="h-auto w-full" />
                </AutoFrame>
              )}
            </Frame>
            <figcaption className="type-label mt-4 text-(--tone-text)">{label}</figcaption>
          </figure>
        );
      })}
    </div>
  </div>
);
