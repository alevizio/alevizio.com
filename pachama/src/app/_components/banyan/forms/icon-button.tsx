import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../cn";

/* Banyan's Icon Button: the Button's tints and hierarchies on a rounded
 * square (16px corners at medium) around a 24px icon. Focus is a 2px ring
 * set 4px in from the edge, as in the Figma; it's drawn black on the light
 * tints (white there disappears on lidar green) and white on monochrome. */
type Size = "sm" | "md" | "lg";
type Look = "branded" | "monochrome" | "destructive" | "secondary" | "tertiary";

const SIZE: Record<Size, string> = {
  sm: "size-8 rounded-xl [&_svg]:size-4",
  md: "size-12 rounded-2xl [&_svg]:size-6",
  lg: "size-14 rounded-2xl [&_svg]:size-6",
};

const PRESS = "enabled:active:shadow-[inset_0_0_0_2px_var(--bn-surface,#fff)]";
const RING_IN = "focus-visible:outline-2 focus-visible:-outline-offset-6";

const LOOK: Record<Look, string> = {
  branded: cn("bg-bn-green text-bn-heavy enabled:hover:bn-green-blue enabled:active:bn-green-blue-pressed disabled:bn-green-blue-faded", PRESS, RING_IN, "focus-visible:outline-black"),
  monochrome: cn("bg-bn-mono text-white enabled:hover:bg-black enabled:active:bg-black", PRESS, RING_IN, "focus-visible:outline-white"),
  destructive: cn("bg-bn-orange text-bn-heavy enabled:hover:bg-bn-orange-dark enabled:active:bg-bn-orange-dark", PRESS, RING_IN, "focus-visible:outline-black"),
  secondary: "border border-bn-medium text-bn-heavy enabled:hover:bg-bn-grey-lightest enabled:active:bg-bn-grey-light focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black",
  tertiary: "text-bn-heavy enabled:hover:bg-bn-grey-lightest enabled:active:bg-bn-grey-light focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black",
};

type IconButtonProps = Omit<ComponentProps<"button">, "children"> & {
  /** What it does, for screen readers and as the hover title. */
  label: string;
  icon: ReactNode;
  look?: Look;
  size?: Size;
};

export const IconButton = ({ label, icon, look = "branded", size = "md", type = "button", className, ...rest }: IconButtonProps) => (
  <button
    type={type}
    aria-label={label}
    title={label}
    className={cn(
      "inline-grid shrink-0 place-items-center transition-[background-color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50",
      SIZE[size],
      LOOK[look],
      className,
    )}
    {...rest}
  >
    {icon}
  </button>
);
