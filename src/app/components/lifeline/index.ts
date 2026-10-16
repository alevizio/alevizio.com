/**
 * Lifeline by Evil Rabbit (MIT, see LICENSE), from
 * github.com/evilrabbit/lifeline at 8ddbb3d (2026-07-31). Kept close to
 * upstream so updates can be diffed in; what changed for this site:
 *
 * - Vite, not Next: no "use client", <img> for next/image (people), `cn`
 *   from ../ui/utils, and lib/lifeline-data.ts moved in here.
 * - A `showAge` prop: the homepage tells a career, with no birth year.
 * - Labels set lowercase like the rest of the site; palette and type come
 *   from .lifeline-typeset in src/styles/lifeline.css.
 * - Horizontal from lg rather than md (lifeline-layout.ts).
 * - use-lifeline-scroll.ts: the intro arms once the module is in view; the
 *   browser's reveal scroll is undone on any descendant, and focus scrubs
 *   the focused year onto the stage.
 * - lifeline-desktop.tsx: waiting for view it is transparent, not hidden,
 *   so it stays focusable and in the accessibility tree.
 * - company-icon.tsx: the marks carry role="img" for their aria-label.
 */
export { Lifeline } from "./lifeline"
export { LifelineMarkerColumn } from "./lifeline-marker"
export { useLifelineScroll } from "./use-lifeline-scroll"
export { CompanyIcon } from "./company-icon"
export { LifelineLegend } from "./lifeline-legend"
export type { CompanyIconId } from "./company-icon"

export type {
  LifelineCompany,
  LifelineEvent,
  LifelineEventSegment,
  LifelineLegendItem,
  LifelineMarker,
  LifelineMetPerson,
  LifelineMentor,
  LifelineMode,
  LifelinePhoto,
  LifelineProps,
} from "./types"