import aerial from "@/assets/brand/see-carbon-aerial.jpg";
import Image from "next/image";
import { MARKS } from "./brand-marks";
import { cn } from "./cn";
import { BLEED } from "./shot";
import { PAGE } from "./story";

/* The site's hero from How&How's hand-over, "See carbon in action.",
 * rebuilt in live type over the original photograph (the wetland aerial
 * from the Website Figma, 3840 wide), so it stays sharp at any size. The
 * photo drifts slowly; the words rise in. */
const { viewBox, symbol, word } = MARKS.logo;

export const SeeCarbon = ({ className }: { className?: string }) => (
  <figure data-reveal="frame" className={cn(BLEED, className)}>
    <div className="relative isolate min-h-[34rem] overflow-hidden sm:min-h-[44rem] lg:aspect-[16/9] lg:min-h-0">
      <Image
        src={aerial}
        alt="An aerial view of a river winding through wetland forest"
        fill
        sizes="100vw"
        placeholder="blur"
        className="-z-10 object-cover saturate-[1.2] motion-safe:animate-[drift_30s_ease-in-out_infinite_alternate]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-r from-black/45 via-black/15 to-transparent" />
      <div aria-hidden className="spectrum h-1 w-full" />
      <div className={cn(PAGE, "pt-14 sm:pt-20 lg:pt-24")}>
        <svg viewBox={viewBox} role="img" aria-label="Pachama" className="h-10 w-auto sm:h-14">
          <path d={symbol} fill="#ffffff" />
          {word.map((d) => (
            <path key={d.slice(0, 24)} d={d} fill="#ffffff" />
          ))}
        </svg>
        <p data-reveal className="type-display mt-8 max-w-[11ch] text-white [--reveal-delay:0.15s]">
          See carbon in action.
        </p>
        <p data-reveal className="mt-6 max-w-[32rem] text-[18px] leading-7 text-white/90 sm:text-[22px] sm:leading-8 [--reveal-delay:0.3s]">
          Partner with Pachama to access technology and financing for your reforestation project.
        </p>
      </div>
    </div>
    <figcaption className={cn(PAGE, "type-caption mt-3 text-(--tone-text)")}>
      The site&rsquo;s hero from the hand-over, rebuilt in live type over its original photograph.
    </figcaption>
  </figure>
);
