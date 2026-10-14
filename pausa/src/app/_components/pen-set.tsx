"use client";

/* eslint-disable @next/next/no-img-element -- the brand book's marks, as SVG */
import { cn } from "./cn";
import { PenMark } from "./pen-mark";
import { PAGE } from "./story";
import { useInView } from "./use-in-view";
import { Written } from "./written";

/* The pen, as the brand book draws it (pp. 17–21): the marks in use on a
 * line of real words, then the three families they come from — the
 * underlines, the circles, the highlighter. Each family draws on in a quick
 * stagger when it scrolls into view. */

const n = (count: number, name: string) =>
  Array.from({ length: count }, (_, i) => `${name}-${String(i + 1).padStart(2, "0")}`);

const FAMILIES = [
  { name: "Underlines", note: "Strokes, doubles, a zigzag, two arrows", marks: n(18, "underline"), cols: "grid-cols-3 sm:grid-cols-6", h: "h-10 sm:h-12" },
  { name: "Circles", note: "Round a word worth coming back to", marks: n(7, "circle"), cols: "grid-cols-3 sm:grid-cols-7", h: "h-14 sm:h-16" },
  { name: "Highlights", note: "Sun, behind ink, once per screen", marks: n(23, "highlight"), cols: "grid-cols-3 sm:grid-cols-6 lg:grid-cols-8", h: "h-12 sm:h-14" },
] as const;

// Static classes so Tailwind can see them: the stagger steps along each row.
const DELAYS = [
  "[--wipe-delay:0ms]",
  "[--wipe-delay:70ms]",
  "[--wipe-delay:140ms]",
  "[--wipe-delay:210ms]",
  "[--wipe-delay:280ms]",
  "[--wipe-delay:350ms]",
  "[--wipe-delay:420ms]",
  "[--wipe-delay:490ms]",
] as const;

const Family = ({ family }: { family: (typeof FAMILIES)[number] }) => {
  const [ref, drawn] = useInView<HTMLDivElement>(0.25);
  return (
    <div>
      <p className="type-label text-pen">
        {family.name} · {family.marks.length}
      </p>
      <p className="type-secondary mt-1 text-body">{family.note}</p>
      <div ref={ref} role="img" aria-label={`${family.marks.length} ${family.name.toLowerCase()} from the brand book`} className={cn("mt-8 grid items-center gap-x-8 gap-y-8", family.cols)}>
        {family.marks.map((mark, i) => (
          <div key={mark} className={cn("flex items-center justify-center", family.h)}>
            <img
              src={`/pen/${mark}.svg`}
              alt=""
              loading="lazy"
              data-drawn={drawn}
              className={cn("mark-wipe mark-multiply max-h-full max-w-full", DELAYS[i % DELAYS.length])}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const PenSet = ({ className }: { className?: string }) => (
  <div className={cn(PAGE, "space-y-20 sm:space-y-24", className)}>
    {FAMILIES.map((family) => (
      <Family key={family.name} family={family} />
    ))}
  </div>
);

/* The marks in use (p. 21): one line of the words Pausa actually marks. */
export const MarksInUse = ({ className }: { className?: string }) => (
  <p
    className={cn(
      PAGE,
      "flex flex-wrap items-baseline gap-x-12 gap-y-8 font-serif text-[1.5rem] leading-[1.5] text-ink sm:text-[2rem]",
      className,
    )}
  >
    <PenMark kind="highlight">avoiding</PenMark>
    <PenMark kind="underline">already know</PenMark>
    <PenMark kind="strike" className="text-body">
      I’ll deal with it later
    </PenMark>
    <span className="type-hand text-pen">
      <Written delay={300}>— want to look?</Written>
    </span>
    <PenMark kind="circle">circling</PenMark>
    <span className="whitespace-nowrap">
      you haven’t said it
      <span className="relative inline-block w-4">
        <img aria-hidden alt="" src="/pen/inuse-caret.svg" className="absolute -bottom-1 left-0.5 h-2.5 w-4" />
        <span className="type-hand absolute bottom-[1.1em] left-1 text-[1.4rem] leading-none whitespace-nowrap text-pen">
          <Written delay={600}>out loud!</Written>
        </span>
      </span>
    </span>
  </p>
);
