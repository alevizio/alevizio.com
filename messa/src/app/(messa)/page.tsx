import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import "./story.css";
import {
  ISO_PIPELINE_CLIP,
  PIPELINE_EVOLUTION,
  BREAKDOWN_TOOLS,
  CHROMAKEY_HERO_CLIP,
  HANDDRAWN_BACKDROPS,
  HANDDRAWN_OBJECTS,
  HANDDRAWN_PEOPLE,
  HANDDRAWN_SKY,
  NOBODY_BUILT_CLIP,
  OG_ITERATIONS,
  TEXTURE_PAIRS,
  TEXTURE_TILE,
  TRAILER_CLIP,
  imageItems,
} from "./case-study-media";
import type { CaseImage, MotionClip } from "./case-study-media";
import { BrandPalette } from "./brand-palette";
import { ButtonLab } from "./button-lab";
import { Butterfly, ButterflyDefs } from "./butterfly";
import { ChapterDivider, PullQuote } from "./chapter-divider";
import { Clouds } from "./clouds";
import { CompareSlider } from "./compare-slider";
import { ConceptGallery } from "./concept-gallery";
import { DemoModalSteps } from "./demo-modal-steps";
import { ButtonAnatomy } from "./button-anatomy";
import { FactoryLayers } from "./factory-layers";
import { GlassNavAnatomy } from "./glass-nav-anatomy";
import { storyFontVariables } from "./fonts";
import { TypewriterLetter } from "./founder-letter";
import { HorizontalGallery } from "./horizontal-gallery";
import { IconWall } from "./icon-wall";
import { InViewVideo } from "./in-view-video";
import { MediaGrid } from "./media-grid";
import { MessaLogo } from "./messa-logo";
import { MotionStudies } from "./motion-studies";
import { PipelineWorlds } from "./pipeline-worlds";
import { LiveProduct, ProductCommits } from "./product-evolution";
import { ScaledCast } from "./scaled-cast";
import { StepperLab } from "./stepper-lab";
import { HowItWorks } from "./messa-product/how-section";
import { TypographyContactSheet } from "./typography-contact-sheet";
import { WorldRules } from "./world-rules";
import { SlackThread } from "./slack-thread";
import type { SlackDay, SlackFace } from "./slack-thread";
import { StoryNav } from "./story-nav";
import { TimelapseScrubber } from "./timelapse-scrubber";
import { UnderneathDig } from "./underneath-dig";
import { Borehole, StratumBlock, SurveyGrid } from "./underneath-strata";

// Served at the root of its own subdomain (messa.alevizio.com). Still
// noindex — the story stays unlisted until the client launches; flip
// robots.index to true when you want it discoverable.
export const metadata: Metadata = {
  metadataBase: new URL("https://messa.alevizio.com"),
  title: "Messa — the story — Alejandro Vizio",
  description:
    "Designing and building the Messa landing page: a warm paper world for an AI hiring copilot. Product design and frontend, solo, March to June 2026.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Messa — the story — Alejandro Vizio",
    description:
      "A warm paper world for an AI hiring copilot. 759 commits, 15 captured deploys, one isometric factory.",
    type: "article",
    images: [
      {
        url: "/work/messa/timeline/09-2026-05-22-e9856d4b.webp",
        width: 2160,
        height: 1350,
        alt: "The Messa landing page hero: an isometric cream hiring factory under a blue sky.",
      },
    ],
  },
};

// TODO: swap for the dedicated work address before sharing widely.
const CONTACT = "viziomas@gmail.com";

/**
 * Keeps a gated slot's union type wide: a module-level
 * `const X: T | null = null` is control-flow narrowed to `null`,
 * which turns the render guards below into type errors.
 */
const slot = <T,>(value: T | null): T | null => value;

/**
 * Post-launch fill — the client's words, verbatim, once they give
 * them. While null, the pull-quote renders nothing.
 */
const CLIENT_QUOTE = slot<{ quote: string; attribution: string }>(null);

/**
 * Post-launch fill — real results once the page has lived in public:
 * traffic, demos booked, what the GTM lead inherited. While null,
 * the section renders nothing.
 */
const WHAT_HAPPENED_NEXT = slot<{
  body: string;
  stats?: readonly LabeledItem[];
}>(null);

type LabeledItem = {
  label: string;
  value: string;
  /** When set, the value cell renders these as separated external links. */
  links?: readonly { label: string; href: string }[];
};
type ProcessBeat = {
  title: string;
  body: string;
  /** Optional clip rendered large under the beat. */
  clip?: MotionClip;
  /** Optional supporting screenshots rendered under the beat. */
  images?: readonly CaseImage[];
};

/** Hero meta, minus the client cell — that one renders the logo. */
const PROJECT_META: readonly LabeledItem[] = [
  { label: "Role", value: "Product design + frontend, solo" },
  { label: "Timeline", value: "Mar – Jun 2026, ~3 months" },
  {
    label: "Stack",
    value: "Next.js 16 · React 19 · Tailwind 4",
    links: [
      { label: "Next.js 16", href: "https://nextjs.org" },
      { label: "React 19", href: "https://react.dev" },
      { label: "Tailwind 4", href: "https://tailwindcss.com" },
    ],
  },
];

/**
 * The roads that didn't ship — the shortcuts tried and reverted on the way
 * to the hand-built hero. A text-only beat that sits below the tools.
 */
const HERO_ANIMATION: ProcessBeat = {
  title: "What didn't work out",
  body: "Every shortcut was tried and reverted: an AI chroma-key video that hallucinated new doors, a WebGL shader that shipped for five days, two Rive integrations that never delivered. The hero that launched is a static raster with hand-built motion — the only path where every pixel stayed under control.",
};

/** What the meetings changed — the process notes that earned their place. */
const PROCESS_BEATS: readonly ProcessBeat[] = [
  {
    title: "Restraint as a design note",
    body: "The blur-to-focus pun was liked so much it spread across the whole page; the sharpest client note of the project pulled it back to one word in the hero. An effect loses its power the moment it's everywhere.",
  },
  {
    title: "Show, don't tell — live",
    body: "The typewriter was scroll-triggered, and I watched the client scroll straight past it in two live reviews. Now it types on load. The booking flow went from four steps to three the same way: by watching real people walk it.",
  },
];

/** The brief, as it was given — four directives, not a paragraph. */
const BRIEF_DIRECTIVES: readonly string[] = [
  "Dramatize the mis-hire problem.",
  "Anchor on define → shortlist → assess → decide.",
  "Unconventional — but never misread.",
  "Speak to founders, not just HR.",
];

/* The channel, transcribed from the project's real review threads — the actual
 * messages, in their original Spanish (praise, the underground/animation
 * debate, the launch). Lightly trimmed and re-dated into three beats; jokes and
 * wording preserved. Avatars: the client team as hand-drawn portraits in the
 * world's own style; Ale (the author) is his real GitHub photo. The decisions
 * here are load-bearing: Diego's "click y se abre" became the dig-to-open
 * underneath chapter, and "el tipo ese" (boxguy) got cut. */
const AV_DIEGO = "bg-gradient-to-br from-[#9C2B5C] to-[#6E1D40]";
const AV_FEDE = "bg-gradient-to-br from-[#2B6B9C] to-[#1D4E73]";
const AV_ALE = "bg-gradient-to-br from-[#5A6B8F] to-[#3E4D6B]";
const AV_CARLOS = "bg-gradient-to-br from-[#2F8F7A] to-[#1E6657]";

const FACE_DIEGO: SlackFace = {
  initial: "D",
  avatarClassName: AV_DIEGO,
  avatarSrc: "/work/messa/slack/diego.webp",
};
const FACE_FEDE: SlackFace = {
  initial: "F",
  avatarClassName: AV_FEDE,
  avatarSrc: "/work/messa/slack/fede.webp",
};
const FACE_ALE: SlackFace = {
  initial: "A",
  avatarClassName: AV_ALE,
  avatarSrc: "/work/messa/slack/ale.webp",
};
const FACE_CARLOS: SlackFace = {
  initial: "C",
  avatarClassName: AV_CARLOS,
  avatarSrc: "/work/messa/slack/carlos.webp",
};

const SLACK_MEMBERS: readonly SlackFace[] = [
  FACE_DIEGO,
  FACE_FEDE,
  FACE_CARLOS,
  FACE_ALE,
];

/** A Slack @-mention pill — blue for people, gold for broadcast (@here). */
const Mention = ({
  children,
  broadcast = false,
}: {
  children: ReactNode;
  broadcast?: boolean;
}) => (
  <span
    className={`rounded px-1 font-medium ${
      broadcast
        ? "bg-[#FBE9A8] text-[#9A6700]"
        : "bg-[#1264A3]/10 text-[#1264A3]"
    }`}
  >
    {children}
  </span>
);

const SLACK_DAYS: readonly SlackDay[] = [
  {
    date: "May 21st",
    messages: [
      {
        author: "Diego Meller",
        ...FACE_DIEGO,
        time: "10:35 AM",
        body: "Ya estuve viendo.",
        reactions: [{ emoji: "✅", count: 1, mine: true }],
      },
      {
        author: "Diego Meller",
        ...FACE_DIEGO,
        time: "10:35 AM",
        continuation: true,
        body: "Great progress 🔥",
      },
      {
        author: "Carlos",
        ...FACE_CARLOS,
        time: "2:22 PM",
        body: "muy zarpado ale, muy bueno quedó",
        reactions: [{ emoji: "❤️", count: 1 }],
      },
      {
        author: "Carlos",
        ...FACE_CARLOS,
        time: "2:23 PM",
        continuation: true,
        body: "sos muy groso",
        reactions: [{ emoji: "❤️", count: 1 }],
      },
    ],
  },
  {
    date: "June 4th",
    messages: [
      {
        author: "Diego Meller",
        ...FACE_DIEGO,
        time: "10:02 AM",
        body: "FUAH",
      },
      {
        author: "Diego Meller",
        ...FACE_DIEGO,
        time: "10:02 AM",
        continuation: true,
        edited: true,
        body: "ME ENCANTA lo de “underground” 👏 pero ¿no hace que el sitio quede WAY too long? ¿No te tienta probar algo que hacés click y se abre?",
      },
      {
        author: "Diego Meller",
        ...FACE_DIEGO,
        time: "10:03 AM",
        continuation: true,
        body: "Also, personajes animados hay este nada más no?",
        attachment: {
          src: "/work/messa/cast/boxguy.webp",
          alt: "An isometric worker pushing a hand-truck stacked with boxes of CVs.",
          name: "boxguy.webp",
          width: 760,
          height: 826,
        },
      },
      {
        author: "Carlos",
        ...FACE_CARLOS,
        time: "10:04 AM",
        body: "dejemos lo de underground, y saquemos la animación del tipo ese — para mí no aporta nada y hay mil cosas animadas ya",
        reactions: [{ emoji: "👍", count: 1, mine: true }],
        thread: {
          count: 4,
          faces: [FACE_ALE, FACE_DIEGO, FACE_CARLOS],
          last: "last reply 1h ago",
        },
      },
      {
        author: "Ale",
        ...FACE_ALE,
        time: "11:48 AM",
        body: "hecho: underground queda pero ahora se abre al click, y el tipo ese afuera. El sitio bajó un 40% de alto 🪓",
        reactions: [
          { emoji: "🙌", count: 2 },
          { emoji: "🪓", count: 1 },
        ],
      },
    ],
  },
  {
    date: "June 16th",
    messages: [
      {
        author: "Alejandro Vizio",
        ...FACE_ALE,
        time: "12:14 PM",
        body: (
          <>
            <Mention>@Fede</Mention> <Mention>@Diego Meller</Mention> listorti,
            pusheado y commiteado y deployado a vercel
          </>
        ),
        reactions: [
          { emoji: "👍", count: 1 },
          { emoji: "👀", count: 1 },
        ],
      },
      {
        author: "Diego Meller",
        ...FACE_DIEGO,
        time: "12:18 PM",
        body: "Ahí lo vi",
      },
      {
        author: "Diego Meller",
        ...FACE_DIEGO,
        time: "12:18 PM",
        continuation: true,
        body: "🤘 let’s go",
        reactions: [{ emoji: "🙌", count: 2 }],
      },
      {
        author: "Fede",
        ...FACE_FEDE,
        time: "12:19 PM",
        body: "Listo el release a staging con los últimos cambios, voy activando el release a prod",
        reactions: [{ emoji: "🙌", count: 1 }],
      },
      {
        author: "Fede",
        ...FACE_FEDE,
        time: "12:35 PM",
        body: (
          <>
            <Mention broadcast>@here</Mention> Ahí salió live el nuevo sitio 👏
          </>
        ),
        reactions: [
          { emoji: "🎉", count: 2 },
          { emoji: "🚀", count: 1 },
        ],
      },
      {
        author: "Fede",
        ...FACE_FEDE,
        time: "12:35 PM",
        continuation: true,
        body: (
          <>
            <Mention broadcast>@Alejandro Vizio</Mention> a partir de ahora si
            hacés más cambios vas a tener que salir de staging y crearte un branch
            nuevo + PR contra staging
          </>
        ),
        reactions: [{ emoji: "👍", count: 1 }],
      },
      {
        author: "Fede",
        ...FACE_FEDE,
        time: "12:36 PM",
        continuation: true,
        body: "Es el mismo workflow que usamos todos",
        reactions: [{ emoji: "👍", count: 1 }],
      },
      {
        author: "Alejandro Vizio",
        ...FACE_ALE,
        time: "12:41 PM",
        body: "anotado 🫡 gracias por bancarlo, equipo",
        reactions: [{ emoji: "❤️", count: 3 }],
      },
    ],
  },
];

/** The craft, the performance war and the hardening day, merged into one
 * cross-section (client direction 2026-06-19) — the strongest numbers from all
 * three, each verified in the production source. Underneath core sample (01). */
const UNDER_THE_HOOD: readonly LabeledItem[] = [
  { value: "11s → ~2s", label: "mobile LCP, after the perf war" },
  { value: "2.9MB → 45KB", label: "largest raster, re-cut" },
  { value: "~18 MB", label: "media weight cut from the deploy" },
  { value: "61 KB", label: "the whole paper texture, one frozen frame" },
  { value: "0", label: "third-party requests in production" },
  { value: "26.57°", label: "one angle — walls, belts, shadows" },
  { value: "31 → 0", label: "ESLint errors, the hardening day" },
  { value: "52 / 0", label: "QA findings fixed / false positives" },
];

/* A chapter now carries the structure, so most sections lead with just
 * the serif heading (no numbered pill — that repetition was the
 * monotony). `kicker` stays optional for the rare section that still
 * wants a tag. `id` is the nav anchor; scroll-mt clears the sky band. */
const SectionHeading = ({
  kicker,
  id,
  children,
}: {
  kicker?: string;
  id?: string;
  children: ReactNode;
}) => (
  <div id={id} className="scroll-mt-28">
    {kicker ? (
      <p className="inline-flex items-center rounded-full border border-[#E8D9C5] bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[#5A6B8F]">
        {kicker}
      </p>
    ) : null}
    <h2
      className={`story-serif text-3xl tracking-tight text-[#0A0A0B] ${kicker ? "mt-4" : ""}`}
    >
      {children}
    </h2>
  </div>
);

const Prose = ({ children }: { children: ReactNode }) => (
  <div className="mt-6 space-y-5 text-base leading-7 text-[#6E6B68]">
    {children}
  </div>
);

/** A clip at full content width with the motion-studies caption treatment. */
const FeaturedClip = ({
  clip,
  className,
}: {
  clip: MotionClip;
  className?: string;
}) => (
  <figure className={className}>
    <InViewVideo
      src={clip.src}
      poster={clip.poster}
      width={clip.width}
      height={clip.height}
      label={clip.label}
      className="rounded-xl border border-[#E8D9C5] bg-white"
    />
    <figcaption className="mt-3 text-sm leading-6">
      <span className="text-[#0A0A0B]">{clip.title}</span>{" "}
      <span className="text-[#6E6B68]">— {clip.caption}</span>
    </figcaption>
  </figure>
);

/** A process / story beat: a serif sub-head, a paragraph, and an
 * optional clip and supporting stills. Shared by the hero's animation
 * note and the "what the meetings changed" beats. */
const Beat = ({ beat }: { beat: ProcessBeat }) => (
  <div>
    <h3 className="story-serif text-xl tracking-tight text-[#0A0A0B]">
      {beat.title}
    </h3>
    <p className="mt-3 text-base leading-7 text-[#6E6B68]">{beat.body}</p>
    {beat.clip ? <FeaturedClip clip={beat.clip} className="mt-6" /> : null}
    {beat.images ? (
      <MediaGrid
        images={beat.images}
        columnsClassName="grid-cols-1 sm:grid-cols-2"
        sizes="(min-width: 768px) 368px, 100vw"
        className="mt-6"
      />
    ) : null}
  </div>
);

/** Big stat values: a before→after pair breaks only at the arrow (never
 * orphaning a token mid-number), so every cell is one or two clean lines. */
const StatValue = ({ value }: { value: string }) => {
  const i = value.indexOf("→");
  if (i === -1) return <>{value}</>;
  return (
    <>
      {value.slice(0, i).trim()}
      <br />→ {value.slice(i + 1).trim()}
    </>
  );
};

/** A small grid of before/after-style stats, reused by the hardening and
 * performance sections. */
const StatGrid = ({
  stats,
  columnsClassName,
}: {
  stats: readonly LabeledItem[];
  columnsClassName: string;
}) => (
  <dl
    className={`mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#E8D9C5] bg-[#E8D9C5] ${columnsClassName}`}
  >
    {stats.map((stat) => (
      <div
        key={stat.label}
        className="flex flex-col justify-center bg-white p-6 sm:p-7"
      >
        <dt className="order-last mt-2 font-mono text-xs leading-5 text-[#6E6B68]">
          {stat.label}
        </dt>
        <dd className="story-serif text-[1.75rem] leading-tight tracking-tight text-[#0A0A0B]">
          <StatValue value={stat.value} />
        </dd>
      </div>
    ))}
  </dl>
);

const MessaCaseStudyPage = () => (
  /* The Messa world: this route hard-sets the cream palette and its
   * own (client-licensed, see fonts.ts) type — it renders identically
   * whatever the OS color scheme says. [color-scheme:light] keeps
   * scrollbars and form controls light too. */
  <div
    className={`${storyFontVariables} story-sans flex-1 bg-[#FBF0E6] text-[#0A0A0B] [color-scheme:light]`}
  >
    <StoryNav />

    {/* ───────────── INTRO ───────────── */}
    {/* Hero, under the sky band — Messa's modal/hero gradient. */}
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#D4E3F0_0%,#E4E6E2_22%,#F0E6D8_48%,#FBF0E6_72%)]">
      <Clouds variant="hero" />
      <article className="relative mx-auto max-w-3xl px-6 pt-24 sm:pt-32">
        <header>
          <p className="inline-flex items-center rounded-full border border-[#E8D9C5] bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[#5A6B8F]">
            The story · Unlisted
          </p>
          {/* The brand mark IS the title (client call 2026-06-10); the
           * svg carries aria-label="Messa", which becomes the h1's
           * accessible name — no separate text needed. */}
          <h1 className="mt-8">
            <MessaLogo height={52} />
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#6E6B68]">
            An AI hiring copilot needed a landing page. I built it a place
            instead: a warm paper world where CVs go in by truck and clear
            decisions come out.
          </p>
          {/* Primary action: the live site, styled like the world's own
           * CTA pill. Points at the production domain — correct from
           * launch day on, which is also when this page goes public. */}
          <a
            href="https://messa.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#5A6B8F] px-6 py-2.5 text-[15px] font-medium text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#4d5d7e] active:scale-[0.97]"
          >
            Visit the live site
            <span aria-hidden>→</span>
          </a>
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-[#E8D9C5] pt-8 sm:grid-cols-4">
            {PROJECT_META.map((item) => (
              <div key={item.label}>
                <dt className="font-mono text-xs uppercase tracking-widest text-[#6E6B68]">
                  {item.label}
                </dt>
                <dd className="mt-2 text-sm leading-6 text-[#0A0A0B]">
                  {item.links
                    ? item.links.map((link, i) => (
                        <span key={link.href}>
                          {i > 0 ? (
                            <span className="text-[#6E6B68]"> · </span>
                          ) : null}
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-[#C9B89E] underline-offset-2 transition-colors hover:text-[#5A6B8F] hover:decoration-[#5A6B8F]"
                          >
                            {link.label}
                          </a>
                        </span>
                      ))
                    : item.value}
                </dd>
              </div>
            ))}
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-[#6E6B68]">
                Client
              </dt>
              <dd className="mt-2 text-sm leading-6 text-[#0A0A0B]">
                Messa
                <span className="mt-1 block text-[#6E6B68]">messa.ai</span>
              </dd>
            </div>
          </dl>
        </header>
      </article>

      {/* The trailer — the whole story in 46 seconds, before a single
       * paragraph. In-view autoplay, muted, poster until then. */}
      <div className="relative mx-auto mt-14 max-w-5xl px-6">
        <FeaturedClip clip={TRAILER_CLIP} />
      </div>
    </div>

    {/* ───────────── I · BRIEF ───────────── */}
    <ChapterDivider
      numeral="I"
      title="Brief"
      blurb="A walkthrough of the whole product, four lines of brief, and a page that had to win every deal."
    />

    <article className="mx-auto max-w-3xl px-6">
      <section>
        <SectionHeading id="brief">
          A product education, not a design briefing
        </SectionHeading>
        <Prose>
          <p>
            Messa reads every CV, guides every interview, writes every
            scorecard. So the kickoff wasn&apos;t a mood board — it was a
            walkthrough of the whole product, before a single pixel. It ended
            in four lines.
          </p>
        </Prose>
        {/* The brief itself — four directives, at the weight they were given. */}
        <ol className="mt-10 border-t border-[#E8D9C5]">
          {BRIEF_DIRECTIVES.map((directive, index) => (
            <li
              key={directive}
              className="flex items-baseline gap-5 border-b border-[#E8D9C5] py-5 sm:gap-7 sm:py-6"
            >
              <span className="shrink-0 font-mono text-xs uppercase tracking-widest text-[#5A6B8F] sm:text-sm">
                0{index + 1}
              </span>
              <p className="story-serif text-xl leading-snug tracking-tight text-[#0A0A0B] sm:text-[1.7rem]">
                {directive}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* The setup — the stakes that made the brief matter. */}
      <section className="mt-20">
        <SectionHeading id="setup">The front door for every deal</SectionHeading>
        <Prose>
          <p>
            Messa was hiring its first GTM lead. This page would be the front
            door for every deal — the first thing a founder, an investor, or a
            candidate saw. Grounded in the public messa.ai/jobs listing, it had
            a job to do, not just a look to land.
          </p>
        </Prose>
      </section>
    </article>

    {/* ───────────── II · EXPLORATIONS ───────────── */}
    <ChapterDivider
      numeral="II"
      title="Explorations"
      blurb="Three concepts in a day. A pipeline that grew walls and became a factory. And a months-long hunt for the right world."
    />

    <article className="mx-auto max-w-3xl px-6">
      <section>
        <SectionHeading id="concepts">
          Two concepts, one survivor
        </SectionHeading>
        <Prose>
          <p>
            Day one ended with working concepts on live routes, so the first
            review could be a decision, not a discussion. Two earned the
            argument: the one I loved, and the one that won.
          </p>
        </Prose>
      </section>
    </article>

    <ConceptGallery className="mt-14" />

    {/* The lost middle step, recovered from the April deploys. */}
    <article className="mx-auto max-w-3xl px-6">
      <section id="pipeline-to-factory" className="mt-20 scroll-mt-28">
        <h3 className="story-serif text-xl tracking-tight text-[#0A0A0B]">
          From pipeline to factory
        </h3>
        <p className="mt-3 text-base leading-7 text-[#6E6B68]">
          In April the pipeline learned to stand up: a toggle flipped the
          live hero from flat to isometric. Two weeks later the diamonds
          grew walls and belts — and the factory replaced the pipeline for
          good.
        </p>
      </section>
    </article>

    <figure className="mx-auto mt-8 max-w-5xl px-6">
      <InViewVideo
        src={ISO_PIPELINE_CLIP.src}
        poster={ISO_PIPELINE_CLIP.poster}
        width={ISO_PIPELINE_CLIP.width}
        height={ISO_PIPELINE_CLIP.height}
        label={ISO_PIPELINE_CLIP.label}
        className="rounded-xl border border-[#E8D9C5] bg-white"
      />
      <figcaption className="mt-3 text-sm leading-6">
        <span className="text-[#0A0A0B]">{ISO_PIPELINE_CLIP.title}</span>{" "}
        <span className="text-[#6E6B68]">— {ISO_PIPELINE_CLIP.caption}</span>
      </figcaption>
    </figure>

    <div className="mx-auto mt-8 max-w-5xl px-6">
      <HorizontalGallery
        items={PIPELINE_EVOLUTION}
        label="Flat to isometric to factory, in recovered deploy stills"
      />
    </div>

    {/* The search for a world — painted backgrounds switched live. */}
    <article className="mx-auto max-w-3xl px-6">
      <section className="mt-20">
        <SectionHeading id="backgrounds">
          Trying on worlds
        </SectionHeading>
        <Prose>
          <p>
            Before any of it was drawn by hand, the art direction was a
            search. December auditioned painted realism — whole worlds to
            &ldquo;work from anywhere&rdquo; in. By April the hunt became a
            live control panel: one switch flipped the pipeline hero — and
            every section under it — through watercolor, pastel, oleo, ink
            &amp; wash, gouache and impressionism. Watercolor led almost to
            the end.
          </p>
        </Prose>
      </section>
    </article>

    {/* The self-playing world switcher — the flat pipeline auto-cycling
      * its background, the product section and footer following. */}
    <div className="mx-auto mt-12 max-w-5xl px-6">
      <PipelineWorlds />
    </div>

    {/* ───────────── III · ART DIRECTION ───────────── */}
    <ChapterDivider
      numeral="III"
      title="Art direction"
      blurb="The brand, atom by atom — type, color, icons — then the hand-drawn world and the kit that runs it."
    />

    {/* The creative direction — the thesis behind the world (why a factory) and
      * the rules that keep it one place, before the chapter breaks it into
      * atoms (client direction 2026-06-22). */}
    <article className="mx-auto max-w-3xl px-6">
      <section>
        <SectionHeading id="creative-direction">
          Why a factory — and the rules that run it
        </SectionHeading>
        <Prose>
          <p>
            Hiring is already a pipeline: things come in, get sorted, a decision
            comes out. So rather than draw that as floating glass and gradients, I
            built the pipeline as a place you can watch work — a hand-drawn
            factory where CVs arrive by truck and finished hires leave on the
            belt. A warm, analog world for a tool people are still nervous to
            hand something as human as hiring.
          </p>
          <p>
            A world only reads as one place if everything obeys the same few
            rules. These held every layer, icon and screen:
          </p>
        </Prose>
      </section>
    </article>

    <WorldRules className="mt-10" />

    {/* Typography */}
    <article className="mx-auto max-w-3xl px-6">
      <section className="mt-20">
        <SectionHeading id="typography">Typography</SectionHeading>
        <Prose>
          <p>
            Nine display faces, set against the same words in the real licensed
            fonts — same words, same sizes — until one was obviously right.
            Perfectly Nineties won.
          </p>
        </Prose>
      </section>
    </article>
    <TypographyContactSheet className="mt-12" />

    {/* Color */}
    <article className="mx-auto max-w-3xl px-6">
      <section className="mt-20">
        <SectionHeading id="color">Color</SectionHeading>
        <Prose>
          <p>
            Four colors hold the whole world together — cream, ink, slate, sky —
            inside a full palette warm enough that nothing ever alarms.
          </p>
        </Prose>
      </section>
    </article>
    <BrandPalette className="mt-12" />

    {/* Icons */}
    <article className="mx-auto max-w-3xl px-6">
      <section className="mt-20">
        <SectionHeading id="icons">Icons</SectionHeading>
        <Prose>
          <p>
            Twenty-eight glyphs from Tabler outline — the one canonical set
            across the site, stroked at 2px and tinted to the slate accent, drawn
            to live on the cream.
          </p>
        </Prose>
      </section>
    </article>
    <IconWall className="mt-12" />

    {/* Illustrations — the hand-drawn isometric world. */}
    <article className="mx-auto mt-20 max-w-3xl px-6">
      <section>
        <SectionHeading id="illustrations">
          A hand-drawn isometric world
        </SectionHeading>
        <Prose>
          <p>
            None of the painted worlds felt like the product — they were
            beautiful places the page was only set in. So the world got
            drawn by hand: one isometric grid governing everything — towers,
            belts, the CV truck, the soil waiting under the page. Warm cream,
            ink outlines, cel shadows.
          </p>
        </Prose>
      </section>
    </article>

    <div className="mx-auto mt-10 max-w-5xl px-6">
      {/* The cast: two stacked marquee rows at one height — people drift
        * one way, objects the other. No card; the drawings stand on cream. */}
      <ScaledCast
        sprites={HANDDRAWN_PEOPLE}
        marquee
        label="The hand-drawn people"
        caption="The people — every illustrated figure on the site, drifting past at one height: the interview pair, the overwhelmed-desk man, the box-hauler, the note-takers, an arriving group, the security guard, and a lone candidate."
      />
      <ScaledCast
        sprites={HANDDRAWN_OBJECTS}
        marquee
        reverse
        label="The hand-drawn objects"
        caption="The objects drift back the other way, at the same height — the About-page typewriter, the booking calendar, the chalkboard, the CV truck, the jobs-page lighthouse, the leaderboard, the paper plane, and the desk coffee mug."
        className="mt-12"
      />
      {/* "The part nobody built." — the pain-section's isometric hiring cube,
        * Messa craned into the one empty slot. */}
      <figure className="mt-16">
        <InViewVideo
          src={NOBODY_BUILT_CLIP.src}
          poster={NOBODY_BUILT_CLIP.poster}
          width={NOBODY_BUILT_CLIP.width}
          height={NOBODY_BUILT_CLIP.height}
          label={NOBODY_BUILT_CLIP.label}
          className="story-edge-feather mx-auto max-w-xl"
        />
        <figcaption className="mx-auto mt-3 max-w-xl text-center text-sm leading-6">
          <span className="text-[#0A0A0B]">{NOBODY_BUILT_CLIP.title}</span>{" "}
          <span className="text-[#6E6B68]">— {NOBODY_BUILT_CLIP.caption}</span>
        </figcaption>
      </figure>

      {/* Then the sky — the cloud sprites at their true drift widths. */}
      <ScaledCast
        sprites={HANDDRAWN_SKY}
        label="The hero sky, sized as it ships"
        caption="The five cloud sprites at the widths they drift at on the live pages, widest to smallest — the same cutouts riding the hero and the legal-page skies."
        className="mt-16 text-center"
      />
      {/* And the full-bleed backdrops the world is set in — bare on the
        * cream, butterflies over the foot in the page's slate accent. */}
      <div className="relative mt-20 overflow-x-hidden text-center">
        <ButterflyDefs />
        <p className="text-sm leading-6 text-[#6E6B68]">
          And the backdrops they all move through — the full-bleed scenes used
          across the live site.
        </p>
        <ul className="mt-6 space-y-10">
          {HANDDRAWN_BACKDROPS.map((backdrop) => (
            <li key={backdrop.src}>
              <figure>
                <Image
                  src={backdrop.src}
                  alt={backdrop.alt}
                  width={backdrop.width}
                  height={backdrop.height}
                  sizes="(min-width: 1024px) 960px, 100vw"
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full"
                />
                <figcaption className="mt-2 text-xs leading-5 text-[#6E6B68]">
                  {backdrop.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <Butterfly
          className="absolute bottom-[7%] left-[12%] z-10"
          size={44}
          path="a"
          fly={20}
          color="#5A6B8F"
          ink="#3F4D6B"
        />
        <Butterfly
          className="absolute bottom-[3%] right-[14%] z-10"
          size={26}
          path="b"
          fly={24}
          flap={1.2}
          delay={0.7}
          flip
          tilt={18}
          color="#5A6B8F"
          ink="#3F4D6B"
        />
        <Butterfly
          className="absolute bottom-[16%] left-[44%] z-10"
          size={20}
          path="b"
          fly={27}
          flap={1.1}
          delay={1.4}
          color="#5A6B8F"
          ink="#3F4D6B"
        />
      </div>
    </div>

    {/* The OG card — the social-share artifact, argued out over seven
      * versions; sits just before the interface kit. */}
    <article className="mx-auto mt-24 max-w-3xl px-6">
      <section>
        <SectionHeading id="the-card">
          Six cards before the card
        </SectionHeading>
        <Prose>
          <p>
            WhatsApp silently drops preview images over 600 KB — the first
            card that ever rendered in a chat was a 117 KB JPEG. The argument, in
            order:
          </p>
        </Prose>
      </section>
    </article>

    {/* The OG-card iterations as a moving carousel — oldest first, looping
      * seamlessly (doubled track), pausing on hover, static under reduced
      * motion. */}
    <div className="story-marquee-mask story-marquee-fade story-scrollbar-none mx-[calc(50%-50vw)] mt-10 overflow-hidden pb-2 motion-reduce:overflow-x-auto">
      <div className="story-marquee flex">
        {[...OG_ITERATIONS, ...OG_ITERATIONS].map((c, i) => (
          <Image
            key={i}
            src={c.src}
            alt={i < OG_ITERATIONS.length ? c.alt : ""}
            aria-hidden={i >= OG_ITERATIONS.length || undefined}
            width={c.width}
            height={c.height}
            sizes="440px"
            className="mr-5 h-auto w-[440px] shrink-0 rounded-xl border border-[#E8D9C5]"
          />
        ))}
      </div>
    </div>

    {/* UI — the interface kit: buttons, stepper, pills, nav. */}
    <article className="mx-auto mt-24 max-w-3xl px-6">
      <section>
        <SectionHeading id="ui">The interface kit</SectionHeading>
        <Prose>
          <p>
            The components that carry the world into a working interface — and
            the &ldquo;little details&rdquo; the client asked for, up close.
          </p>
        </Prose>
      </section>
    </article>

    {/* Buttons — the CTA in the three styles the live switcher toggled;
      * the tactile 3D shipped, then taken apart layer by layer right here. */}
    <ButtonLab className="mt-12" />
    <div className="mx-auto mt-10 max-w-3xl px-6">
      <h4 className="font-mono text-xs uppercase tracking-widest text-[#5A6B8F]">
        The 3D button, layer by layer
      </h4>
      <ButtonAnatomy className="mt-4" />
    </div>

    {/* Stepper — the how-it-works stepper, rebuilt live so it switches
      * itself, with the mechanic spelled out beside it. */}
    <StepperLab className="mt-16" />

    {/* Pills — the whole section-pill family, rebuilt natively in the brand's
      * own variant colors (the neutral / info / problem / warning / success
      * tokens). Replaces the old screenshot close-ups. */}
    <figure className="mx-auto mt-16 max-w-3xl px-6">
      <div className="flex flex-nowrap items-center justify-center gap-2.5 overflow-x-auto px-6 py-8 sm:gap-3 sm:px-8">
        {[
          { label: "Our values", color: "#0A0A0B", bg: "rgba(10,10,11,0.06)", border: "transparent" },
          { label: "How it works", color: "#5A6B8F", bg: "rgba(90,107,143,0.08)", border: "rgba(90,107,143,0.3)" },
          { label: "The problem", color: "#8B3A24", bg: "rgba(206,107,82,0.1)", border: "rgba(206,107,82,0.28)" },
          { label: "What teams say", color: "#8C530A", bg: "rgba(217,146,74,0.14)", border: "rgba(217,146,74,0.3)" },
          { label: "Strong match", color: "#2E7A4D", bg: "rgba(105,185,130,0.12)", border: "rgba(105,185,130,0.35)" },
        ].map((p) => (
          <span
            key={p.label}
            className="inline-block shrink-0 rounded-full px-4 py-1.5 text-sm font-medium tracking-[0.025em]"
            style={{ color: p.color, background: p.bg, border: `1px solid ${p.border}` }}
          >
            {p.label}
          </span>
        ))}
      </div>
      <figcaption className="mt-3 text-sm leading-6 text-[#6E6B68]">
        The section-pill family — rebuilt natively, not screenshotted. The
        neutral label plus the info, problem, warning and success variants that
        head and tag blocks across the site.
      </figcaption>
    </figure>

    {/* The two signature surfaces, rebuilt natively and taken apart — stacked,
      * each full-width (no screenshots; every value is the production token).
      * Replaces the old component-close-up screenshot gallery. */}
    <article className="mx-auto mt-20 max-w-3xl px-6">
      <h3 className="story-serif text-xl tracking-tight text-[#0A0A0B]">
        The glass nav, taken apart
      </h3>
      <p className="mt-3 text-base leading-7 text-[#6E6B68]">
        It looks like one material; it&apos;s really five stacked layers —
        rebuilt here and peeled apart, every value the production token.
      </p>
    </article>
    <div className="mx-auto mt-8 max-w-3xl px-6">
      <GlassNavAnatomy />
    </div>

    {/* ───────────── IV · THE WEBSITE ───────────── */}
    <ChapterDivider
      numeral="IV"
      title="The website"
      blurb="The shipped page, taken apart — the hero in layers, the paper frozen, the motion, the live product."
      joinBelow
    />

    {/* The hero — the shipped factory, rebuilt and animated; the section
      * title sits in the stage's sky, the stage spans edge to edge. */}
    <FactoryLayers
      headingId="hero"
      heading="The hero, one layer at a time"
      intro="The shipped hero, rebuilt and animated — every element on its own layer. Toggle them on and off to take it apart: the conveyor belts and CV cards, the trucks on their round trip, the interview and the rest of the cast, the clouds, the sky, the paper grain."
    />

    {/* The calibration suite behind the layers. */}
    <article className="mx-auto max-w-3xl px-6">
      <section className="mt-20">
        <h3 className="story-serif text-xl tracking-tight text-[#0A0A0B]">
          The tools behind the world
        </h3>
        <p className="mt-3 text-base leading-7 text-[#6E6B68]">
          None of this was tuned in a design file. Every layer got its own
          editor, living on the page it edits behind a ?calibrate flag —
          each exporting paste-ready constants. Production compiles all of
          it out.
        </p>
      </section>
    </article>

    <div className="mx-auto mt-8 max-w-5xl px-6">
      <HorizontalGallery
        items={imageItems(BREAKDOWN_TOOLS, "xwide")}
        label="The in-page calibration tools, one per layer"
      />
    </div>

    {/* What didn't work out — the shortcuts tried on the way to the hero, with
      * the chromakey-era hero shown wide so the whole factory reads. */}
    <article className="mx-auto mt-20 max-w-3xl px-6">
      <Beat beat={HERO_ANIMATION} />
    </article>
    <div className="mx-auto mt-8 max-w-7xl px-6">
      <FeaturedClip clip={CHROMAKEY_HERO_CLIP} />
    </div>

    {/* The texture */}
    <article className="mx-auto max-w-3xl px-6">
      <section className="mt-24">
        <SectionHeading id="texture">
          The paper, frozen
        </SectionHeading>
        <Prose>
          <p>
            The grain began as a live WebGL shader — and froze the page the
            moment anyone screen-shared it. Its output is deterministic, so
            I captured one frame and shipped that: 61 KB, zero WebGL. The
            grain over this page is the same frozen frame.
          </p>
        </Prose>
      </section>
    </article>

    <div className="mx-auto mt-10 max-w-5xl px-6">
      <figure>
        <CompareSlider
          before={TEXTURE_PAIRS[0].raw}
          after={TEXTURE_PAIRS[0].textured}
          beforeBadge="Raw"
          afterBadge="Textured"
          label={TEXTURE_PAIRS[0].label}
          sizes="(min-width: 1024px) 976px, 100vw"
        />
        <figcaption className="mt-3 text-sm leading-6 text-[#6E6B68]">
          {TEXTURE_PAIRS[0].caption}
        </figcaption>
      </figure>

      <div className="mt-10 grid gap-x-4 gap-y-8 sm:grid-cols-3">
        <figure className="sm:col-span-2">
          <CompareSlider
            before={TEXTURE_PAIRS[1].raw}
            after={TEXTURE_PAIRS[1].textured}
            beforeBadge="Raw"
            afterBadge="Textured"
            label={TEXTURE_PAIRS[1].label}
            sizes="(min-width: 1024px) 644px, (min-width: 640px) 66vw, 100vw"
          />
          <figcaption className="mt-3 text-sm leading-6 text-[#6E6B68]">
            {TEXTURE_PAIRS[1].caption}
          </figcaption>
        </figure>
        <figure>
          <Image
            src={TEXTURE_TILE.src}
            alt={TEXTURE_TILE.alt}
            width={TEXTURE_TILE.width}
            height={TEXTURE_TILE.height}
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 33vw, 100vw"
            loading="lazy"
            decoding="async"
            className="rounded-xl border border-[#E8D9C5] bg-white"
          />
          <figcaption className="mt-3 text-sm leading-6 text-[#6E6B68]">
            {TEXTURE_TILE.caption}
          </figcaption>
          <p className="mt-2 font-mono text-xs leading-5 text-[#6E6B68]">
            Measured reveal: 0 → .10 → .18 → .24 → .26 opacity over 800ms,
            ease-out.
          </p>
        </figure>
      </div>
    </div>

    {/* Motion & interaction */}
    <article className="mx-auto max-w-3xl px-6">
      <section className="mt-24">
        <SectionHeading id="motion">
          Motion &amp; interaction
        </SectionHeading>
        <Prose>
          <p>
            The weather was above; these are the interactions — rebuilt natively
            as live UI, not recorded. Hover them to loop; reduced motion holds
            them still.
          </p>
        </Prose>
      </section>
    </article>

    <div className="mx-auto mt-10 max-w-5xl px-6">
      <MotionStudies />
    </div>

    {/* The custom Request-a-demo booking modal, step by step — sits above the
      * typewriter. */}
    <DemoModalSteps className="mt-16" />

    {/* The typewriter — the About-page founder letter, rebuilt natively;
      * it rolls out of the machine and types itself to the signature. */}
    <article className="mx-auto max-w-3xl px-6">
      <section className="mt-20">
        <SectionHeading id="typewriter">
          The letter that types itself
        </SectionHeading>
        <Prose>
          <p>
            The About page opens with a founder letter that rolls out of a
            typewriter and writes itself to the signature — the one beat nobody
            could scroll past.
          </p>
        </Prose>
      </section>
    </article>

    <div className="mx-[calc(50%-50vw)] mt-6">
      <TypewriterLetter />
    </div>

    {/* The real, interactive how-it-works — the live app advancing through its
      * four steps, the world lightening dusk → daylight as it goes. Rebuilt
      * natively from the live site, not screen-recorded. */}
    <HowItWorks className="mt-16" />

    {/* The product — the real, interactive section, lifted from the live site;
      * flows straight into the underneath dig below. */}
    <div id="product" className="scroll-mt-28">
      <LiveProduct className="mt-16" />
    </div>

    {/* ───────────── V · UNDERNEATH ───────────── */}
    {/* Buried: the whole chapter is soil-brown and collapsed behind a dig
      * trigger, in the style of the product's "what's underneath" reveal. */}
    <UnderneathDig
      numeral="V"
      title="Underneath"
      blurb="Dig past the surface — the frozen shader, the perf war, 759 commits. This is the standard the rest is built to."
    >
      <Borehole>
        <StratumBlock n="01" depth="−1m" title="Craft, speed, and the hardening day">
          <p className="max-w-2xl text-base leading-7 text-[#6E6B68]">
            The details that don&apos;t photograph, the weight war, and the day
            it went from beautiful to bulletproof — every number verified in the
            production source.
          </p>
          <SurveyGrid
            items={UNDER_THE_HOOD}
            columns="grid-cols-2 sm:grid-cols-4"
            className="mt-6"
          />
        </StratumBlock>

        <StratumBlock n="02" depth="−2m" title="Mobile">
          <p className="max-w-2xl text-base leading-7 text-[#6E6B68]">
            Built mobile-first, then adapted down: the large clouds drop out
            under 768px and the rest dim, the typewriter crops to its platen,
            and clips still mount only on approach. The hero that once took 11
            seconds to paint on a phone now lands in about two.
          </p>
          {/* The live site on a phone — hero, the how-it-works step, the
            * product, the testimonials. */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              {
                src: "/work/messa/mobile/mobile-hero.png",
                alt: "The Messa landing hero on a phone — 'See talent clearly' over the isometric factory, the glass nav collapsed to a menu.",
              },
              {
                src: "/work/messa/mobile/mobile-how.png",
                alt: "The how-it-works step on a phone — the candidate list and the step stepper with a Next button.",
              },
              {
                src: "/work/messa/mobile/mobile-product.png",
                alt: "The product on a phone — the Shortlisting view with the candidate funnel and scored results.",
              },
              {
                src: "/work/messa/mobile/mobile-testimonials.png",
                alt: "Testimonials on a phone, with the 'Built to assist, not to decide' section below.",
              },
            ].map((s) => (
              <figure
                key={s.src}
                className="overflow-hidden rounded-xl border border-white/15 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.28)]"
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={390}
                  height={844}
                  sizes="(min-width: 640px) 210px, 45vw"
                  loading="lazy"
                  className="h-auto w-full"
                />
              </figure>
            ))}
          </div>
        </StratumBlock>

        <StratumBlock n="03" depth="−3m" title="759 commits, fifteen deploys">
          <p className="max-w-2xl text-base leading-7 text-[#6E6B68]">
            759 commits of preview deploys — these fifteen mattered. It runs on
            its own; drag or click a stop to scrub.
          </p>
          <div className="mt-6">
            <TimelapseScrubber />
          </div>
          <ProductCommits className="mt-10" />
        </StratumBlock>

        <StratumBlock n="04" depth="−4m" title="The release runbook">
          <p className="max-w-2xl text-base leading-7 text-[#6E6B68]">
            Release week ran on a runbook, not adrenaline: backups cut, redesign
            force-pushed to staging, client walking it end to end on a preview
            domain. The last code in was a five-commit fix PR, reviewed by the
            client&apos;s engineer — and as I write this, it all sits waiting for
            the go.
          </p>
        </StratumBlock>
      </Borehole>
    </UnderneathDig>

    {/* ───────────── VI · LANDING IT ───────────── */}
    {/* Reframed from "Results" — the page ships at launch, so this chapter is
      * honest about what's true now: what the meetings changed, the room it
      * happened in, and the note it ends on. Launch numbers fill in later. */}
    <ChapterDivider
      numeral="VI"
      title="Landing it"
      blurb="What the meetings changed, the room it happened in, and the note it ends on. The launch numbers come after the go."
      warm
    />

    <article className="mx-auto max-w-3xl px-6 pb-24 sm:pb-32">
      {/* What the meetings actually changed */}
      <section>
        <SectionHeading id="process">
          What the meetings actually changed
        </SectionHeading>
        <div className="mt-10 space-y-12">
          {PROCESS_BEATS.map((beat) => (
            <Beat key={beat.title} beat={beat} />
          ))}
        </div>

        {/* Post-launch fill: renders nothing until CLIENT_QUOTE is set. */}
        {CLIENT_QUOTE ? (
          <figure className="mt-12 rounded-xl border border-[#E8D9C5] bg-white p-8 sm:p-10">
            <blockquote className="story-serif text-2xl leading-9 tracking-tight text-[#0A0A0B] italic sm:text-3xl sm:leading-10">
              &ldquo;{CLIENT_QUOTE.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm leading-6 text-[#6E6B68]">
              — {CLIENT_QUOTE.attribution}
            </figcaption>
          </figure>
        ) : null}
      </section>

      {/* Post-launch fill: renders nothing until WHAT_HAPPENED_NEXT is set. */}
      {WHAT_HAPPENED_NEXT ? (
        <section className="mt-24">
          <SectionHeading id="what-happened-next">
            What happened next
          </SectionHeading>
          <Prose>
            <p>{WHAT_HAPPENED_NEXT.body}</p>
          </Prose>
          {WHAT_HAPPENED_NEXT.stats ? (
            <StatGrid
              stats={WHAT_HAPPENED_NEXT.stats}
              columnsClassName="sm:grid-cols-4"
            />
          ) : null}
        </section>
      ) : null}

      {/* The channel — the project, as the people in it saw it. */}
      <section className="mt-24">
        <SectionHeading id="the-channel">
          Meanwhile, in Slack
        </SectionHeading>
        <SlackThread
          channel="messa-landing"
          topic="Messa × Ale — reviews, deploys y chistes"
          days={SLACK_DAYS}
          members={SLACK_MEMBERS}
          className="mt-10"
        />
        <p className="mt-3 text-sm leading-6 text-[#6E6B68]">
          Reconstructed from the project&apos;s real review threads — lightly
          edited, jokes preserved.
        </p>
      </section>

      {/* Closing */}
      <section className="mt-24 border-t border-[#E8D9C5] pt-12">
        <Prose>
          <p>
            Three sketches became a place — a factory with weather, a
            typewriter that writes to you, a booking flow that actually
            books. Messa hasn&apos;t launched yet, so this story ships
            unlisted. If you found it, you were meant to.
          </p>
        </Prose>

        {/* The ask. */}
        <div className="mt-12 rounded-xl border border-[#E8D9C5] bg-white p-8 sm:p-10">
          <p className="story-serif text-2xl leading-9 tracking-tight text-[#0A0A0B] sm:text-3xl sm:leading-10">
            Three months. Fifteen deploys. One site.
          </p>
          <p className="mt-3 text-base leading-7 text-[#6E6B68]">
            If you want yours to look like this — and hold up like this, down to
            the soil — write me.
          </p>
          <p className="mt-6">
            <a
              href={`mailto:${CONTACT}?subject=${encodeURIComponent("Three months. One site.")}`}
              className="inline-flex items-center rounded-full bg-[#5A6B8F] px-6 py-3 text-[15px] text-white transition-colors hover:bg-[#49587A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5A6B8F]"
            >
              Write me
            </a>
          </p>
        </div>

        <p className="mt-12 flex items-center justify-between gap-6">
          <Link
            href="/"
            className="font-mono text-sm text-[#6E6B68] transition-colors hover:text-[#0A0A0B]"
          >
            ← alevizio.com
          </Link>
          <MessaLogo height={14} />
        </p>
      </section>
    </article>
  </div>
);

export default MessaCaseStudyPage;
