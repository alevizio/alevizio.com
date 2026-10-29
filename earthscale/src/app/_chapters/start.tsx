import { cn } from "../_components/cn";
import { Notes } from "../_components/notes";
import { Clip } from "../_components/shot";
import { Band, ChapterDivider, PAGE, Section } from "../_components/story";
import { WireStack } from "../_components/wire-stack";

/* Chapter I: what Earthscale asked for, and the page in boxes before any
 * colour. It opens on the page that came of it, on a display in a meadow,
 * then goes back to the brief. */
export const Start = () => (
  <Band tone="ground">
    <ChapterDivider id="start" numeral="I" title="Where it started">
      A geospatial developer platform, built by four people who had built Pachama’s, and a page to say so.
    </ChapterDivider>

    <div className={cn(PAGE, "mt-12 sm:mt-16")}>
      <Clip
        name="page/meadow"
        label="Earthscale's landing page on a display in a meadow, scrolling top to bottom: Developer Tools for Earth Intelligence over a globe, the logos and a quote, who it's for, serving and exploring data, the catalog, and the closing ask"
        aspect="aspect-video"
        caption="The page from the file, on a display in a meadow."
      />
    </div>

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
