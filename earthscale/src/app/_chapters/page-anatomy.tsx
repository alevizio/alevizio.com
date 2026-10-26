import catalog from "@/assets/page/anat/06-catalog.webp";
import explore from "@/assets/page/anat/05-explore.webp";
import ask from "@/assets/page/anat/07-ask.webp";
import hero from "@/assets/page/anat/01-hero.webp";
import planet from "@/assets/page/anat/planet.webp";
import proof from "@/assets/page/anat/02-proof.webp";
import serve from "@/assets/page/anat/04-serve.webp";
import who from "@/assets/page/anat/03-who.webp";
import type { StaticImageData } from "next/image";
import type { Mark, Piece } from "../_components/anatomy";
import { AskLine } from "../_components/anat-ask";
import { ButtonStates, EmailLoop, Headline, Wordmark } from "../_components/anat-hero";
import { LogosRow, Quote } from "../_components/anat-proof";
import { FeatureList } from "../_components/anat-serve";
import { TagRoll, WhoCards } from "../_components/anat-who";
import { Drift } from "../_components/drift";
import { EditPanel } from "../_components/edit-panel";
import { LayersPanel } from "../_components/layers-panel";
import { MapStack } from "../_components/map-stack";
import { Pipeline } from "../_components/pipeline";
import { PixelPanel } from "../_components/pixel-panel";
import { Register } from "../_components/register";
import { SubMenu } from "../_components/sub-menu";
import { Thread } from "../_components/thread";

/* The landing page, section by section, as the chapter takes it apart: each
 * section's sheet from the file, the marks over it in the page's pixels, and
 * the pieces rebuilt under it. */
type Taken = { id: string; eyebrow: string; title: string; text: string; sheet: StaticImageData; alt: string; height: number; marks: Mark[]; pieces: Piece[] };

export const SECTIONS: Taken[] = [
  {
    id: "hero",
    eyebrow: "The hero",
    title: "Earth first, then the tools",
    text: "The planet under a wind field, the headline over it, one field to sign up. The product comes after.",
    sheet: hero,
    alt: "The top of the page: the wordmark, Team, Contact and Get Started, then the headline Developer Tools for Earth Intelligence over a globe in a green wind field, and the email field",
    height: 799,
    marks: [
      { n: 1, x: 72, y: 18, w: 196, h: 52 },
      { n: 2, x: 1174, y: 14, w: 194, h: 62 },
      { n: 3, x: 72, y: 206, w: 848, h: 212 },
      { n: 4, x: 72, y: 465, w: 436, h: 80 },
      { n: 5, x: 960, y: 150, w: 440, h: 600 },
    ],
    pieces: [
      { n: 1, title: "The wordmark", note: "The mark and the name, from the file’s SVG. Here the mark turns.", children: <Wordmark className="mx-auto" /> },
      { n: 2, title: "Get Started", note: "Mint, 48 high, Plex Mono 16, and the four states the file draws for it.", children: <ButtonStates /> },
      { n: 3, title: "The headline", note: "The h1 in pale green, and Subtitle 1 under it in mint.", children: <Headline /> },
      { n: 4, title: "The email field", note: "Glass over the planet, 420 wide, the button inside, through the states the file draws: empty, typed into, sent, adding, added.", wide: true, children: <EmailLoop className="mx-auto max-w-[420px]" /> },
      { n: 5, title: "The planet", note: "A wind field on the globe, out of the product. The one at the top of this page turns: drag it.", children: <Drift src={planet} alt="The hero's planet: the globe under a green wind field" index={1} sizes="(min-width: 1024px) 33vw, 100vw" aspect="aspect-[735/451]" /> },
    ],
  },
  {
    id: "proof",
    eyebrow: "Proof",
    title: "Logos, then a founder’s word",
    text: "Under the hero, the companies on the platform and a line from Diego Saez Gil, Pachama’s founder.",
    sheet: proof,
    alt: "The proof: a line in mint, the Pachama, Linear and Vercel logos, and Diego Saez Gil's quote with his name and role",
    height: 496,
    marks: [
      { n: 1, x: 72, y: 56, w: 705, h: 115 },
      { n: 2, x: 72, y: 203, w: 807, h: 201 },
    ],
    pieces: [
      { n: 1, title: "Logos", note: "A line in mint over the companies on the platform. The one quoted is the one lit.", children: <LogosRow /> },
      { n: 2, title: "The quote", note: "Subtitle 1 in pale green, the name in Neue Machina, the role in Plex Mono.", wide: true, children: <Quote /> },
    ],
  },
  {
    id: "who",
    eyebrow: "Who it’s for",
    title: "Teams, and the organisations behind them",
    text: "Two hairline cards, one for the teams building with geospatial data and one for the organisations behind them.",
    sheet: who,
    alt: "Made for Geospatial Developers: a Who tag, then two hairline cards, For Teams and For Organizations, each with an icon, a tag, a title in mint and a line of text",
    height: 654,
    marks: [
      { n: 2, x: 80, y: 240, w: 1280, h: 350 },
      { n: 1, x: 74, y: 58, w: 78, h: 46 },
      { n: 1, x: 106, y: 354, w: 128, h: 46 },
      { n: 1, x: 746, y: 354, w: 195, h: 46 },
    ],
    pieces: [
      { n: 1, title: "Tags", note: "A hairline pill, Plex Mono 14 in capitals. Sections and cards open with one.", children: <TagRoll /> },
      { n: 2, title: "Hairline cards", note: "A line on top and down the sides, open at the foot, and a cross where the lines meet. The icons are strokes in mint.", wide: true, children: <WhoCards /> },
    ],
  },
  {
    id: "serve",
    eyebrow: "Serve",
    title: "Three features and the pipeline",
    text: "Serve Data at Scale, Instantly: three features beside a diagram that doubles as the documentation.",
    sheet: serve,
    alt: "Serve Data at Scale, Instantly: three numbered features on the left, and on the right a diagram from cloud storage and a database through a Python window to a tile source",
    height: 1124,
    marks: [
      { n: 1, x: 74, y: 312, w: 541, h: 754 },
      { n: 2, x: 683, y: 297, w: 292, h: 60 },
      { n: 2, x: 772, y: 465, w: 361, h: 253 },
      { n: 2, x: 834, y: 825, w: 570, h: 290 },
    ],
    pieces: [
      { n: 1, title: "Features, numbered", note: "A number in mono, a title in mint, a line of text. Each lit in turn here.", children: <FeatureList /> },
      { n: 2, title: "The pipeline", note: "Cloud storage and a database join, the Python client registers the data, and out comes a tile source for any map library.", wide: true, children: <Pipeline /> },
    ],
  },
  {
    id: "explore",
    eyebrow: "Explore",
    title: "The product, shown working",
    text: "Innovate Faster. Ship Confidently: the visual explorer, its panels laid over a wind field.",
    sheet: explore,
    alt: "A Visual Explorer for your Data: a wind field map with the layers panel, a layer's menu and the visualisation editor on the left and pixel information on the right",
    height: 1111,
    marks: [
      { n: 1, x: 35, y: 457, w: 292, h: 444 },
      { n: 2, x: 158, y: 902, w: 169, h: 162 },
      { n: 3, x: 331, y: 739, w: 292, h: 365 },
      { n: 4, x: 1054, y: 333, w: 292, h: 619 },
      { n: 5, x: 1352, y: 380, w: 56, h: 700 },
    ],
    pieces: [
      { n: 1, title: "Layers", note: "Each dataset with its ramp as a chip and an eye, and the time along a slider.", children: <LayersPanel /> },
      { n: 2, title: "A layer’s menu", note: "Remove, edit, details. Zoom to fit and QGIS wait, greyed.", children: <SubMenu /> },
      { n: 3, title: "Editing a visualization", note: "Opacity, the band, and the ramp: the five the product offers, viridis to cividis.", children: <EditPanel /> },
      { n: 4, title: "Pixel information", note: "A point picked on the map: its value, and its time series drawn.", children: <PixelPanel /> },
      { n: 5, title: "The map, stacked", note: "More datasets wait behind the map, edge on.", wide: true, children: <MapStack /> },
    ],
  },
  {
    id: "catalog",
    eyebrow: "Catalog",
    title: "Register it, then talk about it",
    text: "Two cards under the explorer: registering a dataset in four steps, and a comment on a tile.",
    sheet: catalog,
    alt: "Two cards: Instant Dataset Registration and Visualization with the register panel, and Cataloging, Maps and Comments with a green pin and a comment thread",
    height: 541,
    marks: [
      { n: 1, x: 74, y: 230, w: 620, h: 238 },
      { n: 2, x: 746, y: 230, w: 620, h: 304 },
    ],
    pieces: [
      { n: 1, title: "Registering a dataset", note: "Four steps: the URL, the access check, the name, the visualization.", wide: true, children: <Register /> },
      { n: 2, title: "A comment on a tile", note: "A green pin on the map, then the thread: a flag, an answer, thanks.", children: <Thread /> },
    ],
  },
  {
    id: "ask",
    eyebrow: "The ask",
    title: "One line, one button, and the planet again",
    text: "The footer repeats the email field over the planet’s limb, so the page ends where it began.",
    sheet: ask,
    alt: "The closing call to action over the planet's limb glowing green, and the footer with the wordmark and the email field",
    height: 668,
    marks: [
      { n: 1, x: 206, y: 120, w: 1028, h: 116 },
      { n: 1, x: 625, y: 254, w: 190, h: 60 },
      { n: 2, x: 934, y: 494, w: 432, h: 118 },
    ],
    pieces: [
      { n: 1, title: "The ask", note: "The line centred over the limb, and the one button again, glowing.", wide: true, children: <AskLine /> },
      {
        n: 2,
        title: "Stay up to date",
        note: "The same field in the footer, here through the error state the file also draws.",
        children: (
          <div className="grid gap-4">
            <p className="font-sans text-[20px] leading-[1.4] tracking-[-0.02em] text-mint">Stay up to date</p>
            <EmailLoop ends="error" />
          </div>
        ),
      },
    ],
  },
];
