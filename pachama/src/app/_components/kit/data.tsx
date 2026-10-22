import { cn } from "../cn";
import { UI } from "./ui";

/* Numbers the way the product and the brand set them: big, in mono labels,
 * the figures from How&How's billboard. Then the baseline chart and an
 * orders table. */
const STATS = [
  { value: "$79.2M", label: "Total funding" },
  { value: "75,020", label: "Total hectares" },
  { value: ">150", label: "Projects evaluated" },
  { value: "140,438 ha", label: "Avoided deforestation" },
];

export const StatCards = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {STATS.map((s) => (
      <div key={s.label} className={cn(UI.card, "flex items-center justify-between gap-4 p-5 sm:block")}>
        <p className={UI.label}>{s.label}</p>
        <p className="whitespace-nowrap text-[26px] font-medium leading-none tracking-[-0.02em] text-[#141a17] sm:mt-3 sm:text-[32px]">{s.value}</p>
      </div>
    ))}
  </div>
);

// Claimed baseline vs what the satellites saw, 2013 to 2020 (shape after the
// evaluation screen; illustrative values).
const YEARS = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
const CLAIMED = [0, 8, 17, 27, 40, 52, 63, 72];
const OBSERVED = [0, 10, 21, 30, 31, 32, 32, 33];
const W = 640;
const H = 260;
const x = (i: number) => 40 + (i * (W - 60)) / (YEARS.length - 1);
const y = (v: number) => H - 30 - (v * (H - 60)) / 80;
const line = (values: number[]) => values.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join("");
// The gap between the two: forward along the claim, back along what was seen.
const band = `${line(CLAIMED)}${OBSERVED.map((v, i) => `L${x(i)} ${y(v)}`).reverse().join("")}Z`;

export const BaselineChart = () => (
  <figure className={cn(UI.card, "p-6")}>
    <figcaption className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-[17px] font-medium text-[#141a17]">Baseline conservativeness</span>
      <span className="flex gap-4 text-[13px] text-[#5f6b66]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-[#141a17]" /> Claimed baseline
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-[#13adb1]" /> Pachama observed
        </span>
      </span>
    </figcaption>
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="The claimed baseline rises above what Pachama observed after 2016" className="mt-4 w-full">
      {[0, 20, 40, 60, 80].map((v) => (
        <line key={v} x1={40} x2={W - 20} y1={y(v)} y2={y(v)} stroke="#e3e6e4" />
      ))}
      <path d={band} fill="#c9ef9d" opacity="0.55" />
      <path d={line(CLAIMED)} fill="none" stroke="#141a17" strokeWidth="2" />
      <path d={line(OBSERVED)} fill="none" stroke="#13adb1" strokeWidth="2" />
      {YEARS.map((yr, i) => (
        <text key={yr} x={x(i)} y={H - 8} textAnchor="middle" className="fill-[#8a958f] font-mono text-[11px]">
          {yr}
        </text>
      ))}
    </svg>
  </figure>
);

// Sample orders, on real projects.
const ORDERS = [
  { project: "Manoa", place: "Brazil", credits: "1,250", vintage: "2021", status: "Retired" },
  { project: "Manoa", place: "Brazil", credits: "800", vintage: "2020", status: "Retired" },
  { project: "Corredores de Vida", place: "Brazil", credits: "2,000", vintage: "2023", status: "Pending" },
];

export const OrdersTable = () => (
  <div role="region" aria-label="Sample orders" tabIndex={0} className={cn(UI.card, "overflow-x-auto", UI.focus)}>
    <table className="w-full min-w-[32rem] text-left text-[14px] text-[#141a17]">
      <thead className={UI.label}>
        <tr className="border-b border-[#e3e6e4]">
          {["Project", "Credits", "Vintage", "Status"].map((h) => (
            <th key={h} scope="col" className="whitespace-nowrap px-5 py-3 font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ORDERS.map((o) => (
          <tr key={o.project + o.vintage} className="border-b border-[#e3e6e4] last:border-0">
            <td className="px-5 py-4">
              <span className="font-medium">{o.project}</span> <span className="text-[#5f6b66]">· {o.place}</span>
            </td>
            <td className="px-5 py-4">{o.credits}</td>
            <td className="px-5 py-4">{o.vintage}</td>
            <td className="px-5 py-4">
              <span className={cn("rounded-full px-2.5 py-1 text-[12px] font-medium", o.status === "Retired" ? "bg-[#e3f5e9] text-[#1f7a43]" : "bg-[#fff4d6] text-[#8a5a00]")}>
                {o.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
