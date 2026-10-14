"use client";

import type { ReactNode } from "react";
import { cn } from "./cn";
import { useInView } from "./use-in-view";

/* The brand book's own marks in use (pp. 16, 21), laid over the words they
 * mark and drawn once, left to right, when they come into view. The
 * highlight goes behind the ink, never on top of it. */
const MARKS = {
  underline: {
    src: "/pen/inuse-underline-word.svg",
    box: "top-[88%] -left-[0.04em] h-[0.2em] w-[calc(100%+0.08em)]",
  },
  circle: {
    src: "/pen/inuse-circle-you.svg",
    box: "-top-[0.28em] -left-[0.22em] h-[calc(100%+0.52em)] w-[calc(100%+0.44em)]",
  },
  highlight: {
    src: "/pen/inuse-highlight-word.svg",
    box: "-z-10 top-[8%] -left-[0.1em] h-[92%] w-[calc(100%+0.2em)]",
  },
  strike: {
    src: "/pen/inuse-strike-word.svg",
    box: "top-[52%] -left-[0.04em] h-[0.12em] w-[calc(100%+0.08em)]",
  },
} as const;

export const PenMark = ({
  kind = "underline",
  children,
  className,
}: {
  kind?: keyof typeof MARKS;
  children: ReactNode;
  className?: string;
}) => {
  const [ref, drawn] = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} className={cn("relative isolate inline-block", className)}>
      {children}
      {/* eslint-disable-next-line @next/next/no-img-element -- a stretched decorative SVG */}
      <img
        aria-hidden
        alt=""
        src={MARKS[kind].src}
        data-drawn={drawn}
        className={cn("mark-wipe pointer-events-none absolute max-w-none", MARKS[kind].box)}
      />
    </span>
  );
};

/** A line Pausa never sends, crossed out by the pen: the book's strike over
 *  every line the words run to, drawn across them in reading order. It rides
 *  on a transparent copy of the words laid over them, so it sits on top of
 *  the ink the way a pen stroke does. */
export const StruckLine = ({ children, className }: { children: string; className?: string }) => {
  const [ref, drawn] = useInView<HTMLParagraphElement>();
  return (
    <p ref={ref} className={cn("relative", className)}>
      <del className="no-underline">{children}</del>
      <span aria-hidden className="pointer-events-none absolute inset-0 text-transparent select-none">
        <span data-drawn={drawn} className="strike-lines">
          {children}
        </span>
      </span>
    </p>
  );
};
