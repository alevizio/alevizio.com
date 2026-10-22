"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "../cn";
import { UI } from "./ui";

const INPUT = cn(
  "h-10 w-full rounded-[8px] border border-[#cfd5d2] bg-white px-3 text-[15px] text-[#141a17] placeholder:text-[#8a958f]",
  "focus:border-[#13adb1] focus:outline-none focus:ring-3 focus:ring-[#13adb1]/20",
);

const Field = ({ label, hint, children }: { label: string; hint?: string; children: (id: string) => React.ReactNode }) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-[#141a17]">
        {label}
      </label>
      {children(id)}
      {hint ? <p className="mt-1.5 text-[12px] text-[#5f6b66]">{hint}</p> : null}
    </div>
  );
};

/** Text, search and select, then the three ways to choose: try them. */
export const FieldSet = () => {
  const [tons, setTons] = useState("1250");
  const [standards, setStandards] = useState({ accurate: true, additional: true, beyond: false });
  const [vintage, setVintage] = useState("2021");
  const [alerts, setAlerts] = useState(true);

  return (
    <div className={cn(UI.card, "grid gap-8 p-6 sm:grid-cols-2 sm:p-8")}>
      <div className="grid content-start gap-5">
        <Field label="Credits to buy" hint="In tonnes of CO₂e.">
          {(id) => <input id={id} inputMode="numeric" value={tons} onChange={(e) => setTons(e.target.value.replace(/\D/g, ""))} className={INPUT} />}
        </Field>
        <Field label="Search projects">
          {(id) => (
            <div className="relative">
              <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8a958f]" />
              <input id={id} type="search" placeholder="Manoa, Brazil…" className={cn(INPUT, "pl-9")} />
            </div>
          )}
        </Field>
        <Field label="Project type">
          {(id) => (
            <div className="relative">
              <select id={id} defaultValue="arr" className={cn(INPUT, "appearance-none pr-9")}>
                <option value="redd">REDD+ avoided deforestation</option>
                <option value="arr">Reforestation (ARR)</option>
                <option value="ifm">Improved forest management</option>
              </select>
              <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#5f6b66]" />
            </div>
          )}
        </Field>
      </div>

      <div className="grid content-start gap-6">
        <fieldset>
          <legend className="mb-2 text-[13px] font-medium text-[#141a17]">Standards</legend>
          {(
            [
              ["accurate", "Accurate"],
              ["additional", "Additional"],
              ["beyond", "Beyond carbon"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center gap-2.5 py-1 text-[15px] text-[#141a17]">
              <input
                type="checkbox"
                checked={standards[key]}
                onChange={(e) => setStandards((s) => ({ ...s, [key]: e.target.checked }))}
                className="peer sr-only"
              />
              <span className="grid size-5 place-items-center rounded-[5px] border border-[#cfd5d2] bg-white peer-checked:border-[#23854a] peer-checked:bg-[#23854a] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#13adb1]">
                <Check aria-hidden className="size-3.5 text-white" strokeWidth={3} />
              </span>
              {label}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-[13px] font-medium text-[#141a17]">Vintage</legend>
          <div className="flex gap-2">
            {["2020", "2021", "2022"].map((year) => (
              <label key={year} className="cursor-pointer">
                <input type="radio" name="vintage" value={year} checked={vintage === year} onChange={() => setVintage(year)} className="peer sr-only" />
                <span className="inline-block rounded-full border border-[#cfd5d2] px-3.5 py-1.5 text-[14px] text-[#141a17] peer-checked:border-[#141a17] peer-checked:bg-[#141a17] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#13adb1]">
                  {year}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          role="switch"
          aria-checked={alerts}
          onClick={() => setAlerts((a) => !a)}
          className={cn("flex items-center gap-3 text-left text-[15px] text-[#141a17]", UI.focus)}
        >
          <span className={cn("relative h-6 w-10 rounded-full transition-colors", alerts ? "bg-[#23854a]" : "bg-[#cfd5d2]")}>
            <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-[left]", alerts ? "left-[18px]" : "left-0.5")} />
          </span>
          Alert me when a project changes
        </button>
      </div>
    </div>
  );
};
