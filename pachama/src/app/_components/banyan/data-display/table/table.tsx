"use client";

import { useMemo, useState } from "react";
import { cn } from "../../../cn";
import { Button } from "../../button";
import { Badge } from "../badge";
import { TableCheckbox } from "./checkbox";
import { StatusFilter, TableSearch } from "./controls";
import { Paginator } from "./paginator";
import { ROWS, type Row, type Status } from "./rows";
import { SortHeader, type Dir } from "./sort-header";
import { BN } from "../../ui";

/* Banyan's table (Figma: Table, 1005:10552 and the doc's examples): search
 * and a filter on top; sortable headers; rows you can pick; a paginator;
 * skeleton rows while loading. Hover tints a row lidar green lightest, a
 * picked row goes lidar green. */
type Key = "project" | "vintage" | "credits" | "available";

const available = (r: Row) => (r.status === "Retired" ? 0 : r.credits - r.onHold);
const VALUE: Record<Key, (r: Row) => string | number> = {
  project: (r) => r.project,
  vintage: (r) => r.vintage,
  credits: (r) => r.credits,
  available,
};
const TONE: Record<Status, "success" | "warning" | "heavy"> = { Available: "success", Pending: "warning", Retired: "heavy" };
const n = (v: number) => v.toLocaleString("en-US");
const CELL = "px-6 py-4 text-base leading-6 text-bn-heavy";

export const DataTable = ({ className }: { className?: string }) => {
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [sort, setSort] = useState<{ key: Key; dir: Dir }>({ key: "vintage", dir: "asc" });
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const hits = ROWS.filter((r) => r.project.toLowerCase().includes(q) && (statuses.length === 0 || statuses.includes(r.status)));
    const sign = sort.dir === "asc" ? 1 : -1;
    return hits.toSorted((a, b) => (VALUE[sort.key](a) > VALUE[sort.key](b) ? sign : VALUE[sort.key](a) < VALUE[sort.key](b) ? -sign : 0));
  }, [query, statuses, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / perPage));
  const current = Math.min(page, pages);
  const shown = rows.slice((current - 1) * perPage, current * perPage);
  const pickedHere = shown.filter((r) => picked.has(r.id)).length;

  const sortBy = (key: Key) => setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));
  const pick = (ids: string[], on: boolean) =>
    setPicked((p) => {
      const next = new Set(p);
      ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
      return next;
    });
  const dirOf = (key: Key) => (sort.key === key ? sort.dir : undefined);

  return (
    <div className={cn("grid w-full gap-4", className)}>
      <div className="flex flex-wrap items-end gap-2">
        <TableSearch value={query} onChange={(v) => (setQuery(v), setPage(1))} />
        <StatusFilter value={statuses} onChange={(v) => (setStatuses(v), setPage(1))} />
        <Button hierarchy="tertiary" size="sm" className="ml-auto" onClick={() => setLoading((l) => !l)}>
          {loading ? "Show the data" : "Show loading"}
        </Button>
      </div>
      <p aria-live="polite" className="text-[14px] leading-5 text-bn-medium">
        {picked.size ? `${picked.size} of ${ROWS.length} selected` : `${rows.length} of ${ROWS.length} vintages`}
      </p>
      <div role="region" aria-label="Sample credit balances" tabIndex={0} className={cn("overflow-x-auto rounded-2xl border border-bn-line bg-white", BN.focus)}>
        <table aria-busy={loading} className="w-full min-w-[46rem] border-collapse">
          <thead className="border-b border-bn-line">
            <tr>
              <th scope="col" className="w-[72px] px-6 py-5 text-left">
                <TableCheckbox
                  checked={shown.length > 0 && pickedHere === shown.length}
                  mixed={pickedHere > 0 && pickedHere < shown.length}
                  onChange={(on) => pick(shown.map((r) => r.id), on)}
                  label="Select every row on this page"
                />
              </th>
              <SortHeader label="Project" dir={dirOf("project")} onSort={() => sortBy("project")} />
              <SortHeader label="Vintage" dir={dirOf("vintage")} onSort={() => sortBy("vintage")} />
              <th scope="col" className="px-6 text-left text-base leading-6 font-bold text-bn-heavy">
                Status
              </th>
              <SortHeader label="Credits" dir={dirOf("credits")} onSort={() => sortBy("credits")} />
              <SortHeader label="Available" dir={dirOf("available")} onSort={() => sortBy("available")} />
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 3 }, (_, i) => (
                  <tr key={i} className="border-b border-bn-line last:border-0">
                    {Array.from({ length: 6 }, (_, j) => (
                      <td key={j} className="px-6 py-5">
                        <span className={cn("block h-4 rounded-full bg-bn-grey-lightest motion-safe:animate-pulse", j === 0 ? "w-6" : "w-24")} />
                      </td>
                    ))}
                  </tr>
                ))
              : shown.map((r) => {
                  const on = picked.has(r.id);
                  return (
                    <tr key={r.id} className={cn("border-b border-bn-line transition-colors last:border-0", on ? "bg-bn-green" : "hover:bg-bn-green-lightest")}>
                      <td className="px-6 py-4">
                        <TableCheckbox checked={on} onChange={(v) => pick([r.id], v)} label={`Select ${r.project} ${r.vintage}`} />
                      </td>
                      <td className="px-6 py-1.5 text-bn-heavy">
                        <span className="block text-base leading-6">{r.project}</span>
                        <span className="block text-[14px] leading-5 text-bn-medium">{r.type}</span>
                      </td>
                      <td className={CELL}>{r.vintage}</td>
                      <td className={CELL}>
                        <Badge tone={TONE[r.status]}>{r.status}</Badge>
                      </td>
                      <td className="px-6 py-1.5 text-bn-heavy">
                        <span className="block text-base leading-6">{n(r.credits)}</span>
                        <span className="block text-[14px] leading-5 text-bn-medium">{r.onHold ? `${n(r.onHold)} on hold` : "None on hold"}</span>
                      </td>
                      <td className="px-6 py-3.5 text-xl leading-7 text-bn-heavy">{n(available(r))}</td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
        {!loading && rows.length === 0 ? <p className="px-6 py-8 text-base leading-6 text-bn-medium">No vintages match. Clear the search or the filter.</p> : null}
      </div>
      <Paginator page={current} pages={pages} perPage={perPage} onPage={setPage} onPerPage={(v) => (setPerPage(v), setPage(1))} />
    </div>
  );
};
