import ecologyEconomy from "@/assets/brand/reveal-ecology-economy.jpg";
import fromTo from "@/assets/brand/reveal-from-to.jpg";
import socialEditorial from "@/assets/brand/social/editorial.jpg";
import socialInfographic from "@/assets/brand/social/infographic.jpg";
import socialOverview from "@/assets/brand/social/overview.jpg";
import socialTech from "@/assets/brand/social/tech.jpg";
import book from "@/assets/howhow/book-sv.jpg";
import economy from "@/assets/howhow/economy-sv.jpg";
import exhibition from "@/assets/howhow/exhibition-l.jpg";
import ipad from "@/assets/howhow/ipad-sv.jpg";
import ooh from "@/assets/howhow/ooh-l.jpg";
import phone from "@/assets/howhow/phone-sv.jpg";
import sign from "@/assets/howhow/sign-sv.jpg";
import technology from "@/assets/howhow/technology-l.jpg";
import testimonial from "@/assets/howhow/testimonial-s.jpg";
import zoom from "@/assets/howhow/zoom-l.jpg";
import { cn } from "../_components/cn";
import { GuidelinesWall } from "../_components/guidelines-wall";
import { HeightGauge } from "../_components/height-gauge";
import { LaptopScroll } from "../_components/laptop-scroll";
import { MarkExplorer } from "../_components/mark-explorer";
import { NatureRelations } from "../_components/nature-relations";
import { Moodboard } from "../_components/moodboard";
import { SeeCarbon } from "../_components/see-carbon";
import { Palette } from "../_components/palette";
import { Slider } from "../_components/slider";
import { BLEED, Clip, HALF, Masonry, Shot } from "../_components/shot";
import { Band, ChapterDivider, Row, Section } from "../_components/story";
import { TypePoster } from "../_components/type-poster";
import { TypeSpecimen } from "../_components/type-specimen";

/** The brand's own SVG on a tile of the ground it was drawn for. */
const LogoTile = ({ src, alt, tile, logo, caption }: { src: string; alt: string; tile: string; logo: string; caption?: string }) => (
  <figure>
    <div className={cn("flex aspect-[4/3] items-center justify-center rounded-[10px]", tile)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- vector logos, sharp at any size */}
      <img src={src} alt={alt} className={logo} />
    </div>
    {caption ? <figcaption className="type-caption mt-3 text-(--tone-text)">{caption}</figcaption> : null}
  </figure>
);

// How&How's portrait split format, 1494 × 1700.
const SPLIT = "aspect-[1494/1700]";

/* I · The brand, made in collaboration with How&How and FNDR: FNDR's
 * strategy, How&How's identity, motion, mockups and site, and Alejandro
 * carrying it into everything Pachama made. The hand-over and the stills and
 * loops from how.studio/branding/pachama are How&How's, shown with their
 * permission. */
// Social: the three kinds of post, in the toolkit's words, and each
// template's overview from the Brand Assets file.
const POST_TYPES = [
  { name: "Editorial", kicker: "Human stories", text: "Article headlines, quotes, events, project features and brand awareness." },
  { name: "Infographic", kicker: "Proof and results", text: "Explainers, graphs and statistics." },
  { name: "Tech", kicker: "How we do it", text: "Project mapping, updates and reports, and product vignettes." },
];
const TEMPLATES = [
  { src: socialEditorial, alt: "Editorial posts: 'Building a future-proof nature portfolio', an event card, a quote, 'Restoring balance' and a project spotlight" },
  { src: socialInfographic, alt: "Infographic posts: a climate action explainer, $23.7 million invested in forest carbon, and a chart of nature as a climate solution" },
  { src: socialTech, alt: "Tech posts: a project mapped on satellite imagery, the Originals trees, a carbon card and a park's parcels" },
];

// Half the window: the applications run edge to edge in two columns.
const EDGE_HALF = "(min-width: 640px) 50vw, 100vw";

export const Brand = () => (
  <Band tone="ground">
    <ChapterDivider id="brand" numeral="I" title="The brand">
      Made in collaboration with How&amp;How and FNDR: FNDR&apos;s strategy, How&amp;How&apos;s identity, and see carbon in
      action carried into everything Pachama&nbsp;made.
    </ChapterDivider>

    <Section
      id="before"
      eyebrow="Where it started"
      title="A climate startup that looked like one"
      text="A thin green flower in a hexagon, Recoleta and Proxima Nova: the identity the rebrand grew out of."
    >
      <Row>
        <LogoTile src="/brand/old-logo-color.svg" alt="The original Pachama logo: a thin green flower in a hexagon and a geometric wordmark" tile="bg-sheet" logo="w-3/5" caption="Before: the original mark." />
        <LogoTile src="/brand/logo-light.svg" alt="The redrawn Pachama logo with its leaf-to-sky gradient" tile="bg-sheet" logo="w-3/5" caption="After: How&How's redraw, in one gradient." />
      </Row>
    </Section>

    <Section
      id="strategy"
      eyebrow="The strategy"
      title="From carbon offsetting to Nature Relations"
      text="FNDR's narrative, from the deck that revealed the rebrand inside Pachama: business and nature in one relationship, ecology and economy from the same root."
    >
      <NatureRelations />
      <Row className="mt-6">
        <Shot src={ecologyEconomy} alt="'Ecology + Economy': a forest and a city plaza joined by a gradient bar, 'studying our home' and 'managing our home'" sizes={HALF} caption="Both words come from oikos, home." />
        <Shot src={fromTo} alt="A from-to list: from singular transactions and carbon offsetting to original action and Nature Relations" sizes={HALF} caption="The shift, from offsetting to Nature Relations." />
      </Row>
    </Section>

    <Section
      id="idea"
      eyebrow="The idea"
      title="See carbon in action"
      text="FNDR's strategy put nature and data in the same sentence. How&How turned it into a headline and a way of drawing: the forest, and the carbon in it, made visible."
    >
      <SeeCarbon />
    </Section>

    <Section
      id="mark"
      eyebrow="The mark"
      title="Circles and hexagons, a flower and a leaf"
      text="Formal geometry overlapping like a Venn diagram: nature, technology and community, in one gradient from leaf to sky."
    >
      <Clip name="howhow/logo-l" label="The Pachama logo drawing itself" aspect="aspect-video" bleed />
      {/* Straight under the logo film, on the same pine: one field, no seam
       * (so it doesn't open on its own as it arrives). */}
      <div className={BLEED}>
        <MarkExplorer />
      </div>
    </Section>

    <Section
      id="language"
      eyebrow="The graphic language"
      title="Particles, lidar and a mesh over the land"
      text="Trees turned to points, lidar's colours, and grids that drape over the terrain with the carbon counted on top."
    >
      <Masonry cols={2}>
        <Clip name="howhow/particles-s" label="'Not just a tree': a tree at sunset dissolving into particles" aspect="aspect-square" />
        <Clip name="howhow/lidar-sv" label="'Lidar inspired': a tree in lidar points on dark green" aspect={SPLIT} />
      </Masonry>
    </Section>

    <Section
      id="colour-type"
      eyebrow="Colour and type"
      title="A dark green ground, a gradient and a spectrum"
      text="Chromatic Condensed by Colophon for the headlines, in capitals; Matter and Matter Mono by Displaay for text and numbers."
    >
      <Row className="items-start">
        <HeightGauge />
        <TypePoster />
      </Row>
      <Row className="mt-6">
        <Palette />
        <TypeSpecimen />
      </Row>
      <Moodboard className="mt-6" />
    </Section>

    <Section
      id="illustration"
      eyebrow="Illustration"
      title="One tree at a time"
      text="Trees traced from lidar and named for where they grow, the same drawings that became Pachama Originals."
    >
      <Row className="items-start">
        <Clip name="howhow/illustration-sv" label="Tree illustrations, one after another: the tualang of Indonesia and others" aspect={SPLIT} />
        <Clip name="howhow/particlecrop-sv" label="A close crop of a trunk, its bark breaking into particles" aspect={SPLIT} />
      </Row>
    </Section>

    <Section
      id="applications"
      eyebrow="Applications"
      title="Out in the world"
      text="Billboards, an exhibition, signage, the brand book, phones, an iPad, socials and the people behind the projects."
    >
      <Shot src={ooh} alt="A billboard on a city building: 'See carbon in action' over aerial forest" bleed />
      <Masonry cols={2} className={cn(BLEED, "mt-6 px-4 sm:px-6")}>
        <Shot src={exhibition} alt="An exhibition room with large screens of lidar trees and the line 'While trees may be temporary'" sizes={EDGE_HALF} />
        <Shot src={sign} alt="An acrylic sign: 'Make the invisible visible'" sizes={EDGE_HALF} />
        <Shot src={book} alt="The brand book, 'Beyond carbon', a hardcover on a dark table" sizes={EDGE_HALF} />
        <Shot src={ipad} alt="The brand on an iPad lying on plywood" sizes={EDGE_HALF} />
        <Clip name="howhow/socials-l" label="Social posts for the brand, moving" aspect="aspect-video" />
        <Shot src={phone} alt="A hand holding a phone open on 'The new nature of modern business'" sizes={EDGE_HALF} />
        <Shot src={testimonial} alt="A portrait for the brand: a man in a Pachama shirt against a giant tree trunk" sizes={EDGE_HALF} />
        <Shot src={economy} alt="An 'Economy' card over a photograph of a farmer among tall plants" sizes={EDGE_HALF} />
        <Clip name="howhow/services-sv" label="A mangrove tree on its stilt roots at dusk" aspect={SPLIT} />
      </Masonry>
    </Section>

    <Section
      id="social"
      eyebrow="Social"
      title="Three kinds of post"
      text="An audit of Pachama's channels, then a toolkit: seven categories of post, from events and partnerships to product vignettes, each made from one of three templates."
    >
      <Shot src={socialOverview} alt="The social toolkit at work: 'Building a future-proof nature portfolio', 'See carbon in action', a project card and a chart" bleed />
      <ul data-stagger className="mt-14 grid gap-10 sm:grid-cols-3">
        {POST_TYPES.map((t) => (
          <li key={t.name} data-reveal>
            <p className="font-display text-[44px] leading-none font-bold text-(--tone-head)">{t.name}</p>
            <p className="type-label mt-3 text-(--tone-label)">{t.kicker}</p>
            <p className="type-body mt-3 text-(--tone-text)">{t.text}</p>
          </li>
        ))}
      </ul>
      <Slider label="Each template's posts" slides={TEMPLATES} sizes="(min-width: 1024px) 64vw, 86vw" className="mt-12" />
    </Section>

    <Section
      id="site"
      eyebrow="The website"
      title="Restore nature. Remove carbon."
      text="The new pachama.com, designed with How&How: the projects, the science and the numbers, on the same dark ground as everything else."
    >
      <LaptopScroll caption="The homepage, top to bottom, from the site's Figma, on How&How's laptop. Point at it to hold it." />
      <Masonry cols={2} className="mt-6">
        <Clip name="howhow/ui-l" label="The site's map: a satellite view with project cards" aspect="aspect-video" />
        <Shot src={zoom} alt="'Restore nature.' on a frosted card over a forest" sizes={HALF} />
        <Clip name="howhow/dashboard-s" label="The dashboard on screens in an office" aspect="aspect-square" />
        <Clip name="howhow/locations-l" label="A project card: King County Parks, 65,966 tonnes of CO₂" aspect="aspect-video" />
        <Shot src={technology} alt="'Ambient trees': a lidar tree in a card" sizes={HALF} />
        <Clip name="howhow/process-l" label="The process explained, step by step, over a forest" aspect="aspect-video" />
      </Masonry>
      <Clip name="howhow/worldscale" label="Projects across the world, at scale" aspect="aspect-video" className="mt-6" caption="Brand, motion and site by How&How, in collaboration with Pachama." bleed />
    </Section>

    <Section
      id="rollout"
      eyebrow="My part"
      title="Taking it in-house"
      text="Working with How&How and FNDR from Pachama's side: the brief, then the identity carried into the product, the site, the booth and everything printed, all of it set down in the brand guidelines."
    >
      <GuidelinesWall />
    </Section>
  </Band>
);
