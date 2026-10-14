/* eslint-disable @next/next/no-img-element -- the lockup is an SVG drawn at its own size */
import { cn } from "./cn";

/* The lockup as the book sets it (pp. 11–12): the tile at 22.5% corners
 * and, on a light ground, the book's keyline round it: 2 px of black at
 * 10%, outside the edge (a Figma outside stroke), so the light tile keeps
 * its shape on white and on paper. On blue it needs none. Size it with a
 * width or a height; the file's ratio gives the other. */
export const Lockup = ({
  onDark = false,
  alt = "Pausa",
  className,
}: {
  onDark?: boolean;
  alt?: string;
  className?: string;
}) => (
  <span className={cn("relative block aspect-[1658/512]", className)}>
    <img
      src={onDark ? "/brand/lockup-on-dark.svg" : "/brand/lockup.svg"}
      alt={alt}
      width={1658}
      height={512}
      className="absolute inset-0 size-full"
    />
    {onDark ? null : (
      <span aria-hidden className="absolute inset-y-0 left-0 aspect-square rounded-[22.5%] outline-2 outline-black/10" />
    )}
  </span>
);
