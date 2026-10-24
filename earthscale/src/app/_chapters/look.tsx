import gui from "@/assets/components/gui.webp";
import register from "@/assets/components/register.webp";
import terminal from "@/assets/components/terminal.webp";
import pageHero from "@/assets/page/hero.webp";
import exploration from "@/assets/process/exploration.webp";
import study1 from "@/assets/studies/01.webp";
import study2 from "@/assets/studies/02.webp";
import study3 from "@/assets/studies/03.webp";
import study4 from "@/assets/studies/04.webp";
import study5 from "@/assets/studies/05.webp";
import study6 from "@/assets/studies/06.webp";
import { Palette } from "../_components/palette";
import { Shot, TallShot, THIRD } from "../_components/shot";
import { Band, ChapterDivider, Row, Section } from "../_components/story";
import { TypeSpecimen } from "../_components/type-specimen";

// Renders out of the product, each a dataset on the map, as they sat in the file.
const STUDIES = [
  { src: study1, alt: "Night-time lights over a coastline, in deep blue and teal, in Earthscale's map" },
  { src: study2, alt: "A river delta in false colour, yellow channels across blue land" },
  { src: study3, alt: "A wind field over the ocean, in greens, rendered in Earthscale" },
  { src: study4, alt: "The same delta cropped to an oval, as it would sit under a headline" },
  { src: study5, alt: "The world's surface under a wind field, in viridis" },
  { src: study6, alt: "Sea and land temperature across the world, in plasma: orange seas, purple poles" },
];

/* Chapter II: the pictures, the first lit pass, the hero that stayed, and
 * the type, colour and pieces the page is made of. */
export const Look = () => (
  <Band tone="night">
    <ChapterDivider id="look" numeral="II" title="The look">
      Dark, green and made of the product’s own pictures.
    </ChapterDivider>

    <Section
      id="studies"
      eyebrow="The imagery"
      title="The product as the picture"
      text="The page needed a picture of Earth data, and Earthscale makes them. Wind fields, sea temperature, a delta in false colour, the world’s surface in viridis: renders out of the product itself, so nothing on the page is stock."
    >
      <Row cols={3}>
        {STUDIES.map(({ src, alt }) => (
          <Shot key={alt} src={src} alt={alt} sizes={THIRD} zoom />
        ))}
      </Row>
    </Section>

    <Section
      id="exploration"
      eyebrow="A first pass"
      title="The map as the hero"
      text="The first lit version put the product front and centre: a satellite map with the layers panel, a comment thread and a parcel outline, cyan on black. It was right about the dark ground and the green, and wrong about the hero: a screenshot asked the visitor to read before the page had said anything."
    >
      <TallShot src={exploration} alt="The first lit exploration of the page, scrolling: a map interface as the hero, then the sections in cyan on black" label="The first lit pass" caption="The exploration, from the file. Scroll it." />
    </Section>

    <Section
      id="direction"
      eyebrow="The hero"
      title="Earth first, then the tools"
      text="The hero that stayed: the planet under a wind field, cropped to its edge, and the headline over it, Developer Tools for Earth Intelligence. One picture of what the data is, the email field, and the product below."
    >
      <Shot src={pageHero} alt="The final hero: the headline Developer Tools for Earth Intelligence over a globe wrapped in a green wind field, with an email field and a mint Get Started button" caption="The hero at 1440 wide." zoom />
    </Section>

    <Section
      id="type"
      eyebrow="Type"
      title="Neue Machina and Plex Mono"
      text="Pangram Pangram’s PP Neue Machina at every size, plain and tight, from the 72px headline to 14px captions. IBM Plex Mono in capitals for buttons, tags and the fine print, the way a terminal would set them. Two faces, set live here."
    >
      <TypeSpecimen />
    </Section>

    <Section
      id="colour"
      eyebrow="Colour"
      title="Dark green, pale green, and the data’s own ramps"
      text="A green so dark it reads as black for the page, a pale green for text, and a mint for anything to press. The rest of the colour comes from the pictures: the ramps scientists use to read data, viridis, plasma, inferno, magma and cividis, run through the hero and every screen."
    >
      <Palette />
    </Section>

    <Section
      id="components"
      eyebrow="The pieces"
      title="Tags, hairlines and windows"
      text="Pill tags in mono, cards drawn with a single hairline, code in windows with three dots, and the product’s own panels drawn for the page: the layers and catalogue, a visualisation being edited, pixel information with a time series, and the four steps of registering a dataset."
    >
      <Shot src={gui} alt="Five product panels on dark: the layers list, the data catalogue, the visualisation editor, a context menu and a pixel information panel with a time-series chart" caption="The product's panels, as drawn for the page." zoom />
      <Shot src={terminal} alt="Two code windows: registering a Zarr dataset with the Python client, and the tile source it returns for a map library" className="mt-4 sm:mt-6" caption="The client, and what it returns." zoom />
      <Shot src={register} alt="The register dataset dialog in four steps: URL, access, metadata and visualisation" className="mt-4 sm:mt-6" caption="Registering a dataset, step by step." zoom />
    </Section>
  </Band>
);
