"use client";

import { useEffect, useRef, useState } from "react";
import { MdCheckCircle, MdClose, MdExpandMore } from "react-icons/md";
import { Button } from "../banyan/button";
import { BN } from "../banyan/ui";
import { cn } from "../cn";
import { CountUp } from "../count-up";
import { Globe } from "./globe";

/* Portfolio 3.0, rebuilt live from its Figma: a buyer's carbon at a glance.
 * The totals count up, each year's bar rises in turn with the compensation
 * targets sweeping over them, the cost bands grow, every breakdown fills
 * segment by segment, and the globe turns to where the credits come from.
 * Point at a year or a segment to read it; filter the years; turn the
 * targets off; retire an order and the tracking banner comes up. The
 * figures are the design's own (its sample portfolio), traced from it. */

// ---- Carbon by year: four layers of credits, past in the indigo ramp and
// projected years in grey. Thousands of tCO2e, traced from the design.
const FIRST = 2005;
const NOW = 2024;
const TOTALS = [33, 55, 81, 107, 126, 137, 144, 259, 274, 278, 285, 315, 330, 333, 393, 489, 526, 563, 619, 619, 620, 625, 630, 640, 650, 660, 675, 690, 700, 715];
const TARGETS = [90, 95, 100, 106, 112, 118, 124, 170, 235, 268, 276, 287, 300, 330, 380, 465, 518, 557, 588, 600, 600, 604, 610, 620, 630, 642, 655, 668, 682, 700];
const LAYER_SHARE = [0.45, 0.2, 0.2, 0.15];
const PAST_FILL = ["fill-[#2b528e]", "fill-[#568ad9]", "fill-[#6ba6ff]", "fill-[#a6caff]"];
const FUTURE_FILL = ["fill-[#6f7f78]", "fill-[#8f9d97]", "fill-[#b3bdb8]", "fill-[#d4dbd7]"];
// Literal classes for Tailwind: the bars rise one after another.
const BAR_DELAYS = [
  "[--reveal-delay:0.00s]", "[--reveal-delay:0.03s]", "[--reveal-delay:0.06s]", "[--reveal-delay:0.09s]", "[--reveal-delay:0.12s]", "[--reveal-delay:0.15s]",
  "[--reveal-delay:0.18s]", "[--reveal-delay:0.21s]", "[--reveal-delay:0.24s]", "[--reveal-delay:0.27s]", "[--reveal-delay:0.30s]", "[--reveal-delay:0.33s]",
  "[--reveal-delay:0.36s]", "[--reveal-delay:0.39s]", "[--reveal-delay:0.42s]", "[--reveal-delay:0.45s]", "[--reveal-delay:0.48s]", "[--reveal-delay:0.51s]",
  "[--reveal-delay:0.54s]", "[--reveal-delay:0.57s]", "[--reveal-delay:0.60s]", "[--reveal-delay:0.63s]", "[--reveal-delay:0.66s]", "[--reveal-delay:0.69s]",
  "[--reveal-delay:0.72s]", "[--reveal-delay:0.75s]", "[--reveal-delay:0.78s]", "[--reveal-delay:0.81s]", "[--reveal-delay:0.84s]", "[--reveal-delay:0.87s]",
];
const CW = 1200;
const CH = 250;
const MAX = 760;
const STEP = CW / TOTALS.length;
const cy = (k: number) => CH - (k / MAX) * CH;
const TARGET_PATH = TARGETS.map((k, i) => `${i ? "L" : "M"}${(i * STEP + STEP / 2).toFixed(1)} ${cy(k).toFixed(1)}`).join(" ");
const fmtK = (k: number) => `${k.toLocaleString("en-US")},000`;

type Span = "all" | "past" | "future";
const SPANS: { id: Span; label: string }[] = [
  { id: "all", label: "All" },
  { id: "past", label: "Past" },
  { id: "future", label: "Future" },
];

const AnnualCarbon = () => {
  const [span, setSpan] = useState<Span>("all");
  const [at, setAt] = useState<number | null>(null);
  const [targets, setTargets] = useState(true);
  const inSpan = (year: number) => span === "all" || (span === "past" ? year <= NOW : year > NOW);
  const read =
    at === null
      ? `${NOW}: ${fmtK(TOTALS[NOW - FIRST])} tCO2e`
      : `${FIRST + at}${FIRST + at > NOW ? ", projected" : ""}: ${fmtK(TOTALS[at])} tCO2e · target ${fmtK(TARGETS[at])}`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div role="group" aria-label="Years shown" className="flex overflow-hidden rounded-full ring-1 ring-bn-heavy/40">
          {SPANS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={span === s.id}
              onClick={() => setSpan(s.id)}
              className={cn("px-4 py-2 text-[14px] leading-5 transition-colors", span === s.id ? "bg-bn-heavy/10 font-bold" : "hover:bg-bn-heavy/5", BN.focus)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="text-[15px] text-bn-medium">26 total projects</p>
        <p aria-hidden className="ml-auto font-mono text-[13px] text-bn-medium">
          {read}
        </p>
      </div>

      <div className="relative mt-6 aspect-[1200/290]" onMouseLeave={() => setAt(null)}>
        <svg viewBox={`0 0 ${CW} ${CH + 40}`} aria-hidden className="absolute inset-0 size-full overflow-visible">
          {[100, 200, 300, 400, 500, 600, 700].map((k) => (
            <g key={k}>
              <line x1={0} x2={CW} y1={cy(k)} y2={cy(k)} className="stroke-[#e9e4d3]" strokeDasharray="4 6" />
              <text x={0} y={cy(k) - 4} className="fill-bn-medium text-[13px]">
                {k}K
              </text>
            </g>
          ))}
          <rect x={(NOW - FIRST) * STEP + 2} y={cy(TOTALS[NOW - FIRST]) - 16} width={STEP - 4} height={CH - cy(TOTALS[NOW - FIRST]) + 50} rx={12} className="fill-[#e3e7e4]" />
          {TOTALS.map((k, i) => {
            const year = FIRST + i;
            const fills = year <= NOW ? PAST_FILL : FUTURE_FILL;
            let top = CH;
            return (
              <g key={year}>
                <g data-reveal="grow-y" className={cn("transition-opacity duration-300", BAR_DELAYS[i], (!inSpan(year) || (at !== null && at !== i)) && "opacity-35")}>
                  {LAYER_SHARE.map((share, l) => {
                    const h = ((k * share) / MAX) * CH;
                    top -= h;
                    const x = i * STEP + STEP * 0.2;
                    const w = STEP * 0.6;
                    // One bar in four layers: only the top of the stack is rounded.
                    if (l < LAYER_SHARE.length - 1) return <rect key={l} x={x} y={top} width={w} height={h + 0.5} className={fills[l]} />;
                    const r = Math.min(6, h, w / 2);
                    return <path key={l} d={`M${x} ${top + h}V${top + r}A${r} ${r} 0 0 1 ${x + r} ${top}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${top + r}V${top + h}Z`} className={fills[l]} />;
                  })}
                </g>
                <text x={i * STEP + STEP / 2} y={CH + 26} textAnchor="middle" className={cn("text-[12.5px]", year === NOW ? "fill-bn-heavy font-bold" : year > NOW ? "fill-bn-light" : "fill-bn-medium")}>
                  {year}
                </text>
                <rect x={i * STEP} y={0} width={STEP} height={CH + 40} className="fill-transparent" onMouseEnter={() => setAt(i)} />
              </g>
            );
          })}
        </svg>
        <svg
          viewBox={`0 0 ${CW} ${CH + 40}`}
          aria-hidden
          data-reveal="sweep"
          className={cn("pointer-events-none absolute inset-0 size-full overflow-visible transition-opacity duration-500 [--reveal-delay:0.5s]", targets ? "opacity-100" : "opacity-0")}
        >
          <path d={TARGET_PATH} fill="none" strokeWidth={4} strokeDasharray="12 10" strokeLinecap="round" className="stroke-[#5fd068]" />
        </svg>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-[16px] bg-[#f6f3e8] px-5 py-4">
        <span aria-hidden className="h-0 w-10 border-t-4 border-dashed border-[#5fd068]" />
        <label className="flex items-center gap-3 text-[15px]">
          Compensation targets
          <input type="checkbox" role="switch" checked={targets} onChange={(e) => setTargets(e.target.checked)} className={cn("peer sr-only")} />
          <span aria-hidden className="relative h-6 w-11 rounded-full bg-bn-heavy/20 transition-colors peer-checked:bg-bn-green peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bn-heavy">
            <span className={cn("absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform", targets && "translate-x-5")} />
          </span>
        </label>
      </div>

      <table className="sr-only">
        <caption>Carbon by year, in tCO2e, with the compensation target; years after {NOW} are projected</caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">Carbon</th>
            <th scope="col">Target</th>
          </tr>
        </thead>
        <tbody>
          {TOTALS.map((k, i) => (
            <tr key={i}>
              <th scope="row">{FIRST + i}</th>
              <td>{fmtK(k)}</td>
              <td>{fmtK(TARGETS[i])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ---- Project cost: how many projects fall in each price band, in teal.
const COSTS = [
  { band: "0–$10", n: 1, fill: "fill-[#2e7f96]" },
  { band: "$10–15", n: 6, fill: "fill-[#bdeff8]" },
  { band: "$15–20", n: 8, fill: "fill-[#a3e7f5]" },
  { band: "$20–25", n: 5, fill: "fill-[#8fe0f1]" },
  { band: "$25–30", n: 12, fill: "fill-[#6fcfe6]" },
  { band: "$30–35", n: 8, fill: "fill-[#5bb9d4]" },
  { band: "$35–40", n: 6, fill: "fill-[#4aa0bc]" },
  { band: "$40–45", n: 2, fill: "fill-[#2e7f96]" },
];
const COST_DELAYS = ["[--reveal-delay:0s]", "[--reveal-delay:0.05s]", "[--reveal-delay:0.1s]", "[--reveal-delay:0.15s]", "[--reveal-delay:0.2s]", "[--reveal-delay:0.25s]", "[--reveal-delay:0.3s]", "[--reveal-delay:0.35s]"];

const ProjectCost = () => {
  const [at, setAt] = useState<number | null>(null);
  const W = 560;
  const H = 180;
  const bw = W / COSTS.length;
  const y = (n: number) => H - (n / 14) * H;
  return (
    <section>
      <h5 className="text-[22px] leading-7">
        <b>Project cost</b> <span className="text-bn-medium">by tCO2e</span>
      </h5>
      <p aria-hidden className="mt-1 h-5 font-mono text-[13px] text-bn-medium">
        {at === null ? "Point at a band" : `${COSTS[at].band}: ${COSTS[at].n} projects`}
      </p>
      <svg viewBox={`0 0 ${W} ${H + 28}`} aria-hidden className="mt-2 w-full overflow-visible" onMouseLeave={() => setAt(null)}>
        {[2, 4, 6, 8, 10, 12, 14].map((n) => (
          <line key={n} x1={0} x2={W} y1={y(n)} y2={y(n)} className="stroke-[#ece7d6]" strokeDasharray="3 5" />
        ))}
        {COSTS.map((c, i) => (
          <g key={c.band} onMouseEnter={() => setAt(i)}>
            <g data-reveal="grow-y" className={cn("transition-opacity", COST_DELAYS[i], at !== null && at !== i && "opacity-40")}>
              <rect x={i * bw + 1} y={y(c.n)} width={bw - 2} height={H - y(c.n)} className={c.fill} />
            </g>
            <text x={i * bw + bw / 2} y={H + 20} textAnchor="middle" className="fill-bn-medium text-[12px]">
              {c.band}
            </text>
          </g>
        ))}
      </svg>
      <p className="sr-only">{COSTS.map((c) => `${c.band}: ${c.n} projects`).join("; ")}.</p>
    </section>
  );
};

// ---- The breakdowns: one bar each, filling segment by segment.
type Part = { label: string; share: number; grow: string; fill: string };
const SEG_DELAYS = ["[--reveal-delay:0s]", "[--reveal-delay:0.12s]", "[--reveal-delay:0.24s]", "[--reveal-delay:0.36s]", "[--reveal-delay:0.48s]", "[--reveal-delay:0.6s]"];

const Breakdown = ({ title, parts }: { title: string; parts: Part[] }) => {
  const [hot, setHot] = useState<string | null>(null);
  return (
    <section>
      <h5 className="text-[22px] leading-7">
        <b>{title}</b> <span className="text-bn-medium">by tCO2e</span>
      </h5>
      <div aria-hidden className="mt-3 flex h-8 gap-px overflow-hidden rounded-[10px]">
        {parts.map((p, i) => (
          <span
            key={p.label}
            data-reveal="grow-x"
            onMouseEnter={() => setHot(p.label)}
            onMouseLeave={() => setHot(null)}
            className={cn("min-w-px transition-opacity", p.grow, p.fill, SEG_DELAYS[i], hot && hot !== p.label && "opacity-35")}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {parts.map((p) => (
          <li key={p.label}>
            <button
              type="button"
              onMouseEnter={() => setHot(p.label)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot(p.label)}
              onBlur={() => setHot(null)}
              className={cn("flex items-start gap-2 rounded-[4px] text-left text-[14px] leading-5", BN.focus)}
            >
              <span aria-hidden className={cn("mt-[5px] size-2.5 shrink-0 rounded-full", p.fill)} />
              {p.label}
              <span className={cn("text-bn-medium transition-opacity", hot === p.label ? "opacity-100" : "opacity-0")}>{p.share}%</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

const TYPES: Part[] = [
  { label: "Afforestation, reforestation and revegetation (ARR)", share: 56, grow: "grow-[56]", fill: "bg-[#2b528e]" },
  { label: "Agricultural land management (ALM)", share: 37, grow: "grow-[37]", fill: "bg-[#568ad9]" },
  { label: "Improved forest management (IFM)", share: 4, grow: "grow-[4]", fill: "bg-[#6ba6ff]" },
  { label: "REDD+", share: 2, grow: "grow-[2]", fill: "bg-[#a6caff]" },
  { label: "Wetlands restoration (WRC)", share: 1, grow: "grow-[1]", fill: "bg-[#d3e4ff]" },
];
const LOCATIONS: Part[] = [
  { label: "Brazil", share: 77, grow: "grow-[77]", fill: "bg-[#81f18e]" },
  { label: "Argentina", share: 10, grow: "grow-[10]", fill: "bg-[#b3f7bb]" },
  { label: "Mexico", share: 7, grow: "grow-[7]", fill: "bg-[#68ce75]" },
  { label: "United States", share: 6, grow: "grow-[6]", fill: "bg-[#378842]" },
];
const REGISTRIES: Part[] = [
  { label: "Verra", share: 18, grow: "grow-[18]", fill: "bg-[#90369f]" },
  { label: "Gold Standard", share: 39, grow: "grow-[39]", fill: "bg-[#cf6ddf]" },
  { label: "Climate Action Reserve", share: 38, grow: "grow-[38]", fill: "bg-[#ee88ff]" },
  { label: "American Carbon Registry", share: 3, grow: "grow-[3]", fill: "bg-[#f5b8ff]" },
  { label: "Isometric", share: 2, grow: "grow-[2]", fill: "bg-[#fadbff]" },
];
const METHODOLOGIES: Part[] = [
  { label: "VM0047", share: 1, grow: "grow-[1]", fill: "bg-[#6d6419]" },
  { label: "VM0007", share: 43, grow: "grow-[43]", fill: "bg-[#cabb32]" },
  { label: "VM0033", share: 15, grow: "grow-[15]", fill: "bg-[#fbf08b]" },
  { label: "VM0004", share: 41, grow: "grow-[41]", fill: "bg-[#fdf7c5]" },
];
const VERIFICATIONS: Part[] = [
  { label: "Pachama Verified", share: 28, grow: "grow-[28]", fill: "bg-[#662e0e]" },
  { label: "Pachama Original", share: 25, grow: "grow-[25]", fill: "bg-[#a8461a]" },
  { label: "ABACUS", share: 18, grow: "grow-[18]", fill: "bg-[#e0661f]" },
  { label: "CCB Gold", share: 16, grow: "grow-[16]", fill: "bg-[#ff9a57]" },
  { label: "CCB Triple Gold", share: 12, grow: "grow-[12]", fill: "bg-[#ffc39c]" },
  { label: "CDM", share: 1, grow: "grow-[1]", fill: "bg-[#ffe3d2]" },
];
const RATINGS: Part[] = [
  { label: "AAA", share: 18, grow: "grow-[18]", fill: "bg-[#378842]" },
  { label: "AA", share: 28, grow: "grow-[28]", fill: "bg-[#68ce75]" },
  { label: "BBB", share: 16, grow: "grow-[16]", fill: "bg-[#81f18e]" },
  { label: "BB", share: 13, grow: "grow-[13]", fill: "bg-[#b3f7bb]" },
  { label: "B", share: 25, grow: "grow-[25]", fill: "bg-[#d9fbdd]" },
];

const PINS = [
  { id: "Brazil", lon: -55, lat: -10 },
  { id: "Argentina", lon: -64, lat: -34 },
  { id: "Mexico", lon: -102, lat: 23 },
  { id: "United States", lon: -92, lat: 33 },
];

// ---- Purchases: the projects bought, one opened to its orders.
type Status = "Ready" | "Processing" | "Retired";
const STATUS_LOOK: Record<Status, string> = {
  Ready: "bg-bn-green text-bn-heavy",
  Processing: "bg-bn-yellow text-bn-heavy",
  Retired: "bg-bn-heavy text-white",
};
const PURCHASES = [
  { name: "Borneo Peatlands", type: "Avoided planned deforestation", method: "VM0007", country: "IDN", rating: "AAA", amount: "471,266", price: "$35.12" },
  { name: "Agrocortex", type: "Avoided planned deforestation", method: "VM0004", country: "BRA", rating: "AAA", amount: "74,192", price: "$28.23" },
  { name: "Delta Blue Carbon", type: "Blue carbon and wetland restoration", method: "VM0033", country: "PAK", rating: "BB", amount: "74,192", price: "$22.86" },
];
const ORDERS: { vintage: number; quantity: string; total: string; status: Status }[] = [
  { vintage: 2010, quantity: "1,261", total: "$2,246", status: "Ready" },
  { vintage: 2011, quantity: "3,191", total: "$6,876", status: "Ready" },
  { vintage: 2019, quantity: "2,678", total: "$4,189", status: "Retired" },
];

const Purchases = ({ onRetired }: { onRetired: () => void }) => {
  const [open, setOpen] = useState(true);
  const [orders, setOrders] = useState(ORDERS);
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);
  const retire = (i: number) => {
    setOrders((o) => o.map((x, j) => (j === i ? { ...x, status: "Processing" } : x)));
    timers.current.push(
      window.setTimeout(() => {
        setOrders((o) => o.map((x, j) => (j === i ? { ...x, status: "Retired" } : x)));
        onRetired();
      }, 1400),
    );
  };

  return (
    <section className="mt-6 rounded-[24px] bg-white p-5 ring-1 ring-[#ece6d2] sm:p-8">
      <h5 className="font-display text-[34px] leading-none font-bold">Projects purchased</h5>
      <div className="mt-6 overflow-x-auto rounded-[16px] border border-[#e3dcc3]">
        <table className="w-full min-w-[46rem] text-left text-[14px] [&_tbody_tr:last-child]:border-b-0 [&_td]:px-3 [&_th]:px-3">
          <thead className="text-bn-medium">
            <tr className="border-b border-[#ece6d2]">
              <th scope="col" className="w-10 py-3 font-normal">
                <span className="sr-only">Orders</span>
              </th>
              <th scope="col" className="py-3 font-normal">Name</th>
              <th scope="col" className="py-3 font-normal">Type</th>
              <th scope="col" className="py-3 font-normal">Methodology</th>
              <th scope="col" className="py-3 font-normal">Country</th>
              <th scope="col" className="py-3 font-normal">Rating</th>
              <th scope="col" className="py-3 text-right font-normal">Amount</th>
              <th scope="col" className="py-3 text-right font-normal">Avg price</th>
            </tr>
          </thead>
          <tbody>
            {PURCHASES.map((p, i) => {
              const withOrders = i === PURCHASES.length - 1;
              return (
                <tr key={p.name} data-reveal className={cn("border-b border-[#ece6d2] align-top", withOrders && open && "bg-[#fbf9f0]")}>
                  <td className="py-3">
                    {withOrders ? (
                      <button type="button" aria-expanded={open} aria-label={`${open ? "Hide" : "Show"} the orders for ${p.name}`} onClick={() => setOpen((o) => !o)} className={cn("grid size-7 place-items-center rounded-full hover:bg-bn-heavy/8", BN.focus)}>
                        <MdExpandMore aria-hidden className={cn("size-5 transition-transform", !open && "-rotate-90")} />
                      </button>
                    ) : null}
                  </td>
                  <td className="py-3 font-bold">
                    {p.name}
                    {withOrders && open ? (
                      <ul className="mt-3 grid gap-2 font-normal">
                        {orders.map((o, j) => (
                          <li key={o.vintage} className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-[12px] bg-white px-3 py-2 ring-1 ring-[#ece6d2]">
                            <span className={cn("rounded-[4px] px-2 py-0.5 font-mono text-[11px] font-bold uppercase transition-colors", STATUS_LOOK[o.status])}>{o.status}</span>
                            <span>Vintage {o.vintage}</span>
                            <span className="text-bn-medium">
                              {o.quantity} tCO2e · {o.total}
                            </span>
                            {o.status === "Ready" ? (
                              <Button size="sm" className="ml-auto h-7 px-3 text-[12px] leading-4" onClick={() => retire(j)}>
                                Retire
                              </Button>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </td>
                  <td className="py-3 text-bn-medium">{p.type}</td>
                  <td className="py-3 underline underline-offset-2">{p.method}</td>
                  <td className="py-3">{p.country}</td>
                  <td className="py-3 font-bold">{p.rating}</td>
                  <td className="py-3 text-right">{p.amount}</td>
                  <td className="py-3 text-right">{p.price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export const PortfolioDashboard = ({ className }: { className?: string }) => {
  const [picked, setPicked] = useState("Brazil");
  const [banner, setBanner] = useState(false);
  const pins = PINS.map((p) => ({ ...p, on: true }));

  return (
    <div className={cn("relative overflow-hidden rounded-[16px] bg-[#fdfbf1] text-bn-heavy shadow-[0_24px_80px_rgb(20_26_23/0.12)] ring-1 ring-black/5", className)}>
      <p
        role="status"
        className={cn(
          "flex items-center justify-center gap-3 overflow-hidden bg-bn-green text-[15px] transition-[max-height,opacity] duration-500",
          banner ? "max-h-14 py-3 opacity-100" : "max-h-0 py-0 opacity-0",
        )}
      >
        {banner ? (
          <>
            <MdCheckCircle aria-hidden className="size-5" />
            Retirement order has been placed.
            <button type="button" aria-label="Dismiss" onClick={() => setBanner(false)} className={cn("absolute right-4 grid size-8 place-items-center rounded-full hover:bg-bn-heavy/10", BN.focus)}>
              <MdClose aria-hidden className="size-5" />
            </button>
          </>
        ) : null}
      </p>
      <div className="p-4 sm:p-8">
        <h4 className="font-display text-[44px] leading-none font-bold">Portfolio</h4>

        <div className="mt-6 rounded-[24px] bg-white p-5 ring-1 ring-[#ece6d2] sm:p-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4">
            <div>
              <dt className="text-[15px] font-medium">Total carbon purchased</dt>
              <dd className="mt-2 flex flex-wrap items-baseline gap-x-2">
                <CountUp value={1327912} className="font-display text-[clamp(28px,3vw,40px)] leading-none font-bold" />
                <span className="text-bn-medium">tCO2e</span>
              </dd>
            </div>
            <div>
              <dt className="text-[15px] font-medium">Total carbon retired</dt>
              <dd className="mt-2 flex flex-wrap items-baseline gap-x-2">
                <CountUp value={1167123} className="font-display text-[clamp(28px,3vw,40px)] leading-none font-bold" />
                <span className="text-bn-medium">tCO2e</span>
              </dd>
              <dd aria-hidden className="mt-3 h-1 w-full max-w-44 rounded-full bg-[#e9ecea]">
                <span data-reveal="grow-x" className="block h-full w-[88%] rounded-full bg-bn-green [--reveal-delay:0.3s]" />
              </dd>
            </div>
            <div>
              <dt className="text-[15px] font-medium">Avg carbon per year</dt>
              <dd className="mt-2 flex flex-wrap items-baseline gap-x-2">
                <CountUp value={293217} className="font-display text-[clamp(28px,3vw,40px)] leading-none font-bold" />
                <span className="text-bn-medium">tCO2e</span>
              </dd>
            </div>
            <div>
              <dt className="text-[15px] font-medium">Avg cost</dt>
              <dd className="mt-2 flex flex-wrap items-baseline gap-x-2">
                <span className="font-display text-[clamp(28px,3vw,40px)] leading-none font-bold">$23.19</span>
                <span className="text-bn-medium">per tCO2e</span>
              </dd>
            </div>
          </dl>

          <div className="mt-10">
            <AnnualCarbon />
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <ProjectCost />
            <div className="grid content-start gap-10">
              <Breakdown title="Project types" parts={TYPES} />
              <Breakdown title="Project locations" parts={LOCATIONS} />
            </div>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <div className="grid content-start gap-10">
              <Breakdown title="Project registries" parts={REGISTRIES} />
              <Breakdown title="Project methodologies" parts={METHODOLOGIES} />
              <Breakdown title="Third-party verifications" parts={VERIFICATIONS} />
              <Breakdown title="Third-party ratings" parts={RATINGS} />
            </div>
            <div className="relative min-h-[24rem] overflow-hidden rounded-[20px] bg-[radial-gradient(ellipse_at_center,#10241a_0%,#050b07_72%)] text-white">
              <Globe pins={pins} picked={picked} onPick={setPicked} label={picked} className="absolute inset-0" />
              <p className="pointer-events-none absolute bottom-4 left-4 font-mono text-[11px] tracking-[0.08em] text-white/60 uppercase">Where the credits come from</p>
            </div>
          </div>
        </div>

        <Purchases onRetired={() => setBanner(true)} />
      </div>
    </div>
  );
};
