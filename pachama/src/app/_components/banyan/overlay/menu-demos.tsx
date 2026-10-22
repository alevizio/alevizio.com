"use client";

import { useId, useState, type ReactNode } from "react";
import { MdArrowDropDown, MdLogout, MdReceiptLong, MdSettings, MdShoppingBag } from "react-icons/md";
import { cn } from "../../cn";
import { BN } from "../ui";
import { GLASS } from "./glass";
import { MenuButton, MenuCheck, type MenuItem } from "./menu";

/* The menus, live: one pick, several picks, and the account menu. The
 * countries are the template's; the account is a sample. */
const COUNTRIES: MenuItem[] = ["Indonesia", "Brazil", "Costa Rica", "Uruguay"].map((c) => ({ id: c, label: c }));

const FIELD = cn(
  "flex h-12 w-62 max-w-full items-center gap-2 rounded-xl border border-bn-medium bg-white/40 pr-2 pl-4 text-left text-[16px] text-bn-heavy aria-expanded:ring-1 aria-expanded:ring-bn-heavy",
  BN.focus,
);

const Field = ({ value, placeholder }: { value: string; placeholder: string }) => (
  <>
    <span className={cn("min-w-0 flex-1 truncate", !value && "text-bn-medium")}>{value || placeholder}</span>
    <MdArrowDropDown aria-hidden className="size-6 shrink-0" />
  </>
);

export const SingleSelectMenu = () => {
  const [pick, setPick] = useState("");
  const label = useId();
  return (
    <div>
      <span id={label} className="mb-1 block text-[12px] leading-4 text-bn-heavy">
        Country
      </span>
      <MenuButton kind="radio" items={COUNTRIES} selected={[pick]} onSelect={setPick} labelledBy={label} triggerClassName={FIELD} trigger={<Field value={pick} placeholder="Select a country" />} />
    </div>
  );
};

export const MultiSelectMenu = () => {
  const [picks, setPicks] = useState(["Brazil"]);
  const label = useId();
  const toggle = (id: string) => setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return (
    <div>
      <span id={label} className="mb-1 block text-[12px] leading-4 text-bn-heavy">
        Countries
      </span>
      <MenuButton kind="checkbox" items={COUNTRIES} selected={picks} onSelect={toggle} labelledBy={label} triggerClassName={FIELD} trigger={<Field value={picks.join(", ")} placeholder="Select countries" />} />
    </div>
  );
};

const ACCOUNT: MenuItem[] = [
  { id: "Orders", label: "Orders", icon: <MdShoppingBag aria-hidden className="size-6" /> },
  { id: "Billing", label: "Billing", icon: <MdReceiptLong aria-hidden className="size-6" /> },
  { id: "Settings", label: "Settings", icon: <MdSettings aria-hidden className="size-6" /> },
  { id: "Log out", label: "Log out", icon: <MdLogout aria-hidden className="size-6" /> },
];

export const AccountMenu = () => {
  const [last, setLast] = useState("");
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-[12px] leading-4 text-bn-heavy">Account</span>
      <MenuButton
        kind="action"
        items={ACCOUNT}
        onSelect={setLast}
        triggerLabel="Acme Co. account"
        triggerClassName={cn("grid size-12 place-items-center rounded-full bg-bn-heavy text-[15px] font-medium text-white", BN.focus)}
        trigger="Ac"
        header={
          <div className="flex items-center gap-4 border-b border-bn-line p-4">
            <span aria-hidden className="grid size-8 place-items-center rounded-[8px] bg-bn-heavy text-[13px] font-medium text-white">
              Ac
            </span>
            <span className="text-[16px] leading-6 text-bn-heavy">
              Acme Co.
              <span className="block text-[14px] leading-5 text-bn-medium">Business account</span>
            </span>
          </div>
        }
      />
      <p aria-live="polite" className="h-5 text-[14px] leading-5 text-bn-medium">
        {last ? `Chose: ${last}` : ""}
      </p>
    </div>
  );
};

/* The item kinds, open and still, as the templates show them. */
const List = ({ children }: { children: ReactNode }) => <ul className={cn("w-62 overflow-hidden rounded-2xl text-[16px] leading-6 text-bn-heavy", GLASS)}>{children}</ul>;

const DOT = { Paid: "bg-bn-green", Pending: "bg-bn-yellow" } as const;
const BADGE = { Received: "bg-bn-green px-2", "PO sent": "bg-bn-yellow px-2", Outstanding: "" } as const;

export const MenuTemplates = () => (
  <>
    <List>
      {[
        ["Buy credits", "From any project on the marketplace"],
        ["Retire credits", "On your company's behalf"],
        ["Download the report", "Evaluation 2.0, as a PDF"],
      ].map(([t, d]) => (
        <li key={t} className="p-4">
          {t}
          <span className="block text-[14px] leading-5 text-bn-medium">{d}</span>
        </li>
      ))}
    </List>
    <List>
      {[
        ["REDD+", "Manoa"],
        ["Reforestation", "Corredores de Vida"],
      ].map(([g, p], i) => (
        <li key={g} className={cn(i > 0 && "border-t border-bn-line")}>
          <span className="block px-4 pt-4 pb-2 text-[12px] leading-4 font-medium uppercase">{g}</span>
          <span className="block p-4">{p}</span>
        </li>
      ))}
    </List>
    <List>
      {(Object.keys(DOT) as (keyof typeof DOT)[]).map((s) => (
        <li key={s} className="flex items-center gap-4 p-4">
          <MenuCheck checked={false} />
          <span aria-hidden className={cn("size-2 rounded-full", DOT[s])} />
          {s}
        </li>
      ))}
    </List>
    <List>
      {(Object.keys(BADGE) as (keyof typeof BADGE)[]).map((b) => (
        <li key={b} className="flex items-center gap-4 p-4">
          <MenuCheck checked={false} />
          <span className={cn("rounded-full py-0.5 font-mono text-[11px] leading-4 font-medium uppercase", BADGE[b])}>{b}</span>
        </li>
      ))}
    </List>
  </>
);
