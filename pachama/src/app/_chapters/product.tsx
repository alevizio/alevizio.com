import appExplore from "@/assets/product/app-explore.jpg";
import appMyProjects from "@/assets/product/app-my-projects.jpg";
import appOrders from "@/assets/product/app-orders.png";
import appRetirements from "@/assets/product/app-retirements.png";
import certificate from "@/assets/product/certificate.jpg";
import evaluation from "@/assets/product/evaluation.png";
import manoaPage from "@/assets/product/manoa-page.jpg";
import sourceEvaluation from "@/assets/product/source-evaluation.jpg";
import sourceEventSettings from "@/assets/product/source-event-settings.jpg";
import sourceEvents from "@/assets/product/source-events.jpg";
import sourceLandResults from "@/assets/product/source-land-results.jpg";
import sourceLandShare from "@/assets/product/source-land-share.jpg";
import sourceLanding from "@/assets/product/source-landing.jpg";
import sourceStart from "@/assets/product/source-start.jpg";
import sourceSubmissions from "@/assets/product/source-submissions.jpg";
import { HALF, Shot, TallShot } from "../_components/shot";
import { Band, ChapterDivider, Row, Section } from "../_components/story";

/* II · The product, on the product's own light grey: the marketplace and
 * the tools around it, shown as they were (Alejandro cleared everything
 * from Pachama to be shared as is: client and project names included).
 * The components have their own chapter, III. */

// A screen lifted off the page: a hairline and a soft shadow.
const SCREEN = "ring-1 ring-black/5 shadow-[0_24px_80px_rgb(20_26_23/0.12)]";

export const Product = () => (
  <Band tone="paper">
    <ChapterDivider id="product" numeral="II" title="The product">
      A marketplace for forest carbon that buyers could trust: every project with its data, its maps and its risks in
      the&nbsp;open.
    </ChapterDivider>

    <Section
      id="marketplace"
      eyebrow="The marketplace"
      title="Finding a project worth buying"
      text="Explore pairs every project with where it is: cards to filter on one side, the globe on the other, its fires marked in red."
    >
      <Shot
        src={appExplore}
        alt="Explore: filters for project type and location, cards for Manoa and Central Kalimantan Peatlands, and a globe of South America with fires in red"
        imageClassName={SCREEN}
      />
    </Section>

    <Section
      id="project"
      eyebrow="Project pages"
      title="Every credit, checked"
      text="Manoa's page, top to bottom: the forest, its facts and registry, the evaluation on the map, its story and what it does beyond carbon. Then the evaluation as it looked before the rebrand."
    >
      <TallShot
        src={manoaPage}
        frameClassName={SCREEN}
        label="Manoa's project page, scrollable"
        alt="Manoa's project page: an aerial hero, the overview with Verra and CCB, a photo gallery, a tech-verified evaluation map of deforestation around the project since 1996, the project story, its impacts on education and biodiversity, its files, and other projects"
        caption="Manoa's page in the product. Scroll inside it."
      />
      <Shot
        src={evaluation}
        alt="Manoa's evaluation page: the project's facts, five quality checks, a reference-region map and a baseline chart, both marked Pass"
        caption="Evaluation 2.0, before the rebrand."
        imageClassName={SCREEN}
        className="mt-10"
      />
    </Section>

    <Section
      id="buying"
      eyebrow="Buying"
      title="From order to retirement"
      text="Orders and retirements, every retirement with a certificate to download, and a buyer's projects with their news."
    >
      <Row className="items-start">
        <Shot src={appOrders} alt="Orders: a table of dates, assets such as Jari 2017 and Manoa 2020, quantities, costs per tonne and status" sizes={HALF} imageClassName={SCREEN} />
        <Shot src={appRetirements} alt="Retirements: dates, credits such as Manoa 2019 and Jari Para 2020, quantities, status and a Download certificate link on each" sizes={HALF} imageClassName={SCREEN} />
      </Row>
      <Row className="mt-6 items-start">
        <Shot
          src={certificate}
          alt="A certificate of authenticity awarded to Just Spices for offsetting 200 tonnes of CO2, from the Kootznoowoo improved forest management project, registered with the American Carbon Registry"
          sizes={HALF}
          caption="The certificate a retirement downloads."
          imageClassName={SCREEN}
        />
        <Shot src={appMyProjects} alt="My projects: cards for Manoa and Central Kalimantan Peatlands with their evaluations and monitoring, beside a feed of project updates" sizes={HALF} caption="A buyer's projects, and the news from them." imageClassName={SCREEN} />
      </Row>
    </Section>

    <Section
      id="sourcing"
      eyebrow="Sourcing"
      title="A sourcing event in one link"
      text="Source generalised what we built for the Symbiosis RFP: any buyer could run its own call for carbon projects, publish what it's looking for, and have developers submit, share their land and see how much of it qualifies. Acme stands in for the buyer."
    >
      <Shot
        src={sourceLanding}
        alt="An event page for Acme Corp's reforestation and agroforestry sourcing event: a description, Submit proposal and Log in buttons, and the eligible countries and project types, beside an aerial photo of forest"
        caption="The event page a buyer shares: what it's sourcing, where, under which standards and by when."
        imageClassName={SCREEN}
      />
      <Row className="mt-6 items-start">
        <Shot
          src={sourceStart}
          alt="A Start your submission dialog over the event page: pick a project from an earlier event, or name a new one"
          caption="Starting a submission, or reusing a project from an earlier event."
          sizes={HALF}
          imageClassName={SCREEN}
        />
        <Shot
          src={sourceLandShare}
          alt="A project's Land suitability tab: a panel asking the developer to share the project area, beside a globe ready for a boundary"
          caption="Sharing the project's boundary, to be checked against satellite data."
          sizes={HALF}
          imageClassName={SCREEN}
        />
      </Row>
    </Section>

    <Section
      id="screening"
      eyebrow="Screening"
      title="Every submission, screened"
      text="On the buyer's side, projects arrive already checked against satellite data, then move through diligence stage by stage, with the reports beside them."
    >
      <Row className="items-start">
        <Shot
          src={sourceEvents}
          alt="Sourcing events: an open reforestation event card with an aerial photo and country flags, and a card to request a new event"
          caption="A buyer's sourcing events, and a way to request a new one."
          sizes={HALF}
          imageClassName={SCREEN}
        />
        <Shot
          src={sourceEventSettings}
          alt="Event settings: status, name, description, deadline and support email, then the eligibility criteria as removable chips for countries, project types and registries"
          caption="The event's criteria: countries, project types and the registries it accepts."
          sizes={HALF}
          imageClassName={SCREEN}
        />
      </Row>
      <Shot
        src={sourceSubmissions}
        alt="A table of project submissions: type, location and supplier, screening marked Pass with a priority or Fail, and DMRV core diligence marked No flags"
        caption="Submissions as they come in, with screening and diligence results alongside."
        className="mt-6"
        imageClassName={SCREEN}
      />
      <Row className="mt-6 items-start">
        <Shot
          src={sourceLandResults}
          alt="Land suitability results: 99% of the area eligible, suitable and unsuitable hectares by reason, beside the project's parcels on satellite imagery coloured by suitability"
          caption="Land suitability: how much of a project's area qualifies, and why the rest doesn't."
          sizes={HALF}
          imageClassName={SCREEN}
        />
        <Shot
          src={sourceEvaluation}
          alt="A project's evaluation results: screening passed with a results spreadsheet, internal commentary, and the DMRV core diligence report open in a viewer"
          caption="Screening, then diligence: each stage's result and the full report in one place."
          sizes={HALF}
          imageClassName={SCREEN}
        />
      </Row>
    </Section>
  </Band>
);
