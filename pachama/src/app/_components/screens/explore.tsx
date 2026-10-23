"use client";

import agrocortex from "@/assets/screens/explore-agrocortex.jpg";
import kalimantan from "@/assets/screens/explore-kalimantan.jpg";
import manoa from "@/assets/screens/explore-manoa.jpg";
import nicaforest from "@/assets/screens/explore-nicaforest.jpg";
import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { BN } from "../banyan/ui";
import { cn } from "../cn";

/* Explore, rebuilt live in Banyan: the marketplace's projects to filter on
 * one side, the world on the other, every project pinned. Pick a card or a
 * pin and the two follow each other. The projects and their facts are the
 * product's own (from its Explore and project pages); the pins mark each
 * project's region, not its exact site. The land is Natural Earth's (public
 * domain), projected once into public/screens/world.svg. */
type Kind = "REDD+" | "ARR";
type Project = {
  name: string;
  country: string;
  flag: "br" | "id" | "ni";
  area: string;
  kind: Kind;
  type: string;
  standard: string;
  src: StaticImageData;
  /** On the 1000 × 369 equirectangular world: lon -180..180, lat 75..-58. */
  x: number;
  y: number;
  /** The same spot for the HTML label, as literal classes. */
  at: string;
};

const PROJECTS: Project[] = [
  { name: "Manoa", country: "Brazil", flag: "br", area: "74,039 hectares", kind: "REDD+", type: "REDD+ Avoided Planned Deforestation", standard: "Verified Carbon Standard", src: manoa, x: 326, y: 234, at: "left-[32.6%] top-[63.4%]" },
  { name: "Agrocortex", country: "Brazil", flag: "br", area: "182,219 hectares", kind: "REDD+", type: "REDD+ Avoided Planned Deforestation", standard: "Verified Carbon Standard", src: agrocortex, x: 310, y: 232, at: "left-[31%] top-[62.9%]" },
  { name: "Central Kalimantan Peatlands", country: "Indonesia", flag: "id", area: "47,237 hectares", kind: "REDD+", type: "REDD+ Avoided Planned Deforestation", standard: "Verified Carbon Standard", src: kalimantan, x: 815, y: 213, at: "left-[81.5%] top-[57.7%]" },
  { name: "Nicaforest", country: "Nicaragua", flag: "ni", area: "486 hectares", kind: "ARR", type: "Afforestation, Reforestation & Revegetation", standard: "Gold Standard", src: nicaforest, x: 263, y: 172, at: "left-[26.3%] top-[46.6%]" },
];

const FILTERS: ("All" | Kind)[] = ["All", "REDD+", "ARR"];

// The pins land one after another.
const DELAYS = ["[--reveal-delay:0s]", "[--reveal-delay:0.15s]", "[--reveal-delay:0.3s]", "[--reveal-delay:0.45s]"];

/** Small round flags, like Banyan's country chips. */
const Flag = ({ flag }: { flag: Project["flag"] }) => (
  <svg viewBox="0 0 24 24" aria-hidden className="size-5 shrink-0 rounded-full">
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
    ) : (
      <>
        <rect width="24" height="24" fill="#0067c6" />
        <rect y="8" width="24" height="8" fill="#ffffff" />
      </>
    )}
  </svg>
);

export const Explore = ({ className }: { className?: string }) => {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [picked, setPicked] = useState("Manoa");
  const shown = PROJECTS.filter((p) => filter === "All" || p.kind === filter);
  const current = PROJECTS.find((p) => p.name === picked);

  const refilter = (f: (typeof FILTERS)[number]) => {
    setFilter(f);
    const still = PROJECTS.filter((p) => f === "All" || p.kind === f);
    if (!still.some((p) => p.name === picked)) setPicked(still[0].name);
  };

  return (
    <div className={cn("overflow-hidden rounded-[16px] bg-[#0f1c14] text-white lg:grid lg:grid-cols-[24rem_1fr]", className)}>
      <div className="grid content-start gap-5 p-6 lg:max-h-[38rem] lg:overflow-y-auto">
        <div className="flex items-end gap-6">
          <p>
            <span className="block text-[14px] leading-5 text-white/70">Project count</span>
            <span className="block text-[32px] leading-9 font-bold">182</span>
          </p>
          <p>
            <span className="block text-[14px] leading-5 text-white/70">Shown here</span>
            <span aria-live="polite" className="block text-[32px] leading-9 font-bold">
              {shown.length}
            </span>
          </p>
        </div>
        <div role="group" aria-label="Filter by project type" className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => refilter(f)}
              className={cn("rounded-full border px-4 py-1.5 text-[14px] leading-5 transition-colors", filter === f ? "border-bn-green bg-bn-green text-bn-heavy" : "border-white/30 hover:bg-white/10", BN.focus, "focus-visible:outline-white")}
            >
              {f}
            </button>
          ))}
        </div>
        <ul className="grid gap-3">
          {shown.map((p) => (
            <li key={p.name}>
              <button
                type="button"
                aria-pressed={picked === p.name}
                onClick={() => setPicked(p.name)}
                className={cn(
                  "grid w-full grid-cols-[1fr_5.5rem] items-center gap-4 rounded-[12px] p-3 text-left transition-colors motion-safe:animate-[arrive_0.5s_var(--ease-arrive)_both]",
                  picked === p.name ? "bg-white/12 ring-1 ring-bn-green" : "hover:bg-white/6",
                  BN.focus,
                  "focus-visible:outline-white",
                )}
              >
                <span className="grid gap-1">
                  <span className="flex items-center gap-2 text-[13px] leading-4">
                    <Flag flag={p.flag} />
                    <span className="font-bold">{p.country}</span>
                    <span aria-hidden className="h-3 w-px bg-white/40" />
                    {p.area}
                  </span>
                  <span className="font-display text-[24px] leading-7 font-bold">{p.name}</span>
                  <span className="text-[13px] leading-4 text-white/75">{p.type}</span>
                  <span className="text-[13px] leading-4 text-white/75">{p.standard}</span>
                </span>
                <Image src={p.src} alt="" sizes="88px" className="aspect-square w-full rounded-[10px] object-cover" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative grid place-items-center overflow-hidden bg-[#0a140e] p-4 sm:p-8">
        <div className="relative w-full">
          {/* eslint-disable-next-line @next/next/no-img-element -- a static vector map */}
          <img src="/screens/world.svg" alt="" className="block h-auto w-full opacity-90" />
          <svg viewBox="0 0 1000 369" className="absolute inset-0 size-full">
            {PROJECTS.map((p, i) => {
              const on = shown.includes(p);
              const isPicked = picked === p.name;
              return (
                <g
                  key={p.name}
                  role="button"
                  tabIndex={on ? 0 : -1}
                  aria-label={`${p.name}, ${p.country}`}
                  aria-pressed={isPicked}
                  onClick={() => on && setPicked(p.name)}
                  onKeyDown={(e) => {
                    if (on && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      setPicked(p.name);
                    }
                  }}
                  className={cn("cursor-pointer outline-none transition-opacity duration-300 [&:focus-visible_.pin-ring]:stroke-white", on ? "opacity-100" : "pointer-events-none opacity-15")}
                >
                  {isPicked ? (
                    <circle cx={p.x} cy={p.y} r="9" className="fill-none stroke-bn-green [stroke-width:2] [transform-box:fill-box] [transform-origin:center] motion-safe:animate-ping" />
                  ) : null}
                  <circle className="pin-ring fill-none stroke-transparent [stroke-width:2]" cx={p.x} cy={p.y} r="11" />
                  <circle
                    data-reveal="pop"
                    cx={p.x}
                    cy={p.y}
                    r={isPicked ? 6.5 : 5}
                    className={cn("stroke-[#0a140e] [stroke-width:2] [transform-box:fill-box] [transform-origin:center] transition-all duration-300", isPicked ? "fill-bn-green" : "fill-white", DELAYS[i])}
                  />
                </g>
              );
            })}
          </svg>
          {current ? (
            <p
              key={current.name}
              aria-live="polite"
              className={cn(
                "pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-full bg-white px-3 py-1 text-[13px] leading-5 font-medium whitespace-nowrap text-bn-heavy shadow-md motion-safe:animate-[arrive_0.4s_var(--ease-arrive)_both]",
                current.at,
              )}
            >
              {current.name}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
