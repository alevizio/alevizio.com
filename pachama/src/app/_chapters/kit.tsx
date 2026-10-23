import { BanyanCover } from "../_components/banyan/cover";
import { ComponentGallery } from "../_components/banyan/gallery";
import { DocWall } from "../_components/banyan/wall";
import { CountUp } from "../_components/count-up";
import { Band, ChapterDivider, Section } from "../_components/story";

/* III · Banyan, the design system Alejandro designed for Pachama's products:
 * its Figma cover and every documentation page up top, then each family
 * rebuilt live from the Figma, in Banyan's own order. */
const COUNTS = [
  { value: 37, label: "documented pages" },
  { value: 261, label: "button variants" },
  { value: 1310, label: "icons" },
  { value: 8, label: "colour ramps" },
];

export const Kit = () => (
  <Band tone="banyan" className="border-t border-rule">
    <ChapterDivider id="kit" numeral="III" title="Banyan">
      The design system behind Pachama&rsquo;s products. I designed it and documented every component in Figma; Pachama&rsquo;s engineers built
      the same components in code. Rebuilt here from the Figma, and&nbsp;working.
    </ChapterDivider>

    <Section
      id="kit-all"
      eyebrow="The system"
      title="One library, documented page by page"
      text="From getting started to the tooltip, every page of the documentation is below, side by side as the Figma lays them out. Each group jumps to its components."
    >
      <BanyanCover />
      <dl data-stagger className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {COUNTS.map(({ value, label }) => (
          <div key={label} data-reveal className="border-t border-(--tone-line) pt-4">
            <dt className="type-label text-(--tone-label)">{label}</dt>
            <dd className="type-section mt-2 text-(--tone-head)">
              <CountUp value={value} />
            </dd>
          </div>
        ))}
      </dl>
      <DocWall className="mt-10" />
    </Section>

    <Section
      id="components"
      eyebrow="Every component"
      title="The whole library, live"
      text="Every family from the Figma, rebuilt and working, in one place. Use them: the buttons press, the menus open, the map plays."
    >
      <ComponentGallery />
    </Section>
  </Band>
);
