import catalog from "@/assets/page/anat/06-catalog.webp";
import explore from "@/assets/page/anat/05-explore.webp";
import ask from "@/assets/page/anat/07-ask.webp";
import hero from "@/assets/page/anat/01-hero.webp";
import proof from "@/assets/page/anat/02-proof.webp";
import serve from "@/assets/page/anat/04-serve.webp";
import who from "@/assets/page/anat/03-who.webp";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { AskLine } from "../_components/anat-ask";
import { ButtonStates, Headline } from "../_components/anat-hero";
import { Quote } from "../_components/anat-proof";
import { WhoCards } from "../_components/anat-who";
import { LayersPanel } from "../_components/layers-panel";
import { MapStack } from "../_components/map-stack";
import { Register } from "../_components/register";
import { Thread } from "../_components/thread";
import { Wordmark } from "../_components/wordmark";

/* The landing page, section by section: each section's sheet from the
 * file, in the page's order, and the pieces rebuilt from them, each under
 * the section it comes from. The email field, pixel information and the
 * serve diagram are left out here; the kit and Serve, live show them. */
export type Sheet = { id: string; label: string; src: StaticImageData; alt: string };

export const SHEETS: Sheet[] = [
  {
    id: "hero",
    label: "The hero",
    src: hero,
    alt: "The top of the page: the wordmark, Team, Contact and Get Started, then the headline Developer Tools for Earth Intelligence over a globe in a green wind field, and the email field",
  },
  { id: "proof", label: "Proof", src: proof, alt: "The proof: a line in mint, the Pachama, Linear and Vercel logos, and Diego Saez Gil's quote with his name and role" },
  {
    id: "who",
    label: "Who it’s for",
    src: who,
    alt: "Made for Geospatial Developers: a Who tag, then two hairline cards, For Teams and For Organizations, each with an icon, a tag, a title in mint and a line of text",
  },
  {
    id: "serve",
    label: "Serve",
    src: serve,
    alt: "Serve Data at Scale, Instantly: three numbered features on the left, and on the right a diagram from cloud storage and a database through a Python window to a tile source",
  },
  {
    id: "explore",
    label: "Explore",
    src: explore,
    alt: "A Visual Explorer for your Data: a wind field map with the layers panel, a layer's menu and the visualisation editor on the left and pixel information on the right",
  },
  {
    id: "catalog",
    label: "Catalog",
    src: catalog,
    alt: "Two cards: Instant Dataset Registration and Visualization with the register panel, and Cataloging, Maps and Comments with a green pin and a comment thread",
  },
  { id: "ask", label: "The ask", src: ask, alt: "The closing call to action over the planet's limb glowing green, and the footer with the wordmark and the email field" },
];

/** A section's number, as the page writes it: 01 to 07. */
export const numbered = (i: number) => String(i + 1).padStart(2, "0");

/** A piece: the section it comes from (its place in SHEETS), its name, how
 *  many of the grid's four columns it takes, and whether a phone, one
 *  column high, shows it. */
export type Tile = { from: number; title: string; span: 1 | 2 | 4; phone?: false; children: ReactNode };

export const TILES: Tile[] = [
  { from: 0, title: "The headline", span: 2, children: <Headline /> },
  { from: 0, title: "The wordmark", span: 1, children: <Wordmark className="mx-auto" /> },
  { from: 0, title: "Get Started", span: 1, phone: false, children: <ButtonStates /> },
  { from: 2, title: "Hairline cards", span: 4, children: <WhoCards /> },
  { from: 1, title: "The quote", span: 2, phone: false, children: <Quote /> },
  { from: 4, title: "Layers", span: 2, children: <LayersPanel /> },
  { from: 5, title: "A comment on a tile", span: 2, phone: false, children: <Thread className="mx-auto w-full max-w-[38rem]" /> },
  { from: 5, title: "Registering a dataset", span: 2, phone: false, children: <Register /> },
  { from: 4, title: "The map, stacked", span: 2, children: <MapStack /> },
  { from: 6, title: "The ask", span: 2, children: <AskLine /> },
];
