import type { ReactNode } from "react";
import { MdCheck, MdRemoveRedEye, MdWarning } from "react-icons/md";
import { cn } from "../../cn";

/* Banyan's badges (Figma: Badge, 348:50867 and 3683:62888). Small ones flag a
 * status in Matter Bold 12; the large ones carry an evaluation's verdict. */
type Tone = "default" | "heavy" | "success" | "warning" | "error";

const TONE: Record<Tone, string> = {
  default: "bg-bn-grey-lightest text-bn-heavy",
  heavy: "bg-bn-heavy text-bn-eggshell",
  success: "bg-bn-green text-bn-heavy",
  warning: "bg-bn-yellow text-bn-heavy",
  error: "bg-bn-orange text-bn-heavy",
};

export const Badge = ({ tone = "default", children, className }: { tone?: Tone; children: ReactNode; className?: string }) => (
  <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[12px] leading-4 font-bold whitespace-nowrap", TONE[tone], className)}>
    {children}
  </span>
);

const VERDICT = "inline-flex items-center gap-1 rounded-full py-1 pr-3 pl-2 text-base leading-5 font-bold tracking-[0.4px] whitespace-nowrap uppercase text-bn-heavy";

/** PASS, on its own or with an exception noted beside it. */
export const PassBadge = ({ exception, className }: { exception?: string; className?: string }) => {
  const pass = (
    <span className={cn(VERDICT, "bg-bn-green")}>
      <MdCheck aria-hidden className="size-[18px]" />
      Pass
    </span>
  );
  if (!exception) return <span className={className}>{pass}</span>;
  return (
    // Banyan's fill/02 (#ebebeb) and fill/04 (#0f0f0f), only used here.
    <span className={cn("inline-flex items-center gap-1 rounded-[40px] bg-[#ebebeb] pr-4", className)}>
      {pass}
      <span className="inline-flex items-center gap-1 text-base leading-6 whitespace-nowrap text-[#0f0f0f]">
        <MdWarning aria-hidden className="size-4" />
        {exception}
      </span>
    </span>
  );
};

/** An insight: outlined, so it reads as information rather than a verdict. */
export const InsightBadge = ({ className }: { className?: string }) => (
  <span className={cn(VERDICT, "border-[1.5px] border-bn-heavy py-[2.5px] pr-[10.5px] pl-[6.5px]", className)}>
    <MdRemoveRedEye aria-hidden className="size-[18px]" />
    Insight
  </span>
);
