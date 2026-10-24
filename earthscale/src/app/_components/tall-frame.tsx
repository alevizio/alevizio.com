"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** How far, and how long, the frame dips to show it scrolls. Under five
 *  seconds, so it needs no pause control. */
const NUDGE_PX = 360;
const NUDGE_MS = 3600;

/** The scrolling frame of a page too long to show whole. The first time
 *  it's well in view it scrolls down a little and back, to say there's
 *  more; touching it, scrolling it or focusing it cancels that. */
export const TallFrame = ({ label, className, children }: { label: string; className?: string; children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = ref.current;
    if (!frame || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let cancelled = false;
    const cancel = () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
    const interactions = ["pointerdown", "wheel", "touchstart", "keydown", "focus"] as const;
    for (const name of interactions) frame.addEventListener(name, cancel, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || cancelled) return;
        observer.disconnect();
        const depth = Math.min(NUDGE_PX, frame.scrollHeight - frame.clientHeight);
        const start = performance.now();
        const step = (now: number) => {
          if (cancelled) return;
          const t = Math.min(1, (now - start) / NUDGE_MS);
          frame.scrollTop = depth * Math.sin(Math.PI * t) ** 2;
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    observer.observe(frame);
    return () => {
      cancel();
      observer.disconnect();
      for (const name of interactions) frame.removeEventListener(name, cancel);
    };
  }, []);

  return (
    <div ref={ref} role="region" aria-label={label} tabIndex={0} className={className}>
      {children}
    </div>
  );
};
