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
 * samples. While the page plays itself, `fill` (0 to 1) is how far the
 * part has been filled in: answers type in one after another; left alone
 * (no fill), they're the sample answers, to change. */
const num = (n: number) => n.toLocaleString("en-US");
// Whatever is typed in a figure's cell, as a whole number.
const parse = (v: string) => Math.max(0, Number(v.replace(/\D/g, "")) || 0);

/** Field i of n, filled in its turn: how far along it is, 0 to 1. */
const turn = (fill: number, i: number, n: number) => Math.min(1, Math.max(0, (fill * (n + 0.5) - i) / 0.8));
/** A text answer, typed up to that point. */
const typed = (text: string, f: number) => text.slice(0, Math.ceil(text.length * f));

type Part = { fill?: number };

export const Questionnaire = ({ fill }: Part) => {
  const [start, setStart] = useState<string | undefined>("2026");
  const [species, setSpecies] = useState("32");
  const [native, setNative] = useState<string | undefined>("95");
  const [share, setShare] = useState("12%");
  const [fpic, setFpic] = useState("No");
  const f = (i: number) => (fill === undefined ? 1 : turn(fill, i, 5));
  return (
    <div className="grid max-w-[40rem] gap-5">
      <h5 className="font-display text-[28px] leading-none font-bold">Form submission</h5>
      <Select
        label="When will planting start?"
        value={f(0) > 0.5 ? start : undefined}
        onChange={setStart}
        options={["2026", "2027", "2028"].map((y) => ({ value: y, label: y }))}
      />
      <TextInput label="How many native species will you plant?" value={typed(species, f(1))} onChange={(e) => setSpecies(e.target.value)} inputMode="numeric" />
      <Select
        label="What share of the planting is native species?"
        value={f(2) > 0.5 ? native : undefined}
        onChange={setNative}
        options={[
          { value: "95", label: "95% or more" },
          { value: "80", label: "80 to 95%" },
          { value: "0", label: "Under 80%" },
        ]}
      />
      <TextInput label="What share of carbon revenue goes to landowners?" value={typed(share, f(3))} onChange={(e) => setShare(e.target.value)} />
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-[16px] leading-6 font-medium text-bn-heavy">Does the project need free, prior and informed consent (FPIC)?</legend>
        <div className="flex gap-6">
          {["No", "Yes"].map((v) => (
            <Radio key={v} name="submission-fpic" label={v} checked={f(4) > 0.5 && fpic === v} onChange={() => setFpic(v)} />
          ))}
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

export const Proposal = ({ fill }: Part) => {
  const [units, setUnits] = useState(START.units);
  const [price, setPrice] = useState(START.price);
  const [total, setTotal] = useState(START.total);
  const set = (list: number[], update: (l: number[]) => void, i: number, v: string) => update(list.map((x, j) => (j === i ? parse(v) : x)));
  // Filling in, a row at a time from the top; rows not reached yet stand at 0.
  const rows = fill === undefined ? YEARS.length : Math.floor(fill * (YEARS.length + 1));
  const shownUnits = units.map((u, i) => (i < rows ? u : 0));
  const shownTotal = total.map((u, i) => (i < rows ? u : 0));
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
              <tr key={y} className={cn("border-t border-bn-grey-light transition-colors duration-300", fill !== undefined && i === rows - 1 && "bg-bn-green-lightest/60")}>
                <th scope="row" className={cn(CELL, "font-bold")}>{y}</th>
                <td className={CELL}>
                  <input aria-label={`${y} offtake units`} inputMode="numeric" value={num(shownUnits[i])} onChange={(e) => set(units, setUnits, i, e.target.value)} className={INPUT} />
                </td>
                <td className={CELL}>
                  {i === 0 ? (
                    <input aria-label="Price per unit, every year" inputMode="numeric" value={`$${price}`} onChange={(e) => setPrice(parse(e.target.value))} className={INPUT} />
                  ) : (
                    <span className="px-2 text-bn-medium">${price}</span>
                  )}
                </td>
                <td className={CELL}>
                  <input aria-label={`${y} project's total units`} inputMode="numeric" value={num(shownTotal[i])} onChange={(e) => set(total, setTotal, i, e.target.value)} className={INPUT} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-bn-grey-light bg-bn-grey-lightest font-bold">
            <tr>
              <th scope="row" className={CELL}>10 years</th>
              <td className={CELL}>
                <span className="px-2">{num(sum(shownUnits))}</span>
              </td>
              <td className={CELL}>
                <span className="px-2">${num(sum(shownUnits) * price)}</span>
              </td>
              <td className={CELL}>
                <span className="px-2">{num(sum(shownTotal))}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export const ProjectInfo = ({ fill }: Part) => {
  const [developer, setDeveloper] = useState("Acme supplier");
  const [registry, setRegistry] = useState<string | undefined>("verra");
  const [method, setMethod] = useState("VM0047, afforestation, reforestation and revegetation");
  const f = (i: number) => (fill === undefined ? 1 : turn(fill, i, 3));
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
      <TextInput label="Project developer" value={typed(developer, f(0))} onChange={(e) => setDeveloper(e.target.value)} />
      <Select
        label="Registry"
        value={f(1) > 0.5 ? registry : undefined}
        onChange={setRegistry}
        options={[
          { value: "verra", label: "Verra" },
          { value: "gold", label: "Gold Standard" },
          { value: "acr", label: "American Carbon Registry" },
        ]}
      />
      <TextInput label="Methodology" value={typed(method, f(2))} onChange={(e) => setMethod(e.target.value)} />
    </div>
  );
};
