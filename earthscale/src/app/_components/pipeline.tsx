"use client";

import { useRef, type ReactNode } from "react";
import { MdOutlineCloud, MdOutlineStorage } from "react-icons/md";
import { cn } from "./cn";
import { useLoop } from "./use-loop";

/* The serve diagram, as the page draws it, playing itself: the two sources
 * join, a point runs down the line into the client, the call types itself
 * in line by line, a point runs on, and the tile source arrives. Then it
 * starts over. */
const PY = [
  [["kw", "from"], ["id", " earthscale "], ["kw", "import"], ["id", " EarthscaleClient"]],
  [],
  [["kw", "with"], ["id", " EarthscaleClient() "], ["kw", "as"], ["id", " client:"]],
  [["id", "  dataset_id = client.add_dataset("]],
  [["id", "    name="], ["str", "\"My first dataset\""], ["id", ","]],
  [["id", "    url="], ["str", "\"gs://my-data-bucket/my-data.zarr\""], ["id", ","]],
  [["id", "    accelerated="], ["kw", "True"]],
  [["id", "  )"]],
] as const;
const JS = ["sources: {", "  myRaster: {", "    type: 'raster',", "    tiles: [", "      'https://earthscale.ai/raster/{dataset_id}/tiles/{z}/{x}/{y}.webp'", "    ],", "    tileSize: 256", "  }", "}"];
// Sources join, the point runs, the code types, the point runs on, the tiles arrive, hold.
const STEPS = [900, 1400, 2600, 1400, 2400, 1800] as const;

const Window = ({ children, className, on }: { children: ReactNode; className?: string; on: boolean }) => (
  <div className={cn("rounded-[10px] border border-rule bg-night/90 p-4 font-mono text-[10.5px] leading-[1.6] text-mist shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-[11.5px]", on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0", className)}>
    <div className="mb-3 flex gap-1.5 border-b border-rule pb-3">
      <span className="size-2 rounded-full bg-mist/25" />
      <span className="size-2 rounded-full bg-mist/25" />
      <span className="size-2 rounded-full bg-mist/25" />
    </div>
    {children}
  </div>
);

const Source = ({ icon, label }: { icon: ReactNode; label: string }) => (
  <span className="inline-flex h-9 items-center gap-2 rounded-md border border-rule bg-card px-3 font-mono text-[10px] text-mist">
    {label} <span className="text-haze">{icon}</span>
  </span>
);

export const Pipeline = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(ref, STEPS);
  const joined = step >= 0;
  const running = step === 1 || step === 3;
  const typed = step >= 2;
  const tiles = step >= 4;

  return (
    <div ref={ref} className={cn("relative grid gap-0", className)}>
      {/* The sources and the line down. */}
      <div className="relative mx-auto flex w-full max-w-[26rem] justify-between">
        <Source label="Cloud Storage" icon={<MdOutlineCloud className="size-4" />} />
        <Source label="Database" icon={<MdOutlineStorage className="size-4" />} />
      </div>
      <svg viewBox="0 0 416 72" className="mx-auto block w-full max-w-[26rem]" aria-hidden>
        <path d="M60 0 V36 H208 M356 0 V36 H208 M208 36 V72" fill="none" stroke="rgb(230 246 231 / 0.18)" strokeWidth="1" />
        <path d="M60 0 V36 H208 V72" fill="none" stroke="#a0ffd7" strokeWidth="1" pathLength={1} strokeDasharray="1" strokeDashoffset={joined ? 0 : 1} className="transition-[stroke-dashoffset] duration-[1200ms] ease-out" />
        <path d="M356 0 V36 H208 V72" fill="none" stroke="#a0ffd7" strokeWidth="1" pathLength={1} strokeDasharray="1" strokeDashoffset={joined ? 0 : 1} className="transition-[stroke-dashoffset] duration-[1200ms] ease-out" />
        <circle r="3.5" fill="#2bff73" className={cn("transition-opacity duration-300", running ? "opacity-100" : "opacity-0")} style={{ offsetPath: "path('M208 30 V72')", offsetDistance: running ? "100%" : "0%", transition: running ? "offset-distance 1.2s linear, opacity 0.3s" : "opacity 0.3s" }} />
        <circle cx="208" cy="36" r="3" fill="#2bff73" className="motion-safe:animate-[es-pulse_2.4s_ease-in-out_infinite]" />
      </svg>
      <Window on={joined} className="mx-auto w-full max-w-[26rem]">
        <svg viewBox="0 0 24 27.31" className="mb-3 size-5 text-mist" aria-hidden>
          <path d="M2.49597 12.0103C3.22824 11.1572 4.67841 10.7693 6.73207 11.1703C8.74693 11.5638 11.1142 12.6897 13.3144 14.4945C14.2396 15.2534 15.049 16.0616 15.7318 16.8826C16.4335 16.7305 17.0791 16.5366 17.6565 16.3118C16.7982 15.1854 15.7424 14.0899 14.5214 13.0883C12.1271 11.1242 9.4793 9.83491 7.09992 9.37025C4.75934 8.91316 2.43617 9.22417 1.05752 10.8303C-0.321123 12.4365 -0.231015 14.7271 0.635886 16.9011C1.51716 19.1112 3.2758 21.4364 5.67009 23.4004C8.06437 25.3644 10.7122 26.6538 13.0916 27.1184C15.4321 27.5755 17.7553 27.2645 19.134 25.6583C20.2806 24.3225 20.4112 22.5131 19.924 20.6912C19.3618 20.9291 18.7691 21.1397 18.1515 21.3216C18.4896 22.711 18.2845 23.7922 17.6955 24.4784C16.9632 25.3315 15.5131 25.7194 13.4594 25.3183C11.4446 24.9249 9.07726 23.799 6.87708 21.9942C4.67691 20.1894 3.13167 18.1059 2.38541 16.2344C1.62477 14.3269 1.76369 12.8634 2.49597 12.0103Z" fill="currentColor" />
        </svg>
        {PY.map((line, i) => (
          <div key={i} style={{ transitionDelay: typed ? `${i * 220}ms` : "0ms" }} className={cn("min-h-[1.6em] whitespace-pre transition-opacity duration-300", typed ? "opacity-100" : "opacity-0")}>
            {line.map(([kind, text], j) => (
              <span key={j} className={kind === "kw" ? "text-green" : kind === "str" ? "text-mint" : "text-mist"}>
                {text}
              </span>
            ))}
          </div>
        ))}
      </Window>
      <svg viewBox="0 0 416 56" className="mx-auto block w-full max-w-[26rem]" aria-hidden>
        <path d="M208 0 V56" fill="none" stroke="rgb(230 246 231 / 0.18)" strokeWidth="1" />
        <circle r="3.5" fill="#2bff73" className={cn("transition-opacity duration-300", step === 3 ? "opacity-100" : "opacity-0")} style={{ offsetPath: "path('M208 0 V56')", offsetDistance: step === 3 ? "100%" : "0%", transition: step === 3 ? "offset-distance 1.2s linear, opacity 0.3s" : "opacity 0.3s" }} />
      </svg>
      <Window on={tiles} className="w-full sm:ml-[18%] sm:w-[82%]">
        {JS.map((line, i) => (
          <div key={i} style={{ transitionDelay: tiles ? `${i * 120}ms` : "0ms" }} className={cn("whitespace-pre transition-opacity duration-300", tiles ? "opacity-100" : "opacity-0")}>
            {line}
          </div>
        ))}
      </Window>
    </div>
  );
};
