import { cn } from "../_components/cn";
import { PAGE, Slot } from "../_components/story";

// The facts strip under the hero. Draft wording, to confirm.
const FACTS = [
  { label: "Role", value: "Product designer, then senior product designer" },
  { label: "Timeline", value: "2020 to 2025, five years" },
  { label: "With", value: "Pachama's product, science and engineering teams; How&How and FNDR on the brand" },
  { label: "Outcome", value: "Acquired by Carbon Direct in 2025, now Relae" },
];

export const Hero = () => (
  <header className="pt-24 sm:pt-32">
    <div className={PAGE}>
      <p className="type-label text-leaf">Case study · 2020 to 2025</p>
      <h1 className="type-display mt-5">Pachama</h1>
      <p className="type-body mt-6 max-w-[38rem] text-body">
        Five years designing how people see forest carbon: the product that sold it, the maps that measured it, and the
        brand around&nbsp;both.
      </p>
    </div>
    <div className={cn(PAGE, "mt-12")}>
      <Slot
        label="Hero: a lidar flight over the Corridors of Life restoration, looping"
        source="Dropbox /Pachama/corridors_of_life_lidar_rgb.mp4"
        aspect="aspect-[21/9]"
      />
    </div>
    <dl className={cn(PAGE, "mt-12 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4")}>
      {FACTS.map(({ label, value }) => (
        <div key={label}>
          <dt className="type-label text-muted">{label}</dt>
          <dd className="type-caption mt-2 text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  </header>
);
