import excellence from "@/assets/world/badges/excellence.png";
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
import kalimantan from "@/assets/world/central-kalimantan-yellow.png";
import corredores41 from "@/assets/world/corredores-41.jpg";
import corredores43 from "@/assets/world/corredores-43.jpg";
import corredores45 from "@/assets/world/corredores-45.jpg";
import corredores47 from "@/assets/world/corredores-47.jpg";
import costaRica from "@/assets/world/costarica-tree-blue.png";
import kapok from "@/assets/world/kapok-tree-green.png";
import pins from "@/assets/world/pins.jpg";
import posterEarth from "@/assets/world/poster-earth.jpg";
import posterForest from "@/assets/world/poster-forest.jpg";
import posterOffsite from "@/assets/world/poster-offsite.jpg";
import posterRedwoods from "@/assets/world/poster-redwoods.jpg";
import retreatSketch from "@/assets/world/retreat-sketch.jpg";
import seriesBBanner from "@/assets/world/seriesb-banner.jpg";
import sequoia from "@/assets/world/sequoia-mauve.png";
import shirtPair from "@/assets/world/shirt-pair.jpg";
import shirt from "@/assets/world/shirt.jpg";
import stamp from "@/assets/world/stamp.jpg";
import treeTrace from "@/assets/world/tree-trace.jpg";
import Image, { type StaticImageData } from "next/image";
import { Clip, HALF, QUARTER, Shot, THIRD } from "../_components/shot";
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
const SAME_HEIGHT = "grid items-start gap-4 sm:grid-cols-[0.7066fr_1.0042fr] sm:gap-6";
const POSTER = "(min-width: 1376px) 525px, (min-width: 640px) 41vw, 100vw";

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
            aspect="aspect-[960/956]"
            caption="The drawing, six times faster."
          />
        </div>
        <p data-reveal className="type-label mt-16 text-(--tone-label)">
          Drafts, April 2022
        </p>
        <Row cols={3} className="mt-5">
          <Shot src={posterForest} alt="A draft: the type over a pale forest silhouette" sizes={THIRD} />
          <Shot src={posterRedwoods} alt="A draft in red and green, illustrated redwoods" sizes={THIRD} />
          <Shot src={posterEarth} alt="A draft in blue and green, like a map of the Earth" sizes={THIRD} />
        </Row>
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
        text="A photo, then a point cloud, then a tree of dots in the spectrum's colours: a kapok, a sequoia, a guanacaste. Printed on shirts, worn at the offsite."
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- the series' own logo, as SVG */}
        <img src="/brand/originals-white.svg" alt="Pachama Originals" className="mb-10 h-9 w-auto" />
        <Shot src={treeTrace} alt="A tree photographed, then traced into a vector of coloured dots" caption="From photo to trace." sizes="(min-width: 640px) 48rem, 100vw" className="max-w-[48rem]" />
        <Row cols={4} className="mt-6">
          <Shot src={kapok} alt="The kapok tree, in green dots" sizes={QUARTER} />
          <Shot src={sequoia} alt="The sequoia, in mauve and pink dots" sizes={QUARTER} />
          <Shot src={costaRica} alt="A Costa Rican tree, in blue dots" sizes={QUARTER} />
          <Shot src={kalimantan} alt="A Central Kalimantan tree, in yellow and green dots" sizes={QUARTER} />
        </Row>
        <Row className="mt-6">
          <Shot src={shirt} alt="A white t-shirt with a lidar tree in the spectrum's colours" sizes={HALF} />
          <Shot src={shirtPair} alt="The tree shirt, front and back, on two people" sizes={HALF} />
        </Row>
      </Section>

      <Section id="small-things" eyebrow="Small things" title="Pins and a stamp">
        <Row>
          <Shot src={pins} alt="Two hexagon pins of the Pachama mark, one in the spectrum's colours, one in silver" sizes={HALF} />
          <Shot src={stamp} alt="A rubber stamp printing the Nature Positive seal" sizes={HALF} />
        </Row>
      </Section>

      <Section id="field" eyebrow="In the field" title="Corredores de Vida" text="The restoration behind the lidar: farmland and forest in Brazil. Photos: Pachama.">
        <Shot src={corredores41} alt="A river between stands of forest, from the air" bleed />
        <Row cols={3} className="mt-6">
          <Shot src={corredores45} alt="Forest meeting pasture along a lakeshore, from the air" sizes={THIRD} />
          <Shot src={corredores43} alt="Rows of young trees planted across dry farmland" sizes={THIRD} />
          <Shot src={corredores47} alt="A farmstead with a tree nursery, from the air" sizes={THIRD} />
        </Row>
      </Section>
    </Band>
  </>
);
