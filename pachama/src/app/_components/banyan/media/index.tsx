import { Specimen } from "../specimen";
import { IconGrid } from "./icons";

/* Media: the icon set, and what else Banyan carries for pictures. */
export const Media = () => (
  <div className="grid gap-12">
    <Specimen
      name="Icons"
      note="A slice of the set, filtered as you type."
      panelClassName="block"
    >
      <IconGrid />
    </Specimen>
  </div>
);
