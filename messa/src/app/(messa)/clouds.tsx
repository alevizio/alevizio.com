import Image from "next/image";
import { cn } from "./cn";

/**
 * Messa's hand-drawn cloud sprites (copied from messa-landing
 * public/images/cloud0*.png), drifting on slow ease keyframes — see
 * `.story-cloud` in story.css; the drift pauses entirely under
 * prefers-reduced-motion. Purely decorative: aria-hidden, empty alt,
 * never interactive. Parents must be `relative overflow-hidden`.
 */

type Cloud = {
  src: string;
  width: number;
  height: number;
  /** Absolute placement + per-cloud drift duration. */
  className: string;
};

const HERO_CLOUDS: readonly Cloud[] = [
  {
    src: "/work/messa/world/cloud02.png",
    width: 340,
    height: 242,
    className:
      "left-[4%] top-10 w-40 sm:w-56 [animation-duration:80s] opacity-90",
  },
  {
    src: "/work/messa/world/cloud01.png",
    width: 231,
    height: 164,
    className:
      "right-[6%] top-24 w-28 sm:w-40 [animation-duration:64s] opacity-80",
  },
  {
    src: "/work/messa/world/cloud05.png",
    width: 114,
    height: 82,
    className:
      "left-[58%] top-6 hidden w-20 sm:block [animation-duration:72s] opacity-70",
  },
];

const BREAK_CLOUDS: readonly Cloud[] = [
  {
    src: "/work/messa/world/cloud01.png",
    width: 231,
    height: 164,
    className:
      "left-[12%] top-4 w-32 sm:w-44 [animation-duration:76s] opacity-80",
  },
  {
    src: "/work/messa/world/cloud05.png",
    width: 114,
    height: 82,
    className:
      "right-[16%] top-12 w-20 sm:w-24 [animation-duration:62s] opacity-70",
  },
];

export const Clouds = ({ variant }: { variant: "hero" | "break" }) => (
  <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
    {(variant === "hero" ? HERO_CLOUDS : BREAK_CLOUDS).map((cloud) => (
      <Image
        key={cloud.src + cloud.className}
        src={cloud.src}
        alt=""
        width={cloud.width}
        height={cloud.height}
        priority={false}
        className={cn("story-cloud absolute h-auto", cloud.className)}
      />
    ))}
  </div>
);
