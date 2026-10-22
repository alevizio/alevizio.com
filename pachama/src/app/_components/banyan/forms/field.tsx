"use client";

import { useId, type ReactNode } from "react";
import { MdCheckCircle, MdError } from "react-icons/md";
import { cn } from "../../cn";

/* What every Banyan text field shares, from the Input component: a 16/24
 * label over a 56px box with a 16px radius and a 1px border, then a 12/16
 * helper line. Focus adds a 2px #BBB ring and darkens the border; success
 * and error draw a 2px lidar-green or fire-red border. */
export type Tone = "default" | "success" | "error";

export const fieldBox = ({ tone = "default", disabled = false }: { tone?: Tone; disabled?: boolean }) =>
  cn(
    "flex w-full items-center gap-2 rounded-2xl border bg-white px-4 text-base leading-6 text-bn-heavy transition-[border-color,box-shadow]",
    "focus-within:shadow-[0_0_0_2px_var(--color-bn-line)]",
    disabled
      ? "border-bn-line bg-bn-grey-lightest text-bn-light"
      : {
          default: "border-bn-medium focus-within:border-bn-heavy",
          success: "border-2 border-bn-green px-[15px]",
          error: "border-2 border-bn-red px-[15px]",
        }[tone],
  );

/** The bare input inside a box: the box draws focus, so the input doesn't. */
export const FIELD_INPUT =
  "min-w-0 flex-1 bg-transparent outline-none placeholder:text-bn-medium disabled:cursor-not-allowed disabled:placeholder:text-bn-light";

type Ids = { id: string; describedBy?: string; invalid: boolean };

/** Label, the control (given its ids), and the helper or status line. The
 *  Figma colours the status line itself; here the icon carries the colour
 *  and the words stay readable (fire red and lidar green fail 4.5:1). */
export const Field = ({
  label,
  required = false,
  message,
  tone = "default",
  aside,
  labelFor = true,
  className,
  children,
}: {
  label: ReactNode;
  required?: boolean;
  message?: ReactNode;
  tone?: Tone;
  /** Anything to the label's right: tabs, a chip, a toggle. */
  aside?: ReactNode;
  /** False for custom controls (a combobox div): they point back at the
   *  label with aria-labelledby, `${id}-label`, instead. */
  labelFor?: boolean;
  className?: string;
  children: (ids: Ids) => ReactNode;
}) => {
  const id = useId();
  const messageId = `${id}-message`;
  return (
    <div className={cn("flex w-full flex-col gap-1", className)}>
      <div className="relative flex min-h-6 items-end justify-between gap-2">
        {(() => {
          const text = (
            <>
              {label}
              {required ? <span className="text-bn-medium"> (required)</span> : null}
            </>
          );
          return labelFor ? (
            <label id={`${id}-label`} htmlFor={id} className="text-base leading-6 text-bn-heavy">
              {text}
            </label>
          ) : (
            <span id={`${id}-label`} className="text-base leading-6 text-bn-heavy">
              {text}
            </span>
          );
        })()}
        {aside}
      </div>
      {children({ id, describedBy: message ? messageId : undefined, invalid: tone === "error" })}
      {message ? (
        <p id={messageId} className={cn("flex items-center gap-1 text-xs leading-4", tone === "error" ? "text-bn-red-dark" : tone === "success" ? "text-bn-heavy" : "text-bn-medium")}>
          {tone === "error" ? <MdError aria-hidden className="size-3.5 shrink-0 text-bn-red" /> : null}
          {tone === "success" ? <MdCheckCircle aria-hidden className="size-3.5 shrink-0 text-bn-green-dark" /> : null}
          {message}
        </p>
      ) : null}
    </div>
  );
};
