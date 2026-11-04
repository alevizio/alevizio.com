import linear from "@/assets/page/tour/logo-linear.svg";
import pachama from "@/assets/page/tour/logo-pachama.svg";
import vercel from "@/assets/page/tour/logo-vercel.svg";
import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "./cn";
import { ICON_ORGS, ICON_TEAMS } from "./page-paths";
import { Words } from "./story";

/* Two of the page's sections live in the tour (tour-page.tsx), in their
 * own px, set the way the file sets them: the proof's quotes, which take
 * turns with their companies' logos, and the who section, which builds
 * itself. They come in the way the case study's own things do
 * (stage-look.css, data-t), once the tour reaches them. */

const after = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

// The logos in the file's row (64 apart, centred on its 39 px), Vercel's
// moved up beside Pachama's so the next to light is the next along; dim
// but for the one speaking (data-logo, a loop in stage-look.css, in step
// with the quotes).
const LOGOS = [
  { src: pachama, x: 80, y: 124, speaks: "a" },
  { src: vercel, x: 291, y: 134, speaks: "b" },
  { src: linear, x: 453, y: 130, speaks: "none" },
];
// Each quote under its name, one after the other (data-quote).
const QUOTES = [
  {
    key: "a",
    text: "“Earthscale gave us the building blocks to turn satellite imagery into real-time insights. What used to take weeks now happens in hours — all in the cloud.”",
    name: "Diego Saez Gil",
    role: "Founder and CEO, Pachama",
  },
  {
    key: "b",
    text: "“Earthscale is fast, intuitive, and easy to get started with. It keeps you focused on building and makes turning ideas into reality feel effortless.”",
    name: "Guillermo Rauch",
    role: "CEO, Vercel",
  },
];

export const TourQuote = () => (
  <>
    {LOGOS.map(({ src, x, y, speaks }) => (
      <Image key={src.src} src={src} alt="" unoptimized data-logo={speaks} className="absolute max-w-none" style={{ left: x, top: y, width: src.width, height: src.height }} />
    ))}
    {QUOTES.map(({ key, text, name, role }) => (
      <div key={key} data-quote={key}>
        <span data-line className="absolute top-[211px] left-20 w-[791px] font-sans text-[28px] leading-[1.4] tracking-[-0.56px] text-mist">
          <Words>{text}</Words>
        </span>
        <span data-by className="absolute top-[360px] left-20" style={{ "--i": 8 } as CSSProperties}>
          <span className="block font-sans text-[16px] leading-[1.4] text-mist">{name}</span>
          <span className="mt-px block font-mono text-[14px] leading-[1.1] text-dim uppercase">{role}</span>
        </span>
      </div>
    ))}
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

/** The who section's tag and title, rising as it's reached. */
export const TourWhoTitle = () => (
  <>
    <span data-t="rise" className={cn(TAG, "top-16 left-20")}>Who</span>
    <div data-t="words" className="absolute top-[126px] left-20 font-sans text-[50px] leading-none tracking-[-1px] whitespace-nowrap text-white" style={after(0.1)}>
      <Words>Made for Geospatial Developers</Words>
    </div>
  </>
);

/** Its cards building themselves once they're well in view, the way the
 *  kit's tile does (anat-who.tsx): the lines draw, the cross turns in at
 *  their corner, then the icons draw and the words come. */
export const TourWhoCards = () => (
  <>
    <span data-t="grow-x" className="absolute top-[240px] left-20 h-px w-[1280px] bg-white/[0.23]" />
    {[80, 720, 1360].map((x, i) => (
      <span key={x} data-t="grow-y" className="absolute top-[240px] h-[350px] w-px bg-[linear-gradient(rgb(255_255_255/0.32),transparent)]" style={{ left: x, ...after(0.45 + i * 0.12) }} />
    ))}
    <svg data-t="turn" viewBox="0 0 32 32" aria-hidden className="absolute top-[224px] left-[1344px] size-8" style={after(0.7)}>
      <path d="M15.5 32V0M0 15.5H32" stroke="white" />
    </svg>
    {CARDS.map(({ tag, icon, title, text }, i) => (
      <div key={tag} className="absolute top-[240px] w-[640px]" style={{ left: 80 + i * 640 }}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="absolute top-16 left-8 size-6">
          {icon.map((d, j) => (
            <path key={d} data-t="draw" d={d} pathLength={1} stroke="#a0ffd7" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={after(1.1 + i * 0.2 + j * 0.16)} />
          ))}
        </svg>
        <span data-t="rise" className={cn(TAG, "top-[120px] left-8")} style={after(1.3 + i * 0.2)}>
          {tag}
        </span>
        <div data-t="rise" className="absolute top-[186px] left-8 grid w-[576px] gap-4 font-sans leading-[1.4]" style={after(1.48 + i * 0.2)}>
          <span className="text-[24px] tracking-[-0.48px] whitespace-nowrap text-mint">{title}</span>
          <span className="text-[16px] text-[#ededed]">{text}</span>
        </div>
      </div>
    ))}
  </>
);
