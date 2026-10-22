import { cn } from "../../cn";

/* Banyan's skeleton (Figma: Skeleton, 1147:6039): grey lightest blocks with
 * a slow shimmer; a pill for text, a rounded square for anything boxed. */
export const Skeleton = ({ shape = "text", className }: { shape?: "text" | "square"; className?: string }) => (
  <span
    aria-hidden
    className={cn(
      "block bg-bn-grey-lightest",
      "motion-safe:animate-pulse",
      shape === "text" ? "h-4 rounded-full" : "rounded-[6px]",
      className,
    )}
  />
);
