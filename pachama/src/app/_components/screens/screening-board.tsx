"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MdCheck, MdReplay } from "react-icons/md";
import { BN } from "../banyan/ui";
import { cn } from "../cn";
import { GUTTER_START } from "../slider";
import { STAGES, SUBMISSIONS, type Submission } from "./screening-data";
import { BADGE, FAIL, PASS, ScreeningDetail } from "./screening-detail";

/* Every submission, screened: Source's submissions as a pipeline board,
 * rebuilt live from the Source Figma. When it's reached, a round of
 * submissions plays through it: each arrives, is screened (a scan, then
 * its verdict), and what passes moves on to DMRV core diligence and comes
 * back with no flags; the first goes on to preliminary diligence. Below,
 * the evaluation of whichever submission is picked, Verde Do Bahia's to
 * begin with. Replay runs it again; with less motion it's shown done. On
 * a phone the board scrolls sideways, to the window's edges. */
// Arrivals 0.55 s apart, each stage about a second: no lane ever holds more than four.
const GAP_S = 0.55;
const END_S = 6.6;
// A card that moved in the last stretch rides above the rest, so it never passes under them.
const MOVING_S = 0.8;
const TICK_MS = 80;
// Literal classes for Tailwind: a column's left edge, a row's top.
const LEFT = ["left-[0%]", "left-[20%]", "left-[40%]", "left-[60%]", "left-[80%]"];
const TOP = ["top-0", "top-[6rem]", "top-[12rem]", "top-[18rem]"];

type At = { col: number; since: number; shown: boolean; scanning: boolean; verdict: boolean; clear: boolean };
/** Where a submission is at time t, in seconds: its column, since when, and what it shows. */
const at = (s: Submission, i: number, t: number): At => {
  const a = i * GAP_S;
  const pass = Boolean(s.priority);
  const step = (col: number, since: number, scanning = false, verdict = false, clear = false) => ({ col, since, shown: true, scanning, verdict, clear });
  if (t < a) return { ...step(0, Infinity), shown: false };
  if (t < a + 1) return step(0, a);
  if (t < a + 2) return step(1, a + 1, true);
  if (!pass || t < a + 2.6) return step(1, a + 1, false, true);
  if (t < a + 3.6) return step(2, a + 2.6, true, true);
  if (s.reached === 2 || t < a + 4.6) return step(2, a + 2.6, false, true, true);
  return step(3, a + 4.6, false, true, true);
};

/** Each submission's place at time t: its state and its row in its column. */
const layout = (t: number) => {
  const states = SUBMISSIONS.map((s, i) => at(s, i, t));
  const rows = states.map((st, i) => (st.shown ? states.filter((o, j) => o.shown && o.col === st.col && (o.since < st.since || (o.since === st.since && j < i))).length : TOP.length - 1));
  return { states, rows };
};

export const ScreeningBoard = ({ className }: { className?: string }) => {
  const root = useRef<HTMLDivElement>(null);
  // The board starts done, for no script and less motion; it empties just
  // before it's reached, and plays through once it's well in view.
  const [t, setT] = useState(END_S);
  const [picked, setPicked] = useState(SUBMISSIONS[0].id);
  const run = useRef<number | null>(null);

  const play = useCallback(() => {
    if (run.current !== null) window.clearInterval(run.current);
    const start = performance.now();
    setT(0);
    run.current = window.setInterval(() => {
      const now = (performance.now() - start) / 1000;
      if (now >= END_S && run.current !== null) {
        window.clearInterval(run.current);
        run.current = null;
      }
      setT(Math.min(END_S, now));
    }, TICK_MS);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (started) return;
        if (entry.intersectionRatio >= 0.4) {
          started = true;
          observer.disconnect();
          play();
        } else if (entry.isIntersecting) setT(-1);
      },
      { threshold: [0, 0.4] },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (run.current !== null) window.clearInterval(run.current);
    };
  }, [play]);

  const { states, rows } = layout(t);
  const screened = states.filter((st) => st.verdict).length;
  const passed = SUBMISSIONS.filter((s, i) => s.priority && states[i].verdict).length;
  const selected = SUBMISSIONS.find((s) => s.id === picked) ?? SUBMISSIONS[0];

  return (
    <div ref={root} className={cn("text-bn-heavy lg:rounded-[20px] lg:bg-white lg:p-8 lg:shadow-[0_24px_80px_rgb(20_26_23/0.12)] lg:ring-1 lg:ring-black/5", className)}>
      <p className="flex items-center gap-2 text-[12px] text-bn-medium">
        <span className="rounded-[4px] bg-bn-grey-light px-1.5 py-0.5 font-mono text-[10px] font-bold text-bn-heavy uppercase">Open</span>
        Closes March 31, 2025
      </p>
      <h4 className="mt-2 font-display text-[30px] leading-none font-bold sm:text-[40px]">Afforestation, Reforestation, Revegetation 2025-2065</h4>
      <div aria-hidden className="mt-5 flex gap-6 border-b border-bn-grey-light text-[14px]">
        <span className="-mb-px border-b-2 border-bn-heavy pb-3 font-medium">Submissions</span>
        <span className="pb-3 text-bn-medium">Questionnaire</span>
        <span className="pb-3 text-bn-medium">Event settings</span>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] tracking-[0.04em] text-bn-medium uppercase">
          {screened} of {SUBMISSIONS.length} screened · {passed} passed
        </p>
        <button type="button" onClick={play} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] font-bold uppercase ring-1 ring-bn-grey hover:bg-bn-grey-lightest", BN.focus)}>
          <MdReplay aria-hidden className="size-4" /> Replay
        </button>
      </div>

      {/* The board: in the frame from lg up; below, a sideways scroller to the window's edges. */}
      <div className={cn("mt-4 max-lg:mx-[calc(50%-50vw)] max-lg:overflow-x-auto max-lg:pr-6 max-lg:pb-2 lg:pl-0", GUTTER_START)}>
        <div className="relative min-w-[60rem] lg:min-w-0">
          <div aria-hidden className="grid grid-cols-5">
            {STAGES.map((stage, c) => (
              <p key={stage} className="flex items-center gap-2 px-1.5 pb-3 text-[12px] font-bold">
                {stage}
                <span className="rounded-full bg-bn-grey-light px-1.5 text-[11px] font-medium">{states.filter((st) => st.shown && st.col === c).length}</span>
              </p>
            ))}
          </div>
          <ul aria-label="Submissions" className="relative h-[24rem]">
            {STAGES.map((stage, c) => (
              <li key={stage} aria-hidden className={cn("absolute inset-y-0 w-[20%] px-1.5", LEFT[c])}>
                <span className="block size-full rounded-[14px] bg-bn-grey-lightest" />
              </li>
            ))}
            {SUBMISSIONS.map((s, i) => {
              const st = states[i];
              const pass = Boolean(s.priority);
              return (
                <li
                  key={s.id}
                  className={cn(
                    "absolute w-[20%] px-3 pt-2 transition-[left,top,opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                    LEFT[st.col],
                    TOP[rows[i]],
                    t - st.since < MOVING_S && "z-10",
                    st.shown ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0",
                  )}
                >
                  <button
                    type="button"
                    aria-pressed={picked === s.id}
                    aria-label={`${s.name}, ${s.type}: ${pass ? `passed screening, priority ${s.priority}` : "didn't pass screening"}. Show its evaluation.`}
                    onClick={() => setPicked(s.id)}
                    className={cn(
                      "relative block h-[5.25rem] w-full overflow-hidden rounded-[12px] p-3 text-left ring-1 transition-[box-shadow,background-color]",
                      // What stops at screening goes quiet: a grey card, its text still in full contrast.
                      st.verdict && !pass ? "bg-bn-grey-light" : "bg-white",
                      picked === s.id ? "ring-2 ring-bn-green-dark" : "ring-bn-grey-light hover:ring-bn-grey",
                      BN.focus,
                    )}
                  >
                    <span className="block truncate text-[14px] leading-5 font-bold">{s.name}</span>
                    <span className="block truncate text-[12px] leading-4 text-bn-medium">{pass || !st.verdict ? s.type : "Didn't pass screening"}</span>
                    <span className="mt-2 flex gap-1.5">
                      {st.verdict ? <span className={cn(BADGE, pass ? PASS : FAIL)}>{pass ? `Pass · P${s.priority}` : "Fail"}</span> : null}
                      {st.scanning ? <span className={cn(BADGE, "bg-bn-grey-light text-bn-medium")}>{st.verdict ? "Diligence" : "Screening"}</span> : null}
                      {st.clear && st.col === 2 ? (
                        <span className={cn(BADGE, "bg-bn-green-lightest text-bn-heavy")}>
                          <MdCheck aria-hidden className="size-3" /> No flags
                        </span>
                      ) : null}
                      {st.col === 3 ? <span className={cn(BADGE, "bg-bn-indigo-lightest text-bn-heavy")}>In progress</span> : null}
                    </span>
                    {/* While it's being checked, a scan runs across it. */}
                    {st.scanning ? <span aria-hidden className="absolute inset-y-0 left-[-40%] w-[40%] bg-[linear-gradient(90deg,transparent,rgb(129_241_142/0.35),transparent)] motion-safe:animate-[scan_1s_ease-in-out_infinite]" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {selected.name}&rsquo;s evaluation
      </p>
      <ScreeningDetail key={selected.id} s={selected} className="mt-6" />
    </div>
  );
};
