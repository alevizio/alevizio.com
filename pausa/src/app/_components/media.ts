import type { Shot } from "./figure";

/* Every raster and recording on the page. The brand's own elements (mark,
 * lockup, icon, colour, type, pen marks, drawings) are drawn natively from
 * the kit's and the book's vectors; these are the pictures around them:
 * process/ the hand-drawn sheets and direction sketches (white paper: multiplied)
 * tools/   the tools built for the project, recorded working (mp4 + poster)
 * app/     the final iOS screens, whole, from the kit's Figma export (1320 → 900)
 * feed/    ads and social from the kit and the book
 * ooh/     the outdoor mockups, rendered from the brand book
 * Left out on purpose: anything with a rating or review, the paywall,
 * placeholder follower counts, and real third-party app icons. */

export const PROCESS = {
  margin: {
    src: "/process/direction-margin.webp",
    width: 1122,
    height: 1402,
    alt: "Pen sketches for The Margin: faces, a hand-drawn P, scribbles and small creatures.",
    label: "The Margin",
    caption: "Annotates you. It won.",
    multiply: true,
  },
  instrument: {
    src: "/process/direction-instrument.webp",
    width: 1448,
    height: 1086,
    alt: "Sketches for The Instrument: pause bars inside the wordmark, waveforms, concentric rings.",
    label: "The Instrument",
    caption: "Measures you.",
    multiply: true,
  },
  rest: {
    src: "/process/direction-rest.webp",
    width: 1086,
    height: 1448,
    alt: "Pencil sketches for The Rest: soft P letterforms and quotation marks.",
    label: "The Rest",
    caption: "Stills you.",
    multiply: true,
  },
  sheet: {
    src: "/process/sheet-marks.webp",
    width: 1364,
    height: 1079,
    alt: "A scanned sheet of mark studies drawn in blue pen: heads, hands, faces, knots and speech bubbles.",
    multiply: true,
  },
  cutting: {
    src: "/process/icon-cutting.webp",
    width: 1448,
    height: 1086,
    alt: "The 28 July sheet, Not OK Coffee, Lost Bird and Overthinking, with a box drawn round every drawing.",
    multiply: true,
  },
} as const satisfies Record<string, Shot>;

/** A tool, recorded working: the whole window, 1920 × 1200, with a poster frame. */
export type Tool = { name: string; caption: string; alt: string; video: string; poster: string };

const tool = (clip: string, name: string, caption: string, alt: string): Tool => ({
  name,
  caption,
  alt,
  video: `/tools/${clip}.mp4`,
  poster: `/tools/${clip}.jpg`,
});

export const TOOLS = {
  studio: tool(
    "studio",
    "Mark Studio",
    "Finds every drawing on a scanned sheet and boxes it, then crops, erases and traces each one to a clean vector.",
    "Mark Studio at work: a scanned sheet with every drawing boxed, one selected and traced.",
  ),
  motion: tool(
    "motion",
    "Boiling line",
    "Makes a drawing wobble as if it were redrawn every frame. Used on the margin doodles, never on the icon.",
    "The boiling-line lab: margin doodles wobbling, with sliders for amount and speed.",
  ),
  icon: tool(
    "icon",
    "Icon bench",
    "Every drawing off the July sheet, tried as a real app icon at the sizes a phone draws it.",
    "The icon bench: marks tried as app icons, switching style, ground and ink size.",
  ),
  mockups: tool(
    "mockups",
    "Screen wall",
    "All thirty prototype screens on one page, rendered live from the prototype, so it never drifts out of date.",
    "The screen wall: all thirty prototype screens, scrolling past.",
  ),
  dial: tool(
    "dial",
    "The dial",
    "How hard should Pausa push? Drag the dot and the call-out sharpens: same reader, harder pen.",
    "The prototype's dial being dragged, and the sample call-out changing with it.",
  ),
  paper: tool(
    "paper",
    "Ruled paper",
    "A page of looseleaf written by hand, then marked up in Pausa's pen: a separate test of the margin idea.",
    "A ruled-paper probe: an entry handwritten on looseleaf, marked up in Pausa's pen.",
  ),
} as const;

export type Screen = { src: string; alt: string; label?: string };

export const APP_SCREENS: readonly Screen[] = [
  { src: "/app/01-home.webp", alt: "The journal: Thursday, with the week's entries.", label: "Journal" },
  { src: "/app/08-write-talk.webp", alt: "Writing by voice: twelve seconds recorded.", label: "Write or talk" },
  { src: "/app/02-coach.webp", alt: "The coach: you've written about the Thursday thing four times this month.", label: "Coach" },
  { src: "/app/03-recap.webp", alt: "Recaps: last week, you said no once.", label: "Recaps" },
  { src: "/app/05-settings.webp", alt: "Settings, with how hard Pausa pushes.", label: "Settings" },
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
}));

// The four ads as the book draws them (p. 32), exported from the book itself.
export const FEED = {
  story: { src: "/feed/ad-story.webp", width: 600, height: 1067, alt: "A story ad: You keep writing later. It's been three weeks of later." },
  square: { src: "/feed/ad-square.webp", width: 600, height: 601, alt: "A blue feed ad: Same fear, third time this month. It hasn't changed. What has?" },
  display: { src: "/feed/ad-display.webp", width: 600, height: 501, alt: "A display ad: The journal that pushes back." },
  landscape: { src: "/feed/ad-landscape.webp", width: 1000, height: 463, alt: "A landscape ad: Three entries about the raise. You already know the answer." },
  igStory: { src: "/feed/ig-story.webp", width: 900, height: 1955, alt: "The story ad in Instagram, on a phone." },
  whatsapp: { src: "/feed/whatsapp.webp", width: 900, height: 1955, alt: "A WhatsApp chat with Pausa: you've circled this same decision three times this week." },
} as const satisfies Record<string, Shot>;

const ooh = (n: number, height: number, alt: string): Shot => ({ src: `/ooh/ooh-${n}.webp`, width: 2880, height, alt });

export const OOH = {
  billboard: ooh(34, 1620, "A blue-framed billboard: Three entries about the raise. You already know the answer."),
  shelter: ooh(36, 1599, "A bus shelter poster among autumn trees: You keep writing later."),
  subway: ooh(37, 1299, "Three posters in the city: a phone booth, a subway wall and a station entrance."),
  station: ooh(38, 1626, "A subway platform with a Pausa poster along the wall."),
} as const;
