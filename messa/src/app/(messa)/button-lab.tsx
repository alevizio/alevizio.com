import { cn } from "./cn";

/**
 * The CTA in the three styles the April style switcher toggled between — the
 * same live panel that A/B'd the type and icons (client direction 2026-06-16).
 * Flat, Glass and 3D, rebuilt natively from the real messa-landing recipes
 * (no screenshots) so every hover and press is the actual CSS. The tactile 3D
 * shipped. Pure-CSS interactions — no client component needed.
 */
const BUTTON_STYLES = [
  {
    key: "flat",
    name: "Flat",
    className: "story-btn-flat",
    note: "Solid accent, no depth.",
    shipped: false,
  },
  {
    key: "glass",
    name: "Glass",
    className: "story-btn-glass",
    note: "Frosted, backdrop-blurred.",
    shipped: false,
  },
  {
    key: "3d",
    name: "3D",
    className: "story-btn-3d",
    note: "Slate, letterpress type, presses in 1px.",
    shipped: true,
  },
] as const;

export const ButtonLab = ({ className }: { className?: string }) => (
  <section className={className} aria-label="The Messa button styles">
    {/* No heading of its own — it sits under the "interface kit" section
      * title, aligned to the same max-w-3xl column. */}
    <div className="mx-auto max-w-3xl px-6">
      <figure>
        {/* No card — the buttons sit straight on the cream page; the glass
          * frost reads against it and the slate 3D casts onto it. */}
        <div className="grid grid-cols-1 gap-y-10 py-8 sm:grid-cols-3 sm:gap-x-8">
          {BUTTON_STYLES.map((style) => (
            <div key={style.key} className="flex flex-col items-center text-center">
              <button
                type="button"
                className={cn(
                  style.className,
                  "cursor-pointer rounded-full px-8 py-3 text-[15px] font-medium select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5A6B8F]",
                )}
              >
                Request a demo
              </button>
              <p className="mt-4 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest text-[#6E6B68]">
                {style.name}
                {style.shipped ? (
                  <span className="rounded-full border border-[#5A6B8F]/40 bg-white px-2 py-0.5 text-[9px] text-[#5A6B8F]">
                    Shipped
                  </span>
                ) : null}
              </p>
              <p className="mt-1.5 text-xs leading-5 text-[#6E6B68]">
                {style.note}
              </p>
            </div>
          ))}
        </div>
        <figcaption className="mt-3 text-sm leading-6 text-[#6E6B68]">
          From the same live switcher as the type and icons: the CTA in flat,
          glass and tactile 3D — the 3D shipped, a slate pill with letterpressed
          type that sinks a pixel on press. Every hover and press is real CSS,
          not a screenshot.
        </figcaption>
      </figure>
    </div>
  </section>
);
