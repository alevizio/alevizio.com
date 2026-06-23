/**
 * perf-mode.ts — portfolio-case-study stub.
 *
 * The Messa landing page ships a user-toggleable "performance mode"
 * kill-switch (localStorage + Shift+P + ?perf= + a floating indicator)
 * that freezes every animation. None of that belongs in a static case
 * study, so this stub hard-wires perf-mode to OFF — the ported conveyor
 * always runs full animation. The conveyor-overlay only reads the first
 * tuple element (`const [perfMode] = usePerfMode()`); the setter is a
 * no-op kept for signature parity. Routed through useSyncExternalStore so
 * the value is referentially stable and SSR-safe (server + client + the
 * never-firing subscription all agree on `false` — no hydration mismatch).
 */

import { useSyncExternalStore } from "react";

const getSnapshot = (): boolean => false;
const getServerSnapshot = (): boolean => false;
const subscribe = (_onStoreChange: () => void): (() => void) => () => {};

/** No-op setter kept for signature parity with the original hook. */
export function setPerfMode(_enabled: boolean): void {
  /* intentionally empty — perf-mode is permanently off in the port */
}

/** Always-off perf-mode flag. Mirrors the original
 * `usePerfMode(): [boolean, (next: boolean) => void]`. */
export function usePerfMode(): [boolean, (next: boolean) => void] {
  const enabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return [enabled, setPerfMode];
}
