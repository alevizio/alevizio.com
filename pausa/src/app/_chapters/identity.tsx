import { Colours } from "../_components/colours";
import { Construction, LockupGrounds, MarkNotes, MarkSpecimen, Textures } from "../_components/identity";
import { PenMark } from "../_components/pen-mark";
import { ChapterDivider, Section } from "../_components/story";
import { FaceSpecimens, SerifSpecimen } from "../_components/type-specimen";

/* II · The identity: the brand book's foundations, taken out of its pages
 * and set live: the mark, the lockup and how it's built, colour, type,
 * and the paper it all sits on. */
export const Identity = () => (
  <>
    <ChapterDivider id="identity" numeral="II" title="The identity">
      What the brand is made of, and <PenMark kind="highlight">the rules</PenMark>
      {" "}that keep it&nbsp;sharp.
    </ChapterDivider>

    <Section
      id="mark"
      eyebrow="Mark"
      title="Where the scribble comes from"
      text="It was drawn on paper, in pen, by hand, then traced, not redrawn. The whole system is a red pen in the margin, except the pen is blue."
    >
      <MarkSpecimen />
      <MarkNotes className="mt-20" />
    </Section>

    <Section
      id="lockup"
      eyebrow="Construction"
      title="The lockup"
      text="Construction, not preference. Everything is derived from one module, u = the icon box ÷ 8, so the lockup can be rebuilt at any size from the numbers alone. The name is Caveat in blue and is never set in the serif."
    >
      <Construction />
    </Section>

    <Section id="grounds" eyebrow="Grounds" title="The tile never comes off" text="On white, on paper, on blue: the tile stays light. Only the name changes colour.">
      <LockupGrounds />
    </Section>

    <Section id="colour" eyebrow="Colour" title="The blue is a voice" text="Paper, a pen, and one highlight. Everything else is paper.">
      <Colours />
    </Section>

    <Section
      id="type"
      eyebrow="Type · Specimen"
      title="Source Serif 4"
      text="The voice. Entries, headlines, the call-out: everything the reader actually reads. Four weights are in use and no italic is ever set; emphasis is weight or a mark, never a slope."
    >
      <SerifSpecimen />
    </Section>

    <Section
      id="faces"
      eyebrow="Type · Specimen"
      title="Caveat, Inter, IBM Plex Mono"
      text="The hand, the chrome and the technical layer. Each has one job and stays inside it: the hand never sets body copy, the chrome never sets the voice."
    >
      <FaceSpecimens />
    </Section>

    <Section
      id="paper"
      eyebrow="Paper"
      title="The wrinkled age"
      text="One notebook per year, wearing as the year goes, so a library of years builds up and the Recaps tab has something to read against."
    >
      <Textures />
    </Section>
  </>
);
