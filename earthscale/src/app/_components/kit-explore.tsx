"use client";

import fields from "@/assets/process/first/fields-band.webp";
import { Chart, Count, Stage, type Act } from "@/stageshow/kit";
import type { Slot } from "./kit-tiles";
import Image from "next/image";
import { MdClose } from "react-icons/md";
import { cn } from "./cn";

/* The kit grid's lead tile: the explorer's pixel information, picked by
 * hand. Sentinel-2 NDVI over farmland (the first pass's fourth layer); the
 * pointer crosses to a bright field and clicks it, a ring marks the point,
 * and the panel comes in from the right, the value rolling up and the
 * year's series drawing. The panel's close takes it away again, and that
 * is the loop. On a narrow tile the panel comes up from below instead. */

type S = { picked: boolean; open: boolean };
const initial: S = { picked: false, open: false };
const poster: S = { picked: true, open: true };

const PANEL_W = 268;
// The NDVI series the panel draws, and the value at the point, from the file.
const SERIES = [6.1, 6.4, 5.9, 6.3, 7.2, 0.4, 6.8, 7.0, 0.6, 6.9, 7.3, 1.1, 6.6, 7.1];
const VALUE = 6.305;
// The bright field the pointer picks, in the picture's own pixels.
const SPOT = { x: 1420, y: 905 };
const SOURCE = { w: 2560, h: 1358 };
const REST = { at: "rest", x: 0.5, y: 0.5 };

async function script(a: Act<S>) {
  await a.wait(400);
  await a.click({ at: "spot", x: 0.5, y: 0.5 });
  await a.set({ picked: true });
  await a.wait(200);
  await a.set({ open: true });
  await a.move(REST);
  await a.wait(3000);
  await a.click({ at: "close", x: 0.5, y: 0.5 });
  await a.set({ open: false, picked: false });
  await a.move(REST);
  await a.wait(500);
}

// Where the picture sits so the bright field lands left of the panel (or
// above it, narrow), with the picture still covering the stage.
const place = (w: number, h: number, narrow: boolean) => {
  const tx = narrow ? w * 0.5 : (w - PANEL_W - 24) * 0.55;
  const ty = narrow ? 68 : h * 0.58;
  // Big enough to cover the stage with the field where it should be.
  const k = Math.max(w / SOURCE.w, (h + 40) / SOURCE.h, (w - tx) / (SOURCE.w - SPOT.x), (h - ty) / (SOURCE.h - SPOT.y));
  const left = Math.min(0, Math.max(w - SOURCE.w * k, tx - SPOT.x * k));
  const top = Math.min(0, Math.max(h - SOURCE.h * k, ty - SPOT.y * k));
  return { k, left, top, spot: { x: left + SPOT.x * k, y: top + SPOT.y * k } };
};

export const ExploreStage = ({ width, height }: Slot) => {
  const narrow = width < 520;
  const { k, left, top, spot } = place(width, height, narrow);
  const panelW = narrow ? width - 48 : PANEL_W;
  const rest = { x: spot.x + (narrow ? -64 : -88), y: spot.y + (narrow ? 24 : 40) };

  return (
    <Stage<S> width={width} height={height} theme="dark" initial={initial} poster={poster} script={script} cursor={{ at: rest, style: "real" }} className="look-earthscale es-explore">
      {(s) => (
        <>
          <div data-cursor="crosshair" className="absolute inset-0">
            <Image src={fields} alt="" sizes="900px" className="absolute max-w-none" style={{ left, top, width: SOURCE.w * k, height: SOURCE.h * k }} />
          </div>
          <span data-target="rest" className="absolute size-8" style={{ left: rest.x - 16, top: rest.y - 16 }} />
          <span data-target="spot" data-cursor="crosshair" className="absolute grid size-10 place-items-center" style={{ left: spot.x - 20, top: spot.y - 20 }}>
            <span className={cn("grid size-[18px] place-items-center rounded-full border-2 border-mint shadow-[0_0_0_4px_rgb(15_19_19/0.35)] transition-[scale,opacity] duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]", s.picked ? "scale-100 opacity-100" : "scale-50 opacity-0")}>
              <span className="size-1.5 rounded-full bg-mint" />
            </span>
          </span>
          <div
            className={cn(
              "absolute rounded-[12px] border border-rule bg-card p-4 text-mist shadow-[0_24px_60px_rgba(0,0,0,0.5)] transition-[translate,opacity] ease-[cubic-bezier(0.25,0.8,0.25,1)] will-change-transform",
              narrow ? "left-6 top-[132px]" : "top-6 right-6",
              s.open ? "translate-x-0 translate-y-0 opacity-100 [transition-duration:800ms,200ms]" : cn("opacity-0 [transition-duration:300ms,250ms]", narrow ? "translate-y-10" : "translate-x-10"),
            )}
            style={{ width: panelW, bottom: -40 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] tracking-[0.02em]">Pixel Information</span>
              <span data-target="close" data-cursor="hand" className="-m-1 grid size-6 place-items-center rounded-md text-haze">
                <MdClose aria-hidden className="size-4" />
              </span>
            </div>
            <div className="mt-2.5 font-sans text-[12px]">Sentinel-2 NDVI</div>
            <div className="mt-1 font-mono text-[10px] text-haze">Intersecting (37.845792, -11.3451)</div>
            <div className="mt-3 grid grid-cols-[1fr_auto] border-t border-rule pt-2.5 font-mono text-[10px]">
              <span className="text-haze">Band</span>
              <span className="text-haze">Value</span>
              <span className="mt-1 text-mist">Ndvi</span>
              <Count value={s.open ? VALUE : 0} format={(n) => n.toFixed(4)} className="mt-1 text-mint" />
            </div>
            <div className="mt-3 font-sans text-[11px]">Time Series</div>
            <Chart data={SERIES} max={8} width={panelW - 34} height={narrow ? 56 : Math.max(92, height - 236)} show={s.open} area dot className="mt-2" />
          </div>
        </>
      )}
    </Stage>
  );
};
