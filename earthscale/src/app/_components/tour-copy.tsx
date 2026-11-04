import type { CSSProperties } from "react";
import { cn } from "./cn";
import { ICON_ORGS, ICON_TEAMS } from "./page-paths";
import { Words } from "./story";

/* Two of the page's sections live in the tour (tour-page.tsx), in their
 * own px, set the way the file sets them: the proof's quote, which
 * changes, and the who section, which builds itself. They come in the
 * way the case study's own things do (stage-look.css, data-t), once the
 * tour reaches them. */

const after = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

// The quote in its two halves, one after the other (data-quote, a loop
// in stage-look.css), under the one name.
const HALVES = [
  "“Earthscale gave us the building blocks to turn satellite imagery into real-time insights.”",
  "“What used to take weeks now happens in hours — all in the cloud.”",
];

export const TourQuote = () => (
  <>
    <div className="absolute top-[211px] left-20 w-[791px] font-sans text-[28px] leading-[1.4] tracking-[-0.56px] text-mist">
      {HALVES.map((half, i) => (
        <span key={half} data-quote={i ? "b" : "a"} className="absolute inset-x-0 top-0 block">
          <Words>{half}</Words>
        </span>
      ))}
    </div>
    <div data-t="rise" className="absolute top-[360px] left-20" style={after(0.4)}>
      <span className="block font-sans text-[16px] leading-[1.4] text-mist">Diego Saez Gil</span>
      <span className="mt-px block font-mono text-[14px] leading-[1.1] text-dim uppercase">Founder and CEO, Pachama</span>
    </div>
  </>
);

const TAG = "absolute flex h-[34px] items-center rounded-full border border-x-white/20 border-y-white/[0.04] px-5 font-mono text-[14px] leading-none text-mist";
const CARDS = [
  {
    tag: "FOR TEAMS",
    icon: ICON_TEAMS,
    title: "Teams building with geospatial data.",
    text: "Spin up high-performance services for raster & vector data in minutes, explore complex large scale datasets with a click, and ship faster—confidently.",
  },
  {
    tag: "For Organizations",
    icon: ICON_ORGS,
    title: "Organizations pioneering Earth Intelligence.",
    text: "Accelerate R&D, streamline deployment, and reduce overhead—cutting time‑to‑market for your next‑gen Earth Intelligence products.",
  },
];

/** The who section: the tag and the title, then the cards' lines draw,
 *  the cross turns in at their corner, the icons draw and the words come. */
export const TourWho = () => (
  <>
    <span data-t="rise" className={cn(TAG, "top-16 left-20")}>Who</span>
    <div data-t="words" className="absolute top-[126px] left-20 font-sans text-[50px] leading-none tracking-[-1px] whitespace-nowrap text-white" style={after(0.1)}>
      <Words>Made for Geospatial Developers</Words>
    </div>
    <span data-t="grow-x" className="absolute top-[240px] left-20 h-px w-[1280px] bg-white/[0.23]" style={after(0.35)} />
    {[80, 720, 1360].map((x, i) => (
      <span key={x} data-t="grow-y" className="absolute top-[240px] h-[350px] w-px bg-[linear-gradient(rgb(255_255_255/0.32),transparent)]" style={{ left: x, ...after(0.7 + i * 0.12) }} />
    ))}
    <svg data-t="turn" viewBox="0 0 32 32" aria-hidden className="absolute top-[224px] left-[1344px] size-8" style={after(1)}>
      <path d="M15.5 32V0M0 15.5H32" stroke="white" />
    </svg>
    {CARDS.map(({ tag, icon, title, text }, i) => (
      <div key={tag} className="absolute top-[240px] w-[640px]" style={{ left: 80 + i * 640 }}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="absolute top-16 left-8 size-6">
          {icon.map((d, j) => (
            <path key={d} data-t="draw" d={d} pathLength={1} stroke="#a0ffd7" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={after(1.1 + i * 0.2 + j * 0.12)} />
          ))}
        </svg>
        <span data-t="rise" className={cn(TAG, "top-[120px] left-8")} style={after(1.3 + i * 0.2)}>
          {tag}
        </span>
        <div data-t="rise" className="absolute top-[186px] left-8 grid w-[576px] gap-4 font-sans leading-[1.4]" style={after(1.45 + i * 0.2)}>
          <span className="text-[24px] tracking-[-0.48px] whitespace-nowrap text-mint">{title}</span>
          <span className="text-[16px] text-[#ededed]">{text}</span>
        </div>
      </div>
    ))}
  </>
);
