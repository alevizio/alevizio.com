"use client";

import { MdInfoOutline } from "react-icons/md";
import { cn } from "../../cn";
import { BN } from "../ui";
import { PLACE, PLACEMENTS, placementName } from "./glass";
import { Tooltip, TooltipBubble } from "./tooltip";

/* All eight places at once, around one trigger, as the docs lay them out. */
// Each place around its own trigger, so the eight don't sit on each other.
export const TooltipPositions = () => (
  <ul className="grid w-full grid-cols-2 sm:grid-cols-4">
    {PLACEMENTS.map((p) => (
      <li key={p} className="grid h-32 place-items-center">
        <span className="relative grid size-8 place-items-center text-bn-heavy">
          <MdInfoOutline aria-hidden className="size-5" />
          <span className={cn("absolute", PLACE[p])}>
            <TooltipBubble placement={p}>{placementName(p)}</TooltipBubble>
          </span>
        </span>
      </li>
    ))}
  </ul>
);

/* Where they earn their keep: a name cut short in a table, and a field too
 * narrow for what's picked. Hover or tab to them. */
const ROWS = [
  { id: "Manoa_2020", name: "Manoa REDD+, avoided planned deforestation, Brazil", vintage: "2020" },
  { id: "Manoa_2021", name: "Manoa", vintage: "2021" },
];

export const TooltipExamples = () => (
  <div className="flex w-full flex-col items-center gap-10">
    <table className="w-full max-w-xl table-fixed overflow-hidden rounded-xl border border-bn-line bg-white text-left text-[14px] text-bn-heavy">
      <thead>
        <tr className="border-b border-bn-line">
          {["ID", "Name", "Type", "Vintage"].map((h) => (
            <th key={h} scope="col" className="px-4 py-3 font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ROWS.map((r) => (
          <tr key={r.id} className="border-b border-bn-line last:border-0">
            <td className="px-4 py-3">{r.id}</td>
            <td className="px-4 py-3">
              <Tooltip label={r.name} placement="top">
                {(described) => (
                  <span tabIndex={0} {...described} className={cn("block max-w-36 truncate rounded-sm", BN.focus)}>
                    {r.name}
                  </span>
                )}
              </Tooltip>
            </td>
            <td className="px-4 py-3">Carbon</td>
            <td className="px-4 py-3">{r.vintage}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <Tooltip label="Indonesia, Brazil, Costa Rica, Uruguay" placement="top">
      {(described) => (
        <span tabIndex={0} {...described} className={cn("block h-12 w-48 truncate rounded-xl border border-bn-medium bg-white/40 px-4 text-[16px] leading-[46px] text-bn-heavy", BN.focus)}>
          Indonesia, Brazil, Costa Rica, Uruguay
        </span>
      )}
    </Tooltip>
  </div>
);
