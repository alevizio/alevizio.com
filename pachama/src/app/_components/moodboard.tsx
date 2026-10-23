import beetle from "@/assets/brand/mood/beetle.jpg";
import begonia from "@/assets/brand/mood/begonia.jpg";
import canopyHeight from "@/assets/brand/mood/canopy-height.jpg";
import hummingbird from "@/assets/brand/mood/hummingbird.jpg";
import insectEye from "@/assets/brand/mood/insect-eye.jpg";
import lidarRivers from "@/assets/brand/mood/lidar-rivers.jpg";
import lidarScan from "@/assets/brand/mood/lidar-scan.jpg";
import lidarTrees from "@/assets/brand/mood/lidar-trees.jpg";
import rainbow from "@/assets/brand/mood/rainbow.jpg";
import shell from "@/assets/brand/mood/shell.jpg";
import Image, { type StaticImageData } from "next/image";
import { cn } from "./cn";
import { BLEED } from "./shot";
import { PAGE } from "./story";

/* The reveal deck's moodboard, cut out of its slide and put back on the
 * slide's own grid: four columns of four rows (two columns of eight on
 * smaller screens), each tile spanning what it spanned there, so they
 * interlock without a gap. Rows keep the slide's proportions (a row is
 * 0.533 of a column) from the window's width. Nature and data alternate;
 * each tile opens in turn and leans in on hover. */

// What a one-column tile takes of the window; the wide and half tiles say their own.
const SIZES = "(min-width: 1024px) 25vw, 50vw";
const TILES: { src: StaticImageData; span: string; sizes?: string; alt: string }[] = [
  { src: canopyHeight, span: "col-span-4 row-span-2", sizes: "(min-width: 1024px) 50vw, 100vw", alt: "A forest canopy from above, coloured by height in yellows and greens" },
  { src: beetle, span: "col-span-2 row-span-2", alt: "A beetle with an iridescent red and green shell on a stem" },
  { src: lidarTrees, span: "col-span-2 row-span-3", alt: "A lidar scan of trees, coloured by height from blue to red" },
  { src: hummingbird, span: "col-span-2", alt: "A hummingbird, its feathers shifting from blue to green to orange" },
  { src: lidarScan, span: "col-span-2", alt: "A lidar scan of canopy, from blue at the ground to orange at the top" },
  { src: insectEye, span: "col-span-2 row-span-2", alt: "An insect's compound eye, green and blue" },
  { src: lidarRivers, span: "col-span-2", alt: "Rivers through forest in a dark green and blue scan" },
  { src: begonia, span: "col-span-2", alt: "A begonia's blue-green leaves and pale flowers" },
  { src: rainbow, span: "col-span-1", sizes: "(min-width: 1024px) 13vw, 25vw", alt: "A rainbow over a mountain and a line of pines" },
  { src: shell, span: "col-span-1", sizes: "(min-width: 1024px) 13vw, 25vw", alt: "Abalone shell, its nacre in every colour" },
];

export const Moodboard = ({ className }: { className?: string }) => (
  <figure className={cn(BLEED, className)}>
    <div
      data-stagger
      className="mx-auto grid max-w-[110rem] auto-rows-[calc((100vw-24px)*0.2667)] grid-cols-4 gap-2 px-2 sm:auto-rows-[calc((100vw-36px)*0.2667)] sm:gap-3 sm:px-3 lg:auto-rows-[calc((min(100vw,110rem)-60px)*0.1333)] lg:grid-cols-8"
    >
      {TILES.map(({ src, span, sizes = SIZES, alt }) => (
        <div key={alt} data-reveal="frame" className={cn("group relative overflow-hidden rounded-[10px]", span)}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            placeholder="blur"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </div>
      ))}
    </div>
    <figcaption className={cn(PAGE, "type-caption mt-3 text-(--tone-text)")}>
      The moodboard: iridescent animals and plants beside lidar scans, where the spectrum came from.
    </figcaption>
  </figure>
);
