"use client";

import { useEffect, useState, type RefObject } from "react";

/** A sequence that plays itself: the step index, advancing through the
 *  given lengths (ms) and starting over, while the element is on screen.
 *  Off screen it holds; with less motion asked for it rests on the last
 *  step, which every panel draws as its finished state. */
export const useLoop = (ref: RefObject<HTMLElement | null>, lengths: readonly number[]) => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setStep(lengths.length - 1));
      return () => cancelAnimationFrame(raf);
    }
    const sight = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), { threshold: 0.3 });
    sight.observe(el);
    return () => sight.disconnect();
  }, [ref, lengths.length]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setStep((s) => (s + 1) % lengths.length), lengths[step]);
    return () => window.clearTimeout(timer);
  }, [playing, step, lengths]);

  return step;
};
