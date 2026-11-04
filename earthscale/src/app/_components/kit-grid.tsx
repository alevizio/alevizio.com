"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { cn } from "./cn";
import { ExploreStage } from "./kit-explore";
import { PipeStage } from "./kit-pipe";
import { TimeStage } from "./kit-time";
import { IconsStage, RampsStage, type Slot } from "./kit-tiles";
import { useMounted } from "./use-mounted";
import "./stage-look.css";

/* The kit as a ruled grid, the way Stageshow sets a developer page's
 * features: one rounded box, hairlines between the cells, mixed spans.
 *
 *   Tile     Span   Kind        The one thing                            Moves
 *   Explore  2 × 1  Hero UI     pixel information over NDVI farmland      a pointer picks a field, the panel comes in; loops
 *   Ramps    1 × 1  Collection  the five colour ramps, named              they arrive, then a probe sweeps them; loops
 *   Pipe     1 × 1  Diagram     two sources into Earthscale, tiles out    comets draw the lines, the tiles arrive; loops
 *   Time     2 × 1  Component   the layers panel's time slider          steps through the years, dragged on and back; loops
 *   Icons    3 × 1  Collection  the file's Radix icons, going by        the eight the panels use light up; loops
 *
 * Two of five tiles are UI, and only the lead has a pointer. Each picture
 * is its own Stage at 1:1, as big as its cell's slot; the words are page
 * text above it, a bold lead and a quieter rest. */
const TILES: { area: string; lead: string; rest: string; Picture: ComponentType<Slot> }[] = [
  { area: "explore", lead: "Pixel information.", rest: "A point picked on the map, its value and its year.", Picture: ExploreStage },
  { area: "ramps", lead: "Five colour ramps.", rest: "The product's own, on every chip and picker.", Picture: RampsStage },
  { area: "pipe", lead: "Storage in, tiles out.", rest: "The serve diagram, cut to its bones.", Picture: PipeStage },
  { area: "time", lead: "The time slider.", rest: "The layers panel's own, stepping a data set through its years.", Picture: TimeStage },
  { area: "icons", lead: "Radix icons.", rest: "One family across the panels, the ones they use lit.", Picture: IconsStage },
];

// The slot is measured, not assumed: the grid reflows, and a Stage draws
// at its own size.
const Tile = ({ area, lead, rest, Picture, mounted }: (typeof TILES)[number] & { mounted: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [slot, setSlot] = useState<Slot | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);
      setSlot((was) => (was && was.width === width && was.height === height ? was : { width, height }));
    });
    measure.observe(el);
    return () => measure.disconnect();
  }, []);

  return (
    <section className={cn("kit-cell", `kit-cell--${area}`)}>
      <p className="kit-copy">
        <strong>{lead}</strong> {rest}
      </p>
      <div ref={ref} className="kit-pic">
        {mounted && slot ? <Picture width={slot.width} height={slot.height} /> : null}
      </div>
    </section>
  );
};

export const KitGrid = ({ className }: { className?: string }) => {
  const mounted = useMounted();
  return (
    <div data-reveal="frame" className={cn("es-kit", className)}>
      <div className="kit-grid">
        {TILES.map((tile) => (
          <Tile key={tile.area} {...tile} mounted={mounted} />
        ))}
      </div>
    </div>
  );
};
