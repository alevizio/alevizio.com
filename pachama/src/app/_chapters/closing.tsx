import { Band, PAGE, Section } from "../_components/story";

/* What happened next, the credits and the way back. */
export const Closing = () => (
  <Band tone="ground" className="border-t border-white/10">
    <Section
      id="next"
      eyebrow="What happened next"
      title="Acquired by Carbon Direct, now Relae"
      text="In 2025 Carbon Direct bought Pachama and kept the platform. What I'd keep from five years of it: to write."
    />

    <footer className="mt-28 sm:mt-40">
      <div className={PAGE}>
        <div aria-hidden className="spectrum h-[3px] w-full rounded-full" />
        <p className="type-label mt-8 text-haze">Credits</p>
        <p className="type-caption mt-3 max-w-[48rem] text-fog">
          Identity by How&amp;How, from FNDR&apos;s strategy; their work shown with their permission. Product, maps and
          rollout with Pachama&apos;s product, science and engineering teams. Satellite imagery: Deimos Imaging.
          Photography: to credit.
        </p>
        <a
          href="https://alevizio.com"
          className="type-caption mt-8 inline-block text-fog underline decoration-white/30 underline-offset-4 hover:decoration-fog"
        >
          alevizio.com
        </a>
      </div>
    </footer>
  </Band>
);
