import tree from "@/assets/banyan/cover-tree.webp";
import Image from "next/image";
import { cn } from "../cn";

/** Banyan's cover, rebuilt from its Figma frame (1440 × 960) in live type
 *  over the point-cloud tree, every size scaled to the frame's width. */
export const BanyanCover = ({ className }: { className?: string }) => (
  <div className={cn("@container relative aspect-[3/2] overflow-hidden rounded-[16px] border border-bn-glass-3/30 bg-white", className)}>
    <Image
      src={tree}
      alt=""
      sizes="(min-width: 1376px) 1900px, 146vw"
      className="absolute top-[-38.33%] left-[38.89%] h-auto w-[146.1%] max-w-none"
    />
    <p className="absolute top-[32.08%] left-[10.49%] -translate-y-1/2 font-display text-[13.89cqw] leading-none font-bold text-bn-heavy uppercase">
      Banyan
    </p>
    <p className="absolute top-[48.08%] left-[10.49%] -translate-y-1/2 text-[5.56cqw] leading-none font-medium text-bn-medium">Design system</p>
  </div>
);
