import { DrawingWall } from "../_components/drawing-wall";
import { FigureRow, SketchRow } from "../_components/figure";
import { PROCESS, TOOLS } from "../_components/media";
import { PenMark } from "../_components/pen-mark";
import { ChapterDivider, PAGE, Section } from "../_components/story";
import { ToolFrame } from "../_components/tool-frame";

/* I · By hand: the directions, the drawings, the tools built to keep them
 * hand-made (shown whole, each with a recording of it working), and the
 * knot picked on 12 August. */
export const ByHand = () => (
  <>
    <ChapterDivider id="by-hand" numeral="I" title="By hand">
      Three directions, a wall of drawings, the tools I built, and <PenMark>one knot</PenMark>
      {" "}that&nbsp;stayed.
    </ChapterDivider>

    <Section
      id="directions"
      eyebrow="Concept · 1 July"
      title="Three ways to push back"
      text="Three directions for a journal that argues with you. The Margin annotates you, The Instrument measures you, The Rest stills you. The Margin won."
    >
      <SketchRow shots={[PROCESS.margin, PROCESS.instrument, PROCESS.rest]} />
    </Section>

    <Section
      id="drawings"
      eyebrow="The hand · July"
      title="Drawn on paper, in pen"
      text="Every mark started as ink on a sheet: scanned, cut out and traced, never redrawn. The 28 July sheet held three families, Not OK Coffee, Lost Bird and Overthinking."
    >
      <FigureRow shots={[PROCESS.sheet, PROCESS.cutting]} />
    </Section>

    <Section
      id="tools"
      eyebrow="Tools"
      title="The tools I built for it"
      text="Small instruments, so the drawings stay drawings. Each one shown whole, working."
    >
      <div className={PAGE}>
        <ToolFrame tool={TOOLS.studio} />
        <div className="mt-20 grid gap-x-8 gap-y-20 md:grid-cols-2">
          <ToolFrame tool={TOOLS.motion} />
          <ToolFrame tool={TOOLS.icon} />
        </div>
        <ToolFrame tool={TOOLS.mockups} className="mt-20" />
        <div className="mt-20 grid gap-x-8 gap-y-20 md:grid-cols-2">
          <ToolFrame tool={TOOLS.dial} />
          <ToolFrame tool={TOOLS.paper} />
        </div>
      </div>
    </Section>

    <Section
      id="tangle"
      eyebrow="The mark · 12 August"
      title="47 drawings, one mark"
      text="One drawing was picked on 12 August: overthinking-5. Not the head with the knot inside it; the knot on its own, the blue tangle on a paper tile and nothing else."
    >
      <div className={PAGE}>
        <DrawingWall />
      </div>
    </Section>
  </>
);
