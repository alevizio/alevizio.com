"use client";

import { useEffect, useRef } from "react";
import { MdCheck, MdRemove } from "react-icons/md";
import { cn } from "../../../cn";
import { BN } from "../../ui";

/* The table's checkbox (Figma: Table Cell, Checkbox): 24px, 8px corners, a
 * medium border; checked or mixed fills heavy with a white mark. A native
 * input underneath, so keyboard and screen readers get the real thing. */
export const TableCheckbox = ({
  checked,
  mixed = false,
  onChange,
  label,
}: {
  checked: boolean;
  mixed?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = mixed;
  }, [mixed]);
  const on = checked || mixed;
  return (
    <span className="relative inline-grid size-6 place-items-center">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
        className={cn(
          "peer size-6 cursor-pointer appearance-none rounded-[8px] border border-bn-medium bg-white/30 transition-colors",
          "checked:border-bn-heavy checked:bg-bn-heavy indeterminate:border-bn-heavy indeterminate:bg-bn-heavy",
          BN.focus,
        )}
      />
      {on ? (
        mixed ? (
          <MdRemove aria-hidden className="pointer-events-none absolute size-4 text-white" />
        ) : (
          <MdCheck aria-hidden className="pointer-events-none absolute size-4 text-white" />
        )
      ) : null}
    </span>
  );
};
