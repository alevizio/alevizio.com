import { cn } from "./cn";
import { PenMark, StruckLine } from "./pen-mark";
import { PAGE } from "./story";
import { tidy } from "./tidy";
import { Written } from "./written";

/* The voice the way the brand book sets it (pp. 13–14): a call-out as the
 * app ships it, with the pen's marks laid on and the aside written in the
 * hand; the one rule in the book's card; then the principles, each with the
 * line Pausa sends and the line it never does, struck through by the pen. */

const PRINCIPLES = [
  {
    name: "Observe, don’t diagnose",
    send: "“You wrote ‘fine’ four times today.”",
    never: "“You’re clearly anxious and avoidant.”",
  },
  {
    name: "Declare, don’t hedge",
    send: "“You keep circling this decision. Maybe it’s already made.”",
    never: "“It seems like perhaps you might possibly be revisiting this a bit?”",
  },
  {
    name: "Brevity is the confidence",
    send: "“Same decision. Third time. You know.”",
    never: "“I’ve noticed you’ve written about this on three separate occasions, which might suggest…”",
  },
  {
    name: "Never perform care",
    send: "“Last week you said this would pass. It did. Worth remembering.”",
    never: "“Amazing work! 7-day streak! Keep the momentum!”",
  },
] as const;

/** The call-out in the margin of an entry (p. 14): underline, then highlight, then the hand. */
const CallOut = () => (
  <figure>
    <div className="rounded-[28px] bg-panel px-7 py-8 sm:px-12 sm:py-11">
      <p className="type-label text-body">Pattern · seen 3× this week</p>
      <p className="mt-5 font-serif text-[1.375rem] leading-[1.55] text-ink sm:text-[1.875rem]">
        You’ve circled this same decision three times this week. You <PenMark>already know</PenMark>
        {" "}the answer — you just haven’t said&nbsp;it&nbsp;
        <PenMark kind="highlight" className="[--wipe-delay:700ms]">
          out loud
        </PenMark>
        .
      </p>
      <p className="type-hand mt-6 text-pen sm:text-[2.5rem]">
        <Written delay={1500}>— want to look?</Written>
      </p>
    </div>
    <figcaption className="type-secondary mt-5 text-body">
      {tidy("One underline on the claim, one highlight on the line to notice, and the hand for the aside.")}
    </figcaption>
  </figure>
);

/** The one rule, in the book's card (p. 13): panel, 12 px corners, a 4 px pen bar down its edge. */
const OneRule = () => (
  <div className="relative overflow-hidden rounded-xl bg-panel py-8 pr-8 pl-9 sm:py-10 sm:pr-10 sm:pl-12">
    <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-pen" />
    <p className="type-label text-pen">The one rule</p>
    <p className="type-title mt-3 text-[1.625rem] font-semibold text-ink sm:text-[2.125rem]">Challenge the pattern, never the&nbsp;person.</p>
    <p className="type-secondary mt-4 text-body">
      {tidy("The blade points only at observed, cited behaviour: never at a trait, a motive or a mental state. A line that reads as an indictment on its own fails.")}
    </p>
  </div>
);

export const Voice = ({ className }: { className?: string }) => (
  <div className={cn(PAGE, className)}>
    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
      <CallOut />
      <OneRule />
    </div>

    <p className="type-label mt-24 text-pen sm:mt-32">Principles · 4 of 8</p>
    <p className="type-secondary mt-1 text-body">Struck lines are the ones we never send.</p>
    <ul className="mt-8 grid gap-x-14 gap-y-12 md:grid-cols-2">
      {PRINCIPLES.map((p) => (
        <li key={p.name} className="border-t-2 border-rule pt-6">
          <p className="font-serif text-[1.125rem] leading-[1.4] font-semibold text-ink">{p.name}</p>
          <p className="mt-3 font-serif text-[1.25rem] leading-[1.45] text-ink sm:text-[1.375rem]">{tidy(p.send)}</p>
          <StruckLine className="mt-3 font-serif text-[1.0625rem] leading-[1.55] text-body sm:text-[1.125rem]">
            {tidy(p.never)}
          </StruckLine>
        </li>
      ))}
    </ul>
  </div>
);
