import { cn } from "../_components/cn";
import { Globe } from "../_components/globe";
import { PAGE } from "../_components/story";

// The facts strip under the hero. Draft wording, to confirm.
const FACTS = [
  { label: "Role", value: "Product and brand designer" },
  { label: "Timeline", value: "Spring 2025" },
  { label: "With", value: "Earthscale’s founders, Felix Dorrek and Noah Golmant" },
  { label: "Outcome", value: "Live at earthscale.ai from May 2025" },
];

/* The page's own globe, live: the product's render of the world under a
 * wind field, wrapped on a sphere by the GPU and turning (Globe), big and
 * off to the right so its limb and its halo arc through the screen, as
 * the landing page's hero cropped its planet. Where there is no WebGL the
 * black and the gradients stay, and the name holds the hero. The name
 * sits over it on the left, a mint hairline draws across the top as the
 * words arrive, and the hero dissolves into the page's green where the
 * facts begin. The gradients interpolate in sRGB: in oklab WebKit paints
 * the transparent end dark. */
export const Hero = () => (
  <header className="bg-night text-mist">
    <div className="relative overflow-hidden bg-black">
      <div aria-hidden className="absolute inset-0">
        <Globe className="absolute top-[52%] left-[77%] h-[146%] -translate-x-1/2 -translate-y-1/2 max-sm:top-[32%] max-sm:left-[76%] max-sm:h-[128%]" />
        <div className="absolute inset-0 bg-linear-to-r/srgb from-black from-8% via-black/35 via-45% to-black/0" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t/srgb from-night via-night/70 to-night/0" />
      </div>
      <div aria-hidden className="draw absolute inset-x-0 top-0 h-px bg-mint/70" />
      <div className={cn(PAGE, "relative z-10 flex min-h-[88svh] flex-col justify-end pt-24 pb-16 sm:pb-24")}>
        <p className="type-label arrive text-mint [--arrive-delay:0.15s]">Case study · 2025</p>
        <h1 className="type-display settle mt-5 [--arrive-delay:0.25s]">Earthscale</h1>
        <p className="type-body arrive mt-6 max-w-[38rem] text-text [--arrive-delay:0.55s]">
          A landing page for a developer platform for Earth intelligence: the brief, the structure, the look, and the
          page that shipped, on every&nbsp;screen.
        </p>
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
