"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../cn";
import { Field, FIELD_INPUT, fieldBox, type Tone } from "./field";

type TextInputProps = Omit<ComponentProps<"input">, "size" | "className"> & {
  label: string;
  required?: boolean;
  message?: ReactNode;
  tone?: Tone;
  /** Inside the box, before and after the text: an icon, a clear button, a pill. */
  leading?: ReactNode;
  trailing?: ReactNode;
  /** To the label's right, like the unit tabs. */
  aside?: ReactNode;
  className?: string;
};

/** Banyan's Input: every type (plain, icon, search, button, tabs) is this
 *  box with something before or after the text, or beside the label. */
export const TextInput = ({ label, required, message, tone = "default", leading, trailing, aside, className, disabled, ...input }: TextInputProps) => (
  <Field label={label} required={required} message={message} tone={tone} aside={aside} className={className}>
    {({ id, describedBy, invalid }) => (
      <div className={cn(fieldBox({ tone, disabled }), "h-14")}>
        {leading}
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required={required}
          disabled={disabled}
          className={FIELD_INPUT}
          {...input}
        />
        {trailing}
      </div>
    )}
  </Field>
);
