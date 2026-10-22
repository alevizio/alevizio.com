import type { ReactNode } from "react";
import { MdCheck } from "react-icons/md";
import { cn } from "../../cn";

/* The list a Select or an Autocomplete opens: Banyan draws it in glass over
 * eggshell; floating over the page it needs to be solid, so grey-lightest
 * with a hairline and a soft shadow. */
export type Option = { value: string; label: string; subtitle?: string; icon?: ReactNode };

export const Listbox = ({
  id,
  labelledBy,
  options,
  selected,
  active,
  onPick,
  onHover,
  empty = "No matches",
}: {
  id: string;
  labelledBy: string;
  options: Option[];
  selected?: string;
  active: number;
  onPick: (option: Option) => void;
  onHover: (index: number) => void;
  empty?: string;
}) => (
  <ul
    id={id}
    role="listbox"
    aria-labelledby={labelledBy}
    // Keep focus in the field while the pointer picks.
    onMouseDown={(e) => e.preventDefault()}
    className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-auto rounded-2xl border border-bn-grey-light bg-bn-grey-lightest py-2 shadow-[0_12px_32px_rgb(14_37_23/0.12)]"
  >
    {options.length === 0 ? <li className="px-4 py-3 text-base text-bn-medium">{empty}</li> : null}
    {options.map((option, i) => (
      <li
        key={option.value}
        id={`${id}-${i}`}
        role="option"
        aria-selected={option.value === selected}
        onClick={() => onPick(option)}
        onMouseMove={() => onHover(i)}
        className={cn("flex cursor-pointer items-center gap-3 px-4 py-3 text-base leading-6 text-bn-heavy", i === active && "bg-bn-glass-2")}
      >
        {option.icon}
        <span className="min-w-0 flex-1">
          <span className={cn("block truncate", option.value === selected && "font-medium")}>{option.label}</span>
          {option.subtitle ? <span className="block text-xs leading-4 text-bn-medium">{option.subtitle}</span> : null}
        </span>
        {option.value === selected ? <MdCheck aria-hidden className="size-5 shrink-0" /> : null}
      </li>
    ))}
  </ul>
);
