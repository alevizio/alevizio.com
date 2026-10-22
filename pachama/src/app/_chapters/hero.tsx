import { cn } from "../_components/cn";
import { PAGE } from "../_components/story";
import { VideoLoop } from "../_components/video-loop";

// The facts strip under the hero. Draft wording, to confirm.
const FACTS = [
  { label: "Role", value: "Product designer, then senior product designer" },
  { label: "Timeline", value: "2020 to 2025, five years" },
  { label: "With", value: "Pachama's product, science and engineering teams; How&How and FNDR on the brand" },
  { label: "Outcome", value: "Acquired by Carbon Direct in 2025, now Relae" },
];

/* On black, so the terrain render's own black ground runs into the page:
 * the spectrum along the top, the name in the brand's capitals, then the
 * lidar elevation of Fazenda Vida turning slowly. From lg the video rises
 * under the title, into the render's empty black top. */
export const Hero = () => (
  <header className="bg-night pb-20 text-fog sm:pb-28">
    <div aria-hidden className="spectrum h-1 w-full" />
    <div className={cn(PAGE, "relative z-10 pt-16 sm:pt-24")}>
      <p className="type-label text-leaf">Case study · 2020 to 2025</p>
      <h1 className="type-display mt-5">Pachama</h1>
      <p className="type-body mt-6 max-w-[38rem] text-haze">
        Five years designing how people see forest carbon: the product that sold it, the maps that measured it, and the
        brand around&nbsp;both.
      </p>
    </div>
    <figure className="mt-8 lg:-mt-48">
      <VideoLoop
        src="/video/terrain.mp4"
        poster="/video/terrain.jpg"
        label="The lidar elevation of Fazenda Vida, Brazil, turning slowly"
        className="mx-auto block aspect-[1600/930] w-full max-w-[110rem]"
      />
      <figcaption className={cn(PAGE, "type-label text-haze")}>Fazenda Vida, Brazil · lidar elevation · Corridors of Life</figcaption>
    </figure>
    <dl className={cn(PAGE, "mt-14 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4")}>
      {FACTS.map(({ label, value }) => (
        <div key={label} className="border-t border-white/15 pt-4">
          <dt className="type-label text-haze">{label}</dt>
          <dd className="type-caption mt-2 text-fog">{value}</dd>
        </div>
      ))}
    </dl>
  </header>
);
