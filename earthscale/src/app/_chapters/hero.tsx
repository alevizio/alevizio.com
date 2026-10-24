import { cn } from "../_components/cn";
import { Globe } from "../_components/globe";
import { GlobeControls } from "../_components/globe-controls";
import { PAGE } from "../_components/story";

// The facts strip under the hero. Draft wording, to confirm.
const FACTS = [
  { label: "Role", value: "Product and brand designer" },
  { label: "Timeline", value: "Spring 2025" },
  { label: "With", value: "Earthscale’s founders, Felix Dorrek and Noah Golmant" },
  { label: "Outcome", value: "Live at earthscale.ai from May 2025" },
];

/* The page's own globe, live: the product's renders of the world under a
 * wind field and under temperature, wrapped on a sphere by the GPU and
 * turning (Globe), bigger than the screen: its top and its glow whole
 * under the hero's top, its sides past the screen's, its lower part
 * dissolving into the page under the name. It opens flat, higher up,
 * above the name: the map scans
 * in, pans, and curls into the globe, and then the product's own
 * visualisation panel arrives at the top right to pick the band and the
 * colour ramp. The name sits over its foot on the left, on a fade to the
 * page's green, a mint hairline draws across the top as the words
 * arrive. Where there is no WebGL the black and the fade stay, and the
 * name holds the hero. The fade interpolates in sRGB: in oklab WebKit
 * paints the transparent end dark. The text column lets the pointer
 * through to the globe; only the panel takes it. */
export const Hero = () => (
  <header className="bg-night text-mist">
    <div className="relative overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Globe intro className="absolute top-0 left-1/2 w-[112vw] -translate-x-1/2 max-sm:top-[2%] max-sm:w-[170vw]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[64%] bg-linear-to-t/srgb from-night from-24% via-night/80 via-58% to-night/0" />
      </div>
      <div aria-hidden className="draw pointer-events-none absolute inset-x-0 top-0 h-px bg-mint/70" />
      <div className={cn(PAGE, "pointer-events-none relative z-10 flex min-h-svh flex-col justify-end pt-24 pb-16 sm:pb-24")}>
        <p className="type-label arrive text-mint [--arrive-delay:0.15s]">Case study · 2025</p>
        <h1 className="type-display settle mt-5 [--arrive-delay:0.25s]">Earthscale</h1>
        <p className="type-body arrive mt-6 max-w-[38rem] text-text [--arrive-delay:0.55s]">
          A landing page for a developer platform for Earth intelligence: the brief, the structure, the look, and the
          page that shipped, on every&nbsp;screen.
        </p>
        <GlobeControls className="pointer-events-auto mt-10 w-full max-w-[20rem] sm:absolute sm:top-20 sm:right-10 sm:mt-0" />
      </div>
    </div>
    <dl data-stagger className={cn(PAGE, "grid gap-x-6 gap-y-8 pt-14 pb-20 sm:grid-cols-2 sm:pb-28 lg:grid-cols-4")}>
      {FACTS.map(({ label, value }) => (
        <div key={label} data-reveal className="border-t border-rule pt-4">
          <dt className="type-label text-haze">{label}</dt>
          <dd className="type-caption mt-2 text-mist">{value}</dd>
        </div>
      ))}
    </dl>
  </header>
);
