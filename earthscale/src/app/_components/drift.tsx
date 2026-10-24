import Image, { type StaticImageData } from "next/image";
import { cn } from "./cn";
import { Zoom } from "./zoom";

/* A picture that keeps moving: a little larger than its frame, it drifts
 * slowly across it and back, each in its own direction and at its own
 * pace, and comes closer under the pointer. A click opens it big. */
const DRIFTS = [
  "[--drift-x:-4%] [--drift-y:-3%] motion-safe:animate-[es-drift_38s_ease-in-out_infinite_alternate]",
  "[--drift-x:3%] [--drift-y:-4%] motion-safe:animate-[es-drift_44s_ease-in-out_infinite_alternate]",
  "[--drift-x:-3%] [--drift-y:3%] motion-safe:animate-[es-drift_36s_ease-in-out_infinite_alternate]",
  "[--drift-x:4%] [--drift-y:2%] motion-safe:animate-[es-drift_48s_ease-in-out_infinite_alternate]",
  "[--drift-x:-4%] [--drift-y:1%] motion-safe:animate-[es-drift_40s_ease-in-out_infinite_alternate]",
  "[--drift-x:2%] [--drift-y:4%] motion-safe:animate-[es-drift_46s_ease-in-out_infinite_alternate]",
];

export const Drift = ({ src, alt, index, sizes, aspect = "aspect-[16/10]", className }: { src: StaticImageData; alt: string; index: number; sizes: string; aspect?: string; className?: string }) => (
  <figure data-reveal="frame" className={cn("group/drift", className)}>
    <Zoom src={src} alt={alt}>
      <span className={cn("block overflow-hidden rounded-[10px] bg-night", aspect)}>
        <Image
          src={src}
          alt={alt}
          sizes={sizes}
          placeholder="blur"
          className={cn("h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/drift:[transform:scale(1.08)]", DRIFTS[index % DRIFTS.length])}
        />
      </span>
    </Zoom>
  </figure>
);
