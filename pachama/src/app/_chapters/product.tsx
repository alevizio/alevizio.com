import evaluation from "@/assets/product/evaluation.png";
import ordersEmpty from "@/assets/product/orders-empty.png";
import sourceEvaluation from "@/assets/product/source-evaluation.jpg";
import sourceEventSettings from "@/assets/product/source-event-settings.jpg";
import sourceEvents from "@/assets/product/source-events.jpg";
import sourceLandResults from "@/assets/product/source-land-results.jpg";
import sourceLandShare from "@/assets/product/source-land-share.jpg";
import sourceLanding from "@/assets/product/source-landing.jpg";
import sourceStart from "@/assets/product/source-start.jpg";
import sourceSubmissions from "@/assets/product/source-submissions.jpg";
import { HALF, Shot } from "../_components/shot";
import { Band, ChapterDivider, Row, Section, Slot } from "../_components/story";

/* II · The product, on the product's own light grey: the marketplace and
 * the tools around it. Public-facing screens only; the client's name on the
 * Orders screen is blurred. Source's screens are sample data with Acme as the
 * buyer; project names and a client's name in them are blurred. The
 * components have their own chapter, III. */

// A screen lifted off the page: a hairline and a soft shadow.
const SCREEN = "ring-1 ring-black/5 shadow-[0_24px_80px_rgb(20_26_23/0.12)]";

export const Product = () => (
  <Band tone="paper">
    <ChapterDivider id="product" numeral="II" title="The product">
      A marketplace for forest carbon that buyers could trust: every project with its data, its maps and its risks in
      the&nbsp;open.
    </ChapterDivider>

    <Section id="marketplace" eyebrow="The marketplace" title="Finding a project worth buying">
      <Slot label="Project discovery: the list, the filters, the map" source="Figma · link to ask" />
    </Section>

    <Section
      id="project"
      eyebrow="Project pages"
      title="Every credit, checked"
      text="Manoa's evaluation: five quality checks, the reference region on the map, and the baseline set against what Pachama's satellites saw."
    >
      <Shot
        src={evaluation}
        alt="Manoa's evaluation page: the project's facts, five quality checks, a reference-region map and a baseline chart, both marked Pass"
        imageClassName={SCREEN}
      />
    </Section>

    <Section
      id="buying"
      eyebrow="Buying"
      title="From order to retirement"
      text="Explore, orders, retirement and impact, one account away. Empty, the Orders page points back to the projects."
    >
      <Row>
        <Shot
          src={ordersEmpty}
          alt="The Orders page, empty: 'No orders yet' and a button to explore projects"
          sizes={HALF}
          imageClassName={SCREEN}
        />
        <Slot label="Checkout, and a retirement certificate" source="Figma · link to ask" aspect="aspect-[1440/1024]" />
      </Row>
    </Section>

    <Section
      id="sourcing"
      eyebrow="Sourcing"
      title="A sourcing event in one link"
      text="Source let a buyer run its own call for carbon projects: publish what it's looking for, and developers submit, share their land and see how much of it qualifies. Sample data throughout, with Acme as the buyer."
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
