import { Figure, FigureRow, Wide } from "../_components/figure";
import { BOOK, PROCESS } from "../_components/media";
import { Palette } from "../_components/palette";
import { PenMark } from "../_components/pen-mark";
import { ChapterDivider, Prose, Section } from "../_components/story";
import { TypeSpecimen } from "../_components/type-specimen";

/* III · The system: the final decisions, as the brand book sets them. */
export const System = () => (
  <>
    <ChapterDivider
      id="system"
      numeral="III"
      title="The system"
      blurb="One module for the lockup, three colours with rules attached, four faces, and a pen that marks you up."
    />

    <Section id="lockup" kicker="Construction" title="Construction, not preference" note="the tile stays on">
      <Prose>
        <p>
          Every number in the lockup comes from one module: u is the icon box divided by eight. The name is set by its
          x-height, 3u. The gap is 2u ink to ink, the clear space 2u all round. The tile stays light on every ground, so
          there are two lockups, not six.
        </p>
        <p>
          And the name is always written by hand, in Caveat and the pen&apos;s blue. Never in the serif, never in
          capitals, never &ldquo;Pausa AI&rdquo;.
        </p>
      </Prose>
    </Section>
    <Wide>
      <Figure shot={BOOK.lockup} />
      <Figure shot={BOOK.grounds} className="mt-10" />
    </Wide>

    <Section id="colour" kicker="Colour" title="The blue is a voice" note="≤ 5% of any screen" className="mt-24">
      <Prose>
        <p>
          Two colours speak and everything else is paper. The blue is the pen, matched to the one in the drawings: it
          shows up where Pausa talks and nowhere else. The yellow is attention, so there&apos;s never more than one on a
          screen.
        </p>
      </Prose>
      <Palette className="mt-10" />
    </Section>

    <Section id="type" kicker="Type" title="Four faces, four jobs" note="the hand is for the margin" className="mt-24">
      <Prose>
        <p>
          One rule settles the two technical faces: if a string changes when the data changes, it&apos;s Plex Mono; if
          it only changes with a new build, it&apos;s Inter.
        </p>
      </Prose>
      <TypeSpecimen className="mt-10" />
    </Section>

    <Section
      id="marks"
      kicker="The marks"
      title={
        <>
          We don&apos;t badge <PenMark kind="circle">you.</PenMark> We mark you up.
        </>
      }
      note="come back to this"
      className="mt-24"
    >
      <Prose>
        <p>
          Every other journal rewards you: streaks, stars, &ldquo;great job.&rdquo; Pausa reads you back and marks the
          page, the way a good editor does. Each mark has one job. The highlight is the one line to notice. The
          underline is the claim. The circle means come back to this. The strike is what you said against what you did:{" "}
          <PenMark kind="strike">I&apos;ll deal with it later</PenMark>.
        </p>
      </Prose>
    </Section>
    <Wide>
      <FigureRow shots={[BOOK.strokes, BOOK.highlights]} />
    </Wide>

    <Section
      id="interface"
      kicker="Interface"
      title="The hand is saved for the pushback"
      note="glyphs are furniture"
      className="mt-24"
    >
      <Prose>
        <p>
          I drew the interface glyphs by hand too, then took them out. Icons move you around the app; they never carry
          the pushback. So the app uses Lucide, unmodified, and the hand only appears where Pausa has something to say.
          The onboarding drawings stayed.
        </p>
      </Prose>
    </Section>
    <Wide>
      <FigureRow shots={[PROCESS.glyphs, PROCESS.illos]} />
    </Wide>

    <Section
      id="voice"
      kicker="Voice"
      title="The friend who looked up from their coffee"
      note="paper, not glass"
      className="mt-24"
    >
      <Prose>
        <p>
          Short, plain, never cruel. It names the pattern and hands it back: &ldquo;You already know.&rdquo;
          &ldquo;Want to look?&rdquo; &ldquo;It&apos;s been three weeks of later.&rdquo; And the page it lands on is
          paper: one wrinkled notebook per year, wearing as the year goes.
        </p>
      </Prose>
    </Section>
    <Wide>
      <Figure shot={BOOK.voice} />
    </Wide>
  </>
);
