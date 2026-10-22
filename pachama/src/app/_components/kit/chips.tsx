import { Check, CircleCheck, Info } from "lucide-react";
import { cn } from "../cn";
import { UI } from "./ui";

/* The evaluation's vocabulary: the five standards as one strip of chips,
 * the verdict badges, and the tags a project carries. */
const STANDARDS = ["Accurate", "Additional", "Durable", "Net", "Beyond Carbon"];
const TAGS = ["REDD+", "Reforestation", "Verified Carbon Standard", "Brazil"];

export const QualityChips = () => (
  <div className="flex flex-wrap items-center gap-2">
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[20px] bg-[#eef1ef] px-4 py-2">
      {STANDARDS.map((s) => (
        <span key={s} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#141a17]">
          <CircleCheck aria-hidden className="size-4 fill-[#23854a] text-white" />
          {s}
        </span>
      ))}
    </div>
    <Info aria-hidden className="size-5 text-[#8a958f]" />
  </div>
);

export const Badges = () => (
  <div className="flex flex-wrap items-center gap-3">
    <span className="inline-flex items-center gap-1 rounded-full bg-[#23854a] px-3 py-1 text-[13px] font-semibold text-white">
      <Check aria-hidden className="size-3.5" strokeWidth={3} /> PASS
    </span>
    <span className="inline-flex items-center rounded-full bg-[#c93c3c] px-3 py-1 text-[13px] font-semibold text-white">FAIL</span>
    <span className="inline-flex items-center rounded-full border border-[#141a17] px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.1em] text-[#141a17]">
      BETA
    </span>
    {TAGS.map((t) => (
      <span key={t} className="inline-flex items-center rounded-[6px] bg-[#eef1ef] px-2.5 py-1 text-[13px] text-[#3c4742]">
        {t}
      </span>
    ))}
  </div>
);

export const ChipSet = () => (
  <div className={cn(UI.card, "grid gap-8 p-6 sm:p-8")}>
    <div>
      <p className={cn(UI.label, "mb-3")}>The five standards</p>
      <QualityChips />
    </div>
    <div>
      <p className={cn(UI.label, "mb-3")}>Verdicts and tags</p>
      <Badges />
    </div>
  </div>
);
