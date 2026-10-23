"use client";

import base from "@/assets/screens/land-suitability.jpg";
import Image from "next/image";
import { useState } from "react";
import { MdAdd, MdArrowForward, MdCheck, MdInfoOutline, MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { BN } from "../banyan/ui";
import { cn } from "../cn";

/* Land suitability, live: the step of a Source submission where the
 * developer shares the project's land and sees, against satellite data,
 * how much of it qualifies and why the rest doesn't, then adds context for
 * the buyer. Rebuilt from the Source Figma. The map is the live product's
 * for three parcels, split into its classes so each can be turned off and
 * on; the figures are the product's for those parcels. Calculate results,
 * on the first tab, paints the classes back in. */
type Id = "suitable" | "burn" | "unsuitable" | "deforestation";
const CLASSES: { id: Id; label: string; ha: number; swatch: string; layer: string; group: 0 | 1 }[] = [
  { id: "suitable", label: "Suitable land classification", ha: 12531, swatch: "bg-[#7cc9d6]", layer: "bg-[#7cc9d6] [mask-image:url(/screens/land/suitable.png)]", group: 0 },
  { id: "burn", label: "Burn area", ha: 34, swatch: "bg-[#6b8cff]", layer: "bg-[#6b8cff] [mask-image:url(/screens/land/burn.png)]", group: 0 },
  { id: "unsuitable", label: "Unsuitable land classification", ha: 23130, swatch: "bg-[#ef9564]", layer: "bg-[#ef9564] [mask-image:url(/screens/land/unsuitable.png)]", group: 1 },
  { id: "deforestation", label: "Non-burn deforestation", ha: 296, swatch: "bg-[#ee88ff]", layer: "bg-[#ee88ff] [mask-image:url(/screens/land/deforestation.png)]", group: 1 },
];
const GROUPS = [
  { label: "Suitable land", ha: 12776 },
  { label: "Unsuitable land", ha: 23520 },
];
const SUITABLE = Math.round((GROUPS[0].ha / (GROUPS[0].ha + GROUPS[1].ha)) * 100);
const ALL_ON: Record<Id, boolean> = { suitable: true, burn: true, unsuitable: true, deforestation: true };
const ha = (n: number) => `${n.toLocaleString("en-US")} ha`;
const TAB = "relative pb-3 text-[15px] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5";
const FOCUS = cn(BN.focus, "focus-visible:outline-white");

const Eye = ({ on, label, onToggle }: { on: boolean; label: string; onToggle: () => void }) => (
  <button type="button" aria-pressed={on} aria-label={`Show ${label} on the map`} onClick={onToggle} className={cn("grid size-7 place-items-center rounded-full hover:bg-white/10", FOCUS)}>
    {on ? <MdOutlineVisibility aria-hidden className="size-[18px]" /> : <MdOutlineVisibilityOff aria-hidden className="size-[18px] opacity-60" />}
  </button>
);

export const LandSuitability = ({ className }: { className?: string }) => {
  const [tab, setTab] = useState<"upload" | "results">("results");
  const [shown, setShown] = useState(ALL_ON);
  // Each calculation paints the classes in again.
  const [run, setRun] = useState(0);
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(false);
  const results = tab === "results";
  const toggle = (ids: Id[]) => setShown((s) => {
    const on = !ids.every((id) => s[id]);
    return { ...s, ...Object.fromEntries(ids.map((id) => [id, on])) };
  });

  return (
    <div className={cn("overflow-hidden rounded-[16px] bg-[#4f5440] text-white ring-1 ring-black/10 lg:grid lg:grid-cols-[24rem_minmax(0,1fr)]", className)}>
      <div className="relative aspect-[1447/1158] bg-[#1d2419] lg:order-last lg:aspect-auto lg:min-h-[36rem]">
        <Image src={base} alt="" fill sizes="(min-width: 1376px) 912px, (min-width: 1024px) 66vw, 100vw" placeholder="blur" className="object-cover" />
        {/* The classes scan in from the left when they're reached, and again with each calculation. */}
        <div key={run} data-reveal="sweep" role="img" aria-label={`Three parcels on satellite imagery${results ? `, classified: suitable land in blue, unsuitable in orange, recent deforestation in pink; ${SUITABLE}% suitable` : ", their land shared and not yet classified"}.`} className="absolute inset-0">
          {CLASSES.map((c) => (
            <span
              key={c.id}
              className={cn(
                "absolute inset-0 opacity-85 transition-opacity duration-500 [mask-position:center] [mask-repeat:no-repeat] [mask-size:cover]",
                c.layer,
                (!results || !shown[c.id]) && "opacity-0",
              )}
            />
          ))}
        </div>
      </div>

      {/* The design's olive panel, lighter at the top. */}
      <div className="bg-[linear-gradient(to_bottom,#5d5b45,#4b523f)] p-5 sm:p-7">
        <div role="tablist" aria-label="Land suitability" className="grid grid-cols-2 border-b border-white/25 text-center">
          {(["upload", "results"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(TAB, tab === t ? "text-white after:bg-white" : "text-white/75 hover:text-white", FOCUS)}
            >
              {t === "upload" ? "Upload boundary" : "Land suitability"}
            </button>
          ))}
        </div>

        {results ? (
          <div role="tabpanel" aria-label="Land suitability" className="mt-6">
            <h4 className="flex items-center gap-2 font-display text-[26px] leading-none font-bold">
              Results <MdInfoOutline aria-hidden className="size-5" />
            </h4>
            <p className="mt-2 text-[13px] leading-5 text-white/80">Land must be a suitable classification type without recent deforestation.</p>
            <div className="mt-5 flex items-center gap-3">
              <span className="h-3.5 flex-1 overflow-hidden rounded-full bg-white">
                <span key={run} data-reveal="grow-x" className="block h-full w-[35%] rounded-full bg-bn-green" />
              </span>
              <span className="text-[15px] font-bold whitespace-nowrap">{SUITABLE}% suitable</span>
            </div>
            <ul className="mt-5 grid gap-1 text-[14px]">
              {GROUPS.map((g, gi) => {
                const ids = CLASSES.filter((c) => c.group === gi).map((c) => c.id);
                return (
                  <li key={g.label}>
                    <div className="flex items-center gap-3 py-1">
                      <span aria-hidden className="h-5 w-2 rounded-full border border-dashed border-white/70" />
                      <span className="flex-1">{g.label}</span>
                      <span className="text-[13px]">{ha(g.ha)}</span>
                      <Eye on={ids.every((id) => shown[id])} label={g.label.toLowerCase()} onToggle={() => toggle(ids)} />
                    </div>
                    <ul className="grid gap-1 pl-5">
                      {CLASSES.filter((c) => c.group === gi).map((c) => (
                        <li key={c.id} className="flex items-center gap-3 py-1">
                          <span aria-hidden className={cn("h-5 w-2 rounded-full", c.swatch)} />
                          <span className="flex-1">{c.label}</span>
                          <span className="text-[13px]">{ha(c.ha)}</span>
                          <Eye on={shown[c.id]} label={c.label.toLowerCase()} onToggle={() => toggle([c.id])} />
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
            <label className="mt-6 block border-t border-white/20 pt-5 text-[13px] leading-5 text-white/85">
              Please provide any feedback or additional context on the results that you want us to consider.
              <textarea
                value={comment}
                maxLength={2000}
                rows={2}
                onChange={(e) => {
                  setComment(e.target.value);
                  setSaved(false);
                }}
                placeholder="Add commentary here."
                className={cn("mt-2 block w-full resize-none rounded-[14px] border border-white/60 bg-transparent px-4 py-3 text-[14px] text-white placeholder:text-white/70", FOCUS)}
              />
            </label>
            <p className="mt-1 text-[11px] text-white/70">{comment.length}/2000 character count</p>
            <button
              type="button"
              onClick={() => setSaved(true)}
              className={cn("mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-bn-green font-mono text-[14px] tracking-[0.04em] text-bn-heavy uppercase hover:bg-bn-green-light", FOCUS)}
            >
              {saved ? (
                <>
                  Saved <MdCheck aria-hidden className="size-5" />
                </>
              ) : (
                "Save results"
              )}
            </button>
          </div>
        ) : (
          <div role="tabpanel" aria-label="Upload boundary" className="mt-6">
            <h4 className="flex items-center gap-2 font-display text-[26px] leading-none font-bold">
              Share your project area <MdInfoOutline aria-hidden className="size-5" />
            </h4>
            <p className="mt-2 text-[13px] leading-5 text-white/80">Please upload a spatial file for your project area.</p>
            <p className="mt-5 text-[13px] leading-5 text-white/90">
              This tool uses satellite data to help us better understand your project area. Symbiosis will use these results as one part of our broader screening and
              diligence process. We will share the results of the analysis and provide you an opportunity to contextualize the findings, and upload supporting
              documentation.
            </p>
            <p className="mt-5 flex h-12 items-center justify-center gap-2 rounded-full border border-white/70 font-mono text-[14px] uppercase">
              <MdAdd aria-hidden className="size-5" /> 3 parcels added
            </p>
            <button
              type="button"
              onClick={() => {
                setShown(ALL_ON);
                setTab("results");
                setRun((r) => r + 1);
              }}
              className={cn("mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-bn-green font-mono text-[14px] tracking-[0.04em] text-bn-heavy uppercase hover:bg-bn-green-light", FOCUS)}
            >
              Calculate results <MdArrowForward aria-hidden className="size-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
