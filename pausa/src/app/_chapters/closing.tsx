import { KitList } from "../_components/kit-list";
import { Prose, Section } from "../_components/story";

/* The handover, then the brand book's cover as a sign-off: the one
 * surface where the blue gets the whole page. */
export const Closing = () => (
  <>
    <Section
      id="handover"
      kicker="25 August · Handover"
      title="Everything, in one folder"
      note="255 files"
      className="mt-32"
    >
      <Prose>
        <p>
          The client got the brand book, 41 spreads in real vector with searchable text, and a kit grouped by what
          you&apos;re trying to do rather than by the tool that made it. The derived pieces, like the icon ladder,
          regenerate from scripts, so a new size is a command, not a redraw.
        </p>
      </Prose>
      <KitList className="mt-10" />
    </Section>

    <footer className="relative isolate mt-32 overflow-hidden bg-pen text-[#fbfbf9]">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative watermark */}
      <img
        aria-hidden
        alt=""
        src="/pausa-co/mark-mid-swirl.svg"
        className="pointer-events-none absolute -right-24 -bottom-40 -z-10 w-[640px] max-w-none opacity-[0.12] brightness-0 invert sm:w-[820px]"
      />
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        {/* eslint-disable-next-line @next/next/no-img-element -- the lockup, on dark */}
        <img src="/brand/lockup-on-dark.svg" alt="Pausa" width={1658} height={512} className="h-12 w-auto" />
        <p className="mt-10 max-w-[18ch] text-[2.5rem] leading-[1.08] font-medium tracking-[-0.02em] sm:text-[3.5rem]">
          The journal that pushes back.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <a
            href="https://www.pausa.co/"
            className="inline-flex items-center gap-3 rounded-full bg-[#fbfbf9] px-7 py-3.5 font-sans text-[0.95rem] font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Visit pausa.co <span aria-hidden>→</span>
          </a>
          <a
            href="https://alevizio.com"
            className="font-sans text-[0.95rem] text-[#fbfbf9]/80 underline decoration-[#fbfbf9]/40 underline-offset-4 transition-colors hover:text-[#fbfbf9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Back to alevizio.com
          </a>
        </div>
        <p className="mt-20 font-mono text-[11px] uppercase tracking-[0.2em] text-[#fbfbf9]/60">
          Brand identity, app UI and site design by Alejandro Vizio · 2026
        </p>
      </div>
    </footer>
  </>
);
