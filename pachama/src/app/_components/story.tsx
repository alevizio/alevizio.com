import type { ReactNode } from "react";
import { cn } from "./cn";
import { tidy } from "./tidy";

/* The page's grammar, the same as the Pausa and Messa stories: a small
 * label, a head, a line or two of text, then the work, big. Colour comes
 * from the band a section sits in: each band sets the tone variables, and
 * everything inside reads them. */

/** The page's content width. */
export const PAGE = "mx-auto w-full max-w-[86rem] px-6 sm:px-10";

export type Tone = "night" | "ground" | "paper" | "banyan";

const ON_DARK =
  "[--tone-head:var(--color-fog)] [--tone-text:var(--color-haze)] [--tone-label:var(--color-leaf)] [--tone-line:rgb(255_255_255/0.16)] [--tone-fill:rgb(255_255_255/0.03)]";

const TONES: Record<Tone, string> = {
  night: cn("bg-night", ON_DARK),
  ground: cn("bg-ground", ON_DARK),
  // The leaf green is too light for small text on paper; this one reads 5:1.
  paper:
    "bg-paper [--tone-head:var(--color-ink)] [--tone-text:var(--color-body)] [--tone-label:#157a41] [--tone-line:var(--color-ash)] [--tone-fill:rgb(255_255_255/0.6)]",
  // Banyan's own ground for the kit: the eggshell its docs set components
  // on, one surface for the whole chapter, with its green-black for heads.
  banyan:
    "bg-bn-eggshell [--bn-surface:var(--color-bn-eggshell)] [--tone-head:var(--color-bn-heavy)] [--tone-text:var(--color-bn-medium)] [--tone-label:#157a41] [--tone-line:var(--color-bn-grey-light)] [--tone-fill:var(--color-bn-eggshell)]",
};

const tidyNode = (node: ReactNode) => (typeof node === "string" ? tidy(node) : node);

/** A full-width band of one tone. flow-root keeps its first child's top
 *  margin inside it, so the colour runs all the way up. */
export const Band = ({ tone = "ground", className, children }: { tone?: Tone; className?: string; children: ReactNode }) => (
  <div className={cn("flow-root pb-28 sm:pb-40", TONES[tone], className)}>{children}</div>
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
  <section id={id} className={cn("mt-28 scroll-mt-10 sm:mt-40", className)}>
    <div className={PAGE}>
      {eyebrow ? (
        <p data-reveal className="type-label text-(--tone-label)">
          {eyebrow}
        </p>
      ) : null}
      <h3 data-reveal className={cn("type-section max-w-[18ch] text-(--tone-head) [--reveal-delay:0.08s]", eyebrow && "mt-4")}>
        {tidyNode(title)}
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

/** A chapter break: a short spectrum bar, the number as a label, the title
 *  at display size and one line under it. */
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
  <header id={id} className="mt-40 scroll-mt-10 sm:mt-56">
    <div className={PAGE}>
      <div aria-hidden data-reveal="grow-x" className="spectrum h-[3px] w-16 rounded-full" />
      <p data-reveal className="type-label mt-6 text-(--tone-label) [--reveal-delay:0.1s]">
        Chapter {numeral}
      </p>
      <h2 data-reveal className="type-display mt-4 text-(--tone-head) [--reveal-delay:0.18s]">
        {tidy(title)}
      </h2>
      {children ? (
        <p data-reveal className="type-body mt-6 max-w-[34rem] text-(--tone-text) [--reveal-delay:0.28s]">
          {children}
        </p>
      ) : null}
    </div>
  </header>
);

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
