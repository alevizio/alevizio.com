import { cn } from "../../cn";

/* Banyan's spinner (Figma: Spinner, 16:34106): a lidar-green arc with no
 * track, in three sizes. It names what is loading for screen readers. */
const SIZE = { sm: "size-4", md: "size-6", lg: "size-8" } as const;

export const Spinner = ({ size = "md", label = "Loading", className }: { size?: keyof typeof SIZE; label?: string; className?: string }) => (
  <span role="status" className={cn("inline-grid place-items-center", className)}>
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("text-bn-green motion-safe:animate-spin", SIZE[size])}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="44 63" />
    </svg>
    <span className="sr-only">{label}</span>
  </span>
);
