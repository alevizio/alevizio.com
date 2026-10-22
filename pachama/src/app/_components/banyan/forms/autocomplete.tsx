"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { MdArrowDropDown, MdArrowDropUp, MdHighlightOff } from "react-icons/md";
import { cn } from "../../cn";
import { Field, FIELD_INPUT, fieldBox } from "./field";
import { Listbox, type Option } from "./listbox";

/* Banyan's Autocomplete example, as the WAI-ARIA combobox with list
 * autocomplete: type to filter, arrows to move, Enter to pick, Escape to
 * close and, pressed again, to clear. */
export const Autocomplete = ({
  label,
  options,
  placeholder,
  className,
}: {
  label: string;
  options: Option[];
  placeholder?: string;
  className?: string;
}) => {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string>();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const shown = options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()));

  const pick = (option: Option) => {
    setPicked(option.value);
    setQuery(option.label);
    setOpen(false);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => Math.min(Math.max(a + step, 0), shown.length - 1));
    } else if (e.key === "Enter" && open && shown[active]) {
      e.preventDefault();
      pick(shown[active]);
    } else if (e.key === "Escape") {
      if (open) setOpen(false);
      else {
        setQuery("");
        setPicked(undefined);
      }
    }
  };

  return (
    <Field label={label} className={className}>
      {({ id }) => (
        <div className="relative">
          <div className={cn(fieldBox({}), "h-14", open && "border-bn-heavy shadow-[0_0_0_2px_var(--color-bn-line)]")}>
            <input
              id={id}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={listId}
              aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
              autoComplete="off"
              value={query}
              placeholder={placeholder}
              onChange={(e) => {
                setQuery(e.target.value);
                setPicked(undefined);
                setActive(-1);
                setOpen(true);
              }}
              onClick={() => setOpen(true)}
              onKeyDown={onKey}
              onBlur={() => setOpen(false)}
              className={FIELD_INPUT}
            />
            {picked ? (
              <button
                type="button"
                aria-label={`Clear ${label}`}
                onClick={() => {
                  setQuery("");
                  setPicked(undefined);
                }}
                className="-mr-2 grid size-8 shrink-0 place-items-center rounded-full hover:bg-bn-grey-lightest focus-visible:outline-2 focus-visible:outline-bn-heavy"
              >
                <MdHighlightOff aria-hidden className="size-5" />
              </button>
            ) : open ? (
              <MdArrowDropUp aria-hidden className="size-6 shrink-0" />
            ) : (
              <MdArrowDropDown aria-hidden className="size-6 shrink-0" />
            )}
          </div>
          {open ? <Listbox id={listId} labelledBy={`${id}-label`} options={shown} selected={picked} active={active} onPick={pick} onHover={setActive} /> : null}
        </div>
      )}
    </Field>
  );
};
