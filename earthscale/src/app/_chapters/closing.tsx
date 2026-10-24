import { Band, PAGE, Section } from "../_components/story";

// Where the page can still be seen. The archive's copy from May 2025 is the
// page as it shipped; earthscale.ai today is the company's next story.
const LINKS = [
  {
    label: "The page as it shipped",
    title: "earthscale.ai in May 2025, in the Internet Archive",
    href: "https://web.archive.org/web/20250519164401/https://www.earthscale.ai/",
    year: "2025",
  },
  {
    label: "Earthscale today",
    title: "earthscale.ai, rebuilt around AI and Earth data",
    href: "https://www.earthscale.ai/",
    year: "2026",
  },
];

/* What happened next, where to see it, the credits and the way back. */
export const Closing = () => (
  <Band tone="paper">
    <Section
      id="live"
      eyebrow="What happened next"
      title="Live in May 2025"
      text="The page went live at earthscale.ai in May 2025, as designed, and ran through the year. By September the headline had moved on, to AI-Ready Infrastructure for Geospatial Data, on the same page; by the end of the year Earthscale had rebuilt the site around a new story, AI and Earth data. The archive keeps the page as it shipped."
    >
      <ul className="border-t border-(--tone-line)">
        {LINKS.map(({ label, title, href, year }) => (
          <li key={href} className="border-b border-(--tone-line)">
            <a href={href} target="_blank" rel="noopener noreferrer" className="group grid gap-1 py-5 sm:grid-cols-[12rem_1fr_auto] sm:items-baseline sm:gap-6">
              <span className="type-label text-(--tone-label)">{label}</span>
              <span className="type-body text-(--tone-head) underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-current">
                {title}
              </span>
              <span className="type-label text-(--tone-text)">{year}</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>

    <footer className="mt-28 sm:mt-40">
      <div className={PAGE}>
        <div aria-hidden className="h-px w-full bg-(--tone-line)" />
        <p className="type-label mt-8 text-(--tone-text)">Credits</p>
        <p className="type-caption mt-3 max-w-[48rem] text-(--tone-head)">
          Design: Alejandro Vizio. Product, pictures and copy: Earthscale, with Felix Dorrek, Noah Golmant, Bernhard
          Stadlbauer and Samuel. Type: PP Neue Machina by Pangram Pangram, IBM Plex Mono by IBM. The Earthscale name,
          mark and product belong to Earthscale; this is a write-up of the design work.
        </p>
        <a href="https://alevizio.com" className="type-caption mt-8 inline-block text-(--tone-head) underline decoration-current/40 underline-offset-4 hover:decoration-current">
          alevizio.com
        </a>
      </div>
    </footer>
  </Band>
);
