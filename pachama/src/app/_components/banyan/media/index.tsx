import { Specimen } from "../specimen";
import { IconGrid } from "./icons";

/* Media: the icon set, and what else Banyan carries for pictures. */
export const Media = () => (
  <>
    <Specimen
      name="Icons"
      span="full"
      note="A slice of the set, filtered as you type."
      panelClassName="block"
    >
      <IconGrid />
    </Specimen>
  </>
);
