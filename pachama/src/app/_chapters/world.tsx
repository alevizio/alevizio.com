import { ChapterDivider, Section, Slot, SlotRow } from "../_components/story";

/* IV · In the world: the brand off the screen. Everything here is in
 * Dropbox /Pachama; photographers to credit. */
export const World = () => (
  <>
    <ChapterDivider id="world" numeral="IV" title="In the world">
      The brand off the screen: a booth, posters, swag and a field trip to a restored&nbsp;forest.
    </ChapterDivider>

    <Section id="booth" eyebrow="Events" title="The 2024 booth">
      <Slot label="The booth, built" source="Dropbox /Pachama/Booth 2024" aspect="aspect-[21/9]" />
    </Section>

    <Section id="print" eyebrow="Print" title="Posters and swag">
      <SlotRow>
        <Slot label="Posters" source="Dropbox /Pachama/Poster" aspect="aspect-[4/5]" />
        <Slot label="Swag" source="Dropbox /Pachama/Swag" aspect="aspect-[4/5]" />
      </SlotRow>
    </Section>

    <Section id="cards" eyebrow="Small things" title="Badges and business cards">
      <SlotRow>
        <Slot label="Badges" source="Dropbox /Pachama/Badge" aspect="aspect-[4/3]" />
        <Slot label="Business cards" source="Dropbox /Pachama/Business Cards Pachama" aspect="aspect-[4/3]" />
      </SlotRow>
    </Section>

    <Section id="field" eyebrow="In the field" title="Corridors of Life" text="Photographer to credit.">
      <SlotRow cols={3}>
        <Slot label="Hero shot" source="Dropbox /Pachama/Corridors for life/Hero shots meli" aspect="aspect-[3/4]" />
        <Slot label="The corridor" source="Dropbox /Pachama/Corridors for life/Pics" aspect="aspect-[3/4]" />
        <Slot label="The Nature Corridor brochure" source="Dropbox /Pachama/Nature Corridor" aspect="aspect-[3/4]" />
      </SlotRow>
    </Section>
  </>
);
