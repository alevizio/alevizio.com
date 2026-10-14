"use client";

import type { ReactNode } from "react";
import { cn } from "./cn";
import { useInView } from "./use-in-view";

/* Pausa's marks, as pausa.co draws them: organic pen and highlighter
 * shapes (public/pausa-co), multiplied into the paper over the words they
 * mark. "The pushback is an editor's annotation, not an alert." Each is
 * drawn once, left to right, when it scrolls into view. */
const IMAGE_MARKS = {
  // the blue double loop pausa.co puts round "tradition"
  circle: {
    src: "/pausa-co/mark-tradition.svg",
    box: "-left-[0.18em] -top-[0.2em] h-[calc(100%+0.36em)] w-[calc(100%+0.36em)]",
  },
  // the triple pen underline under "what the app does"
  underline: {
    src: "/pausa-co/mark-app-does.svg",
    box: "-left-[0.05em] top-[86%] h-[0.32em] w-[calc(100%+0.15em)]",
  },
} as const;

type PenMarkProps = {
  kind: keyof typeof IMAGE_MARKS | "strike";
  children: ReactNode;
  className?: string;
};

export const PenMark = ({ kind, children, className }: PenMarkProps) => {
  const [ref, drawn] = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      {children}
      {kind === "strike" ? (
        // stroke-16 from the brand kit's pen set: the correction, two lines through it
        <svg
          aria-hidden
          viewBox="0 0 220 52"
          preserveAspectRatio="none"
          className="pointer-events-none absolute -inset-x-[0.12em] top-[34%] h-[0.42em] w-[calc(100%+0.24em)] overflow-visible"
          fill="none"
        >
          <path
            d="M18 18 C 90 30 150 22 202 36M18 36 C 90 24 150 32 202 18"
            pathLength={1}
            data-drawn={drawn}
            className="pen-stroke stroke-pen"
            strokeWidth={2.4}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- a stretched decorative SVG, not a photo
        <img
          aria-hidden
          alt=""
          src={IMAGE_MARKS[kind].src}
          data-drawn={drawn}
          className={cn(
            "mark-wipe mark-multiply pointer-events-none absolute max-w-none",
            IMAGE_MARKS[kind].box,
          )}
        />
      )}
    </span>
  );
};

/* The highlighter: yellow, multiplied into the paper over the words, one
 * per screen. */
export const Highlight = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const [ref, drawn] = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      {children}
      {/* eslint-disable-next-line @next/next/no-img-element -- a stretched decorative SVG */}
      <img
        aria-hidden
        alt=""
        src="/pausa-co/hl-pushes-b.svg"
        data-drawn={drawn}
        className="mark-wipe mark-multiply pointer-events-none absolute -inset-x-[0.14em] top-[16%] h-[82%] w-[calc(100%+0.28em)] max-w-none"
      />
    </span>
  );
};
