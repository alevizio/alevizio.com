import { Fragment, type CSSProperties, type ReactNode } from "react";
import { cn } from "./cn";
import { tidy } from "./tidy";

/* The page's grammar, the same as the Pachama, Pausa and Messa stories: a
 * small label, a head, a line or two of text, then the work, big. Colour
 * comes from the band a section sits in: each band sets the tone variables,
 * and everything inside reads them. */

/** The page's content width. */
export const PAGE = "mx-auto w-full max-w-[86rem] px-6 sm:px-10";

export type Tone = "night" | "ground" | "paper";

const ON_DARK =
  "[--tone-head:var(--color-mist)] [--tone-text:var(--color-text)] [--tone-label:var(--color-mint)] [--tone-line:var(--color-rule)] [--tone-fill:rgb(230_246_231/0.04)]";

const TONES: Record<Tone, string> = {
  night: cn("bg-night", ON_DARK),
  ground: cn("bg-ground", ON_DARK),
  // The mint is too light for small text on paper; this green reads 5:1.
  paper:
    "bg-paper [--tone-head:var(--color-paper-ink)] [--tone-text:var(--color-paper-body)] [--tone-label:#1f7a4d] [--tone-line:rgb(15_19_19/0.14)] [--tone-fill:rgb(255_255_255/0.5)]",
};

const tidyNode = (node: ReactNode) => (typeof node === "string" ? tidy(node) : node);

/** A title that rises in word by word as it's reached (data-reveal="words"
 *  in globals.css): each word its own span, numbered for its delay. The last
 *  two stay bound, so no line ends on one. Anything but a string comes in
 *  whole. */
const Words = ({ children }: { children: ReactNode }) => {
  if (typeof children !== "string") return children;
  return tidy(children)
    .split(" ")
    .map((word, i) => (
      <Fragment key={i}>
        {i ? " " : null}
        <span style={{ "--i": i } as CSSProperties}>{word}</span>
      </Fragment>
    ));
};

// The band colours, for the fades between bands.
const FADE_FROM: Record<Tone, string> = { night: "from-night", ground: "from-ground", paper: "from-paper" };
const FADE_TO: Record<Tone, string> = { night: "to-night", ground: "to-ground", paper: "to-paper" };
const FADE = "pointer-events-none absolute inset-x-0 -z-10 h-[min(40vh,24rem)]";

/** A full-width band of one tone. flow-root keeps its first child's top
 *  margin inside it, so the colour runs all the way up. With from or to,
 *  it fades in from the band above or out into the one below, behind its
 *  content, so one chapter's colour turns into the next as the page
 *  scrolls instead of switching at an edge. */
export const Band = ({ tone = "ground", from, to, className, children }: { tone?: Tone; from?: Tone; to?: Tone; className?: string; children: ReactNode }) => (
  <div className={cn("relative isolate flow-root pb-28 sm:pb-40", TONES[tone], className)}>
    {from ? <div aria-hidden className={cn(FADE, "top-0 bg-linear-to-b to-transparent", FADE_FROM[from])} /> : null}
    {to ? <div aria-hidden className={cn(FADE, "bottom-0 bg-linear-to-b from-transparent", FADE_TO[to])} /> : null}
    {children}
  </div>
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
  <section id={id} data-scene className={cn("mt-28 scroll-mt-10 sm:mt-40", className)}>
    <div className={PAGE}>
      {eyebrow ? <Tag className="[--reveal-delay:0s]">{eyebrow}</Tag> : null}
      <h3 data-reveal="words" className={cn("type-section max-w-[18ch] text-(--tone-head) [--reveal-delay:0.08s]", eyebrow && "mt-5")}>
        <Words>{title}</Words>
      </h3>
      {text ? (
        <p data-reveal className="type-body mt-5 max-w-[36rem] text-(--tone-text) [--reveal-delay:0.16s]">
          {tidyNode(text)}
        </p>
      ) : null}
    </div>
    {children ? <div className={cn(PAGE, "mt-12 sm:mt-16")}>{children}</div> : null}
  </section>
);

/** The page's tag: a mono label in a hairline pill, the way the landing
 *  page heads every section (Who, Production, Development). */
export const Tag = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p data-reveal="pop" className={cn("inline-flex min-h-8 items-center rounded-full border border-(--tone-line) px-3.5 py-1.5 type-label text-(--tone-label)", className)}>
    {children}
  </p>
);

/** A chapter break, the way the landing page opens a section: the tag,
 *  then the title at display size and one line under it, centred. */
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
}) => {
  return (
    <header id={id} className="mt-32 scroll-mt-10 sm:mt-44">
      <div data-parallax="-0.06" className={cn(PAGE, "flex flex-col items-center text-center")}>
        <Tag>Chapter {numeral}</Tag>
        <h2 data-reveal="words" className="type-display mt-6 text-(--tone-head) [--reveal-delay:0.12s]">
          <Words>{title}</Words>
        </h2>
        {children ? (
          <p data-reveal className="type-body mt-6 max-w-[36rem] text-(--tone-text) [--reveal-delay:0.24s]">
            {children}
          </p>
        ) : null}
      </div>
    </header>
  );
};

/** Two to four pieces side by side from sm up. */
export const Row = ({ children, cols = 2, className }: { children: ReactNode; cols?: 2 | 3 | 4; className?: string }) => (
  <div
    data-stagger
    className={cn(
      "grid gap-4 sm:gap-6",
      cols === 2 && "sm:grid-cols-2",
      cols === 3 && "sm:grid-cols-3",
      cols === 4 && "grid-cols-2 lg:grid-cols-4",
      className,
    )}
  >
    {children}
  </div>
);
