import Image from "next/image";
import { numbered, type Sheet } from "../_chapters/page-anatomy";
import { cn } from "./cn";
import { Zoom } from "./zoom";

/* The page's sections from the file, going by in a row the width of the
 * screen, in the page's order and round again, each with its number and
 * name. The row is two copies end to end, moved one copy's length and
 * started over, so it never runs out; the second copy is only there to be
 * seen (inert). Pointing at it or focusing in it holds it; a click opens a
 * sheet big. With less motion asked for it stands still and scrolls
 * sideways by hand. */
export const SectionMarquee = ({ sheets, className }: { sheets: Sheet[]; className?: string }) => (
  <div
    className={cn(
      "group/marquee no-scrollbar overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] motion-reduce:overflow-x-auto",
      className,
    )}
  >
    <div className="flex w-max motion-safe:animate-[es-marquee_80s_linear_infinite] group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused]">
      {[0, 1].map((copy) => (
        <ul key={copy} inert={copy === 1} className={cn("flex shrink-0 gap-5 pr-5 sm:gap-6 sm:pr-6", copy === 1 && "motion-reduce:hidden")}>
          {sheets.map(({ id, label, src, alt }, i) => (
            <li key={id} className="shrink-0">
              <Zoom src={src} alt={alt}>
                <Image src={src} alt={alt} sizes="640px" placeholder="blur" className="h-52 w-auto rounded-[8px] ring-1 ring-(--tone-line) sm:h-72" />
              </Zoom>
              <p className="type-label mt-3 text-(--tone-text)">
                <span className="text-(--tone-label)">{numbered(i)}</span> {label}
              </p>
            </li>
          ))}
        </ul>
      ))}
    </div>
  </div>
);
