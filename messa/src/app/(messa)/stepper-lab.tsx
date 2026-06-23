"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "./cn";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

/**
 * The Messa "how it works" stepper, rebuilt live (client direction 2026-06-16)
 * so the reader can watch it switch, see every discrete state, and read how it
 * does it. Faithful port of the real mechanic: an rAF progress timer fills the
 * connector for the active step, auto-advances at the end and loops; an
 * IntersectionObserver gates it so it never runs off-screen; hover or a click
 * on the active step pauses it, a click on any other jumps. Below it, the
 * states are taken apart the way the 3D button and glass nav are.
 */

type Step = {
  number: string;
  title: string;
  description: string;
  icon: string;
};

/** Verbatim from messa-landing's stepData (lib/landing-data). */
const STEPS: readonly Step[] = [
  {
    number: "01",
    title: "Know what to look for",
    icon: "file-text",
    description:
      "Messa analyzes the role and suggests the skill sets that matter, the questions that reveal them, and how to split focus across interviewers.",
  },
  {
    number: "02",
    title: "Shortlist with confidence",
    icon: "filter",
    description:
      "Messa reads the job description and distills the criteria. Your team approves. Every application scored against those criteria, with reasoning.",
  },
  {
    number: "03",
    title: "Stay sharp in the conversation",
    icon: "message",
    description:
      "Sidekick knows the candidate's profile and what your team is assessing, surfacing the right questions and follow-ups the moment they matter.",
  },
  {
    number: "04",
    title: "Decide with evidence",
    icon: "circle-check",
    description:
      "Your team makes the call. Messa drafts the scorecard from the conversation, grounded in evidence. Everyone decides from the same facts.",
  },
];

/* Shortened from the live 8.5–12.4s holds so the switch is watchable in the
 * case study; the real cadence is named in the notes below. */
const DEMO_DURATIONS = [3600, 3600, 3000, 3600];

const Check = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M3 8.5l3 3 7-7"
      stroke="white"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PauseIcon = () => (
  <svg width={12} height={12} viewBox="0 0 14 14" fill="none" aria-hidden>
    <rect x="2.5" y="2" width="3" height="10" rx="0.75" fill="white" />
    <rect x="8.5" y="2" width="3" height="10" rx="0.75" fill="white" />
  </svg>
);

const PlayIcon = () => (
  <svg width={12} height={12} viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M3.5 2L12 7L3.5 12V2Z" fill="white" />
  </svg>
);

/** The row of circles + connectors. Interactive for the live demo; static
 * (plain spans, no hover) for the frozen state small-multiples. */
const StepperRow = ({
  activeStep,
  progress,
  interactive = false,
  paused = false,
  onStepClick,
  onTogglePause,
  className,
}: {
  activeStep: number;
  progress: number;
  interactive?: boolean;
  paused?: boolean;
  onStepClick?: (i: number) => void;
  onTogglePause?: () => void;
  className?: string;
}) => (
  <div className={cn("flex items-center justify-center", className)}>
    {STEPS.map((step, i) => {
      const completed = i < activeStep;
      const isActive = i === activeStep;
      const fill = completed ? 1 : isActive ? progress : 0;
      const circle = cn(
        "relative flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold",
        completed && "bg-[#5A6B8F] text-white",
        isActive && "bg-[#5A6B8F] text-white ring-4 ring-[#5A6B8F]/20",
        !completed && !isActive && "border-2 border-[#E8D9C5] bg-white text-[#A3A19E]",
        interactive &&
          "group cursor-pointer transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5A6B8F]",
      );
      return (
        <div key={step.number} className="flex items-center">
          {interactive ? (
            <button
              type="button"
              onClick={() => (isActive ? onTogglePause?.() : onStepClick?.(i))}
              aria-label={
                isActive
                  ? `Step ${step.number}, ${step.title} — ${paused ? "play" : "pause"}`
                  : `Jump to step ${step.number}, ${step.title}`
              }
              aria-current={isActive ? "step" : undefined}
              className={circle}
            >
              {completed ? (
                <Check />
              ) : isActive ? (
                <>
                  {/* Number normally; pause/play revealed on hover — the real
                    * component's affordance for "this one's running." */}
                  <span className="transition-opacity duration-150 group-hover:opacity-0">
                    {i + 1}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    {paused ? <PlayIcon /> : <PauseIcon />}
                  </span>
                </>
              ) : (
                i + 1
              )}
            </button>
          ) : (
            <span aria-hidden className={circle}>
              {completed ? <Check /> : i + 1}
            </span>
          )}
          {i < STEPS.length - 1 && (
            <div className="mx-1.5 h-[3px] w-10 overflow-hidden rounded-full bg-[#E8D9C5] sm:w-20">
              <div
                className="h-full rounded-full bg-[#5A6B8F]"
                style={{
                  width: `${fill * 100}%`,
                  transition: completed ? "width 0.3s ease-out" : "none",
                }}
              />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export const StepperLab = ({ className }: { className?: string }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const pausedRef = useRef(false);
  const activeStepRef = useRef(0);

  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const goToStep = useCallback((i: number) => {
    if (i === activeStepRef.current) return;
    cancelAnimationFrame(rafRef.current);
    setActiveStep(i);
  }, []);

  const startTimer = useCallback(() => {
    startRef.current = performance.now();
    pausedRef.current = false;
    const tick = () => {
      if (pausedRef.current) return;
      const elapsed = performance.now() - startRef.current;
      const p = Math.min(elapsed / DEMO_DURATIONS[activeStepRef.current], 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        goToStep(
          activeStepRef.current < STEPS.length - 1
            ? activeStepRef.current + 1
            : 0,
        );
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [goToStep]);

  /* Reset the fill the moment a fresh run starts (step change / scroll-in /
   * unpause), via the "adjust state on change" render pattern — no cascading
   * setState in the effect, and the new step never commits a stale fill. */
  const running = inView && !paused && !reducedMotion;
  const [prevRun, setPrevRun] = useState({ step: activeStep, running });
  if (prevRun.step !== activeStep || prevRun.running !== running) {
    setPrevRun({ step: activeStep, running });
    if (running) setProgress(0);
  }

  useEffect(() => {
    if (!running) {
      cancelAnimationFrame(rafRef.current);
      pausedRef.current = true;
      return;
    }
    startTimer();
    return () => cancelAnimationFrame(rafRef.current);
  }, [activeStep, running, startTimer]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <section className={className} aria-label="The Messa how-it-works stepper">
      <div className="mx-auto max-w-3xl px-6" ref={sectionRef}>
        <h3 className="story-serif text-2xl tracking-tight text-[#0A0A0B]">
          The stepper, switching itself
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6E6B68]">
          The product&apos;s four steps, rebuilt live from the real component —
          it advances on its own, fills the connector, and loops. Hover to
          pause, or click a step to jump.
        </p>

        {/* Live, interactive — pause on hover, like the real component. */}
        <div
          className="mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <StepperRow
            interactive
            activeStep={activeStep}
            progress={progress}
            paused={paused}
            onStepClick={goToStep}
            onTogglePause={() => setPaused((p) => !p)}
          />
        </div>

        {/* The stepper, peeled apart — its states and controls in one row, the
          * way the 3D button and glass nav are taken apart. */}
        <figure className="mt-12">
          <p className="font-mono text-xs uppercase tracking-widest text-[#5A6B8F]">
            The stepper, state by state
          </p>
          <ol className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#E8D9C5] bg-[#E8D9C5] sm:grid-cols-5">
            {[
              {
                n: "01",
                name: "Upcoming",
                does: "Not run yet — click to jump here.",
                visual: (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#E8D9C5] bg-white text-[11px] font-bold text-[#A3A19E]">
                    3
                  </span>
                ),
              },
              {
                n: "02",
                name: "Active",
                does: "Running now, on a timer.",
                visual: (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5A6B8F] text-[11px] font-bold text-white ring-2 ring-[#5A6B8F]/25">
                    2
                  </span>
                ),
              },
              {
                n: "03",
                name: "Connector",
                does: "Fills as the timer counts down.",
                visual: (
                  <span className="block h-[3px] w-10 overflow-hidden rounded-full bg-[#E8D9C5]">
                    <span className="block h-full w-1/2 rounded-full bg-[#5A6B8F]" />
                  </span>
                ),
              },
              {
                n: "04",
                name: "Pause / play",
                does: "Hover, or click the active step.",
                visual: (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5A6B8F]">
                    <PauseIcon />
                  </span>
                ),
              },
              {
                n: "05",
                name: "Done",
                does: "Finished — its connector solid.",
                visual: (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5A6B8F]">
                    <Check />
                  </span>
                ),
              },
            ].map((s) => (
              <li
                key={s.n}
                className="flex flex-col items-center gap-1.5 bg-white p-3 text-center"
              >
                <span className="flex h-10 w-16 items-center justify-center rounded-md bg-[#FBF0E6]">
                  {s.visual}
                </span>
                <span className="mt-1 font-mono text-[10px] text-[#5A6B8F]">
                  {s.n}
                </span>
                <span className="text-[12px] font-medium leading-4 text-[#0A0A0B]">
                  {s.name}
                </span>
                <span className="text-[10px] leading-[1.3] text-[#8A847D]">
                  {s.does}
                </span>
              </li>
            ))}
          </ol>
          <figcaption className="mt-3 text-sm leading-6 text-[#6E6B68]">
            Five states, one loop — on screen it runs, the active step counts
            down and fills its connector, then hands off. Hover to pause; click
            any step to jump.
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
