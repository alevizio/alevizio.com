import { BanyanHero } from "../_components/banyan/hero";
import { ComponentMarquee } from "../_components/banyan/marquee";
import { BanyanStructure } from "../_components/banyan/structure";
import { DocWall } from "../_components/banyan/wall";
import { cn } from "../_components/cn";
import { CountUp } from "../_components/count-up";
import { Band, PAGE } from "../_components/story";

/* III · Banyan, the design system Alejandro designed for Pachama's products.
 * It opens on its own cover, live, which is the chapter's title too; then
 * the numbers, every documentation page in one strip, the structure, and
 * a selection of the components on a belt, working. */
const COUNTS = [
  { value: 37, label: "documented pages" },
  { value: 261, label: "button variants" },
  { value: 1310, label: "icons" },
  { value: 8, label: "colour ramps" },
];

export const Kit = () => (
  <Band tone="banyan" className="border-t border-rule">
    <BanyanHero id="kit" />

    <section id="kit-all" data-scene className={cn(PAGE, "scroll-mt-10")}>
      {/* The sections' headings are for screen readers: the page shows the work. */}
      <h3 className="sr-only">The system, documented page by page</h3>
      <dl data-stagger className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {COUNTS.map(({ value, label }) => (
          <div key={label} data-reveal className="border-t border-(--tone-line) pt-4">
            <dt className="type-label text-(--tone-label)">{label}</dt>
            <dd className="type-section mt-2 text-(--tone-head)">
              <CountUp value={value} />
            </dd>
          </div>
        ))}
      </dl>
      <DocWall className="mt-14 sm:mt-20" />
    </section>

    <section id="structure" data-scene className={cn(PAGE, "mt-24 scroll-mt-10 sm:mt-32")}>
      <h3 className="sr-only">How Banyan is put together</h3>
      <BanyanStructure />
    </section>

    <section id="components" data-scene className="mt-24 scroll-mt-10 sm:mt-32">
      <h3 className="sr-only">The components, working</h3>
      <ComponentMarquee />
    </section>
  </Band>
);
