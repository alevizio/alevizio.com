import { Specimen } from "../specimen";
import { BrandRamps, Gradients, Roles } from "./colours";
import { Levels } from "./levels";
import { TypeScale } from "./type-scale";

/* Foundations: the type, the colour and the levels everything sits on. */
export const Foundations = () => (
  <>
    <Specimen
      name="Typography"
      span="full"
      note="Chromatic Pro Condensed is the primary voice, Matter the secondary, each from h1 down. Switch the face and the weight."
      panelClassName="block"
    >
      <TypeScale />
    </Specimen>
    <Specimen name="Brand colours" span="wide" note="Eight ramps from lightest to darkest, each with its Banyan name." panelClassName="block">
      <BrandRamps />
    </Specimen>
    <Specimen name="Gradients" span="narrow" note="For hover states, highlights and the brand's spectrum line." panelClassName="block">
      <Gradients />
    </Specimen>
    <Specimen name="Text, glass and fill" span="half" note="Roles rather than raw colours: what a colour is for." panelClassName="block">
      <Roles />
    </Specimen>
    <Specimen
      name="Background levels"
      span="half"
      note="Four levels of elevation, from the page to a drawer. The higher ones are glass: a tint at 30% that blurs what's under it."
      panelClassName="block"
    >
      <Levels />
    </Specimen>
  </>
);
