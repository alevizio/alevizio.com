import type { Shot } from "./figure";

/* Every image on the page, in one place. Sources:
 * book/   spreads from the 41-page brand book (Figma → PDF → WebP)
 * process/ the hand-drawn sheets and direction sketches from the repo
 * site/   crops of the pausa.co design, desktop 1440
 * app/    final app screens from the brand kit
 * Nothing here shows a rating, a review, a price or another company's work. */

const spread = (page: number, alt: string, caption?: string): Shot => ({
  src: `/book/page-${String(page).padStart(2, "0")}.webp`,
  width: 2400,
  height: 1350,
  alt,
  label: `Brand book · ${page}`,
  caption,
});

export const BOOK = {
  app: spread(29, "Four app screens: the journal, the coach, the recaps, and a blank entry, each under a headline marked in pen.", "The app, as the brand book closes on it."),
  truth: spread(8, "Brand book spread: The problem isn't thinking too little. It's thinking in loops."),
  icon: spread(10, "The tangle icon on its paper tile at 180, 120, 80, 58 and 40 pixels.", "At the sizes a phone actually renders it: 180 home screen, 120 and 80 Spotlight, 58 Settings, 40 notification."),
  lockup: spread(11, "Lockup construction: the tangle and the handwritten name, measured in one module.", "Construction, not preference: every number comes from u, the icon box divided by eight."),
  grounds: spread(12, "The lockup on white, on the paper texture, and on blue; the tile stays light on all three.", "Two lockups, not six: the tile stays light, only the name changes colour."),
  voice: spread(14, "Brand book spread: the lines Pausa actually ships, on a lock screen, a notification and a chat.", "Not a tone chart: the copy as it lands."),
  strokes: spread(17, "The pen set: eighteen hand-drawn strokes, underlines, strikes, carets and an arrow, in blue.", "The pen set: strokes, from the underline to the caret."),
  highlights: spread(19, "Highlighter swatches in yellow: single and double passes.", "The highlighter: single and double passes, always behind ink."),
  ads: spread(32, "Digital ads: one line each, on paper, with a single mark.", "Pausa's whole argument fits in one line, so the ads are one line."),
} as const;

export const PROCESS = {
  margin: {
    src: "/process/direction-margin.webp",
    width: 1122,
    height: 1402,
    alt: "Pen sketches for The Margin: faces, a hand-drawn P, scribbles and small creatures.",
    label: "The Margin",
    caption: "Annotates you. The one that won.",
  },
  instrument: {
    src: "/process/direction-instrument.webp",
    width: 1448,
    height: 1086,
    alt: "Sketches for The Instrument: pause bars inside the wordmark, waveforms, concentric rings.",
    label: "The Instrument",
    caption: "Measures you.",
  },
  rest: {
    src: "/process/direction-rest.webp",
    width: 1086,
    height: 1448,
    alt: "Pencil sketches for The Rest: soft P letterforms and quotation marks.",
    label: "The Rest",
    caption: "Stills you.",
  },
  sheet: {
    src: "/process/sheet-marks.webp",
    width: 1364,
    height: 1079,
    alt: "A scanned sheet of mark studies drawn in blue pen: heads, hands, faces, knots and speech bubbles.",
    label: "July · Studies",
    caption: "A sheet of mark studies, in the pen the blue is matched to.",
  },
  cutting: {
    src: "/process/icon-cutting.webp",
    width: 1448,
    height: 1086,
    alt: "The icon-directions sheet with a coloured box drawn round every drawing by the cutting tool.",
    label: "Mark Studio",
    caption: "The tool I built to find, cut out and trace every drawing on a scan.",
  },
  directions: {
    src: "/process/icon-directions.webp",
    width: 1448,
    height: 1086,
    alt: "A hand-drawn sheet with three icon directions: Not OK Coffee, Lost Bird and Overthinking.",
    label: "28 July · Icon directions",
    caption: "Not OK Coffee, Lost Bird, Overthinking.",
  },
  glyphs: {
    src: "/process/sheet-glyphs.webp",
    width: 1351,
    height: 1070,
    alt: "Hand-drawn interface glyphs: talk, send, journal, coach and settings.",
    label: "Cut",
    caption: "Hand-drawn interface glyphs. They went; Lucide stayed.",
  },
  illos: {
    src: "/process/sheet-illos.webp",
    width: 1369,
    height: 1064,
    alt: "Hand-drawn onboarding illustrations: write or talk, Pausa listens, gives you clarity.",
    label: "Kept",
    caption: "Onboarding drawings: write or talk, Pausa listens, gives you clarity.",
  },
} as const satisfies Record<string, Shot>;

export const SITE = {
  hero: {
    src: "/site/hero.webp",
    width: 2400,
    height: 925,
    alt: "The pausa.co hero: You already know. We just say it out loud. The journal that pushes back.",
    label: "pausa.co · Hero",
  },
  problem: {
    src: "/site/problem.webp",
    width: 2400,
    height: 1542,
    alt: "Website section: Most journals are built to make you feel better. Almost none are built to make you honest.",
    label: "pausa.co · The problem",
  },
  reads: {
    src: "/site/reads.webp",
    width: 2400,
    height: 1642,
    alt: "A blue website section: It reads what you write, beside a phone showing the coach.",
    label: "pausa.co · What it does",
  },
} as const satisfies Record<string, Shot>;

export type Screen = { src: string; alt: string; label: string };

export const APP_SCREENS: readonly Screen[] = [
  { src: "/app/01-home.webp", alt: "The journal: Thursday, with the week's entries.", label: "Journal" },
  { src: "/app/08-write-talk.webp", alt: "Writing by voice: twelve seconds recorded.", label: "Write or talk" },
  { src: "/app/02-coach.webp", alt: "The coach: you've written about the Thursday thing four times this month.", label: "Coach" },
  { src: "/app/03-recap.webp", alt: "Recaps: last week, you said no once.", label: "Recaps" },
  { src: "/app/05-settings.webp", alt: "Settings: how hard should Pausa push? Gentle, honest or blunt.", label: "The dial" },
];

const APP_STORE_TITLES = [
  "The journal that pushes back",
  "It reads you back",
  "It finds the loop you keep circling",
  "Say one true thing",
  "No dashboard. It comes to you",
  "Write or talk",
  "Pausa reads it back",
  "Gives you clarity",
  "You already know. We just say it out loud",
  "Write it, or just say it",
  "It won't clap",
] as const;

export const APP_STORE: readonly Screen[] = APP_STORE_TITLES.map((title, i) => ({
  src: `/appstore/slide-${String(i + 1).padStart(2, "0")}.webp`,
  alt: `App Store slide ${i + 1}: ${title}.`,
  label: i < 2 ? `${String(i + 1).padStart(2, "0")} · before the swipe` : String(i + 1).padStart(2, "0"),
}));
