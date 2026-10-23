import lidarTerrain from "@/assets/maps/lidar-terrain.jpg";
import ndvi from "@/assets/maps/ndvi.jpg";
import pointcloud from "@/assets/maps/pointcloud.jpg";
import sundarbans from "@/assets/maps/sundarbans.jpg";
import tlsScan from "@/assets/maps/tls-scan.jpg";
import { DynamicBaseline } from "../_components/screens/dynamic-baseline";
import { Evaluation } from "../_components/screens/evaluation";
import { Clip, HALF, Shot } from "../_components/shot";
import { Band, ChapterDivider, Row, Section } from "../_components/story";

/* IV · The maps, on black like the renders: satellites, lidar and the
 * dynamic baselines, made legible. The imagery is in Dropbox. The map's
 * interface isn't repeated here: it's in the project page (II) and live in
 * Banyan's maps (III); the Ucayali image is the live map's ground. */
export const Maps = () => (
  <Band tone="night">
    <ChapterDivider id="maps" numeral="IV" title="The maps">
      Satellites, lidar and machine learning, made legible: the maps that showed buyers what their money was&nbsp;doing.
    </ChapterDivider>

    <Section id="orbit" eyebrow="From orbit" title="Every project, from space">
      <Shot src={sundarbans} alt="Satellite image of the Sundarbans mangrove forest, Bangladesh" caption="The Sundarbans, Bangladesh. Deimos Imaging." bleed />
    </Section>

    <Section
      id="canopy"
      eyebrow="Canopy height"
      title="Measuring trees from space"
      text="Heights estimated from satellite data, trained on airborne lidar."
    >
      <Clip
        name="canopy-mist"
        label="A drone glides low over unbroken rainforest canopy, wisps of cloud drifting through the trees"
        aspect="aspect-[1920/800]"
        caption="The canopy itself, from a drone, under low cloud."
        bleed
      />
      <Row className="mt-6 sm:mt-10">
        <Clip name="terrain" label="The lidar elevation of Fazenda Vida, Brazil, turning slowly" aspect="aspect-[1600/930]" caption="Fazenda Vida, Brazil: lidar elevation, Corridors of Life." />
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
      text="A static baseline is a guess, made once, of how much forest a project would otherwise lose. A dynamic one keeps measuring: it finds the forest's twin outside the project, watches the two side by side every year, and counts only the difference."
    >
      <Clip
        name="forest-edge"
        label="A drone flies over rainforest to its edge, where pasture still full of stumps runs out to a farm"
        aspect="aspect-video"
        caption="Where the forest stops: pasture still full of stumps, from a drone. A baseline puts a number on how fast that edge moves."
        bleed
      />
      <DynamicBaseline className="mt-20 sm:mt-28" />
      <p data-reveal className="type-body mt-20 max-w-[36rem] text-(--tone-text) sm:mt-28">
        In the product, it all came down to one screen: Manoa&apos;s evaluation, rebuilt in Banyan from the one it had before the
        rebrand. Pick a standard, and watch the checks draw.
      </p>
      <div data-reveal="frame" className="mt-8 sm:mt-10">
        <Evaluation />
      </div>
    </Section>

    <Section
      id="change"
      eyebrow="Change over time"
      title="Watching the land change"
      text="Satellite history, frame by frame: reforestation projects in Uruguay, outlined in red, filling in with green over the years. Beside it, a vegetation index, where cleared land shows darker."
    >
      <Row className="items-start">
        <Clip
          name="uruguay-timelapse"
          label="A satellite timelapse of Uruguay: reforestation projects outlined in red grow greener year by year"
          aspect="aspect-[744/512]"
          caption="Reforestation in Uruguay, year by year."
        />
        <Shot src={ndvi} alt="A vegetation index map in greens, with cleared land showing darker" sizes={HALF} caption="Vegetation index (NDVI), around 2020." />
      </Row>
    </Section>

    <Section id="lidar" eyebrow="Lidar" title="Flying through a restored corridor">
      <Clip
        name="lidar-flight"
        label="A flight through the Corridors of Life point cloud, trees in their own colours"
        aspect="aspect-video"
        caption="The Corridors of Life point cloud, in the trees' own colours."
        bleed
      />
    </Section>

  </Band>
);
