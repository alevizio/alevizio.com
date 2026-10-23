import Image, { type StaticImageData } from "next/image";
import type { ReactNode, Ref } from "react";
import { cn } from "../cn";
import { BLEED } from "../shot";

/** The product the way Source's landing page shows it: edge to edge over an
 *  aerial photograph, in a frame of frosted glass, the app inside it in its
 *  dark mode. */
export const GlassFrame = ({
  ref,
  backdrop,
  children,
  className,
  innerClassName,
}: {
  /** To the app's own box. */
  ref?: Ref<HTMLDivElement>;
  /** The photograph behind the glass. */
  backdrop: StaticImageData | string;
  children: ReactNode;
  className?: string;
  /** The app's own box, inside the glass. */
  innerClassName?: string;
}) => (
  <div className={cn(BLEED, "relative overflow-hidden", className)}>
    <Image src={backdrop} alt="" fill sizes="100vw" quality={90} className="object-cover" />
    <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(6_22_14/0.35),rgb(6_22_14/0.05)_40%,rgb(6_22_14/0.4))]" />
    <div className="relative mx-auto max-w-[80rem] px-3 py-10 sm:px-8 sm:py-20 lg:py-24">
      <div className="rounded-[30px] bg-white/22 p-2 shadow-[0_40px_120px_rgb(4_18_10/0.45)] ring-1 ring-white/45 backdrop-blur-md sm:p-3">
        <div ref={ref} className={cn("overflow-hidden rounded-[22px] bg-[#0b1610] text-white", innerClassName)}>
          {children}
        </div>
      </div>
    </div>
  </div>
);
