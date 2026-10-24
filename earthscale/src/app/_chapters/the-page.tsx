import cta from "@/assets/page/cta.webp";
import desktop from "@/assets/page/desktop.webp";
import explore from "@/assets/page/explore.webp";
import menu from "@/assets/page/menu.webp";
import mobile from "@/assets/page/mobile.webp";
import proof from "@/assets/page/proof.webp";
import tablet from "@/assets/page/tablet.webp";
import team from "@/assets/page/team.webp";
import who from "@/assets/page/who.webp";
import wide from "@/assets/page/wide.webp";
import { Pipeline } from "../_components/pipeline";
import { Screens } from "../_components/screens";
import { Shot } from "../_components/shot";
import { Band, ChapterDivider, Section } from "../_components/story";

// The serve section's three features, as the page words them.
const FEATURES = [
  { n: "01", title: "High-Performance Tile Serving", text: "Optimize your data for low latency tile-serving at scale, right where it lives, boosting performance and avoiding egress costs. Fully compatible with frameworks like Mapbox GL, Leaflet, and Cesium." },
  { n: "02", title: "Zero Copy, Optimized in Minutes", text: "Connect your geospatial data sources for high-performance serving in seconds. Native support for multi-dimensional datasets included. Supports on-demand reading and task optimized caching." },
  { n: "03", title: "Seamless Integration via API & Python Client", text: "Register and query datasets programmatically through a robust API or Python client. Fetch pixel-level values, time series, and more, ready to plug into your applications and workflows." },
];

const SCREENS = [
  { src: wide, alt: "The landing page at 2500 pixels wide", label: "2500 wide", sizes: "(min-width: 1024px) 25vw, 50vw" },
  { src: desktop, alt: "The landing page at 1440 pixels wide", label: "1440 wide", sizes: "(min-width: 1024px) 25vw, 50vw" },
  { src: tablet, alt: "The landing page at 1024 pixels wide, a tablet", label: "1024, tablet", sizes: "(min-width: 1024px) 25vw, 50vw" },
  { src: mobile, alt: "The landing page at 420 pixels wide, a phone", label: "420, phone", sizes: "(min-width: 1024px) 25vw, 50vw" },
];

/* Chapter III: the page, section by section, at every width, and its
 * second page. */
export const ThePage = () => (
  <Band tone="ground">
    <ChapterDivider id="page" numeral="III" title="The page">
      Nine sections, top to bottom, and the same page at four widths.
    </ChapterDivider>

    <Section
      id="proof"
      eyebrow="Proof"
      title="Logos, then a founder’s word"
      text="Under the hero, the companies on the platform, and a line from Diego Saez Gil, Pachama’s founder, who had used Earthscale to turn satellite imagery into something a team could act on. The quote is the one thing the page says that Earthscale doesn’t say about itself."
    >
      <Shot src={proof} alt="The logos row, Pachama, Linear and Vercel, under the line Powering leading Earth Intelligence companies, and a quote from Diego Saez Gil, founder and CEO of Pachama" caption="Logos and the quote." zoom />
    </Section>

    <Section
      id="who"
      eyebrow="Who it’s for"
      title="Teams, and the organisations behind them"
      text="Two cards, one hairline each, with a small icon and a tag: product, data and engineering teams building with geospatial data, and organisations pioneering Earth intelligence. The title in mint, the text in pale green."
    >
      <Shot src={who} alt="The section Made for Geospatial Developers: two hairline cards, For Teams and For Organizations" caption="Who it's for." zoom />
    </Section>

    <Section
      id="serve"
      eyebrow="Serve"
      title="Three features and the pipeline"
      text="Serve Data at Scale, Instantly: tile serving, zero-copy optimisation, and the API and Python client, next to a diagram that doubles as the documentation. Cloud storage and a database feed the client, and the client returns a tile source any map library can read. The diagram runs here as it runs on the page."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <ol data-stagger className="hairline self-start rounded-[10px] p-6 sm:p-8">
          {FEATURES.map(({ n, title, text }) => (
            <li key={n} data-reveal className="border-t border-rule py-6 first:border-t-0 first:pt-0 last:pb-0">
              <p className="type-label text-haze">{n}</p>
              <p className="mt-3 font-sans text-xl leading-snug text-mint">{title}</p>
              <p className="type-caption mt-2 text-(--tone-text)">{text}</p>
            </li>
          ))}
        </ol>
        <Pipeline />
      </div>
    </Section>

    <Section
      id="explore"
      eyebrow="Explore"
      title="The product, shown working"
      text="Innovate Faster. Ship Confidently: the visual explorer with its layers, time slider and pixel information laid over a wind field, then registering a dataset in four steps, and a comment thread on a tile. The panels are the real ones."
    >
      <Shot src={explore} alt="The section Innovate Faster, Ship Confidently: the product's panels over a wind field, then two cards, Instant Dataset Registration and Cataloging, Maps and Comments" caption="The explore section." zoom />
    </Section>

    <Section
      id="ask"
      eyebrow="The ask"
      title="One line, one button, and the planet again"
      text="Bring Earth Intelligence to life, start building with Earthscale today. The footer repeats the email field over the planet’s limb, so the page ends where it began."
    >
      <Shot src={cta} alt="The closing call to action over the planet's limb, and the footer with the Earthscale wordmark and the email field" caption="The ask and the footer." zoom />
    </Section>

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
