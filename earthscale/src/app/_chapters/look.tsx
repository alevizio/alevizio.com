import study1 from "@/assets/studies/01.webp";
import study2 from "@/assets/studies/02.webp";
import study3 from "@/assets/studies/03.webp";
import study5 from "@/assets/studies/05.webp";
import study6 from "@/assets/studies/06.webp";
import { Drift } from "../_components/drift";
import { FirstPassHero } from "../_components/first-pass-hero";
import { Palette } from "../_components/palette";
import { HALF, THIRD } from "../_components/shot";
import { Band, ChapterDivider, Row, Section } from "../_components/story";
import { TypeSpecimen } from "../_components/type-specimen";

// Renders out of the product, each a dataset on the map, as they sat in the file.
const CLOSE = [
  { src: study1, alt: "Night-time lights over a coastline, in deep blue and teal, in Earthscale's map" },
  { src: study2, alt: "A river delta in false colour, yellow channels across blue land" },
  { src: study3, alt: "A wind field over the ocean, in greens, rendered in Earthscale" },
];
const WORLD = [
  { src: study5, alt: "The world's surface under a wind field, in viridis" },
  { src: study6, alt: "Sea and land temperature across the world, in plasma: orange seas, purple poles" },
];

/* Chapter II: the type and colour the page is made of and where they come
 * from, then its pictures and the first lit pass. */
export const Look = () => (
  <Band tone="night">
    <ChapterDivider id="look" numeral="II" title="The look">
      Dark, green and made of the product’s own pictures.
    </ChapterDivider>

    <Section
      id="type"
      eyebrow="Type"
      title="Neue Machina and Plex Mono"
      text="Two faces, set live here. PP Neue Machina, from Pangram Pangram in Montréal, at every size from the 72px headline to the 14px fine print, plain and tight. IBM Plex Mono, IBM’s own open source mono, in capitals for buttons, tags and captions, the way a terminal would set them. The file’s ten text styles, with the page’s own words in them."
    >
      <TypeSpecimen />
    </Section>

    <Section
      id="colour"
      eyebrow="Colour"
      title="Dark green, pale green, and the data’s own ramps"
      text="Four greens, by the names the file gives them: one so dark it reads as black for the page, a pale one for text, a mint for anything to press and a grey one for captions. The rest of the colour is the data’s: the five ramps the product offers for a raster, the perceptually uniform maps science reads data by, four made for matplotlib in 2015 and cividis in 2018. The same patch of wind, through each one."
    >
      <Palette />
    </Section>

    <Section
      id="studies"
      eyebrow="The imagery"
      title="The product as the picture"
      text="The page needed a picture of Earth data, and Earthscale makes them. Wind fields, sea temperature, a delta in false colour, the world’s surface in viridis: renders out of the product itself, so nothing on the page is stock. They keep moving here, as the data does."
    >
      <Row cols={3}>
        {CLOSE.map(({ src, alt }, i) => (
          <Drift key={alt} src={src} alt={alt} index={i} sizes={THIRD} />
        ))}
      </Row>
      <Row className="mt-4 sm:mt-6">
        {WORLD.map(({ src, alt }, i) => (
          <Drift key={alt} src={src} alt={alt} index={i + 3} sizes={HALF} aspect="aspect-[16/9]" />
        ))}
      </Row>
    </Section>

    <Section
      id="exploration"
      eyebrow="A first pass"
      title="The map as the hero"
      text="The first lit version put the product front and centre: a satellite map with the layers panel, a comment thread and a parcel outline, cyan on black. It was right about the dark ground and the green, and wrong about the hero: a screenshot asked the visitor to read before the page had said anything."
    >
      <figure data-reveal="frame">
        <FirstPassHero className="rounded-[10px]" />
        <figcaption className="type-caption mt-3 text-(--tone-text)">
          The exploration, from the file, its hero playing. The four data sets take turns on the map, then a field gets a comment and an answer.
        </figcaption>
      </figure>
    </Section>
  </Band>
);
