import dotGrid from "@/assets/brand/dot-grid.jpg";
import hexGrid from "@/assets/brand/hex-grid.jpg";
import seeCarbon from "@/assets/brand/see-carbon-hero.jpg";
import { Palette } from "../_components/palette";
import { cn } from "../_components/cn";
import { HALF, Shot } from "../_components/shot";
import { Band, ChapterDivider, Row, Section, Slot } from "../_components/story";

/** The brand's own SVG on a tile of the ground it was drawn for. */
const LogoTile = ({ src, alt, tile, logo }: { src: string; alt: string; tile: string; logo: string }) => (
  <div className={cn("flex aspect-[4/3] items-center justify-center rounded-[10px]", tile)}>
    {/* eslint-disable-next-line @next/next/no-img-element -- vector logos, sharp at any size */}
    <img src={src} alt={alt} className={logo} />
  </div>
);

/* I · The brand: FNDR's strategy, How&How's identity, and carrying it into
 * everything Pachama made. The images are How&How's hand-over, used with
 * their permission; the in-house part is to confirm with Alejandro. */
export const Brand = () => (
  <Band tone="ground">
    <ChapterDivider id="brand" numeral="I" title="The brand">
      An identity by How&amp;How, from FNDR&apos;s strategy: see carbon in action, carried into everything Pachama&nbsp;made.
    </ChapterDivider>

    <Section
      id="before"
      eyebrow="Where it started"
      title="A climate startup that looked like one"
      text="Recoleta, Proxima Nova and a lot of green: the identity the rebrand replaced."
    >
      <Slot label="The old identity, side by side with the new" source="Dropbox /Pachama/Logo/OLD · to pick" />
    </Section>

    <Section
      id="idea"
      eyebrow="The idea"
      title="See carbon in action"
      text="FNDR's strategy put nature and data in the same sentence. How&How turned it into a headline and a way of drawing: the forest, and the carbon in it, made visible."
    >
      <Shot src={seeCarbon} alt="The new site's hero: 'See carbon in action.' over an aerial view of a river through wetland forest" caption="How&How's hero for the new site." />
    </Section>

    <Section
      id="mark"
      eyebrow="The mark"
      title="Circles and hexagons, a flower and a leaf"
      text="Formal geometry overlapping like a Venn diagram: nature, technology and community, in one gradient from leaf to sky."
    >
      <Row cols={3}>
        <LogoTile src="/brand/symbol-dark.svg" alt="The Pachama symbol: a flower of circles inside a hexagon, from green to sky" tile="bg-night" logo="w-1/4" />
        <LogoTile src="/brand/logo-dark.svg" alt="The Pachama logo on the dark green ground" tile="bg-deep" logo="w-3/5" />
        <LogoTile src="/brand/logo-light.svg" alt="The Pachama logo on white" tile="bg-sheet" logo="w-3/5" />
      </Row>
    </Section>

    <Section
      id="grids"
      eyebrow="The grids"
      title="A mesh laid over the land"
      text="A hex grid and a dot grid that drape over the terrain, with the carbon counted on top: the idea, drawn."
    >
      <Row>
        <Shot src={hexGrid} alt="'See carbon in action' beside an aerial forest with a hexagonal mesh draped over it and a counter of tonnes" sizes={HALF} caption="The hex grid." />
        <Shot src={dotGrid} alt="The same hero with a dot grid draped over the forest in the spectrum's colours" sizes={HALF} caption="The dot grid." />
      </Row>
    </Section>

    <Section
      id="colour-type"
      eyebrow="Colour and type"
      title="A dark green ground, a gradient and a spectrum"
      text="Set in Matter, Matter SQ and Matter Mono, from Displaay."
    >
      <Row>
        <Palette />
        <Slot label="Matter, Matter SQ and Matter Mono, set" source="Figma · Pachama_Brand Guidelines_HO" aspect="aspect-[4/5]" />
      </Row>
    </Section>

    <Section
      id="rollout"
      eyebrow="My part"
      title="Taking it in-house"
      text="To confirm: the brief, the rollout into the product, the brand library in Figma, and everything printed."
    >
      <Slot label="The brand library in Figma: components, patterns, templates" source="Figma · Pachama_Brand Library_HO" />
    </Section>
  </Band>
);
