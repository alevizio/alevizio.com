/**
 * Lifeline by Evil Rabbit (MIT, see LICENSE), from
 * github.com/evilrabbit/lifeline at 8ddbb3d (2026-07-31). Kept close to
 * upstream so updates can be diffed in; what changed for this site:
 *
 * - Vite, not Next: no "use client", <img> for next/image (people), `cn`
 *   from ../ui/utils, and lib/lifeline-data.ts moved in here.
 * - A `"scroll"` mode (types.ts): the page's vertical scroll moves the
 *   rail while a sticky block pins it, the way the homepage uses it. The
 *   hook syncs to page scroll and leaves wheel, keys and touch to the page;
 *   no intro; the vertical layout treats it like an embed.
 * - A `showAge` prop, for a timeline that starts at a first year instead
 *   of a birth year.
 * - Labels set lowercase like the rest of the site; palette and type come
 *   from .lifeline-typeset in src/styles/lifeline.css.
 * - use-lifeline-scroll.ts: the embed intro arms once the module is in
 *   view; narrow stages fade like touch ones; the browser's reveal scroll
 *   is undone on any descendant, and focus brings the focused year onto
 *   the stage.
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