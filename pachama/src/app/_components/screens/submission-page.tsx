"use client";

import { useEffect, useRef, useState } from "react";
import { MdArrowBack, MdArrowForward, MdCheck, MdCheckCircle, MdPause, MdPlayArrow } from "react-icons/md";
import { Button } from "../banyan/button";
import { BN } from "../banyan/ui";
import { cn } from "../cn";
import { Brazil } from "./brazil-flag";
import { LandSuitability } from "./land-suitability";
import { STAGES } from "./screening-data";
import { Proposal, ProjectInfo, Questionnaire } from "./submission-parts";

/* Submitting a new project to Symbiosis's sourcing event, the way Source
 * lays it out once the submission is started: the project's page, its four
 * stages still ahead, and four parts to fill in (the questionnaire, a
 * commercial proposal, the land's suitability and the project's info),
 * then submit. Rebuilt live from the Source Figma. Once it's reached it
 * plays itself, on a loop: each part fills in, it's submitted, and it
 * starts again. Focus in it holds it; a click or a key in it hands it
 * over, to go through by hand, and Play picks the loop up again. With less
 * motion it waits for Play. The flow chart's land suitability link opens
 * that part. */
const PARTS = ["Questionnaire", "Commercial proposals", "Land suitability", "Project info"] as const;
const VIEWS = [Questionnaire, Proposal, LandSuitability, ProjectInfo];
const LAND = PARTS.indexOf("Land suitability");
// How long each part plays, in seconds, and the submitted moment after.
const PLAY_S = [3.6, 3.2, 6, 3.2];
const SENT_S = 3;
const sum = (list: number[]) => list.reduce((a, b) => a + b, 0);
const CYCLE_S = sum(PLAY_S) + SENT_S;
const TICK_MS = 100;

/** The first n parts, by index. */
const first = (n: number) => new Set(Array.from({ length: n }, (_, i) => i));

/** Where the playing page is, a moment into its loop. */
const playing = (clock: number) => {
  let t = clock % CYCLE_S;
  for (let i = 0; i < PLAY_S.length; i++) {
    if (t < PLAY_S[i]) return { part: i, fill: t / PLAY_S[i], sent: false };
    t -= PLAY_S[i];
  }
  return { part: PLAY_S.length - 1, fill: 1, sent: true };
};

export const SubmissionPage = ({ className }: { className?: string }) => {
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  // Not playing until it's reached (so it reads whole without script).
  const [play, setPlay] = useState(false);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const [clock, setClock] = useState(0);
  const [part, setPart] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const [sent, setSent] = useState(false);
  const go = (i: number) => {
    setPart(i);
    setSeen((s) => new Set(s).add(i));
  };

  // Reached: it plays (unless asked for less motion).
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const reached = entry.intersectionRatio >= 0.3;
        setInView(reached);
        if (reached && !started) {
          started = true;
          setPlay(true);
        }
      },
      { threshold: [0, 0.3] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!play || held || !inView) return;
    const id = window.setInterval(() => setClock((c) => c + TICK_MS / 1000), TICK_MS);
    return () => window.clearInterval(id);
  }, [play, held, inView]);

  const now = play ? playing(clock) : null;
  const shown = now ? now.part : part;
  const done = now ? first(now.sent ? PARTS.length : now.part) : seen;
  const isSent = now ? now.sent : sent;
  // A click or a key in it: it stops playing, where it is, to go on by hand.
  const takeOver = () => {
    if (!now) return;
    setPlay(false);
    setPart(now.part);
    setSeen(first(now.part + 1));
    setSent(now.sent);
  };
  // Play goes on from the part that's open.
  const resume = () => {
    setClock(sum(PLAY_S.slice(0, part)));
    setSent(false);
    setPlay(true);
  };

  // Playing, the open part's tab stays in sight (on a phone the tabs scroll).
  useEffect(() => {
    const list = tabs.current;
    const tab = list?.children[shown];
    if (!play || !list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: list.scrollLeft + tab.getBoundingClientRect().left - list.getBoundingClientRect().left - 16, behavior: "smooth" });
  }, [play, shown]);

  // Arriving from the flow chart's land suitability link opens that part.
  useEffect(() => {
    const open = () => {
      if (window.location.hash !== "#land-suitability") return;
      setPlay(false);
      setPart(LAND);
      setSeen((s) => new Set(s).add(LAND));
    };
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);

  const last = shown === PARTS.length - 1;
  return (
    <div className={cn("relative rounded-[20px] bg-white p-4 text-bn-heavy shadow-[0_24px_80px_rgb(20_26_23/0.12)] ring-1 ring-black/5 sm:p-8", className)}>
      {/* Outside the part that hands it over, so it can pause and play. */}
      <button
        type="button"
        onClick={now ? takeOver : resume}
        className={cn("absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] font-bold uppercase ring-1 ring-bn-grey hover:bg-bn-grey-lightest sm:top-8 sm:right-8", BN.focus)}
      >
        {now ? <MdPause aria-hidden className="size-4" /> : <MdPlayArrow aria-hidden className="size-4" />}
        {now ? "Pause" : "Play"}
      </button>
      <div
        ref={root}
        onClickCapture={takeOver}
        onKeyDownCapture={takeOver}
        onFocus={() => setHeld(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false);
        }}
      >
        <p className="flex items-center gap-3 text-[13px]">
          <MdArrowBack aria-hidden className="size-5" />
          <span className="flex items-center gap-1.5">
            <Brazil /> Brazil
          </span>
          <span className="border-l border-bn-grey-light pl-3">10,039 hectares</span>
        </p>
        <h4 className="mt-2 font-display text-[36px] leading-none font-bold sm:text-[44px]">Verde Do Bahia</h4>
        <p className="mt-2 flex gap-3 text-[13px] text-bn-medium">
          Native reforestation <span className="border-l border-bn-grey-light pl-3">VM0047</span>
        </p>
        {/* The stages it's headed for: none started until it's submitted. */}
        <ol aria-label="Stages" className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          {STAGES.slice(1).map((stage, i) => {
            const on = isSent && i === 0;
            return (
              <li key={stage} className="flex items-center gap-2 font-mono text-[10px] leading-4 font-bold uppercase">
                <span aria-hidden className={cn("grid size-6 place-items-center rounded-full ring-inset transition-shadow", on ? "ring-2 ring-bn-green-dark" : "ring-1 ring-bn-grey")}>
                  {on ? <span className="size-2 rounded-full bg-bn-green-dark" /> : null}
                </span>
                <span className={on ? "text-bn-heavy" : "text-bn-medium"}>{stage}</span>
                <span className="sr-only">{on ? ", in progress" : ", not started"}</span>
                {i < 3 ? <span aria-hidden className="h-px w-6 bg-bn-grey" /> : null}
              </li>
            );
          })}
        </ol>

        <div ref={tabs} role="tablist" aria-label="Submission" className="no-scrollbar mt-6 flex overflow-x-auto border-b border-bn-grey-light text-[14px]">
          {PARTS.map((label, i) => (
            <button
              key={label}
              type="button"
              role="tab"
              id={`submission-tab-${i}`}
              aria-selected={shown === i}
              aria-controls={`submission-part-${i}`}
              onClick={() => go(i)}
              className={cn("-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 whitespace-nowrap transition-colors sm:px-5", shown === i ? "border-bn-heavy font-medium" : "border-transparent text-bn-medium hover:text-bn-heavy", BN.focus)}
            >
              {done.has(i) && shown !== i ? <MdCheck aria-hidden className="size-4 text-bn-green-dark" /> : null}
              {label}
            </button>
          ))}
        </div>

        {/* Every part sits in the one cell, the open one shown: the page keeps
            the tallest part's height, so nothing below it jumps as it plays,
            and what's typed in a part stays when another opens. */}
        <div className="mt-6 grid">
          {VIEWS.map((View, i) => (
            <div
              key={PARTS[i]}
              id={`submission-part-${i}`}
              role="tabpanel"
              aria-labelledby={`submission-tab-${i}`}
              className={cn("[grid-area:1/1] transition-[opacity,visibility] duration-500 motion-reduce:transition-none", i === shown ? "visible opacity-100" : "invisible opacity-0")}
            >
              <View fill={i === shown ? now?.fill : undefined} />
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-bn-grey-light pt-5">
          {/* Room for two lines and both buttons throughout, so the footer never changes height. */}
          <p aria-live={now ? "off" : "polite"} className="flex min-h-10 items-center text-[13px] text-bn-medium">
            {isSent ? (
              <span className="flex items-center gap-2 font-medium text-bn-heavy">
                <MdCheckCircle aria-hidden className="size-5 text-bn-green-dark" />
                Submitted to Symbiosis. Screening starts next, against satellite data.
              </span>
            ) : (
              `${done.size + (now && now.fill > 0.95 ? 1 : 0)} of ${PARTS.length} parts filled in`
            )}
          </p>
          <span className="flex gap-3">
            <Button hierarchy="secondary" onClick={() => go(shown - 1)} className={cn(shown === 0 && "invisible")}>
              Back
            </Button>
            {last ? (
              <Button disabled={isSent} icon={<MdCheck aria-hidden className="size-5" />} iconPosition="trailing" onClick={() => setSent(true)}>
                {/* On a phone, just Submit: the whole label is wider than the card. */}
                {isSent ? "Submitted" : <>Submit<span className="max-sm:hidden"> to Symbiosis</span></>}
              </Button>
            ) : (
              <Button icon={<MdArrowForward aria-hidden className="size-5" />} iconPosition="trailing" onClick={() => go(shown + 1)}>
                Next
              </Button>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
