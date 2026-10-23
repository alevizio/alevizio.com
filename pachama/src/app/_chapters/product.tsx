import developersIntake from "@/assets/product/developers-intake.jpg";
import evaluationLoading from "@/assets/product/evaluation-loading.jpg";
import landUpload from "@/assets/product/land/1-upload.jpg";
import landDraw from "@/assets/product/land/2-draw.jpg";
import landResults from "@/assets/product/land/3-results.jpg";
import landYield from "@/assets/product/land/4-yield.jpg";
import monitoringCarbon from "@/assets/product/monitoring-carbon.jpg";
import monitoringDashboard from "@/assets/product/monitoring-dashboard.jpg";
import monitoringFireProtanomaly from "@/assets/product/monitoring-fire-protanomaly.jpg";
import monitoringFire from "@/assets/product/monitoring-fire.jpg";
import sourceEvaluation from "@/assets/product/source-evaluation.jpg";
import sourceEventSettings from "@/assets/product/source-event-settings.jpg";
import sourceEvents from "@/assets/product/source-events.jpg";
import sourceSubmissions from "@/assets/product/source-submissions.jpg";
import { cn } from "../_components/cn";
import { Compare } from "../_components/compare";
import { BoundaryUpload } from "../_components/screens/boundary-upload";
import { EvaluationBook } from "../_components/screens/evaluation-book";
import { ManoaFlight } from "../_components/screens/manoa-flight";
import { Insights } from "../_components/screens/insights";
import { OpportunityMap } from "../_components/screens/opportunity-map";
import { PortfolioDashboard } from "../_components/screens/portfolio";
import { ProposalModal, SourcingPlanModal } from "../_components/screens/portfolio-modals";
import { Retirements } from "../_components/screens/retirements";
import { SourcingEvent } from "../_components/screens/sourcing-event";
import { BLEED, HALF, Shot, TallShot } from "../_components/shot";
import { Slider } from "../_components/slider";
import { Band, ChapterDivider, Row, Section } from "../_components/story";

/* II · The product, on the product's own light grey: the marketplace and
 * the tools around it, shown as they were (Alejandro cleared everything
 * from Pachama to be shared as is: client and project names included).
 * The components have their own chapter, III. */

// The supply partner portal's eligibility and yield tool, step by step,
// from the Supply Partner Portal Figma.
const ASSESS = [
  { src: landUpload, alt: "Step 1: Where would you like to create a carbon project? Upload a spatial file of the boundary or draw it on the map, in Brazil, Mexico or the USA" },
  { src: landDraw, alt: "Step 2: drawing the boundary point by point on satellite imagery, then Analyze area" },
  { src: landResults, alt: "Step 3: the results, the country's eligibility, 90% of the land eligible for planting shown in green on the map, and the carbon credit yield estimate" },
  { src: landYield, alt: "Step 4: the credit yield questions opened out, with the cumulative yield over the project's years" },
];

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
      text="Every project and where it is: a list to search and filter on one side, the world on the other. Rebuilt live from the product's Explore and Insights screens with Pachama's projects: filter by type or country, pick one, and the globe turns to it."
    >
      <div data-reveal="frame">
        <Insights />
      </div>
    </Section>

    <Section
      id="project"
      eyebrow="Project pages"
      title="Every credit, checked"
      text="A project's page opens on the project itself: from the whole Earth down to Manoa's forest in Rondônia, in 3D, before its facts, its evaluation, its story and what it does beyond carbon. Its evaluation screen, rebuilt in the new brand, is in the maps chapter."
    >
      <ManoaFlight />
    </Section>

    <Section
      id="criteria"
      eyebrow="Evaluation 2.2"
      title="The criteria, in eight pages"
      text="How Pachama found the highest quality forest carbon projects, written up for buyers: whether the climate benefit is additional, conservative and durable, and what a project does beyond carbon. It turns its own pages while it's in view; the arrows turn them too."
    >
      <EvaluationBook />
    </Section>

    <Section
      id="buying"
      eyebrow="Buying"
      title="From order to retirement"
      text="Every retirement a buyer makes, and the certificate it issues: here, the one Just Spices got for 200 tonnes from Kootznoowoo."
    >
      <Retirements />
    </Section>

    <Section
      id="portfolio"
      eyebrow="Portfolios"
      title="A portfolio, planned"
      text="For buyers with a target: what they hold, mapped and broken down by type, cost, registry and verification; a sourcing plan for what's missing; and the proposals that answer it."
    >
      <PortfolioDashboard />
      <p className="type-caption mt-3 text-(--tone-text)">The portfolio, rebuilt live from its Figma with the design&rsquo;s sample figures. Point at a year or a segment to read it, or retire an order.</p>
      <div className="mt-10 grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
        <SourcingPlanModal />
        <ProposalModal />
      </div>
      <p className="type-caption mt-3 text-(--tone-text)">A buyer&rsquo;s sourcing plan, what to look for and where, and a supplier&rsquo;s proposal answering it. Rebuilt live with the designs&rsquo; sample values.</p>
    </Section>

    <Section
      id="monitoring"
      eyebrow="Monitoring"
      title="Watching over a project"
      text="After the purchase: carbon monitoring against the baseline, forest loss year by year, fire risk by the day, and a dashboard for the rest. The fire reds were checked for colour-blind eyes."
    >
      <Row className="items-start">
        <Shot zoom src={monitoringCarbon} alt="Manoa's carbon monitoring: an update on emissions, the total climate benefit of 2,400,000 tCO2e by year, and observed forest loss on the map with a year player" sizes={HALF} caption="Manoa's carbon monitoring." imageClassName={SCREEN} />
        <Compare
          before={{ src: monitoringFire, alt: "Llanos de Apan's disturbance monitoring: fire risk today, 0 hectares affected, recent fires in red around the project boundary" }}
          after={{ src: monitoringFireProtanomaly, alt: "The same fire-risk map as someone with protanomaly sees it: the fires turn orange but still stand out" }}
          beforeLabel="As designed"
          afterLabel="Protanomaly"
          control="Compare the fire map as designed with how someone with protanomaly sees it"
          caption="Fire risk: today, the last 24 hours, the last week. Drag across: with protanomaly, the reds still read."
          sizes={HALF}
          imageClassName={SCREEN}
        />
      </Row>
      <Row className="mt-6 items-start">
        <TallShot
          src={monitoringDashboard}
          frameClassName={SCREEN}
          label="Llanos de Apan's project dashboard, scrollable"
          sizes={HALF}
          alt="Llanos de Apan's project dashboard: trees planted, survival, costs, milestones, weather, photos from the field and a risk table"
          caption="A project's dashboard, from planting to risk."
        />
        <Shot zoom src={evaluationLoading} alt="An evaluation page loading: grey skeleton blocks where the header, the tabs and the cards will be" sizes={HALF} caption="Before the data comes in, the page holds its shape." imageClassName={SCREEN} />
      </Row>
    </Section>

    <Section
      id="developers"
      eyebrow="Developers"
      title="Bringing projects in"
      text="The other side of the market: landowners and developers. A map of forest carbon potential to start from, a boundary uploaded and checked against satellite data (it plays below, with the live product's figures), and the intake that takes a project from its first details to its land's suitability."
    >
      <div className={cn(BLEED, "mt-2")} data-reveal="frame">
        <OpportunityMap />
      </div>
      <BoundaryUpload />
      <p className="type-body mt-14 max-w-[40rem] text-(--tone-text)">
        The whole tool, from the supply partner portal: upload or draw the land, see how much of it is eligible and why the rest isn&apos;t, then estimate the credits it could yield.
      </p>
      <Slider
        label="The eligibility and yield tool, step by step"
        slides={ASSESS}
        sizes="(min-width: 1024px) 56rem, 90vw"
        item="h-64 sm:h-96 lg:h-[34rem]"
        image="h-full w-auto"
        className="mt-6"
      />
      <div className="mt-6">
        <TallShot
          src={developersIntake}
          frameClassName={SCREEN}
          label="A project's intake, scrollable"
          alt="A project's intake: what's needed, the project details form, and land suitability with the project's parcels on the map"
          caption="Intake, from the requirements to the land."
        />
      </div>
    </Section>

    <Section
      id="sourcing"
      eyebrow="Sourcing"
      title="A sourcing event in one link"
      text="Source generalised what we built for the Symbiosis RFP: any buyer could run its own call for carbon projects, publish what it's looking for in one link, and have developers submit, share their land and see how much of it qualifies. Acme stands in for the buyer. Try it: submit a proposal."
    >
      <div data-reveal="frame">
        <SourcingEvent />
      </div>
      <p className="type-caption mt-3 text-(--tone-text)">The event page a buyer shares, rebuilt live from the design, and the first steps of a submission.</p>
    </Section>

    <Section
      id="screening"
      eyebrow="Screening"
      title="Every submission, screened"
      text="On the buyer's side, projects arrive already checked against satellite data, then move through diligence stage by stage, with the reports beside them."
    >
      <Row className="items-start">
        <Shot
          zoom
          src={sourceEvents}
          alt="Sourcing events: an open reforestation event card with an aerial photo and country flags, and a card to request a new event"
          caption="A buyer's sourcing events, and a way to request a new one."
          sizes={HALF}
          imageClassName={SCREEN}
        />
        <Shot
          zoom
          src={sourceEventSettings}
          alt="Event settings: status, name, description, deadline and support email, then the eligibility criteria as removable chips for countries, project types and registries"
          caption="The event's criteria: countries, project types and the registries it accepts."
          sizes={HALF}
          imageClassName={SCREEN}
        />
      </Row>
      <Row className="mt-6 items-start">
        <Shot
          zoom
          src={sourceSubmissions}
          alt="A table of project submissions: type, location and supplier, screening marked Pass with a priority or Fail, and DMRV core diligence marked No flags"
          caption="Submissions as they come in, with screening and diligence results alongside."
          sizes={HALF}
          imageClassName={SCREEN}
        />
        <Shot
          zoom
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
