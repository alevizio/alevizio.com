import desktop from "@/assets/page/desktop.webp";
import menu from "@/assets/page/menu.webp";
import mobile from "@/assets/page/mobile.webp";
import tablet from "@/assets/page/tablet.webp";
import wide from "@/assets/page/wide.webp";
import { KitGrid } from "../_components/kit-grid";
import { PageTour } from "../_components/page-tour";
import { Screens } from "../_components/screens";
import { SectionBento } from "../_components/section-bento";
import { SectionMarquee } from "../_components/section-marquee";
import { ServeLive } from "../_components/serve-live";
import { cn } from "../_components/cn";
import { Band, ChapterDivider, PAGE, Section } from "../_components/story";
import { TypeSpecimen } from "../_components/type-specimen";
import { SHEETS, TILES } from "./page-anatomy";

const SCREENS = [
  { src: wide, alt: "The landing page at 2500 pixels wide, on a monitor", label: "2500 wide", kind: "monitor" },
  { src: desktop, alt: "The landing page at 1440 pixels wide, on a laptop", label: "1440 wide", kind: "laptop" },
  { src: tablet, alt: "The landing page at 1024 pixels wide, on a tablet", label: "1024, tablet", kind: "tablet" },
  { src: mobile, alt: "The landing page at 420 pixels wide, on a phone", label: "420, phone", kind: "phone" },
  { src: menu, alt: "The phone menu: Team, Contact and a Get Started button over the top of the hero", label: "Its menu", kind: "phone", still: true },
] as const;

/* Chapter III: the page whole, on a laptop, then its type and the kit it's
 * built from, then its sections going by in a row and their pieces in a
 * bento, then its serve section playing, then the page at every width,
 * each on its device. */
export const ThePage = () => (
  <Band tone="ground" to="night">
    <ChapterDivider id="page" numeral="III" title="The page">
      The page whole, its type and the kit it’s built from, its seven sections taken apart, then the page at four widths.
    </ChapterDivider>

    <Section
      id="whole"
      eyebrow="The whole page"
      title="Developer Tools for Earth Intelligence"
      text="The landing page at 1440, from the file, top to bottom, through the seven sections taken apart below."
    >
      <PageTour caption="Someone signs up in the hero, then reads down past the explorer to the closing ask." />
    </Section>

    <Section
      id="type"
      eyebrow="Type"
      title="Neue Machina and Plex Mono"
      text="Two faces, set live here. PP Neue Machina, from Pangram Pangram in Montréal, at every size from the 72px headline to the 14px fine print, plain and tight. IBM Plex Mono, IBM’s own open source mono, in capitals for buttons, tags and captions, the way a terminal would set them. The file’s ten text styles, with the page’s own words in them."
    >
      <TypeSpecimen />
    </Section>

    <Section
      id="kit"
      eyebrow="The kit"
      title="Every piece, working"
      text="The file’s components, built and working, in a ruled grid like the page’s own cards. A field gets picked on the map and its values come in, and each of the other pieces does its one thing as the grid comes into view."
    >
      <KitGrid />
    </Section>

    <Section
      id="sections"
      eyebrow="Section by section"
      title="Seven sections, taken apart"
      text="The seven sections as the file has them, going by, then their pieces, rebuilt and working as they come into view."
    />
    <SectionMarquee sheets={SHEETS} className="mt-12 sm:mt-16" />
    <div className={cn(PAGE, "mt-12 sm:mt-16")}>
      <SectionBento tiles={TILES} />
    </div>

    <Section
      id="serve-live"
      eyebrow="Serve, live"
      title="Serve Data at Scale, playing"
      text="The serve section as the page sets it, rebuilt and moving: the features light in turn while the pipeline runs, two sources joining, the Python client registering the data and a tile source coming out."
    >
      <ServeLive />
    </Section>

    <Section
      id="screens"
      eyebrow="Every width"
      title="Wide, desktop, tablet, phone"
      text="The same page at 2500, 1440, 1024 and 420 wide. Two cards become one column, the diagram stacks under the features, the panels crop to the phone’s edge, and the hero keeps the planet. Each page scrolls, and the last phone has its menu open."
    >
      <Screens screens={SCREENS} />
    </Section>
  </Band>
);
