import { MESSA_ICONS } from "./icon-set";

/**
 * The Messa icon set, rendered natively under the palette (client direction
 * 2026-06-16) — the third brand atom after type and color. Tabler outline is
 * the single canonical set across the live site; here every glyph is inlined
 * from the same path data the site ships and stroked in the slate accent — no
 * separate SVG assets, the same "rebuilt natively" rule as the palette
 * swatches and the accent-bug button.
 */
const Glyph = ({ paths }: { paths: readonly string[] }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className="h-6 w-6"
  >
    {paths.map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

export const IconWall = ({ className }: { className?: string }) => (
  <section className={className} aria-label="The Messa icon set">
    <div className="mx-auto max-w-5xl px-6">
      {/* Same hairline grid as the brief and craft-index — white cells on a
        * cream-border seam, so the icons read as one specimen sheet. */}
      <ul className="mt-8 grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-[#E8D9C5] bg-[#E8D9C5] sm:grid-cols-6 lg:grid-cols-7">
        {MESSA_ICONS.map((icon) => (
          <li
            key={icon.name}
            className="flex flex-col items-center gap-2.5 bg-white px-2 py-5 text-[#5A6B8F]"
          >
            <Glyph paths={icon.paths} />
            <span className="font-mono text-[10px] leading-4 text-[#6E6B68]">
              {icon.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
