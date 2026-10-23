"use client";

import { useId, useState } from "react";
import { MARKS } from "./brand-marks";
import { cn } from "./cn";
import { PAGE } from "./story";

/* The marks, live: each lockup on each ground in the colours the brand
 * guidelines allow, with the specs underneath. It replaces the sheets
 * from the Brand & Symbol Figma, which showed the same thing as six
 * exports. Grounds: eggshell, pine, lidar green. */
type Mark = keyof typeof MARKS;
type Ground = "light" | "dark" | "green";
type Ink = "gradient" | "pine" | "green" | "white";

const MARK_LABEL: Record<Mark, string> = { symbol: "Symbol", logo: "Logo", originals: "Originals", plus: "Plus" };
const GROUND: Record<Ground, { label: string; bg: string; text: string }> = {
  light: { label: "Eggshell", bg: "bg-[#fdfbf1]", text: "text-[#0e2517]" },
  dark: { label: "Pine", bg: "bg-[#0e2517]", text: "text-white" },
  green: { label: "Lidar green", bg: "bg-[#81f18e]", text: "text-[#0e2517]" },
};
const INK: Record<Ink, { label: string; specs: string[] }> = {
  gradient: { label: "Two colours", specs: ["Green saturated #52F164 · R82 G241 B100", "to Blue saturated #52D5FF · R82 G213 B255", "at 45°"] },
  pine: { label: "Dark green", specs: ["#0E2517 · R14 G37 B23", "C87 M58 Y78 K78"] },
  green: { label: "Green", specs: ["#81F18E · R129 G241 B142", "C50 M0 Y61 K0"] },
  white: { label: "White", specs: ["#FFFFFF · R255 G255 B255"] },
};

/** What each ground allows. Originals and Plus have no two-colour version on pine. */
const allowed = (mark: Mark, ground: Ground): Ink[] =>
  ground === "light" ? ["gradient", "pine"] : ground === "green" ? ["pine"] : mark === "symbol" || mark === "logo" ? ["gradient", "green", "white"] : ["green", "white"];

const FILL: Record<Exclude<Ink, "gradient">, string> = { pine: "#0e2517", green: "#81f18e", white: "#ffffff" };

const Lockup = ({ mark, ground, ink }: { mark: Mark; ground: Ground; ink: Ink }) => {
  const id = useId();
  const { viewBox, symbol, word } = MARKS[mark];
  const symbolFill = ink === "gradient" ? `url(#${id})` : FILL[ink];
  // In two colours the wordmark is pine on eggshell and white on pine.
  const wordFill = ink === "gradient" ? (ground === "dark" ? "#ffffff" : "#0e2517") : FILL[ink];
  return (
    <svg viewBox={viewBox} role="img" aria-label={`Pachama ${MARK_LABEL[mark]}`} className={cn("h-auto", mark === "symbol" ? "w-28 sm:w-36" : "w-[min(30rem,80%)]")}>
      <defs>
        <linearGradient id={id} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#52f164" />
          <stop offset="1" stopColor="#52d5ff" />
        </linearGradient>
      </defs>
      <path d={symbol} fill={symbolFill} className="origin-[15%_50%] [transform-box:fill-box] motion-safe:animate-[mark-turn_1.1s_var(--ease-arrive)_both]" />
      {word.map((d) => (
        <path key={d.slice(0, 24)} d={d} fill={wordFill} />
      ))}
    </svg>
  );
};

const Segmented = <T extends string>({
  label,
  value,
  options,
  onChange,
  names,
  light,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  names: Record<T, string>;
  /** On eggshell or lidar green the controls turn pine. */
  light: boolean;
}) => (
  <div role="group" aria-label={label} className={cn("flex flex-wrap gap-1 rounded-full p-1 backdrop-blur-md", light ? "bg-[#0e2517]/8" : "bg-black/25")}>
    {options.map((o) => (
      <button
        key={o}
        type="button"
        aria-pressed={value === o}
        onClick={() => onChange(o)}
        className={cn(
          "rounded-full px-3.5 py-1.5 text-[13px] leading-5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
          light ? "focus-visible:outline-[#0e2517]" : "focus-visible:outline-white",
          value === o ? (light ? "bg-[#0e2517] text-white" : "bg-white text-[#0e2517]") : light ? "text-[#0e2517] hover:bg-[#0e2517]/10" : "text-white hover:bg-white/15",
        )}
      >
        {names[o]}
      </button>
    ))}
  </div>
);

export const MarkExplorer = ({ className }: { className?: string }) => {
  const [mark, setMark] = useState<Mark>("logo");
  const [ground, setGround] = useState<Ground>("dark");
  const [ink, setInk] = useState<Ink>("gradient");
  const inks = allowed(mark, ground);
  const current = inks.includes(ink) ? ink : inks[0];
  const g = GROUND[ground];

  return (
    <figure className={className}>
      <div className={cn("relative grid min-h-[30rem] place-items-center overflow-hidden transition-colors duration-700 sm:min-h-[36rem]", g.bg)}>
        <div className="absolute inset-x-4 top-4 z-10 flex flex-wrap gap-2 sm:inset-x-6 sm:top-6">
          <Segmented label="Mark" value={mark} options={["symbol", "logo", "originals", "plus"] as const} onChange={setMark} names={MARK_LABEL} light={ground !== "dark"} />
          <Segmented label="Ground" value={ground} options={["light", "dark", "green"] as const} onChange={setGround} names={{ light: GROUND.light.label, dark: GROUND.dark.label, green: GROUND.green.label }} light={ground !== "dark"} />
          <Segmented label="Colour" value={current} options={inks} onChange={setInk} names={{ gradient: INK.gradient.label, pine: INK.pine.label, green: INK.green.label, white: INK.white.label }} light={ground !== "dark"} />
        </div>
        <div key={`${mark}-${ground}-${current}`} className="grid w-full place-items-center px-6 pt-24 pb-28 motion-safe:animate-[arrive_0.6s_var(--ease-arrive)_both]">
          <Lockup mark={mark} ground={ground} ink={current} />
        </div>
        <dl aria-live="polite" className={cn("absolute inset-x-4 bottom-4 grid gap-0.5 font-mono text-[11px] leading-4 tracking-[0.04em] sm:inset-x-6 sm:bottom-6", g.text)}>
          <dt className="font-bold uppercase">
            {INK[current].label} on {g.label.toLowerCase()}
          </dt>
          {INK[current].specs.map((s) => (
            <dd key={s} className="opacity-80">
              {s}
            </dd>
          ))}
        </dl>
      </div>
      <figcaption className={cn(PAGE, "type-caption mt-3 text-(--tone-text)")}>
        Every lockup on every ground it&rsquo;s allowed on. The symbol is &lsquo;our beloved mandala that represents earth&rsquo;s mother, the pachamama&rsquo;.
      </figcaption>
    </figure>
  );
};
