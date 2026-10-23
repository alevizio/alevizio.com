"use client";

import { useState, type ReactNode } from "react";
import { MdAdd, MdArrowForward, MdCheckCircle, MdMoreVert } from "react-icons/md";
import { Button } from "../banyan/button";
import { Tag } from "../banyan/data-display/tag";
import { Radio } from "../banyan/forms/choice";
import { TextInput } from "../banyan/forms/input";
import { BN } from "../banyan/ui";
import { MARKS } from "../brand-marks";
import { cn } from "../cn";

/* The two dialogs the portfolio work turned on, rebuilt live from their
 * Figma and shown on their own: a buyer's carbon sourcing plan (what to
 * look for, and where) and a supplier's proposal answering it (a project
 * and its opportunities). Chips come off and go back, the opportunities
 * table takes new rows, and both submit. The values are the designs'
 * samples. */
const CARD = "rounded-[24px] bg-white p-5 text-bn-heavy shadow-[0_2px_6px_rgb(20_26_23/0.06),0_24px_70px_rgb(20_26_23/0.14)] ring-1 ring-black/5 sm:p-7";
const SECTION = "rounded-[16px] p-4 ring-1 ring-[#e6e8e4] sm:p-5";

const CRITERIA: { title: string; items: string[] }[] = [
  {
    title: "Project types",
    items: ["Household and community, biodigesters", "Tech solutions, biochar", "Industrial manufacturing", "Forestry and land use, REDD+", "Waste management, other", "Forestry and land use, afforestation and reforestation"],
  },
  { title: "Methodologies", items: ["ACM0001", "AMS-II.D.", "VMR0003"] },
  { title: "Registries", items: ["Verra", "Gold Standard", "Climate Action Reserve"] },
  {
    title: "Regions",
    items: ["🇨🇦 Canada", "🇺🇸 USA", "🇲🇽 Mexico", "🇧🇷 Brazil", "🇦🇷 Argentina", "🇵🇾 Paraguay", "🇸🇬 Singapore", "🇰🇪 Kenya", "🇮🇳 India", "🇲🇼 Malawi", "🇨🇩 Democratic Republic of the Congo"],
  },
  {
    title: "Third-party verifications",
    items: ["Pachama Verified", "Pachama Originals", "Science Based Targets initiative", "ABACUS", "Symbiosis", "CCB Gold", "CCB Triple Gold", "CDM", "Sylvera AAA", "Sylvera BBB", "Sylvera BB", "Sylvera B", "BeZero AAA"],
  },
];
const SCOPES = ["Existing carbon projects", "New carbon projects", "Both"];

/** A criterion's chips: take one off, and the plus puts the last one back. */
const Criterion = ({ title, items }: { title: string; items: string[] }) => {
  const [kept, setKept] = useState(items);
  const removed = items.filter((i) => !kept.includes(i));
  return (
    <section className={SECTION}>
      <div className="flex items-center justify-between gap-4">
        <h5 className="text-[18px] leading-6 font-bold">{title}</h5>
        <button
          type="button"
          aria-label={removed.length ? `Add ${removed[removed.length - 1]} back to ${title.toLowerCase()}` : `Nothing to add to ${title.toLowerCase()}`}
          disabled={!removed.length}
          onClick={() => setKept(items.filter((i) => kept.includes(i) || i === removed[removed.length - 1]))}
          className={cn("grid size-7 place-items-center rounded-full bg-bn-heavy text-white transition-opacity disabled:opacity-30", BN.focus)}
        >
          <MdAdd aria-hidden className="size-5" />
        </button>
      </div>
      <ul aria-label={title} className="mt-3 flex flex-wrap gap-2">
        {kept.map((item) => (
          <li key={item} className="motion-safe:animate-[arrive_0.35s_var(--ease-arrive)_both]">
            <Tag label={item} size="sm" onDismiss={() => setKept((k) => k.filter((x) => x !== item))} />
          </li>
        ))}
        {!kept.length ? <li className="text-[13px] text-bn-medium">Any</li> : null}
      </ul>
    </section>
  );
};

const Done = ({ children, onBack }: { children: ReactNode; onBack: () => void }) => (
  <div role="status" className="grid min-h-[24rem] place-items-center content-center gap-4 text-center motion-safe:animate-[arrive_0.45s_var(--ease-arrive)_both]">
    <MdCheckCircle aria-hidden className="size-14 text-bn-green" />
    <p className="font-display text-[30px] leading-none font-bold">{children}</p>
    <Button hierarchy="tertiary" size="sm" onClick={onBack}>
      Back to it
    </Button>
  </div>
);

export const SourcingPlanModal = ({ className }: { className?: string }) => {
  const [scope, setScope] = useState(SCOPES[0]);
  const [made, setMade] = useState(false);
  return (
    <div role="dialog" aria-label="Create carbon sourcing plan" className={cn(CARD, className)}>
      {made ? (
        <Done onBack={() => setMade(false)}>Sourcing plan created</Done>
      ) : (
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setMade(true);
          }}
        >
          <h4 className="font-display text-[32px] leading-none font-bold">Create carbon sourcing plan</h4>
          <TextInput label="Carbon sourcing plan name" defaultValue="Nature based carbon procurement plan 2024 to 2030" />
          <fieldset className="grid grid-cols-3 overflow-hidden rounded-[14px] ring-1 ring-bn-heavy">
            <legend className="sr-only">Which projects</legend>
            {SCOPES.map((s) => (
              <Radio
                key={s}
                name="sourcing-scope"
                label={s}
                checked={scope === s}
                onChange={() => setScope(s)}
                className={cn("justify-center border-bn-heavy px-3 py-4 text-center text-[13px] not-last:border-r", scope === s && "bg-[#e9edea]")}
              />
            ))}
          </fieldset>
          {CRITERIA.map((c) => (
            <Criterion key={c.title} title={c.title} items={c.items} />
          ))}
          <Button type="submit" className="w-full" icon={<MdCheckCircle aria-hidden className="size-5" />} iconPosition="trailing">
            Create carbon sourcing plan
          </Button>
        </form>
      )}
    </div>
  );
};

type Opportunity = { min: number; quantity: number; vintage: number; price: number };
const START: Opportunity[] = [
  { min: 0, quantity: 1261, vintage: 2011, price: 23 },
  { min: 1261, quantity: 10261, vintage: 2011, price: 20 },
  { min: 1261, quantity: 10261, vintage: 2012, price: 20 },
];
const VINTAGES = [2011, 2012, 2013, 2014, 2015];
const num = (v: number) => v.toLocaleString("en-US");
const { viewBox, symbol } = MARKS.symbol;

export const ProposalModal = ({ className }: { className?: string }) => {
  const [rows, setRows] = useState(START);
  const [draft, setDraft] = useState({ quantity: "", vintage: "", price: "" });
  const [sent, setSent] = useState(false);
  const canAdd = Number(draft.quantity) > 0 && Number(draft.price) > 0 && draft.vintage !== "";
  const add = () => {
    if (!canAdd) return;
    setRows((r) => [...r, { min: r.length ? r[r.length - 1].quantity : 0, quantity: Number(draft.quantity), vintage: Number(draft.vintage), price: Number(draft.price) }]);
    setDraft({ quantity: "", vintage: "", price: "" });
  };
  const cell = "px-3 py-3 text-[14px]";
  const box = cn("h-10 w-full rounded-[10px] border border-bn-medium bg-white px-3 text-[14px] text-bn-heavy", BN.focus);
  return (
    <div role="dialog" aria-label="Proposal details" className={cn(CARD, className)}>
      {sent ? (
        <Done onBack={() => setSent(false)}>Proposal submitted</Done>
      ) : (
        <div className="grid gap-5">
          <h4 className="font-display text-[32px] leading-none font-bold">Proposal details</h4>
          <section>
            <h5 className="font-mono text-[13px] font-bold tracking-[0.04em] uppercase">Project</h5>
            <label className="mt-3 flex cursor-pointer items-center gap-4 rounded-[16px] p-4 ring-1 ring-[#d6dad5] has-checked:ring-2 has-checked:ring-bn-heavy">
              <span className="grid flex-1 gap-1">
                <span className="flex items-center gap-2 text-[13px]">
                  <span className="grid size-6 place-items-center rounded-full bg-bn-green">
                    <svg viewBox={viewBox} aria-hidden className="w-3.5 fill-bn-heavy">
                      <path d={symbol} />
                    </svg>
                  </span>
                  <span className="rounded-full bg-[#e9edea] px-2 py-0.5 text-[11px] font-medium">VCS 1477</span>
                  <span aria-hidden>🇨🇴</span> Colombia
                </span>
                <span className="font-display text-[24px] leading-7 font-bold">Chocó-Darién Bioregion</span>
                <span className="text-[13px] text-bn-medium">Avoided unplanned deforestation</span>
              </span>
              <input type="radio" name="proposal-project" defaultChecked className={cn("size-5 accent-bn-heavy", BN.focus)} />
            </label>
          </section>
          <section>
            <h5 className="font-mono text-[13px] font-bold tracking-[0.04em] uppercase">Opportunity</h5>
            <div className="mt-3 overflow-x-auto rounded-[14px] ring-1 ring-[#d6dad5]">
              <table className="w-full min-w-[26rem] text-left">
                <thead className="bg-[#eef1ee] text-[13px] text-bn-medium">
                  <tr>
                    <th scope="col" className={cn(cell, "font-normal")}>Minimum purchase</th>
                    <th scope="col" className={cn(cell, "font-normal")}>Quantity</th>
                    <th scope="col" className={cn(cell, "font-normal")}>Vintage</th>
                    <th scope="col" className={cn(cell, "font-normal")}>Price</th>
                    <th scope="col" className={cell}>
                      <span className="sr-only">Remove</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={`${i}-${r.quantity}-${r.vintage}`} className="border-t border-[#e6e8e4] motion-safe:animate-[arrive_0.35s_var(--ease-arrive)_both]">
                      <td className={cell}>{num(r.min)}</td>
                      <td className={cell}>{num(r.quantity)}</td>
                      <td className={cell}>{r.vintage}</td>
                      <td className={cell}>${r.price}</td>
                      <td className={cn(cell, "w-10")}>
                        <button type="button" aria-label={`Remove the ${r.vintage} opportunity of ${num(r.quantity)} tonnes`} onClick={() => setRows((x) => x.filter((_, j) => j !== i))} className={cn("grid size-7 place-items-center rounded-full hover:bg-bn-heavy/8", BN.focus)}>
                          <MdMoreVert aria-hidden className="size-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-[#e6e8e4] bg-[#f5f7f5]">
                    <td className={cell} colSpan={2}>
                      <input aria-label="Quantity, in tonnes" inputMode="numeric" placeholder="Quantity" value={draft.quantity} onChange={(e) => setDraft((d) => ({ ...d, quantity: e.target.value.replace(/\D/g, "") }))} className={box} />
                    </td>
                    <td className={cell}>
                      <select aria-label="Vintage" value={draft.vintage} onChange={(e) => setDraft((d) => ({ ...d, vintage: e.target.value }))} className={box}>
                        <option value="">Vintage</option>
                        {VINTAGES.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={cell} colSpan={2}>
                      <input aria-label="Price per tonne, in US dollars" inputMode="numeric" placeholder="USD" value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value.replace(/\D/g, "") }))} className={box} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex justify-end">
              <Button tint="monochrome" size="sm" disabled={!canAdd} onClick={add} icon={<MdAdd aria-hidden className="size-4" />} iconPosition="trailing">
                Add more opportunities
              </Button>
            </div>
          </section>
          <Button className="w-full" onClick={() => setSent(true)} icon={<MdArrowForward aria-hidden className="size-5" />} iconPosition="trailing">
            Submit proposal
          </Button>
        </div>
      )}
    </div>
  );
};
