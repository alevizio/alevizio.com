import { BN } from "../banyan/ui";
import { cn } from "../cn";

/* Source's flow, from the Source Generalization Figma's two flows: the
 * buyer sets an event up and shares one link, the developer submits
 * through it, and the buyer's screening and diligence take it from there.
 * Drawn like a flowchart that snakes across three lanes; it draws itself
 * as it's reached, and a dot runs the length of it. Land suitability, the
 * step the tool below is, links to it. Below lg it's a list, top to bottom. */
type Step = { label: string[]; land?: boolean };
const LANES: { name: string; steps: Step[] }[] = [
  {
    name: "Buyer, sets up",
    steps: [{ label: ["Request", "an event"] }, { label: ["Set the", "criteria"] }, { label: ["Write the", "questionnaire"] }, { label: ["Share", "one link"] }],
  },
  {
    name: "Developer, submits",
    steps: [
      { label: ["Open the", "event page"] },
      { label: ["Log in"] },
      { label: ["Pick or add", "a project"] },
      { label: ["Answer the", "questionnaire"] },
      { label: ["Commercial", "proposal"] },
      { label: ["Land", "suitability"], land: true },
      { label: ["Submit"] },
    ],
  },
  {
    name: "Buyer, reviews",
    steps: [{ label: ["Screening"] }, { label: ["DMRV core", "diligence"] }, { label: ["Preliminary", "diligence"] }, { label: ["Full", "diligence"] }],
  },
];

// The chart's grid: seven columns, three rows. The first lane fills the
// right four columns, the second runs back right to left, the third
// starts again at the left.
const NODE = { w: 160, h: 72 };
const GAP = (1296 - 7 * NODE.w) / 6;
const ROW = [36, 204, 372];
const col = (i: number) => i * (NODE.w + GAP);
const COLS = [[3, 4, 5, 6], [6, 5, 4, 3, 2, 1, 0], [0, 1, 2, 3]];
const mid = (r: number) => ROW[r] + NODE.h / 2;
const cx = (c: number) => col(c) + NODE.w / 2;
const PATH = `M${cx(3)} ${mid(0)}H${cx(6)}V${mid(1)}H${cx(0)}V${mid(2)}H${cx(3)}`;
// Where each step's arrow lands, and which way it points.
const arrows = COLS.flatMap((cols, r) =>
  cols.map((c, k) => {
    if (r === 0 && k === 0) return null;
    if (k === 0) return { x: cx(c), y: ROW[r], dir: "down" as const };
    return r === 1 ? { x: col(c) + NODE.w, y: mid(r), dir: "left" as const } : { x: col(c), y: mid(r), dir: "right" as const };
  }),
);
const ARROW = { right: "M-9 -5L0 0L-9 5Z", left: "M9 -5L0 0L9 5Z", down: "M-5 -9L0 0L5 -9Z" };
// Steps are numbered through the lanes: each lane's first, and two digits.
const FIRST = LANES.map((_, r) => LANES.slice(0, r).reduce((sum, lane) => sum + lane.steps.length, 1));
const two = (n: number) => String(n).padStart(2, "0");
// Each step after the last, a beat apart (literal, for Tailwind).
const DELAYS = [
  "[--reveal-delay:0s]",
  "[--reveal-delay:0.12s]",
  "[--reveal-delay:0.24s]",
  "[--reveal-delay:0.36s]",
  "[--reveal-delay:0.48s]",
  "[--reveal-delay:0.6s]",
  "[--reveal-delay:0.72s]",
  "[--reveal-delay:0.84s]",
  "[--reveal-delay:0.96s]",
  "[--reveal-delay:1.08s]",
  "[--reveal-delay:1.2s]",
  "[--reveal-delay:1.32s]",
  "[--reveal-delay:1.44s]",
  "[--reveal-delay:1.56s]",
  "[--reveal-delay:1.68s]",
];

const Node = ({ step, x, y, n }: { step: Step; x: number; y: number; n: number }) => {
  const box = (
    <>
      <rect x={x} y={y} width={NODE.w} height={NODE.h} rx={14} className={step.land ? "fill-bn-green" : "fill-white"} stroke={step.land ? "#0e2517" : "#d6ddd9"} strokeWidth={step.land ? 1.5 : 1} />
      <text x={x + 16} y={y + 22} className="fill-bn-medium font-mono text-[11px]">
        {two(n)}
      </text>
      <text x={x + 16} y={y + (step.label.length > 1 ? 44 : 52)} className={cn("fill-bn-heavy text-[15px]", step.land && "font-bold")}>
        {step.label.map((line, i) => (
          <tspan key={line} x={x + 16} dy={i ? 18 : 0}>
            {line}
          </tspan>
        ))}
      </text>
    </>
  );
  return (
    <g data-reveal className={DELAYS[n - 1]}>
      {step.land ? (
        <a href="#land-suitability" aria-label="Land suitability: the tool, below" className={BN.focus}>
          {box}
        </a>
      ) : (
        box
      )}
    </g>
  );
};

export const SourceFlow = ({ className }: { className?: string }) => (
  <figure className={className}>
    <figcaption className="sr-only">Source&rsquo;s flow, in three lanes</figcaption>
    {/* From lg: the chart. */}
    <svg viewBox="0 0 1296 452" className="block w-full overflow-visible max-lg:hidden">
      <path data-reveal="draw" d={PATH} pathLength={1} fill="none" stroke="#0e2517" strokeOpacity={0.35} strokeWidth={1.5} aria-hidden />
      {arrows.map((a, i) =>
        a ? <path key={i} d={ARROW[a.dir]} transform={`translate(${a.x} ${a.y})`} fill="#0e2517" fillOpacity={0.5} data-reveal className={DELAYS[i]} aria-hidden /> : null,
      )}
      <circle r={5} fill="#68ce75" className="motion-reduce:hidden" aria-hidden>
        <animateMotion dur="9s" begin="2s" repeatCount="indefinite" path={PATH} />
      </circle>
      {LANES.map((lane, r) => (
        <g key={lane.name}>
          {/* Each lane's name where it starts, clear of the line coming down into it. */}
          <text x={[col(3), cx(6) - 14, cx(0) + 14][r]} y={ROW[r] - 14} textAnchor={r === 1 ? "end" : "start"} className="fill-bn-medium font-mono text-[11px] tracking-[0.08em] uppercase">
            {lane.name}
          </text>
          {lane.steps.map((step, k) => (
            <Node key={step.label.join(" ")} step={step} x={col(COLS[r][k])} y={ROW[r]} n={FIRST[r] + k} />
          ))}
        </g>
      ))}
    </svg>
    {/* Below lg: the same steps, top to bottom. */}
    <ol className="grid gap-8 lg:hidden">
      {LANES.map((lane, r) => (
        <li key={lane.name}>
          <p className="font-mono text-[11px] tracking-[0.08em] text-bn-medium uppercase">{lane.name}</p>
          <ol data-stagger className="mt-3 grid gap-2 border-l border-bn-heavy/25 pl-4">
            {lane.steps.map((step, k) => {
              const inner = (
                <>
                  <span className="font-mono text-[11px] font-normal text-bn-medium">{two(FIRST[r] + k)}</span>
                  {step.label.join(" ")}
                </>
              );
              return (
                <li key={step.label.join(" ")} data-reveal>
                  {step.land ? (
                    <a href="#land-suitability" className={cn("flex items-baseline gap-3 rounded-[12px] bg-bn-green px-4 py-3 text-[15px] font-bold text-bn-heavy ring-1 ring-bn-heavy", BN.focus)}>
                      {inner}
                      <span className="ml-auto text-[12px] font-normal">The tool, below</span>
                    </a>
                  ) : (
                    <span className="flex items-baseline gap-3 rounded-[12px] bg-white px-4 py-3 text-[15px] text-bn-heavy ring-1 ring-[#d6ddd9]">{inner}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </li>
      ))}
    </ol>
  </figure>
);
