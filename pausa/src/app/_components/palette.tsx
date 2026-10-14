import { cn } from "./cn";

/* The palette as the brand book sets it: two primaries that speak, and
 * paper for everything else. The proportions are the rule, so the bar
 * at the top is drawn to them: ~95% paper, ≤5% pen, one highlight. */
const RULES = [
  {
    name: "Pen",
    hex: "#172CA3",
    swatch: "bg-pen",
    rule: "The blue is a voice. It appears where Pausa speaks: the call-out, the aside, the underline, the marks, plus one CTA per screen. Never chrome, never decoration.",
    limit: "≤ 5% of any surface",
  },
  {
    name: "Highlighter",
    hex: "#FFD23F",
    swatch: "bg-highlighter",
    rule: "Yellow is attention. One highlight per screen: the single line worth noticing. It sits behind ink, never on it, and never on Pausa's own words.",
    limit: "Max 1 / screen",
  },
  {
    name: "Paper",
    hex: "#ECECEE",
    swatch: "bg-paper-deep ring-1 ring-rule ring-inset",
    rule: "Everything else is paper: text, dividers, most buttons. Recurring CTAs are ink, because blue means Pausa is speaking.",
    limit: "≈ 95% of every screen",
  },
] as const;

const SECONDARIES = [
  { hex: "#FFFFFF", role: "cards", swatch: "bg-sheet" },
  { hex: "#F7F7F8", role: "cards", swatch: "bg-card" },
  { hex: "#E4E4E7", role: "the page", swatch: "bg-rule" },
  { hex: "#54545B", role: "body text, rules", swatch: "bg-body" },
  { hex: "#1A1A1D", role: "ink", swatch: "bg-ink" },
] as const;

export const Palette = ({ className }: { className?: string }) => (
  <div className={cn("rounded-[6px] bg-sheet p-6 ring-1 ring-rule sm:p-8", className)}>
    {/* The proportion bar: paper, then a sliver of pen, then one highlight. */}
    <div aria-hidden className="flex h-3 overflow-hidden rounded-full">
      <span className="flex-[95] bg-paper-deep" />
      <span className="flex-[4] bg-pen" />
      <span className="flex-[1] bg-highlighter" />
    </div>
    <ul className="mt-8 grid gap-8 md:grid-cols-3">
      {RULES.map((c) => (
        <li key={c.name}>
          <span aria-hidden className={cn("block h-14 w-14 rounded-full", c.swatch)} />
          <p className="mt-4 text-[1.2rem] text-ink">{c.name}</p>
          <p className="font-mono text-[11px] tracking-[0.12em] text-pen">{c.hex}</p>
          <p className="mt-3 font-sans text-[0.9rem] leading-[1.6] text-body">{c.rule}</p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-pen">
            {c.limit}
          </p>
        </li>
      ))}
    </ul>
    <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-rule pt-6 sm:grid-cols-5">
      {SECONDARIES.map((c) => (
        <li key={c.hex} className="flex items-center gap-3">
          <span aria-hidden className={cn("h-8 w-8 shrink-0 rounded-[4px] ring-1 ring-rule ring-inset", c.swatch)} />
          <span className="leading-tight">
            <span className="block font-mono text-[11px] text-ink">{c.hex}</span>
            <span className="block font-sans text-[0.78rem] text-body">{c.role}</span>
          </span>
        </li>
      ))}
    </ul>
  </div>
);
