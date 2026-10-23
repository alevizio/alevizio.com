import { Specimen } from "../specimen";
import { AccountMenu, MenuTemplates, MultiSelectMenu, SingleSelectMenu } from "./menu-demos";
import { ModalDemos, ModalStill } from "./modal-demos";
import { PopoverExamples, PopoverPositions } from "./popover-demos";
import { TooltipExamples, TooltipPositions } from "./tooltip-demos";

/* Overlay: what floats over the page. Menus, modals, popovers and tooltips,
 * all on Banyan's glass. */
export const Overlay = () => (
  <>
    <Specimen
      name="Menu"
      span="full"
      note="One pick marked with a check, several picks with checkboxes, or an action. Arrow keys, Home, End and letters move; Escape closes."
     
      panelClassName="min-h-96 items-start gap-x-16 gap-y-8"
    >
      <SingleSelectMenu />
      <MultiSelectMenu />
      <AccountMenu />
    </Specimen>
    <Specimen name="Menu items" span="full" note="The templates, open: with a description, in groups, with a status, with a badge." panelClassName="items-start">
      <MenuTemplates />
    </Specimen>
    <Specimen name="Modal" span="full" note="Four sizes, each with a job from the product. Open them; Escape or any button closes them." panelClassName="flex-col gap-8">
      <ModalStill />
      <ModalDemos />
    </Specimen>
    <Specimen name="Popover" span="half" note="A non-modal dialog in one of eight places around its trigger. Pick one." panelClassName="overflow-x-clip">
      <PopoverPositions />
    </Specimen>
    <Specimen name="Popover, in use" span="half" note="With an icon and a close button; with a link. Escape or a press outside closes them." panelClassName="overflow-x-clip">
      <PopoverExamples />
    </Specimen>
    <Specimen name="Tooltip" span="half" note="Momentary, in eight places around its trigger, shown here all at once.">
      <TooltipPositions />
    </Specimen>
    <Specimen name="Tooltip, in use" span="half" note="A name cut short in a table, a field too narrow for its picks. Hover or tab to them; sample rows.">
      <TooltipExamples />
    </Specimen>
  </>
);
