import { Notes } from "../_components/notes";
import { Band, ChapterDivider, Section } from "../_components/story";
import { WireStack } from "../_components/wire-stack";

/* Chapter I: what Earthscale asked for, and the page in boxes before any
 * colour. */
export const Start = () => (
  <Band tone="ground">
    <ChapterDivider id="start" numeral="I" title="Where it started">
      A geospatial developer platform, built by four people who had built Pachama’s, and a page to say so.
    </ChapterDivider>

    <Section
      id="brief"
      eyebrow="The brief"
      title="What the page had to say"
      text="Felix and Noah wrote down who the platform is for and what it does, as a list of features, twice: once as the product sees it and once as a developer would. Their notes from the file, boiled down to the list."
    >
      <Notes />
    </Section>

    <Section
      id="wireframe"
      eyebrow="The structure"
      title="Nine sections, in grey"
      text="The page in boxes before any colour, taken apart. The order held to the end; the hero and the two feature sections changed the most."
    >
      <WireStack />
    </Section>
  </Band>
);
