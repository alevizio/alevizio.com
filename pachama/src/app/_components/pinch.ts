"use client";

import { useEffect, type RefObject } from "react";

type GestureEvent = Event & { scale: number; clientX: number; clientY: number };

/** Pinching an element zooms it rather than the page: a trackpad's pinch
 *  (ctrl and the wheel, or Safari's gesture events), ctrl or ⌘ and a mouse
 *  wheel, two fingers on a touch screen. Each step calls zoomBy with how
 *  much it scales by and the point it's around, in the window. A dialog
 *  opened from inside it keeps its own pinches. */
export const usePinch = (ref: RefObject<HTMLElement | null>, zoomBy: (factor: number, x: number, y: number) => void) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Safari's trackpad pinch: the scale so far, while it lasts.
    let gesture: number | null = null;
    // Two fingers: how far apart they were.
    let fingers: number | null = null;
    const span = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const inDialog = (e: Event) => e.target instanceof Element && e.target.closest("dialog") !== null;

    const wheel = (e: WheelEvent) => {
      if ((!e.ctrlKey && !e.metaKey) || inDialog(e)) return;
      e.preventDefault();
      if (gesture === null) zoomBy(Math.exp(-Math.max(-50, Math.min(50, e.deltaY)) * 0.01), e.clientX, e.clientY);
    };
    const gestureStart = (e: Event) => {
      if (inDialog(e)) return;
      e.preventDefault();
      gesture = 1;
    };
    const gestureChange = (e: Event) => {
      if (gesture === null) return;
      e.preventDefault();
      const { scale, clientX, clientY } = e as GestureEvent;
      // iOS sends these with a two-finger pinch too, which the touches have.
      if (fingers === null) zoomBy(scale / gesture, clientX, clientY);
      gesture = scale;
    };
    const gestureEnd = () => {
      gesture = null;
    };
    const touchStart = (e: TouchEvent) => {
      if (e.touches.length === 2 && !inDialog(e)) fingers = span(e.touches);
    };
    const touchMove = (e: TouchEvent) => {
      if (fingers === null || e.touches.length !== 2) return;
      if (e.cancelable) e.preventDefault();
      const [a, b] = [e.touches[0], e.touches[1]];
      const d = span(e.touches);
      zoomBy(d / fingers, (a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2);
      fingers = d;
    };
    const touchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) fingers = null;
    };

    el.addEventListener("wheel", wheel, { passive: false });
    el.addEventListener("gesturestart", gestureStart);
    el.addEventListener("gesturechange", gestureChange);
    el.addEventListener("gestureend", gestureEnd);
    el.addEventListener("touchstart", touchStart, { passive: true });
    el.addEventListener("touchmove", touchMove, { passive: false });
    el.addEventListener("touchend", touchEnd);
    el.addEventListener("touchcancel", touchEnd);
    return () => {
      el.removeEventListener("wheel", wheel);
      el.removeEventListener("gesturestart", gestureStart);
      el.removeEventListener("gesturechange", gestureChange);
      el.removeEventListener("gestureend", gestureEnd);
      el.removeEventListener("touchstart", touchStart);
      el.removeEventListener("touchmove", touchMove);
      el.removeEventListener("touchend", touchEnd);
      el.removeEventListener("touchcancel", touchEnd);
    };
  }, [ref, zoomBy]);
};
