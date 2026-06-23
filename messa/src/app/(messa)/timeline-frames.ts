export type TimelineFrame = {
  /** Public path of the optimized deploy screenshot. */
  src: string;
  /** Human-readable deploy date, precomputed to avoid locale drift between server and client. */
  label: string;
  /** Short milestone name. */
  title: string;
  /** One-line milestone caption derived from the project history. */
  caption: string;
  /** Description of what the screenshot shows. */
  alt: string;
  /**
   * Render on a white gallery mat — for dark-dominant frames that
   * would otherwise punch a hole in the cream page.
   */
  mat?: boolean;
};

export const FRAME_WIDTH = 2160;
export const FRAME_HEIGHT = 1350;

export const TIMELINE_FRAMES: readonly TimelineFrame[] = [
  {
    src: "/work/messa/timeline/01-2025-12-06-v0import.webp",
    label: "Dec 6, 2025",
    title: "The baseline",
    caption:
      "The pre-redesign landing: a dark stock night-mountain hero. Everything after this frame is the rebuild.",
    alt: "Original Messa landing page: white headline over a dark night-time mountain photo with four stat cards.",
    mat: true,
  },
  {
    src: "/work/messa/timeline/02-2026-03-20-96bd475e.webp",
    label: "Mar 20, 2026",
    title: "Exploration begins",
    caption:
      "First deploy of the redesign branch — blur-to-focus hero experiments go up for client review.",
    alt: "Concept-switcher shell with Handbook, Interactive UI and Machine tabs above an early hero reading 'See talent clearly.'",
  },
  {
    src: "/work/messa/timeline/03-2026-03-25-d9e3817b.webp",
    label: "Mar 25, 2026",
    title: "Concept pluralism",
    caption:
      "Flow, Claw Machine and Skill Sets prototyped side by side; the root page is still the concept switcher.",
    alt: "Concept-switcher shell during the second concept wave; the root render is unchanged while new prototypes live on subroutes.",
  },
  {
    src: "/work/messa/timeline/04-2026-04-30-6f42a15e.webp",
    label: "Apr 30, 2026",
    title: "The factory era",
    caption:
      "The warm cream world takes over: isometric hiring factory, serif headline, tactile letterpress buttons.",
    alt: "Factory-era hero: an isometric cream factory under a blue sky with clouds, below a serif 'See talent clearly.' headline.",
  },
  {
    src: "/work/messa/timeline/05-2026-05-06-518d8f4b.webp",
    label: "May 6, 2026",
    title: "Real voices",
    caption:
      "Re-exported hero artwork and hand-drawn characters land; real customer testimonials replace placeholder logos.",
    alt: "Factory hero with refined artwork; Prepare, Interview and Decide buildings beneath the headline.",
  },
  {
    src: "/work/messa/timeline/06-2026-05-11-bb3c0a9d.webp",
    label: "May 11, 2026",
    title: "The video gamble",
    caption:
      "A chroma-keyed hero video ships behind a WebGL shader — and is reverted days later.",
    alt: "Hero during the chroma-key video era, with the factory animation served as keyed video.",
  },
  {
    src: "/work/messa/timeline/07-2026-05-19-5e5fc9fe.webp",
    label: "May 19, 2026",
    title: "Hand-built motion",
    caption:
      "CV cards travel SVG belt paths over a static factory raster; Rive and video are gone for good.",
    alt: "Static factory hero with a hand-built SVG conveyor carrying CV cards between buildings.",
  },
  {
    src: "/work/messa/timeline/08-2026-05-21-ac5b7307.webp",
    label: "May 21, 2026",
    title: "Calibration week",
    caption:
      "Belts, wall masks, isometric shadows and building type tuned with in-page calibration tools.",
    alt: "Calibrated hero with building wall typography, isometric shadows and refined belt masks.",
  },
  {
    src: "/work/messa/timeline/09-2026-05-22-e9856d4b.webp",
    label: "May 22, 2026",
    title: "Promoted to production",
    caption:
      "The polished hero ships after the perf war takes mobile LCP from 11 seconds toward 2.",
    alt: "The polished production hero after the performance overhaul.",
  },
  {
    src: "/work/messa/timeline/10-2026-05-28-853621f5.webp",
    label: "May 28, 2026",
    title: "Content overhaul",
    caption:
      "The 'Every hire sharpens the next one' chalkboard section, a restructured breakdown, FAQ and CTA rewrites.",
    alt: "Landing page after the content overhaul, with reworked sections and copy.",
  },
  {
    src: "/work/messa/timeline/11-2026-05-28-660300b5.webp",
    label: "May 28, 2026",
    title: "Booking gets real",
    caption:
      "Cal.com wired behind the paper desk calendar, with a paper-plane transition into confirmation.",
    alt: "Landing page on the day live Cal.com booking shipped inside the demo modal.",
  },
  {
    src: "/work/messa/timeline/12-2026-05-29-907f44b6.webp",
    label: "May 29, 2026",
    title: "Butterflies",
    caption:
      "Two animated butterflies, recolored to the exact Messa blue of the demo button, settle over the footer CTA.",
    alt: "Landing page on the day animated Messa-blue butterflies joined the footer call to action.",
  },
  {
    src: "/work/messa/timeline/13-2026-06-04-ad877286.webp",
    label: "Jun 4, 2026",
    title: "Going underground",
    caption:
      "The 'Underneath the workflow' section digs geological strata — and six product principles — into the earth below the page.",
    alt: "Landing page with the new underground strata section beneath the landscape.",
  },
  {
    src: "/work/messa/timeline/14-2026-06-08-0979f40b.webp",
    label: "Jun 8, 2026",
    title: "Launch hardening",
    caption:
      "Pre-launch polish: animated dig open/close, serif pull-quote with a drawn underline, OG card and marquee fixes.",
    alt: "Pre-launch hardening build with the animated dig and serif pull-quote.",
  },
  {
    src: "/work/messa/timeline/15-2026-06-10-1210d07f.webp",
    label: "Jun 9, 2026",
    title: "The letter types itself",
    caption:
      "The founder letter now types on page load — the last refinement before handoff.",
    alt: "Final captured build; the founder letter on the About page now types itself on load.",
  },
];
