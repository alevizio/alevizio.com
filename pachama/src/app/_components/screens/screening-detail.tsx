import cover from "@/assets/screens/dmrv-report-cover.jpg";
import Image from "next/image";
import { MdCheck, MdClose, MdOutlineTableChart } from "react-icons/md";
import { cn } from "../cn";
import { STAGES, type Submission } from "./screening-data";

/* One submission's evaluation, as Source's Evaluation Results tab shows
 * it: where it stands in the four stages, its screening (stage 1, the
 * verdict and the results spreadsheet) and, once it's through, its DMRV
 * core diligence report. */
export const BADGE = "inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] leading-4 font-bold whitespace-nowrap uppercase";
export const PASS = "bg-bn-green text-bn-heavy";
export const FAIL = "bg-bn-orange text-bn-heavy";

type Mark = "done" | "current" | "failed" | "todo";
const marks = (s: Submission): Mark[] =>
  [1, 2, 3, 4].map((stage) => {
    if (!s.priority) return stage === 1 ? "failed" : "todo";
    if (stage < s.reached || (stage === 2 && s.reached === 2)) return "done";
    return stage === s.reached ? "current" : "todo";
  });

const Step = ({ label, mark }: { label: string; mark: Mark }) => (
  <li className="flex items-center gap-2 text-[11px] leading-4 font-bold text-bn-heavy uppercase">
    <span
      aria-hidden
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full",
        mark === "done" && "bg-bn-green-light",
        mark === "failed" && "bg-bn-orange-lightest",
        mark === "current" && "ring-2 ring-bn-green-dark ring-inset",
        mark === "todo" && "ring-1 ring-bn-grey ring-inset",
      )}
    >
      {mark === "done" ? <MdCheck className="size-4" /> : null}
      {mark === "failed" ? <MdClose className="size-4" /> : null}
      {mark === "current" ? <span className="size-2 rounded-full bg-bn-green-dark" /> : null}
    </span>
    <span className={cn(mark === "todo" && "font-medium text-bn-medium")}>{label}</span>
    <span className="sr-only">
      {{ done: ", done", current: ", in progress", failed: ", didn't pass", todo: ", not started" }[mark]}
    </span>
  </li>
);

export const ScreeningDetail = ({ s, className }: { s: Submission; className?: string }) => {
  const through = Boolean(s.priority);
  const stageMarks = marks(s);
  return (
    <section data-reveal className={cn("grid gap-6 rounded-[16px] bg-bn-grey-lightest p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-10", className)}>
      <div className="min-w-0">
        {s.facts ? <p className="text-[12px] text-bn-medium">{s.facts}</p> : null}
        <h5 className="mt-1 font-display text-[30px] leading-none font-bold sm:text-[36px]">{s.name}</h5>
        <p className="mt-2 flex flex-wrap gap-x-3 text-[13px] text-bn-medium">
          <span>{s.type}</span>
          {s.code ? <span className="border-l border-bn-grey pl-3">{s.code}</span> : null}
          <span className="border-l border-bn-grey pl-3">Acme supplier</span>
        </p>
        <ol aria-label="Stages" className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          {STAGES.slice(1).map((label, i) => (
            <Step key={label} label={label} mark={stageMarks[i]} />
          ))}
        </ol>
        <div className="mt-6 grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)]">
          <div className="rounded-[12px] bg-white p-4 ring-1 ring-bn-grey-light">
            <p className="text-[12px] text-bn-medium">Screening, stage 1</p>
            <p className="mt-2">
              <span className={cn(BADGE, through ? PASS : FAIL)}>{through ? `Pass: priority ${s.priority}` : "Fail"}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-[12px] bg-white p-4 ring-1 ring-bn-grey-light">
            <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-bn-green-light">
              <MdOutlineTableChart className="size-5" />
            </span>
            <span className="min-w-0 text-[13px] leading-5">
              <span className="block font-bold">Screening results spreadsheet</span>
              <span className="text-bn-medium">CSV, every criterion it was checked against</span>
            </span>
          </div>
        </div>
        <p className="mt-4 text-[13px]">
          <span className="text-bn-medium">Status: </span>
          {s.status}
        </p>
      </div>

      {through ? (
        <div className="flex items-start gap-4 lg:flex-col">
          <Image src={cover} alt="The cover of the DMRV core diligence report, over a satellite view of a river delta" sizes="128px" className="w-24 rounded-[4px] shadow-[0_8px_24px_rgb(20_26_23/0.18)] ring-1 ring-black/5 lg:w-32" />
          <div className="text-[13px] leading-5">
            <p className="font-bold">DMRV core diligence</p>
            <p className="mt-1">
              <span className={cn(BADGE, PASS)}>
                <MdCheck aria-hidden className="size-3.5" /> No flags
              </span>
            </p>
            <p className="mt-2 text-bn-medium">The full report, 17 pages, beside the results summary.</p>
          </div>
        </div>
      ) : (
        <p className="self-center text-[13px] leading-5 text-bn-medium">It stops at screening: diligence is only run on what passes.</p>
      )}
    </section>
  );
};
