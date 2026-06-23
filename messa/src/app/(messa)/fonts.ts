import localFont from "next/font/local";

/*
 * Messa's licensed brand fonts, served self-hosted on this route only.
 * Shipping them here was Alejandro's explicit call within the client
 * relationship: the page is unlisted (no nav link) and robots-noindex,
 * so the fonts never appear on an indexed/public surface. Each family
 * ships weight 400 only — on Messa's pages, emphasis comes from size
 * and color, never from bolder cuts.
 */

/** Display serif — headlines and serif numerals. */
export const perfectlyNineties = localFont({
  src: "./fonts/perfectly-nineties.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-perfectly-nineties",
});

/** Serif fallback while Perfectly Nineties loads (and for glyph gaps). */
export const untitledSerif = localFont({
  src: "./fonts/untitled-serif-regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-untitled-serif",
});

/** Body and UI sans. */
export const messinaSans = localFont({
  src: "./fonts/messina-sans-regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-messina-sans",
});

/** All three variables, ready for the page wrapper's className. */
export const storyFontVariables = `${perfectlyNineties.variable} ${untitledSerif.variable} ${messinaSans.variable}`;
