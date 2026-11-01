import { Globe } from "../_components/globe";
import { Band, PAGE, Section } from "../_components/story";

/* What happened next, the credits, and the planet's limb rising under them
 * with its glow, turning, the way the landing page ends. */
export const Closing = () => (
  <Band tone="night" className="pb-0 sm:pb-0">
    <Section
      id="live"
      eyebrow="What happened next"
      title="Live in May 2025"
      text="The page went live at earthscale.ai in May 2025, as designed, and ran through the year. By September the headline had moved on, to AI-Ready Infrastructure for Geospatial Data, on the same page; by the end of the year Earthscale had rebuilt the site around a new story, AI and Earth data. The Internet Archive keeps the page as it shipped."
    />

    <footer className="relative mt-28 overflow-hidden sm:mt-40">
      <div className={PAGE}>
        <div aria-hidden className="h-px w-full bg-rule" />
        <p className="type-label mt-8 text-haze">Credits</p>
        <p className="type-caption mt-3 max-w-[48rem] text-mist">
          Design: Alejandro Vizio. Product, pictures and copy: Earthscale, with Felix Dorrek, Noah Golmant, Bernhard
          Stadlbauer and Samuel. Type: PP Neue Machina by Pangram Pangram, IBM Plex Mono by IBM. The Earthscale name,
          mark and product belong to Earthscale; this is a write-up of the design work.
        </p>
        <a href="https://alevizio.com" className="type-caption relative z-10 mt-8 inline-block text-mist underline decoration-mist/30 underline-offset-4 hover:decoration-mist">
          alevizio.com
        </a>
      </div>
      <div aria-hidden className="relative mt-10 h-[20rem] sm:h-[24rem]">
        <div className="absolute inset-x-0 bottom-0 h-full bg-[radial-gradient(60%_90%_at_50%_100%,rgb(43_65_62/0.9),rgb(15_19_19/0)_72%)]" />
        {/* The halo fades out before the canvas's top, or the footer's, can cut it. */}
        <Globe className="absolute top-[calc(100%+80vw)] left-1/2 h-[250vw] w-[250vw] -translate-x-1/2 -translate-y-1/2 [mask-image:linear-gradient(to_bottom,transparent_3%,black_12%)]" />
      </div>
    </footer>
  </Band>
);
