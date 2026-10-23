import dotGrid from "@/assets/brand/dot-grid.jpg";
import guidelines1 from "@/assets/brand/guidelines-1.jpg";
import guidelines13 from "@/assets/brand/guidelines-13.jpg";
import guidelines26 from "@/assets/brand/guidelines-26.jpg";
import guidelines46 from "@/assets/brand/guidelines-46.jpg";
import guidelines6 from "@/assets/brand/guidelines-6.jpg";
import guidelines68 from "@/assets/brand/guidelines-68.jpg";
import guidelines83 from "@/assets/brand/guidelines-83.jpg";
import hexGrid from "@/assets/brand/hex-grid.jpg";
import logoSheet from "@/assets/brand/logo-sheet.jpg";
import originalsSheet from "@/assets/brand/originals-sheet.jpg";
import plusSheet from "@/assets/brand/plus-sheet.jpg";
import ecologyEconomy from "@/assets/brand/reveal-ecology-economy.jpg";
import fromTo from "@/assets/brand/reveal-from-to.jpg";
import moodboard from "@/assets/brand/reveal-moodboard.jpg";
import natureRelations from "@/assets/brand/reveal-nature-relations.jpg";
import seeCarbon from "@/assets/brand/see-carbon-hero.jpg";
import symbolColourways from "@/assets/brand/symbol-colourways.jpg";
import symbolSheet from "@/assets/brand/symbol-sheet.jpg";
import websiteHome from "@/assets/brand/website-home.jpg";
import book from "@/assets/howhow/book-sv.jpg";
import economy from "@/assets/howhow/economy-sv.jpg";
import exhibition from "@/assets/howhow/exhibition-l.jpg";
import ipad from "@/assets/howhow/ipad-sv.jpg";
import ooh from "@/assets/howhow/ooh-l.jpg";
import phone from "@/assets/howhow/phone-sv.jpg";
import sign from "@/assets/howhow/sign-sv.jpg";
import technology from "@/assets/howhow/technology-l.jpg";
import testimonial from "@/assets/howhow/testimonial-s.jpg";
import typePoster from "@/assets/howhow/type-sv.jpg";
import web from "@/assets/howhow/web-l.jpg";
import zoom from "@/assets/howhow/zoom-l.jpg";
import { cn } from "../_components/cn";
import { Palette } from "../_components/palette";
import { BLEED, Clip, HALF, Masonry, Shot, TallShot, THIRD } from "../_components/shot";
import { Band, ChapterDivider, Row, Section } from "../_components/story";
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
      <Shot src={natureRelations} alt="'We call this Nature Relations.' beside a tree drawn in coloured lidar points" caption="The central idea: a new relationship between businesses and nature." bleed />
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
      <Row className="items-start">
        <Clip name="howhow/landing-s" label="'See carbon in action' over a tree drawn in coloured lidar points" aspect="aspect-square" />
        <Shot src={seeCarbon} alt="The new site's hero: 'See carbon in action.' over an aerial view of a river through wetland forest" sizes={HALF} caption="The site's hero, from the hand-over." />
      </Row>
    </Section>

    <Section
      id="mark"
      eyebrow="The mark"
      title="Circles and hexagons, a flower and a leaf"
      text="Formal geometry overlapping like a Venn diagram: nature, technology and community, in one gradient from leaf to sky."
    >
      <Clip name="howhow/logo-l" label="The Pachama logo drawing itself" aspect="aspect-video" bleed />
      <div data-reveal="frame" className={cn(BLEED, "mt-6 grid sm:grid-cols-3")}>
        <LogoTile src="/brand/symbol-dark.svg" alt="The Pachama symbol: a flower of circles inside a hexagon, from green to sky" tile="rounded-none bg-night" logo="w-1/4" />
        <LogoTile src="/brand/logo-dark.svg" alt="The Pachama logo on the dark green ground" tile="rounded-none bg-deep" logo="w-3/5" />
        <LogoTile src="/brand/logo-light.svg" alt="The Pachama logo on white" tile="rounded-none bg-sheet" logo="w-3/5" />
      </div>
      <Masonry cols={2} className="mt-6">
        <Shot
          src={symbolColourways}
          alt="The symbol six ways: light, green and gradient on the dark green; dark and gradient on light; dark on lidar green"
          caption="The symbol on every ground it's allowed on."
          sizes={HALF}
          zoom
        />
        <Shot
          src={symbolSheet}
          alt="The symbol's sheet: 'Our beloved mandala that represents earth's mother, the pachamama', its two-colour and one-colour versions on light, dark and green"
          caption="The symbol: 'our beloved mandala that represents earth's mother, the pachamama.'"
          sizes={HALF}
          zoom
        />
        <Shot
          src={logoSheet}
          alt="The logo's sheet: the isologotype's construction, its two-colour gradient from #52F164 to #52D5FF at 45 degrees, and its one-colour versions on light, dark green and lidar green"
          caption="The logo's versions and colours."
          sizes={HALF}
          zoom
        />
        <Shot src={originalsSheet} alt="The Pachama Originals sub-brand: the symbol beside 'Pachama Originals', in one colour on light, dark and green" caption="Pachama Originals, a sub-brand." sizes={HALF} zoom />
        <Shot src={plusSheet} alt="The Pachama Plus sub-brand: the symbol beside 'Pachama Plus', in one colour on light, dark and green" caption="Pachama Plus, another." sizes={HALF} zoom />
      </Masonry>
    </Section>

    <Section
      id="language"
      eyebrow="The graphic language"
      title="Particles, lidar and a mesh over the land"
      text="Trees turned to points, lidar's colours, and grids that drape over the terrain with the carbon counted on top."
    >
      <Masonry cols={2}>
        <Clip name="howhow/particles-s" label="'Not just a tree': a tree at sunset dissolving into particles" aspect="aspect-square" />
        <Shot src={hexGrid} alt="'See carbon in action' beside an aerial forest with a hexagonal mesh draped over it and a counter of tonnes" sizes={HALF} caption="The hex grid." />
        <Clip name="howhow/lidar-sv" label="'Lidar inspired': a tree in lidar points on dark green" aspect={SPLIT} />
        <Shot src={dotGrid} alt="The same hero with a dot grid draped over the forest in the spectrum's colours" sizes={HALF} caption="The dot grid." />
      </Masonry>
    </Section>

    <Section
      id="colour-type"
      eyebrow="Colour and type"
      title="A dark green ground, a gradient and a spectrum"
      text="Chromatic Condensed by Colophon for the headlines, in capitals; Matter and Matter Mono by Displaay for text and numbers."
    >
      <Row className="items-start">
        <Clip name="howhow/colour-sv" label="The palette, animated" aspect={SPLIT} />
        <Shot src={typePoster} alt="A type poster: 'While trees may be temporary, forests stand the test of time.'" sizes={HALF} />
      </Row>
      <Row className="mt-6">
        <Palette />
        <TypeSpecimen />
      </Row>
      <Shot
        src={moodboard}
        alt="A moodboard of iridescent things: a beetle, a hummingbird, a shell, an insect's eye, a begonia and a rainbow, beside lidar scans of forest"
        caption="The moodboard: iridescent animals and plants beside lidar scans, where the spectrum came from."
        className="mt-6"
      bleed
      />
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

    <Section id="brand-book" eyebrow="The brand book" title="Beyond carbon" text="The guidelines, bound and on screen.">
      <Row className="items-start">
        <Shot src={book} alt="The brand book, 'Beyond carbon', a hardcover on a dark table" sizes={HALF} />
        <Shot src={ipad} alt="The brand on an iPad lying on plywood" sizes={HALF} />
      </Row>
    </Section>

    <Section
      id="applications"
      eyebrow="Applications"
      title="Out in the world"
      text="Billboards, an exhibition, signage, phones, socials and the people behind the projects."
    >
      <Shot src={ooh} alt="A billboard on a city building: 'See carbon in action' over aerial forest" bleed />
      <Masonry className="mt-6">
        <Shot src={exhibition} alt="An exhibition room with large screens of lidar trees and the line 'While trees may be temporary'" sizes={THIRD} />
        <Shot src={sign} alt="An acrylic sign: 'Make the invisible visible'" sizes={THIRD} />
        <Clip name="howhow/socials-l" label="Social posts for the brand, moving" aspect="aspect-video" />
        <Shot src={phone} alt="A hand holding a phone open on 'The new nature of modern business'" sizes={THIRD} />
        <Shot src={testimonial} alt="A portrait for the brand: a man in a Pachama shirt against a giant tree trunk" sizes={THIRD} />
        <Shot src={economy} alt="An 'Economy' card over a photograph of a farmer among tall plants" sizes={THIRD} />
        <Clip name="howhow/services-sv" label="A mangrove tree on its stilt roots at dusk" aspect={SPLIT} />
      </Masonry>
    </Section>

    <Section
      id="site"
      eyebrow="The website"
      title="Restore nature. Remove carbon."
      text="The new pachama.com, designed with How&How: the projects, the science and the numbers, on the same dark ground as everything else."
    >
      <TallShot
        src={websiteHome}
        label="The pachama.com homepage, scrollable"
        alt="The pachama.com homepage design: 'Restore nature. Remove carbon.' over an aerial river, 'See carbon in action' with a lidar tree and an emissions chart, the companies choosing Pachama, the technology, a BCG quote, resources and the footer"
        caption="The homepage, top to bottom, from the site's Figma. Scroll inside it."
      />
      <Shot src={web} alt="The new site on a laptop among leaves: 'Restore nature. Remove carbon.'" className="mt-10" bleed />
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
      <Row cols={3} className="items-start">
        <Shot src={guidelines1} alt="The brand guidelines' cover: 'Brand guidelines, version 1.0, December 2023'" sizes={THIRD} caption="Version 1.0, December 2023." zoom />
        <Shot src={guidelines6} alt="A guidelines page on logo placement: left or centre, aligned to the canvas margins, never on the right" sizes={THIRD} caption="Logo placement." zoom />
        <Shot src={guidelines13} alt="A guidelines page on the primary palette: lidar green, eggshell, white and pine" sizes={THIRD} caption="The primary palette." zoom />
        <Shot src={guidelines26} alt="A guidelines page on numbers and eyebrow headings: baseline emissions, project emissions and emission reductions set large in Matter" sizes={THIRD} caption="Numbers and eyebrows." zoom />
        <Shot src={guidelines46} alt="A guidelines page on technology imagery: ambient trees, landscape scanning and aerial reveal" sizes={THIRD} caption="Technology imagery." zoom />
        <Shot src={guidelines68} alt="A guidelines page on charts: stacked bars, area lines and rings in the brand's greens and greys" sizes={THIRD} caption="Charting." zoom />
      </Row>
      <Shot src={guidelines83} alt="A guidelines page on art direction: five categories of photograph, aerial, cinematic, landscape, perspective and detail" caption="Art direction, in five kinds of photograph." className="mt-6" zoom />
    </Section>
  </Band>
);
