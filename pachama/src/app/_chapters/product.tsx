import { ChapterDivider, Section, Slot, SlotRow } from "../_components/story";

/* II · The product: the marketplace and the tools around it. The screens
 * come from Figma (links to ask); public-facing ones only. The components
 * they are built from have their own chapter, III · The kit. */
export const Product = () => (
  <>
    <ChapterDivider id="product" numeral="II" title="The product">
      A marketplace for forest carbon that buyers could trust: every project with its data, its maps and its risks in
      the&nbsp;open.
    </ChapterDivider>

    <Section id="marketplace" eyebrow="The marketplace" title="Finding a project worth buying">
      <Slot label="Project discovery: the list, the filters, the map" source="Figma · link to ask" />
    </Section>

    <Section id="project" eyebrow="Project pages" title="Everything behind a credit">
      <Slot label="A project page, top to bottom" source="Figma · link to ask" aspect="aspect-[16/10]" />
    </Section>

    <Section id="buying" eyebrow="Buying" title="From quote to retirement">
      <SlotRow>
        <Slot label="Checkout" source="Figma · link to ask" aspect="aspect-[4/3]" />
        <Slot label="Orders and the portfolio" source="Figma · Pachama Digital Designs_Delivery_HO (Orders)" aspect="aspect-[4/3]" />
      </SlotRow>
    </Section>

    <Section
      id="sourcing"
      eyebrow="Sourcing"
      title="An RFP platform for the Symbiosis Coalition"
      text="To confirm what's public before it goes in."
    >
      <Slot label="The RFP: screening, submissions, review" source="Figma · link to ask" />
    </Section>
  </>
);
