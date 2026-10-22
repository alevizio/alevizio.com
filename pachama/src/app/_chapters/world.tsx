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
import sequoia from "@/assets/world/sequoia-mauve.png";
import shirtPair from "@/assets/world/shirt-pair.jpg";
import shirt from "@/assets/world/shirt.jpg";
import stamp from "@/assets/world/stamp.jpg";
import treeTrace from "@/assets/world/tree-trace.jpg";
import values from "@/assets/world/values.png";
import { HALF, QUARTER, Shot, THIRD } from "../_components/shot";
import { Band, ChapterDivider, Row, Section } from "../_components/story";

/* V · In the world: the brand off the screen. Everything here is in
 * Dropbox /Pachama; the photographers are to credit. */
export const World = () => (
  <Band tone="ground">
    <ChapterDivider id="world" numeral="V" title="In the world">
      The brand off the screen: a booth, posters, swag and a field trip to a restored&nbsp;forest.
    </ChapterDivider>

    <Section id="booth" eyebrow="Events" title="The 2024 booth" text="Two directions for the stand: See carbon in action, and Restoring balance.">
      <Row>
        <Shot src={booth01} alt="Booth render: 'See carbon in action' over aerial forest, with a Pachama counter" sizes={HALF} />
        <Shot src={booth06} alt="Booth render: the same wall with a river through wetland" sizes={HALF} />
        <Shot src={booth02} alt="Booth render: 'Carbon in action' over a misty forest" sizes={HALF} />
        <Shot src={booth05} alt="Booth render: 'Restoring balance' on a light wall with a rainbow tree" sizes={HALF} />
      </Row>
    </Section>

    <Section id="print" eyebrow="Print" title="Posters" text="The Series B party in 2022, and the 2024 offsite.">
      <Row cols={4}>
        <Shot src={posterForest} alt="Series B poster: '$55M Series B, Future Positive' over a forest silhouette" sizes={QUARTER} />
        <Shot src={posterRedwoods} alt="Series B poster in red and green, illustrated redwoods" sizes={QUARTER} />
        <Shot src={posterEarth} alt="Series B poster in blue and green, like a map of the Earth" sizes={QUARTER} />
        <Shot src={posterOffsite} alt="2024 offsite poster: 'Time of renewal', people around a fire among redwoods" sizes={QUARTER} />
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

    <Section id="small-things" eyebrow="Small things" title="Pins, a stamp, the values">
      <Row cols={3}>
        <Shot src={pins} alt="Two hexagon pins of the Pachama mark, one in the spectrum's colours, one in silver" sizes={THIRD} />
        <Shot src={stamp} alt="A rubber stamp printing the Nature Positive seal" sizes={THIRD} />
        <Shot src={values} alt="Four stickers of the company values: purpose, integrity, excellence, tenacity" sizes={THIRD} />
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
