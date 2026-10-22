"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../cn";
import { Field, FIELD_INPUT, fieldBox, type Tone } from "./field";

type TextAreaProps = Omit<ComponentProps<"textarea">, "className"> & {
  label: string;
  required?: boolean;
  message?: ReactNode;
  tone?: Tone;
  aside?: ReactNode;
  className?: string;
};

/** Banyan's Textarea: the Input's box, four lines tall, same states. */
export const TextArea = ({ label, required, message, tone = "default", aside, className, disabled, rows = 4, ...area }: TextAreaProps) => (
  <Field label={label} required={required} message={message} tone={tone} aside={aside} className={className}>
    {({ id, describedBy, invalid }) => (
      <div className={cn(fieldBox({ tone, disabled }), "items-stretch py-4")}>
        <textarea
          id={id}
          rows={rows}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          required={required}
          disabled={disabled}
          className={cn(FIELD_INPUT, "resize-y")}
          {...area}
        />
      </div>
    )}
  </Field>
);
