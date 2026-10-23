"use client";

import basemap from "@/assets/maps/ucayali.jpg";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { cn } from "../../cn";
import { Specimen } from "../specimen";
import { BN } from "../ui";
import { ScaleBar, ToolRail, Zoom } from "./controls";
import { ALERTS } from "./data";
import { ALL_ON, Legend } from "./legend";
import { LiveMap } from "./live-map";
import { Player, type Pick } from "./player";
import { FirePointer } from "./pointer";
import { SatelliteGlobe } from "./satellite-globe";

/* Maps: everything Banyan's map page documents, live. The map put
 * together; then each piece on its own over a slice of satellite imagery:
 * the legend, the player, the fire pins and their tooltip, the controls
 * light and dark; the minimap globe; and the world with its fires. */
const OnMap = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("relative grid min-h-56 w-full place-items-center overflow-hidden rounded-[16px] bg-[#0e2517] p-6", className)}>
    <Image src={basemap} alt="" fill sizes="(min-width: 1024px) 420px, 90vw" className="object-cover opacity-55" />
    <div className="relative">{children}</div>
  </div>
);

const WorldFires = () => {
  const [fires, setFires] = useState(true);
  return (
    <div className="grid w-full gap-4">
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-[16px] bg-[#0b1630]">
        {/* eslint-disable-next-line @next/next/no-img-element -- the Figma's own satellite world, a static texture */}
        <img src="/screens/earth.jpg" alt="The world from space, the satellite basemap Banyan's maps start from" className="absolute inset-0 size-full object-cover" />
        {/* eslint-disable-next-line @next/next/no-img-element -- the fire layer that goes over it */}
        <img
          src="/screens/fires.png"
          alt=""
          className={cn("absolute inset-0 size-full object-cover mix-blend-screen transition-opacity duration-700 [filter:hue-rotate(-40deg)_saturate(3)]", fires ? "opacity-100 motion-safe:animate-pulse" : "opacity-0")}
        />
      </div>
      <label className="flex items-center gap-3 text-[14px] leading-5 text-bn-heavy">
        <input type="checkbox" checked={fires} onChange={(e) => setFires(e.target.checked)} className={cn("size-4 accent-[#0e2517]", BN.focus)} />
        Show active fires
      </label>
    </div>
  );
};

export const MapKit = () => {
  const [layers, setLayers] = useState(ALL_ON);
  const [pick, setPick] = useState<Pick>("all");
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(3);

  return (
    <>
      <Specimen
        name="The map, put together"
        span="full"
        note="Legend entries switch their layer, the player walks the years, the pins show their alerts, Home puts it all back. The fires, the clearing and the boundary are illustrative, over Deimos imagery of the Ucayali."
        panelClassName="block"
      >
        <LiveMap />
      </Specimen>
      <Specimen name="Globe" span="narrow" note="The minimap: the satellite earth with its fires, ringed in glacier. Drag it, or send it to a continent.">
        <SatelliteGlobe />
      </Specimen>
      <Specimen name="The world, burning" span="wide" note="The satellite basemap the maps start from, with the year's active fires over it.">
        <WorldFires />
      </Specimen>
      <Specimen name="Legend" span="narrow" note="Dark glass in the map's corner, a section per layer; the info button says where the data comes from." panelClassName="block">
        <OnMap>
          <Legend layers={layers} onChange={setLayers} />
        </OnMap>
      </Specimen>
      <Specimen name="Player" span="narrow" note="Play through the years, or pick one." panelClassName="block">
        <OnMap>
          <Player pick={pick} onPick={setPick} playing={playing} onPlaying={setPlaying} />
        </OnMap>
      </Specimen>
      <Specimen name="Fire alerts" span="narrow" note="A pin per fire; hover or focus one for its tooltip." panelClassName="block">
        <OnMap>
          <span className="relative block h-28 w-64">
            <FirePointer alert={ALERTS[0]} className="top-1/3 left-1/4" />
            <FirePointer alert={ALERTS[1]} className="top-2/3 left-2/3" tipSide="left" />
          </span>
        </OnMap>
      </Specimen>
      <Specimen name="Controls" span="half" note="The tool rail and zoom, light on a page and dark on a map; the scale bar in kilometres and miles.">
        <div className="flex w-full flex-wrap items-center justify-center gap-6">
          <ToolRail />
          <Zoom onIn={() => setZoom((z) => Math.min(6, z + 1))} onOut={() => setZoom((z) => Math.max(1, z - 1))} canIn={zoom < 6} canOut={zoom > 1} />
          <ScaleBar />
        </div>
      </Specimen>
      <Specimen name="Controls, on a map" span="half" note="The same pieces in their dark form, over the imagery." panelClassName="block">
        <OnMap>
          <span className="flex items-center gap-6">
            <ToolRail dark />
            <ScaleBar onDark />
          </span>
        </OnMap>
      </Specimen>
    </>
  );
};
