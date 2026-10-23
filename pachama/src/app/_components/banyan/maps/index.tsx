import { Specimen } from "../specimen";
import { ScaleBar, ToolRail } from "./controls";
import { LiveMap } from "./live-map";

/* Maps: Banyan's overlays for the satellite imagery, put together on one
 * map to use (the legend, the player, the pins and the dark controls all
 * live there), then the controls in their light form, as a page shows them. */
export const MapKit = () => (
  <div className="grid gap-16">
    <Specimen
      name="The map, put together"
      note="Legend entries switch their layer, the player walks the years, the pins show their alerts, Home puts it all back. The fires, the clearing and the boundary are illustrative, over Deimos imagery of the Ucayali."
      panelClassName="block"
    >
      <LiveMap />
    </Specimen>
    <Specimen name="Map controls, on a page" note="The tool rail and the scale bar, light; over the map above they turn dark.">
      <ToolRail />
      <ScaleBar />
    </Specimen>
  </div>
);
