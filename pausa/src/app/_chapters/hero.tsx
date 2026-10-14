import { Figure } from "../_components/figure";
import { BOOK } from "../_components/media";
import { PenMark } from "../_components/pen-mark";
import { Kicker } from "../_components/story";

const META = [
  { label: "Role", value: "Brand identity, app UI, App Store, website. Solo." },
  { label: "Timeline", value: "June – August 2026" },
  { label: "Delivered", value: "A 41-spread brand book and a 255-file kit" },
] as const;

/* The opening, built like pausa.co's own hero: blurred paper behind,
 * the big pen tangle drifting off the right edge, the serif doing the
 * talking, one ink button. */
export const Hero = () => (
  <header className="relative isolate overflow-hidden">
    <div
      aria-hidden
      className="absolute -inset-x-[8vw] -top-8 -z-10 h-[860px] bg-[url(/pausa-co/paper-hero-blur.jpg)] bg-cover bg-center opacity-90 blur-[50px]"
    />
    {/* eslint-disable-next-line @next/next/no-img-element -- decorative watermark */}
    <img
      aria-hidden
      alt=""
      src="/pausa-co/mark-hero-swirl.svg"
      className="mark-multiply pointer-events-none absolute top-16 -right-[22vw] -z-10 w-[88vw] max-w-[1100px] sm:-right-[12vw] lg:top-6 lg:w-[62vw]"
    />

    <div className="mx-auto max-w-6xl px-6 pt-16 pb-14 sm:pt-24">
      <Kicker>Case study · Brand identity · 2026</Kicker>
      <h1 className="mt-8">
        {/* eslint-disable-next-line @next/next/no-img-element -- the lockup is the title */}
        <img src="/brand/lockup.svg" alt="Pausa" width={1658} height={512} className="h-14 w-auto sm:h-16" />
      </h1>
      <p className="mt-12 max-w-[22ch] text-[2.75rem] leading-[1.04] font-medium tracking-[-0.02em] text-ink sm:text-[4.25rem] lg:text-[5.25rem]">
        A journal that <PenMark kind="underline">pushes back</PenMark> needed a brand with the nerve to match.
      </p>
      <p className="mt-10 max-w-[36ch] text-[1.25rem] leading-[1.5] text-body sm:text-[1.375rem]">
        Pausa reads what you write and tells you what you keep avoiding. The product already talked like that. I gave
        it a look that does too: drawn by hand in one blue pen, with a highlighter it may use once per screen.
      </p>
      <a
        href="https://www.pausa.co/"
        className="mt-10 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 font-sans text-[0.95rem] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pen"
      >
        Visit pausa.co <span aria-hidden>→</span>
      </a>

      <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-ink pt-6 sm:grid-cols-4">
        {META.map((item) => (
          <div key={item.label}>
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{item.label}</dt>
            <dd className="mt-2 font-serif text-[1rem] leading-[1.45] text-ink">{item.value}</dd>
          </div>
        ))}
        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Client</dt>
          <dd className="mt-2 font-serif text-[1rem] leading-[1.45] text-ink">
            Pausa
            <span className="block text-body">pausa.co</span>
          </dd>
        </div>
      </dl>
    </div>

    <div className="mx-auto max-w-6xl px-6">
      <Figure shot={BOOK.app} priority />
    </div>
  </header>
);
