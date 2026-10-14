import { cn } from "./cn";

/* What went to the client: the brand kit as it was handed over, grouped by
 * what you are trying to do, not by the tool that made it. */
const ENTRIES = [
  { name: "Brand book", note: "41 spreads, real vector, searchable", meta: "PDF" },
  { name: "Marks & illustrations/", note: "47 drawings in SVG and PNG, 33 pen marks", meta: "128" },
  { name: "Icon/", note: "the full iOS ladder, paper and solid", meta: "68" },
  { name: "Logo/", note: "wordmark and lockup, master + fixed colours", meta: "21" },
  { name: "App Store/", note: "the listing, in order", meta: "11" },
  { name: "App/", note: "the screens the book is built from", meta: "8" },
  { name: "Ads/", note: "the call-out, on a feed", meta: "4" },
  { name: "Social/", note: "profile and posts", meta: "4" },
  { name: "Website/", note: "pausa.co, desktop and mobile", meta: "4" },
  { name: "Mockups/", note: "posters and devices", meta: "3" },
  { name: "Color Tokens/", note: "CSS and JSON", meta: "2" },
] as const;

export const KitList = ({ className }: { className?: string }) => (
  <div className={cn("rounded-[6px] bg-sheet ring-1 ring-rule", className)}>
    <div className="flex items-baseline justify-between gap-4 border-b border-rule px-6 py-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink">Pausa / Brand Kit</p>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">255 files</p>
    </div>
    <ul className="divide-y divide-rule">
      {ENTRIES.map((e) => (
        <li key={e.name} className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 px-6 py-3 sm:grid-cols-[14rem_1fr_auto]">
          <span className="font-sans text-[0.9rem] text-ink">{e.name}</span>
          <span className="col-span-2 row-start-2 font-sans text-[0.8rem] text-body sm:col-span-1 sm:row-start-auto">
            {e.note}
          </span>
          <span className="col-start-2 row-start-1 font-mono text-[11px] text-muted sm:col-start-auto sm:row-start-auto">
            {e.meta}
          </span>
        </li>
      ))}
    </ul>
  </div>
);
