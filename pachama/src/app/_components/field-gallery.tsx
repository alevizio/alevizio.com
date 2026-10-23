"use client";

import corredores41 from "@/assets/world/corredores-41.jpg";
import corredores43 from "@/assets/world/corredores-43.jpg";
import corredores45 from "@/assets/world/corredores-45.jpg";
import corredores47 from "@/assets/world/corredores-47.jpg";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useAutoplay } from "./banyan/autoplay";
import { cn } from "./cn";
import { BLEED } from "./shot";
import { PAGE } from "./story";

/* Corredores de Vida on the ground, as a gallery: one photograph across the
 * window and the others as thumbnails over its foot; pick one and it takes
 * the big frame. It moves on by itself every few seconds while it's in
 * view, holding while it's pointed at; with less motion it waits for a
 * click. Photos: Pachama. */
const PHOTOS = [
  { src: corredores41, alt: "A river between stands of forest, from the air" },
  { src: corredores45, alt: "Forest meeting pasture along a lakeshore, from the air" },
  { src: corredores43, alt: "Rows of young trees planted across dry farmland" },
  { src: corredores47, alt: "A farmstead with a tree nursery, from the air" },
];

export const FieldGallery = ({ caption, className }: { caption: string; className?: string }) => {
  const [at, setAt] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useAutoplay(
    ref,
    useCallback(() => setAt((i) => (i + 1) % PHOTOS.length), []),
    5000,
  );
  return (
    <figure className={cn(BLEED, className)}>
      <div ref={ref} className="relative aspect-[16/9] max-h-[92svh] w-full overflow-hidden bg-night">
        {PHOTOS.map((p, i) => (
          <Image
            key={p.alt}
            src={p.src}
            alt={i === at ? p.alt : ""}
            fill
            sizes="100vw"
            placeholder="blur"
            className={cn("object-cover transition-opacity duration-1000 motion-reduce:transition-none", i === at ? "opacity-100" : "opacity-0")}
          />
        ))}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/65 to-transparent" />
        <div role="group" aria-label="Corredores de Vida, the photos" className={cn(PAGE, "absolute inset-x-0 bottom-4 flex gap-2 sm:bottom-8 sm:gap-3")}>
          {PHOTOS.map((p, i) => (
            <button
              key={p.alt}
              type="button"
              aria-pressed={i === at}
              aria-label={`Show: ${p.alt}`}
              onClick={() => setAt(i)}
              className={cn(
                "relative aspect-[3/2] w-[clamp(4rem,11vw,9.5rem)] overflow-hidden rounded-[10px] shadow-[0_8px_24px_rgb(0_0_0/0.35)] ring-2 transition-[opacity,box-shadow] duration-300",
                i === at ? "ring-white" : "opacity-70 ring-white/0 hover:opacity-100",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              )}
            >
              <Image src={p.src} alt="" fill sizes="152px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
      <figcaption className={cn(PAGE, "type-caption mt-3 text-(--tone-text)")}>{caption}</figcaption>
    </figure>
  );
};
