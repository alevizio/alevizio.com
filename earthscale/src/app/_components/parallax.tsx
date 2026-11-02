"use client";

import { useEffect } from "react";

/* Parallax, felt more than seen: anything marked data-parallax moves a
 * little off the scroll, by its distance from the middle of the window
 * times its value. Below zero it lags, like something further away; above
 * zero it leads. Measured without the shift it already has, so it never
 * chases itself, and only near the window. Nothing moves for anyone who has
 * asked for less motion. */
export const Parallax = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const shifts = new Map<HTMLElement, number>();
    let raf = 0;
    const frame = () => {
      raf = 0;
      const middle = window.innerHeight / 2;
      for (const el of document.querySelectorAll<HTMLElement>("[data-parallax]")) {
        const was = shifts.get(el) ?? 0;
        const box = el.getBoundingClientRect();
        const centre = box.top - was + box.height / 2;
        if (Math.abs(centre - middle) > window.innerHeight * 1.5) continue;
        const shift = (centre - middle) * Number(el.dataset.parallax);
        shifts.set(el, shift);
        el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
      }
    };
    const nudge = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    nudge();
    window.addEventListener("scroll", nudge, { passive: true });
    window.addEventListener("resize", nudge);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", nudge);
      window.removeEventListener("resize", nudge);
    };
  }, []);

  return null;
};
