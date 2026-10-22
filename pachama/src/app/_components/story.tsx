import type { ReactNode } from "react";
import { cn } from "./cn";
import { tidy } from "./tidy";

/* The page's grammar, the same as the Pausa and Messa stories: a small
 * label, a head, a line or two of text, then the work, big. */

/** The page's content width. */
export const PAGE = "mx-auto w-full max-w-[86rem] px-6 sm:px-10";

const tidyNode = (node: ReactNode) => (typeof node === "string" ? tidy(node) : node);

/** The label, head and text colours, on paper or on the forest ground. */
const tone = (dark: boolean) =>
  dark
    ? { label: "text-mist/70", head: "text-mist", text: "text-mist/75" }
    : { label: "text-leaf", head: "text-ink", text: "text-body" };

/** One section: label, head, a short text, then the work below it. */
export const Section = ({
  id,
  eyebrow,
  title,
  text,
  dark = false,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  /** On the forest ground (the maps chapter). */
  dark?: boolean;
  children?: ReactNode;
  className?: string;
}) => {
  const t = tone(dark);
  return (
    <section id={id} className={cn("mt-28 scroll-mt-10 sm:mt-40", className)}>
      <div className={PAGE}>
        {eyebrow ? <p className={cn("type-label", t.label)}>{eyebrow}</p> : null}
        <h3 className={cn("type-section max-w-[22ch]", t.head, eyebrow && "mt-4")}>{tidyNode(title)}</h3>
        {text ? <p className={cn("type-body mt-5 max-w-[36rem]", t.text)}>{tidyNode(text)}</p> : null}
      </div>
      {children ? <div className={cn(PAGE, "mt-12 sm:mt-16")}>{children}</div> : null}
    </section>
  );
};

/** A chapter break: the number as a label, the title at display size and
 *  one line under it. */
export const ChapterDivider = ({
  numeral,
  title,
  id,
  dark = false,
  children,
}: {
  numeral: string;
  title: string;
  id?: string;
  dark?: boolean;
  /** The one line under the title. */
  children?: ReactNode;
}) => {
  const t = tone(dark);
  return (
    <header id={id} className="mt-40 scroll-mt-10 sm:mt-56">
      <div className={PAGE}>
        <p className={cn("type-label", t.label)}>Chapter {numeral}</p>
        <h2 className={cn("type-display mt-4", t.head)}>{tidy(title)}</h2>
        {children ? <p className={cn("type-body mt-6 max-w-[34rem]", t.text)}>{children}</p> : null}
      </div>
    </header>
  );
};

/** Where a piece of work will go, while the structure is being settled:
 *  what it is, where it comes from, and its shape on the page. */
export const Slot = ({
  label,
  source,
  aspect = "aspect-video",
  dark = false,
  className,
}: {
  label: string;
  /** Where the asset lives now (Dropbox path, Figma file, to ask). */
  source: string;
  /** Its shape, as a Tailwind aspect class: "aspect-video", "aspect-[4/5]"… */
  aspect?: string;
  dark?: boolean;
  className?: string;
}) => (
  <figure
    className={cn(
      aspect,
      "flex flex-col items-start justify-end gap-1.5 rounded-[14px] border border-dashed p-5 sm:p-6",
      dark ? "border-mist/25 bg-white/[0.03] text-mist" : "border-ash bg-panel/60 text-ink",
      className,
    )}
  >
    <figcaption className="type-caption max-w-[40ch] font-medium">{tidy(label)}</figcaption>
    <p className={cn("type-label normal-case tracking-normal", dark ? "text-mist/55" : "text-muted")}>{source}</p>
  </figure>
);

/** Two or three slots side by side from sm up. */
export const SlotRow = ({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) => (
  <div className={cn("grid gap-4 sm:gap-6", cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>{children}</div>
);
