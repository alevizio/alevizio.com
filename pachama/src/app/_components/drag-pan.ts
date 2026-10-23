"use client";

import { useEffect, type RefObject } from "react";

// A drag shorter than this is still a click.
const DRAG_PX = 5;

/** Lets a mouse drag a scrolling element around (touch and trackpads scroll
 *  it natively). The click that ends a drag doesn't reach what's under it,
 *  and the element carries data-dragging while it's held, for the cursor. */
export const useDragPan = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start: { x: number; y: number; left: number; top: number } | null = null;
    let dragged = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      start = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop };
      dragged = false;
    };
    const move = (e: PointerEvent) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (!dragged && Math.hypot(dx, dy) < DRAG_PX) return;
      if (!dragged) {
        dragged = true;
        el.setPointerCapture(e.pointerId);
        el.dataset.dragging = "";
      }
      el.scrollLeft = start.left - dx;
      el.scrollTop = start.top - dy;
    };
    const up = () => {
      start = null;
      delete el.dataset.dragging;
    };
    const click = (e: MouseEvent) => {
      if (!dragged) return;
      e.preventDefault();
      e.stopPropagation();
      dragged = false;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
    };
  }, [ref]);
};
