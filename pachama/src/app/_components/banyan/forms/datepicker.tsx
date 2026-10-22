"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { MdCalendarToday } from "react-icons/md";
import { cn } from "../../cn";
import { useDismiss } from "../overlay/use-dismiss";
import { Calendar } from "./calendar";
import { IconButton } from "./icon-button";
import { TextInput } from "./input";

/* Banyan's Datepicker, as the Figma's flow draws it: a field that takes
 * MM/dd/yyyy, the calendar button inside it, and the calendar under the
 * field in a dialog. Escape or a press outside closes it. */
const pad = (n: number) => String(n).padStart(2, "0");
const format = (d: Date) => `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
const parse = (s: string) => {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s.trim());
  if (!m) return null;
  const d = new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));
  return d.getMonth() === Number(m[1]) - 1 ? d : null;
};

// Today, read on the client only: the page is built ahead of time.
const never = () => () => {};
const useToday = () => {
  const key = useSyncExternalStore(never, () => new Date().toDateString(), () => "");
  return key ? new Date(key) : null;
};

export const DatePicker = ({ label = "Planting date", className }: { label?: string; className?: string }) => {
  const [value, setValue] = useState<Date | null>(null);
  const [text, setText] = useState("");
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const today = useToday();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root, button, close);

  const pick = (d: Date) => {
    setValue(d);
    setText(format(d));
    setTouched(false);
    setOpen(false);
    button.current?.focus();
  };
  const bad = touched && text !== "" && !parse(text);

  return (
    <div ref={root} className={cn("relative w-full max-w-[19rem]", className)}>
      <TextInput
        label={label}
        placeholder="MM/dd/yyyy"
        inputMode="numeric"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setValue(parse(e.target.value));
        }}
        onBlur={() => setTouched(true)}
        tone={bad ? "error" : "default"}
        message={bad ? "Write it as MM/dd/yyyy, like 10/10/2021." : undefined}
        trailing={
          <IconButton
            ref={button}
            label={open ? "Close the calendar" : "Choose a date"}
            look="tertiary"
            size="sm"
            icon={<MdCalendarToday aria-hidden />}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          />
        }
      />
      {open ? (
        <div role="dialog" aria-label="Choose a date" className="absolute top-full left-0 z-20 mt-2">
          <Calendar value={value} onChange={pick} today={today} start={value ?? today ?? new Date()} autoFocus />
        </div>
      ) : null}
    </div>
  );
};

/** The Figma's first example, live: October 2021, with the 8th as today. */
export const CalendarExample = () => {
  const [value, setValue] = useState<Date | null>(null);
  const day = new Date(2021, 9, 8);
  return <Calendar value={value} onChange={setValue} today={day} start={day} />;
};
