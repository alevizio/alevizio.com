"use client";

import { cn } from "./cn";
import { BANDS, setView, useGlobeView } from "./globe-store";
import { RAMPS } from "./ramps";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint";

/* The product's visualisation panel, driving the globe: the band, and the
 * colour ramp it is set in. A band opens in its own ramp, the one the
 * render came in. */
export const GlobeControls = ({ className }: { className?: string }) => {
  const view = useGlobeView();
  return (
    <div className={cn("rounded-[12px] border border-rule bg-card/80 p-4 text-mist shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-md", className)}>
      <p className="font-mono text-[11px] tracking-[0.02em]">Editing Visualization</p>
      <p className="mt-3 font-mono text-[9.5px] tracking-[0.04em] text-haze">Band</p>
      <div role="group" aria-label="Band" className="mt-1.5 flex gap-1 rounded-md border border-rule p-0.5">
        {BANDS.map((band) => (
          <button
            key={band.id}
            type="button"
            aria-pressed={view.band === band.id}
            onClick={() => setView({ band: band.id, ramp: band.ramp })}
            className={cn("flex-1 rounded-[4px] px-2 py-1.5 font-mono text-[10px] tracking-[0.06em] uppercase transition-colors", FOCUS, view.band === band.id ? "bg-mist/12 text-mist" : "text-haze hover:text-mist")}
          >
            {band.label}
          </button>
        ))}
      </div>
      <p className="mt-3 font-mono text-[9.5px] tracking-[0.04em] text-haze">Color Ramp</p>
      <div role="group" aria-label="Colour ramp" className="mt-1.5 flex gap-1.5">
        {RAMPS.map((ramp, i) => (
          <button
            key={ramp.name}
            type="button"
            aria-pressed={view.ramp === i}
            aria-label={ramp.name}
            title={ramp.name}
            onClick={() => setView({ ramp: i })}
            className={cn("h-7 flex-1 rounded-[5px] transition-[opacity,box-shadow] duration-300", FOCUS, ramp.css, view.ramp === i ? "ring-2 ring-mint ring-offset-2 ring-offset-card" : "opacity-70 hover:opacity-100")}
          />
        ))}
      </div>
      <p className="mt-2 font-sans text-[11px]">{RAMPS[view.ramp].name}</p>
      <p className="mt-3 font-mono text-[9.5px] tracking-[0.04em] text-haze">Drag the globe to turn it</p>
    </div>
  );
};
