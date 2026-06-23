"use client";

import type { ReactNode } from "react";

// Pass-through wrapper. Was previously a scroll-driven blur reveal — that
// effect was removed; the component is kept (vs. ripping it out of every
// caller) and the className is preserved so existing layouts don't shift.
export const ScrollFocus = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);
