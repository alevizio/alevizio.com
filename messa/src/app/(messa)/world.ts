/**
 * The Messa world — the page-scoped palette for this story route.
 *
 * The client asked for the case study to FEEL like messa.ai, so the
 * route hard-sets Messa's cream world and ignores the portfolio theme
 * (including OS dark mode) entirely. Values mirror messa-landing's
 * cream pages, which declare the same literal hexes per page
 * (e.g. `const MUTED_ACCENT = "#5A6B8F"` in src/app/jobs/page.tsx).
 *
 * Tailwind note (v4): components style with literal arbitrary values
 * like `bg-[#FBF0E6]` — the scanner needs the literals in class
 * strings, so THIS MAP IS DOCUMENTATION AND DATA (logo color props,
 * the bug exhibit), never a source for interpolated class names.
 * Literal hexes also sidestep the `@theme inline` literal-vs-var trap
 * the page's own bug exhibit is about.
 */
export const WORLD = {
  /** Page background — Messa's cream. `bg-[#FBF0E6]` */
  cream: "#FBF0E6",
  /** Primary text. `text-[#0A0A0B]` */
  ink: "#0A0A0B",
  /** Secondary text and captions. `text-[#6E6B68]` */
  secondary: "#6E6B68",
  /** Borders on cream surfaces. `border-[#E8D9C5]` */
  border: "#E8D9C5",
  /**
   * The muted slate accent of Messa's cream pages. The electric
   * brand blue #3C4BE6 appears NOWHERE on this page except inside
   * the accent-bug exhibit, where it is the specimen.
   */
  accent: "#5A6B8F",
  /** Figure cards sit on white, like Messa's content cards. */
  card: "#FFFFFF",
} as const;

/**
 * The hero sky band — Messa's modal/hero gradient, verbatim from
 * messa-landing src/components/landing/product-section.tsx.
 * `bg-[linear-gradient(180deg,#D4E3F0_0%,#E4E6E2_22%,#F0E6D8_48%,#FBF0E6_72%)]`
 */
export const SKY_GRADIENT =
  "linear-gradient(180deg, #D4E3F0 0%, #E4E6E2 22%, #F0E6D8 48%, #FBF0E6 72%)";

/** The frozen shader frame, copied from messa-landing (1536², 61 KB). */
export const PAPER_TEXTURE_URL = "/work/messa/world/paper-texture.webp";
