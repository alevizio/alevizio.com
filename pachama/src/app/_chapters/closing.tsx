import { PAGE, Section } from "../_components/story";

/* What happened next, the credits and the way back. */
export const Closing = () => (
  <>
    <Section
      id="next"
      eyebrow="What happened next"
      title="Acquired by Carbon Direct, now Relae"
      text="In 2025 Carbon Direct bought Pachama and kept the platform. What I'd keep from five years of it: to write."
    />

    <footer className="mt-28 border-t border-rule pb-16 pt-10 sm:mt-40">
      <div className={PAGE}>
        <p className="type-label text-muted">Credits</p>
        <p className="type-caption mt-3 max-w-[48rem] text-body">
          Identity by How&amp;How, from FNDR&apos;s strategy. Product, maps and rollout with Pachama&apos;s product,
          science and engineering teams. Photography: to credit.
        </p>
        <a href="https://alevizio.com" className="type-caption mt-8 inline-block text-ink underline decoration-ash underline-offset-4 hover:decoration-ink">
          alevizio.com
        </a>
      </div>
    </footer>
  </>
);
