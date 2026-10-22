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
import retreatArt from "@/assets/world/retreat-art.jpg";
import retreatSketch from "@/assets/world/retreat-sketch.jpg";
import seriesBBanner from "@/assets/world/seriesb-banner.jpg";
import sequoia from "@/assets/world/sequoia-mauve.png";
import shirtPair from "@/assets/world/shirt-pair.jpg";
import shirt from "@/assets/world/shirt.jpg";
import stamp from "@/assets/world/stamp.jpg";
import treeTrace from "@/assets/world/tree-trace.jpg";
import { Clip, HALF, QUARTER, Shot, THIRD } from "../_components/shot";
import { Band, ChapterDivider, Row, Section } from "../_components/story";

// The 2022 offsite's badges: the three teams, then the four values.
const BADGES = [
  { src: protocol, name: "Protocol" },
  { src: marketplace, name: "Marketplace" },
  { src: supply, name: "Supply" },
  { src: purpose, name: "Purpose" },
  { src: integrity, name: "Integrity" },
  { src: tenacity, name: "Tenacity" },
  { src: excellence, name: "Excellence" },
];

/* V · In the world: the brand off the screen, and the things Alejandro drew
 * for the people inside it. Everything here is in Dropbox /Pachama; the
 * photographers are to credit. */
export const World = () => (
  <Band tone="ground">
    <ChapterDivider id="world" numeral="V" title="In the world">
      The brand off the screen: a booth, a banner for the Series B, a retreat, badges, swag and a restored&nbsp;forest.
    </ChapterDivider>

    <Section id="booth" eyebrow="Events" title="The 2024 booth" text="Two directions for the stand: See carbon in action, and Restoring balance.">
      <Row>
        <Shot src={booth01} alt="Booth render: 'See carbon in action' over aerial forest, with a Pachama counter" sizes={HALF} />
        <Shot src={booth06} alt="Booth render: the same wall with a river through wetland" sizes={HALF} />
        <Shot src={booth02} alt="Booth render: 'Carbon in action' over a misty forest" sizes={HALF} />
        <Shot src={booth05} alt="Booth render: 'Restoring balance' on a light wall with a rainbow tree" sizes={HALF} />
      </Row>
    </Section>

    <Section
      id="series-b"
      eyebrow="Series B, 2022"
      title="A banner for $55 million"
      text="Drawn for the party when Pachama closed its Series B: redwoods, light through the canopy and every investor's name. The timelapse is the drawing, from the first trunk to the type."
    >
      <Row className="items-start">
        <Shot src={seriesBBanner} alt="The Series B banner: '$55M Series B, led by Future Positive', the investors' names, framed by red redwood trunks" sizes={HALF} />
        <Clip
          name="seriesb-timelapse"
          label="A timelapse of the banner being drawn: trunks, then the canopy and light, then the type"
          aspect="aspect-square"
          caption="The drawing, six times faster."
        />
      </Row>
      <Row cols={3} className="mt-6">
        <Shot src={posterForest} alt="A Series B variation: the type over a pale forest silhouette" sizes={THIRD} />
        <Shot src={posterRedwoods} alt="A Series B variation in red and green, illustrated redwoods" sizes={THIRD} />
        <Shot src={posterEarth} alt="A Series B variation in blue and green, like a map of the Earth" sizes={THIRD} />
      </Row>
    </Section>

    <Section
      id="retreat"
      eyebrow="All-team retreat, 2024"
      title="Time of renewal"
      text="From a page in the sketchbook to the poster for Mendocino: redwoods, a fire, everyone around it."
    >
      <Row cols={3} className="items-start">
        <Shot src={retreatSketch} alt="A sketchbook spread: the retreat poster and badge ideas drawn in pen" sizes={THIRD} caption="The sketchbook." />
        <Shot src={retreatArt} alt="The retreat illustration without type: people around a campfire among redwoods" sizes={THIRD} caption="The illustration." />
        <Shot src={posterOffsite} alt="The retreat poster: 'Time of renewal, all-team retreat 2024' over the campfire illustration" sizes={THIRD} caption="The poster." />
      </Row>
    </Section>

    <Section
      id="badges"
      eyebrow="Offsite, 2022"
      title="A badge for every team and every value"
      text="Protocol, Marketplace and Supply for the teams; Purpose, Integrity, Tenacity and Excellence for what Pachama stood for."
    >
      <Row cols={4}>
        {BADGES.map(({ src, name }) => (
          <div key={name} className="rounded-[10px] bg-sheet p-6 sm:p-8">
            <Shot src={src} alt={`The ${name} badge`} sizes={QUARTER} imageClassName="rounded-none" />
          </div>
        ))}
      </Row>
    </Section>

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

    <Section id="field" eyebrow="In the field" title="Corredores de Vida" text="The restoration behind the lidar: farmland and forest in Brazil. Photographer to credit.">
      <Row>
        <Shot src={corredores41} alt="A river between stands of forest, from the air" sizes={HALF} />
        <Shot src={corredores45} alt="Forest meeting pasture along a lakeshore, from the air" sizes={HALF} />
        <Shot src={corredores43} alt="Rows of young trees planted across dry farmland" sizes={HALF} />
        <Shot src={corredores47} alt="A farmstead with a tree nursery, from the air" sizes={HALF} />
      </Row>
    </Section>
  </Band>
);
