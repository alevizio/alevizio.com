import desktop from "@/assets/page/desktop.webp";
import menu from "@/assets/page/menu.webp";
import mobile from "@/assets/page/mobile.webp";
import tablet from "@/assets/page/tablet.webp";
import team from "@/assets/page/team.webp";
import wide from "@/assets/page/wide.webp";
import { Anatomy } from "../_components/anatomy";
import { Screens } from "../_components/screens";
import { Clip, Shot } from "../_components/shot";
import { Band, ChapterDivider, Section } from "../_components/story";
import { SECTIONS } from "./page-anatomy";

const SCREENS = [
  { src: wide, alt: "The landing page at 2500 pixels wide", label: "2500 wide", sizes: "(min-width: 1024px) 25vw, 50vw" },
  { src: desktop, alt: "The landing page at 1440 pixels wide", label: "1440 wide", sizes: "(min-width: 1024px) 25vw, 50vw" },
  { src: tablet, alt: "The landing page at 1024 pixels wide, a tablet", label: "1024, tablet", sizes: "(min-width: 1024px) 25vw, 50vw" },
  { src: mobile, alt: "The landing page at 420 pixels wide, a phone", label: "420, phone", sizes: "(min-width: 1024px) 25vw, 50vw" },
];

/* Chapter III: the page whole, on a display in a meadow, then section by
 * section, each taken apart into its pieces, then the page at every width,
 * and its second page. */
export const ThePage = () => (
  <Band tone="ground">
    <ChapterDivider id="page" numeral="III" title="The page">
      The page whole, then its seven sections taken apart into their pieces, then the page at four widths.
    </ChapterDivider>

    <Section
      id="whole"
      eyebrow="The whole page"
      title="Developer Tools for Earth Intelligence"
      text="The landing page at 1440, from the file, top to bottom. It stops on each of its seven sections, the ones taken apart below."
    >
      <Clip
        name="page/meadow"
        label="Earthscale's landing page on a display in a meadow, scrolling top to bottom: Developer Tools for Earth Intelligence over a globe, the logos and a quote, who it's for, serving and exploring data, the catalog, and the closing ask"
        aspect="aspect-video"
        caption="The page from the file, on a display in a meadow."
      />
    </Section>

    {SECTIONS.map(({ id, eyebrow, title, text, ...anatomy }) => (
      <Section key={id} id={id} eyebrow={eyebrow} title={title} text={text}>
        <Anatomy id={id} {...anatomy} />
      </Section>
    ))}

    <Section
      id="screens"
      eyebrow="Every width"
      title="Wide, desktop, tablet, phone"
      text="The same page at 2500, 1440, 1024 and 420 wide. Two cards become one column, the diagram stacks under the features, the panels crop to the phone’s edge, and the hero keeps the planet. Each one scrolls."
    >
      <Screens screens={SCREENS} />
      <div className="mt-4 grid gap-4 sm:mt-6 sm:grid-cols-[1fr_2fr] sm:gap-6">
        <Shot src={menu} alt="The phone menu: Team, Contact and a Get Started button over the top of the hero" sizes="(min-width: 640px) 33vw, 100vw" caption="The phone's menu." />
      </div>
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
