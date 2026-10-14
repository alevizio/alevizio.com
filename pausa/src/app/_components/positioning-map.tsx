import { cn } from "./cn";

/* Where journaling apps sit: soft or sharp, cold or warm. The category
 * crowds two corners; the warm, sharp one (the friend who tells you the
 * truth) was empty. Drawn like a margin sketch, not a chart. */
const CLUSTERS = [
  { label: "Cozy wellness", detail: "mascots, streaks, affirmations", position: "top-[26%] left-[22%]" },
  { label: "Clinical", detail: "dashboards, mood graphs, scores", position: "top-[74%] left-[76%]" },
] as const;

export const PositioningMap = ({ className }: { className?: string }) => (
  <figure className={className}>
    <div className="relative aspect-[4/5] rounded-[6px] bg-sheet/80 ring-1 ring-rule sm:aspect-[16/9]">
      {/* axes */}
      <span aria-hidden className="absolute inset-x-6 top-1/2 h-px bg-rule-warm" />
      <span aria-hidden className="absolute inset-y-6 left-1/2 w-px bg-rule-warm" />
      <span className="absolute top-1/2 left-6 -translate-y-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Soft
      </span>
      <span className="absolute top-1/2 right-6 -translate-y-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Sharp
      </span>
      <span className="absolute top-6 left-1/2 translate-x-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Warm
      </span>
      <span className="absolute bottom-6 left-1/2 translate-x-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Cold
      </span>

      {CLUSTERS.map((c) => (
        <div
          key={c.label}
          className={cn("absolute -translate-x-1/2 -translate-y-1/2 text-center", c.position)}
        >
          <span aria-hidden className="mx-auto flex w-max gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-2.5 w-2.5 rounded-full bg-ash" />
            ))}
          </span>
          <p className="mt-2 font-sans text-[0.85rem] text-ink">{c.label}</p>
          <p className="font-sans text-[0.75rem] text-muted">{c.detail}</p>
        </div>
      ))}

      {/* Pausa, alone in the warm + sharp corner, circled in pen */}
      <div className="absolute top-[24%] left-[76%] -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="relative mx-auto w-max px-1">
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative pen mark */}
          <img
            aria-hidden
            alt=""
            src="/pausa-co/mark-tradition.svg"
            className="mark-multiply pointer-events-none absolute -top-3 -left-6 h-[calc(100%+1.5rem)] w-[calc(100%+3rem)] max-w-none"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- the mark itself */}
          <img src="/brand/tangle-pen.svg" alt="" aria-hidden className="mx-auto h-9 w-9" />
          <p className="mt-1 font-serif text-[1.05rem] font-medium text-ink">Pausa</p>
        </div>
        <p className="mt-4 font-hand text-[1.25rem] leading-none whitespace-nowrap text-pen">the honest friend</p>
      </div>
    </div>
    <figcaption className="mt-3 font-sans text-[0.9rem] leading-[1.55] text-body">
      The category crowds two corners. The friend who looks up from their coffee and says the true thing had the
      other one to itself.
    </figcaption>
  </figure>
);
