import { Band, PAGE, Section } from "../_components/story";

// Where Pachama and its brand appeared, newest first. Each link was checked;
// Fast Company blocks scripts, so its title comes from the list it belongs to.
const PRESS = [
  {
    outlet: "TechCrunch",
    year: 2025,
    title: "Consolidation begins to hit the carbon credit market",
    href: "https://techcrunch.com/2025/11/10/consolidation-begins-to-hit-the-carbon-credit-market/",
  },
  {
    outlet: "BP&O",
    year: 2024,
    title: "New logo for Pachama by How&How",
    href: "https://bpando.org/logos/pachama/",
  },
  {
    outlet: "Creative Boom",
    year: 2024,
    title: "How&How Studio rebrand of Pachama helps shake up the carbon capture industry",
    href: "https://www.creativeboom.com/news/howhow-studio-rebrand-pachama/",
  },
  {
    outlet: "How&How",
    year: 2024,
    title: "Brand identity and website design for Pachama",
    href: "https://how.studio/branding/pachama",
  },
  {
    outlet: "Forbes Argentina",
    year: 2022,
    title: "Este argentino creó una startup para restaurar la naturaleza y mitigar el cambio climático",
    href: "https://www.forbesargentina.com/negocios/este-argentino-creo-una-startup-restaurar-naturaleza-mitigar-cambio-climatico-n17472",
  },
  {
    outlet: "TechCrunch",
    year: 2021,
    title: "As concerns rise over forest carbon offsets, Pachama's verified offset marketplace gets $15 million",
    href: "https://techcrunch.com/2021/04/30/as-concerns-rise-over-forest-carbon-offsets-pachamas-verified-offset-marketplace-gets-15-million/",
  },
  {
    outlet: "TechCrunch",
    year: 2021,
    title: "Mercado Libre taps Pachama to monitor and manage its $8 million investment in Latin American rainforest restoration",
    href: "https://techcrunch.com/2021/03/09/mercado-libre-taps-pachama-to-monitor-and-manage-its-8-million-investment-in-latin-american-rainforest-restoration/",
  },
  {
    outlet: "Fast Company",
    year: 2021,
    title: "Most Innovative Companies 2021: Pachama",
    href: "https://www.fastcompany.com/90600400/pachama-most-innovative-companies-2021",
  },
  {
    outlet: "TechCrunch",
    year: 2020,
    title: "As the Western US burns, a forest carbon capture monitoring service nabs cash from Amazon & Bill Gates-backed fund",
    href: "https://techcrunch.com/2020/09/17/as-the-western-us-burns-a-forest-carbon-capture-monitoring-service-nabs-cash-from-amazon-bill-gates-backed-fund/",
  },
  {
    outlet: "TechCrunch",
    year: 2020,
    title: "Pachama launches to support global reforestation through carbon markets",
    href: "https://techcrunch.com/2020/01/03/pachama-launches-to-support-global-reforestation-through-carbon-markets/",
  },
];

/* What happened next, the press, the credits and the way back. */
export const Closing = () => (
  <Band tone="ground" className="border-t border-white/10">
    <Section
      id="next"
      eyebrow="What happened next"
      title="Acquired by Carbon Direct, now Relae"
      text="In 2025 Carbon Direct bought Pachama and kept the platform. What I'd keep from five years of it: to write."
    />

    <Section id="press" eyebrow="In the press" title="Where Pachama showed up">
      <ul className="border-t border-white/15">
        {PRESS.map(({ outlet, year, title, href }) => (
          <li key={href} className="border-b border-white/15">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-1 py-5 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-6"
            >
              <span className="type-label text-leaf">{outlet}</span>
              <span className="type-body text-fog underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-fog/60">
                {title}
              </span>
              <span className="type-label text-haze">{year}</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>

    <footer className="mt-28 sm:mt-40">
      <div className={PAGE}>
        <div aria-hidden className="spectrum h-[3px] w-full rounded-full" />
        <p className="type-label mt-8 text-haze">Credits</p>
        <p className="type-caption mt-3 max-w-[48rem] text-fog">
          Brand, motion and website in collaboration with How&amp;How, from FNDR&apos;s strategy; their work shown with their
          permission. Type: Chromatic Condensed by Colophon, Matter by Displaay. Product, maps and rollout with
          Pachama&apos;s product, science and engineering teams. Satellite imagery: Deimos Imaging. Photography: to credit.
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
