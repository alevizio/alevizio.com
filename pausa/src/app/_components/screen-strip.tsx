import Image from "next/image";
import { cn } from "./cn";
import type { Screen } from "./media";

/* Phone-sized screens in a row that scrolls sideways on narrow viewports
 * and snaps to each screen. Used for the app and the App Store listing. */
export const ScreenStrip = ({
  screens,
  label,
  className,
}: {
  screens: readonly Screen[];
  label: string;
  className?: string;
}) => (
  <ol
    aria-label={label}
    className={cn(
      "mx-auto flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-4 [scrollbar-width:thin]",
      className,
    )}
  >
    {screens.map((screen) => (
      <li key={screen.src} className="w-[11.5rem] shrink-0 snap-start sm:w-[13rem]">
        <div className="overflow-hidden rounded-[14px] bg-sheet shadow-[0_18px_40px_-28px_rgba(26,26,29,0.45)] ring-1 ring-rule">
          <Image
            src={screen.src}
            width={660}
            height={1434}
            alt={screen.alt}
            sizes="208px"
            className="block h-auto w-full"
          />
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{screen.label}</p>
      </li>
    ))}
  </ol>
);
