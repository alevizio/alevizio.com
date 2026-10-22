import { ChapterDivider, Section, Slot, SlotRow } from "../_components/story";

/* IV · The maps, on the forest ground: satellites, lidar and the dynamic
 * baselines, made legible. The imagery is in Dropbox; the map UI is in
 * Figma (link to ask). */
export const Maps = () => (
  <div className="mt-40 bg-forest pb-40 pt-1 sm:mt-56">
    <ChapterDivider id="maps" numeral="IV" title="The maps" dark>
      Satellites, lidar and machine learning, made legible: the maps that showed buyers what their money was&nbsp;doing.
    </ChapterDivider>

    <Section id="orbit" eyebrow="From orbit" title="Every project, from space" dark>
      <SlotRow>
        <Slot
          label="The Sundarbans, Bangladesh"
          source="Dropbox /Pachama/Deimos-Imaging-DE1-Sundarban-National-Forest, Bangladesh(zoom).jpg"
          aspect="aspect-[4/3]"
          dark
        />
        <Slot
          label="The Ucayali River, Peru"
          source="Dropbox /Pachama/Deimos-Imaging-DE2-20180621-Ucayali-River-Peru-V2.jpg"
          aspect="aspect-[4/3]"
          dark
        />
      </SlotRow>
    </Section>

    <Section
      id="canopy"
      eyebrow="Canopy height"
      title="Measuring trees from space"
      text="Heights estimated from satellite data, trained on airborne lidar."
      dark
    >
      <SlotRow>
        <Slot label="A lidar scan, by intensity" source="Dropbox /Pachama/tls_intensity_3.png" aspect="aspect-[4/3]" dark />
        <Slot
          label="Lidar over Pará's landscapes"
          source="Dropbox /Pachama/Nature Corridor/Linked Files/lidar_paisagens_para_02.2022.png"
          aspect="aspect-[4/3]"
          dark
        />
      </SlotRow>
    </Section>

    <Section
      id="baselines"
      eyebrow="Dynamic baselines"
      title="A project and its control area"
      text="Each project matched to similar forest outside it, and the two watched side by side over time."
      dark
    >
      <SlotRow>
        <Slot label="Manoa and its control area" source="Dropbox /Pachama/manoa_control_area.png" aspect="aspect-square" dark />
        <Slot
          label="The placebo test: a sample control area"
          source="Dropbox /Pachama/manoa_sample_placebo_control_area.png"
          aspect="aspect-square"
          dark
        />
      </SlotRow>
    </Section>

    <Section id="change" eyebrow="Change over time" title="Green, then less green" dark>
      <Slot label="Vegetation index (NDVI), around 2020" source="Dropbox /Pachama/ndvi_circa2020.png" dark />
    </Section>

    <Section id="lidar" eyebrow="Lidar" title="Flying through a restored corridor" dark>
      <Slot
        label="Drone and lidar over Corridors of Life (if the hero doesn't take it)"
        source="Dropbox /Pachama/DJI_0056.MP4 · /Pachama/corridors-of-life-fazenda-vida-20s.mp4"
        aspect="aspect-[21/9]"
        dark
      />
    </Section>

    <Section id="map-ui" eyebrow="The map UI" title="Layers, legends and time" dark>
      <Slot label="The map in the product: layers, legend, the time slider" source="Figma · link to ask" dark />
    </Section>
  </div>
);
