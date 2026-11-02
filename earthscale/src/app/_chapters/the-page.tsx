import desktop from "@/assets/page/desktop.webp";
import menu from "@/assets/page/menu.webp";
import mobile from "@/assets/page/mobile.webp";
import tablet from "@/assets/page/tablet.webp";
import team from "@/assets/page/team.webp";
import wide from "@/assets/page/wide.webp";
import { KitGrid } from "../_components/kit-grid";
import { PageTour } from "../_components/page-tour";
import { Screens } from "../_components/screens";
import { SectionTabs } from "../_components/section-tabs";
import { Shot } from "../_components/shot";
import { Band, ChapterDivider, Section } from "../_components/story";
import { SECTIONS } from "./page-anatomy";

const SCREENS = [
  { src: wide, alt: "The landing page at 2500 pixels wide, on a monitor", label: "2500 wide", kind: "monitor" },
  { src: desktop, alt: "The landing page at 1440 pixels wide, on a laptop", label: "1440 wide", kind: "laptop" },
  { src: tablet, alt: "The landing page at 1024 pixels wide, on a tablet", label: "1024, tablet", kind: "tablet" },
  { src: mobile, alt: "The landing page at 420 pixels wide, on a phone", label: "420, phone", kind: "phone" },
  { src: menu, alt: "The phone menu: Team, Contact and a Get Started button over the top of the hero", label: "Its menu", kind: "phone", still: true },
] as const;

/* Chapter III: the page whole, on a laptop, then the kit it's built from,
 * then its sections taken apart, one at a time under a row of tabs, then the
 * page at every width, each on its device, and its second page. */
export const ThePage = () => (
  <Band tone="ground">
    <ChapterDivider id="page" numeral="III" title="The page">
      The page whole, the kit it’s built from, its seven sections taken apart, then the page at four widths.
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
      text="Pick one: its sheet from the file with its pieces marked, then each piece rebuilt and working under its number."
    >
      <SectionTabs sections={SECTIONS} />
    </Section>

    <Section
      id="screens"
      eyebrow="Every width"
      title="Wide, desktop, tablet, phone"
      text="The same page at 2500, 1440, 1024 and 420 wide. Two cards become one column, the diagram stacks under the features, the panels crop to the phone’s edge, and the hero keeps the planet. Each page scrolls, and the last phone has its menu open."
    >
      <Screens screens={SCREENS} />
    </Section>

    <Section
      id="team"
      eyebrow="The second page"
      title="The team"
      text="One more page in the same system, for the four founders: a who tag, a line about them, and four hairline cards with a photo, a name, a role in mono and a LinkedIn mark. The same ask and footer close it."
    >
      <Shot src={team} alt="The team page: Our team, four cards with photos and biographies of Felix Dorrek, Noah Golmant, Bernhard Stadlbauer and Samuel, then the closing call to action" caption="The team page at 1440 wide." zoom />
    </Section>
  </Band>
);
