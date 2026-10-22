import { ChapterDivider, Section, Slot, SlotRow } from "../_components/story";

/* III · The kit: every UI element Alejandro built for Pachama, first all at
 * once, then family by family. The screens are in the design-system file in
 * Figma (link to ask); the loader and the empty state are in Dropbox. */

// The kit in numbers, to fill in from the Figma library.
const COUNTS = [
  { value: "—", label: "components" },
  { value: "—", label: "variants" },
  { value: "—", label: "screens built from them" },
];

export const Kit = () => (
  <>
    <ChapterDivider id="kit" numeral="III" title="The kit">
      Every piece the product is built from, designed once and used everywhere: the site, the marketplace and the&nbsp;maps.
    </ChapterDivider>

    <Section id="kit-all" eyebrow="Every component" title="The whole kit on one page">
      <Slot label="Every component on one canvas, zoomed out" source="Figma · design system file, link to ask" aspect="aspect-[21/9]" />
      <dl className="mt-10 grid grid-cols-3 gap-6">
        {COUNTS.map(({ value, label }) => (
          <div key={label}>
            <dt className="type-label text-muted">{label}</dt>
            <dd className="type-section mt-2 text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </Section>

    <Section id="foundations" eyebrow="Foundations" title="Colour, type, space and depth">
      <SlotRow>
        <Slot label="Colour tokens and type scale" source="Figma · link to ask" aspect="aspect-[4/3]" />
        <Slot label="Spacing, radii, elevation, grid" source="Figma · link to ask" aspect="aspect-[4/3]" />
      </SlotRow>
    </Section>

    <Section id="controls" eyebrow="Controls" title="Buttons, fields, selects and toggles">
      <SlotRow cols={3}>
        <Slot label="Buttons, every size and state" source="Figma · link to ask" aspect="aspect-[4/3]" />
        <Slot label="Text fields, search, selects" source="Figma · link to ask" aspect="aspect-[4/3]" />
        <Slot label="Checkboxes, radios, toggles, sliders" source="Figma · link to ask" aspect="aspect-[4/3]" />
      </SlotRow>
    </Section>

    <Section id="data" eyebrow="Data" title="Tables, numbers and charts">
      <SlotRow cols={3}>
        <Slot label="Data tables" source="Figma · link to ask" aspect="aspect-[4/3]" />
        <Slot label="Stats and key numbers" source="Figma · link to ask" aspect="aspect-[4/3]" />
        <Slot label="Charts: carbon over time, baselines" source="Figma · link to ask" aspect="aspect-[4/3]" />
      </SlotRow>
    </Section>

    <Section id="cards" eyebrow="Cards" title="Projects, credits and orders">
      <SlotRow cols={3}>
        <Slot label="The project card" source="Figma · link to ask" aspect="aspect-[3/4]" />
        <Slot label="Credits and retirements" source="Figma · link to ask" aspect="aspect-[3/4]" />
        <Slot label="Order rows and summaries" source="Figma · link to ask" aspect="aspect-[3/4]" />
      </SlotRow>
    </Section>

    <Section id="map-kit" eyebrow="Map controls" title="Layers, legends and the time slider">
      <SlotRow cols={3}>
        <Slot label="The layer panel" source="Figma · link to ask" aspect="aspect-[3/4]" />
        <Slot label="Legends and scales" source="Figma · link to ask" aspect="aspect-[3/4]" />
        <Slot label="Time slider, zoom, basemaps" source="Figma · link to ask" aspect="aspect-[3/4]" />
      </SlotRow>
    </Section>

    <Section id="navigation" eyebrow="Navigation" title="Bars, tabs and menus">
      <SlotRow>
        <Slot label="The top bar, the side nav" source="Figma · link to ask" aspect="aspect-[4/3]" />
        <Slot label="Tabs, breadcrumbs, menus" source="Figma · link to ask" aspect="aspect-[4/3]" />
      </SlotRow>
    </Section>

    <Section id="states" eyebrow="Feedback and states" title="Toasts, dialogs, loaders and empty pages">
      <SlotRow cols={3}>
        <Slot label="Toasts and dialogs" source="Figma · link to ask" aspect="aspect-[4/3]" />
        <Slot label="The loader" source="Dropbox /Pachama/Loader/loader.psd" aspect="aspect-[4/3]" />
        <Slot label="Empty states: no orders yet" source="Dropbox /Pachama/Hand Over/04_Figma handover/Orders Empty.png" aspect="aspect-[4/3]" />
      </SlotRow>
    </Section>

    <Section id="icons" eyebrow="Icons" title="The icon set">
      <Slot label="Every icon, at size" source="Figma · link to ask" aspect="aspect-[21/9]" />
    </Section>
  </>
);
