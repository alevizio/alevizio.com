import { DrawingWall } from "../_components/drawing-wall";
import { Figure, FigureRow, SketchRow, Wide } from "../_components/figure";
import { BOOK, PROCESS } from "../_components/media";
import { ChapterDivider, Prose, Section } from "../_components/story";

/* II · By hand: the process. Three directions, the drawings, the icon
 * shoot-out, and the decision on 12 August. */
export const ByHand = () => (
  <>
    <ChapterDivider
      id="by-hand"
      numeral="II"
      title="By hand"
      blurb="Three directions, forty-seven drawings, one knot. Drawn on paper in pen, traced and never redrawn."
    />

    <Section id="directions" kicker="June · Directions" title="Three ways to push back" note="it annotates you">
      <Prose>
        <p>
          Each direction came with its own sketches. The Instrument measured you: pause bars in the name, waveforms,
          rings. The Rest stilled you: soft pencil and quiet punctuation. The Margin annotated you: Pausa as the note a
          sharp reader leaves in the margin of your life. The Margin won on 1 July.
        </p>
      </Prose>
    </Section>
    <Wide>
      <SketchRow shots={[PROCESS.margin, PROCESS.instrument, PROCESS.rest]} />
    </Wide>

    <Section
      id="drawings"
      kicker="July · The drawings"
      title="Drawn on paper, in pen"
      note="traced, never redrawn"
      className="mt-24"
    >
      <Prose>
        <p>
          Every mark started on paper. I drew sheets of them in blue pen and built a small tool to find each drawing on
          the scan, cut it out and trace it, so the line keeps the wobble a real hand leaves. The brand&apos;s blue is
          matched to that pen.
        </p>
      </Prose>
    </Section>
    <Wide>
      <FigureRow shots={[PROCESS.sheet, PROCESS.cutting]} />
    </Wide>

    <Section
      id="directions-icon"
      kicker="28 July · The icon"
      title="A coffee cup, a bird, or the knot"
      note="it can come undone"
      className="mt-24"
    >
      <Prose>
        <p>
          For a month the icon was a head in profile with a knot inside. Then three new directions went up against it:
          a coffee cup that isn&apos;t OK, a lost bird, and overthinking. The client picked the scribble for a reason I
          hadn&apos;t planned for: a knot can come undone, so the mark can straighten itself out on screen.
        </p>
      </Prose>
      <Figure shot={PROCESS.directions} className="mt-10" />
    </Section>

    <Section
      id="tangle"
      kicker="12 August · The mark"
      title="The tangle, not the head"
      note="nothing to straighten but the knot"
      className="mt-24"
    >
      <Prose>
        <p>
          The knot shipped on its own: no head, no speech bubble, no container. A head held up better at the smallest
          sizes, and I took the trade on purpose. Nothing around the tangle has to survive being straightened, which is
          the one thing the mark has to do.
        </p>
      </Prose>
    </Section>
    <Wide>
      <DrawingWall />
      <p className="mt-3 font-sans text-[0.9rem] leading-[1.55] text-body">
        All 47 drawings in the kit. The pick is circled; the heads it beat are struck out.
      </p>
      <Figure shot={BOOK.icon} className="mt-12" />
    </Wide>
  </>
);
