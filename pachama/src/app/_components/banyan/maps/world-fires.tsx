"use client";

import { useState } from "react";
import { cn } from "../../cn";
import { BN } from "../ui";

/* The satellite basemap Banyan's maps start from, the whole world, with
 * the year's active fires over it: a switch takes them off and on. */
export const WorldFires = ({ className }: { className?: string }) => {
  const [fires, setFires] = useState(true);
  return (
    <div className={cn("grid w-full gap-4", className)}>
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-[16px] bg-[#0b1630]">
        {/* eslint-disable-next-line @next/next/no-img-element -- the Figma's own satellite world, a static texture */}
        <img src="/screens/earth.jpg" alt="The world from space, the satellite basemap Banyan's maps start from" className="absolute inset-0 size-full object-cover" />
        {/* eslint-disable-next-line @next/next/no-img-element -- the fire layer that goes over it */}
        <img
          src="/screens/fires.png"
          alt=""
          className={cn("absolute inset-0 size-full object-cover mix-blend-screen transition-opacity duration-700 [filter:hue-rotate(-40deg)_saturate(3)]", fires ? "opacity-100 motion-safe:animate-pulse" : "opacity-0")}
        />
      </div>
      <label className="flex items-center gap-3 text-[14px] leading-5 text-(--tone-head)">
        <input type="checkbox" checked={fires} onChange={(e) => setFires(e.target.checked)} className={cn("size-4 accent-bn-green", BN.focus, "focus-visible:outline-white")} />
        Show active fires
      </label>
    </div>
  );
};
