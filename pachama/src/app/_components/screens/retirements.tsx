"use client";

import { useState } from "react";
import { MdOutlineCardMembership, MdPark } from "react-icons/md";
import { BN } from "../banyan/ui";
import { MARKS } from "../brand-marks";
import { cn } from "../cn";

/* From order to retirement, as a buyer sees it: the Retirements table, and
 * beside it the certificate of whichever retirement is picked, rebuilt live
 * in the certificate's own layout. The first row is a real one (Just
 * Spices' 200 tonnes from Kootznoowoo, the certificate Pachama issued); the
 * rest are the screen's sample rows, so their certificates say so. A
 * pending retirement has no certificate yet. */
type Row = {
  date: string;
  time?: string;
  project: string;
  vintage: number;
  quantity: number;
  status: "Retired" | "Pending";
  type: string;
  registry: string;
  buyer: string;
  // Only the real certificate carries its numbers.
  number?: string;
  serial?: string;
  issued?: string;
};
const ROWS: Row[] = [
  {
    date: "2/01/2022",
    project: "Kootznoowoo",
    vintage: 2019,
    quantity: 200,
    status: "Retired",
    type: "Improved Forest Management",
    registry: "American Carbon Registry",
    buyer: "Just Spices",
    number: "PCCC - 00001399-A",
    serial: "ACR-US-499-2019-1207-47143 to 48297",
    issued: "2/01/2022",
  },
  { date: "31/10/2021", time: "10:10 pm", project: "Manoa", vintage: 2019, quantity: 100, status: "Retired", type: "REDD+ Avoided Planned Deforestation", registry: "Verra", buyer: "Acme Inc" },
  { date: "31/10/2021", time: "10:10 pm", project: "Agrocortex", vintage: 2021, quantity: 100, status: "Retired", type: "REDD+ Avoided Planned Deforestation", registry: "Verra", buyer: "Acme Inc" },
  { date: "31/10/2021", time: "10:10 pm", project: "Jari", vintage: 2015, quantity: 99, status: "Retired", type: "REDD+", registry: "Verra", buyer: "Acme Inc" },
  { date: "31/10/2021", time: "10:10 pm", project: "Jari Pará", vintage: 2020, quantity: 500, status: "Pending", type: "REDD+", registry: "Verra", buyer: "Acme Inc" },
];
const STATUS = { Retired: "bg-bn-heavy text-white", Pending: "bg-[#ff9b4a] text-bn-heavy" };
const { viewBox, symbol } = MARKS.symbol;

/** The certificate, in the layout Pachama issued it in. */
const Certificate = ({ row }: { row: Row }) => {
  const sample = !row.number;
  return (
    <figure
      key={`${row.project}-${row.vintage}`}
      aria-label={`${sample ? "Sample certificate" : "Certificate"} of authenticity: ${row.buyer}, ${row.quantity} tonnes of CO2 from ${row.project} ${row.vintage}`}
      className="@container relative aspect-[900/636] w-full overflow-hidden rounded-[14px] bg-[linear-gradient(115deg,#e3f7ea_0%,#f2fbf3_45%,#e1f3f8_100%)] text-[#173a2a] shadow-[0_24px_60px_rgb(20_26_23/0.16)] ring-1 ring-black/5 motion-safe:animate-[arrive_0.5s_var(--ease-arrive)_both]"
    >
      {/* The fine engraving of a certificate, a pattern of rings. */}
      <span aria-hidden className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_70%_40%,transparent_0,transparent_5px,rgb(32_150_110/0.07)_6px,transparent_7px)]" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between px-[5cqw] pt-[5cqw]">
          <div className="flex items-center gap-[2cqw]">
            <svg viewBox={viewBox} aria-hidden className="w-[5cqw] fill-[#3ccf8e]">
              <path d={symbol} />
            </svg>
            <span aria-hidden className="h-[6cqw] w-px bg-[#173a2a]/25" />
            <span>
              <span className="block text-[3cqw] leading-tight font-medium">
                Certificate <i className="font-serif">of</i> Authenticity
              </span>
              <span className="block text-[1.8cqw] text-[#173a2a]/70">{row.issued ?? row.date}</span>
            </span>
          </div>
          <div className="flex items-start gap-[1.5cqw] text-right">
            <span className="text-[1.75cqw] leading-tight text-[#2aa66f] uppercase">
              Certificate N°:
              <span className="block text-[2.1cqw]">{row.number ?? "Sample"}</span>
            </span>
            <span aria-hidden className="grid size-[9cqw] place-items-center rounded-full border-[0.5cqw] border-[#2aa66f] text-[#2aa66f]">
              <MdPark className="size-[4.5cqw]" />
            </span>
          </div>
        </div>
        <div className="mt-[6cqw] px-[5cqw]">
          <p className="text-[2cqw] text-[#173a2a]/70">Certificate awarded to:</p>
          <p className="mt-[1cqw] text-[3.2cqw] leading-tight">
            <b>{row.buyer}</b> for offsetting <b>{row.quantity.toFixed(1)} metric tonnes of CO₂</b> emissions
          </p>
          <p className="mt-[5cqw] text-[1.5cqw] font-bold tracking-[0.08em] text-[#173a2a]/70 uppercase">Projects:</p>
          <p className="mt-[1cqw] text-[3.6cqw] leading-none">{row.project}</p>
          <p className="mt-[1cqw] text-[1.9cqw] text-[#173a2a]/70">{row.type}</p>
          <p className="mt-[0.8cqw] text-[1.9cqw] font-bold">Vintage {row.vintage}</p>
          <p className="text-[1.75cqw]">{row.serial ? `Serial #: ${row.serial}` : "A sample: the screen's data, not an issued credit"}</p>
        </div>
        <div className="mt-auto flex items-end justify-between bg-white/85 px-[5cqw] py-[3.5cqw]">
          <span>
            <span className="block text-[1.5cqw] font-bold tracking-[0.08em] text-[#173a2a]/70 uppercase">Registry</span>
            <span className="mt-[0.8cqw] block text-[2.6cqw] leading-none font-bold text-[#2f7d3b]">{row.registry}</span>
          </span>
          <span className="text-right text-[1.8cqw]">
            <b className="block">Diego Saez Gil</b>
            <span className="text-[#173a2a]/70">CEO &amp; President</span>
          </span>
        </div>
      </div>
      {sample ? <span className="absolute top-[1.6cqw] left-[5cqw] rounded-full bg-[#173a2a] px-[1.4cqw] py-[0.3cqw] text-[1.3cqw] font-bold tracking-[0.1em] text-white uppercase">Sample</span> : null}
    </figure>
  );
};

export const Retirements = ({ className }: { className?: string }) => {
  const [picked, setPicked] = useState(0);
  const row = ROWS[picked];
  return (
    <div className={cn("grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8", className)}>
      <section className="rounded-[20px] bg-[#fdfbf1] p-5 text-bn-heavy shadow-[0_24px_80px_rgb(20_26_23/0.12)] ring-1 ring-black/5 sm:p-7">
        <h4 className="font-display text-[36px] leading-none font-bold">Retirements</h4>
        <p className="mt-2 text-[14px] text-bn-medium">Here you can see all the retirements and download certificates.</p>
        <div className="mt-5 overflow-x-auto rounded-[14px] border border-[#e3dcc3] bg-white">
          <table className="w-full min-w-[30rem] text-left text-[14px]">
            <thead className="text-bn-medium">
              <tr className="border-b border-[#ece6d2]">
                <th scope="col" className="px-4 py-3 font-normal">Date</th>
                <th scope="col" className="px-4 py-3 font-normal">Credits</th>
                <th scope="col" className="px-4 py-3 text-right font-normal">Quantity</th>
                <th scope="col" className="px-4 py-3 font-normal">Status</th>
                <th scope="col" className="px-4 py-3 font-normal">
                  <span className="sr-only">Certificate</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={`${r.project}-${r.vintage}`} className={cn("border-b border-[#ece6d2] transition-colors last:border-b-0", i === picked ? "bg-bn-green/12" : "hover:bg-[#fbf9f0]")}>
                  <td className="px-4 py-3">
                    {r.date}
                    {r.time ? <span className="block text-[12px] text-bn-medium">{r.time}</span> : null}
                  </td>
                  <td className="px-4 py-3">
                    {r.project} {r.vintage}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{r.quantity}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-[4px] px-2 py-0.5 font-mono text-[11px] font-bold uppercase", STATUS[r.status])}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {r.status === "Retired" ? (
                      <button
                        type="button"
                        aria-pressed={i === picked}
                        onClick={() => setPicked(i)}
                        className={cn("inline-flex items-center gap-1.5 rounded-[6px] text-[13px] whitespace-nowrap underline underline-offset-2", i === picked ? "font-bold" : "", BN.focus)}
                      >
                        <MdOutlineCardMembership aria-hidden className="size-4" />
                        {i === picked ? "Showing" : "Certificate"}
                      </button>
                    ) : (
                      <span className="text-[12px] text-bn-medium">When it&rsquo;s retired</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div aria-live="polite" className="lg:sticky lg:top-24">
        <Certificate row={row} />
      </div>
    </div>
  );
};
