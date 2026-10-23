"use client";

import landMap from "@/assets/screens/land-map.jpg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdArrowBack, MdInfoOutline, MdInsertDriveFile, MdReplay, MdUploadFile } from "react-icons/md";
import { BN } from "../banyan/ui";
import { cn } from "../cn";
import { GlassFrame } from "./glass-frame";

/* A developer's boundary, uploaded and assessed, as Source does it: the
 * file comes in, the parcels draw themselves on the satellite, a scan runs
 * over the land, and it comes back in colour with what qualifies. The map
 * and the figures are the live product's, for a real supplier project left
 * unnamed; the parcel outlines are traced from that map. It starts when
 * it's well in view and loops while it stays there (the result holds a
 * few seconds between runs), starts over when scrolled back to, Upload
 * again runs it at once, and with less motion it opens on the result. */
type Phase = "idle" | "upload" | "drawn" | "scan" | "results";
// Behind the glass: a forest's edge against cleared land, the forest-edge
// clip's own poster.
const forestEdge = "/video/forest-edge.jpg";
const TIMELINE: [Phase, number][] = [
  ["upload", 400],
  ["drawn", 2200],
  ["scan", 4000],
  ["results", 5700],
];
// How long the result stays up before the next run.
const HOLD = 5000;
const at = (phase: Phase, from: Phase) => TIMELINE.findIndex(([p]) => p === phase) >= TIMELINE.findIndex(([p]) => p === from);

// Traced from the product's map, in its 1000 x 585 frame.
const PARCELS = [
  "M540.5 173.5 L546 204.5 L576 287 L554.5 303.5 L519.5 360.5 L529 403.5 L538.5 415 L520.5 415 L513.5 434.5 L535.5 474 L529 476.5 L528 483.5 L533 506 L525 518.5 L444.5 510 L409 490.5 L414.5 481 L381.5 453.5 L318.5 423 L336.5 411.5 L314.5 404 L314 345.5 L340 348 L340.5 352 L341.5 348 L414 355.5 L459.5 352 L501 341.5 L536.5 294.5 L548 298 L534 292 L495.5 290 L462.5 278 L464.5 273.5 L445 269.5 L348 260.5 L345.5 252 L353 244.5 L357 233.5 L352.5 228 L361.5 214 L392.5 215.5 L415.5 202 L450 194 L480 190 L497 192.5 L501.5 187.5 L518 185.5 Z",
  "M481.5 62.5 L505 106.5 L497.5 111.5 L499 136.5 L524.5 150 L532 165.5 L409 186 L400.5 138.5 L361 148 L388.5 132 L410 101.5 L416.5 100.5 L429.5 86.5 Z",
];

// The live product's results for this land.
const TOTAL_HA = 36296;
const SUITABLE_PCT = 35;
const GROUPS = [
  {
    label: "Suitable land",
    ha: 12776,
    rows: [
      { label: "Suitable land classification", ha: 12531, swatch: "bg-[#5fd0f0]" },
      { label: "Burn area", ha: 34, swatch: "bg-[#5b8cff]" },
    ],
  },
  {
    label: "Unsuitable land",
    ha: 23520,
    rows: [
      { label: "Unsuitable land classification", ha: 23130, swatch: "bg-[#f3956a]" },
      { label: "Non-burn deforestation", ha: 296, swatch: "bg-[#e66cf0]" },
    ],
  },
];

const STATUS: Record<Phase, string> = {
  idle: "Waiting for a boundary file.",
  upload: "Uploading project-boundary.kml.",
  drawn: `Boundary drawn: ${TOTAL_HA.toLocaleString("en-US")} hectares.`,
  scan: "Checking the land against satellite data.",
  results: `${SUITABLE_PCT}% of the land is suitable.`,
};

/** A number that counts up from zero when `on` turns true. */
const Count = ({ to, on, suffix = "" }: { to: number; on: boolean; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const text = ref.current?.firstChild;
    if (!text) return;
    if (!on) {
      text.nodeValue = `0${suffix}`;
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / 1300));
      text.nodeValue = `${Math.round(to * (1 - (1 - t) ** 3)).toLocaleString("en-US")}${suffix}`;
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, on, suffix]);
  return (
    // Proportional figures: Matter's tabular ones give the comma a full cell.
    <span ref={ref}>
      {`${to.toLocaleString("en-US")}${suffix}`}
    </span>
  );
};

export const BoundaryUpload = ({ className }: { className?: string }) => {
  const root = useRef<HTMLDivElement>(null);
  const restart = useRef(() => {});
  const [phase, setPhase] = useState<Phase>("idle");

  // In view (most of it), it runs and loops; out of view, it stops and
  // resets, so scrolling back starts it again from the upload.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timers: number[] = [];
    let running = false;
    const stop = () => {
      for (const t of timers) window.clearTimeout(t);
      timers = [];
    };
    const play = () => {
      stop();
      if (still) {
        timers = [window.setTimeout(() => setPhase("results"), 0)];
        return;
      }
      setPhase("idle");
      const last = TIMELINE[TIMELINE.length - 1][1];
      timers = [...TIMELINE.map(([p, ms]) => window.setTimeout(() => setPhase(p), ms)), window.setTimeout(play, last + HOLD)];
    };
    restart.current = play;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.45 && !running) {
          running = true;
          play();
        } else if (!entry.isIntersecting && running) {
          running = false;
          stop();
          setPhase("idle");
        }
      },
      { threshold: [0, 0.45] },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      stop();
    };
  }, []);

  const land = !at(phase, "scan");
  const tab = (active: boolean) => cn("border-b-2 pb-2 transition-colors duration-500", active ? "border-white text-white" : "border-transparent text-white/55");

  return (
    <GlassFrame ref={root} backdrop={forestEdge} rise className={className} innerClassName="motion-reduce:[&_*]:transition-none lg:grid lg:h-[44rem] lg:grid-cols-[25rem_1fr]">
      <div className="flex flex-col gap-6 p-6 lg:order-1 lg:p-8">
        <div>
          <MdArrowBack aria-hidden className="size-6 text-white/80" />
          <p className="mt-4 font-mono text-[12px] tracking-[0.08em] text-white/70 uppercase">Step 2 of 2</p>
          <p className="mt-1 font-display text-[40px] leading-[44px] font-bold">Assess land</p>
          <p aria-hidden className="mt-4 flex gap-5 border-b border-white/15 text-[15px] leading-5">
            <span className={tab(land)}>Land</span>
            <span className={tab(!land)}>Land suitability</span>
            <span className={tab(false)}>Credit projection</span>
          </p>
        </div>

        {land ? (
          <div className="grid gap-4">
            <p className="font-mono text-[12px] tracking-[0.08em] text-white/70 uppercase">Boundary</p>
            <div className="grid place-items-center gap-2 rounded-[12px] border border-dashed border-white/30 px-4 py-6 text-center text-[14px] leading-5 text-white/75">
              <MdUploadFile aria-hidden className="size-7" />
              Drop a KML, KMZ or shapefile
            </div>
            <div className={cn("grid gap-2 rounded-[12px] bg-white/8 p-4 transition-all duration-500", at(phase, "upload") ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")}>
              <p className="flex items-center gap-2 text-[14px] leading-5">
                <MdInsertDriveFile aria-hidden className="size-5 text-bn-green" />
                project-boundary.kml
                <span className="ml-auto text-white/60">1.2 MB</span>
              </p>
              <span className="h-1 overflow-hidden rounded-full bg-white/15">
                <span className={cn("block h-full rounded-full bg-bn-green transition-[width] duration-[1600ms] ease-out", at(phase, "upload") ? "w-full" : "w-0")} />
              </span>
            </div>
            <p className={cn("text-[15px] leading-6 transition-opacity duration-500", at(phase, "drawn") ? "opacity-100" : "opacity-0")}>
              Boundary drawn: <Count to={TOTAL_HA} on={at(phase, "drawn")} suffix=" ha" />
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            <p className="flex items-center gap-2 font-mono text-[12px] tracking-[0.08em] text-white/70 uppercase">
              Results <MdInfoOutline aria-hidden className="size-4" />
            </p>
            <p className="text-[14px] leading-5 text-white/75">Land must be a suitable classification type without recent deforestation.</p>
            <div className="flex items-center gap-4">
              <span className="h-3 flex-1 overflow-hidden rounded-full bg-white">
                <span className={cn("block h-full rounded-full bg-bn-green transition-[width] duration-[1300ms] ease-out", phase === "results" ? "w-[35%]" : "w-0")} />
              </span>
              <span className="text-[15px] leading-5 font-bold">
                <Count to={SUITABLE_PCT} on={phase === "results"} suffix="% suitable" />
              </span>
            </div>
            <ul className={cn("grid gap-3 text-[14px] leading-5 transition-opacity duration-500", phase === "results" ? "opacity-100" : "opacity-40")}>
              {GROUPS.map((g) => (
                <li key={g.label} className="grid gap-2">
                  <p className="flex font-medium">
                    {g.label}
                    <span className="ml-auto">
                      <Count to={g.ha} on={phase === "results"} suffix=" ha" />
                    </span>
                  </p>
                  {g.rows.map((r) => (
                    <p key={r.label} className="flex items-center gap-2 pl-4 text-white/85">
                      <span aria-hidden className={cn("h-4 w-1.5 rounded-full", r.swatch)} />
                      {r.label}
                      <span className="ml-auto">
                        <Count to={r.ha} on={phase === "results"} suffix=" ha" />
                      </span>
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p aria-live="polite" className="sr-only">
          {STATUS[phase]}
        </p>
        <button
          type="button"
          onClick={() => restart.current()}
          className={cn("mt-auto inline-flex items-center gap-2 self-start rounded-full border border-white/40 px-4 py-2 text-[14px] leading-5 hover:bg-white/10", BN.focus, "focus-visible:outline-white")}
        >
          <MdReplay aria-hidden className="size-5" />
          Upload again
        </button>
      </div>

      <div className="relative aspect-[1000/585] overflow-hidden border-white/10 bg-black lg:order-2 lg:aspect-auto lg:h-full lg:border-l">
        <Image
          src={landMap}
          alt="Satellite imagery of a supplier's land with its boundary drawn: once assessed, suitable land shows in cyan and unsuitable land in orange"
          sizes="(min-width: 1376px) 920px, (min-width: 1024px) 70vw, 100vw"
          placeholder="blur"
          className={cn("size-full object-cover transition-[filter] duration-[1600ms]", phase === "results" ? "" : "brightness-[0.55] grayscale")}
        />
        <svg viewBox="0 0 1000 585" preserveAspectRatio="xMidYMid slice" aria-hidden className="absolute inset-0 size-full">
          {PARCELS.map((d) => (
            <path
              key={d.slice(0, 12)}
              d={d}
              pathLength={1}
              strokeLinejoin="round"
              className={cn(
                "fill-white stroke-white [stroke-dasharray:1] [stroke-width:2.5] transition-[stroke-dashoffset,fill-opacity] duration-[1800ms] ease-out",
                at(phase, "drawn") ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:1]",
                phase === "drawn" || phase === "scan" ? "[fill-opacity:0.15]" : "[fill-opacity:0]",
              )}
            />
          ))}
        </svg>
        {phase === "scan" ? <span aria-hidden className="absolute inset-y-0 -left-1/4 w-1/4 bg-linear-to-r from-transparent via-bn-green/45 to-transparent motion-safe:animate-[scan_1.6s_ease-in-out_forwards]" /> : null}
      </div>
    </GlassFrame>
  );
};
