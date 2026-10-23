import { cn } from "../../cn";
import { BENTO_CARD, SPAN, Specimen } from "../specimen";
import { AccordionItem, Dropdown } from "./accordion";
import { AppFrame } from "./app-frame";
import { Breadcrumb, type Crumb } from "./breadcrumb";
import { KALIMANTAN, LIFECYCLE, MANOA } from "./content";
import { DataPoints } from "./data-points";
import { PortfolioCard, ProjectsByYear, RegionsCard } from "./graphs";
import { HighlightsCard } from "./highlights-card";
import { ProjectCard } from "./project-card";
import { StepperRow, StepperVertical } from "./stepper";
import { SubmissionCard } from "./submission-card";
import { Tabs } from "./tabs";
import { TopNav } from "./top-nav";

/* Patterns: the bigger pieces, put together from the smaller ones, in
 * Banyan's order: navigation, cards, graphs, accordion, stepper,
 * breadcrumb and tabs. */
const CRUMBS: Crumb[] = [
  { label: "Projects", href: "#patterns" },
  { label: "Brazil", href: "#patterns" },
  { label: "Agrocortex" },
];

const Panel = ({ children }: { children: string }) => <p className="max-w-prose pt-4 text-[15px] leading-6 text-bn-medium">{children}</p>;

export const Patterns = () => (
  <>
    <Specimen name="Navigation, the website" span="full" note="The top bar on glass. Solutions opens its menu; with less room the bar folds into the menu button." panelClassName="block p-0 sm:p-0 overflow-hidden">
      <TopNav />
    </Specimen>
    <Specimen name="Navigation, the product" span="full" note="The buyer app's sidebar, at the side of its page: pick a page and the page follows, open a group, or fold it down to its rail." panelClassName="block">
      <AppFrame />
    </Specimen>
    <Specimen name="Project card" span="narrow" note="Manoa as the marketplace lists it: its map, its facts and the evaluation it passed.">
      <ProjectCard />
    </Specimen>
    <Specimen name="Highlights card" span="narrow" note="A project's highlights over its photos, paged. Corredores de Vida, photographed by Pachama.">
      <HighlightsCard />
    </Specimen>
    <Specimen name="Submission card" span="narrow" note="A developer's project working through screening: tick the tasks off and Submit wakes up. A sample project.">
      <SubmissionCard />
    </Specimen>
    <Specimen name="Data points" span="wide" note="One number, its label and a line under it; grouped when several belong together. Sample values.">
      <DataPoints />
    </Specimen>
    <ProjectsByYear className={cn(BENTO_CARD, SPAN.wide)} />
    <PortfolioCard className={cn(BENTO_CARD, SPAN.narrow, "lg:row-span-2")} />
    <RegionsCard className={cn(BENTO_CARD, SPAN.wide)} />
    <Specimen name="Accordion" span="half" note="Cards that open to their fields, one heading and one button each." panelClassName="block">
      <div className="grid gap-3">
        <AccordionItem title="Location" initiallyOpen>
          <Dropdown label="Country" options={["Brazil", "Peru", "Colombia", "Mexico"]} />
        </AccordionItem>
        <AccordionItem title="Project">
          <Dropdown label="Project type" options={["REDD+", "ARR", "IFM"]} />
        </AccordionItem>
      </div>
    </Specimen>
    <Specimen name="Tabs" span="half" note="Arrow keys move between tabs; a dot or a count says something changed." panelClassName="block">
      <Tabs
        label={`${KALIMANTAN.name}, project`}
        items={[
          { label: "Summary", panel: <Panel>{`${KALIMANTAN.area} in ${KALIMANTAN.country}, ${KALIMANTAN.type}.`}</Panel> },
          { label: "Evaluation", status: true, panel: <Panel>{MANOA.about}</Panel> },
          { label: "Documents", count: 4, panel: <Panel>The project description, its validation and two monitoring reports. Sample files.</Panel> },
          { label: "Monitoring", disabled: true, panel: <Panel>Not yet.</Panel> },
        ]}
      />
    </Specimen>
    <Specimen name="Stepper" span="full" note="A developer's way through Pachama, from screening to earning credits: big, small and with each step's copy." panelClassName="min-w-0 flex-col items-start gap-8">
      <StepperRow steps={LIFECYCLE} current={1} label="Project lifecycle" className="flex-wrap gap-y-3" />
      <StepperRow steps={LIFECYCLE} current={1} size="small" showNext label="Project lifecycle, small" />
      <StepperVertical steps={LIFECYCLE} current={1} label="Project lifecycle, with copy" />
    </Specimen>
    <Specimen name="Breadcrumb" span="narrow" note="Where a page sits, with three separators: a slash, a dash and an arrow." panelClassName="flex-col items-start gap-4">
      <Breadcrumb items={CRUMBS} />
      <Breadcrumb items={CRUMBS} separator="dash" label="Breadcrumb, dashes" />
      <Breadcrumb items={CRUMBS} separator="icon" label="Breadcrumb, arrows" />
    </Specimen>
  </>
);
