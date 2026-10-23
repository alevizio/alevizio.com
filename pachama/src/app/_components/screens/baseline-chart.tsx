import { cn } from "../cn";

/* Manoa's baseline check, redrawn from Evaluation 2.0: the baseline the
 * project claims against Pachama's estimate, in tCO2e, over the years its
 * verification reports cover (2013 to 2016, 2017 to 2020). Values traced
 * from the evaluation's chart, so they're close, not exact. Where the
 * claim runs above the estimate, the gap is shaded: credits the baseline
 * would over-issue. Lines draw as the chart comes into view. */
const YEARS = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
const CLAIMED = [0, 0.16, 0.32, 0.54, 0.84, 1.11, 1.38, 1.71];
const ESTIMATE = [0, 0.19, 0.37, 0.47, 0.51, 0.53, 0.54, 0.6];
const MAX = 2;
const W = 600;
const H = 300;

const x = (i: number) => (i / (YEARS.length - 1)) * W;
const y = (v: number) => H - (v / MAX) * H;
const line = (values: number[]) => values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");

// Where the claim crosses above the estimate, between 2015 and 2016.
const k = (ESTIMATE[2] - CLAIMED[2]) / (CLAIMED[3] - CLAIMED[2] - (ESTIMATE[3] - ESTIMATE[2]));
const cross = { x: x(2 + k), y: y(CLAIMED[2] + k * (CLAIMED[3] - CLAIMED[2])) };
const pts = (values: number[], from: number, to: number) => values.slice(from, to).map((v, i) => `${x(from + i).toFixed(1)} ${y(v).toFixed(1)}`);
const OVER = `M${cross.x} ${cross.y} L${[...pts(CLAIMED, 3, 8), ...pts(ESTIMATE, 3, 8).reverse()].join(" L")} Z`;
const UNDER = `M${[...pts(ESTIMATE, 0, 3), `${cross.x} ${cross.y}`, ...pts(CLAIMED, 0, 3).reverse()].join(" L")} Z`;

const fmt = (v: number) => `${v.toFixed(2)}M`;

export const BaselineChart = ({ className }: { className?: string }) => (
  <figure className={cn("text-bn-medium", className)}>
    <div className="grid grid-cols-[auto_1fr] gap-x-3">
      <div aria-hidden className="flex flex-col justify-between py-0.5 text-right font-mono text-[11px] leading-none">
        {["2M", "1.5M", "1M", "0.5M", "0"].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden className="block aspect-[2/1] w-full overflow-visible">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={0} x2={W} y1={H * f} y2={H * f} stroke="#e0e7e7" />
        ))}
        <line x1={0} x2={W} y1={H} y2={H} stroke="#c0c9c9" />
        <path data-reveal className="[--reveal-delay:1s]" d={UNDER} fill="#84e1ff" fillOpacity={0.35} />
        <path data-reveal className="[--reveal-delay:1.2s]" d={OVER} fill="#81f18e" fillOpacity={0.45} />
        <path data-reveal="draw" d={line(ESTIMATE)} pathLength={1} fill="none" stroke="#0aa6b8" strokeWidth={2.5} />
        <path data-reveal="draw" className="[--reveal-delay:0.2s]" d={line(CLAIMED)} pathLength={1} fill="none" stroke="#0e2517" strokeWidth={2.5} />
      </svg>
      <span />
      <div aria-hidden className="mt-2 flex justify-between font-mono text-[11px] leading-none">
        {YEARS.map((yr) => (
          <span key={yr} className={cn(yr === 2016 && "font-bold text-bn-heavy")}>
            {yr}
          </span>
        ))}
      </div>
    </div>
    <figcaption className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] leading-5 text-bn-heavy">
      <span className="flex items-center gap-2">
        <span aria-hidden className="h-0.5 w-5 bg-bn-heavy" />
        The baseline the project claims
      </span>
      <span className="flex items-center gap-2">
        <span aria-hidden className="h-0.5 w-5 bg-[#0aa6b8]" />
        Pachama&rsquo;s estimate
      </span>
      <span className="flex items-center gap-2">
        <span aria-hidden className="size-3 rounded-[3px] bg-bn-green/60" />
        The gap: credits a generous baseline would over-issue
      </span>
    </figcaption>
    <table className="sr-only">
      <caption>Manoa&rsquo;s claimed baseline and Pachama&rsquo;s estimate, in millions of tonnes of CO2e</caption>
      <thead>
        <tr>
          <th scope="col">Year</th>
          <th scope="col">Claimed</th>
          <th scope="col">Estimate</th>
        </tr>
      </thead>
      <tbody>
        {YEARS.map((yr, i) => (
          <tr key={yr}>
            <th scope="row">{yr}</th>
            <td>{fmt(CLAIMED[i])}</td>
            <td>{fmt(ESTIMATE[i])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </figure>
);
