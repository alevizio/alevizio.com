"use client";

import { useRef } from "react";
import { MdCheck, MdErrorOutline } from "react-icons/md";
import { cn } from "./cn";
import { Typed } from "./panel";
import { Caret, Cta, Field, Pointer, type CtaState } from "./ui";
import { useLoop } from "./use-loop";
import { WORDMARK_LETTERS, WORDMARK_MARK, WORDMARK_VIEWBOX } from "./wordmark-paths";

/* The hero's pieces, moving: the wordmark with its mark turning, the button
 * through the four states the file draws for it, the headline arriving word
 * by word, and the email field through its states. */

export const Wordmark = ({ className }: { className?: string }) => (
  <svg viewBox={WORDMARK_VIEWBOX} role="img" aria-label="Earthscale" className={cn("h-auto w-full max-w-[16rem] text-mist", className)}>
    <g className="origin-center [transform-box:fill-box] motion-safe:animate-[spin_18s_linear_infinite]">
      {WORDMARK_MARK.map((d, i) => (
        <path key={i} d={d} fill="currentColor" />
      ))}
    </g>
    {WORDMARK_LETTERS.map((d, i) => (
      <path key={i} d={d} fill="currentColor" />
    ))}
  </svg>
);

const STATES: { state: CtaState; name: string }[] = [
  { state: "default", name: "Default" },
  { state: "hover", name: "Hover" },
  { state: "pressed", name: "Pressed" },
  { state: "disabled", name: "Disabled" },
];
// Disabled for a beat, ready, the pointer over it, pressed, let go, at rest.
const BUTTON_STEPS = [1400, 1100, 1000, 380, 900, 1300] as const;
const BUTTON_STATE: CtaState[] = ["disabled", "default", "hover", "pressed", "hover", "default"];

export const ButtonStates = () => {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, BUTTON_STEPS);
  const state = BUTTON_STATE[step];
  const near = step >= 2 && step <= 4;

  return (
    <div ref={ref} className="grid justify-items-center gap-7">
      <span className="relative">
        <Cta state={state} />
        <Pointer
          className={cn(
            "absolute top-8 left-32 transition-[translate,opacity,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            near ? "translate-x-0 translate-y-0 opacity-100" : "translate-x-10 translate-y-8 opacity-0",
            state === "pressed" && "scale-90",
          )}
        />
      </span>
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 font-mono text-[10px] tracking-[0.08em] uppercase">
        {STATES.map(({ state: s, name }) => (
          <li key={s} className={cn("transition-colors duration-300", s === state ? "text-mint" : "text-haze")}>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};

const WORDS = ["Developer", "Tools", "for", "Earth", "Intelligence"];
// Gone, then in and held: it rests in.
const HEADLINE_STEPS = [900, 5600] as const;
const RISE = "transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

export const Headline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const on = useLoop(ref, HEADLINE_STEPS) === 1;
  const state = on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0";

  return (
    <div ref={ref}>
      <p className="font-sans text-[clamp(2rem,3vw,2.75rem)] leading-none text-mist">
        {WORDS.map((word, i) => (
          <span key={word} className={cn("inline-block", RISE, state)} style={{ transitionDelay: on ? `${i * 90}ms` : "0ms" }}>
            {word}&nbsp;
          </span>
        ))}
      </p>
      <p className={cn("mt-4 font-sans text-[clamp(1.0625rem,1.4vw,1.375rem)] leading-[1.4] tracking-[-0.02em] text-mint", RISE, state)} style={{ transitionDelay: on ? "560ms" : "0ms" }}>
        Build next-gen geospatial products with cloud-native tools.
      </p>
    </div>
  );
};

const EMAIL = "felix@gmail.com";
// Empty, typed into, sent, adding, then added, or the error.
const FIELD_STEPS = [1400, 2000, 600, 1400, 2400] as const;

const Spinner = () => <span className="size-5 rounded-full border-2 border-night/25 border-t-night motion-safe:animate-spin" />;

export const EmailLoop = ({ ends = "added", className }: { ends?: "added" | "error"; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, FIELD_STEPS);
  const end = step === 4;
  const added = end && ends === "added";
  const label = step === 3 ? "Adding" : end ? (added ? "Added" : "Error") : "Get Started";
  const icon = step === 3 ? <Spinner /> : added ? <MdCheck aria-hidden className="size-5" /> : end ? <MdErrorOutline aria-hidden className="size-5" /> : undefined;

  return (
    <div ref={ref} className={cn("w-full", className)}>
      <Field>
        <span className="relative min-w-0 flex-1 font-sans text-[14px] leading-none text-mist">
          <span className={cn("absolute inset-y-0 left-0 flex items-center transition-opacity duration-300", step === 0 ? "opacity-50" : "opacity-0")}>Enter your email...</span>
          <span className={cn("block truncate transition-opacity duration-300", added || step === 0 ? "opacity-0" : "opacity-100")}>
            <Typed text={EMAIL} on={step >= 1} />
            {step === 1 ? <Caret /> : null}
          </span>
          <span className={cn("absolute inset-y-0 left-0 flex items-center transition-opacity duration-300", added ? "opacity-100" : "opacity-0")}>Email added!</span>
        </span>
        <Cta state={step === 2 ? "pressed" : "default"} icon={icon}>
          {label}
        </Cta>
      </Field>
    </div>
  );
};
