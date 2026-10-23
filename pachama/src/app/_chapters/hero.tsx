import { CanopyCloud } from "../_components/canopy-cloud";
import { cn } from "../_components/cn";
import { PAGE } from "../_components/story";

// The facts strip under the hero. Draft wording, to confirm.
const FACTS = [
  { label: "Role", value: "Senior product designer" },
  { label: "Timeline", value: "2020 to 2025, five years" },
  { label: "With", value: "Pachama's product, science and engineering teams; How&How and FNDR on the brand" },
  { label: "Outcome", value: "Acquired by Carbon Direct in 2025, now Relae" },
];

/* On black, like the lidar: a forest canopy as a point cloud fills the
 * screen behind the name, swaying and tilting toward the pointer. The
 * screen holds while the page scrolls (the runway), the camera swings
 * overhead and the heights flatten until the cloud is a map; the name
 * fades as it does (--flat and data-stage come from CanopyCloud). The
 * still under the canvas shows until the first frame is drawn. */
export const Hero = () => (
  <header className="bg-night text-fog">
    <div data-runway className="group/hero relative h-[190svh] motion-reduce:h-svh">
      <div className="sticky top-0 h-svh overflow-hidden">
        <CanopyCloud className="absolute inset-0 bg-[url(/hero/canopy-poster.jpg)] bg-cover bg-center data-ready:bg-none" />
        <div aria-hidden className="spectrum draw absolute inset-x-0 top-0 h-1" />
        <div className={cn(PAGE, "relative z-10 pt-16 opacity-[calc(1-var(--flat,0)*1.5)] sm:pt-24")}>
          <p className="type-label arrive text-leaf [--arrive-delay:0.15s]">Case study · 2020 to 2025</p>
          <h1 className="type-display settle mt-5 [--arrive-delay:0.25s]">Pachama</h1>
          <p className="type-body arrive mt-6 max-w-[38rem] text-haze [--arrive-delay:0.55s]">
            Five years designing how people see forest carbon: the product that sold it, the maps that measured it, and the
            brand around&nbsp;both.
          </p>
        </div>
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-night/90 to-transparent" />
        <div className={cn(PAGE, "absolute inset-x-0 bottom-0 z-10 grid pb-6")}>
          <p className="type-label arrive col-start-1 row-start-1 text-haze transition-opacity duration-500 [--arrive-delay:1s] group-data-[stage=map]/hero:opacity-0">
            Canopy height over Pará, Brazil, from lidar · move to tilt, scroll to flatten
          </p>
          <p className="type-label col-start-1 row-start-1 text-haze opacity-0 transition-opacity duration-500 group-data-[stage=map]/hero:opacity-100">
            Flattened, the heights turn into a map
          </p>
        </div>
      </div>
    </div>
    <dl data-stagger className={cn(PAGE, "grid gap-x-6 gap-y-8 pt-14 pb-20 sm:grid-cols-2 sm:pb-28 lg:grid-cols-4")}>
      {FACTS.map(({ label, value }) => (
        <div key={label} data-reveal className="border-t border-white/15 pt-4">
          <dt className="type-label text-haze">{label}</dt>
          <dd className="type-caption mt-2 text-fog">{value}</dd>
        </div>
      ))}
    </dl>
  </header>
);
