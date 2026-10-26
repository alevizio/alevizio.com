"use client";

import { createContext, useContext, useEffect, useState, type RefObject } from "react";

/** Inside a belt, the loops keep the page's own time instead of their own:
 *  while the belt is on screen every piece is at the step the clock is at,
 *  so a piece and its copy further along always match, and the belt's
 *  loop has no seam. The belt says whether it's playing. */
export const LoopClock = createContext<{ playing: boolean } | null>(null);

/** A sequence that plays itself: the step index, advancing through the
 *  given lengths (ms) and starting over, while the element is on screen.
 *  Off screen it holds; with less motion asked for it rests on the last
 *  step, which every panel draws as its finished state. */
export const useLoop = (ref: RefObject<HTMLElement | null>, lengths: readonly number[]) => {
  const clock = useContext(LoopClock);
  const shared = clock !== null;
  const clockPlaying = clock?.playing ?? false;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setStep(lengths.length - 1));
      return () => cancelAnimationFrame(raf);
    }
    if (shared) return;
    const sight = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), { threshold: 0.3 });
    sight.observe(el);
    return () => sight.disconnect();
  }, [ref, lengths.length, shared]);

  useEffect(() => {
    if (shared || !playing) return;
    const timer = window.setTimeout(() => setStep((s) => (s + 1) % lengths.length), lengths[step]);
    return () => window.clearTimeout(timer);
  }, [shared, playing, step, lengths]);

  // On the clock: the step the page's time falls in, then the next when it comes.
  useEffect(() => {
    if (!clockPlaying) return;
    const total = lengths.reduce((sum, ms) => sum + ms, 0);
    let timer = 0;
    const tick = () => {
      let into = performance.now() % total;
      let at = 0;
      while (into >= lengths[at]) into -= lengths[at++];
      setStep(at);
      timer = window.setTimeout(tick, lengths[at] - into);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [clockPlaying, lengths]);

  return step;
};
