import type { ComponentProps, ReactNode } from "react";
import { cn } from "../cn";

/* Banyan's button, from the Figma: a pill, Matter Mono in capitals, three
 * hierarchies, three tints for the primary one, three sizes, and six states.
 * Hover runs green into glacier, a press cuts the fill back 2px from the
 * edge, focus is a 2px inner stroke, loading swaps the label for dots. */
type Hierarchy = "primary" | "secondary" | "tertiary";
type Tint = "branded" | "monochrome" | "destructive";
type Size = "sm" | "md" | "lg";

const SIZE: Record<Size, string> = {
  sm: "h-[34px] gap-1 px-4 text-[14px] leading-[18px]",
  md: "h-12 gap-1 px-6 text-base leading-5",
  lg: "h-[52px] gap-1 px-8 text-base leading-5",
};

// An icon takes 6px off its side's padding, as in the Figma (24 → 18).
const ICON_SIDE: Record<Size, { leading: string; trailing: string }> = {
  sm: { leading: "pl-2.5", trailing: "pr-2.5" },
  md: { leading: "pl-[18px]", trailing: "pr-[18px]" },
  lg: { leading: "pl-[26px]", trailing: "pr-[26px]" },
};

// The pressed cut shows whatever the button sits on: --bn-surface, set by
// the panel (eggshell), white anywhere else.
const PRESS = "enabled:active:shadow-[inset_0_0_0_2px_var(--bn-surface,#fff)]";
const RING_DARK = "focus-visible:shadow-[inset_0_0_0_2px_#000]";

const LOOK: Record<Hierarchy | Tint, string> = {
  branded: cn("bg-bn-green text-bn-heavy enabled:hover:bn-green-blue enabled:active:bn-green-blue-pressed not-aria-busy:disabled:bn-green-blue-faded", PRESS, RING_DARK),
  monochrome: cn("bg-bn-mono text-white enabled:hover:bg-black enabled:active:bg-black", PRESS, "focus-visible:shadow-[inset_0_0_0_2px_#fff]"),
  destructive: cn("bg-bn-orange text-bn-heavy enabled:hover:bg-bn-orange-dark enabled:active:bg-bn-orange-dark", PRESS, RING_DARK),
  primary: "",
  secondary: cn("border border-bn-medium text-bn-heavy enabled:hover:bg-bn-grey-lightest enabled:active:bg-bn-grey-light", RING_DARK),
  tertiary: cn("text-bn-heavy underline decoration-from-font underline-offset-[3px] enabled:hover:bg-bn-grey-lightest enabled:active:bg-bn-grey-light", RING_DARK),
};

/** The three dots a loading button shows, dark to light. */
const LoadingDots = ({ className }: { className?: string }) => (
  <span aria-hidden className={cn("inline-flex items-center gap-2", className)}>
    {["opacity-100", "opacity-60 [animation-delay:150ms]", "opacity-30 [animation-delay:300ms]"].map((dot) => (
      <span key={dot} className={cn("size-2 rounded-full bg-current motion-safe:animate-pulse", dot)} />
    ))}
  </span>
);

type ButtonProps = Omit<ComponentProps<"button">, "children"> & {
  hierarchy?: Hierarchy;
  /** Only a primary button takes a tint. */
  tint?: Tint;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: "leading" | "trailing";
  loading?: boolean;
  children: ReactNode;
};

export const Button = ({
  hierarchy = "primary",
  tint = "branded",
  size = "md",
  icon,
  iconPosition = "leading",
  loading = false,
  disabled,
  type = "button",
  children,
  className,
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={cn(
      // Disabled fades the whole button; loading (aria-busy) stays solid.
      "relative inline-flex shrink-0 items-center justify-center rounded-full font-mono font-medium whitespace-nowrap uppercase transition-[background-color,box-shadow] focus-visible:outline-none disabled:cursor-not-allowed not-aria-busy:disabled:opacity-50",
      SIZE[size],
      icon ? ICON_SIDE[size][iconPosition] : null,
      LOOK[hierarchy === "primary" ? tint : hierarchy],
      className,
    )}
    {...rest}
  >
    <span className={cn("inline-flex items-center gap-1", iconPosition === "trailing" && "flex-row-reverse", loading && "invisible")}>
      {icon}
      {children}
    </span>
    {loading ? (
      <span className="absolute inset-0 grid place-items-center">
        <LoadingDots />
        <span className="sr-only">Loading</span>
      </span>
    ) : null}
  </button>
);
