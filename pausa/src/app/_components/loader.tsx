/* eslint-disable @next/next/no-img-element -- the brand book's own tangles, as SVG */
import { cn } from "./cn";
import { Phone } from "./phone";
import { PAGE } from "./story";

/* The loader as the brand book sets it (p. 24): a row of tangles, the one
 * on screen, and its three lines of copy. On the phone the knot never
 * settles: it cycles through the row, a different tangle every beat
 * (globals.css, .loader-frame). Reduced motion holds the first one. */
const FRAMES = ["01", "02", "03", "04", "05", "06", "07", "08", "10"] as const;

// Static classes so Tailwind can see them: one beat (300 ms) per frame.
const DELAYS = [
  "[--frame-delay:0ms]",
  "[--frame-delay:300ms]",
  "[--frame-delay:600ms]",
  "[--frame-delay:900ms]",
  "[--frame-delay:1200ms]",
  "[--frame-delay:1500ms]",
  "[--frame-delay:1800ms]",
  "[--frame-delay:2100ms]",
  "[--frame-delay:2400ms]",
] as const;

const STATES = [
  { kicker: "Going deep", line: "Reading you back.", note: "The default. It names what is happening, in the app’s own verb." },
  { kicker: "Catching up", line: "Going back over it.", note: "For a long wait: it admits the time instead of hiding it." },
  { kicker: "Finding the loop", line: "Looking for the pattern.", note: "When the work is specifically the pattern pass." },
] as const;

export const Loader = ({ className }: { className?: string }) => (
  <div className={cn(PAGE, className)}>
    <ul aria-label="The loader's tangles" className="grid grid-cols-5 items-center gap-x-6 gap-y-8 sm:grid-cols-9">
      {FRAMES.map((f, i) => (
        <li key={f} className="flex flex-col items-center">
          <img src={`/loader/tangle-${f}.svg`} alt="" className="mark-multiply h-14 w-auto sm:h-16" />
          {i === 0 ? <p className="type-label mt-3 hidden whitespace-nowrap text-pen sm:block">Going deep</p> : null}
        </li>
      ))}
    </ul>

    <div className="mt-20 grid items-center gap-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="mx-auto w-full max-w-[22rem] md:mx-0 lg:max-w-[24rem]">
        <Phone>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-[10%] pt-[8%] text-center">
            <div aria-hidden className="relative h-[24cqw] w-[30cqw]">
              {FRAMES.map((f, i) => (
                <img key={f} src={`/loader/tangle-${f}.svg`} alt="" className={cn("loader-frame absolute inset-0 h-full w-full object-contain", DELAYS[i])} />
              ))}
            </div>
            <p className="mt-[7cqw] font-mono text-[length:2.6cqw] font-medium tracking-[0.12em] text-pen uppercase">Going deep</p>
            <p className="mt-[2cqw] font-serif text-[length:6.2cqw] leading-[1.2] text-ink">Reading you back.</p>
            <p className="mt-[1.6cqw] font-serif text-[length:3.8cqw] text-body">Going over months, not minutes.</p>
          </div>
        </Phone>
      </div>
      <div>
        <p className="type-label text-pen">Loader copy</p>
        <ul className="mt-6">
          {STATES.map((s) => (
            <li key={s.kicker} className="border-t border-rule py-7">
              <p className="type-label text-pen">{s.kicker}</p>
              <p className="mt-2 font-serif text-[1.5rem] leading-[1.3] font-semibold text-ink">{s.line}</p>
              <p className="type-secondary mt-1 text-body">{s.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
