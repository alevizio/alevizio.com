import type { ReactNode } from "react";
import { cn } from "./cn";

/* The page is laid out like the brand manual: a deep left margin that
 * carries the pen notes, and a reading column beside it. On phones the
 * margin folds in above the text it annotates. */

/** The brand's technical label: Plex Mono, tracked, in the pen's blue. */
export const Kicker = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p
    className={cn(
      "font-mono text-[11px] uppercase tracking-[0.22em] text-pen",
      className,
    )}
  >
    {children}
  </p>
);

/** A note in the margin, in Caveat and the pen's blue. */
export const MarginNote = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p
    className={cn(
      "font-hand text-[1.45rem] leading-[1.15] text-pen lg:text-right",
      className,
    )}
  >
    {children}
  </p>
);

/** One section of the story: margin note on the left, reading column on the right. */
export const Section = ({
  id,
  kicker,
  title,
  note,
  children,
  className,
}: {
  id: string;
  kicker?: string;
  title: ReactNode;
  note?: ReactNode;
  children?: ReactNode;
  className?: string;
}) => (
  <section
    id={id}
    className={cn(
      "mx-auto grid max-w-6xl scroll-mt-24 gap-x-12 px-6 lg:grid-cols-[13rem_minmax(0,1fr)]",
      className,
    )}
  >
    <div className="order-2 mt-5 lg:order-1 lg:mt-14">
      {note ? <MarginNote>{note}</MarginNote> : null}
    </div>
    <div className="order-1 max-w-[42rem] lg:order-2">
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <h3 className="mt-4 text-[2rem] leading-[1.12] font-medium tracking-[-0.015em] text-ink sm:text-[2.6rem]">
        {title}
      </h3>
    </div>
    {children ? (
      <div className="order-3 mt-6 lg:col-start-2">{children}</div>
    ) : null}
  </section>
);

/** Reading text: Source Serif in the body grey, at a reading measure. */
export const Prose = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "max-w-[40rem] space-y-5 text-[1.125rem] leading-[1.7] text-body",
      className,
    )}
  >
    {children}
  </div>
);

/** A full-width breather between chapters: numeral, title, one line. */
export const ChapterDivider = ({
  numeral,
  title,
  blurb,
  id,
}: {
  numeral: string;
  title: string;
  blurb: string;
  id?: string;
}) => (
  <header
    id={id}
    className="relative mx-auto my-24 max-w-6xl scroll-mt-24 px-6 sm:my-32"
  >
    <div className="border-t border-rule pt-10 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-x-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-body lg:text-right">
        Chapter {numeral}
      </p>
      <div className="mt-4 lg:mt-0">
        <h2 className="text-[3rem] leading-[1.04] font-medium tracking-[-0.02em] text-ink sm:text-[4.5rem]">
          {title}
        </h2>
        <p className="mt-5 max-w-xl font-sans text-[1rem] leading-[1.6] text-body">
          {blurb}
        </p>
      </div>
    </div>
  </header>
);
