"use client";

import closeUp from "@/assets/bio/borneo-detail.jpg";
import borneo from "@/assets/bio/borneo-map.jpg";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { Zoom } from "../banyan/maps/controls";
import { BN } from "../banyan/ui";
import { cn } from "../cn";
import { BLEED } from "../shot";
import { PAGE } from "../story";
import { DETAIL, KBA_D, MAP_H, MAP_W, PROJECT_D, PROTECTED_D } from "./biodiversity-layers";
import { AreasPart, RiskPart, ScorePart, SpeciesPart, SpotlightPart, ThreatsPart, type AreaLayer } from "./biodiversity-parts";

/* Borneo Peatlands' biodiversity on its own map, and the way through it:
 * the project on Sentinel-2 imagery, with the key biodiversity area and the
 * protected area beside it (traced from the product's map and pinned to the
 * imagery), under the product's biodiversity panel. Each part of the
 * evaluation is a tab, and the map flies to what that part is about: the
 * project for its score, closer in for the species in the spotlight, the
 * landscape for the region's risks, threats and species, the areas around
 * it with their layers. Drag the map, or zoom it. Rebuilt from Evaluation
 * 2.2's screens; every figure is theirs (IBAT's STAR data). */
type View = "project" | "close" | "region" | "areas";
const PARTS: { id: string; label: string; view: View }[] = [
  { id: "score", label: "Impact score", view: "project" },
  { id: "spotlight", label: "Spotlight", view: "close" },
  { id: "risk", label: "Extinction risk", view: "region" },
  { id: "threats", label: "Threats", view: "region" },
  { id: "species", label: "At risk", view: "region" },
  { id: "areas", label: "Key areas", view: "areas" },
];
// What the map frames for each view, in the image's pixels: x0, y0, x1, y1.
const FRAMES: Record<View, [number, number, number, number]> = {
  project: [1400, 540, 2080, 1800],
  close: [1540, 880, 1950, 1500],
  region: [1300, 250, 3150, 2150],
  areas: [1450, 300, 3550, 2350],
};
const VIEW_LABEL: Record<View, string> = {
  project: "framed on the project",
  close: "close in on the project's forest",
  region: "zoomed out over the landscape around the project",
  areas: "zoomed out over the project, the key biodiversity area along the coast and Sebangau National Park beside it",
};
const ZOOMS = [1, 1.6, 2.5];
// The panel's width on a wide screen, and the margins around what's framed.
const PANEL = 448;
const PAD = 32;

export const Biodiversity = ({ className }: { className?: string }) => {
  const [at, setAt] = useState(0);
  const [zoom, setZoom] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 0, h: 0, wide: false });
  const [shown, setShown] = useState<Record<AreaLayer, boolean>>({ project: true, kba: true, protected: true });
  const frame = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const part = PARTS[at];

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      setSize({ w, h, wide: window.matchMedia("(min-width: 1024px)").matches });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fit the part's frame into what the panel leaves of the map, keep the
  // imagery covering it, and hand the numbers to CSS.
  useLayoutEffect(() => {
    const el = layer.current;
    if (!el || !size.w) return;
    const [x0, y0, x1, y1] = FRAMES[part.view];
    const left = size.wide ? PANEL + PAD : PAD;
    const aw = size.w - left - PAD;
    const ah = size.h - 2 * PAD;
    const cover = Math.max(size.w / MAP_W, size.h / MAP_H);
    const s = Math.max(cover, Math.min(aw / (x1 - x0), ah / (y1 - y0))) * ZOOMS[zoom];
    const clamp = (v: number, lo: number) => Math.min(0, Math.max(lo, v));
    const tx = clamp(left + aw / 2 - ((x0 + x1) / 2) * s + pan.x, size.w - MAP_W * s);
    const ty = clamp(PAD + ah / 2 - ((y0 + y1) / 2) * s + pan.y, size.h - MAP_H * s);
    el.style.setProperty("--tx", `${tx.toFixed(1)}px`);
    el.style.setProperty("--ty", `${ty.toFixed(1)}px`);
    el.style.setProperty("--s", s.toFixed(4));
  }, [part.view, zoom, pan, size]);

  const go = (i: number) => {
    setAt((i + PARTS.length) % PARTS.length);
    setZoom(0);
    setPan({ x: 0, y: 0 });
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const next = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: PARTS.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const i = (next + PARTS.length) % PARTS.length;
    go(i);
    tabs.current[i]?.focus();
  };
  // Dragging moves the map at once; the flights between parts glide.
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    e.currentTarget.setPointerCapture(e.pointerId);
    layer.current?.setAttribute("data-drag", "");
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d) setPan({ x: d.px + e.clientX - d.x, y: d.py + e.clientY - d.y });
  };
  const onUp = () => {
    drag.current = null;
    layer.current?.removeAttribute("data-drag");
  };

  return (
    <section aria-label="Borneo Peatlands' biodiversity, on its map" className={cn(BLEED, "bg-night text-white", className)}>
      <div className="relative">
        <div
          ref={frame}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="relative h-[62svh] min-h-[22rem] cursor-grab touch-pan-y overflow-hidden active:cursor-grabbing lg:h-[min(54rem,92svh)]"
        >
          <div
            ref={layer}
            role="img"
            aria-label={`Borneo Peatlands on a satellite map, ${VIEW_LABEL[part.view]}: the project's outline in white${shown.kba ? ", the key biodiversity area in green" : ""}${shown.protected ? ", the national park in teal" : ""}`}
            className="absolute top-0 left-0 origin-top-left transition-transform duration-[1300ms] ease-[cubic-bezier(0.65,0,0.35,1)] [transform:translate(var(--tx,0px),var(--ty,0px))_scale(var(--s,0.3))] motion-reduce:transition-none data-drag:transition-none"
          >
            <Image src={borneo} alt="" sizes="(min-width: 1024px) 3714px, 1920px" placeholder="blur" quality={90} className="block max-w-none select-none" draggable={false} />
            <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} aria-hidden className="absolute inset-0 size-full">
              {/* The close-up, twice as sharp, feathered into the map. */}
              <defs>
                <filter id="bio-feather" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="24" />
                </filter>
                <mask id="bio-close">
                  <rect x={DETAIL.x + 48} y={DETAIL.y + 48} width={DETAIL.w - 96} height={DETAIL.h - 96} fill="white" filter="url(#bio-feather)" />
                </mask>
              </defs>
              <image href={closeUp.src} x={DETAIL.x} y={DETAIL.y} width={DETAIL.w} height={DETAIL.h} mask="url(#bio-close)" preserveAspectRatio="none" />
              <path
                d={PROTECTED_D}
                vectorEffect="non-scaling-stroke"
                className={cn("fill-[#2ec4b6] stroke-[#5fe3d6] [stroke-width:2] transition-opacity duration-700", shown.protected ? (part.view === "areas" ? "opacity-100 [fill-opacity:0.32]" : "opacity-60 [fill-opacity:0.14]") : "opacity-0")}
              />
              <path
                d={KBA_D}
                vectorEffect="non-scaling-stroke"
                className={cn("fill-[#5bd16a] stroke-[#86f193] [stroke-width:2] transition-opacity duration-700", shown.kba ? (part.view === "areas" ? "opacity-100 [fill-opacity:0.32]" : "opacity-60 [fill-opacity:0.14]") : "opacity-0")}
              />
              <path
                d={PROJECT_D}
                fillRule="evenodd"
                vectorEffect="non-scaling-stroke"
                className={cn("fill-white stroke-white [fill-opacity:0.16] [stroke-width:2.5] transition-opacity duration-700", shown.project ? "opacity-100" : "opacity-0")}
              />
            </svg>
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(6_16_11/0.55),transparent_45%)] max-lg:hidden" />
          <div className="absolute right-4 bottom-4 flex items-end gap-3" onPointerDown={(e) => e.stopPropagation()}>
            <Zoom onIn={() => setZoom((z) => Math.min(z + 1, ZOOMS.length - 1))} onOut={() => setZoom((z) => Math.max(z - 1, 0))} canIn={zoom < ZOOMS.length - 1} canOut={zoom > 0} />
          </div>
        </div>

        {/* The product's panel: over the map on a wide screen, under it on a phone. */}
        <div className={cn(PAGE, "pointer-events-none lg:absolute lg:inset-x-0 lg:top-0 lg:bottom-0 lg:flex lg:items-center")}>
          <div className="pointer-events-auto -mt-10 flex max-h-full w-full flex-col overflow-hidden rounded-[20px] bg-[#0b1610]/92 shadow-[0_30px_90px_rgb(0_0_0/0.45)] ring-1 ring-white/12 backdrop-blur-md lg:mt-0 lg:max-h-[calc(100%-4rem)] lg:w-[26rem]">
            <header className="border-b border-white/10 p-5 sm:p-6">
              <p className="flex items-center gap-2 text-[13px] leading-4">
                <svg viewBox="0 0 24 24" aria-hidden className="size-5 rounded-full">
                  <rect width="24" height="12" fill="#e70011" />
                  <rect y="12" width="24" height="12" fill="#ffffff" />
                </svg>
                <span className="font-bold">Indonesia</span>
                <span aria-hidden className="h-3 w-px bg-white/40" />
                149,800 ha
              </p>
              <h4 className="mt-2 font-display text-[36px] leading-none font-bold">Borneo Peatlands</h4>
              <div role="tablist" aria-label="Biodiversity" className="mt-5 grid grid-cols-3 gap-1.5">
                {PARTS.map((p, i) => (
                  <button
                    key={p.id}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`bio-tab-${p.id}`}
                    aria-selected={i === at}
                    aria-controls="bio-part"
                    tabIndex={i === at ? 0 : -1}
                    onClick={() => go(i)}
                    onKeyDown={onKey}
                    className={cn(
                      "rounded-[10px] px-2 py-2 text-[13px] leading-4 font-medium transition-colors",
                      i === at ? "bg-white text-bn-heavy" : "bg-white/6 text-white/85 hover:bg-white/12",
                      BN.focus,
                      "focus-visible:outline-white",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </header>
            <div id="bio-part" role="tabpanel" aria-labelledby={`bio-tab-${part.id}`} tabIndex={0} className={cn("min-h-0 flex-1 overflow-y-auto p-5 [scrollbar-width:thin] sm:p-6", BN.focus, "focus-visible:-outline-offset-2 focus-visible:outline-white")}>
              <div key={part.id} className="motion-safe:animate-[arrive_0.45s_var(--ease-arrive)_both]">
                {part.id === "score" ? <ScorePart /> : null}
                {part.id === "spotlight" ? <SpotlightPart /> : null}
                {part.id === "risk" ? <RiskPart /> : null}
                {part.id === "threats" ? <ThreatsPart /> : null}
                {part.id === "species" ? <SpeciesPart /> : null}
                {part.id === "areas" ? <AreasPart shown={shown} onToggle={(k) => setShown((v) => ({ ...v, [k]: !v[k] }))} /> : null}
              </div>
            </div>
            <footer className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-3 sm:px-6">
              <button type="button" onClick={() => go(at - 1)} className={cn("inline-flex items-center gap-2 rounded-full px-3 py-2 text-[14px] leading-5 text-white/85 hover:bg-white/10", BN.focus, "focus-visible:outline-white")}>
                <MdArrowBack aria-hidden className="size-4" />
                {PARTS[(at + PARTS.length - 1) % PARTS.length].label}
              </button>
              <span aria-hidden className="font-mono text-[12px] text-white/60">
                {at + 1} / {PARTS.length}
              </span>
              <button type="button" onClick={() => go(at + 1)} className={cn("inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[14px] leading-5 hover:bg-white/16", BN.focus, "focus-visible:outline-white")}>
                {PARTS[(at + 1) % PARTS.length].label}
                <MdArrowForward aria-hidden className="size-4" />
              </button>
            </footer>
          </div>
        </div>
      </div>
      <p className={cn(PAGE, "type-caption pt-4 text-(--tone-text) lg:pt-5")}>
        Each part of the evaluation is a tab, and the map goes where it&rsquo;s about. Drag it or zoom it. Imagery: Sentinel-2 cloudless 2023 by EOX (contains modified Copernicus Sentinel data, CC BY-NC-SA 4.0); the project, the key biodiversity area and the national park traced from Pachama&rsquo;s map of them, from IBAT&rsquo;s data.
      </p>
    </section>
  );
};
