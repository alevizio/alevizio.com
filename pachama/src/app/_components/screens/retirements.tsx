"use client";

import certificate from "@/assets/product/certificate.jpg";
import Image from "next/image";
import { useRef } from "react";
import { MdOutlineCardMembership } from "react-icons/md";
import { BN } from "../banyan/ui";
import { cn } from "../cn";
import { Zoom } from "../zoom";

/* From order to retirement, as a buyer sees it: the Retirements table, and
 * laid over it, the certificate a retirement issues: the real one Pachama
 * sent Just Spices for 200 tonnes from Kootznoowoo, whose row is the first.
 * The other rows are the screen's samples. Click the certificate, or its
 * row's link, to read it big. Under the table, its seal, from the
 * Certificate Figma. */
type Row = { date: string; time?: string; project: string; vintage: number; quantity: number; status: "Retired" | "Pending" };
const ROWS: Row[] = [
  { date: "2/01/2022", project: "Kootznoowoo", vintage: 2019, quantity: 200, status: "Retired" },
  { date: "31/10/2021", time: "10:10 pm", project: "Manoa", vintage: 2019, quantity: 100, status: "Retired" },
  { date: "31/10/2021", time: "10:10 pm", project: "Agrocortex", vintage: 2021, quantity: 100, status: "Retired" },
  { date: "31/10/2021", time: "10:10 pm", project: "Jari", vintage: 2015, quantity: 99, status: "Retired" },
  { date: "31/10/2021", time: "10:10 pm", project: "Jari Pará", vintage: 2020, quantity: 500, status: "Pending" },
];
const STATUS = { Retired: "bg-bn-heavy text-white", Pending: "bg-[#ff9b4a] text-bn-heavy" };
const ALT =
  "The certificate of authenticity Pachama issued Just Spices on 2 January 2022 for offsetting 200 metric tonnes of CO2: Kootznoowoo, improved forest management, vintage 2019, registered with the American Carbon Registry";

export const Retirements = ({ className }: { className?: string }) => {
  const paper = useRef<HTMLDivElement>(null);
  const open = () => paper.current?.querySelector("button")?.click();
  return (
    <div className={cn("relative", className)}>
      <section className="rounded-[20px] bg-[#fdfbf1] p-5 text-bn-heavy shadow-[0_24px_80px_rgb(20_26_23/0.12)] ring-1 ring-black/5 sm:p-7 lg:w-[66%]">
        <h4 className="font-display text-[36px] leading-none font-bold">Retirements</h4>
        <p className="mt-2 text-[14px] text-bn-medium">Here you can see all the retirements and download certificates.</p>
        <div className="no-scrollbar mt-5 overflow-x-auto rounded-[14px] border border-[#e3dcc3] bg-white">
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
                <tr key={`${r.project}-${r.vintage}`} className={cn("border-b border-[#ece6d2] last:border-b-0", i === 0 && "bg-bn-green/12")}>
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
                  <td className="px-4 py-3 text-[13px] whitespace-nowrap">
                    {i === 0 ? (
                      <button type="button" onClick={open} className={cn("inline-flex items-center gap-1.5 rounded-[6px] font-bold underline underline-offset-2", BN.focus)}>
                        <MdOutlineCardMembership aria-hidden className="size-4" />
                        Download certificate
                      </button>
                    ) : r.status === "Retired" ? (
                      <span className="text-bn-medium underline underline-offset-2">Download certificate</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* The certificate, laid on top of the table like a sheet of paper. */}
      <div
        ref={paper}
        data-reveal="pop"
        className="relative z-10 mx-auto -mt-8 w-[92%] rotate-[2.5deg] sm:w-[78%] lg:absolute lg:top-[-2.25rem] lg:right-0 lg:mt-0 lg:w-[47%]"
      >
        <div className="overflow-hidden rounded-[6px] shadow-[0_1px_2px_rgb(20_26_23/0.14),0_10px_24px_rgb(20_26_23/0.14),0_40px_90px_rgb(20_26_23/0.2)]">
          <Zoom src={certificate} alt={ALT}>
            <Image src={certificate} alt={ALT} sizes="(min-width: 1024px) 620px, 92vw" placeholder="blur" className="block h-auto w-full" />
          </Zoom>
        </div>
      </div>
      {/* The certificate's seal, from its Figma, on its own under the table: straight, at a size its detail reads. */}
      <p data-reveal className="mt-8 flex items-center gap-5 lg:w-[66%]">
        <Image src="/brand/carbon-credit-badge.svg" alt="The Carbon Credit Certificate seal: a tree in a green to blue gradient ring" width={104} height={136} unoptimized className="h-[136px] w-[104px] shrink-0" />
        <span className="max-w-[22rem] text-[14px] leading-5 text-(--tone-text)">The seal on every certificate a retirement issues.</span>
      </p>
    </div>
  );
};
