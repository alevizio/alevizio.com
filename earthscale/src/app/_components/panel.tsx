import type { ReactNode } from "react";
import { MdExpandMore } from "react-icons/md";
import { cn } from "./cn";

/* The product's panel, as the page draws it: a hairline card on the
 * card green, mono labels, a title row, and the controls inside it. */
export const Panel = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn("rounded-[12px] border border-rule bg-card/95 p-4 text-mist shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm", className)}>{children}</div>
);

export const PanelTitle = ({ children, right }: { children: ReactNode; right?: ReactNode }) => (
  <div className="flex items-center justify-between gap-3">
    <p className="font-mono text-[11px] tracking-[0.02em] text-mist">{children}</p>
    {right ? <div className="flex items-center gap-2 text-haze">{right}</div> : null}
  </div>
);

export const Label = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn("font-mono text-[9.5px] tracking-[0.04em] text-haze", className)}>{children}</p>
);

/** A select as the panels draw it: the value and a chevron in a hairline box. */
export const Select = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("flex h-8 items-center justify-between rounded-md border border-rule bg-night/60 px-2.5 font-sans text-[11px] text-mist", className)}>
    <span className="flex items-center gap-2">{children}</span>
    <MdExpandMore aria-hidden className="size-4 text-haze" />
  </div>
);

/** A slider: the track, its fill to the value, and the thumb, all moving
 *  on a transition when the value changes. */
export const Slider = ({ value, className }: { value: number; className?: string }) => (
  <div className={cn("relative h-3 w-full", className)}>
    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-rule" />
    <div className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-mint transition-[width] duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: `${value}%` }} />
    <div className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint shadow-[0_0_0_3px_rgba(160,255,215,0.18)] transition-[left] duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ left: `${value}%` }} />
  </div>
);

/** A pill button, mint or hairline. */
export const Button = ({ children, primary = false, className }: { children: ReactNode; primary?: boolean; className?: string }) => (
  <span className={cn("inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-3.5 font-mono text-[10px] tracking-[0.04em] uppercase transition-colors duration-500", primary ? "bg-mint text-night" : "border border-rule text-mist", className)}>
    {children}
  </span>
);

/** Text that types itself in, character by character, when on. */
export const Typed = ({ text, on, className }: { text: string; on: boolean; className?: string }) => (
  <span className={cn("relative inline-block overflow-hidden whitespace-nowrap align-bottom", className)}>
    <span className="invisible">{text}</span>
    <span
      className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap transition-[width] ease-[steps(40,end)]"
      style={{ width: on ? "100%" : "0%", transitionDuration: on ? "1600ms" : "0ms" }}
    >
      {text}
    </span>
  </span>
);
