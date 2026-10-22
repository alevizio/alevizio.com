import type { ReactNode } from "react";
import { cn } from "../../cn";

/* The small parts every Banyan card is built from: the country chip, the
 * divider between facts, the status badge and the card frame itself. */

/** Brazil's flag, drawn small and round like Banyan's country chips. */
const FlagBrazil = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={cn("size-6 shrink-0 rounded-full", className)}>
    <rect width="24" height="24" fill="#229e45" />
    <path d="M12 4.5 21.5 12 12 19.5 2.5 12Z" fill="#f8e509" />
    <circle cx="12" cy="12" r="4.4" fill="#2b49a3" />
    <path d="M7.8 11.2c2.9-.6 5.9-.1 8.4 1.4" stroke="#fff" strokeWidth="0.8" fill="none" />
  </svg>
);

/** Where a project is and how big: flag, country, a hairline, the area. */
export const CountryRow = ({ country, area, children }: { country: string; area: string; children?: ReactNode }) => (
  <div className="flex items-center gap-4 pb-2">
    <span className="flex items-center gap-1.5 text-[14px] leading-5 text-bn-heavy">
      <FlagBrazil />
      {country}
    </span>
    <span aria-hidden className="h-6 w-px bg-bn-grey-light" />
    <span className="text-[14px] leading-5 text-bn-heavy">{area}</span>
    {children ? <span className="ml-auto">{children}</span> : null}
  </div>
);

type Tone = "pass" | "neutral";

/** Banyan's small badge: Matter Bold 12 in capitals on a pill. */
export const StatusBadge = ({ children, tone = "pass", className }: { children: ReactNode; tone?: Tone; className?: string }) => (
  <span
    className={cn(
      "inline-flex rounded-full px-2 py-0.5 text-[12px] leading-4 font-bold whitespace-nowrap text-bn-heavy uppercase",
      tone === "pass" ? "bg-bn-green" : "bg-bn-grey-light",
      className,
    )}
  >
    {children}
  </span>
);

/** The card frame: white, 24px corners, a hairline of glass. */
export const CardFrame = ({ children, className }: { children: ReactNode; className?: string }) => (
  <article className={cn("w-full max-w-[380px] overflow-hidden rounded-[24px] border border-bn-grey-light/60 bg-white text-left", className)}>
    {children}
  </article>
);
