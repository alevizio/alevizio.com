import lidarTerrain from "@/assets/maps/lidar-terrain.jpg";
import ndvi from "@/assets/maps/ndvi.jpg";
import pointcloud from "@/assets/maps/pointcloud.jpg";
import sundarbans from "@/assets/maps/sundarbans.jpg";
import tlsScan from "@/assets/maps/tls-scan.jpg";
import { SatelliteGlobe } from "../_components/banyan/maps/satellite-globe";
import { WorldFires } from "../_components/banyan/maps/world-fires";
import { FieldGallery } from "../_components/field-gallery";
import { MapLayers } from "../_components/map-layers";
import { BaselineSandbox } from "../_components/screens/baseline-sandbox";
import { Biodiversity } from "../_components/screens/biodiversity";
import { DynamicBaseline } from "../_components/screens/dynamic-baseline";
import { Evaluation } from "../_components/screens/evaluation";
import { Clip, HALF, Shot } from "../_components/shot";
import { Band, ChapterDivider, Row, Section } from "../_components/story";

/* IV · The maps, on black like the renders: satellites, lidar and the
 * dynamic baselines, made legible, and the map's own interface, taken
 * apart and put back together. The imagery is in Dropbox; the Ucayali
 * image is the live map's ground. */
export const Maps = () => (
  <Band tone="night" className="pb-0 sm:pb-0">
    <ChapterDivider id="maps" numeral="IV" title="The maps">
      Satellites, lidar and machine learning, made legible: the maps that showed buyers what their money was&nbsp;doing.
    </ChapterDivider>

    <Section id="orbit" eyebrow="From orbit" title="Every project, from space">
      <Shot src={sundarbans} alt="Satellite image of the Sundarbans mangrove forest, Bangladesh" caption="The Sundarbans, Bangladesh. Deimos Imaging." bleed />
    </Section>

    <Section
      id="on-the-map"
      eyebrow="On the map"
      title="Information, laid over the imagery"
      text="Banyan's map is a stack: the satellite imagery at the bottom, then what the satellites saw, the project's boundary, the alerts and the controls on top. Here it is apart. Scroll, and it goes back together."
    >
      <MapLayers caption="Laid flat, it works: switch a layer in the legend, play the years, open an alert, zoom in. The fires, the clearing and the boundary are illustrative, over Deimos imagery of the Ucayali." />
      <Row className="mt-16 items-center sm:mt-24">
        <figure>
          <SatelliteGlobe />
          <figcaption className="type-caption mt-4 text-center text-(--tone-text)">The minimap: the satellite earth with its fires, in a glow of glacier. Drag it, or send it to a continent.</figcaption>
        </figure>
        <figure>
          <WorldFires />
          <figcaption className="type-caption mt-3 text-(--tone-text)">Where every map starts: the world, with the year&rsquo;s active fires over it.</figcaption>
        </figure>
      </Row>
    </Section>

    <Section
      id="biodiversity"
      eyebrow="Beyond carbon"
      title="Biodiversity, on the map"
      text="Evaluation 2.2 added biodiversity: how much a project's land matters to species at risk, scored against the rest of the world, with the species, the risks and the threats behind the score. Rebuilt live from Borneo Peatlands' screens, over the project's own map: go through it part by part, and the map follows."
    >
      <Biodiversity />
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
      <Row className="mt-6 sm:mt-10">
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
        Later the method got a sandbox, DCAB Freemium, for anyone to try: draw a polygon and see its control area matched pixel by pixel, its
        canopy height over the years and the deduction it forecasts. Rebuilt here on the design&apos;s sample: drag across the blue control
        pixels, and their matches light up inside the polygon.
      </p>
      <div data-reveal="frame" className="mt-8 sm:mt-10">
        <BaselineSandbox />
      </div>
      <p data-reveal className="type-body mt-20 max-w-[36rem] text-(--tone-text) sm:mt-28">
        In the product, a baseline had to pass two checks on Manoa&apos;s evaluation, rebuilt here in Banyan from the screen it had
        before the rebrand: is the reference region suitable, and is the baseline conservative? They draw as they come into view.
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
        bleed
      />
      <FieldGallery />
    </Section>

  </Band>
);
