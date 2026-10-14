/* eslint-disable @next/next/no-img-element -- pausa.co's own button icons */
import type { ReactNode } from "react";
import { cn } from "./cn";

/* pausa.co's button, as the live site ships it (.rd-btn): 54 px tall, a
 * 16 px corner, Inter Medium at 16 px, and its own icons after the label —
 * the drawn arrow for the site, the Apple mark for the App Store. */
const ICONS = {
  arrow: { solid: "/brand/icon-arrow-right.svg", outline: "/brand/icon-arrow-right-pen.svg" },
  apple: { solid: "/brand/icon-apple.svg", outline: "/brand/icon-apple-pen.svg" },
} as const;

// Each variant names its look, its focus ring and which icon tone sits on it.
const VARIANTS = {
  // blue, white label; ink on hover, as on pausa.co
  solid: { className: "min-w-[200px] border-transparent bg-pen text-white hover:bg-ink focus-visible:outline-pen", icon: "solid" },
  // the pen's blue on paper, with a faint blue edge
  outline: { className: "min-w-[180px] border-pen/10 bg-transparent text-pen hover:border-pen/30 focus-visible:outline-pen", icon: "outline" },
  // on a blue ground: the solid one turned over, and a cream outline
  inverse: { className: "min-w-[200px] border-transparent bg-cream text-pen hover:bg-white focus-visible:outline-cream", icon: "outline" },
  ghost: { className: "min-w-[180px] border-cream/25 bg-transparent text-cream hover:border-cream/60 focus-visible:outline-cream", icon: "solid" },
} as const;

export const Cta = ({
  href,
  icon,
  variant = "solid",
  children,
  className,
}: {
  href: string;
  icon: keyof typeof ICONS;
  variant?: keyof typeof VARIANTS;
  children: ReactNode;
  className?: string;
}) => (
  <a
    href={href}
    className={cn(
      "inline-flex h-[54px] items-center justify-center gap-2.5 rounded-2xl border px-[1.0625rem] font-sans text-base font-medium",
      "transition-[transform,background-color,border-color] duration-150 hover:-translate-y-0.5 active:scale-[0.97]",
      "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
      "focus-visible:outline-2 focus-visible:outline-offset-4",
      VARIANTS[variant].className,
      className,
    )}
  >
    {children}
    <img src={ICONS[icon][VARIANTS[variant].icon]} alt="" aria-hidden className="h-3.5 w-auto" />
  </a>
);
