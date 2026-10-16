import type { ComponentType } from "react";
import { companies } from "./CompanyLogos";
import {
  Lifeline,
  type LifelineEvent,
  type LifelineEventSegment,
} from "./lifeline";
import { registerCompanyIcons } from "./lifeline/company-icon";
import { defineLifeline } from "./lifeline/lifeline-data";

// The marks on the rail are cut from the logo rows' own paths: `pick` is
// which of a logo's paths make up its mark, `viewBox` crops to them.
const logoMark = (
  name: string,
  viewBox: string,
  pick: number[] = [0]
): ComponentType<{ className?: string }> => {
  const paths = companies.find((company) => company.name === name)?.paths ?? [];
  return ({ className }) => (
    <svg viewBox={viewBox} fill="currentColor" aria-hidden="true" className={className}>
      {pick.map((index) => (
        <path key={index} d={paths[index]} />
      ))}
    </svg>
  );
};

// The rest come from each organisation's own logo (its site, Wikimedia
// Commons or Simple Icons), cut to the mark and kept in public/marks: SVGs
// rebuilt from their path data alone, PNGs trimmed. Drawn in ink like the
// others (brightness-0); Popcorn Time's bucket needs its stripes, so grey.
const imageMark =
  (file: string, tone = "brightness-0"): ComponentType<{ className?: string }> =>
  ({ className }) => (
    <img src={`/marks/${file}`} alt="" aria-hidden="true" className={`${className ?? ""} object-contain ${tone}`} />
  );

registerCompanyIcons({
  aerolab: { icon: logoMark("Aerolab", "-0.01 -0.1 20.74 17.96") },
  pachama: { icon: logoMark("Pachama", "0.98 0 58.13 65.9") },
  planta: { icon: logoMark("Planta", "0 0 20.3 24") },
  messa: { icon: logoMark("Messa", "0 0 795.79 689.18") },
  pausa: { icon: logoMark("Pausa", "59 40.54 393.5 431.77") },
  djooni: { icon: logoMark("Djooni", "0 0 330 331", [6, 7, 8, 9, 10, 11]) },
  earthscale: { icon: logoMark("Earthscale", "0 0 107 124", [0, 1, 2]) },
  limai: { icon: logoMark("Limai", "0 0 115 129", [0, 1, 2]) },
  fudo: {
    icon: logoMark("Fudo", "159.2 162.18 232.3 58.42"),
    sizeClassName: "h-3 w-12",
  },
  "arthur-newton": { icon: imageMark("arthur-newton.png"), sizeClassName: "h-6 w-[33px]" },
  adidas: { icon: imageMark("adidas.svg"), sizeClassName: "h-3.5 w-[22px]" },
  "popcorn-time": { icon: imageMark("popcorn-time.png", "grayscale contrast-125"), sizeClassName: "h-4 w-3" },
  platzi: { icon: imageMark("platzi.svg") },
  "digital-house": { icon: imageMark("digital-house.svg"), sizeClassName: "h-[9px] w-[117px]" },
  lullaby: { icon: imageMark("lullaby.svg"), sizeClassName: "h-4 w-3" },
  joya: { icon: imageMark("joya.png"), sizeClassName: "h-4 w-5" },
  bocho: { icon: imageMark("bocho.png"), sizeClassName: "h-4 w-[14px]" },
});

// Marks set inline after a line, in the text's own ink (currentColor), each
// cropped to its ink so the timeline can stand it on the baseline.

// Argentina's World Cup stars, one per title, 24 units apart.
const STAR_POINTS =
  "10,0.5 12.35,7.26 19.51,7.41 13.8,11.74 15.88,18.59 10,14.5 4.12,18.59 6.2,11.74 0.49,7.41 7.65,7.26";
const stars =
  (count: number): ComponentType<{ className?: string }> =>
  ({ className }) => (
    <svg viewBox={`0.49 0.5 ${24 * (count - 1) + 19.02} 18.09`} fill="currentColor" aria-hidden="true" className={className}>
      {Array.from({ length: count }, (_, index) => (
        <polygon key={index} points={STAR_POINTS} transform={`translate(${24 * index} 0)`} />
      ))}
    </svg>
  );

// The US flag in one ink, in its official proportions: 1.9 wide to 1 high,
// 13 stripes, the canton 0.76 wide and 7 stripes deep. The red stripes and
// the canton are ink, the white is the paper; its 50 stars would be
// sub-pixel at this size, so the canton is solid.
const FLAG_STRIPE = 100 / 13;
const FlagUs = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 190 100" fill="currentColor" aria-hidden="true" className={className}>
    {[0, 2, 4, 6, 8, 10, 12].map((stripe) => (
      <rect key={stripe} y={stripe * FLAG_STRIPE} width={190} height={FLAG_STRIPE} />
    ))}
    <rect width={76} height={7 * FLAG_STRIPE} />
  </svg>
);

const preview = (name: string, alt: string) => ({
  src: `/work/${name}-preview-poster.jpg`,
  video: `/work/${name}-preview.mp4`,
  alt,
});

const aerolab = { id: "aerolab", name: "Aerolab" };
const pachama = { id: "pachama", name: "Pachama" };
const joya = { id: "joya", name: "Joya" };

// From the site, LinkedIn (experience, education, projects, featured) and
// Alejandro himself.
const life = defineLifeline({
  slug: "alevizio",
  name: "Alejandro Vizio",
  birthYear: 1985,
  description: "A life in product and brand design, year by year.",
  milestones: {
    1985: {
      id: "born",
      events: ["born in Buenos Aires, Argentina."],
    },
    1986: {
      id: "spain",
      events: [
        "moved to Madrid, Spain.",
        {
          text: [
            { type: "text", value: "Argentina won the World Cup." },
            { type: "image", icon: stars(2), alt: "two stars: 1978 and 1986" },
          ],
          effect: "fireworks-argentina",
        },
      ],
    },
    1989: {
      id: "kings-college",
      events: [
        [
          { type: "text", value: "primary school at " },
          { type: "link", value: "King's College", href: "https://www.madrid-soto.kingscollegeschools.org/en" },
          { type: "text", value: " in Madrid." },
        ],
      ],
    },
    1995: {
      id: "us",
      events: ["moved to the US, to Lake Forest, Illinois.", "started junior high there."],
    },
    1998: {
      id: "back-home",
      events: [
        [
          { type: "text", value: "back to Buenos Aires, to " },
          { type: "link", value: "St George's College", href: "https://stgeorges.edu.ar/" },
          { type: "text", value: "." },
        ],
      ],
    },
    2000: {
      id: "djing",
      events: [
        [
          { type: "text", value: "started " },
          { type: "link", value: "djing", href: "https://soundcloud.com/alevizio" },
          { type: "text", value: " at fiestas de 15." },
        ],
      ],
    },
    2005: {
      id: "ort",
      events: [
        [
          { type: "text", value: "started graphic design at " },
          { type: "link", value: "ORT", href: "https://www.ort.edu.ar/" },
          { type: "text", value: "." },
        ],
      ],
    },
    2006: {
      id: "image-campus",
      events: [
        [
          { type: "text", value: "digital image design at " },
          { type: "link", value: "Image Campus", href: "https://www.imagecampus.edu.ar/" },
          { type: "text", value: "." },
        ],
      ],
    },
    2007: {
      id: "arthur-newton",
      companies: [{ id: "arthur-newton", name: "Arthur Newton Communications" }],
      events: [
        [
          { type: "text", value: "graphic designer at " },
          { type: "link", value: "Arthur Newton Communications", href: "https://www.arthur-newton.com/" },
          { type: "text", value: "." },
        ],
        [
          { type: "text", value: "a year of web design at " },
          { type: "link", value: "Image Campus", href: "https://www.imagecampus.edu.ar/" },
          { type: "text", value: "." },
        ],
      ],
    },
    2008: {
      id: "unr",
      companies: [{ id: "adidas", name: "adidas" }],
      events: [
        [
          { type: "text", value: "started visual communication design at " },
          { type: "link", value: "UNR", href: "https://unr.edu.ar/" },
          { type: "text", value: "." },
        ],
        [
          { type: "text", value: "ran " },
          { type: "link", value: "adidas", href: "https://www.adidas.com.ar/" },
          { type: "text", value: "' Proyecto Potreros at " },
          { type: "link", value: "Arthur Newton Communications", href: "https://www.arthur-newton.com/" },
          { type: "text", value: ": football pitches in 23 towns." },
        ],
      ],
    },
    2009: {
      id: "underground",
      events: ["art direction at Underground."],
    },
    2010: {
      id: "fip",
      events: [
        "Potreros won a silver FIP.",
      ],
    },
    2012: {
      id: "aerolab",
      companies: [aerolab],
      events: [
        [
          { type: "text", value: "joined " },
          { type: "link", value: "Aerolab", href: "https://aerolab.co/" },
          { type: "text", value: ", founded by " },
          { type: "link", value: "Roberto\u00a0Gonzalez", href: "https://www.linkedin.com/in/robertogonzalez/" },
          { type: "text", value: " and " },
          { type: "link", value: "Agustin\u00a0Linenberg", href: "https://www.linkedin.com/in/agustinlinenberg/" },
          { type: "text", value: ", as art director and third partner." },
        ],
      ],
    },
    2013: {
      id: "creative-director",
      companies: [aerolab],
      events: [
        [
          { type: "text", value: "creative director at " },
          { type: "link", value: "Aerolab", href: "https://aerolab.co/" },
          { type: "text", value: "." },
        ],
        [
          { type: "link", value: "Lemon Wallet", href: "https://en.wikipedia.org/wiki/Lemon_Wallet" },
          { type: "text", value: "'s marketing site." },
        ],
        [
          { type: "link", value: "Breach", href: "https://github.com/breach" },
          { type: "text", value: ", a browser in JavaScript, and " },
          { type: "link", value: "AcáNoHayLuz", href: "https://acanohayluz.com/" },
          { type: "text", value: ", a map of power cuts." },
        ],
      ],
    },
    2014: {
      id: "popcorn-time",
      companies: [aerolab, { id: "popcorn-time", name: "Popcorn Time" }],
      events: [
        [
          { type: "link", value: "Juani\u00a0Ruiz\u00a0Echazu", href: "https://www.linkedin.com/in/heyimjuani/" },
          { type: "text", value: " joined " },
          { type: "link", value: "Aerolab", href: "https://aerolab.co/" },
          { type: "text", value: " as the fourth partner." },
        ],
        [
          { type: "link", value: "Popcorn Time", href: "https://en.wikipedia.org/wiki/Popcorn_Time" },
          { type: "text", value: "." },
        ],
        [
          { type: "text", value: "took Popcorn Time to " },
          { type: "link", value: "Y Combinator", href: "https://www.ycombinator.com/" },
          { type: "text", value: " on my first trip to San Francisco; didn't get in." },
        ],
        [
          { type: "text", value: "the visuals for " },
          { type: "link", value: "JSConf Argentina", href: "https://aerolab.co/jsconf" },
          { type: "text", value: "." },
        ],
        "GestureKit and its Indiegogo launch.",
      ],
    },
    2015: {
      id: "galicia",
      companies: [aerolab, { id: "platzi", name: "Platzi" }],
      events: [
        [
          { type: "text", value: "the " },
          { type: "link", value: "Banco Galicia app", href: "https://aerolab.co/banco-galicia" },
          { type: "text", value: "." },
        ],
        [
          { type: "text", value: "the " },
          { type: "link", value: "Simple Radio", href: "https://aerolab.co/simpleradio" },
          { type: "text", value: " app." },
        ],
        [
          { type: "text", value: "taught " },
          { type: "link", value: "product design", href: "https://platzi.com/cursos/product-designer/" },
          { type: "text", value: " at " },
          { type: "link", value: "Platzi", href: "https://platzi.com/" },
          { type: "text", value: ", in Bogotá." },
        ],
      ],
    },
    2017: {
      id: "san-francisco",
      companies: [aerolab, { id: "digital-house", name: "Digital House" }],
      events: [
        [
          { type: "text", value: "moved to San Francisco as " },
          { type: "link", value: "Aerolab", href: "https://aerolab.co/" },
          { type: "text", value: "'s US manager." },
        ],
        [
          { type: "text", value: "taught UX design at " },
          { type: "link", value: "Digital House", href: "https://www.digitalhouse.com/" },
          { type: "text", value: "." },
        ],
        [
          { type: "text", value: "took " },
          { type: "link", value: "Pampa Warro", href: "https://pampawarro.org/" },
          { type: "text", value: " to " },
          { type: "link", value: "Fuego Austral", href: "https://fuegoaustral.org/" },
          { type: "text", value: ", for the first time." },
        ],
      ],
    },
    2018: {
      id: "aerolab-ceo",
      companies: [aerolab, { id: "lullaby", name: "Lullaby" }],
      events: [
        [
          { type: "text", value: "became " },
          { type: "link", value: "Aerolab", href: "https://aerolab.co/" },
          { type: "text", value: "'s CEO." },
        ],
        [
          { type: "link", value: "Cartoon Network's site", href: "https://aerolab.co/cartoon-network" },
          { type: "text", value: "." },
        ],
        "got my O-1 visa.",
        [
          { type: "link", value: "Lullaby", href: "https://uselullaby.com/" },
          { type: "text", value: ", a free treatment for tinnitus." },
        ],
        [
          { type: "link", value: "Singularity University", href: "https://www.su.org/" },
          { type: "text", value: "'s executive program in innovation." },
        ],
        [
          { type: "text", value: "joined " },
          { type: "link", value: "EO", href: "https://eonetwork.org/" },
          { type: "text", value: ", the Entrepreneurs' Organization." },
        ],
      ],
    },
    2019: {
      id: "silvestre",
      events: [
        "my son Silvestre was born.",
        "got my green card.",
        [
          { type: "text", value: "uploaded my first set to SoundCloud: " },
          { type: "link", value: "Tropical Disco", href: "https://soundcloud.com/alevizio/tropical-disco" },
          { type: "text", value: "." },
        ],
        [
          { type: "link", value: "Aerolab", href: "https://aerolab.co/" },
          { type: "text", value: " made Forbes Argentina's " },
          {
            type: "link",
            value: "30 Promesas",
            href: "https://www.forbesargentina.com/liderazgo/30-promesas-forbes-2019-emprendedores-estan-construyendo-futuro-n1324",
          },
          { type: "text", value: "." },
        ],
      ],
    },
    2020: {
      id: "pachama",
      companies: [pachama],
      events: [
        [
          { type: "text", value: "joined " },
          { type: "link", value: "Pachama", href: "https://pachama.com" },
          { type: "text", value: " as a product designer." },
        ],
      ],
    },
    2021: {
      id: "nngroup",
      events: [
        [
          { type: "text", value: "design systems with " },
          { type: "link", value: "Nielsen Norman Group", href: "https://www.nngroup.com/" },
          { type: "text", value: "." },
        ],
      ],
    },
    2022: {
      id: "friends-of-figma",
      companies: [joya],
      events: [
        [
          { type: "text", value: "gave “design systems para todos” at " },
          {
            type: "link",
            value: "Friends of Figma Medellín",
            href: "https://friends.figma.com/events/details/figma-medellin-presents-design-systems-para-todos/",
          },
          { type: "text", value: "." },
        ],
        [
          { type: "text", value: "took " },
          { type: "link", value: "Joya", href: "https://joya-art.org/" },
          { type: "text", value: ", an art piece, to " },
          { type: "link", value: "Burning Man", href: "https://burningman.org/" },
          { type: "text", value: "." },
        ],
        {
          text: [
            { type: "text", value: "Argentina won the World\u00a0Cup again." },
            { type: "image", icon: stars(3), alt: "three stars: 1978, 1986 and 2022" },
          ],
          effect: "fireworks-argentina",
        },
      ],
    },
    2023: {
      id: "complexchaos",
      events: [
        [
          { type: "text", value: "seed investor in " },
          { type: "link", value: "ComplexChaos", href: "https://www.builtinsf.com/company/complexchaos" },
          { type: "text", value: "." },
        ],
      ],
    },
    2024: {
      id: "senior",
      companies: [pachama],
      events: [
        [
          { type: "text", value: "senior product designer at " },
          { type: "link", value: "Pachama", href: "https://pachama.com" },
          { type: "text", value: "." },
        ],
        [
          { type: "text", value: "taught UX experts at " },
          { type: "link", value: "Mercado Libre", href: "https://www.mercadolibre.com.ar/" },
          { type: "text", value: ", with " },
          { type: "link", value: "Edison", href: "https://somosedison.com/" },
          { type: "text", value: "." },
        ],
      ],
    },
    2025: {
      id: "carbon-direct",
      companies: [{ id: "earthscale", name: "Earthscale" }, { id: "limai", name: "Limai" }, { id: "fudo", name: "Fudo" }],
      events: [
        [
          { type: "link", value: "Pachama", href: "https://pachama.com" },
          { type: "text", value: " was " },
          {
            type: "link",
            value: "acquired by Carbon Direct",
            href: "https://techcrunch.com/2025/11/10/consolidation-begins-to-hit-the-carbon-credit-market/",
          },
          { type: "text", value: "; stayed on as senior product designer." },
        ],
        [
          { type: "text", value: "product & brand for " },
          { type: "link", value: "Earthscale", href: "https://www.earthscale.ai/" },
          { type: "text", value: ", " },
          { type: "link", value: "Limai", href: "https://www.limai.io/" },
          { type: "text", value: " and " },
          { type: "link", value: "Fudo", href: "https://fu.do/" },
          { type: "text", value: "." },
        ],
        {
          text: [
            { type: "text", value: "became a US citizen." },
            { type: "image", icon: FlagUs, alt: "the flag of the United States" },
          ],
          effect: "fireworks",
        },
      ],
    },
    2026: {
      id: "now",
      companies: [{ id: "bocho", name: "Bocho" }, { id: "planta", name: "Planta" }, { id: "messa", name: "Messa" }, { id: "pausa", name: "Pausa" }, { id: "djooni", name: "Djooni" }],
      events: [
        [
          { type: "text", value: "founding designer at " },
          { type: "link", value: "Bocho", href: "https://www.bocho.com/" },
          { type: "text", value: " (" },
          { type: "link", value: "Planta", href: "https://www.planta.co/" },
          { type: "text", value: ")." },
        ],
        [
          { type: "text", value: "the website for " },
          { type: "link", value: "Messa", href: "https://messa.ai/" },
          { type: "text", value: ", product & brand for " },
          { type: "link", value: "Pausa", href: "https://www.pausa.co/" },
          { type: "text", value: "." },
        ],
        [
          { type: "text", value: "founding designer at " },
          { type: "link", value: "Djooni", href: "https://djooni.com" },
          { type: "text", value: "." },
        ],
        {
          text: [
            { type: "link", value: "globestudio", href: "https://globestudio.app" },
            { type: "text", value: " — open-source dotted maps & 3d globes." },
          ],
          image: preview("globestudio", "globestudio wrapping a dotted map into a globe"),
        },
        {
          text: [
            { type: "link", value: "curb", href: "https://curb.guide/" },
            { type: "text", value: " — know where to park in sf. in " },
            { type: "link", value: "SFGate", href: "https://www.sfgate.com/local/article/sf-street-sweeping-app-22317534.php" },
            { type: "text", value: " and " },
            { type: "link", value: "The Dissent SF", href: "https://thedissentsf.com/article/after-2-000-in-sweeping-tickets-a-haight-developer-read-the-city-s-own-data" },
            { type: "text", value: "." },
          ],
          image: { src: "/work/curb-og.jpg", alt: "curb, sweeping times block by block" },
        },
        {
          text: [
            { type: "link", value: "saboteurs", href: "https://saboteurs.app/" },
            { type: "text", value: " — squad stealth for iphone, in beta." },
          ],
          image: preview("saboteurs", "the saboteurs trailer"),
        },
      ],
    },
  },
});

// No widows: the last space of every event (wherever it falls, link or
// text) becomes a no-break space, so a last word never sits alone.
const glue = (value: string) => value.replace(/ (?=\S*$)/, "\u00a0");
const glueSegments = (segments: LifelineEventSegment[]) => {
  const last = segments
    .map((segment) => segment.type !== "image" && segment.value.includes(" "))
    .lastIndexOf(true);
  return segments.map((segment, index) =>
    index === last && segment.type !== "image" ? { ...segment, value: glue(segment.value) } : segment
  );
};
const glueEvent = (event: LifelineEvent): LifelineEvent => {
  if (typeof event === "string") return glue(event);
  if (Array.isArray(event)) return glueSegments(event);
  return {
    ...event,
    text: typeof event.text === "string" ? glue(event.text) : glueSegments(event.text),
  };
};

const markers = life.markers.map((marker) => ({
  ...marker,
  events: marker.events.map(glueEvent),
}));

export default function CareerTimeline() {
  return (
    // data-site-nav-inner: Lifeline ends the rail 24px inside this element's
    // right edge, so with the section full width it runs to the window's edge.
    <section
      data-site-nav-inner
      aria-labelledby="career-timeline"
      className="relative z-10 pb-[200px] lg:pb-[140px]"
    >
      {/* Set like the logo rows' labels, but at 70% ink (5.2:1) rather
          than their 50% (3.0:1), the same as the timeline's own text.
          data-site-nav-logo: Lifeline starts the rail where this text
          starts, on the page's 140px column; once it moves, the labels
          pin at the window's left edge. */}
      <h2
        id="career-timeline"
        className="px-[60px] text-[clamp(11px,1vw,13px)] font-normal tracking-[0.05em] text-foreground/70 md:px-[140px]"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <span data-site-nav-logo>how i got here</span>
      </h2>
      {/* Phones: the vertical list in the page's flow (no height, so its
          scroll box never scrolls); its own 24px gutter tops this up to the
          page's 60px, and the 200px below clears the pinned project cards.
          md+: the rail, the full width of the window. Once in view it plays
          Lifeline's intro, 1985 to 2026, and rests on 2026; the wheel
          scrubs it back while the pointer is on it. Its height fits the
          tallest year (2026: 465px) plus the timeline's 20px top padding;
          raise it if a year grows. */}
      <div className="px-[36px] md:h-[485px] md:px-0">
        <Lifeline
          mode="embed"
          markers={markers}
          birthYear={life.birthYear}
          title="timeline, 1985 to 2026"
          className="h-full"
        />
      </div>
    </section>
  );
}
