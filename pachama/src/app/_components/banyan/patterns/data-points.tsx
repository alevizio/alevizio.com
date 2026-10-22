import type { ReactNode } from "react";
import { cn } from "../../cn";
import { StatusBadge } from "./card-parts";

/* Data point cards: one number, its label, a line under it; empty until
 * there's data, and grouped when several belong together. Sample values. */
type Point = { label: string; value?: string; note?: string };

const Value = ({ label, value, note }: Point) => (
  <div className="min-w-0">
    <p className="text-[12px] leading-4 text-bn-heavy">{label}</p>
    <p className={cn("mt-1 text-[32px] leading-10 font-bold", value ? "text-bn-heavy" : "text-bn-light")}>{value ?? "0"}</p>
    {value ? (note ? <p className="text-[12px] leading-4 text-bn-medium">{note}</p> : null) : <StatusBadge tone="neutral" className="mt-1">Not started yet</StatusBadge>}
  </div>
);

const Box = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("rounded-[16px] border border-bn-grey-light bg-white p-4", className)}>{children}</div>
);

export const DataPoints = ({ className }: { className?: string }) => (
  <div className={cn("flex flex-wrap justify-center gap-4", className)}>
    <Box className="w-[194px]">
      <Value label="Seedling survival rate" />
    </Box>
    <Box className="w-[194px]">
      <Value label="Seedling survival rate" value="30%" note="Sample value" />
    </Box>
    <Box className="grid w-full max-w-[597px] gap-6 sm:grid-cols-3">
      <Value label="Proposals received" value="50" note="10 new this week" />
      <Value label="Average cost" value="$20" note="Per credit" />
      <Value label="Credits a year" value="200,000" note="On average" />
    </Box>
  </div>
);
