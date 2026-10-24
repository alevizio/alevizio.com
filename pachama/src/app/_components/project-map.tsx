"use client";

import forest from "@/assets/brand/map/forest-dots.png";
import land from "@/assets/brand/map/land-dots.png";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "./cn";
import { Flag, type Country as FlagCode } from "./flag";
import { BLEED } from "./shot";

/* Where Pachama supported projects, the website's world map: the land in
 * faint dots and the world's forests in the spectrum's colours (both
 * layers from the Website Figma), with the four countries it worked in.
 * When it's reached the forests sweep in from west to east and the
 * countries drop in one after another; then a scan crosses the forests
 * now and again. On a phone it closes in on the Americas. With less motion
 * it's all simply there. */
type Country = { name: string; at: string; flag: FlagCode; delay: string };
// Placed as in the Figma (a 1728 x 862 frame), as literal classes.
const COUNTRIES: Country[] = [
  {
    name: "United States",
    at: "left-[45.14%] top-[29.47%]",
    delay: "[animation-delay:0.9s]",
    flag: "us",
  },
  {
    name: "Mexico",
    at: "left-[36.46%] top-[47.8%]",
    delay: "[animation-delay:1.15s]",
    flag: "mx",
  },
  {
    name: "Brazil",
    at: "left-[57.29%] top-[62.88%]",
    delay: "[animation-delay:1.4s]",
    flag: "br",
  },
  {
    name: "Argentina",
    at: "left-[43%] top-[77.49%]",
    delay: "[animation-delay:1.65s]",
    flag: "ar",
  },
];
// The dot layers overhang the frame in the Figma: placed the same way, and
// drawn wider on a phone.
const LAYER = "absolute top-[-8.78%] left-[-1.77%] h-[115.9%] w-[102.76%] max-w-none select-none";
const SIZES = "(max-width: 639px) 240vw, 100vw";

export const ProjectMap = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  // Most of it in view: it plays (again, each time it's reached).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOn(entry.intersectionRatio >= 0.35), { threshold: [0, 0.35] });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className={cn(BLEED, className)}>
      <div
        ref={ref}
        role="img"
        aria-label="Where Pachama supports forest carbon projects: the world's forests as dots in the brand's spectrum, with the United States, Mexico, Brazil and Argentina marked"
        data-on={on || undefined}
        className="group/map relative aspect-[1728/862] overflow-hidden bg-bn-heavy max-sm:aspect-[4/3]"
      >
        {/* On a phone the map is drawn wider, so the Americas fill the frame. */}
        <div className="@container absolute top-1/2 left-1/2 aspect-[1728/862] w-full -translate-1/2 max-sm:w-[240%] max-sm:translate-x-[-48%]">
          <Image src={land} alt="" sizes={SIZES} className={cn(LAYER, "opacity-0 transition-opacity duration-1000 group-data-on/map:opacity-[0.17] motion-reduce:opacity-[0.17]")} />
          <Image
            src={forest}
            alt=""
            sizes={SIZES}
            className={cn(
              LAYER,
              "[mask-image:linear-gradient(to_right,#000_calc(var(--sweep)_-_12%),transparent_var(--sweep))] motion-safe:group-data-on/map:animate-[map-sweep_2.8s_var(--ease-arrive)_both] motion-reduce:[mask-image:none]",
            )}
          />
          {/* The scan: the forests again, bright, through a band that crosses them. */}
          <Image
            src={forest}
            alt=""
            sizes={SIZES}
            className={cn(
              LAYER,
              "opacity-0 mix-blend-screen brightness-150 [mask-image:linear-gradient(to_right,transparent_calc(var(--scan)_-_8%),#000_var(--scan),transparent_calc(var(--scan)_+_8%))] motion-safe:group-data-on/map:animate-[map-scan_7s_ease-in-out_3s_infinite] motion-safe:group-data-on/map:opacity-100",
            )}
          />
          {COUNTRIES.map((c) => (
            <p
              key={c.name}
              className={cn(
                "absolute flex h-[3.41cqw] min-h-9 items-center gap-[0.6cqw] rounded-full bg-[#dfe3df]/85 py-[0.58cqw] pr-[1.2cqw] pl-[0.58cqw] shadow-[0_8px_24px_rgb(0_0_0/0.3)] backdrop-blur-md",
                "opacity-0 group-data-on/map:opacity-100 motion-safe:group-data-on/map:animate-[pin-drop_0.6s_var(--ease-arrive)_both] motion-reduce:opacity-100",
                c.at,
                c.delay,
              )}
            >
              <Flag country={c.flag} className="size-[max(22px,2.26cqw)]" />
              <span className="font-mono text-[max(10px,0.81cqw)] leading-none tracking-[0.08em] whitespace-nowrap text-bn-heavy uppercase">{c.name}</span>
            </p>
          ))}
        </div>
      </div>
    </figure>
  );
};
