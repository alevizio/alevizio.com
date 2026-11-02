import type { ReactNode } from "react";
import { cn } from "./cn";

/* Devices to show the page in: a monitor, a laptop, a tablet and a phone,
 * drawn in the page's dark greens with a hairline on their edges. Each is as
 * wide as its parent and measures its bezels and corners in its own width
 * (cqw), so it reads the same at any size. The screen takes the children,
 * at the aspect the device gives it. */
type Device = { className?: string; children: ReactNode };

const BODY = "bg-[#1b2120] ring-1 ring-mist/12";
const SCREEN = "relative overflow-hidden bg-night";

export const Monitor = ({ className, children }: Device) => (
  <div className={cn("@container", className)}>
    <div className={cn("rounded-[1.6cqw] p-[1.2cqw]", BODY)}>
      <div className={cn("aspect-[16/9] rounded-[0.5cqw]", SCREEN)}>{children}</div>
    </div>
    <div aria-hidden className="mx-auto h-[8cqw] w-[15cqw] bg-linear-to-b from-[#121716] to-[#262f2d]" />
    <div aria-hidden className="mx-auto h-[1.2cqw] w-[30cqw] rounded-t-[0.6cqw] rounded-b-[0.3cqw] bg-[#2b3432] ring-1 ring-mist/10" />
  </div>
);

export const Laptop = ({ className, children }: Device) => (
  <div className={cn("@container", className)}>
    <div className={cn("relative mx-[4cqw] rounded-t-[2.4cqw] p-[1.4cqw] pb-[2cqw]", BODY)}>
      <span aria-hidden className="absolute top-[0.45cqw] left-1/2 size-[0.5cqw] -translate-x-1/2 rounded-full bg-mist/15" />
      <div className={cn("aspect-[16/10] rounded-[0.4cqw]", SCREEN)}>{children}</div>
    </div>
    <div aria-hidden className="relative h-[2.2cqw] rounded-b-[1.4cqw] bg-linear-to-b from-[#3a4542] to-[#141918] shadow-[0_2cqw_4cqw_-1cqw_rgb(0_0_0/0.6)] ring-1 ring-mist/10">
      <span className="absolute top-0 left-1/2 h-[0.7cqw] w-[13cqw] -translate-x-1/2 rounded-b-[0.8cqw] bg-[#141918]" />
    </div>
  </div>
);

export const Tablet = ({ className, children }: Device) => (
  <div className={cn("@container", className)}>
    <div className={cn("rounded-[7cqw] p-[4cqw]", BODY)}>
      <div className={cn("aspect-[3/4] rounded-[3cqw]", SCREEN)}>{children}</div>
    </div>
  </div>
);

// The phone's screen opens with a status bar, its island in it, over the page.
export const Handset = ({ className, children }: Device) => (
  <div className={cn("@container", className)}>
    <div className={cn("rounded-[16cqw] p-[4.5cqw]", BODY)}>
      <div className={cn("flex aspect-[9/19.5] flex-col rounded-[12cqw]", SCREEN)}>
        <div aria-hidden className="grid h-[12cqw] shrink-0 place-items-center">
          <span className="h-[6.5cqw] w-[26cqw] rounded-full bg-black" />
        </div>
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  </div>
);
