"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** A frame that scrolls its page by itself while it's on screen, down and
 *  back on a slow sine, each frame on its own period and phase. Pointing
 *  at it holds it; scrolling, touching or focusing it hands it over for
 *  good. With less motion asked for it stays put. It takes keyboard focus,
 *  so the arrow keys scroll it too. */
export const AutoFrame = ({ label, period, phase = 0, className, children }: { label: string; period: number; phase?: number; className?: string; children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let visible = false;
    let held = false;
    let over = false;
    const t0 = performance.now() - phase;
    const tick = (now: number) => {
      raf = 0;
      if (!visible || held || over) return;
      const max = el.scrollHeight - el.clientHeight;
      const turn = ((now - t0) % period) / period;
      el.scrollTop = max * (0.5 - 0.5 * Math.cos(turn * 2 * Math.PI));
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf && visible && !held && !over) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const hold = () => {
      held = true;
      stop();
    };
    const enter = () => {
      over = true;
      stop();
    };
    const leave = () => {
      over = false;
      start();
    };
    const sight = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    }, { threshold: 0.4 });
    sight.observe(el);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    for (const name of ["wheel", "touchstart", "keydown", "focus"] as const) el.addEventListener(name, hold, { passive: true });
    return () => {
      stop();
      sight.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      for (const name of ["wheel", "touchstart", "keydown", "focus"] as const) el.removeEventListener(name, hold);
    };
  }, [period, phase]);

  return (
    <div ref={ref} tabIndex={0} aria-label={label} data-cursor="Scroll" className={className}>
      {children}
    </div>
  );
};
