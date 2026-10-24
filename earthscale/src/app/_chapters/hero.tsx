import planet from "@/assets/hero/planet.webp";
import Image from "next/image";
import { cn } from "../_components/cn";
import { PAGE } from "../_components/story";

// The facts strip under the hero. Draft wording, to confirm.
const FACTS = [
  { label: "Role", value: "Product and brand designer" },
  { label: "Timeline", value: "Spring 2025" },
  { label: "With", value: "Earthscale’s founders, Felix Dorrek and Noah Golmant" },
  { label: "Outcome", value: "Live at earthscale.ai from May 2025" },
];

/* The page's own globe, turned on the case study: the planet under its
 * wind field, the one picture the landing page scaled up for its hero,
 * fills the screen on black, as there, and drifts; the name sits over it
 * on the left and a mint hairline draws across the top as the words
 * arrive. The hero dissolves into the page's green where the facts begin.
 * The gradients interpolate in sRGB: in oklab WebKit paints the transparent
 * end dark. */
export const Hero = () => (
  <header className="bg-night text-mist">
    <div className="relative overflow-hidden bg-black">
      <div aria-hidden className="absolute inset-0">
        <Image
          src={planet}
          alt=""
          priority
          sizes="100vw"
          className="h-full w-full object-cover object-[70%_22%] motion-safe:animate-[drift_40s_ease-in-out_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-linear-to-r/srgb from-black from-15% via-black/45 via-55% to-black/0" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t/srgb from-night to-night/0" />
      </div>
      <div aria-hidden className="draw absolute inset-x-0 top-0 h-px bg-mint/70" />
      <div className={cn(PAGE, "relative z-10 flex min-h-[88svh] flex-col justify-end pt-24 pb-16 sm:pb-24")}>
        <p className="type-label arrive text-mint [--arrive-delay:0.15s]">Case study · 2025</p>
        <h1 className="type-display settle mt-5 [--arrive-delay:0.25s]">Earthscale</h1>
        <p className="type-body arrive mt-6 max-w-[38rem] text-text [--arrive-delay:0.55s]">
          A landing page for a developer platform for Earth intelligence: the site before, the structure, the look, and the
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
