"use client";

import hornbill from "@/assets/bio/helmeted-hornbill.jpg";
import turtle from "@/assets/bio/hawksbill-turtle.jpg";
import kbaMap from "@/assets/bio/kba-map.jpg";
import orangutan from "@/assets/bio/bornean-orangutan.jpg";
import crocodile from "@/assets/bio/siamese-crocodile.jpg";
import leopardSpot from "@/assets/bio/spotlight-leopard.jpg";
import orangutanSpot from "@/assets/bio/spotlight-orangutan.jpg";
import rhino from "@/assets/bio/sumatran-rhinoceros.jpg";
import pangolin from "@/assets/bio/sunda-pangolin.jpg";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { MdExpandMore } from "react-icons/md";
import { BN } from "../banyan/ui";
import { cn } from "../cn";
import { CountUp } from "../count-up";

/* Borneo Peatlands' biodiversity, rebuilt live from Evaluation 2.2's
 * screens: the species in the spotlight, the impact score against the rest
 * of the world, extinction risk, the region's threats, the critically
 * endangered species and the key biodiversity areas around the project.
 * Every figure is the screens' own (from IBAT's STAR data); the photos are
 * the ones the screens used. Pick a spotlight; point at a risk or a threat
 * to find it in its chart. */
const RISKS = [
  { label: "Critically endangered", share: 0.6, dot: "bg-[#f2605a]", stroke: "#f2605a" },
  { label: "Endangered", share: 2.3, dot: "bg-[#eda24f]", stroke: "#eda24f" },
  { label: "Vulnerable", share: 8.4, dot: "bg-[#f9d43c]", stroke: "#f9d43c" },
  { label: "Near threatened", share: 8.7, dot: "bg-[#a5e5b0]", stroke: "#a5e5b0" },
  { label: "Low concern", share: 74.4, dot: "bg-[#1db954]", stroke: "#1db954" },
];

// Literal classes for Tailwind: each threat's share of the bar, and a red
// that pales down the list.
const THREATS = [
  { label: "Logging & wood harvesting", share: "21.1%", grow: "grow-[21.1]", fill: "bg-[#f45b54]" },
  { label: "Annual & perennial non-timber crops", share: "21.1%", grow: "grow-[21.1]", fill: "bg-[#f56b64]" },
  { label: "Hunting & collecting terrestrial animals", share: "17.4%", grow: "grow-[17.4]", fill: "bg-[#f67c75]" },
  { label: "Fire & fire suppression", share: "5.9%", grow: "grow-[5.9]", fill: "bg-[#f78d87]" },
  { label: "Marine & freshwater aquaculture", share: "4.5%", grow: "grow-[4.5]", fill: "bg-[#f89d98]" },
  { label: "Housing & urban areas", share: "4.4%", grow: "grow-[4.4]", fill: "bg-[#f9aeaa]" },
  { label: "Agricultural & forestry effluents", share: "3.6%", grow: "grow-[3.6]", fill: "bg-[#fabebb]" },
  { label: "Wood & pulp plantations", share: "3.1%", grow: "grow-[3.1]", fill: "bg-[#fbcecc]" },
  { label: "Industrial & military effluents", share: "3.1%", grow: "grow-[3.1]", fill: "bg-[#fcdedd]" },
  { label: "Fishing & harvesting aquatic resources", share: "3%", grow: "grow-[3]", fill: "bg-[#fde9e8]" },
  { label: "Other", share: "12.3%", grow: "grow-[12.3]", fill: "bg-[#fef4f4]" },
];

const SPOTLIGHTS = [
  {
    name: "Bornean orangutan",
    latin: "Pongo pygmaeus",
    status: "Critically endangered",
    badge: "bg-[#f2605a]",
    photo: orangutanSpot,
    alt: "A Bornean orangutan mother, her baby clinging to her side",
    text: "Found only on Borneo, and heavily threatened by the destruction of its habitat, often for palm oil, and by hunting. The project's tree-nest surveys put its orangutans at 3,385.",
  },
  {
    name: "Bornean clouded leopard",
    latin: "Neofelis diardi",
    status: "Vulnerable",
    badge: "bg-[#f9d43c]",
    photo: leopardSpot,
    alt: "A clouded leopard lying along a thick branch",
    text: "A secretive hunter that needs dense forest to stalk its prey, so reclusive that its numbers are hard to estimate. The project's camera traps have caught clouded leopards at 6% of their locations: they still use the land.",
  },
];

const AT_RISK = [
  { name: "Helmeted hornbill", photo: hornbill },
  { name: "Sumatran rhinoceros", photo: rhino },
  { name: "Sunda pangolin", photo: pangolin },
  { name: "Bornean orangutan", photo: orangutan },
  { name: "Siamese crocodile", photo: crocodile },
  { name: "Hawksbill turtle", photo: turtle },
];

// The two questions the product kept under the score.
const QUESTIONS = [
  {
    ask: "Why does the impact score matter?",
    answer: "Carbon alone doesn't say what a forest is home to. Two projects can store the same carbon while one shelters species found nowhere else; the score shows a buyer which is which.",
  },
  {
    ask: "How is the impact score calculated?",
    answer: "From IBAT's STAR metric: for every threatened species, how much of its range falls inside the project and how much easing the threats there would lower its risk of extinction, added up and ranked against everywhere else on Earth.",
  },
];

const CARD = "rounded-[14px] bg-white/[0.04] p-5 ring-1 ring-white/10 sm:p-6";
const HEAD = "text-[18px] leading-6 font-bold";
const FOCUS = cn(BN.focus, "focus-visible:outline-white");
const rowLook = (on: boolean) => cn("flex w-full items-center gap-3 text-left transition-colors", on ? "bg-white/10" : "hover:bg-white/6", FOCUS);

/** A list that points into its chart: pressing a row (or hovering it)
 *  picks it, and dims every other part of the chart. */
const usePick = () => {
  const [on, setOn] = useState<number | null>(null);
  const row = (i: number) => ({
    "aria-pressed": on === i,
    onClick: () => setOn(on === i ? null : i),
    onMouseEnter: () => setOn(i),
    onMouseLeave: () => setOn(null),
  });
  const dim = (i: number) => on !== null && on !== i && "opacity-25";
  return { on, row, dim };
};

const Card = ({ title, className, children }: { title: string; className?: string; children: ReactNode }) => (
  <section data-reveal className={cn(CARD, className)}>
    <h5 className={HEAD}>{title}</h5>
    {children}
  </section>
);

// The donut's arcs, from the top clockwise. The shares leave out species
// with no assessment, so the ring is drawn across the five that have one.
const R = 46;
const TOTAL = RISKS.reduce((n, r) => n + r.share, 0);
const point = (a: number) => `${(60 + R * Math.sin(a)).toFixed(2)} ${(60 - R * Math.cos(a)).toFixed(2)}`;
const ARCS = RISKS.reduce<{ d: string; end: number }[]>((arcs, r) => {
  const start = arcs.length ? arcs[arcs.length - 1].end : 0;
  const end = start + (r.share / TOTAL) * Math.PI * 2;
  return [...arcs, { d: `M${point(start)} A${R} ${R} 0 ${end - start > Math.PI ? 1 : 0} 1 ${point(end)}`, end }];
}, []);

const Risks = () => {
  const { on, row, dim } = usePick();
  return (
    <Card title="Extinction risk" className="lg:col-span-6">
      <div className="mt-5 grid items-center gap-6 sm:grid-cols-[9rem_1fr]">
        <svg viewBox="0 0 120 120" aria-hidden className="mx-auto w-36">
          {ARCS.map((a, i) => (
            <g key={RISKS[i].label} className={cn("transition-opacity duration-300", dim(i))}>
              <path data-reveal="draw" pathLength={1} d={a.d} fill="none" stroke={RISKS[i].stroke} strokeWidth={on === i ? 18 : 13} />
            </g>
          ))}
        </svg>
        <ul className="grid gap-1">
          {RISKS.map((r, i) => (
            <li key={r.label}>
              <button type="button" {...row(i)} className={cn(rowLook(on === i), "rounded-[10px] px-3 py-2 text-[15px] leading-5")}>
                <span aria-hidden className={cn("h-4 w-1.5 shrink-0 rounded-full", r.dot)} />
                <span className="flex-1">{r.label}</span>
                <span className="font-bold tabular-nums">{r.share}%</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 border-t border-white/10 pt-5">
        <p className="flex items-baseline gap-3">
          <CountUp value={3025} className="font-display text-[40px] leading-none font-bold" />
          <span className="text-[14px] text-white/75">species recorded in the region</span>
        </p>
        <div aria-hidden className="mt-4 flex h-2.5 gap-1">
          <span data-reveal="grow-x" className="grow-[95] rounded-full bg-[#1db954]" />
          <span data-reveal="grow-x" className="grow-[5] rounded-full bg-white/80 [--reveal-delay:0.4s]" />
        </div>
        <p className="mt-2 flex justify-between text-[13px] text-white/75">
          <span>
            Animals <b className="text-white">95%</b>
          </span>
          <span>
            Plants <b className="text-white">5%</b>
          </span>
        </p>
      </div>
    </Card>
  );
};

const Threats = () => {
  const { on, row, dim } = usePick();
  return (
    <Card title="Regional threats" className="lg:col-span-6">
      <div className="mt-5 grid grid-cols-[2.5rem_1fr] gap-5">
        <div aria-hidden className="flex flex-col gap-0.5 overflow-hidden rounded-[10px]">
          {THREATS.map((t, i) => (
            <span key={t.label} className={cn("min-h-1 transition-opacity duration-300", t.grow, t.fill, dim(i))} />
          ))}
        </div>
        <ul className="grid gap-0.5">
          {THREATS.map((t, i) => (
            <li key={t.label}>
              <button type="button" {...row(i)} className={cn(rowLook(on === i), "rounded-[8px] px-2.5 py-1.5 text-[14px] leading-5")}>
                <span aria-hidden className={cn("h-3.5 w-1.5 shrink-0 rounded-full", t.fill)} />
                <span className="flex-1">{t.label}</span>
                <span className="font-bold tabular-nums">{t.share}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

const Spotlight = () => {
  const [pick, setPick] = useState(0);
  const s = SPOTLIGHTS[pick];
  return (
    <section data-reveal className={cn(CARD, "overflow-hidden p-0 sm:p-0 lg:col-span-7")}>
      <div className="relative aspect-[860/520] overflow-hidden">
        {SPOTLIGHTS.map((x, i) => (
          <Image
            key={x.name}
            src={x.photo}
            alt={i === pick ? x.alt : ""}
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className={cn("object-cover transition-opacity duration-500", i === pick ? "opacity-100" : "opacity-0")}
          />
        ))}
        <div role="group" aria-label="Species in the spotlight" className="absolute top-4 left-4 flex flex-wrap gap-1.5 rounded-full bg-black/55 p-1 backdrop-blur-sm">
          {SPOTLIGHTS.map((x, i) => (
            <button
              key={x.name}
              type="button"
              aria-pressed={pick === i}
              onClick={() => setPick(i)}
              className={cn("rounded-full px-3.5 py-1.5 text-[13px] leading-4 font-bold transition-colors", pick === i ? "bg-white text-bn-heavy" : "text-white hover:bg-white/15", FOCUS)}
            >
              {x.name}
            </button>
          ))}
        </div>
      </div>
      <div key={s.name} aria-live="polite" className="p-5 motion-safe:animate-[arrive_0.5s_var(--ease-arrive)_both] sm:p-6">
        <span className={cn("inline-block rounded-full px-2.5 py-1 text-[12px] leading-4 font-bold tracking-[0.04em] text-bn-heavy uppercase", s.badge)}>{s.status}</span>
        <p className="mt-3 font-display text-[36px] leading-none font-bold">{s.name}</p>
        <p className="mt-1 text-[15px] text-white/70 italic">{s.latin}</p>
        <p className="mt-3 max-w-[34rem] text-[15px] leading-6 text-white/85">{s.text}</p>
      </div>
    </section>
  );
};

const Score = () => (
  <section data-reveal className={cn(CARD, "flex flex-col lg:col-span-5")}>
    <h5 className={HEAD}>Biodiversity conservation impact</h5>
    <p className="mt-6 font-display leading-none font-bold">
      <CountUp value={95} className="text-[96px]" />
      <span className="text-[44px]">th</span>
    </p>
    <p className="mt-2 text-[15px] text-white/75">percentile, worldwide</p>
    <div className="mt-8">
      <div className="relative h-3 rounded-full bg-linear-to-r from-[#e6e33a] via-[#1f9e6e] to-[#3b3486]">
        <span data-run aria-hidden className="absolute top-1/2 left-[95%] size-6 -translate-1/2 rounded-full border-[3px] border-white bg-[#1f9e6e] shadow-[0_2px_10px_rgb(0_0_0/0.5)]" />
      </div>
      <p aria-hidden className="mt-3 flex justify-between text-[11px] leading-4 font-bold tracking-[0.08em] text-white/60 uppercase">
        <span>Very low</span>
        <span>Medium</span>
        <span>Very high</span>
      </p>
    </div>
    <p className="mt-6 text-[14px] leading-6 text-white/80">The land ranks among the most critical conservation areas in the world, with a real chance to cut species&apos; risk of extinction.</p>
    <div className="mt-auto divide-y divide-white/10 border-y border-white/10">
      {QUESTIONS.map((q) => (
        <details key={q.ask} className="group py-1">
          <summary className={cn("flex cursor-pointer list-none items-center justify-between gap-4 rounded-[8px] py-3 text-[15px] leading-5 font-bold [&::-webkit-details-marker]:hidden", FOCUS)}>
            {q.ask}
            <MdExpandMore aria-hidden className="size-5 shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <p className="pb-4 text-[14px] leading-6 text-white/80">{q.answer}</p>
        </details>
      ))}
    </div>
    <p className="mt-4 text-[13px] leading-5 text-white/60">Source: IBAT, STAR</p>
  </section>
);

const AtRisk = () => (
  <Card title="Critically endangered, in the region" className="lg:col-span-7">
    <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {AT_RISK.map((a) => (
        <li key={a.name}>
          <span className="group block overflow-hidden rounded-[10px]">
            <Image src={a.photo} alt="" sizes="(min-width: 1024px) 220px, 45vw" className="aspect-[444/260] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
          </span>
          <span className="mt-2 block text-[14px] leading-5">{a.name}</span>
        </li>
      ))}
    </ul>
  </Card>
);

const Areas = () => (
  <section data-reveal className={cn(CARD, "relative min-h-[22rem] overflow-hidden p-0 sm:p-0 lg:col-span-5")}>
    <Image src={kbaMap} alt="Borneo Peatlands on a satellite map: the project's outline in white, key biodiversity areas in green and protected areas in teal around it, along the coast" fill sizes="(min-width: 1024px) 520px, 100vw" className="object-cover object-left" />
    <h5 className={cn(HEAD, "absolute bottom-4 left-4 rounded-[10px] bg-black/60 px-3 py-2 backdrop-blur-sm")}>Key biodiversity areas around it</h5>
  </section>
);

export const Biodiversity = ({ className }: { className?: string }) => (
  <div className={cn("rounded-[16px] bg-[#0b1610] p-4 text-white sm:p-6", className)}>
    <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 px-1 pb-6 sm:px-2">
      <div>
        <p className="flex items-center gap-2 text-[13px] leading-4">
          <svg viewBox="0 0 24 24" aria-hidden className="size-5 rounded-full">
            <rect width="24" height="12" fill="#e70011" />
            <rect y="12" width="24" height="12" fill="#ffffff" />
          </svg>
          <span className="font-bold">Indonesia</span>
          <span aria-hidden className="h-3 w-px bg-white/40" />
          149,800 ha
        </p>
        <h4 className="mt-3 font-display text-[44px] leading-none font-bold sm:text-[56px]">Borneo Peatlands</h4>
        <p className="mt-4 flex flex-wrap gap-2 text-[12px] leading-4 font-bold tracking-[0.06em] uppercase">
          <span className="rounded-full bg-white/12 px-3 py-1.5">Verra</span>
          <span className="rounded-full bg-white/12 px-3 py-1.5">Avoided planned deforestation</span>
        </p>
      </div>
      <p className="max-w-[24rem] text-[15px] leading-6 text-white/80">Protecting the largest remaining peat swamp forest, home to some of the world&apos;s most endangered species.</p>
    </header>
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-12">
      <Spotlight />
      <Score />
      <Risks />
      <Threats />
      <AtRisk />
      <Areas />
    </div>
  </div>
);
