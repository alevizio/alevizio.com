import pageHero from "@/assets/page/hero.webp";
import exploration from "@/assets/process/exploration.webp";
import study1 from "@/assets/studies/01.webp";
import study2 from "@/assets/studies/02.webp";
import study3 from "@/assets/studies/03.webp";
import study5 from "@/assets/studies/05.webp";
import study6 from "@/assets/studies/06.webp";
import { Drift } from "../_components/drift";
import { Explorer } from "../_components/explorer";
import { Palette } from "../_components/palette";
import { Register } from "../_components/register";
import { HALF, Shot, TallShot, THIRD } from "../_components/shot";
import { Band, ChapterDivider, Row, Section } from "../_components/story";
import { Thread } from "../_components/thread";
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

/* Chapter II: the pictures, the first lit pass, the hero that stayed, and
 * the type, colour and pieces the page is made of. */
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
      id="components"
      eyebrow="The pieces"
      title="Tags, hairlines and windows"
      text="Pill tags in mono, cards drawn with a single hairline, code in windows with three dots, and the product’s own panels drawn for the page: the layers and their time, a visualisation being edited, pixel information with its time series, registering a dataset in four steps, and a comment on a tile. Here they are rebuilt, and they work the way the page shows them working."
    >
      <Explorer />
      <p className="type-caption mt-3 text-(--tone-text)">The explorer: the layers come in, the time runs and the map steps on, the ramp changes, the time series draws.</p>
      <Row className="mt-10 sm:mt-14">
        <div>
          <Register />
          <p className="type-caption mt-3 text-(--tone-text)">Registering a dataset: the URL, the access check, the name, the visualisation.</p>
        </div>
        <div>
          <Thread />
          <p className="type-caption mt-3 text-(--tone-text)">A comment on a tile, answered.</p>
        </div>
      </Row>
    </Section>
  </Band>
);
