"use client";

import { ArrowLeft, ChevronDown, ChevronsUpDown, ClipboardList, Globe, Leaf, ScanSearch, Settings } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "../cn";
import { KitButton } from "./buttons";
import { QualityChips } from "./chips";
import { UI } from "./ui";

/* The product's frame, working: the top bar, the side nav with the account
 * switcher, and a project page's tabs. Click around. */
const NAV = [
  { label: "Explore", Icon: ScanSearch },
  { label: "Orders", Icon: ClipboardList },
  { label: "Retirement", Icon: Leaf },
  { label: "Impact", Icon: Globe, more: true },
  { label: "Account settings", Icon: Settings, more: true },
];

// A tab with no text shows the evaluation's five standards.
const TABS = [
  { name: "Dashboard", text: "Credits bought, retired and still to come, by project and by year." },
  { name: "Evaluation", text: null },
  { name: "Carbon monitoring", text: "Canopy height and forest cover, measured every year since the project began." },
];

const META = ["Brazil", "74,039 hectares", "REDD+ avoided planned deforestation", "Verified Carbon Standard"];

export const AppShell = () => {
  const [page, setPage] = useState("Explore");
  const [tab, setTab] = useState(1);
  const ids = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // The tabs pattern: arrows move between tabs, Tab moves into the panel.
  const onTabKey = (e: KeyboardEvent, i: number) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    const next = (i + step + TABS.length) % TABS.length;
    setTab(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className={cn(UI.card, "overflow-hidden")}>
      <header className="flex items-center justify-between border-b border-[#e3e6e4] px-5 py-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- the brand's own SVG */}
        <img src="/brand/logo-light.svg" alt="Pachama" className="h-6 w-auto" />
        <div className="flex items-center gap-3">
          <KitButton size="sm">Buy now</KitButton>
          <span aria-hidden className="grid size-8 place-items-center rounded-full bg-[#1d2422] text-[12px] font-medium text-white">
            AV
          </span>
        </div>
      </header>

      <div className="grid md:grid-cols-[15rem_1fr]">
        <nav aria-label="Product" className="border-b border-[#e3e6e4] p-3 md:border-b-0 md:border-r">
          <div className="mb-3 flex items-center gap-3 rounded-[8px] border border-[#e3e6e4] p-2.5">
            <span className="grid size-9 place-items-center rounded-[8px] bg-[#1d2422] text-[13px] font-medium text-white">Ac</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-medium text-[#141a17]">Acme Co.</span>
              <span className="block text-[12px] text-[#5f6b66]">Business account</span>
            </span>
            <ChevronsUpDown aria-hidden className="size-4 text-[#5f6b66]" />
          </div>
          <ul className="grid gap-0.5">
            {NAV.map(({ label, Icon, more }) => (
              <li key={label}>
                <button
                  type="button"
                  aria-current={page === label ? "page" : undefined}
                  onClick={() => setPage(label)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-left text-[14px] text-[#141a17] transition-colors",
                    UI.focus,
                    page === label ? "bg-[#eef1ef] font-medium" : "hover:bg-[#f5f6f8]",
                  )}
                >
                  <Icon aria-hidden className="size-[18px]" /> {label}
                  {more ? <ChevronDown aria-hidden className="ml-auto size-4 text-[#5f6b66]" /> : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={cn(UI.canvas, "p-5 sm:p-7")}>
          <a href="#navigation" className={cn("inline-flex items-center gap-2 text-[14px] text-[#141a17]", UI.focus)}>
            <ArrowLeft aria-hidden className="size-4" /> Back to my projects
          </a>
          <h4 className="mt-4 text-[34px] font-medium leading-none tracking-[-0.02em] text-[#141a17]">Manoa</h4>
          {/* Every item has a rule on its left; the list sits 13px (rule and
            * padding) to the left so the clip hides the rule that starts each
            * line, however the items wrap. */}
          <div className="mt-3 overflow-hidden">
            <p className="-ml-[13px] flex flex-wrap gap-y-1 text-[13px] text-[#3c4742]">
              {META.map((m) => (
                <span key={m} className="border-l border-[#cfd5d2] px-3">
                  {m}
                </span>
              ))}
            </p>
          </div>
          <div role="tablist" aria-label="Project" className="mt-6 flex gap-5 overflow-x-auto border-b border-[#cfd5d2] sm:gap-6">
            {TABS.map(({ name }, i) => (
              <button
                key={name}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`${ids}tab${i}`}
                type="button"
                role="tab"
                aria-selected={tab === i}
                aria-controls={`${ids}panel`}
                tabIndex={tab === i ? 0 : -1}
                onClick={() => setTab(i)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={cn(
                  "shrink-0 whitespace-nowrap pb-3 text-[14px] transition-colors",
                  UI.focus,
                  tab === i ? "text-[#141a17] shadow-[inset_0_-2px_0_#141a17]" : "text-[#5f6b66] hover:text-[#141a17]",
                )}
              >
                {name}
              </button>
            ))}
          </div>
          <div id={`${ids}panel`} role="tabpanel" aria-labelledby={`${ids}tab${tab}`} className="mt-5 min-h-16">
            {TABS[tab].text ? <p className="max-w-md text-[14px] text-[#3c4742]">{TABS[tab].text}</p> : <QualityChips />}
          </div>
        </div>
      </div>
    </div>
  );
};
