export type CaseImage = {
  /** Public path of the optimized image. */
  src: string;
  /** Description of what the image shows. */
  alt: string;
  width: number;
  height: number;
  /** Short visible caption. Omitted captions render image-only. */
  caption?: string;
  /**
   * Render on a white gallery mat. For dark-dominant assets that would
   * otherwise punch holes in the cream page — matted, they read as
   * framed specimens instead.
   */
  mat?: boolean;
  /** Mat background tone. Defaults to white; "cream" blends a light card into
   * the page (no white frame) instead of matting it like a dark specimen. */
  matTone?: "white" | "cream";
};

export type ConceptBlock = {
  name: string;
  /** The concept's own tagline, quoted from the prototype. */
  tagline: string;
  /** Outcome badge: died in review or won. */
  verdict: string;
  won: boolean;
  /** What it argued and how it died or won — three sentences, max. */
  story: string;
  images: readonly CaseImage[];
  /** Optional motion capture rendered large above the stills. */
  clip?: MotionClip;
};

export type MotionClip = {
  src: string;
  poster: string;
  width: number;
  height: number;
  title: string;
  caption: string;
  /** Accessible description of the silent clip. */
  label: string;
  /** Render on a white gallery mat — see CaseImage.mat. */
  mat?: boolean;
};

/** Rendered width of a horizontal-gallery item. */
export type GallerySpan = "narrow" | "default" | "wide" | "xwide";

/** One slide in a HorizontalGallery — an image or a silent clip. */
export type GalleryItem =
  | { kind: "image"; image: CaseImage; span?: GallerySpan }
  | { kind: "video"; clip: MotionClip; span?: GallerySpan };

/** Lifts a list of stills into gallery items at a shared span. `mat: true`
 * pads each on a white mat (object-contain) so wide cards aren't cropped;
 * `mat: "cream"` instead renders the card at the image's own aspect with the
 * border hugging it — no padding, no white, no crop. */
export const imageItems = (
  images: readonly CaseImage[],
  span?: GallerySpan,
  mat?: boolean | "cream",
): readonly GalleryItem[] =>
  images.map((image) => ({
    kind: "image",
    image:
      mat === "cream"
        ? { ...image, matTone: "cream" }
        : mat
          ? { ...image, mat: true, matTone: "white" }
          : image,
    span,
  }));

export type BrandSwatch = {
  name: string;
  hex: string;
  /** Where the color is used on the live page. */
  usage: string;
};

/** Concept screenshots were captured at 2880×1800 and re-cut to 1600×1000. */
const CONCEPT_W = 1600;
const CONCEPT_H = 1000;

export const RESEARCH_WALL: readonly CaseImage[] = [
  {
    src: "/work/messa/research/research-posthog-homepage.webp",
    alt: "PostHog homepage with hand-drawn hedgehog characters around a desktop-OS style product UI.",
    width: 1440,
    height: 900,
    caption:
      "PostHog — the explicitly cited bar: a serious technical product led by hand-drawn characters and dense personality.",
  },
  {
    src: "/work/messa/research/research-anthropic-hero.webp",
    alt: "Anthropic homepage hero with editorial serif typography on a warm paper background.",
    width: 1440,
    height: 900,
    caption:
      "Anthropic — editorial serif on warm paper; seriousness about AI without a single dashboard screenshot.",
  },
  {
    src: "/work/messa/research/research-stripe-hero.webp",
    alt: "Stripe homepage hero with the headline 'Financial infrastructure to grow your revenue' above a logo bar.",
    width: 1440,
    height: 900,
    caption: "Stripe — headline economy and the logo-bar trust pattern.",
  },
  {
    src: "/work/messa/research/research-wisprflow-hero.webp",
    alt: "Wispr Flow hero with 'Don't type, just speak' set in mixed serif weights along curved text paths.",
    width: 1440,
    height: 900,
    caption:
      "Wispr Flow — playful, hand-set type carrying an AI product without feeling unserious.",
  },
  {
    src: "/work/messa/research/research-mindmarket-hero.webp",
    alt: "MindMarket hero with 'Real human insights' in huge grotesk type on flat green beside joyful human illustration.",
    width: 1440,
    height: 900,
    caption:
      "MindMarket — the clearest pointer toward the hand-drawn, human-first direction that won.",
  },
  {
    src: "/work/messa/research/research-designspells-hero.webp",
    alt: "Design Spells homepage: a catalog grid of UI details that feel like magic.",
    width: 1440,
    height: 900,
    caption:
      "Design Spells — the bar for micro-craft; the reminder that differentiation lives in details.",
  },
  {
    src: "/work/messa/research/research-metaview-hero.webp",
    alt: "Metaview homepage: 'AI agents for recruiting' over dark gradient feature cards.",
    width: 1440,
    height: 900,
    caption:
      "Metaview — AI-recruiting category reference: dark gradient feature cards, agent-led messaging.",
  },
  {
    src: "/work/messa/research/research-hirevue-hero.webp",
    alt: "HireVue homepage with candidate-scoring product shots and a Request Demo button.",
    width: 1440,
    height: 900,
    caption:
      "HireVue — the enterprise end of the category: product shots and a demo-first conversion path.",
  },
  {
    src: "/work/messa/research/research-brighthire-hero.webp",
    alt: "BrightHire homepage: 'AI built for exceptional hiring' on a purple gradient above a logo bar.",
    width: 1440,
    height: 900,
    caption:
      "BrightHire — purple gradient over a logo bar, the category's most common visual formula.",
  },
];

/* These three exploration clips carry blur redactions baked into the
 * pixels (an unreleased capability's copy, verified illegible frame by
 * frame) — the redacted patches read as soft loading states. Captured
 * at 1600×1000 like the other XL clips; declared here, ahead of
 * CONCEPT_BLOCKS, so the Machine block can reference its own motion. */
export const MACHINE_PIPELINE_CLIP: MotionClip = {
  src: "/work/messa/motion-xl/machine-pipeline.mp4",
  poster: "/work/messa/motion-xl/machine-pipeline-poster.jpg",
  width: 1600,
  height: 1000,
  title: "The Machine, in motion",
  caption:
    "The winning concept as it ran on March 20 — a document drops through Define, Shortlist, Assess, Decide as you scroll.",
  label:
    "Silent clip of the Machine concept: a document falling through the numbered pipeline stages while the page scrolls.",
};

/* The light /claw hero (recovered from messa-landing 100da0d) — the claw
 * crane on a white sky, re-recorded to replace the dark arcade-cabinet
 * capture (client call 2026-06-12: keep the claw, lose the dark bg). */
export const CLAW_CABINET_CLIP: MotionClip = {
  src: "/work/messa/motion-xl/claw-light.mp4",
  poster: "/work/messa/motion-xl/claw-light-poster.jpg",
  width: 1600,
  height: 1000,
  title: "The Claw",
  caption:
    "The claw drops through a pile of CVs and lifts the best-fit candidate into focus.",
  label:
    "Silent clip of the Claw hero prototype: a claw crane descending into a pile of CV cards and lifting one into a scored candidate card on a cloud-filled sky.",
};

export const BLUR_FOCUS_CLIP: MotionClip = {
  src: "/work/messa/motion-xl/blur-focus.mp4",
  poster: "/work/messa/motion-xl/blur-focus-poster.jpg",
  width: 1600,
  height: 1000,
  title: "Blur to focus",
  caption:
    "The visual pun played straight: the page resolves from blur as “see talent clearly” lands.",
  label:
    "Silent clip of a blur-to-focus hero experiment: the page sharpening from a blur as the headline appears.",
};

/* Recovered from messa-landing commit 100da0d (/pipeline route) — the
 * data-stream funnel hero, recorded live off that build. */
export const PIPELINE_SIGNAL_CLIP: MotionClip = {
  src: "/work/messa/motion-xl/pipeline-signal.mp4",
  poster: "/work/messa/motion-xl/pipeline-signal-poster.jpg",
  width: 1600,
  height: 1000,
  title: "The Pipeline",
  caption:
    "“From noise to signal” — scored candidate cards stream in from the edges and converge into one ranked signal.",
  label:
    "Silent clip of the Pipeline hero prototype: candidate skill cards flowing in from the edges of the screen and converging into a central Messa signal mark.",
};

/* Recovered from messa-landing commit 1dfce41 (Mar 19) — the scroll-driven
 * 3D book (6-face CSS box). Recorded live off that build, testimonials with
 * confidential names hidden during capture. */
export const HANDBOOK_OPEN_CLIP: MotionClip = {
  src: "/work/messa/concepts/handbook-open.mp4",
  poster: "/work/messa/concepts/handbook-open-poster.jpg",
  width: 1600,
  height: 1000,
  title: "The Handbook, opening",
  caption:
    "The recovered March 19 build — scroll and the book pulls off the shelf and its cover hinges open to Chapter 1.",
  label:
    "Silent clip of the Handbook concept: a 3D book on a shelf rotates forward and its cover opens to reveal Chapter 1.",
};

export const CONCEPT_BLOCKS: readonly ConceptBlock[] = [
  {
    name: "The Handbook",
    tagline: "The last hiring playbook you'll ever open.",
    verdict: "Died in review",
    won: false,
    story:
      "A physical book on a shelf of boring HR books — scroll and the spine pulls forward, the cover hinges open to Chapter 1. My favorite, and it died in one client question: would a visitor think Messa sells books?",
    clip: HANDBOOK_OPEN_CLIP,
    images: [
      {
        src: "/work/messa/concepts/handbook-hero-2026-03-20.webp",
        alt: "The Handbook concept hero: a bookshelf of plain HR books with one blue Messa book spine.",
        width: CONCEPT_W,
        height: CONCEPT_H,
        caption: "The shelf — one blue spine among the HR books.",
      },
      {
        src: "/work/messa/concepts/handbook-book-open-2026-03-20.webp",
        alt: "The Messa book pulled from the shelf and opened to Chapter 1: 'You post a role. 200 CVs land.'",
        width: CONCEPT_W,
        height: CONCEPT_H,
        caption: "Click the spine, the book opens — Chapter 1 of 4.",
      },
      {
        src: "/work/messa/concepts/handbook-section-2026-03-20.webp",
        alt: "Handbook concept content: a red and blue Before/After comparison table above the 'Four steps. One system.' grid.",
        width: CONCEPT_W,
        height: CONCEPT_H,
        caption: "Below the book: Before/After and 'Four steps. One system.'",
      },
    ],
  },
  {
    name: "The Machine",
    tagline: "Drop a job description. Watch the machine work.",
    verdict: "Won — became the factory",
    won: true,
    story:
      "A document falls down a vertical pipeline as you scroll, landing as a confident hire. It won because input → process → output was the product's actual story — a month later, the machine became the factory.",
    clip: MACHINE_PIPELINE_CLIP,
    images: [
      {
        src: "/work/messa/concepts/machine-hero-2026-03-20.webp",
        alt: "The Machine concept hero: a dropped document icon above a vertical pipeline entering stage 1, Define.",
        width: CONCEPT_W,
        height: CONCEPT_H,
        caption: "A document drops into the vertical pipeline — stage 1, Define.",
      },
      {
        src: "/work/messa/concepts/machine-assess-2026-03-20.webp",
        alt: "The Machine concept mid-pipeline: stage 3, Assess — 'Stay sharp in the conversation' beside the vertical track.",
        width: CONCEPT_W,
        height: CONCEPT_H,
        caption: "Mid-pipeline — stage 3, Assess: guidance while the conversation is live.",
      },
      {
        src: "/work/messa/concepts/machine-section-2026-03-20.webp",
        alt: "Bottom of the machine pipeline: the output pill 'Confident hire. Evidence you can explain.' above testimonial cards.",
        width: CONCEPT_W,
        height: CONCEPT_H,
        caption: "The pipeline's last stop: the decision, with the evidence attached.",
      },
    ],
  },
];

export const SECOND_WAVE: readonly CaseImage[] = [
  {
    src: "/work/messa/concepts/hero-concept-flow-hero-2026-03-25.webp",
    alt: "The Flow hero concept: blurred CV cards raining in around the headline.",
    width: CONCEPT_W,
    height: CONCEPT_H,
    caption: "The Flow — CV cards rain in blurred, with mouse parallax.",
  },
  {
    src: "/work/messa/concepts/hero-concept-flow-mid-2026-03-25.webp",
    alt: "Mid-scroll of the Flow concept: a candidate card crossing the processing line as the blue diamond stamps skill chips into focus.",
    width: CONCEPT_W,
    height: CONCEPT_H,
    caption: "The Flow, mid-scroll — the Messa diamond stamps skills into focus.",
  },
  {
    src: "/work/messa/concepts/hero-concept-claw-hero-2026-03-25.webp",
    alt: "The Claw concept: an arcade claw-machine cabinet labeled MESSA, full of CV cards, on a near-black background.",
    width: CONCEPT_W,
    height: CONCEPT_H,
    caption: "The Claw — an arcade cabinet full of CVs.",
    mat: true,
  },
  {
    src: "/work/messa/concepts/hero-concept-claw-action-2026-03-25.webp",
    alt: "The claw holding Sarah Chen's candidate card: 92% fit and skill chips.",
    width: CONCEPT_W,
    height: CONCEPT_H,
    caption: "The Claw, four seconds in — the right card lifted from the pile.",
    mat: true,
  },
  {
    src: "/work/messa/concepts/hero-concept-skillsets-hero-2026-03-25.webp",
    alt: "Skill Sets concept: skill nodes orbiting a central Messa diamond, wired to four product feature cards.",
    width: CONCEPT_W,
    height: CONCEPT_H,
    caption: "Skill Sets — a constellation of skills wired to features.",
  },
  {
    src: "/work/messa/concepts/hero-concept-skillsets-detail-2026-03-25.webp",
    alt: "Hover state of the Skill Sets constellation: the Shortlisting card lit blue with its connected skill nodes.",
    width: CONCEPT_W,
    height: CONCEPT_H,
    caption: "Skill Sets, on hover — Shortlisting lights up its skills.",
  },
  {
    src: "/work/messa/concepts/focus-experiments-autofocus-2026-03-20.webp",
    alt: "Autofocus experiment: the pre-redesign hero copy with a pure-CSS blur-to-focus treatment.",
    width: CONCEPT_W,
    height: CONCEPT_H,
    caption: "Autofocus — pure-CSS blur-to-focus on the old hero copy.",
  },
  {
    src: "/work/messa/concepts/focus-experiments-depth-layers-2026-03-20.webp",
    alt: "Depth Layers experiment: blurred candidate cards and diamonds floating at different depths around a sharp headline.",
    width: CONCEPT_W,
    height: CONCEPT_H,
    caption: "Depth Layers — blurred cards at parallax depths.",
  },
  {
    src: "/work/messa/concepts/focus-experiments-binocular-2026-03-20.webp",
    alt: "Binocular Reveal experiment: the page blurred except a circular lens that follows the mouse.",
    width: CONCEPT_W,
    height: CONCEPT_H,
    caption: "Binocular Reveal — a sharp lens follows the mouse.",
  },
];

export const FLOW_LANDING: readonly CaseImage[] = [
  {
    src: "/work/messa/concepts/flow-landing-hero-2026-03-25.webp",
    alt: "The /flow landing hero: 'AI-powered hiring — See talent clearly. 200 CVs go in. The strongest candidates come out.'",
    width: CONCEPT_W,
    height: CONCEPT_H,
    caption:
      "March 25 — the headline that stuck, now opening the first complete landing.",
  },
  {
    src: "/work/messa/concepts/flow-landing-mid-2026-03-25.webp",
    alt: "Mid-page of the /flow landing: pain points and product sections after the scroll-driven hero resolves.",
    width: CONCEPT_W,
    height: CONCEPT_H,
    caption: "Pain points, before/after, four steps.",
  },
  {
    src: "/work/messa/concepts/flow-landing-dashboard-2026-03-25.webp",
    alt: "Deeper /flow section: candidate rows with fit scores, customer quotes, and the 'Not another tool. The missing layer.' block.",
    width: CONCEPT_W,
    height: CONCEPT_H,
    caption: "The dashboard tail and 'Not another tool. The missing layer.'",
  },
];

export const AI_EXPLORATIONS: readonly CaseImage[] = [
  {
    src: "/work/messa/explorations/ai-exploration-recruitlytics-dashboard.webp",
    alt: "AI-generated 'Recruitlytics' hiring dashboard that looks credible at a glance and dissolves on close reading.",
    width: 1408,
    height: 768,
    caption:
      "Credible at a glance, nonsense up close: 'Sarah Chen is provision: moxiture.' AI imagery imitates the shape of meaning.",
    mat: true,
  },
  {
    src: "/work/messa/explorations/ai-exploration-job-analytics-dark.webp",
    alt: "AI-generated dark-mode job analytics dashboard with duplicated rows and garbled labels.",
    width: 1408,
    height: 768,
    caption:
      "Dark-mode 'Job Analytics', starring a 'RIchuster Engineer.' The genre was wrong, not just the execution.",
    mat: true,
  },
  {
    src: "/work/messa/explorations/ai-exploration-live-interview-assistant.webp",
    alt: "AI-generated video-interview mock with an AI interview assistant sidebar and stock-photo-style synthetic people.",
    width: 1408,
    height: 768,
    caption:
      "Photoreal synthetic people, fake transcription UI — the look every AI hiring tool defaults to.",
  },
  {
    src: "/work/messa/explorations/ai-exploration-top-candidates-card.webp",
    alt: "AI-generated 'Top Candidates' card ranking named people by percentage with green checkmarks.",
    width: 1024,
    height: 1024,
    caption:
      "Humans ranked on a leaderboard with green checkmarks — exactly the cold framing Messa set out to avoid.",
  },
  {
    src: "/work/messa/explorations/ai-exploration-cv-stack-illustration.webp",
    alt: "AI-generated flat illustration of a stack of CVs with warped 'Curriculum Vitae' lettering.",
    width: 1600,
    height: 873,
    caption:
      "The closest to humane — until the type half-melts. It hinted at illustration; hand-drawing did it for real.",
  },
];

export const CHROMAKEY_ERA: readonly CaseImage[] = [
  {
    src: "/work/messa/concepts/chromakey-video-hero-2026-05-06.webp",
    alt: "The factory hero rendered as live video through a WebGL chromakey shader, composited over the sky-gradient section.",
    width: CONCEPT_W,
    height: CONCEPT_H,
    caption:
      "May 6 — the chromakey era: the factory hero served as live video, a WebGL shader keying out magenta in the browser.",
  },
  {
    src: "/work/messa/concepts/chromakey-video-section-2026-05-06.webp",
    alt: "The first content section below the chromakey hero on the same May 6 deploy.",
    width: CONCEPT_W,
    height: CONCEPT_H,
    caption:
      "The same deploy below the fold. Five days later the video was reverted for the static raster and hand-built motion.",
  },
];

/** XL clips were captured at 1600×1000. */
const XL_W = 1600;
const XL_H = 1000;

/** The Flow hero concept in motion — the surviving exploration capture. */
export const FLOW_RAIN_CLIP: MotionClip = {
  src: "/work/messa/motion-xl/flow-rain.mp4",
  poster: "/work/messa/motion-xl/flow-rain-poster.jpg",
  width: XL_W,
  height: XL_H,
  title: "The Flow, in motion",
  caption:
    "Blurred CV cards rain in with mouse parallax, cross the Messa processing line, and stamp into a scored candidate card.",
  label:
    "Silent clip of the Flow hero concept: blurred CV cards raining in with mouse parallax and stamping into a scored candidate card at the processing line.",
};

/** The early-May chromakey video hero, before the revert to static raster. */
export const CHROMAKEY_HERO_CLIP: MotionClip = {
  src: "/work/messa/motion-xl/chromakey-hero.mp4",
  poster: "/work/messa/motion-xl/chromakey-hero-poster.jpg",
  width: XL_W,
  height: XL_H,
  title: "The chromakey era",
  caption:
    "May 6 — the factory playing as live video through an in-browser WebGL magenta-key shader. Reverted five days later.",
  label:
    "Silent clip of the chromakey-era hero: the isometric factory playing as live video through a WebGL magenta-key shader, clouds drifting and the trust badge cycling.",
};

/** The production factory hero at full capture resolution. */

/** Apr 9 — the lost isometric pipeline, animating (recovered deploy capture). */
export const ISO_PIPELINE_CLIP: MotionClip = {
  src: "/work/messa/april/clip-flat-iso-smooth.mp4?v=2",
  poster: "/work/messa/april/clip-flat-iso-smooth-poster.webp?v=2",
  width: 1920,
  height: 1080,
  title: "Flat to isometric",
  caption:
    "April 9 — one toggle stood the pipeline up: the flat funnel tilts into isometric diamonds on a diagonal track, then lies back down. Two weeks later the factory absorbed the idea.",
  label:
    "Silent looping clip of the recovered April pipeline hero morphing from a flat horizontal funnel to an isometric diagonal track and back.",
};

/** Apr 9 — the background switcher cycling all seven style options. */
export const BG_SWITCHER_CLIP: MotionClip = {
  src: "/work/messa/april/clip-apr09-background-switcher.mp4",
  poster: "/work/messa/april/clip-apr09-background-switcher-poster.webp",
  width: 2880,
  height: 1620,
  title: "The background switcher",
  caption:
    "April 9 — the style matrix: art direction as a working control panel.",
  label:
    "Silent clip of the in-page background switcher cycling seven painted background styles behind the live pipeline hero.",
};

const APRIL_W = 2880;
const APRIL_H = 1620;

/** Flat → iso → factory, in recovered deploy stills. */
export const PIPELINE_EVOLUTION: readonly GalleryItem[] = [
  { kind: "image", image: { src: "/work/messa/april/02-apr09-pipeline-flat.webp", alt: "The flat pipeline hero: a particle funnel feeding four horizontal step cards.", width: APRIL_W, height: APRIL_H, caption: "April 9 — the flat baseline: a particle funnel converging into four steps." } },
  { kind: "image", image: { src: "/work/messa/april/03-apr09-pipeline-isometric.webp", alt: "The isometric pipeline: four diamond step cards climbing a diagonal track.", width: APRIL_W, height: APRIL_H, caption: "The same hero flipped to Iso — the projection that taught the page to think in 3D." } },
  { kind: "image", image: { src: "/work/messa/april/11-apr09-iso-plus-watercolor.webp", alt: "The isometric pipeline combined with a watercolor painted background scene.", width: APRIL_W, height: APRIL_H, caption: "The matrix combined: iso pipeline over a watercolor world." } },
  { kind: "image", image: { src: "/work/messa/april/12-apr23-factory-isometric-hero.webp", alt: "The first /factory hero: an isometric hiring factory with Prepare, Interview and Decide buildings.", width: APRIL_W, height: APRIL_H, caption: "April 23 — /factory is born: the diamonds grow walls, belts and a parking spot. The pipeline dies the next day." } },
];

/** The seven-style switcher era, still by still. */
export const SWITCHER_STYLES: readonly GalleryItem[] = [
  { kind: "image", image: { src: "/work/messa/april/04-apr09-switcher-panel.webp", alt: "The in-page style-matrix panel: font, hero view, button style, icons and background style rows.", width: APRIL_W, height: APRIL_H, caption: "The panel itself — fonts, hero view, buttons, icons and backgrounds, all flippable on the live page." } },
  { kind: "image", image: { src: "/work/messa/april/05-apr09-bg-watercolor.webp", alt: "Watercolor painted landscape behind the pipeline hero.", width: APRIL_W, height: APRIL_H, caption: "STYLE: Watercolor — the client favorite." } },
  { kind: "image", image: { src: "/work/messa/april/06-apr09-bg-pastel.webp", alt: "Soft pastel sunset scene behind the pipeline hero.", width: APRIL_W, height: APRIL_H, caption: "STYLE: Pastel — lavender sunset." } },
  { kind: "image", image: { src: "/work/messa/april/07-apr09-bg-oleo.webp", alt: "Oil-paint meadow scene behind the pipeline hero.", width: APRIL_W, height: APRIL_H, caption: "STYLE: Oleo — oil-paint meadow." } },
  { kind: "image", image: { src: "/work/messa/april/08-apr09-bg-ink-wash.webp", alt: "Blue-grey ink-wash landscape behind the pipeline hero.", width: APRIL_W, height: APRIL_H, caption: "STYLE: Ink & Wash." } },
  { kind: "image", image: { src: "/work/messa/april/09-apr09-bg-gouache.webp", alt: "Warm gouache meadow scene behind the pipeline hero.", width: APRIL_W, height: APRIL_H, caption: "STYLE: Gouache." } },
  { kind: "image", image: { src: "/work/messa/april/10-apr09-bg-impressionism.webp", alt: "Green-blue impressionist scene behind the pipeline hero.", width: APRIL_W, height: APRIL_H, caption: "STYLE: Impressionism." } },
];


/** The style matrix's type tests — five display faces, four body faces. */
export const TYPE_TESTS: readonly GalleryItem[] = [
  { kind: "video", clip: { src: "/work/messa/april/clip-fonts.mp4", poster: "/work/messa/april/clip-fonts-poster.webp", width: 1920, height: 1080, title: "Display fonts, live", caption: "The hero re-set in Canela, Perfectly Nineties, Source Serif Pro, Items Light and Emilio — one click each.", label: "Silent clip cycling the live hero through five display typefaces via the in-page panel." } },
  { kind: "image", image: { src: "/work/messa/april/font-display-canela.webp", alt: "The pipeline hero set in Canela.", width: 1600, height: 900, caption: "Display: Canela." } },
  { kind: "image", image: { src: "/work/messa/april/font-display-perfectly-nineties.webp", alt: "The pipeline hero set in Perfectly Nineties.", width: 1600, height: 900, caption: "Display: Perfectly Nineties — the winner." } },
  { kind: "image", image: { src: "/work/messa/april/font-display-source-serif-pro.webp", alt: "The pipeline hero set in Source Serif Pro.", width: 1600, height: 900, caption: "Display: Source Serif Pro." } },
  { kind: "image", image: { src: "/work/messa/april/font-display-items-light.webp", alt: "The pipeline hero set in Items Light.", width: 1600, height: 900, caption: "Display: Items Light — the sans candidate." } },
  { kind: "image", image: { src: "/work/messa/april/font-display-emilio.webp", alt: "The pipeline hero set in Emilio.", width: 1600, height: 900, caption: "Display: Emilio." } },
  { kind: "image", image: { src: "/work/messa/april/font-body-messina-sans.webp", alt: "Body copy set in Messina Sans.", width: 1600, height: 900, caption: "Body: Messina Sans — the winner." } },
  { kind: "image", image: { src: "/work/messa/april/font-body-inter.webp", alt: "Body copy set in Inter.", width: 1600, height: 900, caption: "Body: Inter." } },
  { kind: "image", image: { src: "/work/messa/april/font-body-geist.webp", alt: "Body copy set in Geist.", width: 1600, height: 900, caption: "Body: Geist." } },
  { kind: "image", image: { src: "/work/messa/april/font-body-geist-mono.webp", alt: "Body copy set in Geist Mono.", width: 1600, height: 900, caption: "Body: Geist Mono — the wildcard." } },
];

/** The style matrix's icon-set tests. */
export const ICON_TESTS: readonly GalleryItem[] = [
  { kind: "video", clip: { src: "/work/messa/april/clip-icons.mp4", poster: "/work/messa/april/clip-icons-poster.webp", width: 1920, height: 1080, title: "Icon sets, live", caption: "Tabler, Flex Duo, Sharp Duo and Plump Duo swapped across the whole page — Core Solid joined two weeks later and shipped.", label: "Silent clip cycling the page's icon set through four icon families via the in-page panel." } },
  { kind: "image", image: { src: "/work/messa/april/icons-tabler.webp", alt: "The pipeline page using the Tabler icon set.", width: 1600, height: 900, caption: "Icons: Tabler — the outline baseline." } },
  { kind: "image", image: { src: "/work/messa/april/icons-flex-duo.webp", alt: "The pipeline page using the Flex Duo icon set.", width: 1600, height: 900, caption: "Icons: Flex Duo." } },
  { kind: "image", image: { src: "/work/messa/april/icons-sharp-duo.webp", alt: "The pipeline page using the Sharp Duo icon set.", width: 1600, height: 900, caption: "Icons: Sharp Duo." } },
  { kind: "image", image: { src: "/work/messa/april/icons-plump-duo.webp", alt: "The pipeline page using the Plump Duo icon set.", width: 1600, height: 900, caption: "Icons: Plump Duo." } },
];

/** The trailer — the whole story in 46 seconds, at the top of the page. */
export const TRAILER_CLIP: MotionClip = {
  src: "/work/messa/clips/trailer.mp4",
  poster: "/work/messa/clips/trailer-poster.jpg",
  width: 1600,
  height: 900,
  title: "The trailer",
  caption: "Forty-six seconds of the place — every page, every detail.",
  label:
    "Silent trailer for the Messa landing: tours of every page, the interactions, and the design details, ending on the See talent clearly sign-off.",
};

export const HERO_XL_CLIP: MotionClip = {
  src: "/work/messa/motion-xl/hero-xl.mp4",
  poster: "/work/messa/motion-xl/hero-xl-poster.jpg",
  width: XL_W,
  height: XL_H,
  title: "The factory, live",
  caption:
    "The production hero at full resolution — belts feeding Prepare, Interview and Decide, trucks and parcels moving, clouds drifting.",
  label:
    "Silent clip of the production factory hero: conveyor belts feeding the Prepare, Interview and Decide buildings while trucks, parcels and clouds move.",
};

/* ——— The hero breakdown ———
 * All composition frames and tool screenshots were captured at the
 * production viewport, 2880×1620, in one paused session (CSS
 * animation-play-state paused, SMIL clocks frozen at t=60s) so the
 * six layer frames stay pixel-aligned as a strip. */
const BREAKDOWN_W = 2880;
const BREAKDOWN_H = 1620;

/** The hero's progressive composition, layer 1 → shipped. */
export const BREAKDOWN_LAYERS: readonly CaseImage[] = [
  {
    src: "/work/messa/breakdown/layer-01-sky-chrome.webp",
    alt: "The hero stripped to its first layer: the sky-to-cream CSS gradient with only the fixed nav and CTA pills rendered, every moving layer hidden.",
    width: BREAKDOWN_W,
    height: BREAKDOWN_H,
    caption:
      "Layer 1 — sky and chrome. The sky is a 5-stop CSS gradient painted on the section; no image yet.",
  },
  {
    src: "/work/messa/breakdown/layer-02-factory-raster.webp",
    alt: "The static factory raster added over the sky gradient: the isometric hiring factory with its belt housings and still-blank sign boards.",
    width: BREAKDOWN_W,
    height: BREAKDOWN_H,
    caption:
      "Layer 2 — the factory raster: one static 1614×676 illustration, the page's preloaded LCP. Nothing here moves.",
  },
  {
    src: "/work/messa/breakdown/layer-03-conveyor-overlay.webp",
    alt: "The conveyor overlay added: CV cards riding SVG belt paths through the buildings, wall-projected titles, the intro signboard and interview props.",
    width: BREAKDOWN_W,
    height: BREAKDOWN_H,
    caption:
      "Layer 3 — the conveyor SVGs: four SMIL belts carry CVs through wall-occluder masks; wall type projected at 26.57°.",
  },
  {
    src: "/work/messa/breakdown/layer-04-trucks.webp",
    alt: "The two box trucks docked at the factory, 'CVs In' and 'Decisions Out' lettered on their cargo panels, each over its own ground-shadow pad.",
    width: BREAKDOWN_W,
    height: BREAKDOWN_H,
    caption:
      "Layer 4 — the trucks: the same truck.png twice, each shadow on an identical SMIL clock so they never drift apart.",
  },
  {
    src: "/work/messa/breakdown/layer-05-clouds.webp",
    alt: "The hand-drawn cloud cutouts added to the sky band at the top edges of the factory crop.",
    width: BREAKDOWN_W,
    height: BREAKDOWN_H,
    caption:
      "Layer 5 — the clouds: five sprites on staggered 22–31s drift loops, live-editable via ?calibrate=clouds.",
  },
  {
    src: "/work/messa/breakdown/layer-06-shipped-texture.webp",
    alt: "The shipped hero: the frozen paper-texture frame multiplied over the whole composition, graining every cream surface.",
    width: BREAKDOWN_W,
    height: BREAKDOWN_H,
    caption:
      "Layer 6 — the paper multiplied over everything = the shipped hero. One frozen shader frame, zero runtime WebGL.",
  },
];

/** The in-page calibration suite, one screenshot per tool. */
export const BREAKDOWN_TOOLS: readonly CaseImage[] = [
  {
    src: "/work/messa/breakdown/tool-01-clouds.webp",
    alt: "The cloud calibrator: dashed sky-blue drag handles around each hero cloud and the unified accordion panel with per-section toggles and Copy as TS.",
    width: BREAKDOWN_W,
    height: BREAKDOWN_H,
    caption:
      "?calibrate=clouds — drag handles and a click-to-cycle chip on every cloud; 'Copy as TS' round-trips into clouds.ts.",
  },
  {
    src: "/work/messa/breakdown/tool-02-paper.webp",
    alt: "The paper-texture panel: 19 controls — color pickers, a blend-mode select and numeric sliders — driving the live WebGL paper shader over the page.",
    width: BREAKDOWN_W,
    height: BREAKDOWN_H,
    caption:
      "?calibrate=paper — 19 knobs over the live shader; Exit drops back to the frozen snapshot.",
  },
  {
    src: "/work/messa/breakdown/tool-03-belts.webp",
    alt: "The belt-path editor over the factory raster: anchor points along the active conveyor path, a smoothing toggle and five belt slots with export.",
    width: BREAKDOWN_W,
    height: BREAKDOWN_H,
    caption:
      "?calibrate=1 — the belt-path editor: click anchors onto the live hero, export all five belts as paste-ready TS.",
  },
  {
    src: "/work/messa/breakdown/tool-04-masks.webp",
    alt: "The mask calibrator: amber wall-occluder polygons and indigo door-shadow polygons outlined over the factory buildings, with global shadow controls.",
    width: BREAKDOWN_W,
    height: BREAKDOWN_H,
    caption:
      "?calibrate=masks — amber clips hide cards behind walls, indigo gradients darken doorways. 2,069 dev-only lines.",
  },
  {
    src: "/work/messa/breakdown/tool-05-text.webp",
    alt: "The text calibrator: indigo boxes wrapping the projected building titles, a side panel editing copy, color and size, and the wall-angle scrubber.",
    width: BREAKDOWN_W,
    height: BREAKDOWN_H,
    caption:
      "?calibrate=text — the 26.57° wall-type tool: grab the projected glyphs you see, undo, copy out the constants.",
  },
  {
    src: "/work/messa/breakdown/tool-06-coffee.webp",
    alt: "The coffee calibrator: teal and orange drag dots over the two interview-table mugs, with per-mug X, Y and width sliders in a corner panel.",
    width: BREAKDOWN_W,
    height: BREAKDOWN_H,
    caption:
      "?calibrate=coffee — two draggable dots place the interview-room mugs.",
  },
];

/** 2x macros of the tuned results — the layers up close. */
export const BREAKDOWN_MACROS: readonly CaseImage[] = [
  {
    src: "/work/messa/breakdown/detail-01-truck-shadow.webp",
    alt: "Close-up of the entrance truck docked: serif 'CVs In' on the cargo panel, the blurred shadow pad beneath it, and a figure reading a CV at the belt start.",
    width: 758,
    height: 548,
    caption:
      "2× — the entrance truck: 'CVs In' painted onto the cargo panel at the truck's own iso angle.",
  },
  {
    src: "/work/messa/breakdown/detail-02-wall-sign-type.webp",
    alt: "Close-up of Building 2's wall type: '2. Interview' and its subtitle projected down the isometric wall plane like painted signage.",
    width: 607,
    height: 268,
    caption:
      "2× — Building 2's wall type, projected so the baseline runs down the wall like painted signage.",
  },
  {
    src: "/work/messa/breakdown/detail-03-coffee-steam-hero.webp",
    alt: "Close-up of the interview room with two coffee mugs, steam puffs rising, each grounded by a warm bloom and a cast-ellipse shadow.",
    width: 428,
    height: 241,
    caption:
      "2× — the interview room: two mugs (one mirrored), three staggered steam puffs each.",
  },
  {
    src: "/work/messa/breakdown/detail-04-coffee-desk-macro.webp",
    alt: "Close-up of the pain-section desk's steaming coffee mug, two steam wisps mid-rise, with a soft warm bloom and an angled cast shadow.",
    width: 480,
    height: 440,
    caption:
      "2× — the 'what a mess' desk: steam wisps, warm bloom, iso cast shadow — the hero's grounding recipe.",
  },
];

/** The desk coffee in motion — poster grabbed mid-steam-cycle. */
export const COFFEE_DESK_CLIP: MotionClip = {
  src: "/work/messa/breakdown/detail-coffee-desk-clip.mp4",
  poster: "/work/messa/breakdown/detail-coffee-desk-clip-poster.webp",
  width: 960,
  height: 848,
  title: "The desk coffee, live",
  caption:
    "The pain-desk mug: two steam wisps on a 2.6s loop while the scene holds still.",
  label:
    "Silent clip of the pain-section desk's coffee mug: two staggered steam wisps rising, scaling and fading on a 2.6-second loop while the rest of the desk scene stays still.",
};

/** Featured interaction: the dig. */
export const DIG_CLIP: MotionClip = {
  src: "/work/messa/clips/underneath-dig.mp4",
  poster: "/work/messa/clips/underneath-dig-poster.jpg",
  width: 1280,
  height: 800,
  title: "The dig",
  caption:
    "'What's underneath?' digs the page open into the strata of decisions beneath the workflow, then closes back up.",
  label:
    "Silent clip of the 'What's underneath?' interaction digging the page open into underground strata and collapsing back.",
};

/** The founder-letter typewriter — featured beside its decision trail. */
export const LETTER_TYPING_CLIP: MotionClip = {
  src: "/work/messa/clips/letter-typing.mp4",
  poster: "/work/messa/clips/letter-typing-poster.jpg",
  width: 1280,
  height: 800,
  title: "The typewriter",
  caption:
    "The founder letter types itself to the signature — the fourth design, the one nobody could scroll past.",
  label:
    "Silent clip of the founder letter typing itself out on the about page, ending at the founder's signature.",
};

export const MOTION_CLIPS: readonly MotionClip[] = [
  {
    src: "/work/messa/motion-xl/login-modal.mp4",
    poster: "/work/messa/motion-xl/login-modal-poster.jpg",
    width: XL_W,
    height: XL_H,
    title: "The login modal",
    caption:
      "'Welcome back.' opens over the blurred factory — typed, tabbed through show-password, closed. Nothing submitted.",
    label:
      "Silent clip of the login modal opening over the blurred factory hero, an email being typed, focus tabbing through the password field, and the modal closing.",
  },
  {
    src: "/work/messa/motion-xl/butterflies.mp4",
    poster: "/work/messa/motion-xl/butterflies-poster.jpg",
    width: XL_W,
    height: XL_H,
    title: "The butterflies",
    caption:
      "On /jobs, wing-flapping butterflies fly loops around the 'Don't see your role?' lighthouse card.",
    label:
      "Silent clip of the jobs page: animated butterflies flying loops around a lighthouse illustration card while clouds drift past painted hills.",
  },
];

export const TIMELAPSE_FILM: MotionClip = {
  src: "/work/messa/clips/timelapse-film.mp4",
  poster: "/work/messa/clips/timelapse-film-poster.jpg",
  width: 1440,
  height: 900,
  title: "The film",
  caption:
    "Six months in eleven seconds — fifteen production snapshots cross-fading from the v0 import to the launch-ready landing.",
  label:
    "Silent timelapse film: fifteen production snapshots of the Messa landing page cross-fading from December 2025 to June 2026.",
};

/**
 * The rejected background-style candidates, oldest first: December's
 * painted-realism light/dark scene series, the April real-photo
 * mountain interlude, and the watercolor washes that outlived every
 * other soft style until ink-and-cel won. Dark frames ride a mat.
 */
export const BACKGROUND_EXPLORATIONS: readonly GalleryItem[] = [
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/background-light.webp",
      alt: "Painted-realism waterfall valley with a remote worker on a rock, light mode.",
      width: 1536,
      height: 1024,
      caption:
        "Painted-realism waterfall valley — the original 'work from anywhere' hero, December's world.",
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/background-20dark.webp",
      alt: "Moonlit dark-mode version of the painted waterfall valley.",
      width: 1536,
      height: 1024,
      caption:
        "Moonlit dark-mode twin of the waterfall valley — testing whether one painted scene could carry both themes.",
      mat: true,
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/light-2.webp",
      alt: "Painted bus-stop reader at golden hour on a city street.",
      width: 1280,
      height: 853,
      caption:
        "Bus-stop reader at golden hour — arguing the brand could live in a city, not just wilderness.",
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/dark-2.webp",
      alt: "Night version of the painted bus-stop scene, screen glow under streetlights.",
      width: 1536,
      height: 1024,
      caption:
        "Night version of the bus-stop scene — screen-glow under streetlights for the dark theme.",
      mat: true,
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/light-3.webp",
      alt: "Painted laptop in front of a Matterhorn-style alpine peak in daylight.",
      width: 1536,
      height: 1024,
      caption:
        "Laptop in front of a Matterhorn-style peak — the alpine maximal take on 'work from anywhere', daylight version.",
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/dark-3.webp",
      alt: "Starlit night version of the painted alpine scene with a crescent moon.",
      width: 1536,
      height: 1024,
      caption:
        "Starlit crescent-moon version of the alpine scene — the dark-theme counterpart.",
      mat: true,
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/light-4.webp",
      alt: "Painted coastal cliff at hazy sunset.",
      width: 1536,
      height: 1024,
      caption:
        "Coastal cliff at hazy sunset — the seaside variant of the light/dark hero test.",
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/dark-4.webp",
      alt: "Full-moon night version of the painted coastal cliff with a moonpath on the water.",
      width: 1536,
      height: 1024,
      caption:
        "Full-moon night version of the coastal cliff — moonpath on water for dark mode.",
      mat: true,
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/new-light.webp",
      alt: "Refined recomposition of the painted waterfall valley, light version.",
      width: 1536,
      height: 1024,
      caption:
        "The waterfall valley recomposed — the last iteration before painted realism was cut.",
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/new-dark.webp",
      alt: "Refined dark recomposition of the painted waterfall valley at night.",
      width: 1536,
      height: 1024,
      caption:
        "Refined dark recomposition of the waterfall valley — the last gasp of the painted-realism era.",
      mat: true,
    },
  },
  {
    kind: "image",
    span: "narrow",
    image: {
      src: "/work/messa/styles/mountains-bg.webp",
      alt: "Photographic blue-hour mountain ridges in layered silhouette, portrait crop.",
      width: 1066,
      height: 1600,
      caption:
        "Photographic blue-hour ridges — a six-day real-photo interlude before the style matrix.",
      mat: true,
    },
  },
  /* The five-style bake-off (2026-04-08): the same valley scene painted
   * in five different mediums to pick the site's art direction. The
   * watercolor trio below outlived the rest of the matrix. */
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/gouache-hero.webp",
      alt: "Gouache mountain-lake hero: opaque poster-paint rendering of the shared valley scene.",
      width: 1600,
      height: 893,
      caption:
        "Gouache — opaque poster-paint entry in the five-style bake-off, every medium painting the same valley.",
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/impressionnism-hero.webp",
      alt: "Impressionist oil hero: thick broken-color brushwork on the shared valley scene.",
      width: 1600,
      height: 893,
      caption:
        "Impressionism — thick broken-color brushwork; the boldest, most textured entry.",
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/inkandwash-hero.webp",
      alt: "Ink-and-wash sumi-e hero with a red seal stamp, monochrome line and wash.",
      width: 1600,
      height: 893,
      caption:
        "Ink and wash, red seal stamp — the monochrome direction that foreshadowed the ink-and-cel winner.",
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/oleo-hero.webp",
      alt: "Oil-on-canvas hero: smooth buttery oil rendering of the valley.",
      width: 1600,
      height: 893,
      caption:
        "Oil on canvas — smooth and buttery, midway between gouache and impressionism.",
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/pastel-hero.webp",
      alt: "Soft-pastel hero: the gentlest storybook take on the valley, fading to white.",
      width: 1600,
      height: 893,
      caption:
        "Soft pastel — the most storybook take, fading to white for content overlay.",
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/pastel-clouds.webp",
      alt: "Pastel cloud cutouts arranged on white, a sprite sheet of individual clouds.",
      width: 1600,
      height: 893,
      caption:
        "Pastel cloud cutouts — the sprite-sheet precursor of the cloud assets that shipped on the final site.",
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/watercolor-hero.webp",
      alt: "Watercolor wash hero background: purple mountains and a meadow on paper grain.",
      width: 1600,
      height: 893,
      caption:
        "Watercolor wash hero — the client favorite; it outlived every other style until ink-and-cel won.",
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/watercolor-app.webp",
      alt: "Watercolor sky in wet-on-wet pink and blue washes with visible paper texture.",
      width: 1600,
      height: 893,
      caption:
        "Watercolor sky for the app section — wet-on-wet pink and blue washes with visible paper texture.",
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/styles/watercolor-footer.webp",
      alt: "Watercolor-set footer sky rendered in oil impasto with clouds pushed to the edges.",
      width: 1600,
      height: 893,
      caption:
        "The watercolor footer in oil impasto — the footer slot was shared across the soft-art directions.",
    },
  },
];

/**
 * A hand-drawn sprite shown at the true scale it ships at in the live
 * hero. `widthClass` is a static Tailwind width tuned so the set keeps
 * the real size relationships from the production conveyor-overlay (the
 * hero's 1614px-wide coordinate space): the truck looms, a candidate
 * stands knee-high, the coffee mug is barely a speck. The percentages
 * across a set sum to ~86% so the row's `justify-between` distributes the
 * remaining ~14% as the gaps between sprites — fully fluid, no
 * breakpoints. `width`/`height` stay the source file's intrinsic pixels.
 */
export type ScaledSprite = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Static Tailwind width as a share of the lineup's full width. */
  widthClass: string;
  /** Render rising steam wisps off this sprite (the coffee mug). */
  steam?: boolean;
};

/**
 * The hand-drawn cast of the Messa site, split into two rows — PEOPLE (the
 * illustrated human figures) and OBJECTS (the props, vehicles and
 * machinery). Rendered uniform-height and centered (ScaledCast uniform),
 * so this is a contact-sheet read, not a true-scale one. `widthClass` is
 * retained on each sprite — it holds the true on-screen width as a share
 * of the lineup (hero-stage sprites normalized by 1440/1614; section,
 * modal and about-hero art already CSS px) — but is IGNORED while the rows
 * render uniform; drop `uniform` on the ScaledCast calls to return to the
 * true-scale lineup. Each row is ordered biggest-to-smallest by that width.
 */
export const HANDDRAWN_PEOPLE: readonly ScaledSprite[] = [
  {
    src: "/work/messa/cast/interview.png",
    alt: "Hand-drawn interview scene — two people at a desk, inside Building 2 of the hero factory.",
    width: 166,
    height: 236,
    widthClass: "w-[5.1%]",
  },
  {
    src: "/work/messa/cast/whatamess.webp",
    alt: "Hand-drawn overwhelmed hiring manager at a desk buried in CVs, from the pain section.",
    width: 828,
    height: 816,
    widthClass: "w-[4.15%]",
  },
  {
    src: "/work/messa/cast/boxguy.webp",
    alt: "Hand-drawn figure wheeling a hand-truck stacked with boxes of CVs, from the pain section.",
    width: 760,
    height: 826,
    widthClass: "w-[3.3%]",
  },
  {
    src: "/work/messa/cast/notes.webp",
    alt: "Hand-drawn pair of note-takers with a clipboard, peeking above the how-it-works steps.",
    width: 659,
    height: 973,
    widthClass: "w-[2.65%]",
  },
  {
    src: "/work/messa/cast/group.webp",
    alt: "Hand-drawn group of four discussing a CV, arriving at the hero factory.",
    width: 1024,
    height: 1349,
    widthClass: "w-[2.6%]",
  },
  {
    src: "/work/messa/cast/security.webp",
    alt: "Hand-drawn Messa security guard straddling the privacy callout card.",
    width: 384,
    height: 1088,
    widthClass: "w-[1.6%]",
  },
  {
    src: "/work/messa/cast/single.webp",
    alt: "Hand-drawn single candidate reading a CV — a human-scale figure walking the hero.",
    width: 1024,
    height: 1899,
    widthClass: "w-[1.55%]",
  },
];

export const HANDDRAWN_OBJECTS: readonly ScaledSprite[] = [
  {
    src: "/work/messa/cast/type.webp",
    alt: "Hand-drawn MESSA typewriter illustration — the oversized hero prop on the About page.",
    width: 1213,
    height: 962,
    widthClass: "w-[26.7%]",
  },
  {
    src: "/work/messa/cast/calendar-md.webp",
    alt: "Hand-drawn flip calendar from the request-demo booking modal.",
    width: 800,
    height: 800,
    widthClass: "w-[9.9%]",
  },
  {
    src: "/work/messa/cast/chalk-md.webp",
    alt: "Hand-drawn chalkboard loop diagram from the 'stay sharp' section.",
    width: 640,
    height: 553,
    widthClass: "w-[8%]",
  },
  {
    src: "/work/messa/cast/truck.png",
    alt: "Hand-drawn isometric box truck lettered 'CVs In / Decisions Out', docked at the hero factory.",
    width: 324,
    height: 274,
    widthClass: "w-[6.6%]",
  },
  {
    src: "/work/messa/cast/lighthouse-md.webp",
    alt: "Hand-drawn lighthouse illustration from the jobs page 'Don't see your role?' card.",
    width: 488,
    height: 555,
    widthClass: "w-[6.1%]",
  },
  {
    src: "/work/messa/cast/leaderboard.png",
    alt: "Hand-drawn candidate scorecard / leaderboard panel inside Building 3 of the hero factory.",
    width: 140,
    height: 236,
    widthClass: "w-[4.65%]",
  },
  {
    src: "/work/messa/cast/plane-sm.webp",
    alt: "Hand-drawn paper plane from the booking modal's transitions.",
    width: 192,
    height: 154,
    widthClass: "w-[2.4%]",
  },
  {
    src: "/work/messa/cast/coffee.png",
    alt: "Hand-drawn steaming coffee mug — at true scale, the smallest sprite in the whole cast.",
    width: 760,
    height: 737,
    widthClass: "w-[0.53%]",
    steam: true,
  },
];

/**
 * The hero sky at true scale — the five cloud sprites at the widths they
 * drift at on the live pages (200 · 170 · 160 · 140 · 70, largest first).
 */
export const HANDDRAWN_SKY: readonly ScaledSprite[] = [
  {
    src: "/work/messa/cast/cloud03.png",
    alt: "Hand-shaded cumulus cloud sprite, the widest of the five, on flat cel shadows.",
    width: 340,
    height: 242,
    widthClass: "w-[23%]",
  },
  {
    src: "/work/messa/cast/cloud04.png",
    alt: "Hand-shaded cloud sprite with two-tone cel shading.",
    width: 293,
    height: 227,
    widthClass: "w-[20%]",
  },
  {
    src: "/work/messa/cast/cloud01.png",
    alt: "Hand-shaded cumulus cloud sprite cut out on transparency.",
    width: 231,
    height: 164,
    widthClass: "w-[18.5%]",
  },
  {
    src: "/work/messa/cast/cloud02.png",
    alt: "Hand-shaded cloud sprite, a mid-size companion in the sky system.",
    width: 340,
    height: 242,
    widthClass: "w-[16%]",
  },
  {
    src: "/work/messa/cast/cloud05.png",
    alt: "The smallest cloud sprite — a distant parallax accent.",
    width: 114,
    height: 82,
    widthClass: "w-[8%]",
  },
];

/**
 * The full-bleed scene backdrops the world is set in on the shipped site —
 * copied from messa-landing public/images, shown wide and stacked. (The
 * sky is a CSS gradient and the paper grain is a texture overlay, so
 * neither is a discrete backdrop image here.)
 */
export const HANDDRAWN_BACKDROPS: readonly CaseImage[] = [
  {
    src: "/work/messa/world/factory-blank.webp",
    alt: "The hand-drawn isometric hiring factory backdrop — belt housings, buildings and a parking spot on warm cream.",
    width: 1614,
    height: 676,
    caption:
      "The factory — the hero's whole backdrop, one static 1614×676 raster the page is built on top of.",
  },
  {
    src: "/work/messa/world/ground.webp",
    alt: "Painterly terrain cross-section: a grass lip dissolving into deep layered soil strata.",
    width: 2089,
    height: 662,
    caption:
      "The ground — the terrain cross-section the page digs open to show the decisions underneath.",
  },
  {
    src: "/work/messa/world/landscape.webp",
    alt: "Watercolor rolling-hills landscape under a soft sky, the footer backdrop.",
    width: 2089,
    height: 753,
    caption:
      "The footer — the watercolor-hills landscape that closes the page under the final call to action.",
  },
];

/** "The part nobody built." — the pain-section's isometric hiring cube, the
 * Messa block craned into the one empty slot. The live site's color-graded
 * /images/rubks_seamless.mp4 (its cream lifted onto the page cream #FBF0E6),
 * so the opaque square edges feather to nothing on this cream page too. */
export const NOBODY_BUILT_CLIP: MotionClip = {
  src: "/work/messa/clips/nobody-built-cube.mp4",
  poster: "/work/messa/clips/nobody-built-cube-poster.jpg",
  width: 960,
  height: 960,
  title: "The part nobody built",
  caption:
    "The hiring stack as a cube — every block a tool teams already own, and Messa craned into the one slot nobody filled.",
  label:
    "Silent looping illustration: an isometric cube of hiring-tool blocks with one empty slot; a Messa block is lowered by crane and slotted in as the missing piece.",
};

/** The two large art-direction moments shown 2-up. */
export const ART_FEATURE: readonly CaseImage[] = [
  {
    src: "/work/messa/details/art-whatamess-desk.webp",
    alt: "Hand-drawn isometric desk scene: a hiring manager drowning in CVs, crumpled rejects spilling past the bin.",
    width: 700,
    height: 700,
    caption:
      "'What a mess' — the problem section's desk scene. Drowning-in-CVs storytelling, crumpled rejects past the bin.",
  },
  {
    src: "/work/messa/details/art-ground-strata.webp",
    alt: "Painterly ground cross-section: a grass lip dissolving into rich layered soil.",
    width: 700,
    height: 662,
    caption:
      "The ground cross-section — grass lip into soil strata, the backdrop for the 'decisions underneath' dig.",
  },
];

/** Close crops of the hand-drawn world, for the horizontal strip. */
export const ART_CROPS: readonly GalleryItem[] = [
  {
    kind: "image",
    span: "narrow",
    image: {
      src: "/work/messa/details/art-factory-conveyor.webp",
      alt: "Isometric S-curve conveyor belt threading through a factory tower's archway, hand-drawn linework.",
      width: 420,
      height: 420,
      caption: "The S-curve conveyor threading the first tower's archway.",
    },
  },
  {
    kind: "image",
    span: "narrow",
    image: {
      src: "/work/messa/details/art-factory-office.webp",
      alt: "Hand-drawn gatehouse office with a rooftop billboard, cypress trees and a tiny bench.",
      width: 374,
      height: 400,
      caption: "The gatehouse office — every prop on the same isometric grid.",
    },
  },
  {
    kind: "image",
    span: "narrow",
    image: {
      src: "/work/messa/details/art-factory-belt.webp",
      alt: "Conveyor belt junction wrapping a factory corner with hand-inked bolts and a lone topiary.",
      width: 360,
      height: 360,
      caption: "Belt junction — hand-inked bolts, soft cast shadows.",
    },
  },
  {
    kind: "image",
    span: "narrow",
    image: {
      src: "/work/messa/details/art-og-interview.webp",
      alt: "Two hand-painted characters mid-interview at a table on a meadow, with coffee and a notebook.",
      width: 460,
      height: 395,
      caption: "The OG-card interview — coffee and a notebook staging the calm.",
    },
  },
  {
    kind: "image",
    span: "narrow",
    image: {
      src: "/work/messa/details/art-og-sidekick.webp",
      alt: "The Sidekick suggestion card glowing softly above the interview scene.",
      width: 320,
      height: 330,
      caption: "The Sidekick panel floating over the interview, warm sky behind.",
    },
  },
];

/** Component close-ups for the UI-details strip. One-line captions. */
/* The floating glass nav is a 16:1 strip — it rendered as a near-empty
 * panel inside the uniform 16:10 cards, so it's pulled out of this strip
 * and shown full-width at its true aspect in the Details section (see
 * NAV_DETAIL below + page.tsx). */
export const NAV_DETAIL: CaseImage = {
  src: "/work/messa/details/ui-nav.webp",
  alt: "Floating glass-blur navigation capsule over the hero sky with the Messa wordmark and a single demo CTA.",
  width: 1600,
  height: 102,
  caption: "The floating glass nav — one ink-blue CTA, everything else quiet.",
};

export const UI_DETAILS: readonly GalleryItem[] = [
  {
    kind: "image",
    span: "narrow",
    image: {
      src: "/work/messa/details/ui-hero-trust-pill.webp",
      alt: "Accent-tinted trust pill showing the customer name Nexton mid-rotation.",
      width: 450,
      height: 140,
      caption: "The trust pill, mid-rotation through seven customer names.",
    },
  },
  {
    kind: "image",
    span: "narrow",
    image: {
      src: "/work/messa/details/ui-hero-cta.webp",
      alt: "Ink-blue request-demo button with a soft glow halo on paper texture.",
      width: 366,
      height: 186,
      caption: "The demo CTA — a glow halo on the paper substrate.",
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/details/ui-testimonial-card.webp",
      alt: "Glass-subtle testimonial card with a quote-first hierarchy and a desaturated company logo.",
      width: 1064,
      height: 392,
      caption: "Testimonial cards — quote first, logo desaturated.",
    },
  },
  {
    kind: "image",
    span: "narrow",
    image: {
      src: "/work/messa/details/ui-section-pill-a.webp",
      alt: "Terracotta section pill reading 'The Problem' with paper grain showing through the fill.",
      width: 342,
      height: 174,
      caption: "Section pill, problem variant — paper grain through the fill.",
    },
  },
  {
    kind: "image",
    span: "narrow",
    image: {
      src: "/work/messa/details/ui-section-pill-b.webp",
      alt: "Warm amber section pill reading 'What Teams Say'.",
      width: 396,
      height: 174,
      caption: "Section pill, warning variant — warm amber for social proof.",
    },
  },
  {
    kind: "image",
    span: "narrow",
    image: {
      src: "/work/messa/details/ui-underneath-pill.webp",
      alt: "Cream capsule with a down arrow reading 'What's underneath?' on the soil-brown section.",
      width: 522,
      height: 216,
      caption: "The dig trigger, floating on the soil section.",
    },
  },
  {
    kind: "image",
    span: "wide",
    image: {
      src: "/work/messa/details/ui-stratum-row.webp",
      alt: "Stratum row 01 'Criteria built per role' with a sand-toned serif index and dashed survey lines.",
      width: 1600,
      height: 287,
      caption: "Stratum rows — serif indexes with a −1m depth gutter.",
    },
  },
  {
    kind: "image",
    span: "narrow",
    image: {
      src: "/work/messa/details/ui-demo-step-indicator.webp",
      alt: "Booking progress indicator: three numbered dots joined by hairlines, the active step filled ink-blue.",
      width: 400,
      height: 144,
      caption: "Booking progress — three dots, hairlines, one accent ring.",
    },
  },
  {
    kind: "image",
    image: {
      src: "/work/messa/details/ui-demo-form-card.webp",
      alt: "Demo modal step one, empty state, with a serif heading and pill-shaped role chips.",
      width: 1344,
      height: 1320,
      caption:
        "Demo step one, empty state — placeholders by Dunder Mifflin Paper Co.",
    },
  },
  {
    kind: "image",
    span: "wide",
    image: {
      src: "/work/messa/details/ui-footer-band.webp",
      alt: "Footer band: a hand-painted rolling landscape with a dirt path leading to a distant skyline.",
      width: 1600,
      height: 456,
      caption: "The footer — link columns resting directly on painted hills.",
    },
  },
];

/** The Messa palette, rendered natively as swatches. */
export const BRAND_PALETTE: readonly BrandSwatch[] = [
  { name: "Cream BG", hex: "#FBF0E6", usage: "Primary surface on the illustrated landing" },
  { name: "Cream Border", hex: "#E8D9C5", usage: "Warm border on cream surfaces" },
  { name: "Accent", hex: "#3C4BE6", usage: "Brand electric blue — default accent" },
  { name: "Muted Accent", hex: "#5A6B8F", usage: "Desaturated slate blue for the cream landing — CTAs, pills, stepper" },
  { name: "Accent Foreground", hex: "#FFFFFF", usage: "Text on accent backgrounds" },
  { name: "Text Primary", hex: "#0A0A0B", usage: "Headlines and body" },
  { name: "Text Secondary", hex: "#6E6B68", usage: "Descriptive copy" },
  { name: "Text Muted", hex: "#A3A19E", usage: "Captions, timestamps" },
  { name: "Success", hex: "#69B982", usage: "Checks, positive states" },
  { name: "Success Strong", hex: "#2E7A4D", usage: "AA success text on warm cream" },
  { name: "Sage", hex: "#7AA582", usage: "Cream-landing success tone" },
  { name: "Sage Strong", hex: "#4A7552", usage: "Deeper sage for AA body text on cream" },
  { name: "Warning", hex: "#D9924A", usage: "Warm amber for attention" },
  { name: "Warning Strong", hex: "#8C530A", usage: "Darker amber for AA body text" },
  { name: "Problem", hex: "#CE6B52", usage: "Earthy coral — problem framing without alarm" },
  { name: "Problem Strong", hex: "#8B3A24", usage: "Darker coral for AA body text" },
  { name: "Sky Blue", hex: "#D4E3F0", usage: "Top of hero and gradient peaks" },
  { name: "Sky Mid", hex: "#E4E6E2", usage: "Neutral mid-tone in gradient transitions" },
  { name: "Sky Warm", hex: "#F0E6D8", usage: "Warmer gradient step between blue and cream" },
  { name: "Warm Brown", hex: "#8B6F4E", usage: "Hero conveyor signage" },
];

/** Type specimens are screenshots — Messa's licensed fonts are not embedded. */
export const BRAND_TYPE_SPECIMENS: readonly CaseImage[] = [
  {
    src: "/work/messa/brand/brand-type-perfectly-nineties.webp",
    alt: "Perfectly Nineties specimen: the display serif used for headlines and hero display.",
    width: 1544,
    height: 572,
    caption:
      "Perfectly Nineties — the display serif. Weight 400 only; emphasis comes from size and color.",
  },
  {
    src: "/work/messa/brand/brand-type-messina-sans.webp",
    alt: "Messina Sans specimen: the sans-serif used for body, UI labels and navigation.",
    width: 1544,
    height: 554,
    caption:
      "Messina Sans — body, labels, nav, every functional surface. Also weight 400 only.",
  },
];

export const BRAND_TYPE_SCALE: CaseImage = {
  src: "/work/messa/brand/brand-type-scale.webp",
  alt: "Type scale ladder from 72px display down to 11px caption, serif from 24px up, sans below.",
  width: 1544,
  height: 1084,
  caption: "The scale — 72px display to 11px caption. Serif from 24px up, sans below.",
};

/** Brand-page screenshots shown in a row. */
export const BRAND_PAGES: readonly CaseImage[] = [
  {
    src: "/work/messa/brand/brand-logo-lockups.webp",
    alt: "Logo lockups: the two-tone iso-M and wordmark with mono variants and the clear-space rule.",
    width: 1544,
    height: 2382,
    caption: "Lockups and the clear-space rule: one iso-M height on all sides.",
  },
  {
    src: "/work/messa/brand/brand-voice-we-say.webp",
    alt: "Voice guardrails page: 'We say' and 'We don't say' lists.",
    width: 1544,
    height: 476,
    caption:
      "Voice guardrails — buzzwords, hedging, passive voice and em dashes are banned.",
  },
  {
    src: "/work/messa/brand/brand-gradient-sky-wrap.webp",
    alt: "Sky Wrap gradient documentation: cream rising through warm steps into a sky-blue hold.",
    width: 1544,
    height: 526,
    caption: "Sky Wrap — cream rising into the sky-blue hold behind the product strip.",
  },
];

export const BRAND_VOICE = {
  tagline: "See talent clearly. Built on a hiring playbook.",
  lines: [
    {
      name: "Straightforward",
      description: "Name the problem like someone who has lived it. No hedging.",
    },
    {
      name: "Opinionated",
      description: "Messa has a point of view. Decide with evidence, not vibes.",
    },
  ],
} as const;

/** Texture comparisons were captured at the production viewport, 2880×1800. */
const TEXTURE_W = 2880;
const TEXTURE_H = 1800;

export type TexturePair = {
  /** Accessible name for the comparison slider. */
  label: string;
  /** The page with the texture overlay hidden. */
  raw: CaseImage;
  /** The page with the 26%-multiply paper texture. */
  textured: CaseImage;
  /** Visible caption under the slider. */
  caption: string;
};

/** Before/after captures for the paper-texture comparison sliders. */
export const TEXTURE_PAIRS: readonly TexturePair[] = [
  {
    label: "Hero paper-texture comparison",
    caption:
      "The hero, textured against raw — drag the divider or use the arrow keys. 26% multiply is all it takes.",
    raw: {
      src: "/work/messa/texture/hero-raw.webp",
      alt: "The Messa factory hero with the paper-texture overlay hidden: flat, clean cream surfaces.",
      width: TEXTURE_W,
      height: TEXTURE_H,
    },
    textured: {
      src: "/work/messa/texture/hero-textured.webp",
      alt: "The Messa factory hero with the paper texture at 26% multiply: fibers and folds grain the cream surfaces.",
      width: TEXTURE_W,
      height: TEXTURE_H,
    },
  },
  {
    label: "Social-section paper-texture comparison",
    caption:
      "The testimonial section, same comparison — the grain is loudest where the cream runs widest.",
    raw: {
      src: "/work/messa/texture/social-raw.webp",
      alt: "The Messa testimonials section with the paper-texture overlay hidden.",
      width: TEXTURE_W,
      height: TEXTURE_H,
    },
    textured: {
      src: "/work/messa/texture/social-textured.webp",
      alt: "The Messa testimonials section with the paper texture at 26% multiply.",
      width: TEXTURE_W,
      height: TEXTURE_H,
    },
  },
];

/** The texture asset itself, shown alongside the comparisons. */
export const TEXTURE_TILE: CaseImage = {
  src: "/work/messa/texture/texture-tile.webp",
  alt: "The paper-texture asset at 100% opacity on white: procedural fibers, crumples and two long folds, an 800 by 800 center crop.",
  width: 800,
  height: 800,
  caption:
    "The asset at 100% on white — one frozen shader frame, 1536², 61 KB.",
};

/** The recovered OG-card iterations, oldest first. All cards are 1200×630. */
const OG_W = 1200;
const OG_H = 630;

export const OG_ITERATIONS: readonly CaseImage[] = [
  {
    src: "/work/messa/og/01-draft-base.webp",
    alt: "First OG-card concept: isometric trucks labeled 'CVs in' and 'Decisions out', two figures comparing a clipboard, 'See talent clearly.' headline and a 'Hiring, clarified' pill.",
    width: OG_W,
    height: OG_H,
    caption:
      "May 28 — first concept: the two-truck metaphor. CVs in, decisions out, two figures comparing a clipboard between them.",
  },
  {
    src: "/work/messa/og/02-draft-1.webp",
    alt: "Second OG draft: one truck, a figure wheeling a cart of 'Curriculum' boxes toward it, larger headline under a warm-gradient sky.",
    width: OG_W,
    height: OG_H,
    caption:
      "May 28 — one truck survives: a cart of 'Curriculum' boxes, the pill dropped, the headline enlarged, a warm-gradient sky.",
  },
  {
    src: "/work/messa/og/03-draft-2.webp",
    alt: "Third OG draft: real shortlisting UI docked right showing a candidate funnel — Strong fit 15, Maybe 53, Low fit 212 — with the 'Hiring, clarified' pill top-left.",
    width: OG_W,
    height: OG_H,
    caption:
      "May 28 — pivot from metaphor to product proof: the shortlisting funnel docked right. Strong fit 15, Maybe 53, Low fit 212.",
  },
  {
    src: "/work/messa/og/04-draft-3.webp",
    alt: "Fourth OG draft: the live-interview screen with the Live Assist coach panel for Sarah Liu and a floating purple AI suggestion toast.",
    width: OG_W,
    height: OG_H,
    caption:
      "May 28 — same layout, the live-interview screen: the Live Assist coach panel mid-suggestion over a checked script.",
  },
  {
    src: "/work/messa/og/05-draft-4.webp",
    alt: "Fifth OG draft: Maya Reyes's candidate scorecard with a green 'Strong hire' decision badge and overall-assessment copy.",
    width: OG_W,
    height: OG_H,
    caption:
      "May 28 — the last UI-direction variant: Maya Reyes's scorecard, green 'Strong hire' badge, headline unchanged.",
  },
  {
    src: "/work/messa/og/06-og-primary-v1.webp",
    alt: "The first shipped OG card: a watercolor interview-table illustration on a grass plot with floating CV, Sidekick, Skillsets and Scorecard cards.",
    width: OG_W,
    height: OG_H,
    caption:
      "Jun 8 — the first card that shipped: the watercolor interview table on its grass plot, floating product cards, a 117 KB JPEG.",
  },
];
