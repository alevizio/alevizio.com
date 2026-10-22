"use client";

import { useEffect, type RefObject } from "react";

/** Closes a floating thing on Escape (focus goes back to its trigger) and on
 *  a press anywhere outside `root`. */
export const useDismiss = (open: boolean, root: RefObject<HTMLElement | null>, trigger: RefObject<HTMLElement | null>, close: () => void) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      trigger.current?.focus();
    };
    const onPress = (e: PointerEvent) => {
      if (e.target instanceof Node && !root.current?.contains(e.target)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPress);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPress);
    };
  }, [open, root, trigger, close]);
};
