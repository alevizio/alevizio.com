"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** False on the server and while hydrating, true after: for what draws from
 *  the browser (its size, reduced motion), like the Stageshow stages, which
 *  render once on the client in a box their size until then. */
export const useMounted = () => useSyncExternalStore(noop, () => true, () => false);
