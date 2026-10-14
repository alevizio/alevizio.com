import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "./cn";

/* The phone as the brand book draws it (pp. 23, 24, 27): not a black device
 * but a white one, a paper-light body with a hairline edge, soft side
 * buttons and a white island. Proportions are relative, so it holds at any
 * width. It shows a screenshot, or a live screen built in the page. */

type Screen =
  | { src: string; alt: string; width?: number; height?: number; sizes: string; priority?: boolean; children?: never }
  | { children: ReactNode; src?: never; alt?: never; width?: never; height?: never; sizes?: never; priority?: never };

export const Phone = (props: Screen & { className?: string }) => (
  <div
    className={cn(
      "relative rounded-[14.5%/7%] bg-white p-[3.8%] ring-1 ring-[#e6e6e6]",
      props.className,
    )}
  >
    {/* side buttons: action and volume on the left, power on the right */}
    <span aria-hidden className="absolute top-[15%] -left-[1.4%] h-[3.6%] w-[1.4%] rounded-l-[3px] bg-white ring-1 ring-rule" />
    <span aria-hidden className="absolute top-[22%] -left-[1.4%] h-[7%] w-[1.4%] rounded-l-[3px] bg-white ring-1 ring-rule" />
    <span aria-hidden className="absolute top-[31%] -left-[1.4%] h-[7%] w-[1.4%] rounded-l-[3px] bg-white ring-1 ring-rule" />
    <span aria-hidden className="absolute top-[25%] -right-[1.4%] h-[10%] w-[1.4%] rounded-r-[3px] bg-white ring-1 ring-rule" />
    <div className="relative overflow-hidden rounded-[12.3%/5.65%]">
      {props.src ? (
        <Image
          src={props.src}
          alt={props.alt}
          width={props.width ?? 900}
          height={props.height ?? 1955}
          sizes={props.sizes}
          priority={props.priority}
          className="block h-auto w-full"
        />
      ) : (
        <div className="@container relative aspect-[1320/2868] bg-[#f4f3f0] bg-[url(/pausa-co/paper-texture.jpg)] bg-cover bg-blend-multiply">
          <StatusBar />
          {props.children}
        </div>
      )}
      <span aria-hidden className="absolute top-[1.65%] left-1/2 h-[4.25%] w-[32.6%] -translate-x-1/2 rounded-full bg-white" />
    </div>
  </div>
);

/** The time and the three status glyphs, sized off the screen's width. */
const StatusBar = () => (
  <div aria-hidden className="absolute inset-x-0 top-[2.6%] flex items-center justify-between px-[8%] font-sans text-[length:3.6cqw] font-semibold text-ink">
    <span>11:03</span>
    <span className="flex items-center gap-[1.4cqw]">
      <span className="flex items-end gap-[0.5cqw]">
        {["h-[1cqw]", "h-[1.55cqw]", "h-[2.1cqw]", "h-[2.8cqw]"].map((h) => (
          <span key={h} className={cn("block w-[0.8cqw] rounded-[0.3cqw] bg-ink", h)} />
        ))}
      </span>
      <span className="block h-[2.6cqw] w-[5.4cqw] rounded-[0.8cqw] border-[0.35cqw] border-ink p-[0.35cqw]">
        <span className="block h-full w-[78%] rounded-[0.3cqw] bg-ink" />
      </span>
    </span>
  </div>
);
