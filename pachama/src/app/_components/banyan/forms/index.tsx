import { Bento, Specimen } from "../specimen";
import { CalendarExample, DatePicker } from "./datepicker";
import { ButtonRows, Choices, IconButtons, Inputs, Selects, TextAreas } from "./demos";
import { FileUpload } from "./file-upload";

/* Forms: the ten controls, in Banyan's order, each in the states its docs
 * show. */
export const Forms = () => (
  <Bento>
    <Specimen
      name="Button"
      span="full"
      note="Three tints for the primary action, then secondary and tertiary; three sizes. Hover runs green into glacier, a press cuts the fill back, Tab shows the focus stroke."
      panelClassName="block"
    >
      <ButtonRows />
    </Specimen>
    <Specimen name="Icon button" span="narrow" note="The button's looks on a rounded square, for actions that an icon says better than a word.">
      <IconButtons />
    </Specimen>
    <Specimen name="Input" span="wide" note="One box for every kind of field: plain, with an icon, with help, confirmed, wrong and switched off." panelClassName="block">
      <Inputs />
    </Specimen>
    <Specimen name="Checkbox, radio and switch" span="half" note="Native controls underneath, so keyboards and screen readers get the real thing." panelClassName="block">
      <Choices />
    </Specimen>
    <Specimen name="Select and autocomplete" span="half" note="A list that opens under the field. Arrows move, Enter picks, Escape closes; type to filter the countries." panelClassName="block">
      <Selects />
    </Specimen>
    <Specimen name="Datepicker" span="half" note="Type the date, or open the calendar and move through it with the arrow keys." panelClassName="min-h-[30rem] items-start">
      <DatePicker />
    </Specimen>
    <Specimen name="Calendar" span="half" note="The documentation's own example: October 2021, with the 8th as today.">
      <CalendarExample />
    </Specimen>
    <Specimen name="Textarea" span="narrow" note="The input's box, four lines tall, with the same states." panelClassName="block">
      <TextAreas />
    </Specimen>
    <Specimen name="File upload" span="wide" note="Drop an image or browse for one: it uploads, then fills the zone. It stays in this tab." panelClassName="block">
      <FileUpload className="mx-auto max-w-lg" />
    </Specimen>
  </Bento>
);
