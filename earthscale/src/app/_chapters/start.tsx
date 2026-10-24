import oldSite from "@/assets/before/old-site.webp";
import wireframe from "@/assets/process/wireframe.webp";
import { Notes } from "../_components/notes";
import { TallShot } from "../_components/shot";
import { Band, ChapterDivider, Section } from "../_components/story";

/* Chapter I: the site Earthscale had, what they asked for, and the page in
 * boxes before any colour. */
export const Start = () => (
  <Band tone="ground">
    <ChapterDivider id="start" numeral="I" title="Where it started">
      A geospatial developer platform, built by four people who had built Pachama’s, with a site that said little about it.
    </ChapterDivider>

    <Section
      id="before"
      eyebrow="The site before"
      title="A platform page that said little about the product"
      text="Earthscale’s first site: a headline, a satellite picture, and two rows of feature cards with the same risk table in every one. The product, a map with layers, parcels and a Python client, was nowhere on the page."
    >
      <TallShot src={oldSite} alt="Earthscale's previous website, scrolling: a light hero with a satellite image, then dark sections titled Testing & QA and Deployment with three identical cards each" label="The previous site" caption="The site in early 2025, as it was in the file. Scroll it." />
    </Section>

    <Section
      id="brief"
      eyebrow="The brief"
      title="What the page had to say"
      text="Felix and Noah wrote down who the platform is for and what it does, as a list of features, twice: once as the product sees it and once as a developer would. Their notes, as they came, in the file."
    >
      <Notes />
    </Section>

    <Section
      id="wireframe"
      eyebrow="The structure"
      title="Nine sections, in grey"
      text="The page in boxes before any colour: a hero with the product behind it and an email field, the logos, who it’s for, deploy, then test and explore, the ask, and a footer that repeats it. The order held to the end; the hero and the two feature sections changed the most."
    >
      <TallShot src={wireframe} alt="The landing page as a grey wireframe, scrolling: hero with an email field, a logos row, two cards, three feature cards, three more, a closing call to action and a footer" label="The wireframe" caption="The desktop wireframe. Scroll it." />
    </Section>
  </Band>
);
