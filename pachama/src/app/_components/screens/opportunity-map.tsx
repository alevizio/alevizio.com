"use client";

import heatmap from "@/assets/screens/heatmap.jpg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdAdd, MdArrowForward } from "react-icons/md";
import { cn } from "../cn";

/* "Start your forest carbon project today", rebuilt live over the design's
 * own map layer (Insights 2024, the forest carbon potential of the Amazon).
 * The map drifts, the pins land one by one, and every few seconds the
 * opportunity card glides to another region and counts up what the land
 * could remove and earn; pick a pin and it stays there. The first
 * opportunity is the design's (500 ha of reforestation in Maranhão); the
 * others are samples at the same rates per hectare. */
type Spot = {
  region: string;
  type: "Reforestation" | "Agroforestry";
  ha: number;
  /** Literal position classes, so Tailwind sees them. */
  at: string;
  /** Pins near the top open their card below; near the right edge, to the left. */
  below?: boolean;
  left?: boolean;
};

const SPOTS: Spot[] = [
  { region: "Brazil, Maranhão", type: "Reforestation", ha: 500, at: "left-[88%] top-[53%]", left: true },
  { region: "Brazil, Pará", type: "Reforestation", ha: 1200, at: "left-[68%] top-[56%]" },
  { region: "Brazil, Amapá", type: "Agroforestry", ha: 800, at: "left-[70%] top-[33%]", below: true },
  { region: "Brazil, Rondônia", type: "Reforestation", ha: 2000, at: "left-[43%] top-[80%]" },
  { region: "Brazil, Mato Grosso", type: "Reforestation", ha: 3000, at: "left-[64%] top-[86%]" },
  { region: "Brazil, Acre", type: "Agroforestry", ha: 650, at: "left-[30%] top-[75%]" },
  { region: "Peru, Ucayali", type: "Reforestation", ha: 900, at: "left-[23%] top-[66%]" },
  { region: "Brazil, Amazonas", type: "Agroforestry", ha: 1500, at: "left-[56%] top-[50%]" },
];
// The design's rates: 246,416 tonnes and $23,248 for 500 hectares over 30 years.
const TONNES_PER_HA = 246416 / 500;
const DOLLARS_PER_HA = 23248 / 500;
const CYCLE_MS = 5200;
const DROP = ["[--d:0.1s]", "[--d:0.25s]", "[--d:0.4s]", "[--d:0.55s]", "[--d:0.7s]", "[--d:0.85s]", "[--d:1s]", "[--d:1.15s]"];

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** Counts up to `to` whenever `run` changes. */
const Tally = ({ to, run, prefix = "" }: { to: number; run: string; prefix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = prefix + fmt(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 1100);
      el.textContent = prefix + fmt(to * (1 - (1 - t) ** 3));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, run, prefix]);
  return <span ref={ref}>{prefix + fmt(to)}</span>;
};

export const OpportunityMap = ({ className }: { className?: string }) => {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [seen, setSeen] = useState(false);
  const spot = SPOTS[active];

  // Start when it's on screen; cycle until someone picks a pin.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!seen || !auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % SPOTS.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [seen, auto]);

  return (
    <div ref={root} className={cn("relative overflow-hidden bg-[#dcdcdc] text-white", className)}>
      <div className="relative aspect-[1886/1408] max-h-[56rem] w-full sm:aspect-[16/10]">
        {/* The map layer drifts slowly; the pins ride on it. */}
        <div className="absolute inset-0 motion-safe:animate-[drift_28s_ease-in-out_infinite_alternate]">
          <Image src={heatmap} alt="The forest carbon potential of the Amazon basin, from pale (low) to deep green-blue (high), with project opportunities pinned across it" fill sizes="100vw" placeholder="blur" className="object-cover" />
          {SPOTS.map((s, i) => (
            <button
              key={s.region}
              type="button"
              aria-pressed={active === i}
              aria-label={`${s.region}: ${s.type}, ${fmt(s.ha)} hectares`}
              onClick={() => {
                setActive(i);
                setAuto(false);
              }}
              className={cn(
                "group absolute grid size-9 -translate-1/2 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-white",
                s.at,
                seen ? "motion-safe:animate-[pin-drop_0.6s_var(--ease-arrive)_both] motion-safe:[animation-delay:var(--d)]" : "motion-safe:opacity-0",
                DROP[i],
              )}
            >
              {active === i ? <span aria-hidden className="absolute inset-0 rounded-full bg-[#84e1ff]/35 motion-safe:animate-ping" /> : null}
              <span aria-hidden className={cn("relative size-4 rounded-full border-[3px] bg-[#0e2517] transition-all duration-300", active === i ? "scale-125 border-[#84e1ff]" : "border-white group-hover:scale-125")} />
            </button>
          ))}
          {/* The card glides to the active pin. */}
          <div
            aria-live="polite"
            className={cn(
              "absolute z-10 hidden w-[19rem] -translate-x-1/2 rounded-[14px] bg-[#0e2517]/90 shadow-[0_24px_60px_rgb(0_0_0/0.35)] backdrop-blur-md transition-[left,top] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:block",
              spot.at,
              spot.left ? "-translate-x-[calc(100%+1.75rem)] -translate-y-1/2" : spot.below ? "translate-y-7" : "-translate-y-[calc(100%+1.75rem)]",
            )}
          >
            <div key={spot.region} className="motion-safe:animate-[arrive_0.5s_var(--ease-arrive)_both]">
              <p className="border-b border-white/10 px-5 pt-4 pb-3 text-[17px] leading-6 font-medium">{spot.region}</p>
              <div className="grid gap-3 px-5 pt-3 pb-5">
                <p className="text-[13px] leading-4 text-[#84e1ff]">Project opportunity</p>
                <p className="flex gap-3 text-[15px] leading-5">
                  {spot.type}
                  <span aria-hidden className="w-px bg-white/30" />
                  30 years
                  <span aria-hidden className="w-px bg-white/30" />
                  {fmt(spot.ha)} ha
                </p>
                <p className="text-[13px] leading-5 text-white/80">
                  You can remove
                  <span className="block text-[26px] leading-8 font-bold text-white">
                    <Tally to={spot.ha * TONNES_PER_HA} run={spot.region} />
                  </span>
                  tonnes of CO₂e from the atmosphere
                </p>
                <p className="text-[13px] leading-5 text-white/80">
                  And make
                  <span className="block text-[26px] leading-8 font-bold text-white">
                    <Tally to={spot.ha * DOLLARS_PER_HA} run={spot.region} prefix="$" />
                  </span>
                  that&rsquo;s ${DOLLARS_PER_HA.toFixed(2)} per hectare
                </p>
                <span className="mt-1 flex h-10 items-center justify-center gap-2 rounded-[10px] border border-white/60 text-[14px] leading-5">
                  Start your project here <MdAdd aria-hidden className="size-4" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* The pitch, over a pine wash so it reads on the map. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#0e2517]/85 via-[#0e2517]/35 to-transparent" />
        <div className="pointer-events-none absolute inset-0 px-6 pt-10 sm:px-12 sm:pt-16 lg:px-16">
          <p className="type-label text-white/85">Partner with Pachama</p>
          <p className="type-section mt-4 max-w-[13ch] text-white">Start your forest carbon project today</p>
          <p className="mt-5 max-w-[26rem] text-[16px] leading-6 text-white/85 sm:text-[18px] sm:leading-7">
            Partner with Pachama to access technology and financing for your reforestation project.
          </p>
          <p className="mt-7 hidden flex-wrap items-center gap-6 text-[15px] sm:flex">
            <span className="flex h-12 items-center gap-2 rounded-[10px] border border-white/80 px-6">
              Create your carbon project <MdAdd aria-hidden className="size-5" />
            </span>
            <span className="flex items-center gap-2 underline underline-offset-4">
              Learn how we estimate your impact <MdArrowForward aria-hidden className="size-5" />
            </span>
          </p>
        </div>
      </div>

      {/* On phones the card sits under the map. */}
      <div className="bg-[#0e2517] p-5 sm:hidden">
        <p className="text-[17px] leading-6 font-medium">{spot.region}</p>
        <p className="mt-1 text-[14px] leading-5 text-white/80">
          {spot.type} · 30 years · {fmt(spot.ha)} ha: remove <Tally to={spot.ha * TONNES_PER_HA} run={spot.region} /> tCO₂e and make{" "}
          <Tally to={spot.ha * DOLLARS_PER_HA} run={spot.region} prefix="$" />.
        </p>
      </div>
    </div>
  );
};
