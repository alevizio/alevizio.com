import forest from "@/assets/brand/nature/forest.jpg";
import ground from "@/assets/brand/nature/ground.jpg";
import Image from "next/image";
import { MARKS } from "./brand-marks";
import { cn } from "./cn";
import { BLEED } from "./shot";
import { PAGE } from "./story";
import { TreeCloud } from "./tree-cloud";

/* The reveal deck's central slide, "We call this Nature Relations.",
 * rebuilt live and full screen: the words in live type over the deck's own
 * blurred ground (smoothed of its compression blocks), the tree as points
 * that scan in from the ground as it comes into view, in front of redwoods
 * from Pachama's photo library (the deck's forest photo only exists at
 * 1920 wide, too small for a full-screen half). The spectrum line between
 * them is sampled from the slide. */
const { viewBox, symbol } = MARKS.symbol;

export const NatureRelations = ({ className }: { className?: string }) => (
  <figure className={cn(BLEED, className)}>
    <div className="grid bg-[#0f2917] lg:grid-cols-2">
      <div className="relative overflow-hidden">
        <Image src={ground} alt="" fill quality={90} sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        <div className="relative flex h-full min-h-[30rem] flex-col p-8 text-white sm:p-12 lg:min-h-svh lg:p-16">
          <svg viewBox={viewBox} aria-hidden className="w-11 shrink-0 fill-white">
            <path d={symbol} />
          </svg>
          <p data-reveal className="mt-14 max-w-[32rem] text-[22px] leading-[1.3] sm:text-[30px]">
            Pachama wants to facilitate a new relationship between Businesses and Nature.
          </p>
          <p data-reveal className="mt-auto pt-14 font-display text-[64px] leading-[0.92] font-bold [--reveal-delay:0.2s] sm:text-[96px] xl:text-[112px]">
            We call this Nature Relations.
          </p>
        </div>
      </div>
      <div className="relative min-h-[34rem] overflow-hidden lg:min-h-0">
        <Image src={forest} alt="" fill quality={90} sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(15_41_23/0.55),rgb(15_41_23/0.3)_45%,rgb(15_41_23/0.45))]" />
        <TreeCloud className="absolute inset-0" />
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 hidden w-[3px] bg-[linear-gradient(to_bottom,#6ba8ff,#7bcdff_15%,#77e1b5_29%,#9be35f_44%,#fad33a_59%,#ff7328_73%,#f184d9_88%,#ef88ff)] lg:block"
        />
      </div>
    </div>
    <figcaption className={cn(PAGE, "type-caption mt-3 text-(--tone-text)")}>
      The central idea: a new relationship between businesses and nature. The slide rebuilt live, its lidar tree scanning in from the ground.
    </figcaption>
  </figure>
);
