"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { MdArrowDropDown, MdArrowDropUp, MdHighlightOff } from "react-icons/md";
import { cn } from "../../cn";
import { Field, fieldBox, type Tone } from "./field";
import { Listbox, type Option } from "./listbox";

/* Banyan's Select, as the WAI-ARIA select-only combobox: focus stays on the
 * field, arrows move through the list, Enter or Space picks, Escape closes,
 * typing a letter jumps to it. The value can carry a subtitle or an icon,
 * and `clearable` swaps the caret for a clear button once there's a value. */
export const Select = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Choose one",
  message,
  tone = "default",
  disabled = false,
  clearable = false,
  className,
}: {
  label: string;
  options: Option[];
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  message?: ReactNode;
  tone?: Tone;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}) => {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const current = options.find((o) => o.value === value);

  const show = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const pick = (option: Option) => {
    onChange(option.value);
    setOpen(false);
  };

  const onKey = (e: KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    const last = options.length - 1;
    const moves: Record<string, number> = { ArrowDown: Math.min(active + 1, last), ArrowUp: Math.max(active - 1, 0), Home: 0, End: last };
    if (e.key in moves) {
      e.preventDefault();
      setActive(moves[e.key]);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(options[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    } else if (e.key.length === 1) {
      const hit = options.findIndex((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase()));
      if (hit >= 0) setActive(hit);
    }
  };

  return (
    <Field label={label} message={message} tone={tone} labelFor={false} className={className}>
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          <div
            id={id}
            role="combobox"
            tabIndex={disabled ? -1 : 0}
            aria-labelledby={`${id}-label`}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            aria-disabled={disabled || undefined}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listId}
            aria-activedescendant={open ? `${listId}-${active}` : undefined}
            onClick={() => (disabled ? null : open ? setOpen(false) : show())}
            onKeyDown={disabled ? undefined : onKey}
            onBlur={() => setOpen(false)}
            className={cn(
              fieldBox({ tone, disabled }),
              "min-h-14 cursor-pointer py-2 outline-none select-none focus:shadow-[0_0_0_2px_var(--color-bn-line)]",
              open && "border-bn-heavy shadow-[0_0_0_2px_var(--color-bn-line)]",
              disabled && "cursor-not-allowed",
            )}
          >
            {current?.icon}
            <span className="min-w-0 flex-1">
              <span className={cn("block truncate", !current && !disabled && "text-bn-medium")}>{current?.label ?? placeholder}</span>
              {current?.subtitle ? <span className="block text-xs leading-4 text-bn-medium">{current.subtitle}</span> : null}
            </span>
            {clearable && current && !disabled ? null : open ? (
              <MdArrowDropUp aria-hidden className="size-6 shrink-0" />
            ) : (
              <MdArrowDropDown aria-hidden className="size-6 shrink-0" />
            )}
          </div>
          {clearable && current && !disabled ? (
            <button
              type="button"
              aria-label={`Clear ${label}`}
              onClick={() => onChange(undefined)}
              className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-bn-heavy hover:bg-bn-grey-lightest focus-visible:outline-2 focus-visible:outline-bn-heavy"
            >
              <MdHighlightOff aria-hidden className="size-5" />
            </button>
          ) : null}
          {open ? <Listbox id={listId} labelledBy={`${id}-label`} options={options} selected={value} active={active} onPick={pick} onHover={setActive} /> : null}
        </div>
      )}
    </Field>
  );
};
