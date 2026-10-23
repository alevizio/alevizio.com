import { MdInfoOutline, MdNorthEast } from "react-icons/md";
import { cn } from "../cn";
import { CountUp } from "../count-up";
import { ForestLossMap } from "./forest-loss-map";

/* Manoa's carbon monitoring, rebuilt live from the Project / Monitoring
 * page of the project data roadmapping Figma: the project's header, its
 * latest monitoring update, the climate benefit year by year, and the
 * forest loss map, which runs on real data. The update's words and the
 * chart's figures are the design's own, but for the baseline in the
 * legend: the design's 24,816,000 didn't add up, so it's 20,816,000. */
const YEARS = [2017, 2018, 2019, 2020, 2021];
const BASELINE = [2300, 2800, 3500, 3750, 5000];
const PROJECT = [1200, 1450, 1800, 1900, 2600];
const TICKS = [5000, 4000, 3000, 2000, 1000, 0];
const MAX = 5000;
const W = 600;
const H = 300;
const SLOT = W / YEARS.length;
const BAR = 50;
const GAP = 6;
const DELAYS = ["", "[--reveal-delay:0.08s]", "[--reveal-delay:0.16s]", "[--reveal-delay:0.24s]", "[--reveal-delay:0.32s]"];
const COLOR = { baseline: "#33494a", project: "#ff6159" };
const num = (n: number) => n.toLocaleString("en-US");
const yOf = (value: number) => H - (value / MAX) * H;

// A bar standing on the axis, its top corners rounded.
const bar = (x: number, value: number, r = 5) => {
  const top = yOf(value);
  return `M${x} ${H}V${top + r}Q${x} ${top} ${x + r} ${top}H${x + BAR - r}Q${x + BAR} ${top} ${x + BAR} ${top + r}V${H}Z`;
};

const CO2e = () => (
  <>
    CO<sub>2</sub>e
  </>
);

// The climate benefit's stripes: the swatch draws them in CSS, the chart in SVG.
const HATCH = "bg-[repeating-linear-gradient(-45deg,#a4d44a_0_3px,#c8e88c_3px_6px)]";

const BENEFIT = [
  { label: "Baseline emissions", value: 20816000, swatch: "bg-[#33494a]" },
  { label: "Project emissions", value: 16000000, swatch: "bg-[#ff6159]", minus: true },
  { label: "Climate benefit", value: 4816000, swatch: HATCH, total: true },
];

const Brazil = () => (
  <svg viewBox="0 0 20 14" aria-hidden className="h-3.5 w-5 shrink-0 rounded-[2px]">
    <rect width="20" height="14" fill="#009c3b" />
    <path d="M10 1.6 18.2 7 10 12.4 1.8 7Z" fill="#ffdf00" />
    <circle cx="10" cy="7" r="3.1" fill="#002776" />
  </svg>
);

const Chart = () => (
  <figure className="min-w-0">
    <div className="grid grid-cols-[auto_1fr] gap-x-3">
      <div aria-hidden className="flex flex-col justify-between py-0.5 text-right text-[11px] leading-none text-bn-medium">
        {TICKS.map((t) => (
          <span key={t}>{num(t)}</span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden className="block aspect-[2/1] w-full overflow-visible">
        <defs>
          <pattern id="climate-benefit-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#c8e88c" />
            <rect width="3" height="6" fill="#a4d44a" />
          </pattern>
        </defs>
        {TICKS.slice(0, -1).map((t) => (
          <line key={t} x1={0} x2={W} y1={yOf(t)} y2={yOf(t)} stroke="#eff2f1" />
        ))}
        {YEARS.map((year, i) => {
          const x = i * SLOT + (SLOT - 2 * BAR - GAP) / 2;
          return (
            <g key={year} data-reveal="grow-y" className={DELAYS[i]}>
              <path d={bar(x, BASELINE[i])} fill={COLOR.baseline} />
              <path d={bar(x + BAR + GAP, BASELINE[i])} fill="url(#climate-benefit-hatch)" />
              <path d={bar(x + BAR + GAP, PROJECT[i])} fill={COLOR.project} />
            </g>
          );
        })}
        <line x1={0} x2={W} y1={H} y2={H} stroke="#c0c9c9" />
      </svg>
      <span />
      <div aria-hidden className="mt-2 grid grid-cols-5 text-center text-[12px] font-medium text-bn-heavy">
        {YEARS.map((year) => (
          <span key={year}>{year}</span>
        ))}
      </div>
    </div>
    <figcaption className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] leading-5 font-medium sm:justify-end">
      {BENEFIT.map(({ label, swatch }) => (
        <span key={label} className="flex items-center gap-2">
          <span aria-hidden className={cn("size-3 rounded-[3px]", swatch)} />
          {label}
        </span>
      ))}
    </figcaption>
    <table className="sr-only">
      <caption>Manoa&rsquo;s baseline and project emissions by year, the design&rsquo;s sample figures</caption>
      <thead>
        <tr>
          <th scope="col">Year</th>
          <th scope="col">Baseline emissions</th>
          <th scope="col">Project emissions</th>
        </tr>
      </thead>
      <tbody>
        {YEARS.map((year, i) => (
          <tr key={year}>
            <th scope="row">{year}</th>
            <td>{num(BASELINE[i])}</td>
            <td>{num(PROJECT[i])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </figure>
);

export const CarbonMonitoring = ({ className }: { className?: string }) => (
  <div className={cn("rounded-[20px] bg-white p-3 text-bn-heavy shadow-[0_24px_80px_rgb(20_26_23/0.12)] ring-1 ring-black/5 sm:p-6 lg:p-8", className)}>
    <h4 className="font-display text-[40px] leading-none font-bold sm:text-[48px]">Manoa</h4>
    <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] leading-5 lg:[&>li+li]:border-l lg:[&>li+li]:border-bn-grey-light lg:[&>li+li]:pl-4">
      <li className="flex items-center gap-2">
        <Brazil /> Manoa, Brazil
      </li>
      <li>74,039 hectares</li>
      <li>REDD+ Avoided Planned Deforestation</li>
      <li>
        Verified Carbon Standard <span className="ml-1.5 text-[12px] text-bn-medium">Registry ID: 674</span>
      </li>
    </ul>
    {/* The page's two tabs, on the second. */}
    <div className="mt-5 flex border-b border-bn-grey-light text-[14px]">
      <span className="px-4 py-3 text-bn-medium sm:px-6">Evaluation</span>
      <span className="-mb-px border-b-2 border-bn-heavy px-4 py-3 font-medium sm:px-6">Carbon Monitoring</span>
    </div>

    {/* The update, the climate benefit and the map, one under the other as on the page. */}
    <section className="mt-6 grid gap-x-8 gap-y-5 rounded-[14px] border border-bn-grey-light p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 lg:flex-col lg:justify-start">
        <div>
          <h5 className="text-[20px] leading-7 font-bold">Carbon Monitoring update</h5>
          <p className="text-[13px] text-bn-medium">April 11, 2023</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-bn-green px-2 py-1 font-mono text-[10px] leading-none font-bold uppercase">
          Not at risk of reversal <MdInfoOutline aria-hidden className="size-3" />
        </span>
      </div>
      <div className="grid gap-4 text-[14px] leading-6 sm:grid-cols-2 sm:gap-8">
        <p>
          As of June 2022 the project is not at risk of reversal. Observed project emissions during the monitoring period January 2022 - June 2022 is
          1,785.24 tons of CO2e. Cumulative project emissions observed since the project start represent 16.40% of the project&rsquo;s
          leakage-adjusted baseline emissions over the same period.
        </p>
        <p>
          These emissions are due to forest loss in the southern half of the project&rsquo;s crediting area. It appears that this forest loss was
          due to the creation of a series of dirt roads.
        </p>
      </div>
    </section>

    <section className="mt-4 grid gap-x-10 gap-y-6 rounded-[14px] border border-bn-grey-light p-4 sm:mt-5 sm:p-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <div>
        <h5 className="text-[20px] leading-7 font-bold">Total climate benefit</h5>
        <p className="text-[13px] text-bn-medium">Project active 2009 &ndash; present</p>
        <p className="mt-6 flex items-center gap-3 text-[40px] leading-none sm:text-[48px]">
          <CountUp value={2400000} />
          <span className="grid h-6 w-8 place-items-center rounded-full bg-bn-green-light">
            <MdNorthEast aria-hidden className="size-4" />
          </span>
        </p>
        <p className="mt-2 text-[13px]">
          cumulative metric tons of <CO2e />
        </p>
        <dl className="mt-6 grid max-w-[22rem] gap-2.5 rounded-[12px] bg-bn-grey-lightest p-3 text-[12px] sm:p-4 sm:text-[13px]">
          {BENEFIT.map(({ label, value, swatch, minus, total }) => (
            <div key={label} className={cn("grid grid-cols-[1rem_auto_1fr] items-center gap-x-1.5 sm:gap-x-2", total && "border-t border-bn-grey-light pt-2.5")}>
              <span aria-hidden className={cn("size-3.5 rounded-full", swatch)} />
              <dt>{label}</dt>
              <dd className={cn("text-right whitespace-nowrap", total && "text-[16px] font-bold")}>
                {minus ? <>&minus; </> : null}
                {num(value)} <span className="text-[11px] font-normal text-bn-medium">t<CO2e /></span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <Chart />
    </section>

    <ForestLossMap className="mt-4 sm:mt-5" />
  </div>
);
