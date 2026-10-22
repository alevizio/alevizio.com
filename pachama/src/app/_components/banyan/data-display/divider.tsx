import { cn } from "../../cn";

/* Banyan's divider (Figma: Divider, 683:36588): a 1px line, either light
 * grey or the brand spectrum, drawn from Banyan's own ramps in order:
 * glacier, lidar green, canary, flax, hibiscus, blaze. */
const SPECTRUM = {
  horizontal:
    "bg-[linear-gradient(to_right,var(--color-bn-blue),var(--color-bn-green),var(--color-bn-yellow),var(--color-bn-indigo),var(--color-bn-mauve),var(--color-bn-orange))]",
  vertical:
    "bg-[linear-gradient(to_bottom,var(--color-bn-blue),var(--color-bn-green),var(--color-bn-yellow),var(--color-bn-indigo),var(--color-bn-mauve),var(--color-bn-orange))]",
};

export const Divider = ({
  type = "light",
  orientation = "horizontal",
  className,
}: {
  type?: "light" | "spectrum";
  orientation?: "horizontal" | "vertical";
  className?: string;
}) => (
  <div
    role="separator"
    aria-orientation={orientation}
    className={cn(
      orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
      type === "spectrum" ? SPECTRUM[orientation] : "bg-bn-line",
      className,
    )}
  />
);
