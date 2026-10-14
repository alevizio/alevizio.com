import { Doodles } from "../_components/doodles";
import { IconSet } from "../_components/icon-set";
import { PenMark } from "../_components/pen-mark";
import { MarksInUse, PenSet } from "../_components/pen-set";
import { ChapterDivider, Section } from "../_components/story";
import { Voice } from "../_components/voice";

/* III · The pen: the marks that carry the pushback, the drawings in the
 * margin, the icons the app draws, and the voice. */
export const ThePen = () => (
  <>
    <ChapterDivider id="pen" numeral="III" title="The pen">
      The pen that reads you back: its <PenMark kind="circle">marks</PenMark>, its drawings, its icons and its&nbsp;voice.
    </ChapterDivider>

    <Section
      id="marks"
      eyebrow="Why the marks"
      title={
        <>
          We don’t badge <PenMark kind="circle">you.</PenMark> We mark you up.
        </>
      }
      text="Every other journal rewards you: streaks, stars, “great job.” Pausa does what a good editor does. It reads you back and marks the page. The mark is the pushback, made visible."
    >
      <MarksInUse />
      <PenSet className="mt-24 sm:mt-32" />
    </Section>

    <Section
      id="doodles"
      eyebrow="Illustration"
      title="Doodles in the margin"
      text="Spot drawings in a single blue line, the same hand as the marks, cut from the same sheet as the wordmark and the app icon. Nothing licensed, nothing traced from stock: a person thinking on the page, not a polished mascot."
    >
      <Doodles />
    </Section>

    <Section id="icons" eyebrow="The app set" title="Icons" text="Everything the app draws. Lucide, unmodified, at 22 px and a 1.5 stroke; nothing here is redrawn.">
      <IconSet />
    </Section>

    <Section
      id="voice"
      eyebrow="Voice"
      title="Like a friend who looked up from their coffee"
      text="The warmth is never in soft words. It is in standing next to you, not above you."
    >
      <Voice />
    </Section>
  </>
);
