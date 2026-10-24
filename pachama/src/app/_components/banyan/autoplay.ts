"use client";

import { useEffect, type RefObject } from "react";

/** Lets a component show itself off: every `every` ms, while most of it is
 *  on screen, it calls `step` with the component's element (to press one
 *  of its own controls, the way a person would). It holds while the
 *  pointer is over it or focus is inside it, so it never fights someone
 *  using it, and it doesn't run at all for anyone who asked for less
 *  motion. `step` should keep its identity between renders. */
export const useAutoplay = (ref: RefObject<HTMLElement | null>, step: (el: HTMLElement) => void, every: number) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let hovered = false;
    let focused = false;
    const timer = window.setInterval(() => {
      if (visible && !hovered && !focused && !document.hidden) step(el);
    }, every);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.intersectionRatio >= 0.5;
      },
      { threshold: [0, 0.5] },
    );
    observer.observe(el);
    const enter = () => {
      hovered = true;
    };
    const leave = () => {
      hovered = false;
    };
    const focusIn = () => {
      focused = true;
    };
    const focusOut = (e: FocusEvent) => {
      focused = e.relatedTarget instanceof Node && el.contains(e.relatedTarget);
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focusin", focusIn);
    el.addEventListener("focusout", focusOut);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focusin", focusIn);
      el.removeEventListener("focusout", focusOut);
    };
  }, [ref, step, every]);
};

/** Presses the control after the one that's on, among `selector`'s matches
 *  inside the element (the next tab, the next radio), round to the first. */
export const pressNext = (el: HTMLElement, selector: string, isOn: (c: HTMLElement) => boolean) => {
  const all = Array.from(el.querySelectorAll<HTMLElement>(selector));
  if (!all.length) return;
  const at = all.findIndex(isOn);
  all[(at + 1) % all.length].click();
};

/** For a piece on the components' belt that shows itself off: every `ms`,
 *  `onBeat` gets the count of them on the page's clock, the same in both of
 *  the belt's copies, so the copy that closes the loop always matches the
 *  one it takes over from. Each beat should set the piece to a state of its
 *  own (not one step on from the last). It holds while the piece is pointed
 *  at or focused, stops for good once someone uses it (a click or a key in
 *  it), and doesn't run for anyone who asked for less motion. `onBeat`
 *  should keep its identity between renders. */
export const useBeat = (ref: RefObject<HTMLElement | null>, ms: number, onBeat: (n: number) => void, on = true) => {
  useEffect(() => {
    const el = ref.current;
    if (!on || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let hovered = false;
    let focused = false;
    let last = -1;
    // Checked twice a beat (or four times a second), so the copies differ by a moment at most.
    const timer = window.setInterval(() => {
      const n = Math.floor(performance.now() / ms);
      if (hovered || focused || document.hidden || n === last) return;
      last = n;
      onBeat(n);
    }, Math.min(ms / 2, 250));
    const enter = () => {
      hovered = true;
    };
    const leave = () => {
      hovered = false;
    };
    const focusIn = () => {
      focused = true;
    };
    const focusOut = (e: FocusEvent) => {
      focused = e.relatedTarget instanceof Node && el.contains(e.relatedTarget);
    };
    const takeOver = () => window.clearInterval(timer);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focusin", focusIn);
    el.addEventListener("focusout", focusOut);
    el.addEventListener("click", takeOver, true);
    el.addEventListener("keydown", takeOver, true);
    return () => {
      window.clearInterval(timer);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("focusin", focusIn);
      el.removeEventListener("focusout", focusOut);
      el.removeEventListener("click", takeOver, true);
      el.removeEventListener("keydown", takeOver, true);
    };
  }, [ref, ms, onBeat, on]);
};
