import type { ReactNode } from "react";
import { cn } from "./cn";
import { tidy } from "./tidy";
import { Written } from "./written";

/* Set the way the brand book sets a page: a small blue label, the head in
 * Source Serif 4 Medium, a line or two of plain text at reading size, then
 * the work, big. No rules, no frames: spacing does the separating. */

/** The page's content width. */
export const PAGE = "mx-auto w-full max-w-[86rem] px-6 sm:px-10";

/** For a full-width row that scrolls sideways: padding that starts its first item on PAGE's text column. */
export const ROW_GUTTER = cn(
  "px-[max(1.5rem,calc((100%_-_86rem)/2_+_1.5rem))] scroll-px-[max(1.5rem,calc((100%_-_86rem)/2_+_1.5rem))]",
  "sm:px-[max(2.5rem,calc((100%_-_86rem)/2_+_2.5rem))] sm:scroll-px-[max(2.5rem,calc((100%_-_86rem)/2_+_2.5rem))]",
);

const tidyNode = (node: ReactNode) => (typeof node === "string" ? tidy(node) : node);

/** Pausa's hand, used the way the book allows it: once per surface, and written out as it arrives. */
export const Hand = ({ children, onDark = false, className }: { children: string; onDark?: boolean; className?: string }) => (
  <p className={cn("type-hand", onDark ? "text-cream/85" : "text-pen", className)}>
    <Written>{tidy(children)}</Written>
  </p>
);

/** One section: label, head, a short text, then the work below it. */
export const Section = ({
  id,
  eyebrow,
  title,
  text,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  children?: ReactNode;
  className?: string;
}) => (
  <section id={id} className={cn("mt-32 scroll-mt-10 sm:mt-44", className)}>
    <div className={PAGE}>
      {eyebrow ? <p className="type-label text-pen">{eyebrow}</p> : null}
      <h3 className={cn("type-section max-w-[20ch] text-ink", eyebrow && "mt-4")}>{tidyNode(title)}</h3>
      {text ? <p className="type-body mt-5 max-w-[36rem] text-body">{tidyNode(text)}</p> : null}
    </div>
    {children ? <div className="mt-12 sm:mt-16">{children}</div> : null}
  </section>
);

/** A chapter break, set like the book's index page (p. 02): the number as a
 *  label, the title at display size, one line with one mark on it, and the
 *  book's pale tangle running off the edge of the page beside them. */
export const ChapterDivider = ({
  numeral,
  title,
  id,
  children,
}: {
  numeral: string;
  title: string;
  id?: string;
  /** The one line under the title. */
  children?: ReactNode;
}) => (
  <header id={id} className="relative mt-40 scroll-mt-10 sm:mt-56">
    {/* eslint-disable-next-line @next/next/no-img-element -- the book's own drawing, as SVG */}
    <img
      aria-hidden
      alt=""
      src="/chapter/index-tangle.svg"
      className="pointer-events-none absolute -top-20 right-[-26vw] w-[18rem] max-w-none sm:-top-28 sm:right-[-10vw] sm:w-[clamp(24rem,38vw,35rem)]"
    />
    <div className={cn(PAGE, "relative")}>
      <p className="type-label text-pen">Chapter {numeral}</p>
      <h2 className="type-display mt-4 text-ink">{tidy(title)}</h2>
      {children ? (
        <p className="mt-6 max-w-[34rem] font-serif text-[length:clamp(1.125rem,1.55vw,1.375rem)] leading-[1.6] text-body">
          {children}
        </p>
      ) : null}
    </div>
  </header>
);
