import canopyPara from "@/assets/maps/canopy-para.jpg";
import lidarTerrain from "@/assets/maps/lidar-terrain.jpg";
import manoaBaseline from "@/assets/maps/manoa-baseline.png";
import manoaEvaluationMap from "@/assets/maps/manoa-evaluation-map.jpg";
import manoaReference from "@/assets/maps/manoa-reference.png";
import ndvi from "@/assets/maps/ndvi.jpg";
import pointcloud from "@/assets/maps/pointcloud.jpg";
import sundarbans from "@/assets/maps/sundarbans.jpg";
import tlsScan from "@/assets/maps/tls-scan.jpg";
import ucayali from "@/assets/maps/ucayali.jpg";
import { LiveMap } from "../_components/banyan/maps/live-map";
import { Clip, HALF, Shot } from "../_components/shot";
import { Band, ChapterDivider, Row, Section } from "../_components/story";

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
      <Row className="items-start">
        <Shot src={manoaReference} alt="Manoa's boundary outlined on satellite imagery, with its reference region's edge in cyan" sizes={HALF} caption="Manoa against its reference region, from its evaluation." />
        <Shot src={manoaBaseline} alt="A chart of credits over time: the baseline Manoa claims rising above the line Pachama estimated, the gap shaded green" sizes={HALF} caption="The baseline the project claims, checked against Pachama's own." />
      </Row>
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

    <Section
      id="map-ui"
      eyebrow="The map UI"
      title="Layers, legends and time"
      text="In the product the map sits inside every project's page: the boundary, the loss around it, and the years to play through. Under it, the same parts rebuilt to try."
    >
      <Shot
        src={manoaEvaluationMap}
        alt="Manoa's tech-verified evaluation: the project boundary in white on satellite imagery, deforestation around it in orange, and a player set to 1996, Project starts"
        caption="Manoa's tech-verified evaluation, in its project page."
      />
      <LiveMap name="The map to try, illustrative" className="mt-10" />
    </Section>
  </Band>
);
