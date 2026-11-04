import { FeatureList } from "./anat-serve";
import { Pipeline } from "./pipeline";

/* The Serve section set the way the page sets it, and playing: its tag and
 * headline straight on the band, no card round it, the three features in a
 * hairline box with a cross at its corner, lit in turn, and beside them the
 * pipeline running, the two sources joining, the call typing itself and the
 * tile source arriving. Both play while they're on screen. */
export const ServeLive = ({ className }: { className?: string }) => (
  <div data-reveal className={className}>
    <p className="inline-flex min-h-8 items-center rounded-full border border-mist/25 px-3.5 py-1.5 font-mono text-[12px] tracking-[0.08em] text-mist uppercase">Production</p>
    <p className="mt-5 font-sans text-[32px] leading-[1.1] tracking-[-0.01em] text-mist sm:text-[48px]">Serve Data at Scale, Instantly</p>
    <div className="mt-10 grid gap-10 sm:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
      <div className="relative self-start border border-mist/15 p-5 sm:p-7">
        <span aria-hidden className="absolute -top-2 -right-px h-4 w-px bg-mist/50" />
        <span aria-hidden className="absolute -top-px -right-2 h-px w-4 bg-mist/50" />
        <FeatureList />
      </div>
      <Pipeline />
    </div>
  </div>
);
