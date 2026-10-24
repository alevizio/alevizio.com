"use client";

import { useSyncExternalStore } from "react";

/* What the globes show: which band, in which of the product's colour
 * ramps. One view for the page, so the globe at the end follows the one in
 * the hero. */
export const BANDS = [
  { id: "wind", label: "10m wind speed", ramp: 0 },
  { id: "temperature", label: "2m temperature", ramp: 1 },
] as const;
export type Band = (typeof BANDS)[number]["id"];
export type View = { band: Band; ramp: number };

let view: View = { band: "wind", ramp: 0 };
const listeners = new Set<() => void>();

export const getView = () => view;
export const setView = (next: Partial<View>) => {
  view = { ...view, ...next };
  for (const listener of listeners) listener();
};
export const subscribeView = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const useGlobeView = () => useSyncExternalStore(subscribeView, getView, getView);
