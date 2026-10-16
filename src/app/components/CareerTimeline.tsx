import type { ComponentType } from "react";
import { companies } from "./CompanyLogos";
import {
  Lifeline,
  type LifelineEvent,
  type LifelineEventSegment,
} from "./lifeline";
import { registerCompanyIcons } from "./lifeline/company-icon";
import { defineLifeline } from "./lifeline/lifeline-data";

// The two companies the logo rows call "helped build & shape" carry their
// marks on the rail, cut from the first path of those same logos.
const logoMark = (
  name: string,
  viewBox: string
): ComponentType<{ className?: string }> => {
  const d = companies.find((company) => company.name === name)?.paths[0];
  return ({ className }) => (
    <svg viewBox={viewBox} fill="currentColor" aria-hidden="true" className={className}>
      <path d={d} />
    </svg>
  );
};

registerCompanyIcons({
  aerolab: { icon: logoMark("Aerolab", "-0.01 -0.1 20.74 17.96") },
  pachama: { icon: logoMark("Pachama", "0.98 0 58.13 65.9") },
});

const preview = (name: string, alt: string) => ({
  src: `/work/${name}-preview-poster.jpg`,
  video: `/work/${name}-preview.mp4`,
  alt,
});

// A career rather than a life: the rail opens at graduation, so there is no
// age row (showAge below) and `birthYear` is only where the axis starts.
const career = defineLifeline({
  slug: "alevizio",
  name: "Alejandro Vizio",
  birthYear: 2008,
  description: "A career in product and brand design, year by year.",
  milestones: {
    2008: {
      id: "unr",
      events: ["graduated in graphic design & visual communication at UNR."],
    },
    2012: {
      id: "aerolab",
      companies: [{ id: "aerolab", name: "Aerolab" }],
      events: [
        [
          { type: "text", value: "started " },
          { type: "link", value: "Aerolab", href: "https://aerolab.co/" },
          { type: "text", value: " and led it as creative director." },
        ],
      ],
    },
    2014: {
      id: "evil-rabbit",
      events: [
        [
          { type: "link", value: "Evil Rabbit", href: "https://evilrabbit.com" },
          { type: "text", value: " joined Aerolab as a product designer." },
        ],
      ],
    },
    2015: {
      id: "platzi",
      events: ["taught at Platzi."],
    },
    2017: {
      id: "digital-house",
      events: ["taught at Digital House."],
    },
    2018: {
      id: "aerolab-ceo",
      companies: [{ id: "aerolab", name: "Aerolab" }],
      events: ["became Aerolab's ceo.", "studied innovation at Singularity."],
    },
    2020: {
      id: "pachama",
      companies: [{ id: "pachama", name: "Pachama" }],
      events: [
        [
          { type: "text", value: "joined " },
          { type: "link", value: "Pachama", href: "https://pachama.com" },
          { type: "text", value: " to lead design." },
        ],
      ],
    },
    2022: {
      id: "friends-of-figma",
      events: [
        [
          { type: "text", value: "gave “design systems para todos” at " },
          {
            type: "link",
            value: "Friends of Figma Medellín",
            href: "https://friends.figma.com/events/details/figma-medellin-presents-design-systems-para-todos/",
          },
          { type: "text", value: "." },
        ],
      ],
    },
    2025: {
      id: "carbon-direct",
      events: [
        [
          { type: "text", value: "Pachama was " },
          {
            type: "link",
            value: "acquired by Carbon Direct",
            href: "https://techcrunch.com/2025/11/10/consolidation-begins-to-hit-the-carbon-credit-market/",
          },
          { type: "text", value: "." },
        ],
      ],
    },
    2026: {
      id: "now",
      events: [
        {
          text: [
            { type: "link", value: "globestudio", href: "https://globestudio.app" },
            { type: "text", value: " — open-source dotted maps & 3d globes." },
          ],
          image: preview("globestudio", "globestudio wrapping a dotted map into a globe"),
        },
        {
          text: [
            { type: "link", value: "curb", href: "https://curb.guide/" },
            { type: "text", value: " — know where to park in sf." },
          ],
          image: { src: "/work/curb-og.jpg", alt: "curb, sweeping times block by block" },
        },
        {
          text: [
            { type: "link", value: "saboteurs", href: "https://saboteurs.app/" },
            { type: "text", value: " — squad stealth for iphone, in beta." },
          ],
          image: preview("saboteurs", "the saboteurs trailer"),
        },
        {
          text: [
            { type: "link", value: "messa", href: "/work/messa" },
            { type: "text", value: " — a case study." },
          ],
          image: preview("messa", "the messa product trailer"),
        },
        {
          text: [
            { type: "link", value: "pausa", href: "/work/pausa" },
            { type: "text", value: " — a case study." },
          ],
          image: preview("pausa", "a scroll through the pausa case study"),
        },
      ],
    },
  },
});

// No widows: the last space of every event (wherever it falls, link or
// text) becomes a no-break space, so a last word never sits alone.
const glue = (value: string) => value.replace(/ (?=\S*$)/, "\u00a0");
const glueSegments = (segments: LifelineEventSegment[]) => {
  const last = segments.map((segment) => segment.value.includes(" ")).lastIndexOf(true);
  return segments.map((segment, index) =>
    index === last ? { ...segment, value: glue(segment.value) } : segment
  );
};
const glueEvent = (event: LifelineEvent): LifelineEvent => {
  if (typeof event === "string") return glue(event);
  if (Array.isArray(event)) return glueSegments(event);
  return {
    ...event,
    text: typeof event.text === "string" ? glue(event.text) : glueSegments(event.text),
  };
};

const markers = career.markers.map((marker) => ({
  ...marker,
  events: marker.events.map(glueEvent),
}));

export default function CareerTimeline() {
  return (
    <section
      aria-labelledby="career-timeline"
      className="relative z-10 max-w-[1440px] pb-[200px] lg:pb-[140px]"
    >
      {/* Set like the logo rows' labels, but at 70% ink (5.2:1) rather than
          their 50% (3.0:1), the same as the timeline's own text. */}
      <h2
        id="career-timeline"
        className="px-[60px] text-[clamp(11px,1vw,13px)] font-normal tracking-[0.05em] text-foreground/70 md:px-[140px]"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        how i got here
      </h2>
      {/* Below lg: the vertical timeline in the page's flow (no height, so its
          scroll box never scrolls); its own 24px gutter tops this up to the
          page's 60px (140px from md). lg+: the horizontal rail, scrubbed by
          the wheel while the pointer is on it. The box starts 20px left of
          the page's 140px column, where the pinned "years" label sits, and
          ends 8px in, so the rail stops 32px from the edge, in line with the
          project cards. Its height fits the tallest year (2026: 324px, plus
          the timeline's own 20px top padding); raise it if a year grows. */}
      <div className="px-[36px] md:px-[116px] lg:mr-2 lg:ml-[120px] lg:h-[352px] lg:px-0">
        <Lifeline
          mode="embed"
          showAge={false}
          markers={markers}
          birthYear={career.birthYear}
          title="timeline, 2008 to 2026"
          className="h-full"
        />
      </div>
    </section>
  );
}
