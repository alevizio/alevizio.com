"use client";

import { useEffect, useRef } from "react";

const COUNT_MS = 1400;
const format = (n: number) => n.toLocaleString("en-US");

/** A number that counts up from zero the first time it scrolls into view.
 *  The page renders the final figure, and it only drops to zero while it's
 *  still off screen. The count writes straight to its text node, so React
 *  doesn't re-render each frame; screen readers get the final figure alone. */
export const CountUp = ({ value, className }: { value: number; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const text = ref.current?.firstChild;
    if (!ref.current || !text || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (ref.current.getBoundingClientRect().top < window.innerHeight) return;
    text.nodeValue = format(0);
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / COUNT_MS);
          text.nodeValue = format(Math.round(value * (1 - (1 - t) ** 3)));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      text.nodeValue = format(value);
    };
  }, [value]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden>
        {format(value)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
};
