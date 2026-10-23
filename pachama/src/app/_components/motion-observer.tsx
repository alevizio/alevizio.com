"use client";

import { useEffect } from "react";

/** How long a reveal takes, so a frame's clip can come off once it's open. */
const SETTLE_MS = 1600;

/** Marks each [data-reveal] with data-in as it scrolls into view (see
 *  globals.css). What's already on screen is marked before html.motion
 *  switches the hiding on, so nothing blinks on load. */
export const MotionObserver = () => {
  useEffect(() => {
    const show = (el: Element, settled: boolean) => {
      el.setAttribute("data-in", "");
      if (settled) el.setAttribute("data-done", "");
      else window.setTimeout(() => el.setAttribute("data-done", ""), SETTLE_MS);
    };
    const all = [...document.querySelectorAll("[data-reveal]")];
    const waiting = all.filter((el) => {
      const onScreen = el.getBoundingClientRect().top < window.innerHeight;
      if (onScreen) show(el, true);
      return !onScreen;
    });
    document.documentElement.classList.add("motion");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target, false);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of waiting) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return null;
};
