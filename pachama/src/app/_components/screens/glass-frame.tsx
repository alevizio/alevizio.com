import Image, { type StaticImageData } from "next/image";
import type { ReactNode, Ref } from "react";
import { cn } from "../cn";
import { BLEED } from "../shot";

/** The product the way Source's landing page shows it: edge to edge over an
 *  aerial photograph, in a frame of frosted glass, the app inside it in its
 *  dark mode. With `rise`, the frame starts above the photograph and laps
 *  over whatever sits on top of it. */
export const GlassFrame = ({
  ref,
  backdrop,
  rise = false,
  children,
  className,
  innerClassName,
}: {
  /** To the app's own box. */
  ref?: Ref<HTMLDivElement>;
  /** The photograph behind the glass. */
  backdrop: StaticImageData | string;
  rise?: boolean;
  children: ReactNode;
  className?: string;
  /** The app's own box, inside the glass. */
  innerClassName?: string;
}) => (
  <div className={cn(BLEED, "relative", rise && "z-10 -mt-16 sm:-mt-24 lg:-mt-28", className)}>
    <div aria-hidden className={cn("absolute inset-x-0 bottom-0 overflow-hidden", rise ? "top-16 sm:top-24 lg:top-28" : "top-0")}>
      <Image src={backdrop} alt="" fill sizes="100vw" quality={90} className="object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(6_22_14/0.35),rgb(6_22_14/0.05)_40%,rgb(6_22_14/0.4))]" />
    </div>
    <div className={cn("relative mx-auto max-w-[80rem] px-3 pb-10 sm:px-8 sm:pb-20 lg:pb-24", rise ? "pt-0" : "pt-10 sm:pt-20 lg:pt-24")}>
      <div className="rounded-[30px] bg-white/22 p-2 shadow-[0_40px_120px_rgb(4_18_10/0.45)] ring-1 ring-white/45 backdrop-blur-md sm:p-3">
        <div ref={ref} className={cn("overflow-hidden rounded-[22px] bg-[#0b1610] text-white", innerClassName)}>
          {children}
        </div>
      </div>
    </div>
  </div>
);
