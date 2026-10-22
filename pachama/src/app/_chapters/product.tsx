import evaluation from "@/assets/product/evaluation.png";
import ordersEmpty from "@/assets/product/orders-empty.png";
import { HALF, Shot } from "../_components/shot";
import { Band, ChapterDivider, Row, Section, Slot } from "../_components/story";

/* II · The product, on the product's own light grey: the marketplace and
 * the tools around it. Public-facing screens only; the client's name on the
 * Orders screen is blurred. The components have their own chapter, III. */
export const Product = () => (
  <Band tone="paper">
    <ChapterDivider id="product" numeral="II" title="The product">
      A marketplace for forest carbon that buyers could trust: every project with its data, its maps and its risks in
      the&nbsp;open.
    </ChapterDivider>

    <Section id="marketplace" eyebrow="The marketplace" title="Finding a project worth buying">
      <Slot label="Project discovery: the list, the filters, the map" source="Figma · link to ask" />
    </Section>

    <Section
      id="project"
      eyebrow="Project pages"
      title="Every credit, checked"
      text="Manoa's evaluation: five quality checks, the reference region on the map, and the baseline set against what Pachama's satellites saw."
    >
      <Shot
        src={evaluation}
        alt="Manoa's evaluation page: the project's facts, five quality checks, a reference-region map and a baseline chart, both marked Pass"
        imageClassName="ring-1 ring-black/5 shadow-[0_24px_80px_rgb(20_26_23/0.12)]"
      />
    </Section>

    <Section
      id="buying"
      eyebrow="Buying"
      title="From order to retirement"
      text="Explore, orders, retirement and impact, one account away. Empty, the Orders page points back to the projects."
    >
      <Row>
        <Shot
          src={ordersEmpty}
          alt="The Orders page, empty: 'No orders yet' and a button to explore projects"
          sizes={HALF}
          imageClassName="ring-1 ring-black/5 shadow-[0_24px_80px_rgb(20_26_23/0.12)]"
        />
        <Slot label="Checkout, and a retirement certificate" source="Figma · link to ask" aspect="aspect-[1440/1024]" />
      </Row>
    </Section>

    <Section
      id="sourcing"
      eyebrow="Sourcing"
      title="An RFP platform for the Symbiosis Coalition"
      text="To confirm what's public before it goes in."
    >
      <Slot label="The RFP: screening, submissions, review" source="Figma · link to ask" />
    </Section>
  </Band>
);
