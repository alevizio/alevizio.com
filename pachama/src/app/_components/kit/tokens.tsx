import { cn } from "../cn";
import { UI } from "./ui";

/* The product's foundations: its colours, its type scale (in Matter), its
 * corners and its one shadow. */
const COLOURS = [
  { name: "Action", value: "#43b96c → #13adb1", swatch: "bg-linear-to-r from-[#43b96c] to-[#13adb1]" },
  { name: "Ink", value: "#141a17", swatch: "bg-[#141a17]" },
  { name: "Night", value: "#1d2422", swatch: "bg-[#1d2422]" },
  { name: "Pass", value: "#23854a", swatch: "bg-[#23854a]" },
  { name: "Canvas", value: "#f5f6f8", swatch: "bg-[#f5f6f8] ring-1 ring-inset ring-[#e3e6e4]" },
  { name: "Line", value: "#e3e6e4", swatch: "bg-[#e3e6e4]" },
];

const TYPE = [
  { name: "Display · 44", sample: "Manoa", className: "text-[44px] font-medium leading-none tracking-[-0.02em]" },
  { name: "Title · 24", sample: "Evaluation results", className: "text-2xl font-medium" },
  { name: "Body · 15", sample: "Every project on the marketplace meets the same five standards.", className: "text-[15px]" },
  { name: "Label · 11", sample: "TOTAL HECTARES", className: "font-mono text-[11px] tracking-[0.12em]" },
];

const RADII = [
  { name: "4", className: "rounded-[4px]" },
  { name: "8", className: "rounded-[8px]" },
  { name: "12", className: "rounded-[12px]" },
  { name: "Pill", className: "rounded-full" },
];

export const Tokens = () => (
  <div className="grid gap-6 lg:grid-cols-2">
    <div className={cn(UI.card, "p-6 sm:p-8")}>
      <p className={UI.label}>Colour</p>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {COLOURS.map((c) => (
          <div key={c.name}>
            <div className={cn("h-16 rounded-[8px]", c.swatch)} />
            <p className={cn("mt-2 text-[13px] font-medium", UI.ink)}>{c.name}</p>
            <p className={cn("font-mono text-[11px]", UI.muted)}>{c.value}</p>
          </div>
        ))}
      </div>
      <p className={cn(UI.label, "mt-8")}>Corners and depth</p>
      <div className="mt-4 grid grid-cols-4 gap-4">
        {RADII.map((r) => (
          <div key={r.name}>
            <div className={cn("h-14 border border-[#e3e6e4] bg-white shadow-[0_8px_24px_rgb(20_26_23/0.08)]", r.className)} />
            <p className={cn("mt-2 font-mono text-[11px]", UI.muted)}>{r.name}</p>
          </div>
        ))}
      </div>
    </div>
    <div className={cn(UI.card, "grid content-start gap-6 p-6 sm:p-8")}>
      <p className={UI.label}>Type</p>
      {TYPE.map((t) => (
        <div key={t.name} className="border-t border-[#e3e6e4] pt-4">
          <p className={cn("font-mono text-[11px]", UI.muted)}>{t.name}</p>
          <p className={cn("mt-2", UI.ink, t.className)}>{t.sample}</p>
        </div>
      ))}
    </div>
  </div>
);
