"use client";

import { useId, useState } from "react";
import { MdArrowDropDown, MdArrowDropUp, MdClose, MdCode, MdMenu, MdOutlineVerifiedUser, MdSensors } from "react-icons/md";
import { cn } from "../../cn";
import { Button } from "../button";
import { BN } from "../ui";

/* The website's top bar, working: Solutions opens its three ways in, and
 * below 1180px of room the bar folds into the menu button. Glass over the
 * page. Copy from the Figma; "Our tech" had no submenu drawn, so it's a link. */
const SOLUTIONS = [
  { title: "Our evaluation process", text: "How we measure forests", Icon: MdSensors },
  { title: "Our marketplace", text: "Offset on behalf of your organization", Icon: MdOutlineVerifiedUser },
  { title: "Our API", text: "Plug Pachama into your website or app", Icon: MdCode },
];
const LINKS = ["About us", "Our tech", "Solutions", "Pachama Originals", "Projects", "Insights", "Careers"];

const LINK = cn("flex items-center gap-1 rounded-[4px] text-[16px] leading-6 text-bn-heavy hover:underline", BN.focus);

const SolutionList = ({ id, className }: { id: string; className?: string }) => (
  <ul id={id} className={cn("grid gap-4", className)}>
    {SOLUTIONS.map(({ title, text, Icon }) => (
      <li key={title}>
        <a href="#patterns" className={cn("flex items-center gap-4 rounded-[12px] p-1 hover:bg-bn-green-lightest", BN.focus)}>
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-bn-glass-2/30">
            <Icon aria-hidden className="size-6 text-bn-heavy" />
          </span>
          <span>
            <span className="block text-[16px] leading-6 text-bn-heavy">{title}</span>
            <span className="block text-[12px] leading-4 font-medium text-bn-medium">{text}</span>
          </span>
        </a>
      </li>
    ))}
  </ul>
);

const Item = ({ label, open, onToggle, panelId }: { label: string; open: boolean; onToggle: () => void; panelId: string }) =>
  label === "Solutions" ? (
    <button type="button" aria-expanded={open} aria-controls={panelId} onClick={onToggle} className={LINK}>
      {label}
      {open ? <MdArrowDropUp aria-hidden className="size-4" /> : <MdArrowDropDown aria-hidden className="size-4" />}
    </button>
  ) : (
    <a href="#patterns" className={LINK}>
      {label}
      {label === "Careers" ? <span className="rounded-full bg-bn-green px-2 py-0.5 text-[12px] leading-4 font-bold">15</span> : null}
    </a>
  );

export const TopNav = ({ className }: { className?: string }) => {
  const [solutions, setSolutions] = useState(false);
  const [menu, setMenu] = useState(false);
  const ids = useId();

  return (
    <div className={cn("@container w-full", className)}>
      <header
        className="bg-bn-glass-2/60 backdrop-blur-[80px]"
        onKeyDown={(e) => e.key === "Escape" && setSolutions(false)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setSolutions(false)}
      >
        <div className="flex items-center gap-4 px-6 py-4 @min-[1180px]:h-20 @min-[1180px]:py-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- the brand's own SVG */}
          <img src="/brand/logo-light.svg" alt="Pachama" className="hidden h-8 w-auto @min-[1180px]:block" />
          {/* eslint-disable-next-line @next/next/no-img-element -- the brand's own SVG */}
          <img src="/brand/symbol-dark.svg" alt="Pachama" className="h-8 w-auto @min-[1180px]:hidden" />
          <nav aria-label="Website" className="hidden flex-1 justify-center @min-[1180px]:flex">
            <ul className="flex items-center gap-6">
              {LINKS.map((label) => (
                <li key={label} className="relative">
                  <Item label={label} open={solutions} onToggle={() => setSolutions((o) => !o)} panelId={`${ids}desk`} />
                  {label === "Solutions" && solutions ? (
                    <SolutionList id={`${ids}desk`} className="absolute top-10 left-0 z-10 w-[360px] rounded-[16px] border border-bn-grey-light bg-white p-4 shadow-[0_8px_24px_rgb(14_37_23/0.12)]" />
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <a href="#patterns" className={cn(LINK, "font-medium")}>
              Sign in
            </a>
            <Button size="sm" className="@min-[1180px]:hidden">
              Support now
            </Button>
            <Button className="hidden @min-[1180px]:inline-flex">Support now</Button>
            <button type="button" aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} aria-controls={`${ids}menu`} onClick={() => setMenu((m) => !m)} className={cn("grid size-8 place-items-center rounded-[8px] text-bn-heavy @min-[1180px]:hidden", BN.focus)}>
              {menu ? <MdClose aria-hidden className="size-6" /> : <MdMenu aria-hidden className="size-6" />}
            </button>
          </div>
        </div>
        <nav id={`${ids}menu`} aria-label="Website" hidden={!menu} className="px-6 pb-6 @min-[1180px]:hidden">
          <ul className="grid gap-8">
            {LINKS.map((label) => (
              <li key={label}>
                <Item label={label} open={solutions} onToggle={() => setSolutions((o) => !o)} panelId={`${ids}mob`} />
                {label === "Solutions" && solutions ? <SolutionList id={`${ids}mob`} className="mt-4" /> : null}
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </div>
  );
};
