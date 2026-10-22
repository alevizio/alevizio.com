import { ChapterDivider, Section, Slot, SlotRow } from "../_components/story";

/* I · The brand: FNDR's strategy, How&How's identity, and carrying it into
 * everything Pachama made. The identity is How&How's; the chapter credits it
 * as theirs and shows the in-house part as mine (to confirm with Alejandro). */
export const Brand = () => (
  <>
    <ChapterDivider id="brand" numeral="I" title="The brand">
      From FNDR&apos;s strategy to How&amp;How&apos;s identity: seeing carbon in action, carried into everything Pachama&nbsp;made.
    </ChapterDivider>

    <Section
      id="before"
      eyebrow="Where it started"
      title="A climate startup that looked like one"
      text="Recoleta, Proxima Nova and a lot of green. The audit that made the case for starting again."
    >
      <Slot
        label="The old identity next to the brand audit"
        source="Dropbox /Pachama/Brand/Pachama Brand Audit.pdf · check what's internal"
      />
    </Section>

    <Section
      id="idea"
      eyebrow="The idea"
      title="Seeing carbon in action"
      text="FNDR's strategy: nature and data, heart and head, in one company. How&How turned it into a graphic language for the site and the product."
    >
      <Slot
        label="The idea in one spread: the line, the references, the first marks"
        source="Dropbox /Branding/Pachama x FNDR x How&How _ Design Briefing.pdf · internal, show only what launched"
      />
    </Section>

    <Section
      id="mark"
      eyebrow="The mark"
      title="Circles and hexagons, a flower and a leaf"
      text="Formal geometry overlapping like a Venn diagram: nature, technology and community."
    >
      <Slot label="The mark's construction, then the lockups" source="Figma · Pachama_Brand Guidelines_HO (Dropbox /Pachama/Hand Over)" />
    </Section>

    <Section
      id="grids"
      eyebrow="The grids"
      title="A dot grid and a hex grid"
      text="The patterns that carry the mark into maps, backgrounds and motion."
    >
      <SlotRow>
        <Slot label="The dot grid" source="Dropbox /Pachama/PACHAMA_DOT GRID MASTER.ai" aspect="aspect-square" />
        <Slot label="The hex grid" source="Dropbox /Pachama/PACHAMA_HEX GRID MASTER.ai" aspect="aspect-square" />
      </SlotRow>
    </Section>

    <Section id="colour-type" eyebrow="Colour and type" title="Matter, Matter Mono and a forest of greens">
      <SlotRow>
        <Slot label="The palette" source="Figma · Pachama_Brand Guidelines_HO" aspect="aspect-[4/3]" />
        <Slot label="Matter and Matter Mono, set" source="Figma · Pachama_Brand Guidelines_HO" aspect="aspect-[4/3]" />
      </SlotRow>
    </Section>

    <Section
      id="rollout"
      eyebrow="My part"
      title="Taking it in-house"
      text="To confirm: the brief, the rollout into the product, the Figma brand library, and everything printed."
    >
      <Slot label="The brand library in Figma: components, patterns, templates" source="Figma · Pachama_Brand Library_HO" />
    </Section>
  </>
);
