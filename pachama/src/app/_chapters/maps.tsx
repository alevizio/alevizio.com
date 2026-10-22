import canopyPara from "@/assets/maps/canopy-para.jpg";
import lidarTerrain from "@/assets/maps/lidar-terrain.jpg";
import ndvi from "@/assets/maps/ndvi.jpg";
import pointcloud from "@/assets/maps/pointcloud.jpg";
import sundarbans from "@/assets/maps/sundarbans.jpg";
import tlsScan from "@/assets/maps/tls-scan.jpg";
import ucayali from "@/assets/maps/ucayali.jpg";
import { Clip, HALF, Shot } from "../_components/shot";
import { Band, ChapterDivider, Row, Section, Slot } from "../_components/story";

/* IV · The maps, on black like the renders: satellites, lidar and the
 * dynamic baselines, made legible. The imagery is in Dropbox; the map UI is
 * in Figma (link to ask). */
export const Maps = () => (
  <Band tone="night">
    <ChapterDivider id="maps" numeral="IV" title="The maps">
      Satellites, lidar and machine learning, made legible: the maps that showed buyers what their money was&nbsp;doing.
    </ChapterDivider>

    <Section id="orbit" eyebrow="From orbit" title="Every project, from space">
      <Row>
        <Shot src={sundarbans} alt="Satellite image of the Sundarbans mangrove forest, Bangladesh" sizes={HALF} caption="The Sundarbans, Bangladesh. Deimos Imaging." />
        <Shot src={ucayali} alt="Satellite image of the Ucayali River winding through the Peruvian Amazon" sizes={HALF} caption="The Ucayali River, Peru. Deimos Imaging." />
      </Row>
    </Section>

    <Section
      id="canopy"
      eyebrow="Canopy height"
      title="Measuring trees from space"
      text="Heights estimated from satellite data, trained on airborne lidar."
    >
      <Row>
        <Shot src={canopyPara} alt="A canopy height map of forest in Pará, Brazil, from blue (low) to yellow (tall)" sizes={HALF} caption="Canopy height over Pará, Brazil." />
        <Shot src={lidarTerrain} alt="A lidar terrain model seen at an angle, coloured from blue to red by height" sizes={HALF} caption="A lidar terrain model, coloured by height." />
      </Row>
    </Section>

    <Section id="point-clouds" eyebrow="Point clouds" title="Every tree, in three dimensions">
      <Row>
        <Shot src={pointcloud} alt="A photogrammetry point cloud of a forest canopy in purple and orange" sizes={HALF} caption="A photogrammetry point cloud of the canopy." />
        <Shot src={tlsScan} alt="A terrestrial lidar scan seen from the forest floor, trunks rising in blue and green points" sizes={HALF} caption="A terrestrial lidar scan, from the forest floor." />
      </Row>
    </Section>

    <Section
      id="baselines"
      eyebrow="Dynamic baselines"
      title="A project and its control area"
      text="Each project matched to similar forest outside it, and the two watched side by side over time."
    >
      <Slot label="Manoa and its control area, on a basemap" source="Dropbox /Pachama/manoa_control_area.png · needs a basemap" />
    </Section>

    <Section id="change" eyebrow="Change over time" title="Green, then less green">
      <Shot src={ndvi} alt="A vegetation index map in greens, with cleared land showing darker" caption="Vegetation index (NDVI), around 2020." />
    </Section>

    <Section id="lidar" eyebrow="Lidar" title="Flying through a restored corridor">
      <Clip
        name="lidar-flight"
        label="A flight through the Corridors of Life point cloud, trees in their own colours"
        aspect="aspect-video"
        caption="The Corridors of Life point cloud, in the trees' own colours."
      />
    </Section>

    <Section id="map-ui" eyebrow="The map UI" title="Layers, legends and time">
      <Slot label="The map in the product: layers, legend, the time slider" source="Figma · link to ask" />
    </Section>
  </Band>
);
