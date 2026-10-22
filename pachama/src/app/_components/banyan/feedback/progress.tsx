import { cn } from "../../cn";

/* Banyan's progress (Figma: Progress, 1502:8808): a 2px line, lidar green
 * over grey lightest. A native <progress>, so its value is announced. */
export const Progress = ({ value, label, className }: { value: number; label: string; className?: string }) => (
  <progress
    value={value}
    max={100}
    aria-label={label}
    className={cn(
      "block h-0.5 w-full appearance-none overflow-hidden rounded-full bg-bn-grey-lightest",
      "[&::-webkit-progress-bar]:bg-bn-grey-lightest [&::-webkit-progress-value]:bg-bn-green [&::-webkit-progress-value]:transition-[width] [&::-moz-progress-bar]:bg-bn-green",
      className,
    )}
  />
);
