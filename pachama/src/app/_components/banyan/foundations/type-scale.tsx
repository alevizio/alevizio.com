"use client";

import { useId, useState } from "react";
import { cn } from "../../cn";
import { BN } from "../ui";

/* Banyan's type scale, set live: Chromatic Pro Condensed for the primary
 * voice, Matter for the secondary, each in its weights. Sizes and line
 * heights are the Figma text styles; on a phone the biggest steps shrink to
 * fit. */
type Step = { name: string; spec: string; className: string; sample?: string };

const HEADINGS: Step[] = [
  { name: "h1", spec: "72 / 80", className: "text-[clamp(40px,11vw,72px)] leading-[1.11]" },
  { name: "h2", spec: "64 / 72", className: "text-[clamp(36px,10vw,64px)] leading-[1.125]" },
  { name: "h3", spec: "52 / 60", className: "text-[clamp(32px,9vw,52px)] leading-[1.15]" },
  { name: "h4", spec: "44 / 52", className: "text-[clamp(30px,8vw,44px)] leading-[1.18]" },
  { name: "h5", spec: "36 / 44", className: "text-[clamp(28px,7vw,36px)] leading-[1.22]" },
  { name: "h6", spec: "32 / 36", className: "text-[clamp(26px,6.4vw,32px)] leading-[1.125]" },
  { name: "subtitle1", spec: "24 / 32", className: "text-[24px] leading-[1.33]", sample: "Subtitle 1" },
];

const SCALES: Record<"Chromatic" | "Matter", Step[]> = {
  Chromatic: [...HEADINGS, { name: "subtitle2", spec: "20 / 24", className: "text-[20px] leading-[1.2]", sample: "Subtitle 2" }],
  Matter: [
    ...HEADINGS,
    { name: "subtitle2", spec: "20 / 28", className: "text-[20px] leading-[1.4]", sample: "Subtitle 2" },
    { name: "overline", spec: "18 / 20", className: "text-[18px] leading-[1.11] tracking-[0.4px] uppercase", sample: "Overline" },
    { name: "body1", spec: "16 / 24", className: "text-[16px] leading-[1.5]", sample: "Body 1: every project on the marketplace meets the same five standards." },
    { name: "body2", spec: "14 / 20", className: "text-[14px] leading-[1.43]", sample: "Body 2: credits are issued for carbon a project removes or keeps out of the air." },
    { name: "caption", spec: "12 / 16", className: "text-[12px] leading-[1.33]", sample: "Caption: last updated 24 February 2024" },
  ],
};
type Family = keyof typeof SCALES;

// Chromatic ships here in medium and bold only, so it has no regular.
const WEIGHTS: Record<Family, { label: string; className: string }[]> = {
  Chromatic: [
    { label: "Heavy", className: "font-bold" },
    { label: "Medium", className: "font-medium" },
  ],
  Matter: [
    { label: "Heavy", className: "font-bold" },
    { label: "Medium", className: "font-medium" },
    { label: "Regular", className: "font-normal" },
  ],
};

/** A pill-shaped radio group, Banyan's segmented control. */
const Segmented = ({ legend, options, value, onChange }: { legend: string; options: string[]; value: string; onChange: (v: string) => void }) => {
  const name = useId();
  return (
    <fieldset className="flex flex-wrap items-center gap-3">
      <legend className={cn(BN.label, "sr-only")}>{legend}</legend>
      <div className="inline-flex rounded-full border border-bn-medium p-1">
        {options.map((o) => (
          <label key={o} className="cursor-pointer">
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="peer sr-only" />
            <span className="block rounded-full px-4 py-1.5 font-mono text-[14px] leading-[18px] font-medium text-bn-heavy uppercase peer-checked:bg-bn-heavy peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bn-heavy">
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

export const TypeScale = ({ className }: { className?: string }) => {
  const [family, setFamily] = useState<Family>("Chromatic");
  const [weight, setWeight] = useState("Heavy");
  const weights = WEIGHTS[family];
  const weightClass = (weights.find((w) => w.label === weight) ?? weights[0]).className;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-wrap gap-4">
        <Segmented legend="Typeface" options={["Chromatic", "Matter"]} value={family} onChange={(v) => setFamily(v === "Matter" ? "Matter" : "Chromatic")} />
        <Segmented legend="Weight" options={weights.map((w) => w.label)} value={weights.some((w) => w.label === weight) ? weight : "Heavy"} onChange={setWeight} />
      </div>
      <ol className="mt-8 divide-y divide-bn-grey-light">
        {SCALES[family].map((s) => (
          <li key={s.name} className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 py-4 sm:grid-cols-[7rem_1fr_5rem]">
            <span className="font-mono text-[13px] text-bn-medium">{s.name}</span>
            <span className={cn("min-w-0 text-bn-heavy", family === "Chromatic" ? "font-display" : "font-sans", weightClass, s.className)}>
              {s.sample ?? `${s.name}. Heading`}
            </span>
            <span className="col-start-2 font-mono text-[13px] text-bn-medium sm:col-start-3 sm:text-right">{s.spec}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};
