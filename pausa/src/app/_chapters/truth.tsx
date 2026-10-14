import { Figure } from "../_components/figure";
import { BOOK } from "../_components/media";
import { Highlight } from "../_components/pen-mark";
import { PositioningMap } from "../_components/positioning-map";
import { ChapterDivider, Prose, Section } from "../_components/story";

/* I · The truth: what Pausa is, where it stands, and the one line the
 * whole identity was drawn from. */
export const Truth = () => (
  <>
    <ChapterDivider
      id="truth"
      numeral="I"
      title="The truth"
      blurb="A product with a sharp voice and no look of its own yet. The brief: make the look as honest as the voice."
    />

    <Section id="brief" kicker="The brief" title="Make it look the way it talks" note="warm, but never soft">
      <Prose>
        <p>
          Pausa isn&apos;t there to make you feel good. It reads your entries, finds the pattern, and says it plainly
          when what you do stops matching what you said you wanted.
        </p>
        <p>
          The brief asked for the opposite of a wellness app: monochrome, direct, built to push back. The job was the
          whole identity, the mark, the name, colour and type, and then every place it lives: the app, the App Store
          and pausa.co.
        </p>
      </Prose>
    </Section>

    <Section
      id="positioning"
      kicker="Positioning"
      title="A brutally honest friend"
      note="friend, not coach"
      className="mt-24"
    >
      <Prose>
        <p>
          Journaling apps crowd two corners. One is cozy: mascots, streaks, gold stars for showing up. The other is
          clinical: dashboards and mood graphs. The warm, sharp corner was empty: the friend who looks up from their
          coffee to say the true thing. One rule keeps the voice there: challenge the pattern, never the person.
        </p>
      </Prose>
      <PositioningMap className="mt-10" />
    </Section>

    <Section
      id="loops"
      kicker="The insight"
      title={
        <>
          The problem isn&apos;t thinking too little. It&apos;s thinking in <Highlight>loops</Highlight>.
        </>
      }
      note="— you've said that three times."
      className="mt-24"
    >
      <Prose>
        <p>
          That line became the brief for everything visual: a mark that is a loop, a pen that marks your words
          instead of badging you, and a yellow that only shows up when something matters.
        </p>
      </Prose>
      <Figure shot={BOOK.truth} className="mt-10" />
    </Section>
  </>
);
