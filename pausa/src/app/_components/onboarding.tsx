/* eslint-disable @next/next/no-img-element -- the book's own illustrations and pen marks, as SVG */
import type { ReactNode } from "react";
import { cn } from "./cn";
import { PenMark } from "./pen-mark";
import { Phone } from "./phone";
import { PAGE } from "./story";

/* The three onboarding screens (brand book p. 23), built live in the book's
 * white phone instead of shown as cropped screenshots: the drawing first,
 * then a label, a line with its one highlight, a plain sentence, a line in
 * the hand, the pager and the button. Sized in container units, so the
 * screen scales with the phone. */

type Step = {
  illo: string;
  illoWidth: string;
  alt: string;
  kicker: string;
  title: ReactNode;
  body: string;
  hand: ReactNode;
  button: string;
};

const STEPS: readonly Step[] = [
  {
    illo: "/onboarding/illo-1.svg",
    illoWidth: "w-[27cqw]",
    alt: "A head in profile with a knot of thought inside it.",
    kicker: "Write or talk",
    title: (
      <>
        Say it <PenMark kind="highlight">however</PenMark> it comes out.
      </>
    ),
    body: "Type a line, talk it through, or send it on WhatsApp. No prompt, no mood gate",
    hand: "just start!",
    button: "Next",
  },
  {
    illo: "/onboarding/illo-2.svg",
    illoWidth: "w-[34cqw]",
    alt: "The tangle, drawn in one blue line.",
    kicker: "Pausa listens",
    title: (
      <>
        Pausa <PenMark kind="highlight">reads</PenMark> it back.
      </>
    ),
    body: "It pays attention across weeks and finds the pattern",
    hand: (
      <>
        you keep <PenMark kind="circle">circling</PenMark>
      </>
    ),
    button: "Next",
  },
  {
    illo: "/onboarding/illo-3.svg",
    illoWidth: "w-[23cqw]",
    alt: "A reader peering over a stack of pages.",
    kicker: "Gives you clarity",
    title: (
      <>
        And says the true <PenMark kind="highlight">thing.</PenMark>
      </>
    ),
    body: "Not another to-do: the one honest sentence you’ve been avoiding",
    hand: (
      <span className="relative inline-block">
        so you can move
        <img aria-hidden alt="" src="/pen/underline-18.svg" className="absolute -bottom-[1.2cqw] left-[18%] h-[2.2cqw] w-[90%] max-w-none" />
      </span>
    ),
    button: "Start writing",
  },
];

const Screen = ({ step, index }: { step: Step; index: number }) => (
  <div className="absolute inset-0 flex flex-col items-center px-[9%] pt-[30%] pb-[11%] text-center">
    <img src={step.illo} alt={step.alt} className={cn("mark-multiply h-auto", step.illoWidth)} />
    <p className="mt-[19cqw] font-mono text-[length:2.6cqw] font-medium tracking-[0.12em] text-pen uppercase">{step.kicker}</p>
    <p className="mt-[2.4cqw] font-serif text-[length:7.6cqw] leading-[1.14] tracking-[-0.01em] text-ink">{step.title}</p>
    <p className="mt-[3.4cqw] font-sans text-[length:3.7cqw] leading-[1.45] text-ink">{step.body}</p>
    <p className="mt-[4.6cqw] font-hand text-[length:5.4cqw] leading-none font-bold text-pen">{step.hand}</p>
    <div aria-hidden className="mt-auto flex items-center gap-[1.6cqw]">
      {[0, 1, 2].map((dot) => (
        <span key={dot} className={cn("block h-[1.6cqw] rounded-full", dot === index ? "w-[4.4cqw] bg-pen" : "w-[1.6cqw] bg-ash")} />
      ))}
    </div>
    <span
      aria-hidden
      className={cn(
        "mt-[6cqw] flex h-[12.5cqw] items-center justify-center rounded-[3.4cqw] bg-pen font-sans text-[length:4.2cqw] font-medium text-white",
        index === 2 ? "w-[68%]" : "w-[50%]",
      )}
    >
      {step.button}
    </span>
  </div>
);

export const Onboarding = ({ className }: { className?: string }) => (
  <ul className={cn(PAGE, "grid gap-12 sm:grid-cols-3 sm:gap-8 lg:gap-10", className)}>
    {STEPS.map((step, i) => (
      <li key={step.kicker} className="mx-auto w-full max-w-[22rem] sm:max-w-none">
        <Phone>
          <Screen step={step} index={i} />
        </Phone>
      </li>
    ))}
  </ul>
);
