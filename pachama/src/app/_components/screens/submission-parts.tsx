"use client";

import { useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { Radio } from "../banyan/forms/choice";
import { TextInput } from "../banyan/forms/input";
import { Select } from "../banyan/forms/select";
import { BN } from "../banyan/ui";
import { cn } from "../cn";

/* The parts of a Source submission besides the land, rebuilt from the
 * Source Figma's Questionnaire, Commercial proposals and Project Info tabs.
 * The design's questions are placeholders ("Question 1"), so these ask
 * what Pachama's quality standard asks of a reforestation project (from
 * the Originals deck): when planting starts, how native it is, what
 * landowners get, whether consent is needed. Answers and figures are
 * samples. */
const num = (n: number) => n.toLocaleString("en-US");
// Whatever is typed in a figure's cell, as a whole number.
const parse = (v: string) => Math.max(0, Number(v.replace(/\D/g, "")) || 0);

export const Questionnaire = () => {
  const [start, setStart] = useState<string | undefined>("2026");
  const [native, setNative] = useState<string | undefined>("95");
  return (
    <div className="grid max-w-[40rem] gap-5">
      <h5 className="font-display text-[28px] leading-none font-bold">Form submission</h5>
      <Select label="When will planting start?" value={start} onChange={setStart} options={["2026", "2027", "2028"].map((y) => ({ value: y, label: y }))} />
      <TextInput label="How many native species will you plant?" defaultValue="32" inputMode="numeric" />
      <Select
        label="What share of the planting is native species?"
        value={native}
        onChange={setNative}
        options={[
          { value: "95", label: "95% or more" },
          { value: "80", label: "80 to 95%" },
          { value: "0", label: "Under 80%" },
        ]}
      />
      <TextInput label="What share of carbon revenue goes to landowners?" defaultValue="12%" />
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-[16px] leading-6 font-medium text-bn-heavy">Does the project need free, prior and informed consent (FPIC)?</legend>
        <div className="flex gap-6">
          <Radio name="submission-fpic" label="No" defaultChecked />
          <Radio name="submission-fpic" label="Yes" />
        </div>
      </fieldset>
    </div>
  );
};

// A pay-on-delivery offtake, year by year: credits start once trees grow.
const YEARS = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];
const START = { units: [0, 0, 0, 1200, 2400, 3600, 4800, 6000, 6000, 6000], price: 42, total: [0, 0, 0, 2000, 4000, 6000, 8000, 10000, 10000, 10000] };
const CELL = "px-3 py-2.5 sm:px-4";
const INPUT = cn("w-full min-w-[5rem] rounded-[8px] bg-transparent px-2 py-1 text-[14px] ring-1 ring-transparent hover:ring-bn-grey-light focus:bg-white focus:ring-bn-grey-dark", BN.focus);

export const Proposal = () => {
  const [units, setUnits] = useState(START.units);
  const [price, setPrice] = useState(START.price);
  const [total, setTotal] = useState(START.total);
  const set = (list: number[], update: (l: number[]) => void, i: number, v: string) => update(list.map((x, j) => (j === i ? parse(v) : x)));
  const sum = (l: number[]) => l.reduce((a, b) => a + b, 0);
  return (
    <div className="grid gap-4">
      <h5 className="font-display text-[28px] leading-none font-bold">Commercial proposals</h5>
      <p className="text-[14px] leading-5 text-bn-medium">Please fill out the following table with the details of your pay-on-delivery offtake proposal.</p>
      <div className="no-scrollbar overflow-x-auto rounded-[14px] ring-1 ring-bn-grey-light">
        <table className="w-full min-w-[36rem] text-left text-[14px]">
          <thead className="bg-bn-grey-lightest text-[13px] text-bn-medium">
            <tr>
              <th scope="col" className={cn(CELL, "font-medium")}>Year</th>
              <th scope="col" className={cn(CELL, "font-medium")}>Offtake carbon removal units</th>
              <th scope="col" className={cn(CELL, "font-medium")}>Price per unit (USD)</th>
              <th scope="col" className={cn(CELL, "font-medium")}>Project&rsquo;s total units</th>
            </tr>
          </thead>
          <tbody>
            {YEARS.map((y, i) => (
              <tr key={y} className="border-t border-bn-grey-light">
                <th scope="row" className={cn(CELL, "font-bold")}>{y}</th>
                <td className={CELL}>
                  <input aria-label={`${y} offtake units`} inputMode="numeric" value={num(units[i])} onChange={(e) => set(units, setUnits, i, e.target.value)} className={INPUT} />
                </td>
                <td className={CELL}>
                  {i === 0 ? (
                    <input aria-label="Price per unit, every year" inputMode="numeric" value={`$${price}`} onChange={(e) => setPrice(parse(e.target.value))} className={INPUT} />
                  ) : (
                    <span className="px-2 text-bn-medium">${price}</span>
                  )}
                </td>
                <td className={CELL}>
                  <input aria-label={`${y} project's total units`} inputMode="numeric" value={num(total[i])} onChange={(e) => set(total, setTotal, i, e.target.value)} className={INPUT} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-bn-grey-light bg-bn-grey-lightest font-bold">
            <tr>
              <th scope="row" className={CELL}>10 years</th>
              <td className={CELL}>
                <span className="px-2">{num(sum(units))}</span>
              </td>
              <td className={CELL}>
                <span className="px-2">${num(sum(units) * price)}</span>
              </td>
              <td className={CELL}>
                <span className="px-2">{num(sum(total))}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export const ProjectInfo = () => {
  const [registry, setRegistry] = useState<string | undefined>("verra");
  return (
    <div className="grid max-w-[40rem] gap-5">
      <h5 className="font-display text-[28px] leading-none font-bold">Project information</h5>
      <p className="flex gap-3 rounded-[12px] border-l-4 border-bn-green bg-bn-grey-lightest p-4 text-[13px] leading-5">
        <MdCheckCircle aria-hidden className="size-5 shrink-0 text-bn-green-dark" />
        <span>
          <span className="block font-bold">Shared across your submissions</span>
          What you fill in here goes with this project to every sourcing event it&rsquo;s submitted to.
        </span>
      </p>
      <TextInput label="Project developer" defaultValue="Acme supplier" />
      <Select
        label="Registry"
        value={registry}
        onChange={setRegistry}
        options={[
          { value: "verra", label: "Verra" },
          { value: "gold", label: "Gold Standard" },
          { value: "acr", label: "American Carbon Registry" },
        ]}
      />
      <TextInput label="Methodology" defaultValue="VM0047, afforestation, reforestation and revegetation" />
    </div>
  );
};
