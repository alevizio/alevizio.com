"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** How far, and how long, the frame dips to show it scrolls, and how long
 *  a glide takes. Under five seconds, so they need no pause control. */
const NUDGE_PX = 360;
const NUDGE_MS = 3600;
const GLIDE_MS = 1800;

/** The scrolling frame of a page too long to show whole. The first time
 *  it's well in view it scrolls down a little and back, to say there's
 *  more; with glideTo it scrolls down to that point instead and stays, as
 *  a share of its width, since what it holds scales with it. Touching it,
 *  scrolling it or focusing it cancels either. */
export const TallFrame = ({ label, glideTo, className, children }: { label: string; glideTo?: number; className?: string; children: ReactNode }) => {
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
        const room = frame.scrollHeight - frame.clientHeight;
        // The dip goes down and comes back; the glide eases down and stays.
        const move =
          glideTo === undefined
            ? { depth: Math.min(NUDGE_PX, room), ms: NUDGE_MS, at: (t: number) => Math.sin(Math.PI * t) ** 2 }
            : { depth: Math.min(glideTo * frame.clientWidth, room), ms: GLIDE_MS, at: (t: number) => (1 - Math.cos(Math.PI * t)) / 2 };
        const start = performance.now();
        const step = (now: number) => {
          if (cancelled) return;
          const t = Math.min(1, (now - start) / move.ms);
          frame.scrollTop = move.depth * move.at(t);
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
  }, [glideTo]);

  return (
    <div ref={ref} role="region" aria-label={label} tabIndex={0} className={className}>
      {children}
    </div>
  );
};
