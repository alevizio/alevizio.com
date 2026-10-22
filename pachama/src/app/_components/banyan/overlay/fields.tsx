import type { ComponentProps, ReactNode } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { cn } from "../../cn";

/* The few form fields the modal examples need, drawn the way Banyan's modal
 * docs draw them: a 12px label, a 48px field with 12px corners. The forms
 * family has the full set. */
const FIELD = "h-12 w-full rounded-xl border border-bn-medium bg-white/40 px-4 text-[16px] text-bn-heavy outline-none focus-visible:ring-2 focus-visible:ring-bn-heavy disabled:border-bn-line disabled:text-bn-light";

export const Labelled = ({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) => (
  <label className="block">
    <span className="mb-1 block text-[12px] leading-4">{label}</span>
    {children}
    {hint ? <span className="mt-1 block text-[12px] leading-4 text-bn-medium">{hint}</span> : null}
  </label>
);

export const TextField = ({ className, ...rest }: ComponentProps<"input">) => <input className={cn(FIELD, className)} {...rest} />;

export const SelectField = ({ className, children, ...rest }: ComponentProps<"select">) => (
  <span className="relative block">
    <select className={cn(FIELD, "appearance-none pr-10", className)} {...rest}>
      {children}
    </select>
    <MdArrowDropDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-6 -translate-y-1/2" />
  </span>
);
