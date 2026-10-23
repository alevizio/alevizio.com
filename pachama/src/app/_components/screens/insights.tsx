"use client";

import agrocortex from "@/assets/screens/explore-agrocortex.jpg";
import aguas from "@/assets/screens/explore-aguas.jpg";
import avahoula from "@/assets/screens/explore-avahoula.jpg";
import corredores from "@/assets/screens/explore-corredores.jpg";
import flyaway from "@/assets/screens/explore-flyaway.jpg";
import kalimantan from "@/assets/screens/explore-kalimantan.jpg";
import manoa from "@/assets/screens/explore-manoa.jpg";
import nicaforest from "@/assets/screens/explore-nicaforest.jpg";
import aerial from "@/assets/screens/source-aerial.jpg";
import Image, { type StaticImageData } from "next/image";
import { useMemo, useState } from "react";
import { MdClose, MdOutlineEco, MdOutlineImageSearch, MdOutlineListAlt, MdOutlineMap, MdOutlinePhotoLibrary, MdOutlineSettings, MdPublic, MdSearch } from "react-icons/md";
import { BN } from "../banyan/ui";
import { MARKS } from "../brand-marks";
import { cn } from "../cn";
import { GlassFrame } from "./glass-frame";
import { Globe } from "./globe";

/* Insights, rebuilt live from the product's Explore and Insights screens and
 * shown the way Source's landing page shows the product: the app in a glass
 * frame over the hero's aerial photograph, in its dark mode, with its icon
 * rail. The map turns between a globe and a flat map from its corner.
 * Pachama's projects in a list to search and filter, on a dotted globe that
 * turns to each one. The projects, their countries, types and standards are
 * the ones the product's own screens show, with three Pachama Originals
 * from their project pages (hectares where the pages agree on them); pins
 * mark each project's region, not its exact site. */
type Kind = "REDD+" | "ARR";
type Flag = "br" | "id" | "ni" | "us";
type Project = {
  name: string;
  country: string;
  flag: Flag;
  area?: string;
  kind: Kind;
  type: string;
  standard?: string;
  photo: StaticImageData;
  lon: number;
  lat: number;
};

const PROJECTS: Project[] = [
  { name: "Manoa", country: "Brazil", flag: "br", area: "74,039 ha", kind: "REDD+", type: "Avoided planned deforestation", standard: "Verified Carbon Standard", photo: manoa, lon: -62.71, lat: -8.87 },
  { name: "Central Kalimantan Peatlands", country: "Indonesia", flag: "id", area: "47,237 ha", kind: "REDD+", type: "Avoided planned deforestation", standard: "Verified Carbon Standard", photo: kalimantan, lon: 113.5, lat: -2 },
  { name: "Nicaforest", country: "Nicaragua", flag: "ni", area: "486 ha", kind: "ARR", type: "Afforestation, reforestation & revegetation", standard: "Gold Standard", photo: nicaforest, lon: -85.2, lat: 12.9 },
  { name: "Corredores de Vida", country: "Brazil", flag: "br", kind: "ARR", type: "Restoration of farmland into forest corridors", photo: corredores, lon: -52, lat: -21.5 },
  { name: "Agrocortex", country: "Brazil", flag: "br", area: "182,219 ha", kind: "REDD+", type: "Avoided planned deforestation", standard: "Verified Carbon Standard", photo: agrocortex, lon: -68.3, lat: -8.8 },
  { name: "Águas da Mata Atlântica", country: "Brazil", flag: "br", kind: "ARR", type: "Reforestation of the Atlantic Forest", standard: "Verified Carbon Standard", photo: aguas, lon: -42.9, lat: -22.4 },
  { name: "Avahoula", country: "United States", flag: "us", area: "2,428 ha", kind: "ARR", type: "Reforestation of marginal, flooded farmland", standard: "Verified Carbon Standard", photo: avahoula, lon: -91.9, lat: 31 },
  { name: "Flyaway Forests", country: "United States", flag: "us", area: "1,200 ha", kind: "ARR", type: "Native bottomland hardwood forest", standard: "Verified Carbon Standard", photo: flyaway, lon: -90.9, lat: 33.4 },
];

const KINDS: Kind[] = ["REDD+", "ARR"];
const COUNTRIES = [...new Map(PROJECTS.map((p) => [p.country, p.flag])).entries()];
// The app's rail, as the buyer app has it; Explore is the page shown.
const RAIL = [
  { label: "Explore", Icon: MdOutlineImageSearch },
  { label: "My projects", Icon: MdOutlinePhotoLibrary },
  { label: "Orders", Icon: MdOutlineListAlt },
  { label: "Retirement", Icon: MdOutlineEco },
  { label: "Impact", Icon: MdPublic },
  { label: "Settings", Icon: MdOutlineSettings },
];
const { viewBox, symbol } = MARKS.symbol;

/** Small round flags, like Banyan's country chips. */
const FlagDot = ({ flag }: { flag: Flag }) => (
  <svg viewBox="0 0 24 24" aria-hidden className="size-5 shrink-0 rounded-full ring-1 ring-black/10">
    {flag === "br" ? (
      <>
        <rect width="24" height="24" fill="#229e45" />
        <path d="M12 4.5 21.5 12 12 19.5 2.5 12Z" fill="#f8e509" />
        <circle cx="12" cy="12" r="4.4" fill="#2b49a3" />
      </>
    ) : flag === "id" ? (
      <>
        <rect width="24" height="12" fill="#e70011" />
        <rect y="12" width="24" height="12" fill="#ffffff" />
      </>
    ) : flag === "ni" ? (
      <>
        <rect width="24" height="24" fill="#0067c6" />
        <rect y="8" width="24" height="8" fill="#ffffff" />
      </>
    ) : (
      <>
        <rect width="24" height="24" fill="#ffffff" />
        {[0, 2, 4, 6, 8, 10, 12].map((k) => (
          <rect key={k} y={(k * 24) / 13} width="24" height={24 / 13} fill="#b22234" />
        ))}
        <rect width="11" height="13" fill="#3c3b6e" />
      </>
    )}
  </svg>
);

// Filters sit on the dark map, glass over it as on the product's maps.
const chip = (on: boolean) =>
  cn(
    "flex h-10 items-center gap-2 rounded-full border px-3.5 text-[14px] leading-5 backdrop-blur-md transition-colors",
    on ? "border-bn-green bg-bn-green text-bn-heavy" : "border-white/25 bg-black/30 text-white hover:bg-white/10",
    BN.focus,
    "focus-visible:outline-white",
  );

export const Insights = ({ className }: { className?: string }) => {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<Kind | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [picked, setPicked] = useState(PROJECTS[0].name);
  const [flat, setFlat] = useState(false);

  const shown = useMemo(
    () =>
      PROJECTS.filter(
        (p) => (!kind || p.kind === kind) && (!country || p.country === country) && `${p.name} ${p.country} ${p.type}`.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query, kind, country],
  );
  const pins = useMemo(() => PROJECTS.map((p) => ({ id: p.name, lon: p.lon, lat: p.lat, on: shown.includes(p) })), [shown]);
  // Keep the pick inside what's shown.
  const current = shown.find((p) => p.name === picked) ?? shown[0];

  return (
    <GlassFrame backdrop={aerial} className={className} innerClassName="lg:grid lg:h-[44rem] lg:grid-cols-[4.5rem_23rem_1fr]">
      {/* The app's chrome, for the picture: not a menu here. */}
      <div aria-hidden className="hidden flex-col items-center gap-2 border-r border-white/10 bg-[#0e1b14] py-5 lg:flex">
        <svg viewBox={viewBox} className="mb-4 w-8 fill-white">
          <path d={symbol} />
        </svg>
        {RAIL.map(({ label, Icon }) => (
          <span key={label} className={cn("grid size-11 place-items-center rounded-[12px]", label === "Explore" ? "bg-bn-green/15 text-bn-green" : "text-white/60")}>
            <Icon className="size-6" />
          </span>
        ))}
      </div>

      <div className="flex min-h-0 flex-col gap-5 p-5 sm:p-6">
        <p className="font-display text-[32px] leading-none font-bold">Explore</p>
        <div className="flex h-12 items-center gap-3 rounded-full bg-white/8 pr-2 pl-4 ring-1 ring-white/15 transition-shadow focus-within:ring-2 focus-within:ring-white/70">
          <MdSearch aria-hidden className="size-5 shrink-0 text-white/70" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects"
            aria-label="Search projects"
            className="min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-white/60 [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query ? (
            <button type="button" aria-label="Clear the search" onClick={() => setQuery("")} className={cn("grid size-8 shrink-0 place-items-center rounded-full text-white/80 hover:bg-white/10", BN.focus, "focus-visible:outline-white")}>
              <MdClose aria-hidden className="size-4" />
            </button>
          ) : null}
        </div>
        <div className="flex gap-8">
          <p>
            <span className="block text-[14px] leading-5 text-white/70">Projects</span>
            <span aria-live="polite" className="block text-[32px] leading-9 font-bold">
              {shown.length}
            </span>
          </p>
          <p>
            <span className="block text-[14px] leading-5 text-white/70">Countries</span>
            <span className="block text-[32px] leading-9 font-bold">{new Set(shown.map((p) => p.country)).size}</span>
          </p>
        </div>
        <ul className="grid min-h-0 gap-3 overflow-y-auto p-0.5 pr-1 [scrollbar-width:thin] max-lg:max-h-[26rem]">
          {shown.map((p) => {
            const on = current?.name === p.name;
            return (
              <li key={p.name}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPicked(p.name)}
                  className={cn(
                    "grid w-full grid-cols-[1fr_5.25rem] items-center gap-4 rounded-[16px] p-3 text-left transition-colors motion-safe:animate-[arrive_0.45s_var(--ease-arrive)_both]",
                    on ? "bg-white/12 ring-2 ring-bn-green ring-inset" : "bg-white/[0.04] ring-1 ring-white/10 ring-inset hover:bg-white/8",
                    BN.focus,
                    "focus-visible:outline-white",
                  )}
                >
                  <span className="grid gap-1">
                    <span className="flex items-center gap-2 text-[13px] leading-4">
                      <FlagDot flag={p.flag} />
                      <span className="font-bold">{p.country}</span>
                      {p.area ? (
                        <>
                          <span aria-hidden className="h-3 w-px bg-white/40" />
                          {p.area}
                        </>
                      ) : null}
                    </span>
                    <span className="font-display text-[24px] leading-7 font-bold">{p.name}</span>
                    <span className="text-[13px] leading-4 text-white/75">
                      {p.kind} · {p.type}
                    </span>
                    {p.standard ? <span className="text-[13px] leading-4 text-white/70">{p.standard}</span> : null}
                  </span>
                  <Image src={p.photo} alt="" sizes="84px" className="aspect-square w-full rounded-[10px] object-cover" />
                </button>
              </li>
            );
          })}
          {shown.length === 0 ? <li className="rounded-[16px] border border-dashed border-white/25 p-6 text-[14px] text-white/75">No project matches. Clear the search or a filter.</li> : null}
        </ul>
      </div>

      <div className="relative min-h-[26rem] overflow-hidden border-white/10 bg-[radial-gradient(ellipse_at_center,#10241a_0%,#050b07_70%)] lg:border-l">
        <div className="absolute inset-x-4 top-4 z-10 flex flex-wrap gap-2">
          <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(kind === k ? null : k)} className={chip(kind === k)}>
                {k}
              </button>
            ))}
          </div>
          <span aria-hidden className="mx-1 hidden w-px self-stretch bg-white/25 sm:block" />
          <div role="group" aria-label="Filter by country" className="flex flex-wrap gap-2">
            {COUNTRIES.map(([name, flag]) => (
              <button key={name} type="button" aria-pressed={country === name} onClick={() => setCountry(country === name ? null : name)} className={chip(country === name)}>
                {name}
                <FlagDot flag={flag} />
              </button>
            ))}
          </div>
        </div>
        <Globe pins={pins} picked={current?.name ?? ""} onPick={setPicked} label={current?.name ?? ""} flat={flat} className="absolute inset-0 top-14" />
        <p aria-live="polite" className="sr-only">
          {current ? `${current.name}, ${current.country}` : "No project selected"}
        </p>
        <div role="group" aria-label="Map view" className="absolute right-4 bottom-4 z-10 flex rounded-full bg-black/40 p-1 ring-1 ring-white/20 backdrop-blur-md">
          {[
            { id: false, label: "Globe", Icon: MdPublic },
            { id: true, label: "Flat", Icon: MdOutlineMap },
          ].map(({ id, label, Icon }) => (
            <button
              key={label}
              type="button"
              aria-pressed={flat === id}
              onClick={() => setFlat(id)}
              className={cn(
                "flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] leading-4 font-medium transition-colors",
                flat === id ? "bg-white text-bn-heavy" : "text-white/80 hover:text-white",
                BN.focus,
                "focus-visible:outline-white",
              )}
            >
              <Icon aria-hidden className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </GlassFrame>
  );
};
