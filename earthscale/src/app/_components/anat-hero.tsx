"use client";

import { useRef } from "react";
import { cn } from "./cn";
import { Cta, Pointer, type CtaState } from "./ui";
import { useLoop } from "./use-loop";

/* The hero's pieces, moving: the button through the four states the file
 * draws for it, and the headline arriving word by word. The wordmark has a
 * file of its own (wordmark.tsx), and the email field is the kit's. */

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
