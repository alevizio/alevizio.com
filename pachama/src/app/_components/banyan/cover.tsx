"use client";

import tree from "@/assets/banyan/cover-tree.webp";
import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { cn } from "../cn";

/** Banyan's cover, rebuilt from its Figma frame (1440 × 960) in live type
 *  over the point-cloud tree, every size scaled to the frame's width. Under
 *  a mouse the tree leans away from the pointer and the name toward it, a
 *  little depth; nothing moves for anyone who has asked for less motion. */
export const BanyanCover = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const lean = (x: number, y: number) => {
    ref.current?.style.setProperty("--px", x.toFixed(3));
    ref.current?.style.setProperty("--py", y.toFixed(3));
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!ref.current || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    lean((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={() => lean(0, 0)}
      className={cn("@container relative aspect-[3/2] overflow-hidden rounded-[16px] border border-bn-glass-3/30 bg-white", className)}
    >
      <div className="absolute inset-0 transition-[translate] duration-700 ease-out [translate:calc(var(--px,0)*-3%)_calc(var(--py,0)*-3%)]">
        <Image
          src={tree}
          alt=""
          sizes="(min-width: 1376px) 1900px, 146vw"
          className="absolute top-[-38.33%] left-[38.89%] h-auto w-[146.1%] max-w-none"
        />
      </div>
      <div className="absolute inset-0 transition-[translate] duration-700 ease-out [translate:calc(var(--px,0)*1.5%)_calc(var(--py,0)*1.5%)]">
        <p className="absolute top-[32.08%] left-[10.49%] -translate-y-1/2 font-display text-[13.89cqw] leading-none font-bold text-bn-heavy uppercase">
          Banyan
        </p>
        <p className="absolute top-[48.08%] left-[10.49%] -translate-y-1/2 text-[5.56cqw] leading-none font-medium text-bn-medium">Design system</p>
      </div>
    </div>
  );
};
