import type { ReactNode } from "react";
import { cn } from "../cn";

/* What the DCAB sandbox's Baseline insights panel shows for a polygon,
 * rebuilt from the DCAB Freemium Figma with its sample figures: canopy
 * height over the years, the dynamic baseline against what the project
 * reported (the "dynamic baselines emissions graph", its second version:
 * the confidence band, and the difference between the two), and the
 * analysis in figures, from the design's country view. */

// Canopy height: the design's line, traced (its two plunges smoothed), on
// a chart squeezed to 70% of its height to make room in the panel.
const SQUEEZE = 0.7;
const sy = (y: number) => 3 + (y - 3) * SQUEEZE;
const CANOPY: [number, number][] = [
  [22, 40], [40, 39], [76, 38], [106, 47], [130, 41], [154, 44], [172, 17],
  [211, 55], [244, 19], [268, 41], [295, 52], [328, 19], [346, 14], [376, 22],
];
const CANOPY_D = `M${CANOPY.map(([x, y]) => `${x} ${sy(y).toFixed(1)}`).join("L")}`;
const CANOPY_TICKS = [
  { v: "35", y: 3 },
  { v: "30", y: 42 },
  { v: "25", y: 81 },
  { v: "20", y: 120 },
  { v: "0", y: 159 },
];

// Emissions, in tonnes, traced from the graph: Pachama's dynamic baseline,
// its band's lower edge, and the baseline the project reported.
const T0 = 2012.67;
const T1 = 2020.62;
const ex = (year: number) => 30 + ((year - T0) / (T1 - T0)) * 340;
const ey = (t: number) => 118 - (t / 2e6) * 112;
const DYNAMIC: [number, number][] = [
  [T0, 0], [2013, 60e3], [2014, 270e3], [2015, 470e3], [2015.5, 590e3], [2016, 720e3],
  [2017, 960e3], [2018, 1.25e6], [2019, 1.53e6], [2019.8, 1.84e6], [T1, 2.02e6],
];
const LOWER: [number, number][] = [
  [T0, 0], [2013, 40e3], [2014, 170e3], [2015, 330e3], [2016, 480e3],
  [2017, 700e3], [2018, 1e6], [2019, 1.23e6], [2019.8, 1.47e6], [T1, 1.62e6],
];
const REPORTED: [number, number][] = [
  [T0, 0], [2013, 50e3], [2014, 230e3], [2015, 400e3], [2015.4, 480e3], [2016, 500e3],
  [2016.5, 560e3], [2020.2, 560e3], [T1, 630e3],
];
const pts = (s: [number, number][]) => s.map(([t, v]) => `${ex(t).toFixed(1)} ${ey(v).toFixed(1)}`);
const line = (s: [number, number][]) => `M${pts(s).join("L")}`;
const BAND = `M${[...pts(DYNAMIC), ...pts(LOWER).reverse()].join("L")}Z`;
// The difference: from 2016, where the band's lower edge leaves the reported line.
const DIFFERENCE = `M${[...pts(LOWER.filter(([t]) => t >= 2016)), ...pts(REPORTED.filter(([t]) => t >= 2016)).reverse()].join("L")}Z`;
const EMISSIONS_KEY = [
  { label: "Project-reported", swatch: "h-0.5 w-4 bg-[#e9f1ec]" },
  { label: "Dynamic baseline", swatch: "h-0 w-4 border-t-2 border-dashed border-[#3fd1d6]" },
  { label: "Confidence band", swatch: "size-3 rounded-[3px] bg-white/20" },
  { label: "Emissions difference", swatch: "size-3 rounded-[3px] bg-[#c6e86b]/60" },
];

// The analysis in figures: the design's samples.
const FIGURES = [
  { label: "Deduction forecast", value: "19%" },
  { label: "Match quality", value: "Good, 3.9 of 5" },
  { label: "Donor pool", value: "112 pixels" },
  { label: "Canopy growth", value: "+2.1 m since 2004" },
  { label: "Baseline range", value: "20 years" },
  { label: "Canopy data", value: "30 m, 2003 to 2023" },
];

const Chart = ({ title, range, label, children, className }: { title: string; range: string; label: string; children: ReactNode; className?: string }) => (
  <figure className={className}>
    <figcaption className="flex items-baseline justify-between gap-3 text-[13px] text-white">
      {title} <span className="shrink-0 text-[11px] text-white/75">{range}</span>
    </figcaption>
    {/* The chart scans in from the left as it's reached, every line at once. */}
    <div data-reveal="sweep" className="mt-2 rounded-[10px] bg-white/10 p-3 ring-1 ring-white/15">
      <svg viewBox="0 0 376 136" role="img" aria-label={label} className="block w-full overflow-visible">
        {children}
      </svg>
    </div>
  </figure>
);

const Tick = ({ x, y, children, anchor = "start" }: { x: number; y: number; children: string; anchor?: "start" | "middle" }) => (
  <text x={x} y={y} fill="#ffffff" fillOpacity={0.75} fontSize={9} textAnchor={anchor} className="font-mono">
    {children}
  </text>
);

export const BaselineInsights = ({ className }: { className?: string }) => (
  <div className={cn("grid gap-5 sm:max-lg:grid-cols-2", className)}>
    {/* Over the map between lg and xl there's only room for the emissions; elsewhere both. */}
    <Chart
      title="Change in canopy height"
      range="2003 to 2024"
      className="lg:max-xl:hidden"
      label="Canopy height in metres: around 30 from 2003, rising to 33 with two dips, around 2014 and 2019, and near 33 by 2024. The design's sample line, smoothed."
    >
      {CANOPY_TICKS.map(({ v, y }) => (
        <g key={v}>
          <line x1={22} x2={376} y1={sy(y)} y2={sy(y)} stroke="#ffffff" strokeOpacity={0.14} />
          <Tick x={0} y={sy(y) + 3}>{v}</Tick>
        </g>
      ))}
      <path d={CANOPY_D} fill="none" stroke="#3ee06b" strokeWidth={2} strokeLinejoin="round" />
      {[2003, 2008, 2013, 2018, 2024].map((y) => (
        <Tick key={y} x={18 + ((y - 2003) / 21) * 358} y={134} anchor="middle">
          {String(y)}
        </Tick>
      ))}
    </Chart>

    <div>
      <Chart
        title="Baseline emissions"
        range="tCO2e, 2013 to 2020"
        label="Emissions in tonnes: the baseline the project reported levels off near 560,000 from 2016, while Pachama's dynamic baseline keeps rising to about 2 million by 2020; the gap between them, above the confidence band's lower edge, is the emissions difference. The design's sample figures."
      >
        {[0, 1e6, 2e6].map((t) => (
          <g key={t}>
            <line x1={30} x2={370} y1={ey(t)} y2={ey(t)} stroke="#ffffff" strokeOpacity={0.14} />
            <Tick x={0} y={ey(t) + 3}>{t ? `${t / 1e6}M` : "0"}</Tick>
          </g>
        ))}
        <path d={BAND} fill="#ffffff" fillOpacity={0.14} />
        <path d={DIFFERENCE} fill="#c6e86b" fillOpacity={0.5} />
        <path d={line(REPORTED)} fill="none" stroke="#e9f1ec" strokeWidth={2} strokeLinejoin="round" />
        <path d={line(DYNAMIC)} fill="none" stroke="#3fd1d6" strokeWidth={2} strokeDasharray="5 4" strokeLinejoin="round" />
        {[2013, 2016, 2020].map((y) => (
          <Tick key={y} x={ex(y)} y={134} anchor="middle">
            {String(y)}
          </Tick>
        ))}
      </Chart>
      <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] leading-4 text-white/85">
        {EMISSIONS_KEY.map(({ label, swatch }) => (
          <li key={label} className="flex items-center gap-2">
            <span aria-hidden className={cn("shrink-0", swatch)} />
            {label}
          </li>
        ))}
      </ul>
    </div>

    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:max-lg:col-span-2 sm:max-lg:grid-cols-3">
      {FIGURES.map(({ label, value }) => (
        <div key={label} className="border-t border-white/15 pt-2">
          <dt className="font-mono text-[10px] leading-4 text-white/80 uppercase">{label}</dt>
          <dd className="mt-0.5 text-[14px] leading-5 font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  </div>
);
