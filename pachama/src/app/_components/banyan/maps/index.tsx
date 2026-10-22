"use client";

import { useState, type ReactNode } from "react";
import { cn } from "../../cn";
import { Specimen, SpecimenGrid } from "../specimen";
import { ScaleBar, ToolRail } from "./controls";
import { ALERTS } from "./data";
import { ALL_ON, Legend } from "./legend";
import { LiveMap } from "./live-map";
import { Player, type Pick } from "./player";
import { FirePointer } from "./pointer";

/* Maps: Banyan's overlays for the satellite imagery, together on one map
 * and then one by one, on the grey-green the docs set them on. */
const MapGround = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("flex w-full flex-wrap items-center justify-center gap-6 rounded-[12px] bg-bn-glass-3 p-8", className)}>{children}</div>
);

export const MapKit = () => {
  const [layers, setLayers] = useState(ALL_ON);
  const [pick, setPick] = useState<Pick>("all");
  const [playing, setPlaying] = useState(false);
  return (
    <div className="grid gap-12">
      <Specimen
        name="The map, put together"
        note="Legend entries switch their layer, the player walks the years, the pins show their alerts, Home puts it all back. The fires, the clearing and the boundary are illustrative, over Deimos imagery of the Ucayali."
        panelClassName="block"
      >
        <LiveMap />
      </Specimen>
      <SpecimenGrid>
        <Specimen name="Legend" note="Dark glass in the map's corner, a section per layer; the info button says where the data comes from." panelClassName="block">
          <MapGround>
            <Legend layers={layers} onChange={setLayers} />
          </MapGround>
        </Specimen>
        <Specimen name="Player and pointer" note="Play through the years or pick one; hover or focus a fire for its tooltip." panelClassName="block">
          <MapGround className="min-h-48 flex-col">
            <Player pick={pick} onPick={setPick} playing={playing} onPlaying={setPlaying} />
            <span className="relative h-10 w-full">
              <FirePointer alert={ALERTS[1]} className="top-1/2 left-1/3" />
            </span>
          </MapGround>
        </Specimen>
      </SpecimenGrid>
      <Specimen name="Map controls" note="The tool rail, light on a page and dark on a map, and the scale bar." panelClassName="block">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <ToolRail />
          <MapGround className="w-auto">
            <ToolRail dark />
            <ScaleBar onDark />
          </MapGround>
          <ScaleBar />
        </div>
      </Specimen>
    </div>
  );
};
