import type { ReactNode } from "react";
import { MdArrowForward } from "react-icons/md";
import { cn } from "./cn";

/* The page's pieces at their real size, as the file draws them: the tag,
 * the button and its states, the email field, and a pointer for the
 * pieces that show what happens under one. */

/** The tag: a 34px hairline pill in mono. */
export const PageTag = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cn("inline-flex h-[34px] items-center rounded-full border border-mist/30 px-5 font-mono text-[14px] leading-none text-mist", className)}>{children}</span>
);

export type CtaState = "default" | "hover" | "pressed" | "disabled";

/** Get Started: mint, 48px, Plex Mono 16 and the arrow. Lighter under the
 *  pointer, pressed in with a shadow, half gone when disabled. */
export const Cta = ({ state = "default", children = "Get Started", icon, className }: { state?: CtaState; children?: ReactNode; icon?: ReactNode; className?: string }) => (
  <span
    className={cn(
      "inline-flex h-12 shrink-0 items-center gap-2 rounded-full pr-5 pl-6 font-mono text-[16px] leading-none text-night transition-[background-color,box-shadow,opacity] duration-300",
      state === "hover" || state === "pressed" ? "bg-mist" : "bg-mint",
      state === "pressed" && "shadow-[inset_0_2px_2px_rgba(0,0,0,0.25)]",
      state === "disabled" && "opacity-50",
      className,
    )}
  >
    {children}
    {icon ?? <MdArrowForward aria-hidden className="size-5" />}
  </span>
);

/** The email field: 420 wide, glass over the page, the button inside. */
export const Field = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cn("flex h-16 w-full max-w-[420px] items-center gap-4 rounded-full border border-mist/70 bg-[rgb(30_43_39/0.7)] py-2 pr-2 pl-6 shadow-[0_24px_110px_20px_rgb(160_255_215/0.1)] backdrop-blur-[17px]", className)}>
    {children}
  </span>
);

/** A pointer. */
export const Pointer = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 24" className={cn("size-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]", className)} aria-hidden>
    <path d="M2 2 L2 19 L6.5 15 L9.5 22 L12.5 20.7 L9.6 14 L15.5 14 Z" fill="#e6f6e7" stroke="#0f1313" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

/** The blinking caret of a field being typed in. */
export const Caret = ({ className }: { className?: string }) => (
  <span className={cn("ml-px inline-block h-3.5 w-px bg-mint align-middle motion-safe:animate-[es-blink_1s_steps(2)_infinite]", className)} />
);
