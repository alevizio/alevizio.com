import excellence from "@/assets/world/badges/excellence.png";
import draft01 from "@/assets/world/drafts/draft-01.jpg";
import draft02 from "@/assets/world/drafts/draft-02.jpg";
import draft03 from "@/assets/world/drafts/draft-03.jpg";
import draft04 from "@/assets/world/drafts/draft-04.jpg";
import draft05 from "@/assets/world/drafts/draft-05.jpg";
import draft06 from "@/assets/world/drafts/draft-06.jpg";
import draft07 from "@/assets/world/drafts/draft-07.jpg";
import draft08 from "@/assets/world/drafts/draft-08.jpg";
import draft09 from "@/assets/world/drafts/draft-09.jpg";
import draft10 from "@/assets/world/drafts/draft-10.jpg";
import draft11 from "@/assets/world/drafts/draft-11.jpg";
import draft12 from "@/assets/world/drafts/draft-12.jpg";
import draft13 from "@/assets/world/drafts/draft-13.jpg";
import draft14 from "@/assets/world/drafts/draft-14.jpg";
import draft15 from "@/assets/world/drafts/draft-15.jpg";
import draft16 from "@/assets/world/drafts/draft-16.jpg";
import draft17 from "@/assets/world/drafts/draft-17.jpg";
import integrity from "@/assets/world/badges/integrity.png";
import marketplace from "@/assets/world/badges/marketplace.png";
import protocol from "@/assets/world/badges/protocol.png";
import purpose from "@/assets/world/badges/purpose.png";
import supply from "@/assets/world/badges/supply.png";
import tenacity from "@/assets/world/badges/tenacity.png";
import booth01 from "@/assets/world/booth-01.jpg";
import booth02 from "@/assets/world/booth-02.jpg";
import booth05 from "@/assets/world/booth-05.jpg";
import booth06 from "@/assets/world/booth-06.jpg";
import bottles from "@/assets/world/merch/bottles.jpg";
import notebook from "@/assets/world/merch/notebook.jpg";
import originalsCard from "@/assets/world/merch/originals.jpg";
import shirtForce from "@/assets/world/merch/shirt-force.jpg";
import pins from "@/assets/world/pins.jpg";
import posterOffsite from "@/assets/world/poster-offsite.jpg";
import retreatSketch from "@/assets/world/retreat-sketch.jpg";
import seriesBBanner from "@/assets/world/seriesb-banner.jpg";
import shirt from "@/assets/world/shirt.jpg";
import stamp from "@/assets/world/stamp.jpg";
import treeTrace from "@/assets/world/tree-trace.jpg";
import Image, { type StaticImageData } from "next/image";
import { Clip, HALF, Shot } from "../_components/shot";
import { Slider } from "../_components/slider";
import { Band, ChapterDivider, Row, Section } from "../_components/story";

// The 2024 booth, both directions, in a row that scrolls sideways.
const BOOTH = [
  { src: booth01, alt: "Booth render: 'See carbon in action' over aerial forest, with a Pachama counter" },
  { src: booth06, alt: "Booth render: the same wall with a river through wetland" },
  { src: booth02, alt: "Booth render: 'Carbon in action' over a misty forest" },
  { src: booth05, alt: "Booth render: 'Restoring balance' on a light wall with a rainbow tree" },
] as const;
const SLIDE = "(min-width: 1376px) 830px, (min-width: 1024px) 64vw, (min-width: 640px) 72vw, 86vw";

// The poster and its drawing side by side at the same height: their
// columns follow their shapes (1500 x 2123 and 960 x 956).
// The banner and its timelapse side by side, the same size: the timelapse
// was exported squeezed into a square, so it's stretched back to the
// banner's shape.
const SAME_HEIGHT = "grid items-start gap-4 sm:grid-cols-2 sm:gap-6";
const POSTER = "(min-width: 1376px) 636px, (min-width: 640px) 50vw, 100vw";

// The Series B banner's drafts, every artboard of the Illustrator file
// before the final one (one exact repeat left out), in the order drawn.
const DRAFTS = [
  { src: draft01, alt: "A draft in thin type on white: $55M Series B, led by Future Positive, then the investors" },
  { src: draft02, alt: "A draft in heavy black type on white" },
  { src: draft03, alt: "A draft in thin type on white, set tighter" },
  { src: draft04, alt: "A draft with the figure curving over a green planet under a blue sky" },
  { src: draft05, alt: "A draft in heavy type over a dark silhouette of redwoods" },
  { src: draft06, alt: "A draft in thin type over a misty redwood forest" },
  { src: draft07, alt: "A draft in thin type over the misty redwoods, lighter" },
  { src: draft08, alt: "A draft in heavy type over a forest and mountains" },
  { src: draft09, alt: "A dark draft with a teal moon and the text in mono" },
  { src: draft10, alt: "A dark draft with the figure running in a ring" },
  { src: draft11, alt: "A dark draft with a teal moon and the text in two columns" },
  { src: draft12, alt: "A draft in thin type over a green forest fading to pale" },
  { src: draft13, alt: "A dark draft in mono over a wireframe landscape" },
  { src: draft14, alt: "A draft in heavy type, a yellow sun rising over mountains at night" },
  { src: draft15, alt: "A draft in thin type under a yellow sun over a forest" },
  { src: draft16, alt: "A draft with the figure over a blue-green Earth" },
  { src: draft17, alt: "A draft in red and green, illustrated redwoods" },
];
const DRAFT = "(min-width: 1024px) 22vw, (min-width: 640px) 34vw, 58vw";

// The trees out in the world, at one height in a sideways row: the shirts,
// the 2024 notebook and the bottles, from the Brand Assets file.
const MERCH = [
  { src: shirtForce, alt: "'Be a force of nature' on the front of a white shirt, the Originals trees on the back" },
  { src: shirt, alt: "A white t-shirt with a lidar tree in the spectrum's colours" },
  { src: notebook, alt: "The 2024 notebook: a lidar tree in the spectrum's colours on black, flat and as a hardcover on green" },
  { src: bottles, alt: "Two white bottles printed with the lidar tree and the Pachama logo" },
];

// The 2022 offsite's badges: the three teams, then the four values.
type Badge = { src: StaticImageData; name: string };
const TEAMS: readonly Badge[] = [
  { src: protocol, name: "Protocol" },
  { src: marketplace, name: "Marketplace" },
  { src: supply, name: "Supply" },
];
const VALUES: readonly Badge[] = [
  { src: purpose, name: "Purpose" },
  { src: integrity, name: "Integrity" },
  { src: tenacity, name: "Tenacity" },
  { src: excellence, name: "Excellence" },
];

/** A row of badges on the shared sheet, all at one height; they land like
 *  stickers as they come into view. */
const BadgeRow = ({ label, badges, className }: { label: string; badges: readonly Badge[]; className?: string }) => (
  <div className={className}>
    <p className="type-label text-body">{label}</p>
    <ul data-stagger className="mt-8 flex flex-wrap items-center justify-around gap-x-8 gap-y-10">
      {badges.map(({ src, name }) => (
        <li key={name} data-reveal="pop">
          <Image src={src} alt={`The ${name} badge`} sizes="(min-width: 640px) 176px, 128px" className="h-32 w-auto sm:h-44" />
        </li>
      ))}
    </ul>
  </div>
);

/* V · In the world: the brand off the screen, and the things Alejandro drew
 * for the people inside it. Everything here is in Dropbox /Pachama; the
 * photographs are Pachama's. */
export const World = () => (
  <>
    <Band tone="ground">
      <ChapterDivider id="world" numeral="V" title="In the world">
        The brand off the screen: a booth, a banner for the Series B, a retreat, badges, swag and a restored&nbsp;forest.
      </ChapterDivider>

      <Section id="booth" eyebrow="Events" title="The 2024 booth" text="Two directions for the stand: See carbon in action, and Restoring balance.">
        <div data-reveal="frame">
          <Slider label="The 2024 booth, four renders" slides={BOOTH} sizes={SLIDE} />
        </div>
      </Section>

      <Section
        id="series-b"
        eyebrow="Series B, 2022"
        title="A banner for $55 million"
        text="Drawn for the party when Pachama closed its Series B: redwoods, light through the canopy and every investor's name. The timelapse is the drawing, from the first trunk to the type."
      >
        <div data-stagger className={SAME_HEIGHT}>
          <Shot src={seriesBBanner} alt="The Series B banner: '$55M Series B, led by Future Positive', the investors' names, framed by red redwood trunks" sizes={POSTER} />
          <Clip
            name="seriesb-timelapse"
            label="A timelapse of the banner being drawn: trunks, then the canopy and light, then the type"
            aspect="aspect-[1500/2123] object-fill"
            caption="The drawing, six times faster."
          />
        </div>
        <p data-reveal className="type-label mt-16 text-(--tone-label)">
          Drafts, April 2022
        </p>
        <Slider label="The banner's drafts, April 2022" slides={DRAFTS} sizes={DRAFT} item="w-[58%] sm:w-[34%] lg:w-[22%]" className="mt-5" />
      </Section>

      <Section
        id="retreat"
        eyebrow="All-team retreat, 2024"
        title="Time of renewal"
        text="From a page in the sketchbook to the poster for Mendocino: redwoods, a fire, everyone around it."
      >
        <Row className="items-start">
          <Shot src={retreatSketch} alt="A sketchbook spread: the retreat poster and badge ideas drawn in pen" sizes={HALF} caption="The sketchbook." />
          <Shot src={posterOffsite} alt="The retreat poster: 'Time of renewal, all-team retreat 2024' over the campfire illustration" sizes={HALF} caption="The poster." />
        </Row>
      </Section>

    </Band>

    {/* The badges were drawn for white, so their whole section is white: one
     * ground, heading and stickers alike. */}
    <Band tone="paper" className="bg-white">
      <Section
        id="badges"
        eyebrow="Offsite, 2022"
        title="A badge for every team and every value"
        text="Protocol, Marketplace and Supply for the teams; Purpose, Integrity, Tenacity and Excellence for what Pachama stood for."
      >
        <BadgeRow label="The teams" badges={TEAMS} />
        <BadgeRow label="The values" badges={VALUES} className="mt-12 border-t border-rule pt-10" />
      </Section>
    </Band>

    <Band tone="ground">

      <Section
        id="trees"
        eyebrow="Pachama Originals"
        title="Trees drawn from lidar"
        text="A photo, then a point cloud, then a tree of dots in the spectrum's colours: six trees from the projects, each with its country. Then out into the world, on shirts, a notebook and bottles."
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- the series' own logo, as SVG */}
        <img src="/brand/originals-white.svg" alt="Pachama Originals" className="mb-10 h-9 w-auto" />
        <Row className="items-start">
          <Shot src={treeTrace} alt="A tree photographed, then traced into a vector of coloured dots" caption="From photo to trace." sizes={HALF} />
          <Shot
            src={originalsCard}
            alt="Pachama Originals: six lidar trees in dots, a guanacaste and a kapok, a brazilwood, a tualang, a sequoia and another guanacaste, each with its country"
            caption="The six trees, from Costa Rica, Colombia, Brazil, Indonesia and the USA."
            sizes={HALF}
          />
        </Row>
        <Slider
          label="The trees on shirts, a notebook and bottles"
          slides={MERCH}
          sizes="(min-width: 640px) 40rem, 90vw"
          item="h-64 sm:h-80 lg:h-[26rem]"
          image="h-full w-auto"
          className="mt-10"
        />
      </Section>

      <Section id="small-things" eyebrow="Small things" title="Pins and a stamp">
        <Row>
          <Shot src={pins} alt="Two hexagon pins of the Pachama mark, one in the spectrum's colours, one in silver" sizes={HALF} />
          <Shot src={stamp} alt="A rubber stamp printing the Nature Positive seal" sizes={HALF} />
        </Row>
      </Section>
    </Band>
  </>
);
