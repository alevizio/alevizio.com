import { Figure, FigureRow, Wide } from "../_components/figure";
import { APP_SCREENS, APP_STORE, BOOK, SITE } from "../_components/media";
import { ScreenStrip } from "../_components/screen-strip";
import { ChapterDivider, Prose, Section } from "../_components/story";

/* IV · In the world: the app, the App Store listing, the ads and the site. */
export const InTheWorld = () => (
  <>
    <ChapterDivider
      id="in-the-world"
      numeral="IV"
      title="In the world"
      blurb="The app, the App Store, a feed, and pausa.co."
    />

    <Section id="app" kicker="The app" title="It reads you back" note="a blank notebook">
      <Prose>
        <p>
          Once the brand was signed off, the brief for the app became simplicity: it should feel like a blank notebook,
          so no screen uses every device at once. Paper, ink and the serif carry it. Blue appears only when Pausa
          speaks, the highlighter only on the line worth noticing.
        </p>
        <p>
          A last legibility pass took body type from 17 to 18 points and darkened every grey set below 14.
        </p>
      </Prose>
    </Section>
    <ScreenStrip screens={APP_SCREENS} label="Five app screens" className="mt-10 lg:justify-center" />

    <Section
      id="app-store"
      kicker="App Store"
      title="Two slides to make the case"
      note="the hook goes first"
      className="mt-24"
    >
      <Prose>
        <p>
          On a phone the listing shows two slides before anyone swipes. Nine of the eleven sit below that line, so the
          hook, the proof and the difference all have to land in the first two.
        </p>
      </Prose>
    </Section>
    <ScreenStrip screens={APP_STORE} label="The eleven App Store slides" className="mt-10" />

    <Section id="ads" kicker="Ads" title="The call-out, on a feed" note="one line is enough" className="mt-24">
      <Prose>
        <p>Pausa&apos;s whole argument fits in one line, so every ad is one line, on paper, with a single mark.</p>
      </Prose>
      <Figure shot={BOOK.ads} className="mt-10" />
    </Section>

    <Section
      id="website"
      kicker="Website"
      title="pausa.co, with the app on it at last"
      note="same words, sharper page"
      className="mt-24"
    >
      <Prose>
        <p>
          The redesign kept most of the words and finally put the app on the page. One line got sharper: most journals
          are built to make you feel better; almost none are built to make you honest.
        </p>
      </Prose>
    </Section>
    <Wide>
      <Figure shot={SITE.hero} />
      <FigureRow shots={[SITE.problem, SITE.reads]} className="mt-10" />
      <a
        href="https://www.pausa.co/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink px-6 py-3 font-sans text-[0.95rem] font-semibold text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pen"
      >
        See it live at pausa.co <span aria-hidden>→</span>
      </a>
    </Wide>
  </>
);
